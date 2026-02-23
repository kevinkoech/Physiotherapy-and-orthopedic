"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function ElectrotherapyPage() {
  // Electrotherapy Simulation Function - TENS/NMES/IFC
  const simulateElectrotherapy = (params: Record<string, number | string>) => {
    const frequency = params.frequency as number;
    const pulseWidth = params.pulseWidth as number;
    const current = params.current as number;
    const treatmentTime = params.treatmentTime as number;
    const modality = params.modality as string;
    
    // Calculate derived parameters based on modality
    let carrierFrequency = 0;
    let beatFrequency = 0;
    let wavelength = 0;
    
    if (modality === "TENS") {
      // TENS: High frequency, low intensity
      carrierFrequency = frequency;
      wavelength = 0; // Not applicable for TENS
    } else if (modality === "IFC") {
      // Interferential Current: Two carrier frequencies
      carrierFrequency = 4000; // Typical 4kHz carrier
      beatFrequency = frequency; // Beat frequency (1-150 Hz)
      wavelength = (1 / (carrierFrequency * 2 * Math.PI)) * 1000; // ms
    } else if (modality === "NMES") {
      // NMES: Lower frequency, higher intensity
      carrierFrequency = frequency;
    }
    
    // Calculate pulse charge (Q = I × t)
    const pulseCharge = (current * pulseWidth) / 1000; // μC
    
    // Calculate period and duty cycle
    const period = 1000 / frequency; // ms
    const dutyCycle = (pulseWidth / period) * 100; // %
    
    // Calculate average current
    const avgCurrent = current * (dutyCycle / 100); // mA
    
    // Calculate total energy (E = P × t = V × I × t)
    // Assuming typical skin resistance of 1kΩ
    const skinResistance = 1000; // Ω
    const peakPower = (current / 1000) * (current / 1000) * skinResistance; // W
    const avgPower = peakPower * (dutyCycle / 100); // W
    const totalEnergy = avgPower * treatmentTime * 60; // J
    
    // Calculate total pulses
    const totalPulses = frequency * treatmentTime * 60;
    
    // Rheobase and Chronaxie (strength-duration curve)
    const rheobase = current * 0.5; // mA (minimum current for infinite duration)
    const chronaxie = pulseWidth * 2; // μs (duration at 2x rheobase)
    
    // Safety thresholds
    const currentDensity = current / 5; // mA/cm² (assuming 5cm² electrode)
    const currentStatus = current > 100 ? "danger" as const : current > 80 ? "warning" as const : "normal" as const;
    const pulseStatus = pulseWidth > 500 ? "warning" as const : "normal" as const;
    const chargeStatus = pulseCharge > 50 ? "danger" as const : pulseCharge > 30 ? "warning" as const : "normal" as const;
    const densityStatus = currentDensity > 0.5 ? "danger" as const : currentDensity > 0.3 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Pulse Charge (Q)", value: pulseCharge.toFixed(2), unit: "μC", status: chargeStatus, numericValue: pulseCharge, min: 0, max: 60 },
      { parameter: "Period", value: period.toFixed(2), unit: "ms", status: "normal" as const, numericValue: period, min: 1, max: 1000 },
      { parameter: "Duty Cycle", value: dutyCycle.toFixed(1), unit: "%", status: "normal" as const, numericValue: dutyCycle, min: 0, max: 100 },
      { parameter: "Average Current", value: avgCurrent.toFixed(2), unit: "mA", status: currentStatus, numericValue: avgCurrent, min: 0, max: 100 },
      { parameter: "Current Density", value: currentDensity.toFixed(3), unit: "mA/cm²", status: densityStatus, numericValue: currentDensity, min: 0, max: 1 },
      { parameter: "Average Power", value: avgPower.toFixed(3), unit: "W", status: "normal" as const, numericValue: avgPower, min: 0, max: 10 },
      { parameter: "Total Energy", value: totalEnergy.toFixed(1), unit: "J", status: "normal" as const, numericValue: totalEnergy, min: 0, max: 10000 },
      { parameter: "Total Pulses", value: totalPulses.toLocaleString(), unit: "", status: "normal" as const, numericValue: totalPulses, min: 0, max: 1000000 },
      { parameter: "Rheobase", value: rheobase.toFixed(1), unit: "mA", status: "normal" as const, numericValue: rheobase, min: 0, max: 100 },
      { parameter: "Chronaxie", value: chronaxie.toFixed(0), unit: "μs", status: "normal" as const, numericValue: chronaxie, min: 0, max: 1000 },
      { parameter: "Modality", value: modality, unit: "", status: "normal" as const },
    ];
  };

  // Equipment-specific theory text for PDF
  const theoryText = `
    <h3>Fundamental Principles of Electrotherapy</h3>
    
    <h4>1. Ohm's Law in Electrotherapy</h4>
    <p><strong>V = I × R</strong></p>
    <p>Where V = voltage (V), I = current (A), R = resistance (Ω)</p>
    <p>In electrotherapy, skin resistance varies from 1-100 kΩ, affecting current delivery.</p>
    
    <h4>2. Strength-Duration Curve</h4>
    <p><strong>Rheobase:</strong> Minimum current intensity required to stimulate a nerve with an infinitely long duration pulse.</p>
    <p><strong>Chronaxie:</strong> Minimum duration required to stimulate a nerve at twice the rheobase intensity.</p>
    <p>Formula: <strong>I = Rh × (1 + t<sub>c</sub>/t)</strong></p>
    <p>Where I = current intensity, Rh = rheobase, t<sub>c</sub> = chronaxie, t = pulse duration</p>
    
    <h4>3. Pulse Charge Calculation</h4>
    <p><strong>Q = I × t</strong></p>
    <p>Where Q = charge (Coulombs), I = current (A), t = time (s)</p>
    <p>For therapeutic safety: Q should not exceed 20-50 μC per pulse.</p>
    
    <h4>4. Duty Cycle</h4>
    <p><strong>Duty Cycle = (Pulse Width / Period) × 100%</strong></p>
    <p>Higher duty cycles increase average current and heat generation.</p>
    
    <h4>5. Interferential Current (IFC) Beat Frequency</h4>
    <p><strong>f<sub>beat</sub> = |f<sub>1</sub> - f<sub>2</sub>|</strong></p>
    <p>Where f<sub>1</sub> and f<sub>2</sub> are carrier frequencies (typically 4000 Hz ± beat frequency)</p>
    
    <h4>6. Current Density</h4>
    <p><strong>J = I / A</strong></p>
    <p>Where J = current density (mA/cm²), I = current (mA), A = electrode area (cm²)</p>
    <p>Safety limit: J < 0.5 mA/cm² for surface electrodes</p>
    
    <h4>7. Nerve Fiber Types and Stimulation Thresholds</h4>
    <ul>
      <li><strong>Aα (Ia/Ib):</strong> Motor neurons - lowest threshold, chronaxie 30-50 μs</li>
      <li><strong>Aβ:</strong> Touch/pressure - low threshold, chronaxie 50-100 μs</li>
      <li><strong>Aδ:</strong> Sharp pain - medium threshold, chronaxie 150-200 μs</li>
      <li><strong>C fibers:</strong> Dull pain - highest threshold, chronaxie 300-500 μs</li>
    </ul>
    
    <h4>8. TENS Gate Control Theory</h4>
    <p>High-frequency TENS (50-100 Hz) activates Aβ fibers, inhibiting pain transmission at the spinal cord level through the "gate control" mechanism.</p>
    
    <h4>9. Motor Point Stimulation</h4>
    <p>Motor points are locations where motor nerves enter muscles. Stimulation at these points requires lower current intensity.</p>
    <p>Motor point current density is typically 2-3x higher than surrounding tissue.</p>
  `;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Electrotherapy Equipment</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-800 to-violet-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">⚡ Electrotherapy Equipment</h1>
        <p className="text-violet-100">Learning Outcome: Perform Electrotherapy Equipment Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["TENS","NMES","IFC","Principles","Fault Diagnosis","Maintenance","Safety Tests","Calibration"].map(t => (
            <span key={t} className="bg-violet-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {/* Print/Export Buttons */}
        <div className="mt-4">
          <PrintButton title="Electrotherapy Equipment - Learning Notes" theoryText={theoryText} />
        </div>
      </div>

      {/* Printable Content Wrapper */}
      <div id="printable-content">

      {/* Simulation Panel */}
      <SimulationPanel
        title="Electrotherapy Simulator"
        description="Configure stimulation parameters to analyze nerve stimulation and safety thresholds"
        parameters={[
          { name: "Frequency", key: "frequency", unit: "Hz", min: 1, max: 150, step: 1, default: 50 },
          { name: "Pulse Width", key: "pulseWidth", unit: "μs", min: 50, max: 500, step: 10, default: 200 },
          { name: "Current", key: "current", unit: "mA", min: 10, max: 120, step: 5, default: 50 },
          { name: "Treatment Time", key: "treatmentTime", unit: "min", min: 5, max: 30, step: 1, default: 15 },
          { 
            name: "Modality", 
            key: "modality", 
            unit: "", 
            min: 0, 
            max: 0, 
            default: "TENS",
            type: "select",
            options: [
              { value: "TENS", label: "TENS (Transcutaneous Electrical Nerve Stimulation)" },
              { value: "NMES", label: "NMES (Neuromuscular Electrical Stimulation)" },
              { value: "IFC", label: "IFC (Interferential Current)" },
            ]
          }
        ]}
        simulate={simulateElectrotherapy}
      />

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Introduction */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">📖 Introduction</h2>
          <p className="text-gray-700 mb-4">
            Electrotherapy encompasses a range of therapeutic modalities that use electrical currents to treat 
            various musculoskeletal and neurological conditions. The three primary modalities covered in this 
            module are TENS (pain management), NMES (muscle rehabilitation), and IFC (deep tissue stimulation).
          </p>
          <div className="bg-violet-50 border-l-4 border-violet-500 p-4">
            <p className="text-sm text-violet-800">
              <strong>Key Principle:</strong> Electrical stimulation works by depolarizing nerve cell membranes, 
              triggering action potentials that propagate along nerve fibers to produce therapeutic effects.
            </p>
          </div>
        </section>

        {/* Main Parts */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">🔧 Main Parts</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Pulse Generator Unit</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Microprocessor-based waveform generator</li>
            <li>Frequency synthesizer (1-150 Hz typical)</li>
            <li>Pulse width modulator (50-500 μs)</li>
            <li>Current-controlled output amplifier</li>
            <li>Isolation transformer for patient safety</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Output Stage</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Constant current source circuit</li>
            <li>Biphasic waveform generator</li>
            <li>Charge balancing circuit (prevents DC offset)</li>
            <li>Output protection circuitry</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Electrodes</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Self-adhesive conductive electrodes</li>
            <li>Carbon-impregnated silicone electrodes</li>
            <li>Conductive gel interface</li>
            <li>Lead wires with safety connectors</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Control Interface</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>LCD/LED display for parameters</li>
            <li>Intensity control knob/buttons</li>
            <li>Mode selection (TENS/NMES/IFC)</li>
            <li>Treatment timer</li>
          </ul>

          {/* ASCII Diagram */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`
    ELECTROTHERAPY UNIT BLOCK DIAGRAM
    ══════════════════════════════════
    
    ┌─────────────────────────────────────────────────────┐
    │                  CONTROL UNIT                        │
    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
    │  │ Freq    │ │ Pulse   │ │ Timer   │ │ Mode    │   │
    │  │ Control │ │ Width   │ │ Circuit │ │ Select  │   │
    │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
    └───────┼───────────┼───────────┼───────────┼────────┘
            │           │           │           │
            ▼           ▼           ▼           ▼
    ┌─────────────────────────────────────────────────────┐
    │              MICROCONTROLLER                         │
    │  ┌──────────────────────────────────────────────┐  │
    │  │     Waveform Generation Algorithm             │  │
    │  │     - Frequency synthesis                     │  │
    │  │     - Pulse width modulation                  │  │
    │  │     - Waveform shaping (symm/asymm)           │  │
    │  └──────────────────────────────────────────────┘  │
    └─────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────┐
    │              OUTPUT STAGE                            │
    │                                                      │
    │  ┌──────────┐   ┌──────────┐   ┌──────────┐        │
    │  │  DAC     ├──►│ Current  ├──►│ Isolation│        │
    │  │(Digital  │   │ Amplifier│   │Transform │        │
    │  │Analog)   │   │          │   │          │        │
    │  └──────────┘   └──────────┘   └────┬─────┘        │
    └─────────────────────────────────────┼──────────────┘
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                              ▼                       ▼
                    ┌──────────────┐       ┌──────────────┐
                    │  ELECTRODE 1 │       │  ELECTRODE 2 │
                    │  (Anode)     │       │  (Cathode)   │
                    └──────┬───────┘       └──────┬───────┘
                           │                      │
                           └──────────┬───────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │  PATIENT SKIN   │
                            │  (Tissue)       │
                            └─────────────────┘
`}</pre>
          </div>
        </section>

        {/* Types */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">📊 Types of Electrotherapy</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-violet-700 mb-2">TENS</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Frequency: 1-150 Hz</li>
                <li>• Pulse width: 50-200 μs</li>
                <li>• Intensity: Low (sensory level)</li>
                <li>• Purpose: Pain management</li>
                <li>• Mechanism: Gate control theory</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-violet-700 mb-2">NMES</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Frequency: 20-50 Hz</li>
                <li>• Pulse width: 200-400 μs</li>
                <li>• Intensity: High (motor level)</li>
                <li>• Purpose: Muscle strengthening</li>
                <li>• Mechanism: Muscle fiber recruitment</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-violet-700 mb-2">IFC</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Carrier: 4000 Hz typical</li>
                <li>• Beat frequency: 1-150 Hz</li>
                <li>• Penetration: Deep tissue</li>
                <li>• Purpose: Deep pain relief</li>
                <li>• Mechanism: Interference pattern</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Circuit Diagram */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">⚡ Circuit Diagram</h2>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`
    ELECTROTHERAPY OUTPUT CIRCUIT
    ══════════════════════════════
    
                    ┌─────────────────────────────────────┐
                    │           POWER SUPPLY               │
                    │  ┌─────┐   ┌─────┐   ┌─────────┐    │
    Battery ────────┼──┤ DC  ├──►│ REG ├──►│ ±VCC    ├───┼───► +V
                    │  │ DC  │   │     │   │         │    │
                    │  └─────┘   └─────┘   └─────────┘    │
                    └─────────────────────────────────────┘
    
    ┌───────────────────────────────────────────────────────────────┐
    │                    MICROCONTROLLER                             │
    │                                                                │
    │    ┌──────────────┐     ┌──────────────┐                      │
    │    │   TIMER      │     │   PWM        │                      │
    │    │   MODULE     ├────►│   GENERATOR  │───► Frequency Out    │
    │    └──────────────┘     └──────────────┘                      │
    │                                                                │
    │    ┌──────────────┐     ┌──────────────┐                      │
    │    │   ADC        │     │   DAC        │                      │
    │    │   INPUT      │◄────│   OUTPUT     │───► Amplitude Out    │
    │    └──────────────┘     └──────────────┘                      │
    └───────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                    CURRENT SOURCE                              │
    │                                                                │
    │                    ┌──────────┐                                │
    │    DAC In ────────►│ OP-AMP   │                                │
    │                    │ (Error   │                                │
    │                    │  Amp)    │                                │
    │                    └────┬─────┘                                │
    │                         │                                      │
    │                    ┌────┴─────┐                                │
    │                    │  POWER   │◄─── Feedback                   │
    │                    │  TRANSIS-│                                │
    │                    │  TOR     │                                │
    │                    └────┬─────┘                                │
    └─────────────────────────┼─────────────────────────────────────┘
                              │
                              ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                    OUTPUT PROTECTION                           │
    │                                                                │
    │                    ┌──────────┐                                │
    │    Current In ────►│ COUPLING │───► To Electrodes             │
    │                    │ CAPACITOR│     (Blocks DC)               │
    │                    └──────────┘                                │
    │                                                                │
    │                    ┌──────────┐                                │
    │                    │  ZENER   │───► Overvoltage Protection    │
    │                    │  DIODES  │                                │
    │                    └──────────┘                                │
    └───────────────────────────────────────────────────────────────┘
`}</pre>
          </div>
        </section>

        {/* Fault Diagnosis */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">🔍 Fault Diagnosis</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-violet-100">
                  <th className="border p-2 text-left">Fault Symptom</th>
                  <th className="border p-2 text-left">Possible Cause</th>
                  <th className="border p-2 text-left">Solution</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="border p-2">No output current</td>
                  <td className="border p-2">Blown fuse, dead battery, faulty output stage</td>
                  <td className="border p-2">Check fuse, replace battery, test output transistors</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Intermittent stimulation</td>
                  <td className="border p-2">Loose electrode connection, worn lead wires</td>
                  <td className="border p-2">Reseat electrodes, replace lead wires</td>
                </tr>
                <tr>
                  <td className="border p-2">Skin irritation/burns</td>
                  <td className="border p-2">DC offset, poor electrode contact, high current density</td>
                  <td className="border p-2">Check coupling capacitors, replace electrodes, reduce intensity</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Display not working</td>
                  <td className="border p-2">LCD failure, connection issue, firmware problem</td>
                  <td className="border p-2">Check display connections, reset device, update firmware</td>
                </tr>
                <tr>
                  <td className="border p-2">Timer malfunction</td>
                  <td className="border p-2">Crystal oscillator failure, software bug</td>
                  <td className="border p-2">Replace crystal, reset device, check firmware</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Uneven output between channels</td>
                  <td className="border p-2">Calibration drift, component tolerance</td>
                  <td className="border p-2">Recalibrate output, replace matched components</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Safety Tests */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">⚠️ Safety Tests</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-violet-100">
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
                  <td className="border p-2">Patient Leakage Current</td>
                  <td className="border p-2">Measure at electrode output</td>
                  <td className="border p-2">&lt; 100 μA DC, &lt; 10 μA AC</td>
                </tr>
                <tr>
                  <td className="border p-2">Output Accuracy</td>
                  <td className="border p-2">Compare displayed vs measured output</td>
                  <td className="border p-2">± 20% of set value</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">DC Offset</td>
                  <td className="border p-2">Measure DC component at output</td>
                  <td className="border p-2">&lt; 10 μA (charge balanced)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Assessment */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">📝 Assessment Questions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">1. What is the formula for pulse charge?</p>
              <p className="text-sm text-gray-600">a) Q = I × R | b) Q = I × t | c) Q = V × t | d) Q = P × t</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">2. What is the typical carrier frequency for IFC?</p>
              <p className="text-sm text-gray-600">a) 100 Hz | b) 1000 Hz | c) 4000 Hz | d) 10000 Hz</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">3. What is the safety limit for current density?</p>
              <p className="text-sm text-gray-600">a) 0.1 mA/cm² | b) 0.5 mA/cm² | c) 1.0 mA/cm² | d) 2.0 mA/cm²</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">4. Which nerve fiber type has the lowest stimulation threshold?</p>
              <p className="text-sm text-gray-600">a) Aδ | b) C | c) Aα | d) Aβ</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">5. What is the purpose of the coupling capacitor in the output stage?</p>
              <p className="text-sm text-gray-600">a) Filter noise | b) Block DC current | c) Boost voltage | d) Store energy</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-violet-50 rounded-lg">
            <p className="text-sm text-violet-800">
              <strong>Answers:</strong> 1-b, 2-c, 3-b, 4-c, 5-b
            </p>
          </div>
        </section>

      </div>
      </div>
    </div>
  );
}
