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

    // Clone content to process simulation panels
    const clonedContent = content.cloneNode(true) as HTMLElement;
    
    // Process simulation panels to capture their results
    const simulationPanels = clonedContent.querySelectorAll('.simulation-panel');
    let simulationSectionsHTML = '';
    
    simulationPanels.forEach((panel, index) => {
      const panelElement = panel as HTMLElement;
      const simTitle = panelElement.getAttribute('data-simulation-title') || `Simulation ${index + 1}`;
      const resultsData = panelElement.getAttribute('data-simulation-results');
      const paramsData = panelElement.getAttribute('data-simulation-params');
      
      if (resultsData) {
        try {
          const results = JSON.parse(resultsData);
          const params = paramsData ? JSON.parse(paramsData) : {};
          
          // Generate chart SVGs for print
          const numericResults = results.filter((r: any) => r.numericValue !== undefined);
          const maxValue = Math.max(...numericResults.map((r: any) => r.numericValue || 0));
          const chartHeight = 200;
          const barWidth = 60;
          const gap = 20;
          const chartWidth = numericResults.length * (barWidth + gap) + 40;
          
          // Generate bar chart SVG
          let barChartSVG = '';
          if (numericResults.length > 0) {
            barChartSVG = `
              <svg width="${chartWidth}" height="${chartHeight + 60}" viewBox="0 0 ${chartWidth} ${chartHeight + 60}">
                <line x1="30" y1="10" x2="30" y2="${chartHeight + 10}" stroke="#374151" stroke-width="2" />
                <line x1="30" y1="${chartHeight + 10}" x2="${chartWidth - 10}" y2="${chartHeight + 10}" stroke="#374151" stroke-width="2" />
                ${[0, 25, 50, 75, 100].map((percent) => `
                  <line x1="30" y1="${chartHeight + 10 - (percent / 100) * chartHeight}" x2="${chartWidth - 10}" y2="${chartHeight + 10 - (percent / 100) * chartHeight}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4" />
                  <text x="25" y="${chartHeight + 14 - (percent / 100) * chartHeight}" text-anchor="end" font-size="10" fill="#6b7280">${Math.round(maxValue * percent / 100)}</text>
                `).join('')}
                ${numericResults.map((result: any, idx: number) => {
                  const barHeight = ((result.numericValue || 0) / maxValue) * chartHeight;
                  const x = 40 + idx * (barWidth + gap);
                  const y = chartHeight + 10 - barHeight;
                  let color = "#10b981";
                  if (result.status === "warning") color = "#f59e0b";
                  if (result.status === "danger") color = "#ef4444";
                  return `
                    <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4" />
                    <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-size="11" font-weight="bold" fill="#374151">${result.value}</text>
                    <text x="${x + barWidth / 2}" y="${chartHeight + 25}" text-anchor="middle" font-size="9" fill="#6b7280">${result.parameter.length > 10 ? result.parameter.substring(0, 10) + "..." : result.parameter}</text>
                    <text x="${x + barWidth / 2}" y="${chartHeight + 38}" text-anchor="middle" font-size="8" fill="#9ca3af">(${result.unit})</text>
                  `;
                }).join('')}
              </svg>
            `;
          }
          
          // Generate gauges SVG
          let gaugesSVG = '';
          const gaugeResults = results.filter((r: any) => r.numericValue !== undefined && r.min !== undefined && r.max !== undefined);
          if (gaugeResults.length > 0) {
            gaugesSVG = gaugeResults.map((result: any) => {
              const percentage = Math.min(100, Math.max(0, ((result.numericValue - result.min) / (result.max - result.min)) * 100));
              const angle = (percentage / 100) * 180 - 90;
              const centerX = 100;
              const centerY = 90;
              const radius = 70;
              const needleLength = 55;
              const needleX = centerX + needleLength * Math.cos((angle * Math.PI) / 180);
              const needleY = centerY + needleLength * Math.sin((angle * Math.PI) / 180);
              let color = "#10b981";
              if (result.status === "warning") color = "#f59e0b";
              if (result.status === "danger") color = "#ef4444";
              
              return `
                <svg width="200" height="130" viewBox="0 0 200 130" style="margin: 10px;">
                  <path d="M 30 ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}" fill="none" stroke="#e5e7eb" stroke-width="12" stroke-linecap="round" />
                  <path d="M 30 ${centerY} A ${radius} ${radius} 0 0 1 ${centerX - 30} ${centerY - radius + 10}" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="round" />
                  <path d="M ${centerX - 30} ${centerY - radius + 10} A ${radius} ${radius} 0 0 1 ${centerX + 30} ${centerY - radius + 10}" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" />
                  <path d="M ${centerX + 30} ${centerY - radius + 10} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}" fill="none" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
                  <line x1="${centerX}" y1="${centerY}" x2="${needleX}" y2="${needleY}" stroke="${color}" stroke-width="3" stroke-linecap="round" />
                  <circle cx="${centerX}" cy="${centerY}" r="8" fill="${color}" />
                  <text x="${centerX}" y="${centerY + 35}" text-anchor="middle" font-size="16" font-weight="bold" fill="#374151">${result.value} ${result.unit}</text>
                  <text x="25" y="${centerY + 15}" text-anchor="middle" font-size="10" fill="#6b7280">${result.min}</text>
                  <text x="175" y="${centerY + 15}" text-anchor="middle" font-size="10" fill="#6b7280">${result.max}</text>
                  <text x="${centerX}" y="${centerY + 52}" text-anchor="middle" font-size="11" fill="#6b7280">${result.parameter}</text>
                </svg>
              `;
            }).join('');
          }
          
          simulationSectionsHTML += `
            <div class="simulation-section" style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #dbeafe; padding-bottom: 8px;">
                📊 ${simTitle} - Simulation Results
              </h2>
              
              <h3 style="color: #374151; font-size: 14px; margin: 15px 0 10px;">Input Parameters</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Parameter</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Value</th>
                </tr>
                ${Object.entries(params).map(([key, value]) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${key}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">${value}</td>
                  </tr>
                `).join('')}
              </table>
              
              <h3 style="color: #374151; font-size: 14px; margin: 15px 0 10px;">Results</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Parameter</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Value</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Unit</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Status</th>
                </tr>
                ${results.map((r: any) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${r.parameter}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">${r.value}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${r.unit}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; color: ${r.status === 'normal' ? '#059669' : r.status === 'warning' ? '#d97706' : '#dc2626'}; font-weight: bold;">${r.status.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </table>
              
              ${barChartSVG ? `
                <h3 style="color: #374151; font-size: 14px; margin: 15px 0 10px;">Results Visualization - Bar Chart</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; overflow-x: auto;">
                  ${barChartSVG}
                </div>
              ` : ''}
              
              ${gaugesSVG ? `
                <h3 style="color: #374151; font-size: 14px; margin: 15px 0 10px;">Results Visualization - Gauges</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                  ${gaugesSVG}
                </div>
              ` : ''}
            </div>
          `;
        } catch (e) {
          console.error('Error parsing simulation data:', e);
        }
      }
    });

    // Process inline charts from simulation-results divs
    const chartContainers = clonedContent.querySelectorAll('.simulation-results');
    chartContainers.forEach((container) => {
      // Make sure charts are visible
      (container as HTMLElement).style.display = 'block';
    });

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
              background: linear-gradient(to bottom right, #eef2ff, #f5f3ff);
              border: 1px solid #c7d2fe;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .simulation-results {
              display: block !important;
              background: white;
              border-radius: 8px;
              padding: 15px;
              margin-top: 15px;
            }
            .simulation-chart, .simulation-gauge {
              display: block !important;
            }
            .no-print {
              display: none !important;
            }
            .status-indicator {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 12px;
              border-radius: 9999px;
              font-weight: 600;
              font-size: 12px;
            }
            @media print {
              body {
                padding: 0;
              }
              .page-break {
                page-break-before: always;
              }
              .simulation-section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${clonedContent.innerHTML}
          ${simulationSectionsHTML}
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
