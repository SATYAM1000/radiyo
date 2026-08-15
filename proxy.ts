import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const config = {
  matcher: [
    "/((?!_next/|api/|s/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|css|js|txt|xml|map)).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN!.split(":")[0].toLowerCase();

  if (host === `www.${root}`) {
    return NextResponse.redirect(
      new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${root}`),
      308,
    );
  }

  if (host !== root && host.endsWith(`.${root}`)) {
    const sub = host.slice(0, -(root.length + 1));
    if (sub && !sub.includes(".")) {
      const url = req.nextUrl.clone();
      url.pathname = `/s/${sub}${req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Root domain (and unknown hosts, e.g. *.vercel.app previews): run the app
  // and keep the Supabase session fresh.
  return updateSession(req);
}
