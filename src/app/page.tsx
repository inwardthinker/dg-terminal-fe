import { SummaryPanelContainer } from "@/features/open-positions";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-0 px-sp8x py-sp8y">
      <section className="flex w-1/2 flex-col gap-sp6 rounded-r7 border border-line-c bg-bg-1 p-sp5">

        <h1 className="text-title">
          DG Terminal Frontend Homepage
        </h1>

        <p className="text-secondary bg-bg-2 p-sp3 rounded-r4">
          Design-system foundation using centralized CSS variables and Tailwind token mapping.
        </p>

        {/* Category example */}
        <div className="flex items-center gap-sp3">
          <span className="w-2 h-2 rounded-full bg-orange" />
          <span className="text-support">Category: Emerging Markets</span>
        </div>

        {/* Exposure bar */}
        <div className="w-full bg-bg-2 rounded-r2 h-2">
          <div className="bg-orange h-full w-1/3 rounded-r2" />
        </div>


        <SummaryPanelContainer />
      </section>
    </main>
  );
}