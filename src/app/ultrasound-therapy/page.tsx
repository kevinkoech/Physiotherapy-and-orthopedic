"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function UltrasoundTherapyPage() {
  // Ultrasound Therapy Simulation Function
  const simulateUltrasoundTherapy = (params: Record<string, number | string>) => {
    const frequency = params.frequency as number;
    const intensity = params.intensity as number;
    const treatmentTime = params.treatmentTime as number;
    const dutyCycle = params.dutyCycle as number;
    const mode = params.mode as string;
    
    // Calculate derived parameters
    const wavelength = 1540 / (frequency * 1000); // mm (using speed of sound in soft tissue ~1540 m/s)
    const penetrationDepth = wavelength * 3; // mm (approximate effective penetration)
    const halfValueLayer = 5 + (frequency / 10); // mm (approximate HVL in muscle)
    const totalEnergy = intensity * treatmentTime * 60 * (dutyCycle / 100); // Joules
    const avgIntensity = intensity * (dutyCycle / 100); // W/cm² average
    const spatialPeakIntensity = intensity * 1.5; // W/cm² (approximate SP/SA ratio)
    
    // Thermal effects
    const tempRise = (intensity * 0.5 * treatmentTime) / 10; // °C approximate
    const thermalStatus: "normal" | "warning" | "danger" = tempRise > 4 ? "danger" : tempRise > 2.5 ? "warning" : "normal";
    
    // Safety thresholds
    const intensityStatus = intensity > 3 ? "danger" as const : intensity > 2 ? "warning" as const : "normal" as const;
    const frequencyStatus = frequency > 3 ? "warning" as const : "normal" as const;
    const dutyCycleStatus = dutyCycle > 50 ? "warning" as const : "normal" as const;
    const energyStatus = totalEnergy > 5000 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Wavelength", value: wavelength.toFixed(3), unit: "mm", status: "normal" as const, numericValue: wavelength, min: 0, max: 1.5 },
      { parameter: "Penetration Depth", value: penetrationDepth.toFixed(1), unit: "mm", status: "normal" as const, numericValue: penetrationDepth, min: 0, max: 50 },
      { parameter: "Half-Value Layer", value: halfValueLayer.toFixed(1), unit: "mm", status: "normal" as const, numericValue: halfValueLayer, min: 0, max: 20 },
      { parameter: "Total Energy", value: totalEnergy.toFixed(0), unit: "J", status: energyStatus, numericValue: totalEnergy, min: 0, max: 10000 },
      { parameter: "Average Intensity", value: avgIntensity.toFixed(2), unit: "W/cm²", status: intensityStatus, numericValue: avgIntensity, min: 0, max: 3 },
      { parameter: "Spatial Peak Intensity", value: spatialPeakIntensity.toFixed(2), unit: "W/cm²", status: intensityStatus, numericValue: spatialPeakIntensity, min: 0, max: 4.5 },
      { parameter: "Est. Temp Rise", value: tempRise.toFixed(1), unit: "°C", status: thermalStatus, numericValue: tempRise, min: 0, max: 5 },
      { parameter: "Treatment Mode", value: mode, unit: "", status: "normal" as const },
    ];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Ultrasound Therapy</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🔊 Ultrasound Therapy Equipment</h1>
        <p className="text-cyan-100">Learning Outcome: Perform Ultrasound Therapy Equipment Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests","Calibration"].map(t => (
            <span key={t} className="bg-cyan-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {/* Print/Export Buttons */}
        <div className="mt-4">
          <PrintButton title="Ultrasound Therapy Equipment - Learning Notes" />
        </div>
      </div>

      {/* Printable Content Wrapper */}
      <div id="printable-content">

      {/* Simulation Panel */}
      <SimulationPanel
        title="Ultrasound Therapy Simulator"
        description="Configure ultrasound parameters to see tissue effects and safety indicators"
        parameters={[
          { name: "Frequency", key: "frequency", unit: "MHz", min: 1, max: 3, step: 0.5, default: 1 },
          { name: "Intensity", key: "intensity", unit: "W/cm²", min: 0.5, max: 3, step: 0.1, default: 1.5 },
          { name: "Treatment Time", key: "treatmentTime", unit: "min", min: 3, max: 15, step: 1, default: 8 },
          { name: "Duty Cycle", key: "dutyCycle", unit: "%", min: 10, max: 100, step: 10, default: 20 },
          { 
            name: "Mode", 
            key: "mode", 
            unit: "", 
            min: 0, 
            max: 0, 
            default: "Continuous",
            type: "select",
            options: [
              { value: "Continuous", label: "Continuous (Thermal)" },
              { value: "Pulsed 1:1", label: "Pulsed 1:1 (50%)" },
              { value: "Pulsed 1:4", label: "Pulsed 1:4 (20%)" },
              { value: "Pulsed 1:9", label: "Pulsed 1:9 (10%)" },
            ]
          }
        ]}
        simulate={simulateUltrasoundTherapy}
      />

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Introduction */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">📖 Introduction</h2>
          <p className="text-gray-700 mb-4">
            Ultrasound therapy uses high-frequency sound waves (typically 0.8-3 MHz) to treat musculoskeletal 
            conditions. The mechanical vibrations produce thermal and non-thermal effects in tissues, 
            promoting healing and pain relief. It is one of the most widely used modalities in physiotherapy.
          </p>
          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4">
            <p className="text-sm text-cyan-800">
              <strong>Key Principle:</strong> Ultrasound waves are longitudinal pressure waves that cause 
              molecular vibration, producing heat through friction and mechanical effects at cellular level.
            </p>
          </div>
        </section>

        {/* Main Parts */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">🔧 Main Parts</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">1. High-Frequency Generator</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>RF oscillator circuit (produces 0.8-3 MHz signal)</li>
            <li>Frequency synthesizer for precise control</li>
            <li>Power amplifier (boosts signal to therapeutic levels)</li>
            <li>Modulator for pulsed/continuous modes</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Transducer (Treatment Head)</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Piezoelectric crystal (lead zirconate titanate - PZT)</li>
            <li>Crystal diameter: 2-5 cm (effective radiating area)</li>
            <li>Matching layer for acoustic impedance coupling</li>
            <li>Protective housing with cable connector</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Control Panel</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Frequency selector (1 MHz / 3 MHz)</li>
            <li>Intensity control (0.1-3.0 W/cm²)</li>
            <li>Treatment timer (1-30 minutes)</li>
            <li>Duty cycle selector (continuous/pulsed)</li>
            <li>Mode indicators and displays</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Coupling Medium System</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Ultrasound gel reservoir (some models)</li>
            <li>Gel warmer (optional)</li>
            <li>Underwater treatment tank</li>
          </ul>

          {/* ASCII Diagram */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`
    ULTRASOUND THERAPY UNIT BLOCK DIAGRAM
    ══════════════════════════════════════
    
    ┌─────────────────────────────────────────────────────┐
    │                  CONTROL PANEL                       │
    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
    │  │ Freq    │ │Intensity│ │ Timer   │ │ Mode    │   │
    │  │ Select  │ │ Control │ │ Display │ │ Select  │   │
    │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
    └───────┼───────────┼───────────┼───────────┼────────┘
            │           │           │           │
            ▼           ▼           ▼           ▼
    ┌─────────────────────────────────────────────────────┐
    │              HIGH FREQUENCY GENERATOR                │
    │  ┌──────────┐   ┌──────────┐   ┌──────────┐        │
    │  │ Crystal  │   │   RF     │   │  Power   │        │
    │  │Oscillator├──►│Amplifier ├──►│Amplifier │        │
    │  └──────────┘   └──────────┘   └────┬─────┘        │
    └─────────────────────────────────────┼──────────────┘
                                          │
                                          ▼
    ┌─────────────────────────────────────────────────────┐
    │                    TRANSDUCER                        │
    │  ┌──────────────────────────────────────────────┐  │
    │  │           PIEZOELECTRIC CRYSTAL               │  │
    │  │     ┌─────────────────────────────┐          │  │
    │  │     │    PZT Ceramic Disc         │          │  │
    │  │     │    (Converts Electrical     │          │  │
    │  │     │     Energy to Sound Waves)  │          │  │
    │  │     └─────────────────────────────┘          │  │
    │  │                  ▼                            │  │
    │  │     ┌─────────────────────────────┐          │  │
    │  │     │    Matching Layer           │          │  │
    │  │     └─────────────────────────────┘          │  │
    │  └──────────────────────────────────────────────┘  │
    └─────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   COUPLING GEL        │
              │   (Acoustic Medium)   │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   PATIENT TISSUE      │
              └───────────────────────┘
`}</pre>
          </div>
        </section>

        {/* Types */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">📊 Types of Ultrasound Units</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-cyan-700 mb-2">By Frequency</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• <strong>1 MHz:</strong> Deep tissue (3-5 cm penetration)</li>
                <li>• <strong>3 MHz:</strong> Superficial tissue (1-2 cm penetration)</li>
                <li>• <strong>Dual frequency:</strong> Both 1 and 3 MHz options</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-cyan-700 mb-2">By Output Mode</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• <strong>Continuous:</strong> Thermal effects (100% duty cycle)</li>
                <li>• <strong>Pulsed:</strong> Non-thermal effects (10-50% duty cycle)</li>
                <li>• <strong>Combination:</strong> Both modes available</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-cyan-700 mb-2">By Portability</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• <strong>Desktop:</strong> Clinical use, full features</li>
                <li>• <strong>Portable:</strong> Battery/mains powered</li>
                <li>• <strong>Handheld:</strong> Compact, limited features</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-cyan-700 mb-2">By Application</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• <strong>Therapeutic:</strong> Rehabilitation settings</li>
                <li>• <strong>Diagnostic:</strong> Imaging purposes</li>
                <li>• <strong>Surgical:</strong> High-intensity focused (HIFU)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Uses */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">💊 Clinical Uses</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Thermal Effects (Continuous Mode)</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Joint contractures and adhesions</li>
                <li>• Muscle spasms and tightness</li>
                <li>• Tendon and ligament tightness</li>
                <li>• Chronic inflammation</li>
                <li>• Pain modulation</li>
                <li>• Increased tissue extensibility</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Non-Thermal Effects (Pulsed Mode)</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Acute inflammation</li>
                <li>• Tissue healing acceleration</li>
                <li>• Bone fracture healing</li>
                <li>• Wound healing</li>
                <li>• Soft tissue repair</li>
                <li>• Cellular membrane permeability</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Contraindications:</strong> Malignancy, pregnancy (over uterus), epiphyseal plates 
              in children, spinal cord transection, vascular insufficiency, infection, thrombosis.
            </p>
          </div>
        </section>

        {/* Circuit Diagram */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">⚡ Circuit Diagram</h2>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`
    ULTRASOUND GENERATOR CIRCUIT
    ════════════════════════════
    
                    ┌─────────────────────────────────────┐
                    │           POWER SUPPLY               │
                    │  ┌─────┐   ┌─────┐   ┌─────────┐    │
    AC ─────────────┼──┤ XFMR├──►│RECT ├──►│ FILTER  ├───┼───► +VCC
    Input           │  └─────┘   └─────┘   └─────────┘    │
                    │                          ┌─────┐    │
                    │                          │ REG ├───┼───► +5V
                    │                          └─────┘    │
                    └─────────────────────────────────────┘
    
    ┌───────────────────────────────────────────────────────────────┐
    │                    OSCILLATOR CIRCUIT                          │
    │                                                                │
    │       R1                                                       │
    │    ┌──/\/\──┐                                                  │
    │    │        │                                                  │
    │    │   ┌────┴────┐                                             │
    │    │   │  CRYSTAL │◄─── 1MHz or 3MHz Crystal                   │
    │    │   │ OSCILLATOR                                           │
    │    │   └────┬────┘                                             │
    │    │        │                                                  │
    │    │   ┌────┴────┐     ┌──────────┐                           │
    │    └──►│  GATE   ├────►│ DIVIDER  ├───► Frequency Select      │
    │        │ (TTL)   │     │  /2 /4   │                           │
    │        └─────────┘     └──────────┘                           │
    └───────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                    MODULATOR CIRCUIT                           │
    │                                                                │
    │    Continuous/Pulsed    ┌──────────┐                          │
    │    Select ─────────────►│  TIMER   │───► Duty Cycle Control   │
    │                         │ (555)    │                          │
    │                         └──────────┘                          │
    └───────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                    POWER AMPLIFIER                             │
    │                                                                │
    │                    ┌──────────┐                                │
    │    RF In ─────────►│  DRIVER  │                                │
    │                    │  STAGE   │                                │
    │                    └────┬─────┘                                │
    │                         │                                      │
    │                    ┌────┴─────┐                                │
    │                    │   PUSH   │◄─── Intensity Control         │
    │                    │  PULL    │     (Variable Supply)         │
    │                    │  OUTPUT  │                                │
    │                    └────┬─────┘                                │
    └─────────────────────────┼─────────────────────────────────────┘
                              │
                              ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                    OUTPUT STAGE                                │
    │                                                                │
    │                    ┌──────────┐                                │
    │    RF Power ──────►│ MATCHING │───► To Transducer             │
    │                    │ NETWORK  │     (Piezoelectric Crystal)   │
    │                    └──────────┘                                │
    └───────────────────────────────────────────────────────────────┘
`}</pre>
          </div>
        </section>

        {/* Fault Diagnosis */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">🔍 Fault Diagnosis</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-100">
                  <th className="border p-2 text-left">Fault Symptom</th>
                  <th className="border p-2 text-left">Possible Cause</th>
                  <th className="border p-2 text-left">Solution</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="border p-2">No output from transducer</td>
                  <td className="border p-2">Blown fuse, faulty power supply, broken cable</td>
                  <td className="border p-2">Check fuse, test power supply, inspect cable continuity</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Low output intensity</td>
                  <td className="border p-2">Degraded crystal, faulty amplifier, poor coupling</td>
                  <td className="border p-2">Test crystal efficiency, check amplifier, verify gel</td>
                </tr>
                <tr>
                  <td className="border p-2">Intermittent output</td>
                  <td className="border p-2">Loose connections, worn cable, bad connector</td>
                  <td className="border p-2">Reseat connectors, replace cable, clean contacts</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Timer not working</td>
                  <td className="border p-2">Faulty timer IC, display malfunction</td>
                  <td className="border p-2">Replace timer circuit, check display connections</td>
                </tr>
                <tr>
                  <td className="border p-2">Overheating transducer</td>
                  <td className="border p-2">Continuous use without breaks, poor cooling</td>
                  <td className="border p-2">Allow cooling periods, check internal fan</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Erratic intensity display</td>
                  <td className="border p-2">Faulty potentiometer, ADC error</td>
                  <td className="border p-2">Clean/replace potentiometer, check ADC circuit</td>
                </tr>
                <tr>
                  <td className="border p-2">No display on panel</td>
                  <td className="border p-2">Power supply failure, display board fault</td>
                  <td className="border p-2">Check power rails, test display module</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Crystal not vibrating</td>
                  <td className="border p-2">Damaged piezoelectric element, broken connection</td>
                  <td className="border p-2">Replace transducer head, repair internal wiring</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Maintenance */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">🛠️ Maintenance Procedures</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Maintenance</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Clean transducer head with mild soap solution</li>
            <li>Wipe control panel with dry cloth</li>
            <li>Check cables for visible damage</li>
            <li>Verify gel dispenser (if equipped)</li>
            <li>Test power-on sequence</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekly Maintenance</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Inspect all connectors and cables</li>
            <li>Check transducer face for scratches or damage</li>
            <li>Verify timer accuracy</li>
            <li>Test all control functions</li>
            <li>Clean air vents and cooling fans</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Monthly Maintenance</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Perform output power measurement</li>
            <li>Check intensity calibration</li>
            <li>Inspect internal components (if qualified)</li>
            <li>Test safety interlocks</li>
            <li>Document all maintenance activities</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Annual Maintenance</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Full calibration by biomedical engineer</li>
            <li>Replace worn cables and connectors</li>
            <li>Comprehensive safety testing</li>
            <li>Update maintenance records</li>
            <li>Performance verification against specifications</li>
          </ul>
        </section>

        {/* Safety Tests */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">⚠️ Safety Tests</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-100">
                  <th className="border p-2 text-left">Test</th>
                  <th className="border p-2 text-left">Method</th>
                  <th className="border p-2 text-left">Acceptable Range</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="border p-2">Earth Continuity</td>
                  <td className="border p-2">Measure resistance between earth pin and exposed metal</td>
                  <td className="border p-2">&lt; 0.2 Ω</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Insulation Resistance</td>
                  <td className="border p-2">Test at 500V DC between live and earth</td>
                  <td className="border p-2">&gt; 2 MΩ</td>
                </tr>
                <tr>
                  <td className="border p-2">Leakage Current (Earth)</td>
                  <td className="border p-2">Measure under normal and single fault conditions</td>
                  <td className="border p-2">&lt; 500 μA (normal)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Leakage Current (Patient)</td>
                  <td className="border p-2">Measure at transducer output</td>
                  <td className="border p-2">&lt; 100 μA</td>
                </tr>
                <tr>
                  <td className="border p-2">Output Power Accuracy</td>
                  <td className="border p-2">Compare displayed vs measured output</td>
                  <td className="border p-2">± 20% of set value</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Timer Accuracy</td>
                  <td className="border p-2">Compare with calibrated stopwatch</td>
                  <td className="border p-2">± 5% or ± 10 seconds</td>
                </tr>
                <tr>
                  <td className="border p-2">Transducer Surface Temp</td>
                  <td className="border p-2">Measure after 3 min continuous operation</td>
                  <td className="border p-2">&lt; 41°C (with coupling)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Calibration */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">📐 Calibration Guide</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Equipment Required</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Ultrasound power meter (radiation force balance)</li>
            <li>Calibrated stopwatch</li>
            <li>Digital multimeter</li>
            <li>Thermometer (for transducer surface temp)</li>
            <li>Acoustic coupling gel</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Calibration Steps</h3>
          <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
            <li>Allow equipment to warm up for 15 minutes</li>
            <li>Set unit to continuous mode, 1 MHz frequency</li>
            <li>Set intensity to 1.0 W/cm²</li>
            <li>Apply coupling gel to power meter target</li>
            <li>Place transducer on target with consistent pressure</li>
            <li>Measure actual power output (W)</li>
            <li>Calculate ERA: Power (W) / ERA (cm²) = Intensity (W/cm²)</li>
            <li>Compare measured vs displayed intensity</li>
            <li>Repeat for all intensity settings (0.5, 1.0, 1.5, 2.0, 2.5 W/cm²)</li>
            <li>Repeat for 3 MHz frequency</li>
            <li>Document all readings and adjustments</li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If readings are outside ±20% tolerance, the unit requires 
              recalibration or repair. Contact manufacturer for service procedures.
            </p>
          </div>
        </section>

        {/* Assessment */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">📝 Assessment Questions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">1. What is the typical frequency range used in therapeutic ultrasound?</p>
              <p className="text-sm text-gray-600">a) 20-200 Hz | b) 0.8-3 MHz | c) 10-50 MHz | d) 100-500 kHz</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">2. Which mode is preferred for acute inflammation treatment?</p>
              <p className="text-sm text-gray-600">a) Continuous | b) Pulsed | c) High intensity | d) Combination</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">3. What is the primary component in an ultrasound transducer?</p>
              <p className="text-sm text-gray-600">a) Electromagnet | b) Piezoelectric crystal | c) Thermistor | d) Photodiode</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">4. What is the acceptable earth leakage current limit?</p>
              <p className="text-sm text-gray-600">a) 100 μA | b) 500 μA | c) 1 mA | d) 10 mA</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">5. Which frequency provides deeper tissue penetration?</p>
              <p className="text-sm text-gray-600">a) 1 MHz | b) 3 MHz | c) 5 MHz | d) 10 MHz</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
            <p className="text-sm text-cyan-800">
              <strong>Answers:</strong> 1-b, 2-b, 3-b, 4-b, 5-a
            </p>
          </div>
        </section>

      </div>
      </div>
    </div>
  );
}
