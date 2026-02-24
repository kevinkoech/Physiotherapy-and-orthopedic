"use client";

import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function TissueEngineeringPage() {
  const equipmentName = "Tissue Engineering Bioreactor";

  const simulationParams = [
    { key: "temperature", name: "Culture Temperature", unit: "°C", min: 25, max: 40, default: 37, type: "number" as const },
    { key: "ph", name: "pH Level", unit: "", min: 6, max: 8, default: 7.4, type: "number" as const, step: 0.1 },
    { key: "dissolvedOxygen", name: "Dissolved Oxygen", unit: "%", min: 0, max: 100, default: 20, type: "number" as const },
    { key: "glucoseConcentration", name: "Glucose Concentration", unit: "g/L", min: 0, max: 4, default: 2, type: "number" as const },
    { key: "injectionVolume", name: "Media Injection Volume", unit: "mL", min: 0, max: 50, default: 10, type: "number" as const },
    { key: "cultureTime", name: "Culture Time", unit: "h", min: 0, max: 96, default: 24, type: "number" as const },
    { key: "agitationSpeed", name: "Agitation Speed", unit: "rpm", min: 0, max: 200, default: 50, type: "number" as const },
    { key: "injectionInterval", name: "Injection Interval", unit: "h", min: 0.1, max: 24, default: 6, type: "number" as const },
    { key: "co2Concentration", name: "CO₂ Concentration", unit: "%", min: 0, max: 10, default: 5, type: "number" as const },
    { key: "mediaReplacementRate", name: "Media Replacement Rate", unit: "%", min: 0, max: 100, default: 20, type: "number" as const },
  ];

  const simulate = (params: Record<string, number | string>) => {
    const temperature = params.temperature as number;
    const ph = params.ph as number;
    const dissolvedOxygen = params.dissolvedOxygen as number;
    const glucoseConcentration = params.glucoseConcentration as number;
    const injectionVolume = params.injectionVolume as number;
    const cultureTime = params.cultureTime as number;
    const agitationSpeed = params.agitationSpeed as number;
    const injectionInterval = params.injectionInterval as number;
    const co2Concentration = params.co2Concentration as number;
    const mediaReplacementRate = params.mediaReplacementRate as number;

    const temperatureStatus = temperature >= 35 && temperature <= 39 ? "normal" as const : "warning" as const;
    const phStatus = ph >= 7.2 && ph <= 7.6 ? "normal" as const : "warning" as const;
    const doStatus = dissolvedOxygen >= 15 && dissolvedOxygen <= 25 ? "normal" as const : "warning" as const;
    const glucoseStatus = glucoseConcentration >= 1.5 && glucoseConcentration <= 2.5 ? "normal" as const : "warning" as const;
    const volumeStatus = injectionVolume >= 5 && injectionVolume <= 15 ? "normal" as const : "warning" as const;
    const timeStatus = cultureTime >= 12 && cultureTime <= 48 ? "normal" as const : "warning" as const;
    const speedStatus = agitationSpeed >= 30 && agitationSpeed <= 70 ? "normal" as const : "warning" as const;
    const intervalStatus = injectionInterval >= 4 && injectionInterval <= 8 ? "normal" as const : "warning" as const;
    const co2Status = co2Concentration >= 4 && co2Concentration <= 6 ? "normal" as const : "warning" as const;
    const replacementStatus = mediaReplacementRate >= 15 && mediaReplacementRate <= 25 ? "normal" as const : "warning" as const;

    return [
      { parameter: "Culture Temperature", value: temperature.toFixed(1), unit: "°C", status: temperatureStatus, numericValue: temperature, min: 25, max: 40 },
      { parameter: "pH Level", value: ph.toFixed(1), unit: "", status: phStatus, numericValue: ph, min: 6, max: 8 },
      { parameter: "Dissolved Oxygen", value: dissolvedOxygen.toFixed(1), unit: "%", status: doStatus, numericValue: dissolvedOxygen, min: 0, max: 100 },
      { parameter: "Glucose Concentration", value: glucoseConcentration.toFixed(1), unit: "g/L", status: glucoseStatus, numericValue: glucoseConcentration, min: 0, max: 4 },
      { parameter: "Media Injection Volume", value: injectionVolume.toFixed(1), unit: "mL", status: volumeStatus, numericValue: injectionVolume, min: 0, max: 50 },
      { parameter: "Culture Time", value: cultureTime.toFixed(1), unit: "h", status: timeStatus, numericValue: cultureTime, min: 0, max: 96 },
      { parameter: "Agitation Speed", value: agitationSpeed.toFixed(1), unit: "rpm", status: speedStatus, numericValue: agitationSpeed, min: 0, max: 200 },
      { parameter: "Injection Interval", value: injectionInterval.toFixed(1), unit: "h", status: intervalStatus, numericValue: injectionInterval, min: 0.1, max: 24 },
      { parameter: "CO₂ Concentration", value: co2Concentration.toFixed(1), unit: "%", status: co2Status, numericValue: co2Concentration, min: 0, max: 10 },
      { parameter: "Media Replacement Rate", value: mediaReplacementRate.toFixed(1), unit: "%", status: replacementStatus, numericValue: mediaReplacementRate, min: 0, max: 100 },
    ];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="print:hidden mb-6">
        <PrintButton title={equipmentName} />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 printable-content">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">🧬 Tissue Engineering Bioreactor</h1>
          <p className="text-emerald-100">Comprehensive maintenance and calibration guide</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-gray-50 rounded-lg p-6 border-l-4 border-emerald-500">
                <h2 className="text-xl font-bold text-emerald-700 mb-3">📋 Overview</h2>
                <p className="text-gray-700 mb-4">
                  Tissue engineering bioreactors are specialized devices used to culture and grow biological tissues in a controlled environment. They provide precise regulation of physical, chemical, and biological parameters to support cell growth, differentiation, and tissue formation.
                </p>
                <div className="bg-white rounded border p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Key Features:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Precise temperature and pH control</li>
                    <li>Dissolved oxygen monitoring and control</li>
                    <li>Agitation systems for mixing</li>
                    <li>Media injection and replacement systems</li>
                    <li>Real-time monitoring of culture parameters</li>
                    <li>Sterile operation with contamination control</li>
                    <li>Programmable culture protocols</li>
                    <li>Data logging and analysis capabilities</li>
                  </ul>
                </div>
              </section>

              {/* Main Parts */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-500">🔧 Main Parts & Components</h2>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">1. Culture Vessel</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Biocompatible materials (glass or stainless steel)</li>
                      <li>Sterile design with sealed connections</li>
                      <li>Volume capacities from 100mL to 100L</li>
                      <li>Multiple ports for sensors and sampling</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">2. Temperature Control System</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Water jacket or heating mantel</li>
                      <li>Temperature sensors (RTD or thermocouple)</li>
                      <li>PID controller for precise regulation</li>
                      <li>Temperature range: 25-40°C (37°C optimal)</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">3. pH Control System</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>pH electrodes (combination glass electrode)</li>
                      <li>Acid and base addition pumps</li>
                      <li>Buffer solution reservoirs</li>
                      <li>pH range: 6.0-8.0 (7.4 optimal)</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">4. Oxygenation System</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Gas spargers for aeration</li>
                      <li>Dissolved oxygen sensors</li>
                      <li>Gas flow controllers (O₂, CO₂, N₂)</li>
                      <li>Oxygen transfer rate monitoring</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">5. Agitation System</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Magnetic stirrer or impeller</li>
                      <li>Variable speed controller</li>
                      <li>Agitation speed: 0-200 rpm</li>
                      <li>Prevents cell sedimentation</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">6. Media Management System</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Media reservoirs and storage</li>
                      <li>Peristaltic pumps for media transfer</li>
                      <li>Sampling ports for analysis</li>
                      <li>Waste collection system</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">7. Control & Monitoring System</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Touchscreen interface</li>
                      <li>Data acquisition system</li>
                      <li>Alarms and safety interlocks</li>
                      <li>Remote monitoring capabilities</li>
                      <li>Data logging and reporting</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Circuit Diagram */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-500">⚡ Circuit Diagram</h2>
                <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="mb-4">
                    <p className="font-semibold text-emerald-400 mb-2">Main Control Circuit</p>
                    <pre>
┌─────────────────────────────────────────────────────────┐
│                     MAIN CONTROLLER                     │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │ Temperature │   │ pH Sensor   │   │ O₂ Sensor    │  │
│  │ Sensor (RTD)│──▶│ (Glass)     │──▶│ (Optode)     │──▶│
│  └─────────────┘   └─────────────┘   └──────────────┘  │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │ Level Sensor│   │ Pressure    │   │ Flow Sensors │  │
│  │ (Capacitive)│──▶│ Sensor      │──▶│ (Ultrasonic) │──▶│
│  └─────────────┘   └─────────────┘   └──────────────┘  │
│                        │                               │
│                        ▼                               │
│                ┌──────────────┐                        │
│                │ PID CONTROL  │                        │
│                │ ALGORITHM    │                        │
│                └──────┬───────┘                        │
│                       │                                │
│    ┌──────────────────┼──────────────────┐             │
│    │                  │                  │             │
│    ▼                  ▼                  ▼             │
│┌──────────┐      ┌──────────┐      ┌──────────┐        │
││ Heater   │      │ pH Pumps │      │ O₂ Valve │        │
││ Control  │      │ Control  │      │ Control  │        │
│└──────────┘      └──────────┘      └──────────┘        │
│                                                       │
└───────────────────────────────────────────────────────┘
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500"></div>
                      <span>Sensor Input</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500"></div>
                      <span>Control Output</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500"></div>
                      <span>Data Processing</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fault Diagnosis */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-500">⚠️ Fault Diagnosis & Troubleshooting</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-emerald-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Symptom</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Possible Causes</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Diagnosis Procedure</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Solution</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Temperature fluctuations</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Heater malfunction, sensor drift, controller failure</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Check sensor calibration<br/>2. Monitor heater current<br/>3. Test controller responsiveness</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Replace faulty sensor, repair heater, calibrate controller</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">pH control issues</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Electrode fouling, pump failure, buffer depletion</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Calibrate pH electrode<br/>2. Test pump functionality<br/>3. Check buffer levels</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Clean or replace electrode, repair pumps, replace buffers</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Low dissolved oxygen</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Aeration failure, sensor error, blockage</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Check oxygen sensor<br/>2. Verify gas flow<br/>3. Inspect sparger</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Clean sensor, unblock lines, replace sparger</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Agitation failure</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Motor failure, drive belt issue, controller fault</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Check motor connections<br/>2. Inspect belt tension<br/>3. Test controller outputs</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Replace motor, adjust belt, repair controller</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Media injection problems</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Pump failure, line blockage, valve issues</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Test pump performance<br/>2. Check line pressure<br/>3. Inspect valves</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Repair/replace pump, clear lines, replace valves</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Alarm system active</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Parameter out of range, sensor failure, system fault</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Check alarm log<br/>2. Verify sensor readings<br/>3. Inspect affected system</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Adjust parameters, replace sensor, repair system</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Data acquisition failure</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Communication error, software issue, hardware failure</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1. Check connections<br/>2. Restart software<br/>3. Test communication</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Reconnect cables, reinstall software, replace hardware</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Maintenance */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-500">🛠️ Maintenance Procedures</h2>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Daily Maintenance</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Check temperature, pH, and DO levels</li>
                      <li>Inspect culture vessel for contamination</li>
                      <li>Verify media levels and concentrations</li>
                      <li>Check pump and agitator operation</li>
                      <li>Review alarm log and system status</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Weekly Maintenance</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Calibrate temperature and pH sensors</li>
                      <li>Clean culture vessel and sensors</li>
                      <li>Inspect and clean spargers and filters</li>
                      <li>Verify pump and valve performance</li>
                      <li>Check lubrication levels</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Monthly Maintenance</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Calibrate all sensors and instruments</li>
                      <li>Inspect electrical connections and components</li>
                      <li>Test alarm and safety systems</li>
                      <li>Check for wear and tear on moving parts</li>
                      <li>Clean and maintain control system</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Annual Maintenance</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Complete system calibration</li>
                      <li>Replace worn or outdated components</li>
                      <li>Inspect and service all motors and pumps</li>
                      <li>Test all safety features and interlocks</li>
                      <li>Review and update maintenance records</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Safety Tests */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-500">🛡️ Safety Tests & Calibration</h2>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">✓ Temperature Calibration</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>Place calibrated reference thermometer in vessel</li>
                      <li>Set controller to 37°C and stabilize</li>
                      <li>Compare readings and adjust calibration</li>
                      <li>Repeat at 30°C and 40°C</li>
                      <li>Documentation: Record calibration data and next due date</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">✓ pH Calibration</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>Clean and store electrode properly</li>
                      <li>Calibrate using pH 7.0 and pH 4.0 buffers</li>
                      <li>Verify calibration using pH 10.0 buffer</li>
                      <li>Check response time and slope</li>
                      <li>Documentation: Calibration report with buffer values</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">✓ Oxygen Sensor Calibration</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>Calibrate using zero gas (nitrogen) and air</li>
                      <li>Check sensor response to varying O₂ levels</li>
                      <li>Verify DO measurements at saturation</li>
                      <li>Check sensor drift over time</li>
                      <li>Documentation: Calibration curve and sensor performance</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">✓ Pressure and Leakage Testing</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>Pressurize system to operating pressure</li>
                      <li>Check for leaks using soapy water</li>
                      <li>Verify pressure sensor readings</li>
                      <li>Test pressure relief valves</li>
                      <li>Documentation: Leakage report and pressure measurements</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">✓ Flow Rate Verification</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>Test media injection pumps at various flow rates</li>
                      <li>Verify pump calibration and accuracy</li>
                      <li>Check flow sensor readings against reference</li>
                      <li>Inspect pump seals for wear</li>
                      <li>Documentation: Flow rate calibration data</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">✓ Safety System Test</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>Test emergency stop button functionality</li>
                      <li>Verify over-temperature and over-pressure alarms</li>
                      <li>Check power failure recovery system</li>
                      <li>Test door interlocks and safety switches</li>
                      <li>Documentation: Safety test report with pass/fail results</li>
                    </ol>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Simulation Panel */}
            <div className="lg:col-span-1">
              <SimulationPanel 
                title={equipmentName}
                description="Simulate bioreactor parameters for tissue engineering applications"
                parameters={simulationParams}
                simulate={simulate}
                equipmentName={equipmentName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
