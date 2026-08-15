"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const authError = searchParams.get("error");

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setStatus(error ? "error" : "sent");
  }

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-[#2a2118]/50 hover:underline">
          ← back
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Sign in to Rediyo</h1>
        <p className="mt-1 text-sm text-[#2a2118]/60">
          We&apos;ll email you a magic link — no password needed.
        </p>

        {status === "sent" ? (
          <p className="mt-8 rounded-md border border-green-700/30 bg-green-700/5 p-4 text-sm text-green-900">
            Check your inbox — we sent a sign-in link to{" "}
            <strong>{email}</strong>.
          </p>
        ) : (
          <form onSubmit={signInWithEmail} className="mt-8 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send magic link"}
            </Button>
            {(status === "error" || authError) && (
              <p className="text-sm text-red-700">
                Something went wrong signing you in. Please try again.
              </p>
            )}
          </form>
        )}

        <div className="my-6 flex items-center gap-3 text-xs text-[#2a2118]/40">
          <span className="h-px flex-1 bg-[#2a2118]/15" />
          or
          <span className="h-px flex-1 bg-[#2a2118]/15" />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={signInWithGoogle}
        >
          Continue with Google
        </Button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
