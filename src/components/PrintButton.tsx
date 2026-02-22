"use client";

import { useState } from "react";

interface PrintButtonProps {
  title: string;
}

export function PrintButton({ title }: PrintButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    // Add print class to body for print-specific styles
    document.body.classList.add("printing");
    
    // Create printable content
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the document");
      return;
    }

    const content = document.getElementById("printable-content");
    if (!content) {
      alert("Content not found");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Learning Notes</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              padding: 20px;
              max-width: 100%;
            }
            h1 {
              font-size: 24px;
              color: #1e40af;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 18px;
              color: #1e40af;
              margin-top: 20px;
              margin-bottom: 10px;
              border-bottom: 1px solid #dbeafe;
              padding-bottom: 5px;
            }
            h3 {
              font-size: 16px;
              color: #374151;
              margin-top: 15px;
              margin-bottom: 8px;
            }
            p {
              margin-bottom: 10px;
            }
            ul, ol {
              margin-left: 20px;
              margin-bottom: 10px;
            }
            li {
              margin-bottom: 5px;
            }
            .diagram-box, .circuit-diagram {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
              font-family: 'Courier New', monospace;
              font-size: 11px;
              white-space: pre;
              overflow-x: auto;
            }
            .note-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 10px 15px;
              margin: 10px 0;
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 10px 15px;
              margin: 10px 0;
            }
            .tip-box {
              background: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 10px 15px;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 8px;
              text-align: left;
            }
            th {
              background: #f3f4f6;
              font-weight: 600;
            }
            .bg-white {
              background: white;
            }
            .rounded-xl {
              border-radius: 12px;
            }
            .shadow {
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .p-6 {
              padding: 24px;
            }
            .mb-6 {
              margin-bottom: 24px;
            }
            .text-gray-800 {
              color: #1f2937;
            }
            .font-bold {
              font-weight: 700;
            }
            details {
              margin: 10px 0;
            }
            summary {
              cursor: pointer;
              font-weight: 500;
            }
            .simulation-panel {
              display: none;
            }
            .no-print {
              display: none !important;
            }
            @media print {
              body {
                padding: 0;
              }
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      document.body.classList.remove("printing");
    }, 500);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    // For PDF export, we'll use the print dialog which can save as PDF
    handlePrint();
    
    setIsExporting(false);
  };

  return (
    <div className="flex gap-2 no-print">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Notes
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isExporting ? "Exporting..." : "Export as PDF"}
      </button>
    </div>
  );
}
