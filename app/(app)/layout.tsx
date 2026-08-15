import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";

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
        <UserMenu
          email={user.email ?? ""}
          avatarUrl={
            (user.user_metadata?.avatar_url as string | undefined) ??
            (user.user_metadata?.picture as string | undefined)
          }
        />
      </header>
      {children}
    </div>
  );
}
