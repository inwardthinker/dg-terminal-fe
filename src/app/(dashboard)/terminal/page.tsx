type TerminalPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function TerminalPage({ searchParams }: TerminalPageProps) {
  const sp = await searchParams;
  const raw = sp.q;
  const q = Array.isArray(raw) ? raw[0] : raw;

  return (
    <main className="min-h-[50vh] bg-bg-0 px-sp5 py-sp6 sm:px-sp7">
      <h1 className="text-title mb-sp4">Terminal</h1>
      {q ? (
        <p className="text-secondary">
          Search query: <span className="text-t-1 font-mono text-[13px]">{q}</span>
        </p>
      ) : (
        <p className="text-support">Use the search control to open a query here.</p>
      )}
    </main>
  );
}
