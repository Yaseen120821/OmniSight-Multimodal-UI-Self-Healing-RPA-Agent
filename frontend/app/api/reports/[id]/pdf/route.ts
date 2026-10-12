import { NextRequest } from "next/server";
import { getTestRunById, initialTestRuns } from "@/lib/store";
import { createTestRunPdfDocument } from "@/lib/pdf-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const testRun = getTestRunById(id) || initialTestRuns.find((r) => r.id === id);

  if (!testRun) {
    return new Response(
      JSON.stringify({ error: "Test run not found", id }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const doc = createTestRunPdfDocument(testRun);
  const arrayBuffer = doc.output("arraybuffer");
  const filename = `OmniSight-${testRun.id}.pdf`;

  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
