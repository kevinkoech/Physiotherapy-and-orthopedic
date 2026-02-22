import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function HydroCollatorPage() {
  // Hydro-Collator Simulation Function
  const simulateHydroCollator = (params: Record<string, number | string>) => {
    const waterTemp = params.waterTemp as number;
    const packSize = params.packSize as string;
    const heatingPower = params.heatingPower as number;
    const waterVolume = params.waterVolume as number;
    
    // Calculate heating time based on power and volume
    // Q = mcΔT, where m = volume (L) ≈ mass (kg), c = 4.186 kJ/kg°C
    const tempRise = waterTemp - 20; // Assuming starting temp of 20°C
    const energyRequired = waterVolume * 4.186 * tempRise; // kJ
    const heatingTime = (energyRequired * 1000) / (heatingPower * 0.9); // seconds (90% efficiency)
    const heatingTimeMin = heatingTime / 60;
    
    // Pack heating time (time to reach therapeutic temp when submerged)
    let packHeatTime = 0;
    let packSurfaceTemp = 0;
    if (packSize === "Small") {
      packHeatTime = 20 + (75 - waterTemp) * 0.5;
      packSurfaceTemp = waterTemp - 15;
    } else if (packSize === "Medium") {
      packHeatTime = 30 + (75 - waterTemp) * 0.7;
      packSurfaceTemp = waterTemp - 20;
    } else {
      packHeatTime = 45 + (75 - waterTemp) * 1.0;
      packSurfaceTemp = waterTemp - 25;
    }
    
    // Energy consumption
    const energyPerHour = heatingPower * (waterTemp > 70 ? 0.3 : 0.8); // kWh (duty cycle)
    
    // Safety thresholds
    const tempStatus = waterTemp > 85 ? "danger" as const : waterTemp > 80 ? "warning" as const : "normal" as const;
    const packTempStatus = packSurfaceTemp > 55 ? "danger" as const : packSurfaceTemp > 50 ? "warning" as const : "normal" as const;
    const powerStatus = heatingPower > 2000 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Initial Heating Time", value: heatingTimeMin.toFixed(1), unit: "min", status: "normal" as const },
      { parameter: "Pack Heating Time", value: packHeatTime.toFixed(0), unit: "min", status: "normal" as const },
      { parameter: "Pack Surface Temp", value: packSurfaceTemp.toFixed(0), unit: "°C", status: packTempStatus },
      { parameter: "Energy Consumption", value: energyPerHour.toFixed(2), unit: "kWh", status: "normal" as const },
      { parameter: "Water Temperature", value: waterTemp.toString(), unit: "°C", status: tempStatus },
      { parameter: "Pack Size", value: packSize, unit: "", status: "normal" as const },
      { parameter: "Heater Power", value: heatingPower.toString(), unit: "W", status: powerStatus },
      { parameter: "Water Volume", value: waterVolume.toString(), unit: "L", status: "normal" as const },
    ];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Hydro-Collator Unit</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🌊 Hydro-Collator Unit</h1>
        <p className="text-cyan-100">Learning Outcome 4: Perform Hydro-Collator Unit Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests"].map(t => (
            <span key={t} className="bg-cyan-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {/* Print/Export Buttons */}
        <div className="mt-4">
          <PrintButton title="Hydro-Collator Unit - Learning Notes" />
        </div>
      </div>

      {/* Simulation Panel */}
      <SimulationPanel
        title="Hydro-Collator Simulator"
        description="Calculate heating times, energy consumption, and pack temperatures"
        parameters={[
          { name: "Water Temperature", key: "waterTemp", unit: "°C", min: 60, max: 90, step: 1, default: 75 },
          { name: "Heater Power", key: "heatingPower", unit: "W", min: 500, max: 2500, step: 100, default: 1500 },
          { name: "Water Volume", key: "waterVolume", unit: "L", min: 10, max: 50, step: 5, default: 25 },
          { 
            name: "Pack Size", 
            key: "packSize", 
            unit: "", 
            min: 0, 
            max: 0, 
            default: "Medium",
            type: "select",
            options: [
              { value: "Small", label: "Small (20×30 cm)" },
              { value: "Medium", label: "Medium (25×35 cm)" },
              { value: "Large", label: "Large (30×45 cm)" },
            ]
          },
        ]}
        simulate={simulateHydroCollator}
      />

      {/* Printable Content Wrapper */}
      <div id="printable-content">

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-cyan-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          A Hydro-Collator (also called a Hot Pack Unit or Moist Heat Unit) is a thermostatically
          controlled water heating device used to heat silica gel-filled canvas packs (hot packs/
          hydrocollator packs) to therapeutic temperatures. The heated packs are then applied to
          patients for moist heat therapy.
        </p>
        <div className="note-box">
          <strong>📌 Key Fact:</strong> Hydro-collator units maintain water temperature at
          <strong> 70–80°C (158–176°F)</strong>. Hot packs are wrapped in towels before application
          to prevent burns. Treatment temperature at skin surface should be <strong>40–45°C</strong>.
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Hydro-Collator Unit</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  HYDRO-COLLATOR UNIT — CROSS-SECTION DIAGRAM:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                    HYDRO-COLLATOR UNIT                          │
  │                                                                 │
  │  ┌─────────────────────────────────────────────────────────┐   │
  │  │                    LID (Insulated)                      │   │
  │  └─────────────────────────────────────────────────────────┘   │
  │                                                                 │
  │  ┌─────────────────────────────────────────────────────────┐   │
  │  │                                                         │   │
  │  │    ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
  │  │    │ Hot Pack │  │ Hot Pack │  │ Hot Pack │           │   │
  │  │    │  (Silica │  │  (Silica │  │  (Silica │           │   │
  │  │    │   Gel)   │  │   Gel)   │  │   Gel)   │           │   │
  │  │    └──────────┘  └──────────┘  └──────────┘           │   │
  │  │                                                         │   │
  │  │    ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   │   │
  │  │                   WATER (70-80°C)                       │   │
  │  │    ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   │   │
  │  │                                                         │   │
  │  │    ┌─────────────────────────────────────────────┐     │   │
  │  │    │         HEATING ELEMENT (Immersion)         │     │   │
  │  │    └─────────────────────────────────────────────┘     │   │
  │  │                                                         │   │
  │  └─────────────────────────────────────────────────────────┘   │
  │                                                                 │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
  │  │ THERMOSTAT   │  │  INDICATOR   │  │   DRAIN VALVE        │  │
  │  │ CONTROL      │  │  LIGHT       │  │                      │  │
  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │
  │                                                                 │
  │  ┌─────────────────────────────────────────────────────────┐   │
  │  │              INSULATED OUTER CASING                     │   │
  │  └─────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────┘
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Electrical Circuit Diagram</h3>
        <div className="circuit-diagram">
{`
  HYDRO-COLLATOR ELECTRICAL CIRCUIT:
  
  MAINS SUPPLY (220-240V AC)
         │
         ├──[FUSE]──[POWER SWITCH]──────────────────────────────┐
         │                                                       │
         │                                                  [THERMOSTAT]
         │                                                       │
         │                                              ┌────────┴────────┐
         │                                              │                 │
         │                                        [HEATING           [INDICATOR
         │                                         ELEMENT]           LAMP]
         │                                              │                 │
         └──────────────────────────────────────────────┴─────────────────┘
                                                        │
                                                       NEUTRAL
  
  THERMOSTAT DETAIL:
  
  Bimetallic Strip or NTC Thermistor ──[Control Circuit]──[Relay/Contactor]
                                                                │
                                                         [Heating Element]
  
  TEMPERATURE CONTROL:
  
  Set Point: 70-80°C
  
  Water Temp < Set Point:
  ├── Thermostat contacts CLOSE
  ├── Heating element ON
  └── Indicator lamp ON
  
  Water Temp ≥ Set Point:
  ├── Thermostat contacts OPEN
  ├── Heating element OFF
  └── Indicator lamp OFF (or changes color)
  
  SAFETY CUTOUT:
  
  Overheat Thermostat (manual reset) ──── Cuts power if temp > 95°C
  Low Water Level Sensor ──────────────── Cuts power if water too low
`}
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Function</th>
                <th>Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Tank/Container</strong></td><td>Holds water and hot packs</td><td>Stainless steel, 20-40L capacity</td></tr>
              <tr><td><strong>Heating Element</strong></td><td>Heats the water</td><td>Immersion heater, 1-3 kW</td></tr>
              <tr><td><strong>Thermostat</strong></td><td>Maintains set temperature</td><td>Adjustable 60-90°C, ±2°C accuracy</td></tr>
              <tr><td><strong>Safety Cutout</strong></td><td>Prevents overheating</td><td>Manual reset, trips at ~95°C</td></tr>
              <tr><td><strong>Indicator Light</strong></td><td>Shows heating status</td><td>Neon or LED indicator</td></tr>
              <tr><td><strong>Insulated Lid</strong></td><td>Retains heat, prevents evaporation</td><td>Double-walled insulated lid</td></tr>
              <tr><td><strong>Drain Valve</strong></td><td>Allows water drainage for cleaning</td><td>Bottom-mounted valve</td></tr>
              <tr><td><strong>Pack Rack/Basket</strong></td><td>Holds hot packs in water</td><td>Stainless steel rack</td></tr>
              <tr><td><strong>Outer Casing</strong></td><td>Insulates and protects</td><td>Stainless steel or ABS plastic</td></tr>
              <tr><td><strong>Hot Packs</strong></td><td>Store and release moist heat</td><td>Canvas bags filled with silica gel</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Hydro-Collator Unit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-cyan-800 mb-2">🔥 Therapeutic Applications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Moist heat therapy for muscle relaxation</li>
              <li>Pre-exercise warm-up treatment</li>
              <li>Preparation for manual therapy/massage</li>
              <li>Joint stiffness and arthritis treatment</li>
              <li>Muscle spasm relief</li>
              <li>Chronic pain management</li>
              <li>Subacute injury treatment</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">⚙️ Physiological Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Vasodilation and increased circulation</li>
              <li>Muscle relaxation</li>
              <li>Increased tissue extensibility</li>
              <li>Pain relief (gate control)</li>
              <li>Increased metabolic rate</li>
              <li>Moist heat penetrates deeper than dry heat</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">✅ Advantages of Moist Heat</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Better heat transfer than dry heat</li>
              <li>More comfortable for patients</li>
              <li>Conforms to body contours</li>
              <li>Maintains temperature for 20-30 min</li>
              <li>Reusable (after reheating)</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Acute inflammation/injury</li>
              <li>Impaired sensation</li>
              <li>Peripheral vascular disease</li>
              <li>Malignancy in area</li>
              <li>Open wounds</li>
              <li>Pregnancy (abdomen/pelvis)</li>
              <li>Bleeding disorders</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Hydro-Collator Unit</h2>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Capacity</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tabletop/Countertop</strong></td>
                <td>Compact unit for small clinics</td>
                <td>4-6 packs</td>
                <td>Small physiotherapy clinics</td>
              </tr>
              <tr>
                <td><strong>Mobile/Portable</strong></td>
                <td>Unit on wheels for easy movement</td>
                <td>6-12 packs</td>
                <td>Multi-room clinics, home visits</td>
              </tr>
              <tr>
                <td><strong>Stationary/Floor Model</strong></td>
                <td>Large capacity, fixed installation</td>
                <td>12-24 packs</td>
                <td>Large hospitals, rehabilitation centers</td></tr>
              <tr>
                <td><strong>Digital Control</strong></td>
                <td>Electronic thermostat with digital display</td>
                <td>Various</td>
                <td>Precise temperature control needed</td>
              </tr>
              <tr>
                <td><strong>Analog Control</strong></td>
                <td>Mechanical thermostat, dial control</td>
                <td>Various</td>
                <td>Standard clinical use</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">📦 Hot Pack Types</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pack Type</th>
                <th>Size</th>
                <th>Application Area</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Standard</td><td>24×30 cm</td><td>Back, thigh, abdomen</td></tr>
              <tr><td>Cervical (neck)</td><td>Contoured shape</td><td>Neck and cervical spine</td></tr>
              <tr><td>Oversize</td><td>30×60 cm</td><td>Full back, large areas</td></tr>
              <tr><td>Half size</td><td>15×24 cm</td><td>Shoulder, knee, small areas</td></tr>
              <tr><td>Spinal</td><td>Long narrow shape</td><td>Spine, lumbar region</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Fault Diagnosis */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">4. Fault Diagnosis</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  FAULT DIAGNOSIS FLOWCHART — HYDRO-COLLATOR:
  
  SYMPTOM: Water not heating
  ─────────────────────────
  
  START
    │
    ▼
  Check mains supply ──── No power? ─────▶ Check socket, fuse, circuit breaker
    │ OK
    ▼
  Check power switch ──── Faulty? ───────▶ Replace switch
    │ OK
    ▼
  Check safety cutout ─── Tripped? ──────▶ Reset cutout (find cause first!)
    │ OK
    ▼
  Check thermostat ──────── Faulty? ─────▶ Replace thermostat
    │ OK
    ▼
  Check heating element ── Open circuit? ▶ Replace heating element
    │ OK
    ▼
  Check water level ──────── Too low? ───▶ Add water to correct level
    │ OK
    ▼
  Water heats normally ✓
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
                <td>Water not heating</td>
                <td>Faulty element, blown fuse, tripped cutout</td>
                <td>Continuity test on element, check fuse</td>
                <td>Replace element/fuse, reset cutout</td>
              </tr>
              <tr>
                <td>Water overheating</td>
                <td>Faulty thermostat (stuck closed)</td>
                <td>Measure water temperature</td>
                <td>Replace thermostat</td>
              </tr>
              <tr>
                <td>Temperature fluctuates widely</td>
                <td>Faulty thermostat, scale buildup on element</td>
                <td>Monitor temperature over time</td>
                <td>Replace thermostat, descale element</td>
              </tr>
              <tr>
                <td>Water leaking</td>
                <td>Corroded tank, faulty drain valve, damaged seal</td>
                <td>Visual inspection, pressure test</td>
                <td>Repair/replace tank, valve, or seal</td>
              </tr>
              <tr>
                <td>Indicator light not working</td>
                <td>Blown indicator lamp, broken connection</td>
                <td>Check voltage at indicator</td>
                <td>Replace indicator lamp</td>
              </tr>
              <tr>
                <td>Slow heating</td>
                <td>Scale buildup on element, low voltage</td>
                <td>Check element resistance, measure voltage</td>
                <td>Descale element, check supply voltage</td>
              </tr>
              <tr>
                <td>Discolored water</td>
                <td>Rust, algae growth, mineral deposits</td>
                <td>Visual inspection</td>
                <td>Drain, clean, refill with fresh water</td>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="component-card border-l-4 border-green-500">
              <h4 className="font-bold text-green-700 mb-2">Daily Maintenance</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Check water level (top up if needed)</li>
                <li>Verify temperature setting</li>
                <li>Inspect hot packs for damage</li>
                <li>Check indicator light operation</li>
                <li>Wipe exterior clean</li>
              </ul>
            </div>
            <div className="component-card border-l-4 border-blue-500 mt-3">
              <h4 className="font-bold text-blue-700 mb-2">Weekly Maintenance</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Check water clarity (change if discolored)</li>
                <li>Inspect for leaks</li>
                <li>Clean lid and exterior thoroughly</li>
                <li>Check hot pack canvas for tears</li>
                <li>Verify thermostat accuracy</li>
              </ul>
            </div>
          </div>
          <div>
            <div className="component-card border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-700 mb-2">Monthly Maintenance</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Drain and clean tank completely</li>
                <li>Descale heating element</li>
                <li>Check all electrical connections</li>
                <li>Test safety cutout operation</li>
                <li>Calibrate thermostat</li>
                <li>Inspect drain valve</li>
              </ul>
            </div>
            <div className="component-card border-l-4 border-purple-500 mt-3">
              <h4 className="font-bold text-purple-700 mb-2">Annual Maintenance</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Full electrical safety test</li>
                <li>Replace heating element (preventive)</li>
                <li>Replace thermostat if aging</li>
                <li>Check insulation integrity</li>
                <li>Earth continuity test</li>
                <li>Leakage current test</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🧹 Tank Cleaning Procedure</h3>
        <div className="diagram-box">
{`
  TANK CLEANING PROCEDURE:
  
  ⚠️  SAFETY: Switch off and allow water to cool before draining
  
  1. DRAIN
     ├── Open drain valve
     ├── Allow all water to drain
     └── Close drain valve
  
  2. DESCALING (if scale present)
     ├── Fill with 1:10 white vinegar solution
     ├── Heat to 60°C for 30 minutes
     ├── Drain vinegar solution
     └── Rinse thoroughly with clean water
  
  3. CLEANING
     ├── Wipe interior with mild detergent solution
     ├── Scrub any stubborn deposits
     ├── Rinse thoroughly (3 times minimum)
     └── Inspect for corrosion or damage
  
  4. REFILL
     ├── Close drain valve securely
     ├── Fill with clean water to correct level
     ├── Add water treatment tablet if recommended
     └── Switch on and verify operation
  
  5. HOT PACK MAINTENANCE
     ├── Inspect canvas covers for tears/wear
     ├── Check silica gel integrity
     ├── Replace packs if canvas damaged
     └── Ensure packs are fully submerged
  
  WATER QUALITY:
  ├── Use clean tap water or distilled water
  ├── Change water every 1-2 weeks
  └── Add antimicrobial agent if recommended by manufacturer
`}
        </div>
      </div>

      {/* Section 6: Safety Tests */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">6. Safety Tests</h2>
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
                <td>Measure from mains earth to metal chassis</td>
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
                <td><strong>Thermostat Accuracy</strong></td>
                <td>Measure water temperature with calibrated thermometer</td>
                <td>Within ±5°C of set temperature</td>
              </tr>
              <tr>
                <td><strong>Safety Cutout Test</strong></td>
                <td>Simulate overtemperature condition</td>
                <td>Must trip at ≤ 95°C</td>
              </tr>
              <tr>
                <td><strong>Water Leak Test</strong></td>
                <td>Fill to maximum level, inspect for leaks after 30 min</td>
                <td>No leaks</td>
              </tr>
              <tr>
                <td><strong>Surface Temperature</strong></td>
                <td>Measure accessible outer surfaces during operation</td>
                <td>≤ 48°C above ambient (accessible surfaces)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="warning-box mt-4">
          <strong>⚠️ BURN PREVENTION:</strong> Hot packs must always be wrapped in at least
          6-8 layers of towelling before application. Never apply hot packs directly to skin.
          Check patient comfort every 5 minutes during treatment. Water temperature of 70-80°C
          can cause severe burns on direct contact.
        </div>
      </div>

      {/* Section 7: Assessment */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">7. Assessment Questions</h2>
        </div>

        <h3 className="font-bold text-gray-800 mt-4 mb-3">📝 Short-Answer Questions</h3>
        <div className="space-y-3">
          {[
            { q: "1. What is the core component that heats the water in a hydrocollator?", a: "An electric immersion heating element, typically 1000-2000W, located at the bottom of the tank." },
            { q: "2. What is the standard temperature range maintained for hydrocollator packs?", a: "70-80°C (158-176°F) to keep the hot packs at therapeutic temperature without boiling the water." },
            { q: "3. What are the two main types of hydrocollator units based on capacity?", a: "Large stationary units (holding 6-12 packs) for clinic use, and smaller portable units (holding 2-4 packs) for mobile therapy." },
            { q: "4. The unit is powered but not heating. Name the first two components to check.", a: "The heating element (for continuity/burnout) and the thermostat (for proper operation and calibration)." },
            { q: "5. What is the critical safety device that must be tested to prevent overheating?", a: "The over-temperature safety cutout (thermal fuse or high-limit thermostat) that trips if water temperature exceeds safe limits (typically 95°C)." },
            { q: "6. Why is regular draining and cleaning of the tank necessary?", a: "To remove mineral scale buildup, bacterial growth, and debris that can affect heating efficiency, water quality, and hygiene." },
            { q: "7. What common issue occurs with the pack covers over time?", a: "The canvas or fabric covers can develop tears, fraying, or become thin from repeated use, requiring replacement." },
            { q: "8. How should a leaking thermal pack be handled?", a: "Remove it from the unit immediately, dispose of it properly, and replace with a new pack. Leaking packs contaminate the water and can cause burns." },
            { q: "9. What is the recommended method for cleaning the exterior of the unit?", a: "Wipe with a damp cloth and mild detergent, then dry thoroughly. Avoid abrasive cleaners or excessive water that could enter electrical components." },
            { q: "10. What should be checked on the unit's power cord regularly?", a: "Check for fraying, cracks, exposed wires, damaged plug, or signs of overheating at connections." },
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
            "1. Describe the working principle of a hydrocollator unit, explaining how it maintains a constant moist heat.",
            "2. Compare the use and maintenance requirements of a large stationary hydrocollator tank versus a smaller portable unit.",
            "3. Outline a diagnostic procedure for a hydrocollator that is heating too slowly or cannot reach the set temperature.",
            "4. Detail the step-by-step process for draining, descaling, and refilling a hydrocollator tank.",
            "5. Discuss the safety mechanisms in a hydrocollator (thermostat, over-temperature cut-out) and how to functionally test them.",
            "6. Explain the proper inspection, cleaning, and storage procedures for the silicone or fabric-covered moist heat packs.",
            "7. Analyze the infection control considerations related to hydrocollator use, including water treatment and pack hygiene.",
            "8. Describe the correct procedure for preparing and applying a moist heat pack to a patient, including the use of towelling layers.",
            "9. Develop a maintenance log template for a hydrocollator unit, listing daily, weekly, and monthly tasks.",
            "10. Evaluate the risks associated with a malfunctioning thermostat (e.g., scalding) and the importance of redundant safety controls.",
          ].map((q, i) => (
            <details key={i} className="bg-cyan-50 rounded-lg p-3">
              <summary className="font-medium text-gray-800 cursor-pointer">{q}</summary>
              <p className="mt-2 text-gray-600 text-sm italic">[Extended response required - refer to the learning content above for detailed answers]</p>
            </details>
          ))}
        </div>
      </div>
      </div>{/* End printable-content */}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/infrared-therapy" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Infrared Therapy
        </Link>
        <Link href="/massage-therapy" className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
          Next: Massage Therapy →
        </Link>
      </div>
    </div>
  );
}
