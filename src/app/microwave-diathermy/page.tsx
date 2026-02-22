"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function MicrowaveDiathermyPage() {
  // Microwave Diathermy Simulation Function
  const simulateMicrowaveDiathermy = (params: Record<string, number | string>) => {
    const power = params.power as number;
    const treatmentTime = params.treatmentTime as number;
    const applicatorDistance = params.applicatorDistance as number;
    const applicatorType = params.applicatorType as string;
    
    // Calculate derived parameters
    const wavelength = 12.2; // cm at 2450 MHz
    
    // Power density at treatment area (inverse square law)
    const applicatorArea = applicatorType === "Round" ? 113 : 72; // cm²
    const powerDensity = (power * 10) / (applicatorDistance * applicatorDistance); // mW/cm² at distance
    
    // Tissue penetration depth
    const penetrationDepth = 3 + (power / 100); // cm (approximate)
    
    // Energy delivered
    const energyDelivered = (power * treatmentTime * 60) / 1000; // kJ
    
    // Temperature rise estimation
    const tempRise = (powerDensity * treatmentTime * 0.05); // °C
    
    // SAR calculation
    const sar = powerDensity * 0.8; // W/kg (approximate)
    
    // Safety thresholds
    const powerStatus = power > 150 ? "warning" as const : power > 200 ? "danger" as const : "normal" as const;
    const distanceStatus = applicatorDistance < 5 ? "danger" as const : applicatorDistance < 10 ? "warning" as const : "normal" as const;
    const densityStatus = powerDensity > 150 ? "danger" as const : powerDensity > 100 ? "warning" as const : "normal" as const;
    const sarStatus = sar > 4 ? "danger" as const : sar > 2 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Wavelength", value: wavelength.toFixed(1), unit: "cm", status: "normal" as const, numericValue: wavelength, min: 1, max: 50 },
      { parameter: "Power Density", value: powerDensity.toFixed(1), unit: "mW/cm²", status: densityStatus, numericValue: powerDensity, min: 0, max: 500 },
      { parameter: "Penetration Depth", value: penetrationDepth.toFixed(1), unit: "cm", status: "normal" as const, numericValue: penetrationDepth, min: 1, max: 5 },
      { parameter: "Energy Delivered", value: energyDelivered.toFixed(1), unit: "kJ", status: "normal" as const, numericValue: energyDelivered, min: 0, max: 200 },
      { parameter: "Est. Tissue Temp Rise", value: tempRise.toFixed(1), unit: "°C", status: "normal" as const, numericValue: tempRise, min: 0, max: 10 },
      { parameter: "SAR", value: sar.toFixed(2), unit: "W/kg", status: sarStatus, numericValue: sar, min: 0, max: 10 },
      { parameter: "Output Power", value: power.toString(), unit: "W", status: powerStatus, numericValue: power, min: 10, max: 250 },
      { parameter: "Applicator Distance", value: applicatorDistance.toString(), unit: "cm", status: distanceStatus, numericValue: applicatorDistance, min: 1, max: 20 },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="breadcrumb mb-4">
            <Link href="/" className="text-orange-200 hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Microwave Diathermy</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">📡 Microwave Diathermy Machine</h1>
          <p className="text-xl text-orange-100">Module 10 — Maintenance, Fault Diagnosis & Safety</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-orange-600 rounded-lg p-3">
              <div className="text-2xl font-bold">2450</div>
              <div className="text-orange-200 text-sm">MHz Frequency</div>
            </div>
            <div className="bg-orange-600 rounded-lg p-3">
              <div className="text-2xl font-bold">200W</div>
              <div className="text-orange-200 text-sm">Max Output Power</div>
            </div>
            <div className="bg-orange-600 rounded-lg p-3">
              <div className="text-2xl font-bold">3–5 cm</div>
              <div className="text-orange-200 text-sm">Tissue Penetration</div>
            </div>
            <div className="bg-orange-600 rounded-lg p-3">
              <div className="text-2xl font-bold">IEC</div>
              <div className="text-orange-200 text-sm">60601-2-6 Standard</div>
            </div>
          </div>
          {/* Print/Export Buttons */}
          <div className="mt-4">
            <PrintButton title="Microwave Diathermy - Learning Notes" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Printable Content Wrapper */}
        <div id="printable-content">

        {/* Simulation Panel */}
        <SimulationPanel
          title="Microwave Diathermy Simulator"
          description="Configure treatment parameters to analyze power density and tissue heating"
          parameters={[
            { name: "Output Power", key: "power", unit: "W", min: 10, max: 200, step: 10, default: 50 },
            { name: "Treatment Time", key: "treatmentTime", unit: "min", min: 5, max: 30, step: 1, default: 15 },
            { name: "Applicator Distance", key: "applicatorDistance", unit: "cm", min: 5, max: 20, step: 1, default: 10 },
            { 
              name: "Applicator Type", 
              key: "applicatorType", 
              unit: "", 
              min: 0, 
              max: 0, 
              default: "Round",
              type: "select",
              options: [
                { value: "Round", label: "Round (12cm dia)" },
                { value: "Rectangular", label: "Rectangular (12×6cm)" },
              ]
            },
          ]}
          simulate={simulateMicrowaveDiathermy}
        />

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="section-header">1. Introduction to Microwave Diathermy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is Microwave Diathermy?</h3>
              <p className="text-gray-600 mb-3">
                Microwave diathermy uses electromagnetic radiation at 2450 MHz (or 915 MHz) to produce
                deep heating in body tissues. The microwave energy is absorbed by water molecules in
                tissue, causing them to rotate and generate heat through molecular friction.
              </p>
              <div className="note-box p-3 rounded">
                <strong>Key Principle:</strong> Microwave energy at 2450 MHz is selectively absorbed
                by tissues with high water content (muscle, blood vessels). Fat and bone absorb less,
                making it more selective than shortwave diathermy.
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Comparison with Other Diathermy</h3>
              <div className="overflow-x-auto">
                <table className="fault-table w-full text-sm">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Microwave</th>
                      <th>Shortwave</th>
                      <th>Ultrasound</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Frequency</td><td>2450 MHz</td><td>27.12 MHz</td><td>1–3 MHz</td></tr>
                    <tr><td>Penetration</td><td>3–5 cm</td><td>3–5 cm</td><td>3–5 cm</td></tr>
                    <tr><td>Selectivity</td><td>High (water)</td><td>Low</td><td>Medium</td></tr>
                    <tr><td>Applicator</td><td>Antenna/Director</td><td>Electrodes/Coil</td><td>Transducer</td></tr>
                    <tr><td>Contact</td><td>Non-contact</td><td>Non-contact</td><td>Contact</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Main Parts */}
        <section className="mb-10">
          <h2 className="section-header">2. Main Parts of Microwave Diathermy Machine</h2>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
╔══════════════════════════════════════════════════════════════════════════════╗
║           MICROWAVE DIATHERMY — SYSTEM BLOCK DIAGRAM                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  MAINS INPUT          POWER SUPPLY           CONTROL UNIT                   ║
║  ┌─────────┐         ┌──────────────┐        ┌──────────────────┐           ║
║  │ 230V AC │────────▶│ HV Rectifier │        │ Timer Circuit    │           ║
║  │  50 Hz  │         │ Filter Caps  │        │ Power Control    │           ║
║  └─────────┘         │ Voltage Reg. │        │ Display Panel    │           ║
║                      └──────┬───────┘        └────────┬─────────┘           ║
║                             │ HV DC                   │ Control              ║
║                             ▼                         ▼                      ║
║                      ┌──────────────────────────────────────┐               ║
║                      │         MAGNETRON TUBE               │               ║
║                      │  ┌─────────────────────────────────┐ │               ║
║                      │  │  Cathode (electron emitter)     │ │               ║
║                      │  │  Anode (resonant cavities)      │ │               ║
║                      │  │  Permanent magnet               │ │               ║
║                      │  │  Output: 2450 MHz microwaves    │ │               ║
║                      │  └─────────────────────────────────┘ │               ║
║                      └──────────────────┬───────────────────┘               ║
║                                         │ Microwave energy                  ║
║                                         ▼                                   ║
║                      ┌──────────────────────────────────────┐               ║
║                      │         WAVEGUIDE / COAXIAL CABLE    │               ║
║                      │  Transmits microwave energy to       │               ║
║                      │  applicator with minimal loss        │               ║
║                      └──────────────────┬───────────────────┘               ║
║                                         │                                   ║
║                                         ▼                                   ║
║                      ┌──────────────────────────────────────┐               ║
║                      │         APPLICATOR / DIRECTOR        │               ║
║                      │  ┌──────────────┐ ┌───────────────┐  │               ║
║                      │  │ Round (A)    │ │ Rectangular(B)│  │               ║
║                      │  │ 12cm dia     │ │ 12×6cm        │  │               ║
║                      │  │ General use  │ │ Limb/joint    │  │               ║
║                      │  └──────────────┘ └───────────────┘  │               ║
║                      └──────────────────────────────────────┘               ║
║                                                                              ║
║  SAFETY SYSTEMS:                                                             ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │ Thermal cutout │ Reflected power monitor │ Timer │ Interlock system │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { name: "Magnetron Tube", desc: "Vacuum tube that generates microwave energy at 2450 MHz using crossed electric and magnetic fields", icon: "📡" },
              { name: "High Voltage Power Supply", desc: "Provides 4–5 kV DC to magnetron anode; includes rectifier, filter capacitors, and voltage regulator", icon: "⚡" },
              { name: "Waveguide/Coaxial Cable", desc: "Transmits microwave energy from magnetron to applicator with minimal loss and radiation", icon: "🔌" },
              { name: "Applicator/Director", desc: "Antenna that radiates microwave energy toward patient tissue; various shapes for different body areas", icon: "📻" },
              { name: "Reflectometer", desc: "Measures forward and reflected power; protects magnetron from high reflected power (VSWR)", icon: "🔍" },
              { name: "Timer Circuit", desc: "Controls treatment duration (1–30 minutes); automatically cuts off output at end of treatment", icon: "⏱️" },
              { name: "Power Control", desc: "Adjusts magnetron output from 0–200W; may use variable anode voltage or pulse width modulation", icon: "🎛️" },
              { name: "Cooling System", desc: "Fan-cooled magnetron and power supply; some units use water cooling for high-power operation", icon: "❄️" },
              { name: "Interlock System", desc: "Prevents operation if applicator is disconnected or door/panel is open; safety critical", icon: "🔒" },
            ].map((part, i) => (
              <div key={i} className="component-card p-4 rounded-lg">
                <div className="text-2xl mb-2">{part.icon}</div>
                <h4 className="font-semibold text-gray-800">{part.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{part.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Circuit Diagrams */}
        <section className="mb-10">
          <h2 className="section-header">3. Circuit Diagrams</h2>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">3.1 Magnetron Power Supply Circuit</h3>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  MAGNETRON HIGH VOLTAGE POWER SUPPLY
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  230V AC ──[F1]──[SW1]──┬──[HV Transformer]──┬──[D1]──┬── +4kV   │
  │                          │  Primary: 230V      │        │           │
  │                          │  Secondary: 4kV     │      [C1]         │
  │                          │                   [D2]     [4μF]        │
  │                          │                     │        │           │
  │                          │                     └────────┘           │
  │                          │                          │               │
  │                          │                         GND              │
  │                          │                                          │
  │                          └──[Filament Transformer]──── Cathode      │
  │                             Primary: 230V                           │
  │                             Secondary: 3.3V AC (heater)            │
  │                                                                     │
  │  MAGNETRON TUBE INTERNAL STRUCTURE:                                 │
  │                                                                     │
  │         Cathode (−4kV)                                              │
  │              │                                                      │
  │         ┌────┴────┐                                                 │
  │         │ Electron│                                                 │
  │         │  Cloud  │  ← Permanent Magnet (axial field)              │
  │         └────┬────┘                                                 │
  │              │  Electrons spiral in crossed E and B fields          │
  │         ┌────┴────────────────────────────────────────┐            │
  │         │  ANODE with resonant cavities (slots)        │            │
  │         │  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │            │
  │         │  │  │ │  │ │  │ │  │ │  │ │  │ │  │ │  │  │            │
  │         │  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │            │
  │         │  Resonant frequency: 2450 MHz                │            │
  │         └────────────────────────────────────────┬────┘            │
  │                                                  │                  │
  │                                           Output antenna            │
  │                                           → Waveguide              │
  └─────────────────────────────────────────────────────────────────────┘

  REFLECTOMETER / DIRECTIONAL COUPLER
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  Magnetron ──[Forward Coupler]──[Coax Cable]──[Applicator]         │
  │                    │                                                │
  │             [Reverse Coupler]                                       │
  │                    │                                                │
  │              ┌─────┴─────┐                                         │
  │              │ Comparator│                                          │
  │              │ Circuit   │                                          │
  │              └─────┬─────┘                                         │
  │                    │                                                │
  │         If Reflected Power > 30% Forward Power:                    │
  │         → ALARM + OUTPUT DISABLE                                    │
  │         (Protects magnetron from high VSWR)                        │
  └─────────────────────────────────────────────────────────────────────┘
`}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">3.2 Microwave Penetration and Tissue Heating</h3>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  MICROWAVE TISSUE PENETRATION DIAGRAM
  ══════════════════════════════════════════════════════════════════

  Applicator (2450 MHz)
       │
       │  ████████████████████████████████  ← Skin (1–2mm, high absorption)
       │  ████████████████████████████████
       │
       │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Subcutaneous Fat (low absorption)
       │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       │
       │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Muscle (HIGH absorption — HEAT)
       │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Maximum heating at 3–5 cm depth
       │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
       │
       │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Bone (low absorption)
       │
  TEMPERATURE DISTRIBUTION:
  ─────────────────────────────────────────────────────────────────
  Depth (cm):  0    1    2    3    4    5    6    7    8
  Temp rise:   ▲    ▲▲   ▲▲▲  ▲▲▲▲ ▲▲▲  ▲▲   ▲    ─    ─
               Skin  Fat  Fat  Musc Musc Musc Musc Bone Bone
                                 ↑
                          Maximum heating
                          (3–4 cm depth)

  APPLICATOR TYPES AND FIELD PATTERNS:
  ─────────────────────────────────────────────────────────────────
  Round Director (A):          Rectangular Director (B):
  ┌──────────────┐             ┌──────────────────────┐
  │   ○ ○ ○ ○   │             │  ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬   │
  │  ○ ● ● ● ○  │             │  ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬   │
  │  ○ ● ● ● ○  │             │  ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬   │
  │   ○ ○ ○ ○   │             └──────────────────────┘
  └──────────────┘             For limbs, elongated areas
  For round areas (shoulder)   More uniform field distribution
  12 cm diameter               12 × 6 cm
`}
          </div>
        </section>

        {/* Uses */}
        <section className="mb-10">
          <h2 className="section-header">4. Uses of Microwave Diathermy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-green-700 mb-3">✅ Therapeutic Applications</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Muscle spasm:</strong> Deep heating relaxes muscle tension</li>
                <li>• <strong>Joint stiffness:</strong> Increases tissue extensibility before exercise</li>
                <li>• <strong>Osteoarthritis:</strong> Pain relief and improved mobility</li>
                <li>• <strong>Bursitis/tendinitis:</strong> Reduces inflammation and pain</li>
                <li>• <strong>Soft tissue injuries:</strong> Accelerates healing in subacute phase</li>
                <li>• <strong>Sinusitis:</strong> Heating of paranasal sinuses (special applicator)</li>
                <li>• <strong>Pre-exercise warm-up:</strong> Increases tissue temperature before stretching</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-red-700 mb-3">⚠️ Contraindications</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Metal implants:</strong> Concentration of microwave energy → burns</li>
                <li>• <strong>Pacemakers:</strong> Electromagnetic interference</li>
                <li>• <strong>Malignancy:</strong> May accelerate tumor growth</li>
                <li>• <strong>Pregnancy:</strong> Avoid over abdomen/pelvis</li>
                <li>• <strong>Eyes:</strong> Lens has no blood supply — cataracts risk</li>
                <li>• <strong>Testes:</strong> Heat-sensitive — avoid direct exposure</li>
                <li>• <strong>Impaired sensation:</strong> Cannot detect overheating</li>
                <li>• <strong>Wet dressings:</strong> Superheating of fluid → burns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="mb-10">
          <h2 className="section-header">5. Types of Microwave Diathermy Units</h2>
          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Frequency</th>
                  <th>Power</th>
                  <th>Penetration</th>
                  <th>Application</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Standard (2450 MHz)</strong></td>
                  <td>2450 MHz (12.2 cm wavelength)</td>
                  <td>Up to 200W</td>
                  <td>3–5 cm</td>
                  <td>General physiotherapy, most common</td>
                </tr>
                <tr>
                  <td><strong>Low Frequency (915 MHz)</strong></td>
                  <td>915 MHz (32.8 cm wavelength)</td>
                  <td>Up to 300W</td>
                  <td>5–8 cm</td>
                  <td>Deeper tissue heating, less common</td>
                </tr>
                <tr>
                  <td><strong>Pulsed Microwave</strong></td>
                  <td>2450 MHz</td>
                  <td>Peak: 1000W, Average: 50W</td>
                  <td>3–5 cm</td>
                  <td>Non-thermal effects, acute conditions</td>
                </tr>
                <tr>
                  <td><strong>Portable Units</strong></td>
                  <td>2450 MHz</td>
                  <td>Up to 50W</td>
                  <td>2–3 cm</td>
                  <td>Home use, domiciliary physiotherapy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Fault Diagnosis */}
        <section className="mb-10">
          <h2 className="section-header">6. Fault Diagnosis</h2>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
  MICROWAVE DIATHERMY FAULT DIAGNOSIS FLOWCHART
  ══════════════════════════════════════════════════════════════════

  UNIT FAILS TO PRODUCE OUTPUT
         │
         ▼
  ┌─────────────────────────────┐
  │ Check power indicator       │
  │ and timer display           │
  └─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
  NO POWER  POWERED
    │         │
    ▼         ▼
  Check    ┌─────────────────────────────┐
  mains    │ Check interlock switches    │
  fuse     │ (applicator connected?)     │
  supply   └─────────────────────────────┘
                   │
              ┌────┴────┐
              │         │
           OPEN       CLOSED
              │         │
              ▼         ▼
          Check      Check HV
          interlock  power supply
          switch     output
          cable      (4–5 kV DC)

  HIGH REFLECTED POWER ALARM
         │
         ▼
  ┌─────────────────────────────┐
  │ Check applicator placement  │
  │ (distance from tissue)      │
  └─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
  POOR      CORRECT
  PLACEMENT PLACEMENT
    │         │
    ▼         ▼
  Reposition Check coaxial
  applicator cable for
  5–10 cm    damage/kinks
  from skin
`}
          </div>

          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Fault Symptom</th>
                  <th>Probable Cause</th>
                  <th>Diagnostic Test</th>
                  <th>Corrective Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>No microwave output</td>
                  <td>Magnetron failure, HV supply fault</td>
                  <td>Measure HV supply; check magnetron filament continuity</td>
                  <td>Replace magnetron; repair HV supply</td>
                </tr>
                <tr>
                  <td>Low output power</td>
                  <td>Magnetron aging, HV too low</td>
                  <td>Measure output with power meter; check HV level</td>
                  <td>Adjust HV; replace magnetron if end-of-life</td>
                </tr>
                <tr>
                  <td>High reflected power alarm</td>
                  <td>Damaged coax cable, poor applicator contact</td>
                  <td>Check VSWR with power meter; inspect cable</td>
                  <td>Replace coaxial cable; reposition applicator</td>
                </tr>
                <tr>
                  <td>Overheating/thermal cutout</td>
                  <td>Blocked ventilation, fan failure</td>
                  <td>Check fan operation; measure magnetron temperature</td>
                  <td>Clean vents; replace cooling fan</td>
                </tr>
                <tr>
                  <td>Timer not functioning</td>
                  <td>Timer circuit fault, display failure</td>
                  <td>Check timer IC and display connections</td>
                  <td>Replace timer circuit board</td>
                </tr>
                <tr>
                  <td>Microwave leakage detected</td>
                  <td>Damaged waveguide, loose applicator connection</td>
                  <td>Survey with microwave leakage detector</td>
                  <td>Replace waveguide/cable; tighten connections</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Maintenance */}
        <section className="mb-10">
          <h2 className="section-header">7. Maintenance Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-3">🗓️ Daily Checks</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>☐ Visual inspection of coaxial cable for kinks/damage</li>
                <li>☐ Check applicator for cracks or damage</li>
                <li>☐ Verify timer operation</li>
                <li>☐ Test power output indicator</li>
                <li>☐ Check cooling fan operation</li>
                <li>☐ Clean applicator surface with damp cloth</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-3">📅 Monthly Checks</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>☐ Output power measurement (microwave power meter)</li>
                <li>☐ Microwave leakage survey (≤5 mW/cm²)</li>
                <li>☐ Electrical safety tests (leakage current)</li>
                <li>☐ Earth continuity test</li>
                <li>☐ Clean ventilation filters</li>
                <li>☐ Check all indicator lights and alarms</li>
                <li>☐ Inspect coaxial cable connectors</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h3 className="font-semibold text-purple-800 mb-3">📆 Annual Service</h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>☐ Full electrical safety test (IEC 60601-2-6)</li>
                <li>☐ Output power calibration</li>
                <li>☐ Magnetron performance check (life expectancy ~2000 hrs)</li>
                <li>☐ Replace HV capacitors if &gt;5 years old</li>
                <li>☐ Inspect and clean magnetron cooling fins</li>
                <li>☐ Test all safety interlocks</li>
                <li>☐ Update service records</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Tests */}
        <section className="mb-10">
          <h2 className="section-header">8. Safety Tests (IEC 60601-2-6)</h2>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  MICROWAVE LEAKAGE SURVEY SETUP
  ══════════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  Microwave Diathermy Unit                                       │
  │  ┌──────────────┐                                               │
  │  │   UNIT       │──[Coax Cable]──[Applicator]                  │
  │  │   (ON)       │                    │                          │
  │  └──────────────┘                    │ Microwave field          │
  │                                      │                          │
  │                              ┌───────┴────────┐                 │
  │                              │ LEAKAGE METER  │                 │
  │                              │ (Narda 8718)   │                 │
  │                              │ Probe: 5 cm    │                 │
  │                              │ from surface   │                 │
  │                              └───────┬────────┘                 │
  │                                      │                          │
  │                              Reading: ≤5 mW/cm²                 │
  │                              (ICNIRP/IEEE limit)                │
  │                                                                 │
  │  Survey Points:                                                  │
  │  • Around applicator connector                                   │
  │  • Along coaxial cable length                                    │
  │  • Around unit ventilation slots                                 │
  │  • At operator position (1 meter from applicator)               │
  └─────────────────────────────────────────────────────────────────┘
`}
          </div>

          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Method</th>
                  <th>Acceptance Limit</th>
                  <th>Standard</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Earth Continuity</td>
                  <td>25A AC between mains earth and chassis</td>
                  <td>≤0.1Ω</td>
                  <td>IEC 60601-1</td>
                </tr>
                <tr>
                  <td>Insulation Resistance</td>
                  <td>500V DC mains to chassis</td>
                  <td>≥100MΩ</td>
                  <td>IEC 60601-1</td>
                </tr>
                <tr>
                  <td>Earth Leakage Current</td>
                  <td>Measure chassis to earth current</td>
                  <td>≤500μA</td>
                  <td>IEC 60601-1</td>
                </tr>
                <tr>
                  <td>Output Power Accuracy</td>
                  <td>Microwave power meter at applicator output</td>
                  <td>±20% of set value</td>
                  <td>IEC 60601-2-6</td>
                </tr>
                <tr>
                  <td>Microwave Leakage</td>
                  <td>Survey meter at 5 cm from all surfaces</td>
                  <td>≤5 mW/cm²</td>
                  <td>ICNIRP Guidelines</td>
                </tr>
                <tr>
                  <td>Timer Accuracy</td>
                  <td>Stopwatch vs. timer display</td>
                  <td>±10% of set time</td>
                  <td>IEC 60601-2-6</td>
                </tr>
                <tr>
                  <td>Interlock Function</td>
                  <td>Disconnect applicator — verify output stops</td>
                  <td>Output must stop immediately</td>
                  <td>IEC 60601-2-6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Calibration */}
        <section className="mb-10">
          <h2 className="section-header">9. Calibration Procedure</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Equipment Required</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Microwave power meter (e.g., Bird 4421, Rohde &amp; Schwarz NRP)</li>
                  <li>• Calibrated power sensor (2450 MHz, 0–200W range)</li>
                  <li>• 50Ω dummy load (200W rated)</li>
                  <li>• Microwave leakage survey meter</li>
                  <li>• Stopwatch for timer calibration</li>
                </ul>
                <h3 className="font-semibold text-gray-800 mb-3 mt-4">Calibration Steps</h3>
                <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                  <li>Connect power meter sensor to applicator output port</li>
                  <li>Set unit to 50W, activate output for 30 seconds</li>
                  <li>Record measured power from power meter</li>
                  <li>Adjust internal calibration if error &gt;±20%</li>
                  <li>Repeat at 100W and 150W settings</li>
                  <li>Test timer accuracy at 5, 10, 20 minute settings</li>
                  <li>Perform microwave leakage survey</li>
                  <li>Record all results and affix calibration label</li>
                </ol>
              </div>
              <div>
                <div className="warning-box p-4 rounded mb-4">
                  <strong>⚠️ RADIATION HAZARD:</strong> Microwave energy is non-ionizing but can
                  cause thermal injury to eyes (cataracts) and testes. Always use a proper
                  dummy load during testing. Never look into the applicator aperture.
                  Maintain minimum 1 meter distance from operating applicator.
                </div>
                <div className="note-box p-4 rounded">
                  <strong>📋 Magnetron Life:</strong> Magnetron tubes have a finite life of
                  approximately 2000–5000 operating hours. Track operating hours and plan
                  replacement before failure. Signs of aging include reduced output power
                  and increased warm-up time.
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>{/* End printable-content */}

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <a href="/electrosurgical-unit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
            ← Electrosurgical Unit
          </a>
          <a href="/orthopaedic-saw" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Orthopaedic Saw →
          </a>
        </div>
      </div>
    </div>
  );
}
