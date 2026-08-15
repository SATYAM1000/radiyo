import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    // Viewport-locked shell: pages scroll their own panes, never the window.
    <div className="flex h-svh flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-[#2a2118]/10 px-6 py-3">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#2a2118]/50">{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
