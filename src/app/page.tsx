import { DataFlowDiagram } from '@/components/data-flow/FlowChart';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Data-Fluxogram</h1>
      <div className="w-full h-[600px]">
        <DataFlowDiagram />
      </div>
    </main>
  );
}