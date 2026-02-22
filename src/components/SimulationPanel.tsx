"use client";

import { useState, useRef, useEffect } from "react";

interface SimulationResult {
  parameter: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "danger";
  numericValue?: number;
  min?: number;
  max?: number;
}

interface SimulationPanelProps {
  title: string;
  description: string;
  parameters: SimulationParameter[];
  simulate: (params: Record<string, number | string>) => SimulationResult[];
  defaultValues?: Record<string, number | string>;
  theoryText?: string;
  observationsText?: string;
  equipmentName?: string;
}

interface TraineeInfo {
  name: string;
  registrationNumber: string;
}

interface SimulationParameter {
  name: string;
  key: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  default: number | string;
  type?: "number" | "select";
  options?: { value: string; label: string }[];
}

// Line Chart Component - matplotlib/MATLAB style
function LineChart({ results, title }: { results: SimulationResult[]; title: string }) {
  const numericResults = results.filter(r => r.numericValue !== undefined);
  
  if (numericResults.length === 0) return null;
  
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  
  // Calculate data range
  const values = numericResults.map(r => r.numericValue || 0);
  const maxValue = Math.max(...values) * 1.1; // Add 10% padding
  const minValue = Math.min(0, Math.min(...values));
  const valueRange = maxValue - minValue;
  
  // Generate points for line plot
  const points = numericResults.map((result, index) => {
    const x = padding.left + (index / (numericResults.length - 1 || 1)) * plotWidth;
    const y = padding.top + plotHeight - ((result.numericValue! - minValue) / valueRange) * plotHeight;
    return { x, y, result, index };
  });
  
  // Create path for line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  // Create area fill under the line
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${padding.top + plotHeight} L ${padding.left} ${padding.top + plotHeight} Z`;
  
  // Generate Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minValue + (valueRange * i / yTicks));
  
  // Colors for different status
  const getPointColor = (status: string) => {
    switch (status) {
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#10b981';
    }
  };

  return (
    <div className="simulation-chart line-chart" data-chart-type="line">
      <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Background */}
        <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="#fafafa" />
        
        {/* Plot area background */}
        <rect 
          x={padding.left} 
          y={padding.top} 
          width={plotWidth} 
          height={plotHeight} 
          fill="white" 
          stroke="#e5e7eb"
        />
        
        {/* Grid lines - horizontal */}
        {yTickValues.map((tick, i) => {
          const y = padding.top + plotHeight - ((tick - minValue) / valueRange) * plotHeight;
          return (
            <g key={i}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={chartWidth - padding.right} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="4"
              />
              <text 
                x={padding.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="11" 
                fill="#6b7280"
              >
                {tick.toFixed(1)}
              </text>
            </g>
          );
        })}
        
        {/* Grid lines - vertical */}
        {points.map((p, i) => (
          <line 
            key={i}
            x1={p.x} 
            y1={padding.top} 
            x2={p.x} 
            y2={padding.top + plotHeight} 
            stroke="#f3f4f6" 
            strokeWidth="1" 
          />
        ))}
        
        {/* Area fill */}
        <path 
          d={areaPath} 
          fill="url(#gradient)" 
          opacity="0.3"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Line */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Point shadow */}
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="8" 
              fill="white" 
              stroke={getPointColor(p.result.status)}
              strokeWidth="3"
            />
            {/* Point inner */}
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill={getPointColor(p.result.status)}
            />
            {/* Value label */}
            <text 
              x={p.x} 
              y={p.y - 15} 
              textAnchor="middle" 
              fontSize="10" 
              fontWeight="bold"
              fill="#374151"
            >
              {p.result.value}
            </text>
          </g>
        ))}
        
        {/* X-axis labels */}
        {points.map((p, i) => (
          <text 
            key={i}
            x={p.x} 
            y={chartHeight - 25} 
            textAnchor="middle" 
            fontSize="9" 
            fill="#6b7280"
            transform={`rotate(-45, ${p.x}, ${chartHeight - 25})`}
          >
            {p.result.parameter.length > 12 ? p.result.parameter.substring(0, 12) + '...' : p.result.parameter}
          </text>
        ))}
        
        {/* Y-axis label */}
        <text 
          x={20} 
          y={chartHeight / 2} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#374151"
          transform={`rotate(-90, 20, ${chartHeight / 2})`}
        >
          Value
        </text>
        
        {/* X-axis label */}
        <text 
          x={chartWidth / 2} 
          y={chartHeight - 5} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#374151"
        >
          Parameters
        </text>
        
        {/* Chart title */}
        <text 
          x={chartWidth / 2} 
          y={20} 
          textAnchor="middle" 
          fontSize="14" 
          fontWeight="bold"
          fill="#1e40af"
        >
          {title}
        </text>
        
        {/* Legend */}
        <g transform={`translate(${chartWidth - 120}, ${padding.top})`}>
          <rect x="0" y="0" width="100" height="70" fill="white" stroke="#e5e7eb" rx="4" />
          <circle cx="15" cy="15" r="5" fill="#10b981" />
          <text x="25" y="19" fontSize="10" fill="#374151">Normal</text>
          <circle cx="15" cy="35" r="5" fill="#f59e0b" />
          <text x="25" y="39" fontSize="10" fill="#374151">Warning</text>
          <circle cx="15" cy="55" r="5" fill="#ef4444" />
          <text x="25" y="59" fontSize="10" fill="#374151">Danger</text>
        </g>
      </svg>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ status }: { status: "normal" | "warning" | "danger" }) {
  const config = {
    normal: { color: "#10b981", bg: "#d1fae5", label: "NORMAL", icon: "OK" },
    warning: { color: "#f59e0b", bg: "#fef3c7", label: "WARNING", icon: "!" },
    danger: { color: "#ef4444", bg: "#fee2e2", label: "DANGER", icon: "X" },
  };
  
  const { color, bg, label, icon } = config[status];
  
  return (
    <div 
      className="status-indicator"
      style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: "6px", 
        padding: "4px 12px", 
        borderRadius: "9999px", 
        backgroundColor: bg, 
        color: color,
        fontWeight: 600,
        fontSize: "12px"
      }}
    >
      <span style={{ fontWeight: "bold" }}>[{icon}]</span>
      <span>{label}</span>
    </div>
  );
}

export function SimulationPanel({
  title,
  description,
  parameters,
  simulate,
  defaultValues = {},
  theoryText,
  observationsText,
  equipmentName,
}: SimulationPanelProps) {
  const [paramValues, setParamValues] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {};
    parameters.forEach((p) => {
      initial[p.key] = defaultValues[p.key] ?? p.default;
    });
    return initial;
  });

  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runHistory, setRunHistory] = useState<{ params: Record<string, number | string>; results: SimulationResult[] }[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Trainee info dialog state
  const [showTraineeDialog, setShowTraineeDialog] = useState(false);
  const [traineeInfo, setTraineeInfo] = useState<TraineeInfo | null>(null);

  // Store results in a data attribute for print capture
  useEffect(() => {
    if (results && panelRef.current) {
      panelRef.current.setAttribute('data-simulation-results', JSON.stringify(results));
      panelRef.current.setAttribute('data-simulation-params', JSON.stringify(paramValues));
      panelRef.current.setAttribute('data-simulation-history', JSON.stringify(runHistory));
      panelRef.current.setAttribute('data-simulation-title', title);
      if (theoryText) panelRef.current.setAttribute('data-theory-text', theoryText);
      if (observationsText) panelRef.current.setAttribute('data-observations-text', observationsText);
    }
  }, [results, paramValues, runHistory, title, theoryText, observationsText]);

  const handleParamChange = (key: string, value: number | string) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
    setResults(null);
  };

  const runSimulation = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const simResults = simulate(paramValues);
      setResults(simResults);
      setRunHistory(prev => [...prev, { params: { ...paramValues }, results: simResults }]);
      setIsRunning(false);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 500);
  };

  const resetSimulation = () => {
    const initial: Record<string, number | string> = {};
    parameters.forEach((p) => {
      initial[p.key] = defaultValues[p.key] ?? p.default;
    });
    setParamValues(initial);
    setResults(null);
    setRunHistory([]);
  };

  // Print simulation report
  const handlePrintSimulation = () => {
    setShowTraineeDialog(true);
  };

  const generateSimulationReport = (info: TraineeInfo) => {
    setTraineeInfo(info);
    setShowTraineeDialog(false);
    
    if (!results) return;
    
    // Create a standalone report window
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('Please allow popups to generate the report');
      return;
    }
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Generate chart SVG
    const chartSvg = generateChartSvg(results, title);
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simulation Report - ${equipmentName || title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto;
            color: #1f2937;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #3b82f6; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .header h1 { 
            color: #1e40af; 
            font-size: 24px; 
            margin-bottom: 10px;
          }
          .header .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .trainee-info {
            background: #f3f4f6;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
          }
          .trainee-info div {
            flex: 1;
          }
          .trainee-info label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .trainee-info .value {
            font-weight: 600;
            color: #1f2937;
          }
          .section { margin-bottom: 25px; }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e40af;
            border-left: 4px solid #3b82f6;
            padding-left: 12px;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
          }
          .status-normal { color: #10b981; font-weight: 600; }
          .status-warning { color: #f59e0b; font-weight: 600; }
          .status-danger { color: #ef4444; font-weight: 600; }
          .chart-container {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: #fafafa;
            border-radius: 8px;
          }
          .summary {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px 20px;
            border-radius: 0 8px 8px 0;
          }
          .signatures {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid #1f2937;
            margin-top: 60px;
            padding-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Simulation Report</h1>
          <div class="subtitle">${equipmentName || title}</div>
          <div class="subtitle">${currentDate} at ${currentTime}</div>
        </div>
        
        <div class="trainee-info">
          <div>
            <label>Trainee Name</label>
            <div class="value">${info.name}</div>
          </div>
          <div>
            <label>Registration Number</label>
            <div class="value">${info.registrationNumber}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Simulation Parameters</div>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              ${parameters.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td><strong>${paramValues[p.key]}</strong></td>
                  <td>${p.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">Simulation Results</div>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${results.map(r => `
                <tr>
                  <td>${r.parameter}</td>
                  <td><strong>${r.value}</strong></td>
                  <td>${r.unit}</td>
                  <td class="status-${r.status}">${r.status.toUpperCase()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">Results Visualization</div>
          <div class="chart-container">
            ${chartSvg}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Summary</div>
          <div class="summary">
            <p><strong>Total Parameters:</strong> ${results.length}</p>
            <p><strong>Normal:</strong> ${results.filter(r => r.status === 'normal').length} | 
               <strong>Warning:</strong> ${results.filter(r => r.status === 'warning').length} | 
               <strong>Danger:</strong> ${results.filter(r => r.status === 'danger').length}</p>
          </div>
        </div>
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">Trainee Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Trainer Signature</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Generated on ${currentDate} at ${currentTime}</p>
          <p>Physiotherapy Equipment Maintenance Learning App</p>
        </div>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    
    reportWindow.document.write(html);
    reportWindow.document.close();
  };

  // Generate chart SVG for report
  const generateChartSvg = (results: SimulationResult[], chartTitle: string) => {
    const numericResults = results.filter(r => r.numericValue !== undefined);
    
    if (numericResults.length === 0) return '<p>No numeric data to display</p>';
    
    const chartWidth = 600;
    const chartHeight = 300;
    const padding = { top: 40, right: 40, bottom: 60, left: 70 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    
    const values = numericResults.map(r => r.numericValue || 0);
    const maxValue = Math.max(...values) * 1.1;
    const minValue = Math.min(0, Math.min(...values));
    const valueRange = maxValue - minValue;
    
    const points = numericResults.map((result, index) => {
      const x = padding.left + (index / (numericResults.length - 1 || 1)) * plotWidth;
      const y = padding.top + plotHeight - ((result.numericValue! - minValue) / valueRange) * plotHeight;
      return { x, y, result, index };
    });
    
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${padding.top + plotHeight} L ${padding.left} ${padding.top + plotHeight} Z`;
    
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minValue + (valueRange * i / yTicks));
    
    const getPointColor = (status: string) => {
      switch (status) {
        case 'warning': return '#f59e0b';
        case 'danger': return '#ef4444';
        default: return '#10b981';
      }
    };
    
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
        
        ${points.map(p => `
          <line x1="${p.x}" y1="${padding.top}" x2="${p.x}" y2="${padding.top + plotHeight}" stroke="#f3f4f6" stroke-width="1" />
        `).join('')}
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
          </linearGradient>
        </defs>
        
        <path d="${areaPath}" fill="url(#gradient)" opacity="0.3" />
        <path d="${linePath}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="8" fill="white" stroke="${getPointColor(p.result.status)}" stroke-width="3" />
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="${getPointColor(p.result.status)}" />
          <text x="${p.x}" y="${p.y - 15}" text-anchor="middle" font-size="10" font-weight="bold" fill="#374151">${p.result.value}</text>
        `).join('')}
        
        ${points.map(p => `
          <text x="${p.x}" y="${chartHeight - 25}" text-anchor="middle" font-size="9" fill="#6b7280" transform="rotate(-45, ${p.x}, ${chartHeight - 25})">
            ${p.result.parameter.length > 12 ? p.result.parameter.substring(0, 12) + '...' : p.result.parameter}
          </text>
        `).join('')}
        
        <text x="20" y="${chartHeight / 2}" text-anchor="middle" font-size="12" fill="#374151" transform="rotate(-90, 20, ${chartHeight / 2})">Value</text>
        <text x="${chartWidth / 2}" y="${chartHeight - 5}" text-anchor="middle" font-size="12" fill="#374151">Parameters</text>
        <text x="${chartWidth / 2}" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e40af">${chartTitle} - Parameter Analysis</text>
        
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

  return (
    <div 
      ref={panelRef}
      className="simulation-panel bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 my-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-indigo-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {parameters.map((param) => (
          <div key={param.key} className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.name} ({param.unit})
            </label>
            {param.type === "select" && param.options ? (
              <select
                value={paramValues[param.key] as string}
                onChange={(e) => handleParamChange(param.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {param.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step || 1}
                value={paramValues[param.key] as number}
                onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{param.min}</span>
              <span className="font-bold text-indigo-600">
                {paramValues[param.key]} {param.unit}
              </span>
              <span>{param.max}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Run Simulation
            </>
          )}
        </button>
        {results && (
          <button
            onClick={handlePrintSimulation}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print Report
          </button>
        )}
        <button
          onClick={resetSimulation}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Results */}
      {results && (
        <div ref={resultsRef} className="simulation-results bg-white rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Simulation Results</h4>
          
          {/* Results Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left font-semibold">Parameter</th>
                  <th className="px-4 py-2 text-left font-semibold">Value</th>
                  <th className="px-4 py-2 text-left font-semibold">Unit</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-2">{result.parameter}</td>
                    <td className="px-4 py-2 font-bold">{result.value}</td>
                    <td className="px-4 py-2">{result.unit}</td>
                    <td className="px-4 py-2">
                      <StatusIndicator status={result.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Line Chart */}
          <div className="mb-6 overflow-x-auto">
            <LineChart results={results} title={`${title} - Parameter Analysis`} />
          </div>
          
          {/* Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">Summary</h5>
            <p className="text-sm text-gray-700">
              Total parameters: {results.length} | 
              Normal: {results.filter(r => r.status === 'normal').length} | 
              Warning: {results.filter(r => r.status === 'warning').length} | 
              Danger: {results.filter(r => r.status === 'danger').length}
            </p>
          </div>
        </div>
      )}
      
      {/* Trainee Info Dialog */}
      {showTraineeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Trainee Information</h2>
            <p className="text-gray-600 mb-4">
              Please enter your details before generating the simulation report for <strong>{equipmentName || title}</strong>
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const info: TraineeInfo = {
                name: formData.get('name') as string,
                registrationNumber: formData.get('regNumber') as string,
              };
              if (info.name.trim() && info.registrationNumber.trim()) {
                generateSimulationReport(info);
              }
            }}>
              <div className="mb-4">
                <label htmlFor="sim-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Trainee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sim-name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="sim-regNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sim-regNumber"
                  name="regNumber"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your registration number"
                  required
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTraineeDialog(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
