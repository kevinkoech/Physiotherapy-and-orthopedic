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
  className: string;
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

  const handlePrintWithTraineeInfo = (traineeInfo: TraineeInfo) => {
    setShowDialog(false);
    // Check if we're in export mode or print mode
    if (isExporting) {
      downloadReport(traineeInfo);
    } else {
      generateReport(traineeInfo);
    }
  };

  const downloadReport = async (traineeInfo: TraineeInfo) => {
    try {
      // Generate report HTML
      const reportHTML = await generateReportHTML(traineeInfo);
      
      // Create a blob from the HTML
      const blob = new Blob([reportHTML || ''], { type: 'application/pdf' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generate filename
      const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
      const filename = `${sanitizeFilename(traineeInfo.registrationNumber)}_${sanitizeFilename(traineeInfo.name)}_${sanitizeFilename(traineeInfo.className)}-${sanitizeFilename(title)}.pdf`;
      
      a.download = filename;
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsExporting(false);
      document.body.classList.remove("printing");
    }
  };

  const generateReportHTML = (traineeInfo: TraineeInfo) => {
    document.body.classList.add("printing");
    
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
          
          simulationSectionsHTML += `
            <div class="simulation-section" style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid #dbeafe; padding-bottom: 6px;">
                ${simTitle}
              </h3>
              
              <h4 style="color: #374151; font-size: 13px; margin: 12px 0 8px;">Input Parameters (Data)</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Parameter</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Value</th>
                </tr>
                ${Object.entries(params).map(([key, value]) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${key}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; font-weight: bold;">${value}</td>
                  </tr>
                `).join('')}
              </table>
              
              <h4 style="color: #374151; font-size: 13px; margin: 12px 0 8px;">Results</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Parameter</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Value</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Unit</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Status</th>
                </tr>
                ${results.map((r: any) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${r.parameter}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; font-weight: bold;">${r.value}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${r.unit}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; color: ${r.status === 'normal' ? '#059669' : r.status === 'warning' ? '#d97706' : '#dc2626'}; font-weight: bold;">${r.status.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </table>
              
              ${lineChartSVG ? `
                <h4 style="color: #374151; font-size: 13px; margin: 12px 0 8px;">Chart</h4>
                <div style="background: white; padding: 10px; border-radius: 8px; text-align: center; overflow-x: auto;">
                  ${lineChartSVG}
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

    // Generate filename: admno_name_class-equipment-topic.pdf
    const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
    const filename = `${sanitizeFilename(traineeInfo.registrationNumber)}_${sanitizeFilename(traineeInfo.name)}_${sanitizeFilename(traineeInfo.className)}-${sanitizeFilename(title)}.pdf`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            /* Report styles */
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
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .report-header .institution {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 4px;
            }
            .report-header .department {
              font-size: 14px;
              color: #374151;
              margin-bottom: 2px;
            }
            .report-header .unit-trainer {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 10px;
            }
            .report-header h1 {
              font-size: 24px;
              color: #1e40af;
              margin-bottom: 8px;
            }
            .report-header .subtitle {
              font-size: 14px;
              color: #6b7280;
            }
            .report-header .date-time {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 8px;
            }
            
            /* Trainee Info Box */
            .trainee-info {
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              flex-wrap: wrap;
            }
            .trainee-info .info-item {
              text-align: center;
              margin: 5px 10px;
            }
            .trainee-info .label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .trainee-info .value {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
              margin-top: 4px;
            }
            
            /* Section Headers */
            h2 {
              font-size: 16px;
              color: #1e40af;
              margin-top: 20px;
              margin-bottom: 10px;
              border-bottom: 2px solid #dbeafe;
              padding-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            h3 {
              font-size: 14px;
              color: #374151;
              margin-top: 15px;
              margin-bottom: 8px;
            }
            h4 {
              font-size: 12px;
              color: #4b5563;
              margin-top: 10px;
              margin-bottom: 6px;
            }
            
            /* Content Sections */
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              background: #1e40af;
              color: white;
              padding: 8px 15px;
              border-radius: 6px 6px 0 0;
              font-weight: bold;
              font-size: 14px;
            }
            .section-content {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 6px 6px;
              padding: 15px;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
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
            
            /* Boxes */
            .diagram-box, .circuit-diagram {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px;
              margin: 10px 0;
              font-family: 'Courier New', monospace;
              font-size: 10px;
              white-space: pre;
              overflow-x: auto;
            }
            .note-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 10px;
              margin: 10px 0;
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 10px;
              margin: 10px 0;
            }
            
            /* Simulation Section */
            .simulation-section {
              background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
            }
            
            /* Sign-off Section */
            .sign-off-section {
              margin-top: 40px;
              page-break-inside: avoid;
            }
            .sign-off-section h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            .sign-off-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-top: 20px;
            }
            .sign-off-box {
              border: 2px solid #1e40af;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .sign-off-box .role {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 10px;
            }
            .sign-off-box .name-line {
              border-bottom: 1px solid #374151;
              margin: 30px 0 8px 0;
              height: 1px;
            }
            .sign-off-box .label {
              font-size: 11px;
              color: #9ca3af;
            }
            .sign-off-box .date-line {
              border-bottom: 1px solid #374151;
              margin: 20px 0 8px 0;
              height: 1px;
            }
            
            /* Footer */
            .report-footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
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
            
            /* Page Number Footer */
            .page-footer {
              position: running(footer);
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
            }
            
            @page {
              margin: 20mm 15mm;
              @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 10px;
                color: #9ca3af;
              }
            }
          </style>
        </head>
        <body>
          <!-- Report Header -->
          <div class="report-header">
            <div class="institution">The Nyeri National Polytechnic</div>
            <div class="department">EEE Department - Biomedical Engineering</div>
            <div class="unit-trainer">Unit Trainer: Kevin Koech</div>
            <h1>PRACTICAL REPORT</h1>
            <div class="subtitle">Physiotherapy Equipment Maintenance Training</div>
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
              <div class="label">Admission No.</div>
              <div class="value">${traineeInfo.registrationNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Class</div>
              <div class="value">${traineeInfo.className}</div>
            </div>
          </div>
          
          <!-- 1. EXPERIMENT TITLE / TOPIC -->
          <div class="section">
            <div class="section-title">1. EXPERIMENT TITLE / TOPIC</div>
            <div class="section-content">
              <h3>${title}</h3>
              <p style="margin-top: 8px;">This practical session covers the principles, operation, and maintenance of ${title.toLowerCase()} equipment used in physiotherapy applications.</p>
            </div>
          </div>
          
          <!-- 2. THEORY -->
          <div class="section">
            <div class="section-title">2. THEORY</div>
            <div class="section-content">
              ${theoryText || `
                <p>The theoretical foundation of ${title.toLowerCase()} involves understanding the physical principles, 
                physiological effects, and clinical applications of this equipment in therapeutic settings.</p>
                <p style="margin-top: 8px;">Key concepts include:</p>
                <ul style="margin-left: 20px; margin-top: 5px;">
                  <li>Physical principles of operation</li>
                  <li>Physiological effects on tissues</li>
                  <li>Safety considerations and contraindications</li>
                  <li>Equipment components and their functions</li>
                </ul>
              `}
              ${clonedContent.innerHTML}
            </div>
          </div>
          
          <!-- 3. OBSERVATIONS -->
          <div class="section">
            <div class="section-title">3. OBSERVATIONS</div>
            <div class="section-content">
              ${observationsText || `
                <p>Key observations from the practical session:</p>
                <ul style="margin-left: 20px; margin-top: 5px;">
                  <li>Equipment operated within normal parameters during simulation</li>
                  <li>Safety protocols were followed correctly</li>
                  <li>Maintenance procedures were demonstrated and understood</li>
                </ul>
                <div class="note-box" style="margin-top: 10px;">
                  <strong>Note:</strong> Additional observations should be documented by the trainee based on hands-on experience with the equipment.
                </div>
              `}
            </div>
          </div>
          
          <!-- 4. DATA (Simulation Parameters) -->
          <div class="section">
            <div class="section-title">4. DATA</div>
            <div class="section-content">
              <p>Technical specifications and operational parameters used in the simulation.</p>
              ${simulationSectionsHTML}
            </div>
          </div>
          
          <!-- 5. RESULTS -->
          <div class="section">
            <div class="section-title">5. RESULTS</div>
            <div class="section-content">
              <p>Simulation results and analysis are documented in the Data section above, including parameter tables and graphical charts.</p>
              <div class="note-box" style="margin-top: 10px;">
                <strong>Summary:</strong> The simulation was conducted successfully with all parameters monitored and recorded. Results indicate equipment performance within expected ranges.
              </div>
            </div>
          </div>
          
          <!-- 6. CONCLUSION -->
          <div class="section">
            <div class="section-title">6. CONCLUSION</div>
            <div class="section-content">
              <p>Based on the practical session, the following conclusions can be drawn:</p>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>The ${title.toLowerCase()} equipment functions according to the specified operational parameters.</li>
                <li>Regular maintenance and calibration are essential for optimal performance.</li>
                <li>Safety protocols must be strictly followed during operation.</li>
                <li>Understanding the theoretical principles enhances practical application skills.</li>
              </ol>
              <div class="warning-box" style="margin-top: 10px;">
                <strong>Important:</strong> This practical session should be supplemented with hands-on training under qualified supervision before independent operation.
              </div>
            </div>
          </div>
          
          <!-- Sign-off Section -->
          <div class="sign-off-section">
            <h2>SIGN-OFF</h2>
            <div class="sign-off-grid">
              <div class="sign-off-box">
                <div class="role">Trainee</div>
                <div style="font-weight: bold; color: #1e40af;">${traineeInfo.name}</div>
                <div style="font-size: 11px; color: #6b7280;">Admission No: ${traineeInfo.registrationNumber}</div>
                <div style="font-size: 11px; color: #6b7280;">Class: ${traineeInfo.className}</div>
                <div class="name-line"></div>
                <div class="label">Signature</div>
                <div class="date-line"></div>
                <div class="label">Date</div>
              </div>
              <div class="sign-off-box">
                <div class="role">Trainer</div>
                <div style="font-weight: bold; color: #1e40af;">Kevin Koech</div>
                <div style="font-size: 11px; color: #6b7280;">Unit Trainer</div>
                <div class="name-line"></div>
                <div class="label">Signature</div>
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
    `;
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
          
          simulationSectionsHTML += `
            <div class="simulation-section" style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid #dbeafe; padding-bottom: 6px;">
                ${simTitle}
              </h3>
              
              <h4 style="color: #374151; font-size: 13px; margin: 12px 0 8px;">Input Parameters (Data)</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Parameter</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Value</th>
                </tr>
                ${Object.entries(params).map(([key, value]) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${key}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; font-weight: bold;">${value}</td>
                  </tr>
                `).join('')}
              </table>
              
              <h4 style="color: #374151; font-size: 13px; margin: 12px 0 8px;">Results</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Parameter</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Value</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Unit</th>
                  <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Status</th>
                </tr>
                ${results.map((r: any) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${r.parameter}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; font-weight: bold;">${r.value}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${r.unit}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; color: ${r.status === 'normal' ? '#059669' : r.status === 'warning' ? '#d97706' : '#dc2626'}; font-weight: bold;">${r.status.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </table>
              
              ${lineChartSVG ? `
                <h4 style="color: #374151; font-size: 13px; margin: 12px 0 8px;">Chart</h4>
                <div style="background: white; padding: 10px; border-radius: 8px; text-align: center; overflow-x: auto;">
                  ${lineChartSVG}
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

    // Generate filename: admno_name_class-equipment-topic.pdf
    const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
    const filename = `${sanitizeFilename(traineeInfo.registrationNumber)}_${sanitizeFilename(traineeInfo.name)}_${sanitizeFilename(traineeInfo.className)}-${sanitizeFilename(title)}.pdf`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
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
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .report-header .institution {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 4px;
            }
            .report-header .department {
              font-size: 14px;
              color: #374151;
              margin-bottom: 2px;
            }
            .report-header .unit-trainer {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 10px;
            }
            .report-header h1 {
              font-size: 24px;
              color: #1e40af;
              margin-bottom: 8px;
            }
            .report-header .subtitle {
              font-size: 14px;
              color: #6b7280;
            }
            .report-header .date-time {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 8px;
            }
            
            /* Trainee Info Box */
            .trainee-info {
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              flex-wrap: wrap;
            }
            .trainee-info .info-item {
              text-align: center;
              margin: 5px 10px;
            }
            .trainee-info .label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .trainee-info .value {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
              margin-top: 4px;
            }
            
            /* Section Headers */
            h2 {
              font-size: 16px;
              color: #1e40af;
              margin-top: 20px;
              margin-bottom: 10px;
              border-bottom: 2px solid #dbeafe;
              padding-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            h3 {
              font-size: 14px;
              color: #374151;
              margin-top: 15px;
              margin-bottom: 8px;
            }
            h4 {
              font-size: 12px;
              color: #4b5563;
              margin-top: 10px;
              margin-bottom: 6px;
            }
            
            /* Content Sections */
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              background: #1e40af;
              color: white;
              padding: 8px 15px;
              border-radius: 6px 6px 0 0;
              font-weight: bold;
              font-size: 14px;
            }
            .section-content {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 6px 6px;
              padding: 15px;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
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
            
            /* Boxes */
            .diagram-box, .circuit-diagram {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px;
              margin: 10px 0;
              font-family: 'Courier New', monospace;
              font-size: 10px;
              white-space: pre;
              overflow-x: auto;
            }
            .note-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 10px;
              margin: 10px 0;
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 10px;
              margin: 10px 0;
            }
            
            /* Simulation Section */
            .simulation-section {
              background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
            }
            
            /* Sign-off Section */
            .sign-off-section {
              margin-top: 40px;
              page-break-inside: avoid;
            }
            .sign-off-section h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            .sign-off-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-top: 20px;
            }
            .sign-off-box {
              border: 2px solid #1e40af;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .sign-off-box .role {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 10px;
            }
            .sign-off-box .name-line {
              border-bottom: 1px solid #374151;
              margin: 30px 0 8px 0;
              height: 1px;
            }
            .sign-off-box .label {
              font-size: 11px;
              color: #9ca3af;
            }
            .sign-off-box .date-line {
              border-bottom: 1px solid #374151;
              margin: 20px 0 8px 0;
              height: 1px;
            }
            
            /* Footer */
            .report-footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
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
            
            /* Page Number Footer */
            .page-footer {
              position: running(footer);
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
            }
            
            @page {
              margin: 20mm 15mm;
              @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 10px;
                color: #9ca3af;
              }
            }
          </style>
        </head>
        <body>
          <!-- Report Header -->
          <div class="report-header">
            <div class="institution">The Nyeri National Polytechnic</div>
            <div class="department">EEE Department - Biomedical Engineering</div>
            <div class="unit-trainer">Unit Trainer: Kevin Koech</div>
            <h1>PRACTICAL REPORT</h1>
            <div class="subtitle">Physiotherapy Equipment Maintenance Training</div>
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
              <div class="label">Admission No.</div>
              <div class="value">${traineeInfo.registrationNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Class</div>
              <div class="value">${traineeInfo.className}</div>
            </div>
          </div>
          
          <!-- 1. EXPERIMENT TITLE / TOPIC -->
          <div class="section">
            <div class="section-title">1. EXPERIMENT TITLE / TOPIC</div>
            <div class="section-content">
              <h3>${title}</h3>
              <p style="margin-top: 8px;">This practical session covers the principles, operation, and maintenance of ${title.toLowerCase()} equipment used in physiotherapy applications.</p>
            </div>
          </div>
          
          <!-- 2. THEORY -->
          <div class="section">
            <div class="section-title">2. THEORY</div>
            <div class="section-content">
              ${theoryText || `
                <p>The theoretical foundation of ${title.toLowerCase()} involves understanding the physical principles, 
                physiological effects, and clinical applications of this equipment in therapeutic settings.</p>
                <p style="margin-top: 8px;">Key concepts include:</p>
                <ul style="margin-left: 20px; margin-top: 5px;">
                  <li>Physical principles of operation</li>
                  <li>Physiological effects on tissues</li>
                  <li>Safety considerations and contraindications</li>
                  <li>Equipment components and their functions</li>
                </ul>
              `}
              ${clonedContent.innerHTML}
            </div>
          </div>
          
          <!-- 3. OBSERVATIONS -->
          <div class="section">
            <div class="section-title">3. OBSERVATIONS</div>
            <div class="section-content">
              ${observationsText || `
                <p>Key observations from the practical session:</p>
                <ul style="margin-left: 20px; margin-top: 5px;">
                  <li>Equipment operated within normal parameters during simulation</li>
                  <li>Safety protocols were followed correctly</li>
                  <li>Maintenance procedures were demonstrated and understood</li>
                </ul>
                <div class="note-box" style="margin-top: 10px;">
                  <strong>Note:</strong> Additional observations should be documented by the trainee based on hands-on experience with the equipment.
                </div>
              `}
            </div>
          </div>
          
          <!-- 4. DATA (Simulation Parameters) -->
          <div class="section">
            <div class="section-title">4. DATA</div>
            <div class="section-content">
              <p>Technical specifications and operational parameters used in the simulation.</p>
              ${simulationSectionsHTML}
            </div>
          </div>
          
          <!-- 5. RESULTS -->
          <div class="section">
            <div class="section-title">5. RESULTS</div>
            <div class="section-content">
              <p>Simulation results and analysis are documented in the Data section above, including parameter tables and graphical charts.</p>
              <div class="note-box" style="margin-top: 10px;">
                <strong>Summary:</strong> The simulation was conducted successfully with all parameters monitored and recorded. Results indicate equipment performance within expected ranges.
              </div>
            </div>
          </div>
          
          <!-- 6. CONCLUSION -->
          <div class="section">
            <div class="section-title">6. CONCLUSION</div>
            <div class="section-content">
              <p>Based on the practical session, the following conclusions can be drawn:</p>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>The ${title.toLowerCase()} equipment functions according to the specified operational parameters.</li>
                <li>Regular maintenance and calibration are essential for optimal performance.</li>
                <li>Safety protocols must be strictly followed during operation.</li>
                <li>Understanding the theoretical principles enhances practical application skills.</li>
              </ol>
              <div class="warning-box" style="margin-top: 10px;">
                <strong>Important:</strong> This practical session should be supplemented with hands-on training under qualified supervision before independent operation.
              </div>
            </div>
          </div>
          
          <!-- Sign-off Section -->
          <div class="sign-off-section">
            <h2>SIGN-OFF</h2>
            <div class="sign-off-grid">
              <div class="sign-off-box">
                <div class="role">Trainee</div>
                <div style="font-weight: bold; color: #1e40af;">${traineeInfo.name}</div>
                <div style="font-size: 11px; color: #6b7280;">Admission No: ${traineeInfo.registrationNumber}</div>
                <div style="font-size: 11px; color: #6b7280;">Class: ${traineeInfo.className}</div>
                <div class="name-line"></div>
                <div class="label">Signature</div>
                <div class="date-line"></div>
                <div class="label">Date</div>
              </div>
              <div class="sign-off-box">
                <div class="role">Trainer</div>
                <div style="font-weight: bold; color: #1e40af;">Kevin Koech</div>
                <div style="font-size: 11px; color: #6b7280;">Unit Trainer</div>
                <div class="name-line"></div>
                <div class="label">Signature</div>
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
          {isExporting ? "Downloading..." : "Download PDF"}
        </button>
      </div>
    </>
  );
}
