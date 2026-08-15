"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_IMAGES } from "@/lib/gallery";
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
  gallery = false,
}: {
  siteId: string;
  name: ImageFieldName;
  label: string;
  gallery?: boolean;
}) {
  const { control } = useFormContext<SiteConfig>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [galleryOpen, setGalleryOpen] = useState(false);

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
              {gallery && (
                <button
                  type="button"
                  className="text-[#b3402a] hover:underline"
                  onClick={() => setGalleryOpen(true)}
                >
                  Gallery
                </button>
              )}
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
          {galleryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
              <div className="w-full max-w-lg rounded-xl bg-[#faf6ef] p-5 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Choose from the gallery</h3>
                  <button
                    type="button"
                    aria-label="Close gallery"
                    onClick={() => setGalleryOpen(false)}
                    className="text-[#2a2118]/50 hover:text-[#2a2118]"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                  {GALLERY_IMAGES.map((img) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => {
                        field.onChange(img.src);
                        setGalleryOpen(false);
                      }}
                      className={`group relative overflow-hidden rounded-lg border-2 transition-colors ${
                        field.value === img.src
                          ? "border-[#b3402a]"
                          : "border-transparent hover:border-[#b3402a]/50"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- local gallery asset */}
                      <img
                        src={img.src}
                        alt={img.label}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1 pt-4 text-left text-[11px] font-medium text-white">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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
