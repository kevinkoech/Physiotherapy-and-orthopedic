"use client";

import { useState, useRef } from "react";

interface SimulationResult {
  parameter: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "danger";
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
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #1e40af;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 10px;
            }
            h2 {
              color: #374151;
              margin-top: 20px;
            }
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
            }
            .status-normal { color: #059669; font-weight: bold; }
            .status-warning { color: #d97706; font-weight: bold; }
            .status-danger { color: #dc2626; font-weight: bold; }
            .timestamp {
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>${title} - Simulation Results</h1>
          <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
          
          <h2>Input Parameters</h2>
          <table>
            <tr><th>Parameter</th><th>Value</th><th>Unit</th></tr>
            ${parameters
              .map(
                (p) => `
              <tr>
                <td>${p.name}</td>
                <td>${paramValues[p.key]}</td>
                <td>${p.unit}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          
          <h2>Simulation Results</h2>
          <table>
            <tr><th>Parameter</th><th>Value</th><th>Unit</th><th>Status</th></tr>
            ${results
              .map(
                (r) => `
              <tr>
                <td>${r.parameter}</td>
                <td>${r.value}</td>
                <td>${r.unit}</td>
                <td class="status-${r.status}">${r.status.toUpperCase()}</td>
              </tr>
            `
              )
              .join("")}
          </table>
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
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 mb-6 border border-indigo-100">
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
      <div className="flex flex-wrap gap-3 mb-6">
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
        <div ref={resultsRef} className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Simulation Results
          </h4>
          <div className="overflow-x-auto">
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.status === "normal"
                            ? "bg-green-100 text-green-800"
                            : result.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
