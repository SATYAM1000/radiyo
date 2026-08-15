"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  email: string;
  avatarUrl?: string | null;
}

export function UserMenu({ email, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center rounded-full ring-[#b3402a] transition-shadow hover:ring-2"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- OAuth provider avatar URL
          <img
            src={avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b3402a] text-sm font-semibold uppercase text-[#faf6ef]">
            {email.charAt(0)}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-xl border border-[#2a2118]/10 bg-white shadow-lg">
          <p className="truncate border-b border-[#2a2118]/10 px-4 py-3 text-sm text-[#2a2118]/70">
            {email}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[#2a2118] transition-colors hover:bg-[#2a2118]/5"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
