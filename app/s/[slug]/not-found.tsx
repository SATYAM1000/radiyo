export default function SiteNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-5xl">📻</p>
      <h1 className="text-2xl font-bold">This frequency is silent</h1>
      <p className="max-w-sm text-[#2a2118]/60">
        There&apos;s no radio broadcasting at this address. It may have been
        unpublished, or it never existed.
      </p>
      <a
        href={`${process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes("lvh.me") ? "http" : "https"}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
        className="mt-2 rounded-md bg-[#b3402a] px-4 py-2 text-sm font-medium text-[#faf6ef] hover:bg-[#9a3624]"
      >
        Start your own rediyo
      </a>
    </main>
  );
}
