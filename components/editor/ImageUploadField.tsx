"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import type { SiteConfig } from "@/lib/site-config";

type ImageFieldName = "images.hero" | "images.logo" | "images.background";

const MAX_DIMENSION = 1920;

// Resize/compress in the browser so free-tier storage and egress stay sane.
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("compress failed"))),
      "image/webp",
      0.85,
    ),
  );
}

export function ImageUploadField({
  siteId,
  name,
  label,
}: {
  siteId: string;
  name: ImageFieldName;
  label: string;
}) {
  const { control } = useFormContext<SiteConfig>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          {field.value ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote storage URL
            <img
              src={field.value}
              alt=""
              className="h-12 w-12 shrink-0 rounded-md border border-[#2a2118]/15 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-dashed border-[#2a2118]/25 text-[#2a2118]/30">
              <ImageIcon size={18} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{label}</p>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                className="text-[#b3402a] hover:underline"
                onClick={() => inputRef.current?.click()}
                disabled={status === "uploading"}
              >
                {status === "uploading"
                  ? "Uploading…"
                  : field.value
                    ? "Replace"
                    : "Upload"}
              </button>
              {field.value && (
                <button
                  type="button"
                  className="text-[#2a2118]/50 hover:underline"
                  onClick={() => field.onChange(null)}
                >
                  Remove
                </button>
              )}
              {status === "error" && (
                <span className="text-red-700">Upload failed — try again</span>
              )}
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setStatus("uploading");
              try {
                const supabase = createClient();
                const {
                  data: { user },
                } = await supabase.auth.getUser();
                if (!user) throw new Error("not signed in");

                const blob = await compressImage(file);
                const kind = name.split(".")[1];
                const path = `${user.id}/${siteId}/${kind}-${Date.now()}.webp`;
                const { error } = await supabase.storage
                  .from("site-assets")
                  .upload(path, blob, { contentType: "image/webp" });
                if (error) throw error;

                const { data } = supabase.storage
                  .from("site-assets")
                  .getPublicUrl(path);
                field.onChange(data.publicUrl);
                setStatus("idle");
              } catch {
                setStatus("error");
              }
            }}
          />
        </div>
      )}
    />
  );
}
