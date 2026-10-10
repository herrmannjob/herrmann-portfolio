import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-center">
      <div>
        <p className="font-mono text-sm text-mint">error: pathspec did not match any file(s) known to git</p>
        <h1 className="display mt-4 text-[30vw] text-leaf sm:text-[14rem]">404</h1>
        <Link href="/" className="btn-primary mt-6">cd ~</Link>
      </div>
    </main>
  );
}
