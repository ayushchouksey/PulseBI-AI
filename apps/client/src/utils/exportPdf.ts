import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export async function exportChartToPDF(element: HTMLElement, title: string) {
  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("landscape", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight);
  const w = imgWidth * ratio;
  const h = imgHeight * ratio;

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(30, 41, 59);
  pdf.text(title, 10, 15);

  // Timestamp
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Exported from PulseBI · ${new Date().toLocaleString()}`, 10, 22);

  // Chart image
  pdf.addImage(imgData, "PNG", (pdfWidth - w) / 2, 28, w, h);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text("PulseBI · AI-Powered Business Intelligence", pdfWidth / 2, pdfHeight - 5, { align: "center" });

  pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}

export async function exportAnalysisPanelToPDF(question: string) {
  const panelEl = document.getElementById("analysis-panel-export");
  if (!panelEl) return;

  const canvas = await html2canvas(panelEl, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("portrait", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = canvas.height;
  const imgWidth = canvas.width;
  const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdf.internal.pageSize.getHeight() - 30) / imgHeight);
  const w = imgWidth * ratio;
  const h = imgHeight * ratio;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(30, 41, 59);
  pdf.text(question, 10, 15);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Exported from PulseBI · ${new Date().toLocaleString()}`, 10, 22);

  pdf.addImage(imgData, "PNG", (pdfWidth - w) / 2, 28, w, h);

  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text("PulseBI · AI-Powered Business Intelligence", pdfWidth / 2, pdf.internal.pageSize.getHeight() - 5, { align: "center" });

  pdf.save(`analysis_${question.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 60)}.pdf`);
}

export async function exportDashboardToPDF(dashboardTitle: string) {
  const dashboardEl = document.getElementById("dashboard-content");
  if (!dashboardEl) return;

  const canvas = await html2canvas(dashboardEl, {
    backgroundColor: "#f8fafc",
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: 1400,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("portrait", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 30) / imgHeight);
  const w = imgWidth * ratio;
  const h = imgHeight * ratio;

  // Title header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(30, 41, 59);
  pdf.text(dashboardTitle, 10, 12);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Exported from PulseBI · ${new Date().toLocaleString()}`, 10, 18);

  // Dashboard image
  pdf.addImage(imgData, "PNG", (pdfWidth - w) / 2, 22, w, h);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text("PulseBI · AI-Powered Business Intelligence", pdfWidth / 2, pdfHeight - 5, { align: "center" });

  pdf.save(`${dashboardTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}
