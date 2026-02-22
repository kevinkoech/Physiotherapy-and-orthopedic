"use client";

import { useState } from "react";
import { TraineeInfoDialog } from "./TraineeInfoDialog";

interface PrintButtonProps {
  title: string;
  theoryText?: string;
  observationsText?: string;
}

interface TraineeInfo {
  name: string;
  registrationNumber: string;
}

export function PrintButton({ title, theoryText, observationsText }: PrintButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const generateLineChartSVG = (results: any[], chartTitle: string) => {
    const numericResults = results.filter((r: any) => r.numericValue !== undefined);
    if (numericResults.length === 0) return '';
    
    const chartWidth = 600;
    const chartHeight = 300;
    const padding = { top: 40, right: 40, bottom: 60, left: 70 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    
    const values = numericResults.map((r: any) => r.numericValue || 0);
    const maxValue = Math.max(...values) * 1.1;
    const minValue = Math.min(0, Math.min(...values));
    const valueRange = maxValue - minValue;
    
    const points = numericResults.map((result: any, index: number) => {
      const x = padding.left + (index / (numericResults.length - 1 || 1)) * plotWidth;
      const y = padding.top + plotHeight - ((result.numericValue - minValue) / valueRange) * plotHeight;
      return { x, y, result, index };
    });
    
    const linePath = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${padding.top + plotHeight} L ${padding.left} ${padding.top + plotHeight} Z`;
    
    const getPointColor = (status: string) => {
      switch (status) {
        case 'warning': return '#f59e0b';
        case 'danger': return '#ef4444';
        default: return '#10b981';
      }
    };
    
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minValue + (valueRange * i / yTicks));
    
    return `
      <svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}">
        <rect x="0" y="0" width="${chartWidth}" height="${chartHeight}" fill="#fafafa" />
        <rect x="${padding.left}" y="${padding.top}" width="${plotWidth}" height="${plotHeight}" fill="white" stroke="#e5e7eb" />
        
        ${yTickValues.map((tick, i) => {
          const y = padding.top + plotHeight - ((tick - minValue) / valueRange) * plotHeight;
          return `
            <line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4" />
            <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7280">${tick.toFixed(1)}</text>
          `;
        }).join('')}
        
        ${points.map((p: any) => `
          <line x1="${p.x}" y1="${padding.top}" x2="${p.x}" y2="${padding.top + plotHeight}" stroke="#f3f4f6" stroke-width="1" />
        `).join('')}
        
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
          </linearGradient>
        </defs>
        
        <path d="${areaPath}" fill="url(#lineGradient)" opacity="0.3" />
        <path d="${linePath}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        
        ${points.map((p: any) => `
          <circle cx="${p.x}" cy="${p.y}" r="8" fill="white" stroke="${getPointColor(p.result.status)}" stroke-width="3" />
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="${getPointColor(p.result.status)}" />
          <text x="${p.x}" y="${p.y - 15}" text-anchor="middle" font-size="10" font-weight="bold" fill="#374151">${p.result.value}</text>
        `).join('')}
        
        ${points.map((p: any) => `
          <text x="${p.x}" y="${chartHeight - 25}" text-anchor="middle" font-size="9" fill="#6b7280" transform="rotate(-45, ${p.x}, ${chartHeight - 25})">
            ${p.result.parameter.length > 12 ? p.result.parameter.substring(0, 12) + '...' : p.result.parameter}
          </text>
        `).join('')}
        
        <text x="20" y="${chartHeight / 2}" text-anchor="middle" font-size="12" fill="#374151" transform="rotate(-90, 20, ${chartHeight / 2})">Value</text>
        <text x="${chartWidth / 2}" y="${chartHeight - 5}" text-anchor="middle" font-size="12" fill="#374151">Parameters</text>
        <text x="${chartWidth / 2}" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e40af">${chartTitle}</text>
        
        <g transform="translate(${chartWidth - 120}, ${padding.top})">
          <rect x="0" y="0" width="100" height="70" fill="white" stroke="#e5e7eb" rx="4" />
          <circle cx="15" cy="15" r="5" fill="#10b981" />
          <text x="25" y="19" font-size="10" fill="#374151">Normal</text>
          <circle cx="15" cy="35" r="5" fill="#f59e0b" />
          <text x="25" y="39" font-size="10" fill="#374151">Warning</text>
          <circle cx="15" cy="55" r="5" fill="#ef4444" />
          <text x="25" y="59" font-size="10" fill="#374151">Danger</text>
        </g>
      </svg>
    `;
  };

  const generateGaugeSVG = (result: any) => {
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
  };

  const handlePrintWithTraineeInfo = (traineeInfo: TraineeInfo) => {
    setShowDialog(false);
    generateReport(traineeInfo);
  };

  const generateReport = (traineeInfo: TraineeInfo) => {
    document.body.classList.add("printing");
    
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

    const clonedContent = content.cloneNode(true) as HTMLElement;
    
    // Process simulation panels
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
          
          const lineChartSVG = generateLineChartSVG(results, `${simTitle} - Parameter Analysis`);
          
          const gaugeResults = results.filter((r: any) => r.numericValue !== undefined && r.min !== undefined && r.max !== undefined);
          const gaugesSVG = gaugeResults.map((result: any) => generateGaugeSVG(result)).join('');
          
          simulationSectionsHTML += `
            <div class="simulation-section" style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #dbeafe; padding-bottom: 8px;">
                SIMULATION: ${simTitle}
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
              
              ${lineChartSVG ? `
                <h3 style="color: #374151; font-size: 14px; margin: 15px 0 10px;">Results Visualization - Line Graph</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; overflow-x: auto;">
                  ${lineChartSVG}
                </div>
              ` : ''}
              
              ${gaugesSVG ? `
                <h3 style="color: #374151; font-size: 14px; margin: 15px 0 10px;">Parameter Gauges</h3>
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

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Training Report</title>
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
            
            /* Report Header */
            .report-header {
              text-align: center;
              border-bottom: 3px double #1e40af;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .report-header h1 {
              font-size: 28px;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .report-header .subtitle {
              font-size: 16px;
              color: #6b7280;
            }
            .report-header .date-time {
              font-size: 14px;
              color: #9ca3af;
              margin-top: 10px;
            }
            
            /* Trainee Info Box */
            .trainee-info {
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              border: 2px solid #3b82f6;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .trainee-info .info-item {
              text-align: center;
            }
            .trainee-info .label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .trainee-info .value {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
              margin-top: 5px;
            }
            
            /* Section Headers */
            h2 {
              font-size: 20px;
              color: #1e40af;
              margin-top: 30px;
              margin-bottom: 15px;
              border-bottom: 2px solid #dbeafe;
              padding-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            h3 {
              font-size: 16px;
              color: #374151;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            h4 {
              font-size: 14px;
              color: #4b5563;
              margin-top: 15px;
              margin-bottom: 8px;
            }
            
            /* Content Sections */
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              background: #1e40af;
              color: white;
              padding: 10px 20px;
              border-radius: 8px 8px 0 0;
              font-weight: bold;
              font-size: 16px;
            }
            .section-content {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 8px 8px;
              padding: 20px;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 10px;
              text-align: left;
            }
            th {
              background: #f3f4f6;
              font-weight: 600;
            }
            
            /* Boxes */
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
              padding: 15px;
              margin: 15px 0;
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 15px 0;
            }
            .tip-box {
              background: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 15px 0;
            }
            
            /* Simulation Section */
            .simulation-section {
              background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
            }
            
            /* Sign-off Section */
            .sign-off-section {
              margin-top: 50px;
              page-break-inside: avoid;
            }
            .sign-off-section h2 {
              text-align: center;
              margin-bottom: 30px;
            }
            .sign-off-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-top: 30px;
            }
            .sign-off-box {
              border: 2px solid #1e40af;
              border-radius: 12px;
              padding: 25px;
              text-align: center;
            }
            .sign-off-box .role {
              font-size: 14px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 15px;
            }
            .sign-off-box .name-line {
              border-bottom: 1px solid #374151;
              margin: 40px 0 10px 0;
              height: 1px;
            }
            .sign-off-box .label {
              font-size: 12px;
              color: #9ca3af;
            }
            .sign-off-box .date-line {
              border-bottom: 1px solid #374151;
              margin: 30px 0 10px 0;
              height: 1px;
            }
            
            /* Footer */
            .report-footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
            }
            
            /* Print Styles */
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
              .sign-off-section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <!-- Report Header -->
          <div class="report-header">
            <h1>${title}</h1>
            <div class="subtitle">Physiotherapy Equipment Maintenance Training Report</div>
            <div class="date-time">
              <strong>Date:</strong> ${dateStr} | <strong>Time:</strong> ${timeStr}
            </div>
          </div>
          
          <!-- Trainee Information -->
          <div class="trainee-info">
            <div class="info-item">
              <div class="label">Trainee Name</div>
              <div class="value">${traineeInfo.name}</div>
            </div>
            <div class="info-item">
              <div class="label">Registration Number</div>
              <div class="value">${traineeInfo.registrationNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Session Date</div>
              <div class="value">${dateStr}</div>
            </div>
          </div>
          
          <!-- Topic Section -->
          <div class="section">
            <div class="section-title">1. TOPIC</div>
            <div class="section-content">
              <h3>${title}</h3>
              <p>This training module covers the principles, operation, and maintenance of ${title.toLowerCase()} equipment used in physiotherapy applications.</p>
            </div>
          </div>
          
          <!-- Theory Section -->
          <div class="section">
            <div class="section-title">2. THEORY</div>
            <div class="section-content">
              ${theoryText || `
                <p>The theoretical foundation of ${title.toLowerCase()} involves understanding the physical principles, 
                physiological effects, and clinical applications of this equipment in therapeutic settings.</p>
                <p>Key concepts include:</p>
                <ul>
                  <li>Physical principles of operation</li>
                  <li>Physiological effects on tissues</li>
                  <li>Safety considerations and contraindications</li>
                  <li>Equipment components and their functions</li>
                </ul>
              `}
              ${clonedContent.innerHTML}
            </div>
          </div>
          
          <!-- Data Section -->
          <div class="section">
            <div class="section-title">3. DATA</div>
            <div class="section-content">
              <p>Technical specifications and operational parameters for ${title.toLowerCase()}.</p>
            </div>
          </div>
          
          <!-- Results Section -->
          <div class="section">
            <div class="section-title">4. RESULTS</div>
            <div class="section-content">
              ${simulationSectionsHTML}
            </div>
          </div>
          
          <!-- Plots Section -->
          <div class="section">
            <div class="section-title">5. PLOTS</div>
            <div class="section-content">
              <p>Graphical representations of simulation results are included in the Results section above.</p>
              <p>Line graphs show parameter relationships and trends, while gauges indicate individual parameter status.</p>
            </div>
          </div>
          
          <!-- Observations Section -->
          <div class="section">
            <div class="section-title">6. OBSERVATIONS</div>
            <div class="section-content">
              ${observationsText || `
                <p>Key observations from the training session:</p>
                <ul>
                  <li>Equipment operated within normal parameters during simulation</li>
                  <li>Safety protocols were followed correctly</li>
                  <li>Maintenance procedures were demonstrated and understood</li>
                </ul>
                <div class="note-box">
                  <strong>Note:</strong> Additional observations should be documented by the trainee based on hands-on experience with the equipment.
                </div>
              `}
            </div>
          </div>
          
          <!-- Sign-off Section -->
          <div class="sign-off-section">
            <h2>SIGN-OFF</h2>
            <div class="sign-off-grid">
              <div class="sign-off-box">
                <div class="role">Trainee</div>
                <div style="font-weight: bold; color: #1e40af;">${traineeInfo.name}</div>
                <div style="font-size: 12px; color: #6b7280;">Reg. No: ${traineeInfo.registrationNumber}</div>
                <div class="name-line"></div>
                <div class="label">Signature</div>
                <div class="date-line"></div>
                <div class="label">Date</div>
              </div>
              <div class="sign-off-box">
                <div class="role">Trainer</div>
                <div style="height: 24px;"></div>
                <div class="name-line"></div>
                <div class="label">Name & Signature</div>
                <div class="date-line"></div>
                <div class="label">Date</div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="report-footer">
            <p>Generated by Physiotherapy Equipment Maintenance Learning System</p>
            <p>Report Date: ${dateStr} at ${timeStr}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      document.body.classList.remove("printing");
    }, 500);
  };

  const handlePrint = () => {
    setShowDialog(true);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowDialog(true);
    setIsExporting(false);
  };

  return (
    <>
      <TraineeInfoDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handlePrintWithTraineeInfo}
        title={title}
      />
      <div className="flex gap-2 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
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
    </>
  );
}
