import { Suspense } from "react";
import ReportDetailClient from "@/components/reports/ReportDetailClient";
import { RefreshCw } from "lucide-react";

export function generateStaticParams() {
  return [
    { id: "run-101" },
    { id: "run-102" },
    { id: "run-103" },
    { id: "run-104" },
    { id: "run-3115" },
    { id: "run-201" },
    { id: "run-202" },
    { id: "run-203" },
  ];
}

async function ReportDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportDetailClient id={id} />;
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading execution report details...</span>
        </div>
      }
    >
      <ReportDetailContent params={params} />
    </Suspense>
  );
}
