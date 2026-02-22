import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function HotAirOvenPage() {
  // Hot Air Oven Simulation Function
  const simulateHotAirOven = (params: Record<string, number | string>) => {
    const temperature = params.temperature as number;
    const sterilizationTime = params.sterilizationTime as number;
    const chamberVolume = params.chamberVolume as number;
    const loadMass = params.loadMass as number;
    
    // Calculate heating time based on volume and load
    const baseHeatingTime = chamberVolume * 0.5; // minutes per liter
    const loadHeatingTime = loadMass * 0.3; // minutes per kg
    const totalHeatingTime = baseHeatingTime + loadHeatingTime;
    
    // Total cycle time
    const totalCycleTime = totalHeatingTime + sterilizationTime;
    
    // Energy consumption estimation
    const powerRating = chamberVolume * 50; // W per liter (approximate)
    const energyConsumption = (powerRating / 1000) * (totalCycleTime / 60); // kWh
    
    // Sterilization assurance level (SAL)
    // Higher temp + longer time = better SAL
    let salLog = 0;
    if (temperature >= 180 && sterilizationTime >= 30) {
      salLog = 12; // 10^-12 (overkill)
    } else if (temperature >= 170 && sterilizationTime >= 60) {
      salLog = 12;
    } else if (temperature >= 160 && sterilizationTime >= 120) {
      salLog = 12;
    } else if (temperature >= 160 && sterilizationTime >= 60) {
      salLog = 9; // 10^-9
    } else {
      salLog = 6; // 10^-6 (minimum acceptable)
    }
    
    // Safety thresholds
    const tempStatus = temperature > 180 ? "warning" as const : temperature < 160 ? "danger" as const : "normal" as const;
    const timeStatus = sterilizationTime < 30 ? "danger" as const : sterilizationTime < 60 ? "warning" as const : "normal" as const;
    const loadStatus = loadMass > chamberVolume * 0.5 ? "warning" as const : "normal" as const;
    const salStatus = salLog >= 12 ? "normal" as const : salLog >= 9 ? "warning" as const : "danger" as const;
    
    return [
      { parameter: "Est. Heating Time", value: totalHeatingTime.toFixed(0), unit: "min", status: "normal" as const },
      { parameter: "Total Cycle Time", value: totalCycleTime.toFixed(0), unit: "min", status: "normal" as const },
      { parameter: "Est. Energy Used", value: energyConsumption.toFixed(2), unit: "kWh", status: "normal" as const },
      { parameter: "SAL (Log Reduction)", value: `10^-${salLog}`, unit: "", status: salStatus },
      { parameter: "Sterilization Temp", value: temperature.toString(), unit: "°C", status: tempStatus },
      { parameter: "Hold Time", value: sterilizationTime.toString(), unit: "min", status: timeStatus },
      { parameter: "Chamber Volume", value: chamberVolume.toString(), unit: "L", status: "normal" as const },
      { parameter: "Load Mass", value: loadMass.toString(), unit: "kg", status: loadStatus },
    ];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Hot Air Oven</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🌡️ Hot Air Oven</h1>
        <p className="text-yellow-100">Learning Outcome 7: Perform Hot Air Oven Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests"].map(t => (
            <span key={t} className="bg-yellow-600 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {/* Print/Export Buttons */}
        <div className="mt-4">
          <PrintButton title="Hot Air Oven - Learning Notes" />
        </div>
      </div>

      {/* Simulation Panel */}
      <SimulationPanel
        title="Sterilization Cycle Simulator"
        description="Calculate sterilization parameters, cycle times, and sterility assurance"
        parameters={[
          { name: "Temperature", key: "temperature", unit: "°C", min: 140, max: 200, step: 5, default: 170 },
          { name: "Sterilization Time", key: "sterilizationTime", unit: "min", min: 15, max: 180, step: 5, default: 60 },
          { name: "Chamber Volume", key: "chamberVolume", unit: "L", min: 20, max: 200, step: 10, default: 50 },
          { name: "Load Mass", key: "loadMass", unit: "kg", min: 1, max: 30, step: 1, default: 5 },
        ]}
        simulate={simulateHotAirOven}
      />

      {/* Printable Content Wrapper */}
      <div id="printable-content">

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-yellow-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          A Hot Air Oven (also called a Dry Heat Sterilizer) is a medical device that uses dry heat
          at high temperatures to sterilize medical instruments and equipment. It is one of the oldest
          and most reliable methods of sterilization, using temperatures of <strong>160–180°C</strong>
          for defined periods to destroy all microorganisms including spores.
        </p>
        <div className="note-box">
          <strong>📌 Sterilization Parameters:</strong><br/>
          • 160°C for 2 hours<br/>
          • 170°C for 1 hour<br/>
          • 180°C for 30 minutes<br/>
          These are minimum times after the oven reaches the set temperature.
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Hot Air Oven</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  HOT AIR OVEN — CROSS-SECTION DIAGRAM:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                      HOT AIR OVEN                               │
  │                                                                 │
  │  ┌─────────────────────────────────────────────────────────┐   │
  │  │                    OUTER CASING                         │   │
  │  │  ┌───────────────────────────────────────────────────┐  │   │
  │  │  │              INSULATION LAYER                     │  │   │
  │  │  │  ┌─────────────────────────────────────────────┐  │  │   │
  │  │  │  │           INNER CHAMBER                     │  │  │   │
  │  │  │  │                                             │  │  │   │
  │  │  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐    │  │  │   │
  │  │  │  │  │ Shelf 1 │  │ Shelf 2 │  │ Shelf 3 │    │  │  │   │
  │  │  │  │  └─────────┘  └─────────┘  └─────────┘    │  │  │   │
  │  │  │  │                                             │  │  │   │
  │  │  │  │  ┌─────────────────────────────────────┐   │  │  │   │
  │  │  │  │  │      HEATING ELEMENTS               │   │  │  │   │
  │  │  │  │  │  (Top, Bottom, or Sides)            │   │  │  │   │
  │  │  │  │  └─────────────────────────────────────┘   │  │  │   │
  │  │  │  │                                             │  │  │   │
  │  │  │  │  ┌──────────┐  ← Circulation Fan           │  │  │   │
  │  │  │  │  │  FAN     │    (forced convection)       │  │  │   │
  │  │  │  │  └──────────┘                              │  │  │   │
  │  │  │  └─────────────────────────────────────────────┘  │  │   │
  │  │  └───────────────────────────────────────────────────┘  │   │
  │  └─────────────────────────────────────────────────────────┘   │
  │                                                                 │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
  │  │ THERMOSTAT   │  │  TIMER       │  │   TEMPERATURE        │  │
  │  │ CONTROL      │  │  CONTROL     │  │   INDICATOR/DISPLAY  │  │
  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │
  └─────────────────────────────────────────────────────────────────┘
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Electrical Circuit Diagram</h3>
        <div className="circuit-diagram">
{`
  HOT AIR OVEN ELECTRICAL CIRCUIT:
  
  MAINS SUPPLY (220-240V AC, 50Hz)
         │
         ├──[MAIN FUSE]──[POWER SWITCH]──────────────────────────────┐
         │                                                            │
         │                                                    ┌───────┴──────┐
         │                                                    │              │
         │                                              [THERMOSTAT]   [TIMER]
         │                                                    │              │
         │                                              ┌─────┴──────┐       │
         │                                              │            │       │
         │                                        [HEATING      [INDICATOR   │
         │                                         ELEMENTS]     LAMP]       │
         │                                              │            │       │
         │                                              └────────────┘       │
         │                                                                   │
         │                                                    [CIRCULATION   │
         │                                                      FAN MOTOR]   │
         │                                                                   │
         └───────────────────────────────────────────────────────────────────┘
                                                        NEUTRAL
  
  THERMOSTAT CONTROL DETAIL:
  
  Temperature Sensor (Thermocouple/RTD)
         │
         ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              TEMPERATURE CONTROLLER                         │
  │                                                             │
  │  Set Point ──▶ [Comparator] ──▶ [PID Controller] ──▶ [SSR] │
  │                    ▲                                   │    │
  │                    │                                   │    │
  │  Actual Temp ───────┘                           [Heating    │
  │                                                  Elements]  │
  └─────────────────────────────────────────────────────────────┘
  
  SSR = Solid State Relay (or electromechanical relay)
  PID = Proportional-Integral-Derivative controller
  
  SAFETY CIRCUIT:
  
  Overheat Thermostat (manual reset) ──── Cuts power if temp > 220°C
  Door Switch ──────────────────────────── Cuts heating when door open
  Thermal Fuse ─────────────────────────── One-shot protection at 250°C
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
              <tr><td><strong>Outer Casing</strong></td><td>Structural support, heat insulation</td><td>Mild steel, powder-coated</td></tr>
              <tr><td><strong>Inner Chamber</strong></td><td>Holds items for sterilization</td><td>Stainless steel, various sizes</td></tr>
              <tr><td><strong>Insulation</strong></td><td>Reduces heat loss, protects outer surface</td><td>Mineral wool or ceramic fiber</td></tr>
              <tr><td><strong>Heating Elements</strong></td><td>Generate heat</td><td>Nichrome wire, 1-3 kW total</td></tr>
              <tr><td><strong>Circulation Fan</strong></td><td>Ensures uniform temperature distribution</td><td>High-temperature motor, 50-100W</td></tr>
              <tr><td><strong>Thermostat/Controller</strong></td><td>Maintains set temperature</td><td>PID controller, ±1°C accuracy</td></tr>
              <tr><td><strong>Safety Cutout</strong></td><td>Prevents overheating</td><td>Manual reset, trips at ~220°C</td></tr>
              <tr><td><strong>Timer</strong></td><td>Controls sterilization duration</td><td>0-4 hours, mechanical or digital</td></tr>
              <tr><td><strong>Door/Gasket</strong></td><td>Seals chamber, prevents heat loss</td><td>High-temperature silicone gasket</td></tr>
              <tr><td><strong>Shelves</strong></td><td>Support items in chamber</td><td>Stainless steel, adjustable</td></tr>
              <tr><td><strong>Temperature Display</strong></td><td>Shows current temperature</td><td>Digital or analog thermometer</td></tr>
              <tr><td><strong>Ventilation Holes</strong></td><td>Allow moisture to escape</td><td>Adjustable vents</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Hot Air Oven</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-yellow-800 mb-2">🔬 Sterilization Uses</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Sterilization of glassware (beakers, flasks)</li>
              <li>Metal surgical instruments</li>
              <li>Forceps, scissors, scalpels</li>
              <li>Syringes (glass)</li>
              <li>Petri dishes and test tubes</li>
              <li>Powders and oils (heat-stable)</li>
              <li>Swabs and dressings (some types)</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">🏥 Advantages Over Autoclave</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>No moisture — suitable for moisture-sensitive items</li>
              <li>Can sterilize oils and powders</li>
              <li>No corrosion of metal instruments</li>
              <li>Simpler operation</li>
              <li>Lower cost</li>
              <li>No pressure vessel concerns</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">✅ Suitable Materials</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Stainless steel instruments</li>
              <li>Glass items</li>
              <li>Ceramic items</li>
              <li>Anhydrous oils and fats</li>
              <li>Powders (talc, starch)</li>
              <li>Metal containers</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Not Suitable For</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Rubber items (will melt/degrade)</li>
              <li>Plastic items</li>
              <li>Fabrics and textiles</li>
              <li>Heat-labile medications</li>
              <li>Paper items (may char)</li>
              <li>Aqueous solutions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Hot Air Oven</h2>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Temperature Range</th>
                <th>Application</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Gravity Convection</strong></td>
                <td>Natural air circulation by convection</td>
                <td>50–250°C</td>
                <td>General sterilization, drying</td>
              </tr>
              <tr>
                <td><strong>Forced Air Convection</strong></td>
                <td>Fan-assisted air circulation</td>
                <td>50–300°C</td>
                <td>Uniform sterilization, faster cycles</td>
              </tr>
              <tr>
                <td><strong>Vacuum Oven</strong></td>
                <td>Operates under reduced pressure</td>
                <td>50–200°C</td>
                <td>Heat-sensitive materials, drying</td>
              </tr>
              <tr>
                <td><strong>Muffle Furnace</strong></td>
                <td>Very high temperature, enclosed element</td>
                <td>200–1200°C</td>
                <td>Ashing, high-temp sterilization</td>
              </tr>
              <tr>
                <td><strong>Programmable Oven</strong></td>
                <td>Microprocessor-controlled cycles</td>
                <td>50–300°C</td>
                <td>Validated sterilization cycles</td>
              </tr>
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
  FAULT DIAGNOSIS FLOWCHART — HOT AIR OVEN:
  
  SYMPTOM: Oven not heating
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
  Check main fuse ──────── Blown? ───────▶ Replace fuse (check cause)
    │ OK
    ▼
  Check safety cutout ─── Tripped? ──────▶ Reset cutout (investigate cause)
    │ OK
    ▼
  Check thermal fuse ──── Blown? ────────▶ Replace thermal fuse
    │ OK
    ▼
  Check thermostat ──────── Faulty? ─────▶ Replace thermostat/controller
    │ OK
    ▼
  Check heating elements ─ Open circuit? ▶ Replace heating element(s)
    │ OK
    ▼
  Oven heats normally ✓
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
                <td>Oven not heating</td>
                <td>Blown fuse, failed element, tripped cutout</td>
                <td>Continuity test on elements, check fuse</td>
                <td>Replace element/fuse, reset cutout</td>
              </tr>
              <tr>
                <td>Overheating</td>
                <td>Faulty thermostat (stuck on), failed controller</td>
                <td>Monitor temperature with calibrated thermometer</td>
                <td>Replace thermostat/controller</td>
              </tr>
              <tr>
                <td>Temperature fluctuates</td>
                <td>Faulty thermostat, poor sensor contact</td>
                <td>Monitor temperature over time</td>
                <td>Replace thermostat, check sensor</td>
              </tr>
              <tr>
                <td>Uneven temperature</td>
                <td>Faulty fan, blocked air circulation</td>
                <td>Check fan operation, temperature mapping</td>
                <td>Replace fan, clear obstructions</td>
              </tr>
              <tr>
                <td>Fan not working</td>
                <td>Failed fan motor, broken connection</td>
                <td>Check fan motor resistance and supply</td>
                <td>Replace fan motor</td>
              </tr>
              <tr>
                <td>Door not sealing</td>
                <td>Worn gasket, bent door</td>
                <td>Visual inspection, temperature loss test</td>
                <td>Replace gasket, adjust door</td>
              </tr>
              <tr>
                <td>Timer not working</td>
                <td>Faulty timer mechanism</td>
                <td>Test timer independently</td>
                <td>Replace timer</td>
              </tr>
              <tr>
                <td>Display incorrect</td>
                <td>Faulty temperature sensor, display failure</td>
                <td>Compare to calibrated thermometer</td>
                <td>Replace sensor or display</td>
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
              <h4 className="font-bold text-green-700 mb-2">Daily</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Check temperature accuracy</li>
                <li>Inspect door seal/gasket</li>
                <li>Verify timer operation</li>
                <li>Clean interior after use</li>
                <li>Check indicator lights</li>
              </ul>
            </div>
            <div className="component-card border-l-4 border-blue-500 mt-3">
              <h4 className="font-bold text-blue-700 mb-2">Monthly</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Temperature mapping (multiple points)</li>
                <li>Calibrate thermostat</li>
                <li>Check fan operation</li>
                <li>Inspect heating elements</li>
                <li>Test safety cutout</li>
                <li>Clean ventilation slots</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Temperature Mapping Procedure</h3>
            <div className="diagram-box text-xs">
{`
  TEMPERATURE MAPPING:
  
  Place calibrated thermocouples at:
  
  ┌─────────────────────────────────┐
  │  TC1 ─── Top-Left Corner       │
  │  TC2 ─── Top-Right Corner      │
  │  TC3 ─── Center                │
  │  TC4 ─── Bottom-Left Corner    │
  │  TC5 ─── Bottom-Right Corner   │
  └─────────────────────────────────┘
  
  ACCEPTANCE CRITERIA:
  ├── All points within ±5°C of set temp
  ├── Temperature stable for 30 min
  └── No cold spots below sterilization temp
  
  RECORD:
  ├── Date and time
  ├── Set temperature
  ├── Readings at each point
  ├── Ambient temperature
  └── Technician signature
`}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🧹 Cleaning Procedure</h3>
        <div className="diagram-box">
{`
  CLEANING PROCEDURE:
  
  ⚠️  SAFETY: Switch off and allow to cool completely before cleaning
  
  1. INTERIOR CLEANING
     ├── Remove shelves and wash with mild detergent
     ├── Wipe interior walls with damp cloth
     ├── Remove any spilled material
     ├── Dry thoroughly before use
     └── Do NOT use abrasive cleaners
  
  2. EXTERIOR CLEANING
     ├── Wipe with damp cloth
     ├── Clean control panel carefully
     └── Dry thoroughly
  
  3. DOOR GASKET
     ├── Inspect for cracks or hardening
     ├── Clean with mild detergent
     ├── Check seal by closing door on paper
     │   (paper should be held firmly)
     └── Replace if seal is poor
  
  4. VENTILATION
     ├── Check ventilation holes are clear
     └── Clean with soft brush if blocked
`}
        </div>
      </div>

      {/* Section 6: Safety Tests */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">6. Safety Tests</h2>
        </div>

        <div className="note-box mt-4">
          <strong>📌 Standards:</strong> IEC 61010-1 (Safety requirements for electrical equipment for
          measurement, control, and laboratory use). Also refer to EN 12347 (Biotechnology — Hot air ovens).
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
                <td>Measure from mains earth to chassis</td>
                <td>≤ 0.1 Ω</td>
              </tr>
              <tr>
                <td><strong>Insulation Resistance</strong></td>
                <td>500V DC between live and earth</td>
                <td>≥ 2 MΩ</td>
              </tr>
              <tr>
                <td><strong>Leakage Current</strong></td>
                <td>Measure earth leakage current</td>
                <td>≤ 3.5 mA (IEC 61010-1)</td>
              </tr>
              <tr>
                <td><strong>Temperature Accuracy</strong></td>
                <td>Compare display to calibrated reference thermometer</td>
                <td>Within ±5°C of set temperature</td>
              </tr>
              <tr>
                <td><strong>Temperature Uniformity</strong></td>
                <td>Temperature mapping at multiple points</td>
                <td>All points within ±5°C of set temperature</td>
              </tr>
              <tr>
                <td><strong>Safety Cutout</strong></td>
                <td>Test overheat protection activation</td>
                <td>Must trip at ≤ 220°C (or per spec)</td>
              </tr>
              <tr>
                <td><strong>Outer Surface Temperature</strong></td>
                <td>Measure accessible outer surfaces at max temp</td>
                <td>≤ 50°C above ambient (accessible surfaces)</td>
              </tr>
              <tr>
                <td><strong>Timer Accuracy</strong></td>
                <td>Compare set time to actual elapsed time</td>
                <td>Within ±5% of set time</td>
              </tr>
              <tr>
                <td><strong>Biological Indicator Test</strong></td>
                <td>Use Bacillus atrophaeus spore strips</td>
                <td>All spores killed (no growth after incubation)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="warning-box mt-4">
          <strong>⚠️ FIRE SAFETY:</strong> Never sterilize flammable materials in a hot air oven.
          Ensure adequate ventilation around the oven. Do not overload the oven — allow air circulation
          between items. Never leave the oven unattended during operation.
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
            { q: "1. What is the heating element in a hot air oven typically made of?", a: "Nichrome (nickel-chromium alloy) resistance wire, or Kanthal (iron-chromium-aluminum alloy), wound on ceramic insulators." },
            { q: "2. What is the primary use of a hot air oven in a physiotherapy context?", a: "Dry heat sterilization of instruments, glassware, and heat-resistant materials that cannot be steam sterilized." },
            { q: "3. What are the two main types based on air circulation (natural vs. forced)?", a: "Natural convection ovens (rely on gravity for air circulation) and forced convection ovens (use a fan/blower for uniform heat distribution)." },
            { q: "4. The oven heats unevenly. What component in a forced-air oven might be faulty?", a: "The circulation fan or blower motor may be malfunctioning, causing uneven temperature distribution." },
            { q: "5. What is the most critical safety device to prevent temperature runaway?", a: "The over-temperature safety cutout (independent safety thermostat or thermal fuse) that disconnects power if the main thermostat fails." },
            { q: "6. What regular cleaning task is essential for performance and safety?", a: "Cleaning the interior chamber, shelves, door gasket, and ventilation openings to remove debris and ensure proper air circulation." },
            { q: "7. How is the door seal inspected for integrity?", a: "Close the door on a piece of paper - the paper should be held firmly. Check the gasket for cracks, hardening, or gaps." },
            { q: "8. What instrument is used to calibrate the oven's temperature?", a: "A calibrated reference thermometer or thermocouple probe with digital readout, traceable to national standards." },
            { q: "9. Why must vents and filters be kept clean?", a: "To ensure proper air circulation, temperature uniformity, and prevent overheating or fire hazards from accumulated debris." },
            { q: "10. What common issue is indicated by a constantly cycling thermostat?", a: "Poor insulation, door seal failure, or a thermostat that is out of calibration - the oven struggles to maintain stable temperature." },
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
            "1. Describe the construction and key components of a hot air oven (chamber, heater, blower, thermostat, safety thermostat).",
            "2. Compare the principles and applications of dry heat (hot air oven) versus moist heat (autoclave/hydrocollator) in therapeutic settings.",
            "3. Outline a troubleshooting procedure for a hot air oven that fails to reach its set temperature.",
            "4. Detail the calibration process for the oven's thermostat and temperature display using a calibrated reference thermometer.",
            "5. Discuss the safety tests, including verification of the independent over-temperature cut-out and door interlock (if present).",
            "6. Explain the proper cleaning procedure for the oven interior, shelves, and air circulation pathways.",
            "7. Analyze the fire risks associated with hot air ovens and the safety protocols for their operation and location.",
            "8. Describe how to perform a temperature uniformity mapping test within the oven chamber.",
            "9. Develop a log sheet for recording daily temperature checks and periodic calibration results.",
            "10. Evaluate the factors that affect the heating efficiency and lifespan of the oven, such as load placement and cleanliness.",
          ].map((q, i) => (
            <details key={i} className="bg-yellow-50 rounded-lg p-3">
              <summary className="font-medium text-gray-800 cursor-pointer">{q}</summary>
              <p className="mt-2 text-gray-600 text-sm italic">[Extended response required - refer to the learning content above for detailed answers]</p>
            </details>
          ))}
        </div>
      </div>
      </div>{/* End printable-content */}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/orthopaedic-oscillator" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Orthopaedic Oscillator
        </Link>
        <Link href="/traction-therapy" className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          Next: Traction Therapy →
        </Link>
      </div>
    </div>
  );
}
