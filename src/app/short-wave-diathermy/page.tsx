"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function ShortWaveDiathermyPage() {
  // SWD Simulation Function
  const simulateSWD = (params: Record<string, number | string>) => {
    const power = params.power as number;
    const frequency = params.frequency as number;
    const treatmentTime = params.treatmentTime as number;
    const electrodeGap = params.electrodeGap as number;
    
    // Calculate derived parameters
    const wavelength = 299.79 / frequency; // Speed of light / frequency (in meters)
    const penetrationDepth = 3 + (power / 100); // Approximate depth in cm
    const energyDelivered = (power * treatmentTime * 60) / 1000; // kJ
    const tissueTempRise = (power * 0.5 * treatmentTime) / 10; // Approximate temp rise in °C
    const sar = power / 70; // Specific Absorption Rate approximation (W/kg for 70kg person)
    
    // Determine status
    const powerStatus = power > 400 ? "danger" as const : power > 300 ? "warning" as const : "normal" as const;
    const tempStatus = tissueTempRise > 4 ? "danger" as const : tissueTempRise > 3 ? "warning" as const : "normal" as const;
    const sarStatus = sar > 4 ? "danger" as const : sar > 2 ? "warning" as const : "normal" as const;
    const timeStatus = treatmentTime > 30 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Wavelength", value: wavelength.toFixed(2), unit: "m", status: "normal" as const },
      { parameter: "Penetration Depth", value: penetrationDepth.toFixed(1), unit: "cm", status: "normal" as const },
      { parameter: "Energy Delivered", value: energyDelivered.toFixed(1), unit: "kJ", status: "normal" as const },
      { parameter: "Est. Tissue Temp Rise", value: tissueTempRise.toFixed(1), unit: "°C", status: tempStatus },
      { parameter: "SAR (Specific Absorption Rate)", value: sar.toFixed(2), unit: "W/kg", status: sarStatus },
      { parameter: "Output Power", value: power.toString(), unit: "W", status: powerStatus },
      { parameter: "Treatment Duration", value: treatmentTime.toString(), unit: "min", status: timeStatus },
      { parameter: "Electrode Gap", value: electrodeGap.toString(), unit: "cm", status: "normal" as const },
    ];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Short Wave Diathermy Machine</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">⚡ Short Wave Diathermy (SWD) Machine</h1>
        <p className="text-blue-100">Learning Outcome 1: Perform Short Wave Diathermy Machine Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests","Calibration"].map(t => (
            <span key={t} className="bg-blue-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {/* Print/Export Buttons */}
        <div className="mt-4">
          <PrintButton title="Short Wave Diathermy Machine - Learning Notes" />
        </div>
      </div>

      {/* Simulation Panel */}
      <SimulationPanel
        title="SWD Treatment Simulator"
        description="Adjust parameters to simulate SWD treatment outcomes and safety thresholds"
        parameters={[
          { name: "Output Power", key: "power", unit: "W", min: 10, max: 500, step: 10, default: 100 },
          { name: "Frequency", key: "frequency", unit: "MHz", min: 13.56, max: 40.68, step: 0.01, default: 27.12 },
          { name: "Treatment Time", key: "treatmentTime", unit: "min", min: 5, max: 30, step: 1, default: 15 },
          { name: "Electrode Gap", key: "electrodeGap", unit: "cm", min: 1, max: 5, step: 0.5, default: 2 },
        ]}
        simulate={simulateSWD}
      />

      {/* Printable Content Wrapper */}
      <div id="printable-content">

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          Short Wave Diathermy (SWD) is a therapeutic modality that uses high-frequency electromagnetic energy
          (typically <strong>27.12 MHz</strong>, wavelength ~11 meters) to produce deep tissue heating. It is
          widely used in physiotherapy for pain relief, muscle relaxation, and tissue healing.
        </p>
        <div className="note-box">
          <strong>📌 Key Fact:</strong> The ISM (Industrial, Scientific, Medical) band frequency allocated for SWD is
          <strong> 27.12 MHz ± 160 kHz</strong>. Some units also operate at 13.56 MHz or 40.68 MHz.
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Short Wave Diathermy Machine</h2>
        </div>

        {/* Block Diagram */}
        <h3 className="font-bold text-gray-800 mt-4 mb-2">🔷 Block Diagram</h3>
        <div className="diagram-box">
{`
  ┌─────────────────────────────────────────────────────────────────┐
  │                  SHORT WAVE DIATHERMY MACHINE                   │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
  │  │  MAINS   │───▶│  POWER   │───▶│ OSCILLATOR│───▶│ AMPLIFIER│  │
  │  │  INPUT   │    │  SUPPLY  │    │ 27.12 MHz │    │  STAGE   │  │
  │  │ 220-240V │    │  UNIT    │    │           │    │          │  │
  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
  │                                                        │        │
  │  ┌──────────┐    ┌──────────┐    ┌──────────┐         │        │
  │  │ PATIENT  │◀───│ ELECTRODE│◀───│  OUTPUT  │◀────────┘        │
  │  │ CIRCUIT  │    │  CABLES  │    │  TUNING  │                  │
  │  │          │    │          │    │  CIRCUIT │                  │
  │  └──────────┘    └──────────┘    └──────────┘                  │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
  │  │ CONTROL  │    │  TIMER   │    │  SAFETY  │                  │
  │  │  PANEL   │    │  CIRCUIT │    │ CIRCUITS │                  │
  │  └──────────┘    └──────────┘    └──────────┘                  │
  └─────────────────────────────────────────────────────────────────┘
`}
        </div>

        {/* Circuit Diagram */}
        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Simplified Circuit Diagram — Oscillator Stage</h3>
        <div className="circuit-diagram">
{`
  POWER SUPPLY                    HARTLEY OSCILLATOR (27.12 MHz)
  ─────────────                   ──────────────────────────────
  
  +HV ──┬──────────────────────────────────────────────┐
        │                                              │
       [R1]                                           [L1]──┬──[L2]
        │                                              │    │
        ├──────────────────────────────────────────[C1]┘   [C2]
        │                                                    │
       [T1]  Triode/Tetrode Valve                           │
       /│\   or Power Transistor                            │
      / │ \                                                 │
     G  P  K                                               │
     │  │  │                                               │
    [C3][R2][R3]                                           │
     │  │  │                                               │
  GND──┴──┴──────────────────────────────────────────────GND
  
  LEGEND:
  R1 = Plate/Collector Load Resistor
  L1,L2 = Tank Circuit Inductors (tapped)
  C1,C2 = Tank Circuit Capacitors
  C3 = Grid/Base Coupling Capacitor
  T1 = Active Device (Valve or Transistor)
  
  OUTPUT TUNING CIRCUIT:
  
  Oscillator ──[C_var]──┬──[L_output]──── To Electrodes
                        │
                       [C_tune]
                        │
                       GND
  
  C_var = Variable capacitor for output tuning
  L_output = Output coupling inductor
`}
        </div>

        {/* Parts Table */}
        <h3 className="font-bold text-gray-800 mt-6 mb-2">📋 Main Components Description</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Function</th>
                <th>Typical Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Power Supply Unit</strong></td><td>Converts mains AC to regulated DC voltages</td><td>HV: 300-600V DC; LV: 6-12V DC</td></tr>
              <tr><td><strong>Oscillator Circuit</strong></td><td>Generates high-frequency RF signal</td><td>27.12 MHz ± 160 kHz</td></tr>
              <tr><td><strong>Power Amplifier</strong></td><td>Amplifies RF signal to therapeutic levels</td><td>Output: 10-500W</td></tr>
              <tr><td><strong>Output Tuning Circuit</strong></td><td>Matches impedance between machine and patient</td><td>Variable capacitor 10-500 pF</td></tr>
              <tr><td><strong>Electrode Cables</strong></td><td>Transmit RF energy to treatment electrodes</td><td>Coaxial, shielded</td></tr>
              <tr><td><strong>Electrodes (Capacitor Pads)</strong></td><td>Apply electromagnetic field to patient tissue</td><td>Various sizes: 5×7 cm to 15×20 cm</td></tr>
              <tr><td><strong>Induction Coil (Monode)</strong></td><td>Applies magnetic field for inductive heating</td><td>Drum electrode or cable coil</td></tr>
              <tr><td><strong>Timer Circuit</strong></td><td>Controls treatment duration</td><td>0-30 minutes</td></tr>
              <tr><td><strong>Control Panel</strong></td><td>User interface for settings</td><td>Intensity, timer, mode controls</td></tr>
              <tr><td><strong>Safety Circuits</strong></td><td>Protects patient and operator</td><td>Overcurrent, overtemperature protection</td></tr>
              <tr><td><strong>Cooling System</strong></td><td>Prevents overheating of components</td><td>Fan-cooled or convection</td></tr>
              <tr><td><strong>Chassis/Cabinet</strong></td><td>Houses all components, provides shielding</td><td>Grounded metal enclosure</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Short Wave Diathermy Machine</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">🔥 Thermal Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Deep tissue heating (3-5 cm depth)</li>
              <li>Increased local blood circulation</li>
              <li>Muscle relaxation and spasm relief</li>
              <li>Reduction of joint stiffness</li>
              <li>Acceleration of metabolic processes</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-purple-800 mb-2">⚡ Non-Thermal (Pulsed) Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Tissue repair and wound healing</li>
              <li>Reduction of oedema (swelling)</li>
              <li>Anti-inflammatory effects</li>
              <li>Pain modulation</li>
              <li>Nerve regeneration support</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">🏥 Clinical Applications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Osteoarthritis and rheumatoid arthritis</li>
              <li>Sprains and strains</li>
              <li>Bursitis and tendinitis</li>
              <li>Pelvic inflammatory disease</li>
              <li>Sinusitis and otitis media</li>
              <li>Post-fracture rehabilitation</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Metallic implants in treatment area</li>
              <li>Cardiac pacemakers</li>
              <li>Pregnancy (especially abdomen/pelvis)</li>
              <li>Malignancy in treatment area</li>
              <li>Impaired sensation/circulation</li>
              <li>Active bleeding/haemorrhage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types of Operation */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Operation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">A. By Electrode Type</h3>
            <div className="diagram-box text-xs">
{`
  CAPACITIVE METHOD (Condenser Field)
  ─────────────────────────────────
  
  Electrode A          Electrode B
      │                    │
      ▼                    ▼
  ┌───────┐  E-field   ┌───────┐
  │  Pad  │ ─────────▶ │  Pad  │
  │  (+)  │ ←─────────  │  (-)  │
  └───────┘            └───────┘
      ↕                    ↕
   Air gap              Air gap
      ↕                    ↕
  ┌─────────────────────────┐
  │      PATIENT TISSUE     │
  │   (acts as dielectric)  │
  └─────────────────────────┘
  
  Best for: Superficial tissues,
  joints, limbs
  
  INDUCTIVE METHOD (Magnetic Field)
  ──────────────────────────────────
  
  ┌─────────────────────────┐
  │   Drum/Monode Electrode │
  │  ┌─────────────────┐    │
  │  │  Coil Winding   │    │
  │  │  ~~~~~~~~~~~    │    │
  │  └─────────────────┘    │
  └─────────────────────────┘
           │
           ▼ Magnetic field (H)
  ┌─────────────────────────┐
  │      PATIENT TISSUE     │
  │   Eddy currents induced │
  └─────────────────────────┘
  
  Best for: Deep muscles, spine
`}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">B. By Output Mode</h3>
            <div className="component-card mb-3">
              <h4 className="font-bold text-blue-700">Continuous SWD (CSWD)</h4>
              <p className="text-sm text-gray-600 mt-1">Uninterrupted RF output. Produces significant thermal effects. Used for chronic conditions requiring deep heating.</p>
              <div className="diagram-box text-xs mt-2">
{`  Output: ████████████████████████
  Time:   ─────────────────────────▶`}
              </div>
            </div>
            <div className="component-card">
              <h4 className="font-bold text-purple-700">Pulsed SWD (PSWD)</h4>
              <p className="text-sm text-gray-600 mt-1">RF output in short bursts. Minimal thermal effect. Used for acute conditions, oedema, wound healing.</p>
              <div className="diagram-box text-xs mt-2">
{`  Output: ██  ██  ██  ██  ██  ██
  Time:   ─────────────────────────▶
  Pulse: 65-400 μs, Rate: 1-200 Hz`}
              </div>
            </div>
          </div>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Continuous SWD</th>
                <th>Pulsed SWD</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Frequency</td><td>27.12 MHz</td><td>27.12 MHz</td></tr>
              <tr><td>Output Power</td><td>10-500 W</td><td>Peak: up to 1000 W; Mean: 1-48 W</td></tr>
              <tr><td>Thermal Effect</td><td>Significant</td><td>Minimal to none</td></tr>
              <tr><td>Pulse Duration</td><td>N/A</td><td>65-400 microseconds</td></tr>
              <tr><td>Pulse Rate</td><td>N/A</td><td>1-200 Hz</td></tr>
              <tr><td>Duty Cycle</td><td>100%</td><td>1-50%</td></tr>
              <tr><td>Best Use</td><td>Chronic pain, stiffness</td><td>Acute injuries, oedema</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Fault Diagnosis */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">4. Fault Diagnosis of SWD Machine</h2>
        </div>

        <h3 className="font-bold text-gray-800 mt-4 mb-2">🔍 Fault Diagnosis Flowchart</h3>
        <div className="diagram-box">
{`
  MACHINE DOES NOT POWER ON
  ─────────────────────────
  
  START
    │
    ▼
  Check mains supply ──── No voltage? ──▶ Check fuse/circuit breaker
    │ OK
    ▼
  Check power switch ──── Faulty? ──────▶ Replace switch
    │ OK
    ▼
  Check internal fuse ─── Blown? ────────▶ Replace fuse (check cause)
    │ OK
    ▼
  Check power supply ──── No output? ────▶ Repair/replace PSU
    │ OK
    ▼
  Check control board ─── Fault? ────────▶ Repair/replace board
    │ OK
    ▼
  Machine powers on ✓
  
  ─────────────────────────────────────────────────────────────────
  
  NO RF OUTPUT / LOW OUTPUT
  ─────────────────────────
  
  START
    │
    ▼
  Check output tuning ─── Mistuned? ─────▶ Retune output circuit
    │ OK
    ▼
  Check oscillator ─────── No signal? ───▶ Check/replace oscillator components
    │ OK
    ▼
  Check amplifier stage ── Low gain? ────▶ Check transistors/valves
    │ OK
    ▼
  Check electrode cables ─ Damaged? ─────▶ Replace cables
    │ OK
    ▼
  Check electrodes ──────── Faulty? ─────▶ Replace electrodes
    │ OK
    ▼
  Output normal ✓
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">📋 Common Faults Table</h3>
        <div className="table-container">
          <table className="fault-table">
            <thead>
              <tr>
                <th>Fault Symptom</th>
                <th>Probable Cause</th>
                <th>Diagnostic Test</th>
                <th>Remedy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Machine won&apos;t switch on</td>
                <td>Blown fuse, faulty switch, no mains supply</td>
                <td>Check mains voltage, test fuse with multimeter</td>
                <td>Replace fuse, repair switch, check supply</td>
              </tr>
              <tr>
                <td>No RF output</td>
                <td>Faulty oscillator, failed power transistor/valve</td>
                <td>Measure RF output with RF power meter</td>
                <td>Replace oscillator components or active device</td>
              </tr>
              <tr>
                <td>Low output power</td>
                <td>Weak oscillator, mistuned circuit, aging components</td>
                <td>RF power measurement, compare to spec</td>
                <td>Retune, replace aging capacitors/inductors</td>
              </tr>
              <tr>
                <td>Overheating</td>
                <td>Blocked ventilation, faulty cooling fan, component failure</td>
                <td>Check fan operation, measure temperatures</td>
                <td>Clean vents, replace fan, check thermal protection</td>
              </tr>
              <tr>
                <td>Timer not working</td>
                <td>Faulty timer IC, broken timer motor</td>
                <td>Test timer circuit independently</td>
                <td>Replace timer IC or motor</td>
              </tr>
              <tr>
                <td>Sparking at electrodes</td>
                <td>Damaged cables, poor connections, too high intensity</td>
                <td>Visual inspection, continuity test</td>
                <td>Replace cables, clean connectors, reduce intensity</td>
              </tr>
              <tr>
                <td>Erratic output</td>
                <td>Loose connections, intermittent component failure</td>
                <td>Wiggle test, check all connections</td>
                <td>Resolder joints, replace intermittent components</td>
              </tr>
              <tr>
                <td>Interference/noise</td>
                <td>Poor shielding, damaged coaxial cables</td>
                <td>Check cable shielding, measure EMI</td>
                <td>Replace cables, improve shielding</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Maintenance Procedures */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">5. Maintenance Procedures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="component-card border-l-4 border-green-500">
            <h4 className="font-bold text-green-700 mb-2">Daily Maintenance</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Visual inspection of cables and electrodes</li>
              <li>Check for physical damage</li>
              <li>Clean electrode surfaces</li>
              <li>Verify timer operation</li>
              <li>Check indicator lights</li>
              <li>Ensure proper ventilation clearance</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-700 mb-2">Monthly Maintenance</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Clean internal components (dust)</li>
              <li>Check all electrical connections</li>
              <li>Inspect cooling fan operation</li>
              <li>Test output power with RF meter</li>
              <li>Check frequency accuracy</li>
              <li>Inspect electrode cables for wear</li>
              <li>Test safety circuits</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-700 mb-2">Annual Maintenance</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Full electrical safety test</li>
              <li>Calibration of output power</li>
              <li>Replace electrolytic capacitors</li>
              <li>Check/replace cooling fan bearings</li>
              <li>Full functional test</li>
              <li>Leakage current measurement</li>
              <li>Earth continuity test</li>
              <li>Insulation resistance test</li>
            </ul>
          </div>
        </div>

        <div className="warning-box mt-4">
          <strong>⚠️ WARNING:</strong> Always disconnect from mains power and allow HV capacitors to discharge
          (minimum 5 minutes) before performing internal maintenance. Use a discharge resistor (10kΩ, 10W)
          to safely discharge high-voltage capacitors.
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔧 Electrode Maintenance Procedure</h3>
        <div className="diagram-box">
{`
  ELECTRODE MAINTENANCE STEPS:
  
  1. INSPECTION
     ├── Check for cracks or chips in electrode material
     ├── Inspect rubber/plastic spacers for deterioration
     ├── Check cable connections at electrode
     └── Look for discoloration or burn marks
  
  2. CLEANING
     ├── Wipe with damp cloth (mild detergent)
     ├── Do NOT use alcohol on rubber components
     ├── Dry thoroughly before use
     └── Check for residue from previous treatments
  
  3. CABLE INSPECTION
     ├── Check coaxial cable for kinks or damage
     ├── Test continuity: inner conductor to electrode
     ├── Test insulation: inner to outer conductor
     └── Check connector pins for corrosion
  
  4. STORAGE
     ├── Hang cables without sharp bends
     ├── Store electrodes in protective covers
     └── Keep away from heat sources
`}
        </div>
      </div>

      {/* Section 6: Safety Tests */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">6. Safety Tests</h2>
        </div>

        <div className="note-box mt-4">
          <strong>📌 Standard:</strong> Safety tests should comply with <strong>IEC 60601-1</strong> (Medical Electrical Equipment)
          and <strong>IEC 60601-2-3</strong> (Particular requirements for SWD equipment).
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Method</th>
                <th>Acceptable Limit</th>
                <th>Equipment Needed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Earth Continuity</strong></td>
                <td>Measure resistance from mains earth pin to exposed metal parts</td>
                <td>≤ 0.1 Ω (IEC 60601-1)</td>
                <td>Low-resistance ohmmeter</td>
              </tr>
              <tr>
                <td><strong>Insulation Resistance</strong></td>
                <td>Apply 500V DC between live conductors and earth</td>
                <td>≥ 2 MΩ</td>
                <td>Insulation tester (Megger)</td>
              </tr>
              <tr>
                <td><strong>Leakage Current (Earth)</strong></td>
                <td>Measure current flowing to earth under normal conditions</td>
                <td>≤ 500 μA (Class I)</td>
                <td>Safety analyzer</td>
              </tr>
              <tr>
                <td><strong>Leakage Current (Patient)</strong></td>
                <td>Measure current at patient connection points</td>
                <td>≤ 100 μA (Type B)</td>
                <td>Safety analyzer</td>
              </tr>
              <tr>
                <td><strong>RF Output Power</strong></td>
                <td>Measure output into calibrated dummy load</td>
                <td>Within ±20% of rated output</td>
                <td>RF power meter, dummy load</td>
              </tr>
              <tr>
                <td><strong>Frequency Accuracy</strong></td>
                <td>Measure output frequency with frequency counter</td>
                <td>27.12 MHz ± 160 kHz</td>
                <td>Frequency counter/spectrum analyzer</td>
              </tr>
              <tr>
                <td><strong>Timer Accuracy</strong></td>
                <td>Compare timer setting to actual elapsed time</td>
                <td>Within ±10% of set time</td>
                <td>Stopwatch</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Safety Test Circuit Setup</h3>
        <div className="circuit-diagram">
{`
  EARTH CONTINUITY TEST SETUP:
  
  Mains Earth Pin ──────────────────────────────────┐
                                                    │
                                              [Ohmmeter]
                                                    │
  Exposed Metal Part ───────────────────────────────┘
  
  Reading should be ≤ 0.1 Ω
  
  ─────────────────────────────────────────────────────────
  
  LEAKAGE CURRENT TEST SETUP (IEC 60601-1):
  
  Live ──┬── [SWD Machine] ──┬── Neutral
         │                   │
         │              [Patient Applied Part]
         │                   │
         │              [Measuring Device MD]
         │                   │  (1kΩ || 0.015μF)
         └───────────────────┴── Earth
  
  MD = Measuring device per IEC 60601-1 Figure 1
  
  ─────────────────────────────────────────────────────────
  
  RF POWER MEASUREMENT:
  
  SWD Output ──── [Coaxial Cable] ──── [RF Power Meter]
                                              │
                                       [50Ω Dummy Load]
                                              │
                                             GND
  
  Note: Use appropriate power rating for dummy load
`}
        </div>
      </div>

      {/* Section 7: Calibration */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">7. Calibration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Calibration Parameters</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Parameter</th><th>Method</th></tr>
                </thead>
                <tbody>
                  <tr><td>Output Power</td><td>RF power meter into 50Ω load</td></tr>
                  <tr><td>Frequency</td><td>Frequency counter at output</td></tr>
                  <tr><td>Timer</td><td>Stopwatch comparison</td></tr>
                  <tr><td>Pulse Parameters (PSWD)</td><td>Oscilloscope measurement</td></tr>
                  <tr><td>Intensity Scale</td><td>Compare dial positions to power output</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Calibration Procedure</h3>
            <div className="diagram-box text-xs">
{`
  CALIBRATION STEPS:
  
  1. Warm up machine for 15 minutes
  
  2. Connect RF power meter to output
     (via appropriate attenuator if needed)
  
  3. Set intensity to minimum
     Record power reading
  
  4. Increase intensity in steps
     Record power at each step
  
  5. Compare to calibration chart
     Adjust trimmer potentiometers
     if readings are out of spec
  
  6. Check frequency with counter
     Adjust oscillator trimmer if needed
  
  7. Test timer accuracy at 5, 10, 20 min
  
  8. Document all readings
     Sign calibration certificate
`}
            </div>
          </div>
        </div>

        <div className="tip-box mt-4">
          <strong>💡 Calibration Tip:</strong> Calibration should be performed annually or after any major repair.
          Always use NIST-traceable test equipment. Document all calibration results with date, technician name,
          and equipment serial numbers.
        </div>
      </div>

      {/* Section 8: Assessment */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">8. Assessment Questions</h2>
        </div>

        <h3 className="font-bold text-gray-800 mt-4 mb-3">📝 Short-Answer Questions</h3>
        <div className="space-y-3">
          {[
            { q: "1. Name the main component that generates high-frequency currents in a SWD machine.", a: "The oscillator circuit (typically a Hartley or Colpitts oscillator) generates the high-frequency alternating current at 27.12 MHz." },
            { q: "2. What is the primary therapeutic use of short-wave diathermy?", a: "Deep tissue heating for pain relief, muscle relaxation, increased blood flow, and accelerated tissue healing in conditions like arthritis, muscle spasms, and chronic inflammation." },
            { q: "3. What are the two main operational modes (types of application) for SWD?", a: "Capacitive (condenser field) method using electrodes, and Inductive (cable/drum) method using induction coils." },
            { q: "4. If a patient reports a sudden hot spot during treatment, what is the most likely immediate cause?", a: "Poor electrode contact, uneven spacing, metal objects near the treatment area, or concentration of the electromagnetic field at a specific point." },
            { q: "5. What is the most critical safety check to perform before applying SWD electrodes to a patient?", a: "Check for metal implants, jewelry, and ensure the patient has no contraindications such as pacemakers or pregnancy in the treatment area." },
            { q: "6. Name one common visual inspection item for SWD machine cables.", a: "Check for frayed insulation, exposed wires, cracks in the cable jacket, or loose connectors at the electrode ends." },
            { q: "7. What does the term 'tuning' refer to in SWD operation?", a: "Adjusting the resonant circuit to match the patient's tissue impedance, indicated by maximum output on the tuning meter." },
            { q: "8. What instrument is typically used to calibrate SWD power output?", a: "An RF power meter with a 50Ω dummy load, or a specialized SWD analyzer." },
            { q: "9. State one contraindication for SWD therapy.", a: "Pacemakers, metal implants, pregnancy, malignancy, acute inflammation, or impaired sensation." },
            { q: "10. What is the purpose of the timing circuit in a SWD machine?", a: "To automatically terminate treatment after a preset duration (typically 10-30 minutes) to prevent over-treatment and ensure patient safety." },
          ].map((item, i) => (
            <details key={i} className="bg-gray-50 rounded-lg p-3">
              <summary className="font-medium text-gray-800 cursor-pointer">{item.q}</summary>
              <p className="mt-2 text-gray-600 text-sm">{item.a}</p>
            </details>
          ))}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-3">✍️ Essay Questions</h3>
        <div className="space-y-3">
          {[
            "1. Explain the principle of operation of a short-wave diathermy machine, focusing on how it generates deep tissue heat.",
            "2. Compare and contrast the capacitive (condenser field) and inductive (cable/drum) methods of applying SWD, including their target tissues.",
            "3. Describe a systematic, step-by-step fault diagnosis procedure for a SWD machine that powers on but produces no output.",
            "4. Detail the maintenance procedure for addressing a common fault: a frayed or damaged patient cable.",
            "5. Discuss the critical safety tests that must be performed on a SWD machine during a routine preventive maintenance check, explaining the rationale for each.",
            "6. Explain the calibration process for SWD output power, including the required equipment and acceptable tolerance ranges.",
            "7. Analyze the potential hazards associated with improper use of SWD (e.g., burns, interference with implants) and the safety features designed to mitigate them.",
            "8. Describe the correct setup and patient positioning for a SWD treatment using a capacitive technique for a knee joint, highlighting safety precautions.",
            "9. Develop a troubleshooting flowchart for a therapist's report of 'uneven heating' during SWD treatment.",
            "10. Evaluate the importance of regular calibration and documentation in ensuring both therapeutic efficacy and patient safety with SWD equipment.",
          ].map((q, i) => (
            <details key={i} className="bg-blue-50 rounded-lg p-3">
              <summary className="font-medium text-gray-800 cursor-pointer">{q}</summary>
              <p className="mt-2 text-gray-600 text-sm italic">[Extended response required - refer to the learning content above for detailed answers]</p>
            </details>
          ))}
        </div>
      </div>
      </div>{/* End printable-content */}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Back to Home
        </Link>
        <Link href="/muscle-stimulator" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Next: Muscle Stimulator →
        </Link>
      </div>
    </div>
  );
}
