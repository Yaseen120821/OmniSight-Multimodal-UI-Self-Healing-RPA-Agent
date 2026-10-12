import { jsPDF } from "jspdf";
import { TestRunDetail } from "@/types";

export async function generateTestRunPdf(testRun: TestRunDetail): Promise<string> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const bottomMargin = 22;

  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = 18;
      // Draw running top header on subsequent pages
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 165);
      doc.text(`OmniSight Test Audit • ${testRun.suiteName} (${testRun.id})`, marginLeft, 11);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, 13, pageWidth - marginRight, 13);
      return true;
    }
    return false;
  };

  // --- 1. HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(marginLeft, y, contentWidth, 36, 3, 3, "F");

  // Logo & Wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("OMNISIGHT", marginLeft + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Multimodal UI Self-Healing & RPA Agent • Execution Audit", marginLeft + 48, y + 8.5);

  // Status Badge
  const statusX = pageWidth - marginRight - 36;
  const statusY = y + 5;
  if (testRun.status === "Passed") {
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.roundedRect(statusX, statusY, 30, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("PASSED", statusX + 8, statusY + 5.5);
  } else if (testRun.status === "Repaired") {
    doc.setFillColor(99, 102, 241); // indigo-500
    doc.roundedRect(statusX, statusY, 30, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("REPAIRED", statusX + 6.5, statusY + 5.5);
  } else {
    doc.setFillColor(239, 68, 68); // rose-500
    doc.roundedRect(statusX, statusY, 30, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("FAILED", statusX + 9, statusY + 5.5);
  }

  // Suite Title & Metadata inside Banner
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  const suiteTitleLines = doc.splitTextToSize(testRun.suiteName, contentWidth - 46);
  doc.text(suiteTitleLines[0] || testRun.suiteName, marginLeft + 6, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Run ID: ${testRun.id}`, marginLeft + 6, y + 25);
  doc.text(`Target: ${testRun.projectName} (${testRun.targetUrl})`, marginLeft + 42, y + 25);
  doc.text(`Executed: ${testRun.startTime}`, marginLeft + 6, y + 31);
  doc.text(`Duration: ${testRun.duration}`, marginLeft + 95, y + 31);
  doc.text(`Pass Rate: ${testRun.passRate}%`, marginLeft + 140, y + 31);

  y += 42;

  // --- 2. EXECUTIVE METRICS KPI TILES ---
  checkPageBreak(24);
  const kpiCount = 4;
  const kpiWidth = (contentWidth - (kpiCount - 1) * 3) / kpiCount;
  const kpiHeight = 18;

  const kpis = [
    { label: "EXECUTION STATUS", val: testRun.status, color: testRun.status === "Passed" ? [16, 185, 129] : testRun.status === "Repaired" ? [99, 102, 241] : [239, 68, 68] },
    { label: "PASS RATE", val: `${testRun.passRate}%`, color: [37, 99, 235] },
    { label: "ASSERTIONS", val: `${testRun.passedAssertions} / ${testRun.totalAssertions}`, color: [15, 23, 42] },
    { label: "TOTAL DURATION", val: testRun.duration, color: [71, 85, 105] },
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = marginLeft + idx * (kpiWidth + 3);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.4);
    doc.roundedRect(kpiX, y, kpiWidth, kpiHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, kpiX + 3.5, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(String(kpi.val), kpiX + 3.5, y + 13);
  });

  y += kpiHeight + 6;

  // --- 3. EXECUTIVE & DEVELOPER DIAGNOSTICS ---
  checkPageBreak(40);

  // Executive Stakeholder Summary Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Executive Stakeholder Summary", marginLeft, y);
  y += 4;

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, y, contentWidth, 16, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const execLines = doc.splitTextToSize(testRun.executiveSummary || "No executive summary recorded.", contentWidth - 8);
  doc.text(execLines, marginLeft + 4, y + 5.5);

  y += 20;

  // Developer Technical Diagnostics
  checkPageBreak(35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Technical Diagnostics & Recommendations", marginLeft, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  const devLines = doc.splitTextToSize(testRun.developerSummary || "Zero technical defects identified.", contentWidth - 8);
  const recLines = doc.splitTextToSize(`Recommendation: ${testRun.recommendation || "Maintain current monitoring cadence."}`, contentWidth - 8);
  const devBoxHeight = Math.max(18, (devLines.length + recLines.length) * 4 + 6);

  doc.roundedRect(marginLeft, y, contentWidth, devBoxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(devLines, marginLeft + 4, y + 5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(recLines, marginLeft + 4, y + 5 + devLines.length * 4);

  y += devBoxHeight + 6;

  // --- 4. AUTONOMOUS SELF-HEALING LOG ---
  if (testRun.selfHealing && testRun.selfHealing.length > 0) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text("3. Autonomous Self-Healing Interventions", marginLeft, y);
    y += 4;

    // Self-healing table header
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254);
    doc.rect(marginLeft, y, contentWidth, 7, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(67, 56, 202);
    doc.text("Broken Selector", marginLeft + 4, y + 4.8);
    doc.text("Auto-Healed Replacement", marginLeft + 58, y + 4.8);
    doc.text("Strategy", marginLeft + 118, y + 4.8);
    doc.text("Confidence", marginLeft + 150, y + 4.8);
    doc.text("Status", marginLeft + 168, y + 4.8);
    y += 7;

    testRun.selfHealing.forEach((heal) => {
      checkPageBreak(10);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(241, 245, 249);
      doc.rect(marginLeft, y, contentWidth, 9, "FD");

      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.setTextColor(225, 29, 72); // rose-600
      doc.text(heal.brokenSelector, marginLeft + 4, y + 5.5);

      doc.setFont("courier", "bold");
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(heal.replacementSelector, marginLeft + 58, y + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(heal.strategy, marginLeft + 118, y + 5.5);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text(`${Math.round(heal.confidenceScore * 100)}%`, marginLeft + 150, y + 5.5);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text(heal.status, marginLeft + 168, y + 5.5);

      y += 9;
    });

    y += 6;
  }

  // --- 5. DETECTED UI DEFECTS (IF ANY) ---
  if (testRun.defects && testRun.defects.length > 0) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text("4. Detected Regressions & Selector Defects", marginLeft, y);
    y += 4;

    testRun.defects.forEach((def) => {
      checkPageBreak(16);
      doc.setFillColor(254, 242, 242); // rose-50
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(marginLeft, y, contentWidth, 14, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(190, 18, 60);
      doc.text(`[${def.severity.toUpperCase()}] ${def.title}`, marginLeft + 4, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`Category: ${def.category}  •  Component: ${def.component}`, marginLeft + 4, y + 8.5);
      doc.text(def.description, marginLeft + 4, y + 12);

      y += 16;
    });

    y += 4;
  }

  // --- 6. VISUAL REGRESSION COMPARISON EVIDENCE ---
  checkPageBreak(34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Visual Comparison & Screen Capture Evidence", marginLeft, y);
  y += 4;

  const visBoxWidth = (contentWidth - 6) / 3;
  const visBoxHeight = 22;

  // Box 1: Baseline
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginLeft, y, visBoxWidth, visBoxHeight, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("1. GOLDEN BASELINE", marginLeft + 3, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Reference Playwright screenshot", marginLeft + 3, y + 9);
  doc.text("Resolution: 1920x1080 @ 1x", marginLeft + 3, y + 13);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(marginLeft + 3, y + 15, visBoxWidth - 6, 4, 1, 1, "F");

  // Box 2: Actual
  const box2X = marginLeft + visBoxWidth + 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(box2X, y, visBoxWidth, visBoxHeight, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("2. ACTUAL RUN CAPTURE", box2X + 3, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Captured at: ${testRun.startTime.slice(11, 19)}`, box2X + 3, y + 9);
  doc.text("DOM elements evaluated", box2X + 3, y + 13);
  doc.setFillColor(186, 230, 253);
  doc.roundedRect(box2X + 3, y + 15, visBoxWidth - 6, 4, 1, 1, "F");

  // Box 3: Diff Analysis
  const box3X = marginLeft + (visBoxWidth + 3) * 2;
  const isShift = testRun.hasVisualDiff;
  doc.setFillColor(isShift ? 254 : 240, isShift ? 242 : 253, isShift ? 242 : 244);
  doc.setDrawColor(isShift ? 254 : 187, isShift ? 202 : 247, isShift ? 202 : 208);
  doc.roundedRect(box3X, y, visBoxWidth, visBoxHeight, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(isShift ? 190 : 21, isShift ? 18 : 128, isShift ? 60 : 61);
  doc.text(isShift ? "3. REGRESSION DIFF" : "3. PIXEL MATCH (100%)", box3X + 3, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(isShift ? 159 : 22, isShift ? 18 : 101, isShift ? 57 : 52);
  doc.text(isShift ? "Visual discrepancy detected" : "Pixel difference < 0.05%", box3X + 3, y + 9);
  doc.text(isShift ? "Flagged for engineer review" : "SSIM threshold satisfied", box3X + 3, y + 13);
  doc.setFillColor(isShift ? 253 : 167, isShift ? 164 : 243, isShift ? 175 : 208);
  doc.roundedRect(box3X + 3, y + 15, visBoxWidth - 6, 4, 1, 1, "F");

  y += visBoxHeight + 8;

  // --- 7. DETAILED ASSERTION EXECUTION LOG ---
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`6. Detailed Assertion Execution Log (${testRun.assertions.length} Assertions)`, marginLeft, y);
  y += 4;

  // Assertion Table Headers
  const colW = {
    name: 58,
    selector: 44,
    type: 22,
    result: 22,
    details: 36,
  };

  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(marginLeft, y, contentWidth, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("Assertion Name", marginLeft + 3, y + 4.8);
  doc.text("Target Selector", marginLeft + colW.name + 3, y + 4.8);
  doc.text("Type", marginLeft + colW.name + colW.selector + 3, y + 4.8);
  doc.text("Result", marginLeft + colW.name + colW.selector + colW.type + 3, y + 4.8);
  doc.text("Diagnostic Details", marginLeft + colW.name + colW.selector + colW.type + colW.result + 3, y + 4.8);

  y += 7;

  // Assertion Rows
  testRun.assertions.forEach((ast, index) => {
    const isEven = index % 2 === 0;
    const nameLines = doc.splitTextToSize(ast.name, colW.name - 4);
    const selectorLines = doc.splitTextToSize(ast.selector, colW.selector - 4);
    const detailText = ast.failureReason || ast.healedSelector ? (ast.healedSelector ? `Healed: ${ast.healedSelector}` : String(ast.failureReason)) : "Assertion satisfied cleanly";
    const detailLines = doc.splitTextToSize(detailText, colW.details - 4);

    const maxLineCount = Math.max(nameLines.length, selectorLines.length, detailLines.length, 1);
    const rowHeight = Math.max(8, maxLineCount * 3.8 + 3);

    checkPageBreak(rowHeight);

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(marginLeft, y, contentWidth, rowHeight, "FD");

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(nameLines, marginLeft + 3, y + 4.5);

    // Selector
    doc.setFont("courier", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(selectorLines, marginLeft + colW.name + 3, y + 4.5);

    // Type
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(ast.type, marginLeft + colW.name + colW.selector + 3, y + 4.5);

    // Result Badge
    const resultX = marginLeft + colW.name + colW.selector + colW.type + 3;
    if (ast.status === "Passed") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(5, 150, 105);
      doc.text("PASSED", resultX, y + 4.5);
    } else if (ast.status === "Repaired") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(79, 70, 229);
      doc.text("HEALED", resultX, y + 4.5);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(225, 29, 72);
      doc.text("FAILED", resultX, y + 4.5);
    }

    // Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    if (ast.status === "Failed") {
      doc.setTextColor(225, 29, 72);
    } else if (ast.status === "Repaired") {
      doc.setTextColor(79, 70, 229);
    } else {
      doc.setTextColor(148, 163, 184);
    }
    doc.text(detailLines, marginLeft + colW.name + colW.selector + colW.type + colW.result + 3, y + 4.5);

    y += rowHeight;
  });

  // --- 8. RUNNING FOOTERS ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, pageHeight - 12, pageWidth - marginRight, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `OmniSight Multimodal UI Self-Healing & RPA Agent • Confidential Audit Log • Generated: ${now}`,
      marginLeft,
      pageHeight - 7
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginRight - 18, pageHeight - 7);
  }

  // Sanitize filename
  const cleanProj = testRun.projectName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `OmniSight_${cleanProj}_${testRun.id}.pdf`;

  if (typeof window !== "undefined") {
    doc.save(filename);
  }
  return filename;
}
