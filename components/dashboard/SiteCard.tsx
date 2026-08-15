"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteSite } from "@/app/(app)/editor/[siteId]/actions";
import { Button } from "@/components/ui/Button";

interface Site {
  id: string;
  slug: string;
  name: string;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
}

export function SiteCard({ site, domain }: { site: Site; domain: string }) {
  const [pending, startTransition] = useTransition();
  const host = `${site.slug}.${domain}`;
  const protocol = domain.includes("lvh.me") ? "http" : "https";
  const hasUnpublishedChanges =
    site.is_published &&
    site.published_at !== null &&
    new Date(site.updated_at) > new Date(site.published_at);

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-[#2a2118]/10 bg-white/60 px-5 py-4">
      <div className="min-w-0">
        <p className="truncate font-medium">{site.name}</p>
        <p className="truncate font-mono text-sm text-[#2a2118]/50">{host}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {site.is_published ? (
          <span className="rounded-full bg-green-700/10 px-2.5 py-0.5 text-xs font-medium text-green-800">
            {hasUnpublishedChanges ? "live · unpublished changes" : "live"}
          </span>
        ) : (
          <span className="rounded-full bg-[#2a2118]/8 px-2.5 py-0.5 text-xs text-[#2a2118]/60">
            draft
          </span>
        )}
        {site.is_published && (
          <a
            href={`${protocol}://${host}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2a2118]/60 hover:underline"
          >
            View
          </a>
        )}
        <Link
          href={`/editor/${site.id}`}
          className="rounded-md bg-[#b3402a] px-3 py-1.5 text-sm font-medium text-[#faf6ef] hover:bg-[#9a3624]"
        >
          Edit
        </Link>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => {
            if (confirm(`Delete "${site.name}"? This can't be undone.`)) {
              startTransition(() => deleteSite(site.id));
            }
          }}
        >
          {pending ? "…" : "Delete"}
        </Button>
      </div>
    </li>
  );
}
