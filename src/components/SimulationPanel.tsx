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

// Bar Chart Component for visualization
function BarChart({ results }: { results: SimulationResult[] }) {
  const numericResults = results.filter(r => r.numericValue !== undefined);
  
  if (numericResults.length === 0) return null;
  
  const maxValue = Math.max(...numericResults.map(r => r.numericValue || 0));
  const chartHeight = 200;
  const barWidth = 60;
  const gap = 20;
  const chartWidth = numericResults.length * (barWidth + gap) + 40;

  return (
    <div className="simulation-chart" data-chart-type="bar">
      <svg width={chartWidth} height={chartHeight + 60} viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}>
        {/* Y-axis */}
        <line x1="30" y1="10" x2="30" y2={chartHeight + 10} stroke="#374151" strokeWidth="2" />
        {/* X-axis */}
        <line x1="30" y1={chartHeight + 10} x2={chartWidth - 10} y2={chartHeight + 10} stroke="#374151" strokeWidth="2" />
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <g key={percent}>
            <line 
              x1="30" 
              y1={chartHeight + 10 - (percent / 100) * chartHeight} 
              x2={chartWidth - 10} 
              y2={chartHeight + 10 - (percent / 100) * chartHeight} 
              stroke="#e5e7eb" 
              strokeWidth="1" 
              strokeDasharray="4"
            />
            <text x="25" y={chartHeight + 14 - (percent / 100) * chartHeight} textAnchor="end" fontSize="10" fill="#6b7280">
              {Math.round(maxValue * percent / 100)}
            </text>
          </g>
        ))}
        
        {/* Bars */}
        {numericResults.map((result, index) => {
          const barHeight = ((result.numericValue || 0) / maxValue) * chartHeight;
          const x = 40 + index * (barWidth + gap);
          const y = chartHeight + 10 - barHeight;
          
          let color = "#10b981"; // green for normal
          if (result.status === "warning") color = "#f59e0b"; // amber
          if (result.status === "danger") color = "#ef4444"; // red
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="4"
                className="transition-all duration-300"
              />
              {/* Value label */}
              <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">
                {result.value}
              </text>
              {/* Parameter label */}
              <text x={x + barWidth / 2} y={chartHeight + 25} textAnchor="middle" fontSize="9" fill="#6b7280">
                {result.parameter.length > 10 ? result.parameter.substring(0, 10) + "..." : result.parameter}
              </text>
              {/* Unit label */}
              <text x={x + barWidth / 2} y={chartHeight + 38} textAnchor="middle" fontSize="8" fill="#9ca3af">
                ({result.unit})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Gauge Component for single value visualization
function Gauge({ result }: { result: SimulationResult }) {
  if (result.numericValue === undefined || result.min === undefined || result.max === undefined) {
    return null;
  }
  
  const { numericValue, min, max, status } = result;
  const percentage = Math.min(100, Math.max(0, ((numericValue - min) / (max - min)) * 100));
  const angle = (percentage / 100) * 180 - 90;
  
  let color = "#10b981"; // green
  if (status === "warning") color = "#f59e0b"; // amber
  if (status === "danger") color = "#ef4444"; // red
  
  const centerX = 100;
  const centerY = 90;
  const radius = 70;
  const needleLength = 55;
  const needleX = centerX + needleLength * Math.cos((angle * Math.PI) / 180);
  const needleY = centerY + needleLength * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="simulation-gauge" data-chart-type="gauge">
      <svg width="200" height="130" viewBox="0 0 200 130">
        {/* Background arc */}
        <path
          d={`M 30 ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Colored arc segments */}
        <path
          d={`M 30 ${centerY} A ${radius} ${radius} 0 0 1 ${centerX - 30} ${centerY - radius + 10}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${centerX - 30} ${centerY - radius + 10} A ${radius} ${radius} 0 0 1 ${centerX + 30} ${centerY - radius + 10}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${centerX + 30} ${centerY - radius + 10} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r="8" fill={color} />
        {/* Value text */}
        <text x={centerX} y={centerY + 35} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
          {result.value} {result.unit}
        </text>
        {/* Min/Max labels */}
        <text x="25" y={centerY + 15} textAnchor="middle" fontSize="10" fill="#6b7280">{min}</text>
        <text x="175" y={centerY + 15} textAnchor="middle" fontSize="10" fill="#6b7280">{max}</text>
        {/* Parameter name */}
        <text x={centerX} y={centerY + 52} textAnchor="middle" fontSize="11" fill="#6b7280">
          {result.parameter}
        </text>
      </svg>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ status }: { status: "normal" | "warning" | "danger" }) {
  const config = {
    normal: { color: "#10b981", bg: "#d1fae5", label: "NORMAL", icon: "✓" },
    warning: { color: "#f59e0b", bg: "#fef3c7", label: "WARNING", icon: "⚠" },
    danger: { color: "#ef4444", bg: "#fee2e2", label: "DANGER", icon: "✕" },
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
      <span>{icon}</span>
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
  const resultsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Store results in a data attribute for print capture
  useEffect(() => {
    if (results && panelRef.current) {
      panelRef.current.setAttribute('data-simulation-results', JSON.stringify(results));
      panelRef.current.setAttribute('data-simulation-params', JSON.stringify(paramValues));
    }
  }, [results, paramValues]);

  const handleParamChange = (key: string, value: number | string) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
    setResults(null);
  };

  const runSimulation = () => {
    setIsRunning(true);
    
    // Simulate processing time
    setTimeout(() => {
      const simResults = simulate(paramValues);
      setResults(simResults);
      setIsRunning(false);
      
      // Scroll to results
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
  };

  const printResults = () => {
    if (!results) return;

    // Generate chart SVGs as strings for print
    const numericResults = results.filter(r => r.numericValue !== undefined);
    const maxValue = Math.max(...numericResults.map(r => r.numericValue || 0));
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
          ${numericResults.map((result, index) => {
            const barHeight = ((result.numericValue || 0) / maxValue) * chartHeight;
            const x = 40 + index * (barWidth + gap);
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
    const gaugeResults = results.filter(r => r.numericValue !== undefined && r.min !== undefined && r.max !== undefined);
    if (gaugeResults.length > 0) {
      gaugesSVG = gaugeResults.map((result) => {
        const percentage = Math.min(100, Math.max(0, ((result.numericValue! - result.min!) / (result.max! - result.min!)) * 100));
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

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the results");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Simulation Results</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              max-width: 900px;
              margin: 0 auto;
              color: #1f2937;
            }
            h1 {
              color: #1e40af;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 {
              color: #374151;
              margin-top: 25px;
              margin-bottom: 15px;
              font-size: 18px;
            }
            h3 {
              color: #4b5563;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 10px 12px;
              text-align: left;
            }
            th {
              background: #f3f4f6;
              font-weight: 600;
            }
            .status-normal { color: #059669; font-weight: bold; }
            .status-warning { color: #d97706; font-weight: bold; }
            .status-danger { color: #dc2626; font-weight: bold; }
            .timestamp {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .chart-container {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .gauges-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 10px;
              margin: 20px 0;
            }
            .summary-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              margin: 20px 0;
            }
            @media print {
              body { padding: 0; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <h1>${title} - Simulation Results</h1>
          <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
          
          <h2>Input Parameters</h2>
          <table>
            <tr><th>Parameter</th><th>Value</th><th>Unit</th></tr>
            ${parameters.map((p) => `
              <tr>
                <td>${p.name}</td>
                <td><strong>${paramValues[p.key]}</strong></td>
                <td>${p.unit}</td>
              </tr>
            `).join("")}
          </table>
          
          <h2>Simulation Results</h2>
          <table>
            <tr><th>Parameter</th><th>Value</th><th>Unit</th><th>Status</th></tr>
            ${results.map((r) => `
              <tr>
                <td>${r.parameter}</td>
                <td><strong>${r.value}</strong></td>
                <td>${r.unit}</td>
                <td class="status-${r.status}">${r.status.toUpperCase()}</td>
              </tr>
            `).join("")}
          </table>
          
          ${barChartSVG ? `
          <div class="chart-container">
            <h3>Results Visualization - Bar Chart</h3>
            ${barChartSVG}
          </div>
          ` : ''}
          
          ${gaugesSVG ? `
          <div class="chart-container">
            <h3>Results Visualization - Gauges</h3>
            <div class="gauges-container">
              ${gaugesSVG}
            </div>
          </div>
          ` : ''}
          
          <div class="summary-box">
            <h3>Summary</h3>
            <p>Total parameters simulated: ${results.length}</p>
            <p>Normal: ${results.filter(r => r.status === 'normal').length} | 
               Warning: ${results.filter(r => r.status === 'warning').length} | 
               Danger: ${results.filter(r => r.status === 'danger').length}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div 
      ref={panelRef} 
      className="simulation-panel bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 mb-6 border border-indigo-100"
      data-simulation-title={title}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>

      {/* Parameters Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
              <div className="space-y-2">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step || 1}
                  value={paramValues[param.key] as number}
                  onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <input
                  type="number"
                  min={param.min}
                  max={param.max}
                  step={param.step || 1}
                  value={paramValues[param.key] as number}
                  onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {param.min}</span>
              <span>Max: {param.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 no-print">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Simulation...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Simulation
            </>
          )}
        </button>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
        {results && (
          <button
            onClick={printResults}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Results
          </button>
        )}
      </div>

      {/* Results Display */}
      {results && (
        <div ref={resultsRef} className="simulation-results bg-white rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Simulation Results
          </h4>
          
          {/* Results Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Parameter</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-800">{result.parameter}</td>
                    <td className="px-4 py-3 font-mono font-medium">{result.value}</td>
                    <td className="px-4 py-3 text-gray-600">{result.unit}</td>
                    <td className="px-4 py-3">
                      <StatusIndicator status={result.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Bar Chart Visualization */}
          <div className="mb-6">
            <h5 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Results Bar Chart
            </h5>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <BarChart results={results} />
            </div>
          </div>
          
          {/* Gauge Visualizations */}
          {results.some(r => r.numericValue !== undefined && r.min !== undefined && r.max !== undefined) && (
            <div>
              <h5 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Parameter Gauges
              </h5>
              <div className="flex flex-wrap justify-center gap-4 bg-gray-50 rounded-lg p-4">
                {results
                  .filter(r => r.numericValue !== undefined && r.min !== undefined && r.max !== undefined)
                  .map((result, index) => (
                    <Gauge key={index} result={result} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
