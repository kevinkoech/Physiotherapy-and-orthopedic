"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function InfraredTherapyPage() {
  // Infrared Therapy Simulation Function
  const simulateInfraredTherapy = (params: Record<string, number | string>) => {
    const lampPower = params.lampPower as number;
    const distance = params.distance as number;
    const treatmentTime = params.treatmentTime as number;
    const emitterType = params.emitterType as string;
    
    // Calculate derived parameters
    // Irradiance follows inverse square law: I = P / (4πr²)
    const irradiance = (lampPower * 0.7) / (4 * Math.PI * Math.pow(distance / 100, 2)); // mW/cm² at distance
    const energyDelivered = irradiance * treatmentTime * 60 / 1000; // J/cm²
    
    // Penetration depth based on emitter type
    let penetrationDepth = 0;
    let wavelength = "";
    if (emitterType === "Luminous") {
      penetrationDepth = 2 + (lampPower / 500); // mm
      wavelength = "0.8-1.5 μm";
    } else {
      penetrationDepth = 0.5 + (lampPower / 1000); // mm (FIR penetrates less)
      wavelength = "2-10 μm";
    }
    
    // Skin temperature rise estimation
    const tempRise = (irradiance * treatmentTime * 0.1) / 10; // °C
    
    // Safety thresholds
    const irradianceStatus = irradiance > 80 ? "danger" as const : irradiance > 50 ? "warning" as const : "normal" as const;
    const distanceStatus = distance < 30 ? "danger" as const : distance < 45 ? "warning" as const : "normal" as const;
    const timeStatus = treatmentTime > 30 ? "warning" as const : "normal" as const;
    const tempStatus = tempRise > 5 ? "danger" as const : tempRise > 3 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Irradiance at Distance", value: irradiance.toFixed(1), unit: "mW/cm²", status: irradianceStatus, numericValue: irradiance, min: 0, max: 200 },
      { parameter: "Energy Delivered", value: energyDelivered.toFixed(2), unit: "J/cm²", status: "normal" as const, numericValue: energyDelivered, min: 0, max: 50 },
      { parameter: "Est. Penetration Depth", value: penetrationDepth.toFixed(1), unit: "mm", status: "normal" as const, numericValue: penetrationDepth, min: 0, max: 10 },
      { parameter: "Wavelength Range", value: wavelength, unit: "", status: "normal" as const },
      { parameter: "Est. Skin Temp Rise", value: tempRise.toFixed(1), unit: "°C", status: tempStatus, numericValue: tempRise, min: 0, max: 15 },
      { parameter: "Treatment Distance", value: distance.toString(), unit: "cm", status: distanceStatus, numericValue: distance, min: 20, max: 100 },
      { parameter: "Treatment Duration", value: treatmentTime.toString(), unit: "min", status: timeStatus, numericValue: treatmentTime, min: 5, max: 30 },
      { parameter: "Emitter Type", value: emitterType, unit: "", status: "normal" as const },
    ];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Infrared Therapy Lamp</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">💡 Infrared Therapy Lamp</h1>
        <p className="text-red-100">Learning Outcome 3: Perform Infrared Therapy Lamp Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Types","Main Parts","Uses","Fault Diagnosis","Maintenance","Safety Tests","Calibration"].map(t => (
            <span key={t} className="bg-red-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {/* Print/Export Buttons */}
        <div className="mt-4">
          <PrintButton title="Infrared Therapy Lamp - Learning Notes" />
        </div>
      </div>

      {/* Printable Content Wrapper */}
      <div id="printable-content">

      {/* Simulation Panel */}
      <SimulationPanel
        title="IR Therapy Simulator"
        description="Calculate irradiance, energy delivery, and safety thresholds for IR treatment"
        parameters={[
          { name: "Lamp Power", key: "lampPower", unit: "W", min: 100, max: 1000, step: 50, default: 500 },
          { name: "Treatment Distance", key: "distance", unit: "cm", min: 30, max: 120, step: 5, default: 60 },
          { name: "Treatment Time", key: "treatmentTime", unit: "min", min: 5, max: 30, step: 1, default: 15 },
          { 
            name: "Emitter Type", 
            key: "emitterType", 
            unit: "", 
            min: 0, 
            max: 0, 
            default: "Non-luminous",
            type: "select",
            options: [
              { value: "Luminous", label: "Luminous (Tungsten)" },
              { value: "Non-luminous", label: "Non-luminous (Ceramic)" },
            ]
          },
        ]}
        simulate={simulateInfraredTherapy}
      />

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-red-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          Infrared (IR) therapy lamps emit electromagnetic radiation in the infrared spectrum
          (wavelength: <strong>700 nm – 1 mm</strong>). The therapeutic range used in physiotherapy is
          primarily <strong>Near-IR (NIR): 700–1400 nm</strong> and <strong>Far-IR (FIR): 3–1000 μm</strong>.
          IR radiation penetrates tissue and is absorbed, producing heat.
        </p>
        <div className="note-box">
          <strong>📌 Electromagnetic Spectrum Position:</strong><br/>
          Visible Light (400-700nm) → Near IR (700-1400nm) → Mid IR (1.4-3μm) → Far IR (3μm-1mm) → Microwave
        </div>
      </div>

      {/* Section 1: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Types of Infrared Therapy Lamps</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  INFRARED LAMP TYPES — COMPARISON DIAGRAM:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                    INFRARED SPECTRUM                            │
  │                                                                 │
  │  700nm          1400nm        3μm              1mm             │
  │  ├──────────────┼─────────────┼────────────────┤               │
  │  │   NEAR IR    │   MID IR    │    FAR IR       │               │
  │  │  (NIR/IRA)   │  (IRB)      │   (IRC)         │               │
  │  │              │             │                 │               │
  │  │ Penetration: │ Penetration:│ Penetration:    │               │
  │  │ 5-10mm       │ 1-2mm       │ <1mm            │               │
  │  │              │             │                 │               │
  │  │ Luminous     │ Non-luminous│ Non-luminous    │               │
  │  │ (red glow)   │ (no glow)   │ (no glow)       │               │
  └─────────────────────────────────────────────────────────────────┘
  
  LAMP TYPES:
  
  TYPE A: LUMINOUS (Near-IR) LAMP
  ┌─────────────────────────────┐
  │  ┌───────────────────────┐  │
  │  │   Tungsten Filament   │  │
  │  │   (2000-2500°C)       │  │
  │  │   ~~~~~~~~~~~~~~~~~~~  │  │
  │  └───────────────────────┘  │
  │  Glass Envelope              │
  │  Reflector (parabolic)       │
  │  Power: 250-1500W            │
  │  Peak wavelength: ~1000nm    │
  └─────────────────────────────┘
  
  TYPE B: NON-LUMINOUS (Far-IR) LAMP
  ┌─────────────────────────────┐
  │  ┌───────────────────────┐  │
  │  │  Resistance Wire in   │  │
  │  │  Ceramic/Quartz Rod   │  │
  │  │  (500-800°C)          │  │
  │  └───────────────────────┘  │
  │  No visible glow             │
  │  Power: 250-1000W            │
  │  Peak wavelength: ~4000nm    │
  └─────────────────────────────┘
`}
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Luminous (Near-IR)</th>
                <th>Non-Luminous (Far-IR)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Wavelength</td><td>700–1400 nm</td><td>3,000–10,000 nm</td></tr>
              <tr><td>Temperature</td><td>2000–2500°C (filament)</td><td>500–800°C (element)</td></tr>
              <tr><td>Visible light</td><td>Yes (red/orange glow)</td><td>No</td></tr>
              <tr><td>Tissue penetration</td><td>5–10 mm</td><td>1–2 mm (superficial)</td></tr>
              <tr><td>Warm-up time</td><td>Immediate</td><td>5–10 minutes</td></tr>
              <tr><td>Primary effect</td><td>Deep heating</td><td>Superficial heating</td></tr>
              <tr><td>Power rating</td><td>250–1500 W</td><td>250–1000 W</td></tr>
              <tr><td>Lamp life</td><td>1000–2000 hours</td><td>5000–10000 hours</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Main Parts of Infrared Therapy Lamp</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  INFRARED THERAPY LAMP — COMPONENT DIAGRAM:
  
                    ┌─────────────────────────────┐
                    │      CONTROL PANEL          │
                    │  [Timer] [Intensity] [ON/OFF]│
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      ELECTRICAL CIRCUIT     │
                    │  ┌────────┐  ┌───────────┐  │
                    │  │ Dimmer │  │  Timer    │  │
                    │  │Circuit │  │  Circuit  │  │
                    │  └────────┘  └───────────┘  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         LAMP HOUSING        │
                    │  ┌──────────────────────┐   │
                    │  │   Parabolic Reflector │   │
                    │  │   (polished aluminum) │   │
                    │  │    ┌──────────┐       │   │
                    │  │    │  IR LAMP │       │   │
                    │  │    │ (bulb or │       │   │
                    │  │    │  element)│       │   │
                    │  │    └──────────┘       │   │
                    │  └──────────────────────┘   │
                    │  Protective Wire Guard       │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      STAND/SUPPORT ARM      │
                    │  Adjustable height & angle  │
                    │  Locking mechanism          │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         BASE/CASTORS        │
                    │  Weighted base for stability │
                    │  Lockable castors           │
                    └─────────────────────────────┘
`}
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Function</th>
                <th>Material/Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>IR Lamp/Element</strong></td><td>Generates infrared radiation</td><td>Tungsten filament or resistance wire</td></tr>
              <tr><td><strong>Parabolic Reflector</strong></td><td>Directs IR radiation toward patient</td><td>Polished aluminum, parabolic shape</td></tr>
              <tr><td><strong>Lamp Housing</strong></td><td>Holds lamp and reflector, provides cooling</td><td>Metal with ventilation slots</td></tr>
              <tr><td><strong>Wire Guard</strong></td><td>Prevents accidental contact with hot lamp</td><td>Metal mesh/wire</td></tr>
              <tr><td><strong>Dimmer/Intensity Control</strong></td><td>Adjusts lamp power output</td><td>Triac-based dimmer or variable transformer</td></tr>
              <tr><td><strong>Timer Circuit</strong></td><td>Controls treatment duration</td><td>Mechanical or electronic, 0-30 min</td></tr>
              <tr><td><strong>Adjustable Arm</strong></td><td>Positions lamp at correct distance/angle</td><td>Articulated metal arm with locks</td></tr>
              <tr><td><strong>Stand/Base</strong></td><td>Supports the unit, provides mobility</td><td>Heavy base with castors</td></tr>
              <tr><td><strong>Power Cable</strong></td><td>Connects to mains supply</td><td>3-core, earthed, appropriate rating</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Uses of Infrared Therapy Lamp</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">🔥 Therapeutic Uses</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Relief of muscle pain and spasm</li>
              <li>Treatment of joint stiffness</li>
              <li>Preparation for massage/exercise</li>
              <li>Wound healing (low-level IR)</li>
              <li>Skin conditions (psoriasis, eczema)</li>
              <li>Sinusitis and ENT conditions</li>
              <li>Peripheral vascular disease</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-orange-800 mb-2">⚙️ Physiological Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Vasodilation (increased blood flow)</li>
              <li>Increased metabolic rate</li>
              <li>Muscle relaxation</li>
              <li>Sedation of sensory nerve endings</li>
              <li>Increased tissue extensibility</li>
              <li>Mild analgesic effect</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">✅ Indications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Subacute and chronic musculoskeletal conditions</li>
              <li>Arthritis (osteo and rheumatoid)</li>
              <li>Neuralgia and neuritis</li>
              <li>Pressure sores (low intensity)</li>
              <li>Post-traumatic conditions</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Acute inflammatory conditions</li>
              <li>Impaired skin sensation</li>
              <li>Malignancy in treatment area</li>
              <li>Active bleeding/haemorrhage</li>
              <li>Over eyes (without protection)</li>
              <li>Ischaemic areas</li>
              <li>Pregnancy (abdomen)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 4: Fault Diagnosis */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">4. Fault Diagnosis</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  FAULT DIAGNOSIS FLOWCHART — IR THERAPY LAMP:
  
  SYMPTOM: Lamp does not light / no heat
  ──────────────────────────────────────────
  
  START
    │
    ▼
  Check mains supply ──── No power? ─────▶ Check socket, fuse, circuit breaker
    │ OK
    ▼
  Check power switch ──── Faulty? ───────▶ Replace switch
    │ OK
    ▼
  Check fuse in plug ──── Blown? ────────▶ Replace fuse (check rating)
    │ OK
    ▼
  Check lamp/element ──── Burned out? ───▶ Replace lamp/element
    │ OK
    ▼
  Check lamp holder ────── Corroded? ────▶ Clean/replace lamp holder
    │ OK
    ▼
  Check dimmer circuit ─── Faulty? ──────▶ Replace dimmer/triac
    │ OK
    ▼
  Check timer circuit ──── Faulty? ──────▶ Replace timer
    │ OK
    ▼
  Lamp operates normally ✓
`}
        </div>

        <div className="table-container mt-4">
          <table className="fault-table">
            <thead>
              <tr>
                <th>Fault</th>
                <th>Probable Cause</th>
                <th>Test</th>
                <th>Remedy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lamp won&apos;t light</td>
                <td>Blown lamp, blown fuse, faulty switch</td>
                <td>Visual inspection, continuity test</td>
                <td>Replace lamp/fuse/switch</td>
              </tr>
              <tr>
                <td>Lamp flickers</td>
                <td>Loose connection, failing lamp, faulty dimmer</td>
                <td>Check connections, measure voltage</td>
                <td>Tighten connections, replace lamp/dimmer</td>
              </tr>
              <tr>
                <td>Lamp too dim/bright</td>
                <td>Faulty dimmer control, wrong lamp wattage</td>
                <td>Measure lamp voltage</td>
                <td>Repair/replace dimmer, use correct lamp</td>
              </tr>
              <tr>
                <td>Timer not working</td>
                <td>Faulty timer mechanism or circuit</td>
                <td>Test timer independently</td>
                <td>Replace timer</td>
              </tr>
              <tr>
                <td>Overheating of housing</td>
                <td>Blocked ventilation, wrong lamp wattage</td>
                <td>Check ventilation slots, measure temperature</td>
                <td>Clear ventilation, use correct lamp</td>
              </tr>
              <tr>
                <td>Arm won&apos;t stay in position</td>
                <td>Worn locking mechanism, loose joints</td>
                <td>Physical inspection</td>
                <td>Tighten/replace locking mechanism</td>
              </tr>
              <tr>
                <td>Reflector tarnished</td>
                <td>Age, contamination, heat damage</td>
                <td>Visual inspection</td>
                <td>Clean or replace reflector</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Maintenance */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">5. Maintenance Procedures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="component-card border-l-4 border-green-500">
            <h4 className="font-bold text-green-700 mb-2">Daily</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Visual inspection of lamp</li>
              <li>Check wire guard integrity</li>
              <li>Test timer operation</li>
              <li>Check arm locking mechanism</li>
              <li>Inspect power cable</li>
              <li>Clean housing exterior</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-700 mb-2">Monthly</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Clean reflector surface</li>
              <li>Check lamp hours (replace at limit)</li>
              <li>Inspect all electrical connections</li>
              <li>Test dimmer control range</li>
              <li>Check castor locks</li>
              <li>Lubricate arm joints if needed</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-700 mb-2">Annual</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Full electrical safety test</li>
              <li>Replace lamp (preventive)</li>
              <li>Check insulation resistance</li>
              <li>Earth continuity test</li>
              <li>Leakage current test</li>
              <li>Calibrate intensity output</li>
            </ul>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔧 Lamp Replacement Procedure</h3>
        <div className="diagram-box">
{`
  LAMP REPLACEMENT STEPS:
  
  ⚠️  SAFETY FIRST: Switch off and unplug. Allow lamp to cool (30 min minimum)
  
  1. PREPARATION
     ├── Gather replacement lamp (correct wattage and type)
     ├── Have clean cloth/gloves ready
     └── Ensure lamp is completely cool
  
  2. ACCESS
     ├── Remove wire guard (unscrew or unclip)
     └── Access lamp/bulb holder
  
  3. REMOVAL
     ├── For bayonet cap: Push in, turn anti-clockwise, pull out
     ├── For screw cap: Turn anti-clockwise
     └── For element: Disconnect terminals, slide out
  
  4. INSPECTION
     ├── Check lamp holder for corrosion/damage
     ├── Check reflector condition
     └── Clean reflector if needed (soft cloth only)
  
  5. INSTALLATION
     ├── Handle new lamp with clean cloth (no fingerprints on glass)
     ├── Insert and secure lamp
     ├── Replace wire guard
     └── Reconnect power
  
  6. TESTING
     ├── Switch on and verify operation
     ├── Check for correct light output
     └── Record lamp replacement in maintenance log
  
  ⚠️  NOTE: Never touch halogen lamp glass with bare hands
             (skin oils cause hot spots and premature failure)
`}
        </div>
      </div>

      {/* Section 6: Safety Tests */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">6. Safety Tests</h2>
        </div>

        <div className="note-box mt-4">
          <strong>📌 Standards:</strong> IEC 60601-1 (Medical Electrical Equipment), IEC 60601-2-50
          (Particular requirements for infant phototherapy equipment — applicable principles).
          Also refer to local electrical safety regulations.
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Method</th>
                <th>Acceptable Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Earth Continuity</strong></td>
                <td>Measure resistance from mains earth to chassis</td>
                <td>≤ 0.1 Ω</td>
              </tr>
              <tr>
                <td><strong>Insulation Resistance</strong></td>
                <td>500V DC between live conductors and earth</td>
                <td>≥ 2 MΩ</td>
              </tr>
              <tr>
                <td><strong>Leakage Current</strong></td>
                <td>Measure earth leakage current</td>
                <td>≤ 500 μA (Class I)</td>
              </tr>
              <tr>
                <td><strong>Wire Guard Integrity</strong></td>
                <td>Physical inspection, probe test (no contact with lamp)</td>
                <td>No gaps &gt;12mm (finger probe cannot reach lamp)</td>
              </tr>
              <tr>
                <td><strong>Temperature Test</strong></td>
                <td>Measure housing temperature after 30 min operation</td>
                <td>Accessible surfaces ≤ 48°C above ambient</td>
              </tr>
              <tr>
                <td><strong>Timer Accuracy</strong></td>
                <td>Compare set time to actual elapsed time</td>
                <td>Within ±10%</td>
              </tr>
              <tr>
                <td><strong>Stability Test</strong></td>
                <td>Apply 10° tilt in all directions</td>
                <td>Unit must not topple</td>
              </tr>
              <tr>
                <td><strong>Irradiance Measurement</strong></td>
                <td>Measure IR output at standard distance (50cm)</td>
                <td>Per manufacturer specification</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="warning-box mt-4">
          <strong>⚠️ EYE SAFETY:</strong> Never look directly at an operating IR lamp. Infrared radiation
          can cause retinal damage and cataracts. Always provide patients with appropriate eye protection
          (IR-blocking goggles) when treating near the face.
        </div>
      </div>

      {/* Section 7: Calibration */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">7. Calibration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Irradiance Calibration</h3>
            <div className="diagram-box text-xs">
{`
  IRRADIANCE MEASUREMENT SETUP:
  
  IR Lamp
     │
     │ 50 cm (standard distance)
     │
     ▼
  ┌──────────────────┐
  │  IR Radiometer   │
  │  (Detector)      │
  │                  │
  │  Reading: W/cm²  │
  └──────────────────┘
  
  TYPICAL VALUES:
  ├── Low setting:  10-20 mW/cm²
  ├── Medium:       20-40 mW/cm²
  └── High:         40-80 mW/cm²
  
  CALIBRATION PROCEDURE:
  1. Allow 15 min warm-up
  2. Position radiometer at 50cm
  3. Record reading at each setting
  4. Compare to manufacturer specs
  5. Adjust dimmer if needed
  6. Document results
`}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Treatment Distance Guide</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Lamp Power</th><th>Recommended Distance</th></tr>
                </thead>
                <tbody>
                  <tr><td>250W</td><td>45–60 cm</td></tr>
                  <tr><td>500W</td><td>60–75 cm</td></tr>
                  <tr><td>750W</td><td>75–90 cm</td></tr>
                  <tr><td>1000W</td><td>90–120 cm</td></tr>
                </tbody>
              </table>
            </div>
            <div className="tip-box mt-3">
              <strong>💡 Rule of Thumb:</strong> The patient should feel comfortable warmth,
              not burning heat. If the patient reports burning, increase the distance immediately.
            </div>
          </div>
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
            { q: "1. What are the two main types of emitters used in infrared lamps?", a: "Luminous (tungsten filament) emitters that produce visible light with IR, and non-luminous (ceramic/element) emitters that produce pure IR with no visible light." },
            { q: "2. What is the primary physiological effect sought from infrared therapy?", a: "Deep tissue heating that increases blood flow, relaxes muscles, reduces pain, and promotes tissue healing through vasodilation." },
            { q: "3. What is the key difference between luminous and non-luminous infrared generators?", a: "Luminous generators use a visible tungsten filament (wavelength ~0.8-1.5 μm) and produce visible light with IR. Non-luminous generators use a ceramic element (wavelength ~2-10 μm) and produce pure IR without visible light." },
            { q: "4. The lamp turns on but emits no heat/light. What is the most likely faulty part?", a: "The lamp filament/element is burned out and needs replacement." },
            { q: "5. What is the most important safety precaution regarding the distance and duration of treatment?", a: "Maintain proper distance (typically 50-75 cm) to prevent burns, and limit treatment duration (typically 15-30 minutes) with regular patient checks for comfort." },
            { q: "6. What should be regularly checked on the lamp's stand or mounting?", a: "Check the stability of the base, locking mechanisms on adjustable arms, castor wheels/brakes, and ensure the lamp stays securely in position." },
            { q: "7. Why must the lamp's reflector be kept clean?", a: "A dirty reflector reduces IR output efficiency, can cause uneven heating, and may create hot spots that could damage the lamp or reduce therapeutic effectiveness." },
            { q: "8. What simple test can indicate if a non-luminous element is functioning?", a: "Place your hand at a safe distance (30-40 cm) from the lamp - you should feel radiant heat within 1-2 minutes of turning it on." },
            { q: "9. Name one skin condition that is a contraindication for infrared therapy.", a: "Acute inflammation, infected wounds, malignant tumors, impaired skin sensation, recent scar tissue, or dermatological conditions in the treatment area." },
            { q: "10. What component protects the circuit from power surges?", a: "The fuse or circuit breaker in the power supply circuit protects against overcurrent and power surges." },
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
            "1. Explain the principle of heat transfer in infrared therapy and the depth of tissue penetration achieved.",
            "2. Compare the characteristics, advantages, and disadvantages of tungsten filament (luminous) versus ceramic (non-luminous) infrared lamps.",
            "3. Describe a logical troubleshooting approach for an infrared lamp that fails to power on at all.",
            "4. Detail the complete maintenance procedure for an infrared lamp, including cleaning the emitter and reflector, checking the housing, and testing the safety timer.",
            "5. Discuss the safety tests that must be performed, focusing on mechanical stability, electrical insulation, and timer accuracy.",
            "6. Explain why calibration of output intensity is not typically performed on basic infrared lamps, and what is verified instead.",
            "7. Analyze the potential for burns from infrared therapy and the factors (distance, time, skin sensation) that must be controlled to prevent them.",
            "8. Describe the correct setup for treating a patient's lower back with an infrared lamp, including patient positioning and safety instructions.",
            "9. Develop a checklist for the visual and functional inspection of an infrared therapy lamp during a routine service.",
            "10. Evaluate the importance of the device's mechanical components (adjustable stand, locking mechanisms) in ensuring safe and effective treatment delivery.",
          ].map((q, i) => (
            <details key={i} className="bg-red-50 rounded-lg p-3">
              <summary className="font-medium text-gray-800 cursor-pointer">{q}</summary>
              <p className="mt-2 text-gray-600 text-sm italic">[Extended response required - refer to the learning content above for detailed answers]</p>
            </details>
          ))}
        </div>
      </div>
      </div>{/* End printable-content */}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/muscle-stimulator" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Muscle Stimulator
        </Link>
        <Link href="/hydro-collator" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Next: Hydro-Collator →
        </Link>
      </div>
    </div>
  );
}
