import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function ElectrosurgicalUnitPage() {
  // ESU Simulation Function
  const simulateESU = (params: Record<string, number | string>) => {
    const power = params.power as number;
    const mode = params.mode as string;
    const activationTime = params.activationTime as number;
    const electrodeType = params.electrodeType as string;
    
    // Calculate derived parameters
    // Current density at electrode tip (A/mm²)
    let tipArea = electrodeType === "Needle" ? 0.5 : electrodeType === "Blade" ? 2 : 5; // mm²
    const voltage = Math.sqrt(power * 500); // Approximate RMS voltage (assuming 500Ω load)
    const current = power / voltage * 1000; // mA
    
    // Current density
    const currentDensity = current / tipArea;
    
    // Thermal effect based on mode
    let thermalEffect = "";
    let tissueEffect = "";
    let dutyCycle = 0;
    
    if (mode === "Cut") {
      thermalEffect = "Vaporization";
      tissueEffect = "Cell explosion → cutting";
      dutyCycle = 100;
    } else if (mode === "Coag") {
      thermalEffect = "Desiccation";
      tissueEffect = "Cell drying → coagulation";
      dutyCycle = 6;
    } else if (mode === "Blend1") {
      thermalEffect = "Cut + mild coag";
      tissueEffect = "Cutting with hemostasis";
      dutyCycle = 50;
    } else if (mode === "Blend2") {
      thermalEffect = "Cut + moderate coag";
      tissueEffect = "Cutting with more hemostasis";
      dutyCycle = 35;
    } else {
      thermalEffect = "Cut + high coag";
      tissueEffect = "Cutting with maximum hemostasis";
      dutyCycle = 20;
    }
    
    // Energy delivered
    const energyPerActivation = (power * activationTime) / 1000; // Joules
    
    // Safety thresholds
    const powerStatus = power > 300 ? "danger" as const : power > 200 ? "warning" as const : "normal" as const;
    const densityStatus = currentDensity > 500 ? "danger" as const : currentDensity > 300 ? "warning" as const : "normal" as const;
    const timeStatus = activationTime > 10 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Output Voltage", value: voltage.toFixed(0), unit: "V RMS", status: "normal" as const },
      { parameter: "Output Current", value: current.toFixed(0), unit: "mA", status: "normal" as const },
      { parameter: "Current Density", value: currentDensity.toFixed(0), unit: "mA/mm²", status: densityStatus },
      { parameter: "Duty Cycle", value: dutyCycle.toString(), unit: "%", status: "normal" as const },
      { parameter: "Thermal Effect", value: thermalEffect, unit: "", status: "normal" as const },
      { parameter: "Energy per Activation", value: energyPerActivation.toFixed(1), unit: "J", status: "normal" as const },
      { parameter: "Set Power", value: power.toString(), unit: "W", status: powerStatus },
      { parameter: "Activation Time", value: activationTime.toString(), unit: "sec", status: timeStatus },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="breadcrumb mb-4">
            <a href="/" className="text-red-200 hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <span>Electrosurgical Unit</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">⚡ Electrosurgical Unit (ESU)</h1>
          <p className="text-xl text-red-100">Module 9 — Maintenance, Fault Diagnosis & Safety</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-red-700 rounded-lg p-3">
              <div className="text-2xl font-bold">300–500</div>
              <div className="text-red-200 text-sm">kHz Operating Freq.</div>
            </div>
            <div className="bg-red-700 rounded-lg p-3">
              <div className="text-2xl font-bold">400W</div>
              <div className="text-red-200 text-sm">Max Output Power</div>
            </div>
            <div className="bg-red-700 rounded-lg p-3">
              <div className="text-2xl font-bold">IEC</div>
              <div className="text-red-200 text-sm">60601-2-2 Standard</div>
            </div>
            <div className="bg-red-700 rounded-lg p-3">
              <div className="text-2xl font-bold">CF</div>
              <div className="text-red-200 text-sm">Applied Part Type</div>
            </div>
          </div>
          {/* Print/Export Buttons */}
          <div className="mt-4">
            <PrintButton title="Electrosurgical Unit - Learning Notes" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Simulation Panel */}
        <SimulationPanel
          title="ESU Output Simulator"
          description="Configure ESU parameters to analyze output characteristics and tissue effects"
          parameters={[
            { name: "Power Setting", key: "power", unit: "W", min: 10, max: 400, step: 10, default: 50 },
            { name: "Activation Time", key: "activationTime", unit: "sec", min: 1, max: 15, step: 1, default: 3 },
            { 
              name: "Mode", 
              key: "mode", 
              unit: "", 
              min: 0, 
              max: 0, 
              default: "Cut",
              type: "select",
              options: [
                { value: "Cut", label: "Cut (Pure Sine)" },
                { value: "Coag", label: "Coagulate (Damped)" },
                { value: "Blend1", label: "Blend 1 (75% Cut)" },
                { value: "Blend2", label: "Blend 2 (50% Cut)" },
                { value: "Blend3", label: "Blend 3 (25% Cut)" },
              ]
            },
            { 
              name: "Electrode Type", 
              key: "electrodeType", 
              unit: "", 
              min: 0, 
              max: 0, 
              default: "Needle",
              type: "select",
              options: [
                { value: "Needle", label: "Needle Electrode" },
                { value: "Blade", label: "Blade Electrode" },
                { value: "Ball", label: "Ball Electrode" },
              ]
            },
          ]}
          simulate={simulateESU}
        />

        {/* Printable Content Wrapper */}
        <div id="printable-content">

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="section-header">1. Introduction to Electrosurgical Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is an ESU?</h3>
              <p className="text-gray-600 mb-3">
                An Electrosurgical Unit (ESU), also called a surgical diathermy machine or electrocautery unit,
                uses high-frequency alternating current (300 kHz–3 MHz) to cut tissue and coagulate blood vessels
                during surgical procedures. At these frequencies, the current does not stimulate nerves or muscles.
              </p>
              <div className="note-box p-3 rounded">
                <strong>Key Principle:</strong> High-frequency current (above 100 kHz) passes through tissue
                without causing neuromuscular stimulation. The thermal effect at the electrode tip causes
                cutting or coagulation depending on waveform type.
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Historical Context</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>1926:</strong> Harvey Cushing and William Bovie introduced ESU in neurosurgery</li>
                <li>• <strong>1970s:</strong> Solid-state transistor-based generators replaced spark-gap units</li>
                <li>• <strong>1980s:</strong> Bipolar forceps became standard for delicate surgery</li>
                <li>• <strong>1990s:</strong> Microprocessor-controlled units with tissue sensing</li>
                <li>• <strong>2000s:</strong> Vessel sealing systems (LigaSure, Harmonic) introduced</li>
                <li>• <strong>Today:</strong> Advanced energy platforms with multiple modalities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Main Parts */}
        <section className="mb-10">
          <h2 className="section-header">2. Main Parts of an Electrosurgical Unit</h2>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
╔══════════════════════════════════════════════════════════════════════════════╗
║              ELECTROSURGICAL UNIT — SYSTEM BLOCK DIAGRAM                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  MAINS INPUT          POWER SUPPLY UNIT          CONTROL UNIT               ║
║  ┌─────────┐         ┌──────────────────┐        ┌──────────────────┐       ║
║  │ 230V AC │────────▶│ Transformer      │        │ Microprocessor   │       ║
║  │  50 Hz  │         │ Rectifier        │        │ Control Board    │       ║
║  └─────────┘         │ Filter Caps      │        │ Memory/Settings  │       ║
║                      │ Voltage Reg.     │        │ Alarm Circuits   │       ║
║                      └────────┬─────────┘        └────────┬─────────┘       ║
║                               │ DC Power                  │ Control Signals  ║
║                               ▼                           ▼                  ║
║                      ┌──────────────────────────────────────────┐           ║
║                      │         RF GENERATOR STAGE               │           ║
║                      │  ┌─────────────┐   ┌──────────────────┐ │           ║
║                      │  │ Oscillator  │──▶│ Power Amplifier  │ │           ║
║                      │  │ 300-500 kHz │   │ (MOSFET/IGBT)    │ │           ║
║                      │  └─────────────┘   └────────┬─────────┘ │           ║
║                      │                             │            │           ║
║                      │  ┌──────────────────────────▼──────────┐ │           ║
║                      │  │    OUTPUT TRANSFORMER               │ │           ║
║                      │  │    (Impedance Matching)             │ │           ║
║                      │  └──────────────────────────┬──────────┘ │           ║
║                      └─────────────────────────────┼────────────┘           ║
║                                                     │                        ║
║              ┌──────────────────────────────────────┤                        ║
║              │                                      │                        ║
║              ▼                                      ▼                        ║
║  ┌───────────────────────┐            ┌─────────────────────────┐           ║
║  │  MONOPOLAR OUTPUT     │            │   BIPOLAR OUTPUT        │           ║
║  │  Active Electrode     │            │   Bipolar Forceps       │           ║
║  │  (Pencil/Blade/Loop)  │            │   (Both tips active)    │           ║
║  │  Return Electrode     │            │   No return plate       │           ║
║  │  (Patient Plate/REM)  │            │   needed                │           ║
║  └───────────────────────┘            └─────────────────────────┘           ║
║                                                                              ║
║  SAFETY SYSTEMS:                                                             ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │ REM (Return Electrode Monitoring) │ Isolated Output │ Alarm System  │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { name: "RF Generator", desc: "Produces high-frequency sinusoidal or modulated current at 300–500 kHz", icon: "⚡" },
              { name: "Power Amplifier", desc: "MOSFET/IGBT transistors amplify RF signal to surgical power levels (up to 400W)", icon: "🔊" },
              { name: "Output Transformer", desc: "Isolates patient circuit from mains; matches impedance to tissue load", icon: "🔄" },
              { name: "Active Electrode", desc: "Surgical pencil, blade, loop, or ball electrode — concentrates current at tip", icon: "✏️" },
              { name: "Return Electrode", desc: "Patient plate disperses current over large area to prevent burns at return site", icon: "📋" },
              { name: "REM Circuit", desc: "Return Electrode Monitoring — detects poor contact and alarms before burn occurs", icon: "🔍" },
              { name: "Footswitch/Handswitch", desc: "Activates cut or coagulate mode; isolated from mains for safety", icon: "🦶" },
              { name: "Control Panel", desc: "Sets power levels, mode selection (cut/coag/blend), displays settings", icon: "🎛️" },
              { name: "Isolated Power Supply", desc: "Provides DC rails to all circuits; isolated from mains earth", icon: "🔋" },
            ].map((part, i) => (
              <div key={i} className="component-card p-4 rounded-lg">
                <div className="text-2xl mb-2">{part.icon}</div>
                <h4 className="font-semibold text-gray-800">{part.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{part.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Circuit Diagram */}
        <section className="mb-10">
          <h2 className="section-header">3. Circuit Diagrams</h2>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">3.1 RF Oscillator and Power Amplifier Circuit</h3>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  RF OSCILLATOR (Colpitts/Crystal Controlled)
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  +VCC (15V)                                                         │
  │     │                                                               │
  │     ├──[R1 10kΩ]──┬──[R2 4.7kΩ]──┐                                │
  │     │             │               │                                 │
  │     │           [C1]            [RFC]  (RF Choke)                  │
  │     │           [10p]             │                                 │
  │     │             │               │                                 │
  │     │             └──[Q1 NPN]─────┤                                │
  │     │                 │           │                                 │
  │     │               [C2]        [L1]──[C3]──┐  (Tank Circuit)     │
  │     │               [100p]      [2μH] [47p]  │                     │
  │     │                 │                      │                     │
  │    GND               GND                    GND                    │
  │                                                                     │
  │  Output: ~300 kHz sinusoidal, ~1V p-p                              │
  └─────────────────────────────────────────────────────────────────────┘

  POWER AMPLIFIER STAGE (Class D Push-Pull)
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  +HV Bus (+300V DC)                                                 │
  │       │                                                             │
  │       ├──────────────────────────────────────────┐                 │
  │       │                                          │                 │
  │    [Q2 MOSFET]                               [Q3 MOSFET]           │
  │    IRF840                                    IRF840                 │
  │    Gate ◄── Driver A                         Gate ◄── Driver B     │
  │       │                                          │                 │
  │       └──────────────┬───────────────────────────┘                 │
  │                      │                                             │
  │               [OUTPUT TRANSFORMER]                                 │
  │               Primary: 10 turns                                    │
  │               Secondary: 20 turns (2:1 step-up)                   │
  │               Core: Ferrite, 300 kHz rated                         │
  │                      │                                             │
  │               ┌──────┴──────┐                                      │
  │               │             │                                      │
  │          MONOPOLAR      BIPOLAR                                    │
  │          OUTPUT         OUTPUT                                     │
  │          (Active +      (Forceps                                   │
  │           Return)        tips)                                     │
  │                                                                     │
  │  -HV Bus (-300V DC)                                                 │
  └─────────────────────────────────────────────────────────────────────┘

  REM (RETURN ELECTRODE MONITORING) CIRCUIT
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  Patient Plate has TWO segments (split plate design):               │
  │                                                                     │
  │  Segment A ──[Ra]──┬──[Rb]── Segment B                             │
  │                    │                                                │
  │                 [Comparator]                                        │
  │                    │                                                │
  │              If Ra ≠ Rb (>10% difference):                         │
  │              → ALARM triggered                                      │
  │              → Output DISABLED                                      │
  │              → LED indicator ON                                     │
  │                                                                     │
  │  Normal contact resistance: 5–135 Ω per segment                    │
  │  Alarm threshold: >135 Ω or >10% imbalance                         │
  └─────────────────────────────────────────────────────────────────────┘
`}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">3.2 Waveform Types</h3>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  ESU OUTPUT WAVEFORMS
  ═══════════════════════════════════════════════════════════════════

  CUT MODE (Pure Sine Wave — Continuous)
  ─────────────────────────────────────
  Voltage
    │    ╭─╮   ╭─╮   ╭─╮   ╭─╮   ╭─╮   ╭─╮
    │   ╭╯ ╰╮ ╭╯ ╰╮ ╭╯ ╰╮ ╭╯ ╰╮ ╭╯ ╰╮ ╭╯ ╰╮
    │───╯   ╰─╯   ╰─╯   ╰─╯   ╰─╯   ╰─╯   ╰───
    │
    └──────────────────────────────────────────▶ Time
    Duty Cycle: 100%  |  Crest Factor: 1.4  |  Effect: Vaporizes cells → CUTS

  COAGULATE MODE (Damped/Modulated — Intermittent)
  ─────────────────────────────────────────────────
  Voltage
    │  ╭╮╭╮╭╮╭╮         ╭╮╭╮╭╮╭╮         ╭╮╭╮
    │ ╭╯╰╯╰╯╰╯╰╮       ╭╯╰╯╰╯╰╯╰╮       ╭╯╰╯╰
    │─╯         ╰───────╯         ╰───────╯
    │
    └──────────────────────────────────────────▶ Time
    Duty Cycle: 6%  |  Crest Factor: 5–12  |  Effect: Desiccates → COAGULATES

  BLEND MODE (Mixed — Partially Modulated)
  ─────────────────────────────────────────
  Voltage
    │  ╭─╮╭╮╭─╮╭╮   ╭─╮╭╮╭─╮╭╮   ╭─╮╭╮
    │ ╭╯ ╰╯╰╯ ╰╯╰╮ ╭╯ ╰╯╰╯ ╰╯╰╮ ╭╯ ╰╯╰
    │─╯           ╰─╯           ╰─╯
    │
    └──────────────────────────────────────────▶ Time
    Duty Cycle: 25–75%  |  Crest Factor: 2–4  |  Effect: Cut + Hemostasis

  BIPOLAR MODE (Low Power, Precise)
  ──────────────────────────────────
  Voltage
    │  ╭─╮   ╭─╮   ╭─╮   ╭─╮
    │ ╭╯ ╰╮ ╭╯ ╰╮ ╭╯ ╰╮ ╭╯ ╰╮
    │─╯   ╰─╯   ╰─╯   ╰─╯   ╰─
    │
    └──────────────────────────────────────────▶ Time
    Power: 5–50W  |  Used for: Delicate tissue, near nerves/vessels
`}
          </div>
        </section>

        {/* Uses */}
        <section className="mb-10">
          <h2 className="section-header">4. Uses of Electrosurgical Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-green-700 mb-3">✅ Clinical Applications</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Cutting:</strong> Incision of skin, fascia, and soft tissue</li>
                <li>• <strong>Coagulation:</strong> Hemostasis — stopping bleeding vessels</li>
                <li>• <strong>Fulguration:</strong> Superficial tissue destruction (skin lesions)</li>
                <li>• <strong>Desiccation:</strong> Drying out tissue (warts, polyps)</li>
                <li>• <strong>Ablation:</strong> Endometrial ablation, cardiac ablation</li>
                <li>• <strong>LEEP:</strong> Loop Electrosurgical Excision Procedure (cervical)</li>
                <li>• <strong>Laparoscopic surgery:</strong> Minimally invasive procedures</li>
                <li>• <strong>Neurosurgery:</strong> Bipolar for delicate brain/nerve surgery</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-red-700 mb-3">⚠️ Contraindications & Precautions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Pacemakers:</strong> May interfere — use bipolar only, short bursts</li>
                <li>• <strong>Implanted defibrillators:</strong> Risk of inappropriate shock</li>
                <li>• <strong>Flammable agents:</strong> Never use near alcohol, oxygen-rich environments</li>
                <li>• <strong>Wet fields:</strong> Current spreads — risk of unintended burns</li>
                <li>• <strong>Near bowel:</strong> Risk of perforation from thermal spread</li>
                <li>• <strong>Metal implants:</strong> Current concentration risk at implant edges</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="mb-10">
          <h2 className="section-header">5. Types of Electrosurgical Units</h2>
          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Configuration</th>
                  <th>Power Range</th>
                  <th>Return Electrode</th>
                  <th>Applications</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Monopolar</strong></td>
                  <td>Active electrode + patient plate</td>
                  <td>10–400W</td>
                  <td>Required (dispersive)</td>
                  <td>General surgery, laparoscopy</td>
                </tr>
                <tr>
                  <td><strong>Bipolar</strong></td>
                  <td>Both electrodes in forceps tips</td>
                  <td>5–80W</td>
                  <td>Not required</td>
                  <td>Neurosurgery, ophthalmology, delicate tissue</td>
                </tr>
                <tr>
                  <td><strong>Vessel Sealing</strong></td>
                  <td>Tissue-sensing bipolar</td>
                  <td>Auto-controlled</td>
                  <td>Not required</td>
                  <td>Vessel ligation up to 7mm diameter</td>
                </tr>
                <tr>
                  <td><strong>Argon Beam</strong></td>
                  <td>Monopolar + argon gas flow</td>
                  <td>20–300W</td>
                  <td>Required</td>
                  <td>Liver surgery, large surface coagulation</td>
                </tr>
                <tr>
                  <td><strong>Ultrasonic</strong></td>
                  <td>Mechanical vibration (55 kHz)</td>
                  <td>5–55W</td>
                  <td>Not required</td>
                  <td>Harmonic scalpel — cut + coag simultaneously</td>
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
  ESU FAULT DIAGNOSIS FLOWCHART
  ══════════════════════════════════════════════════════════════════

  ESU FAILS TO ACTIVATE
         │
         ▼
  ┌─────────────────────────────┐
  │ Check power indicator LED   │
  └─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
  OFF        ON
    │         │
    ▼         ▼
  Check    ┌─────────────────────────────┐
  mains    │ Footswitch/handswitch test  │
  fuse     │ (use multimeter continuity) │
  power    └─────────────────────────────┘
  cable           │
               ┌──┴──┐
               │     │
            OPEN   CLOSED
               │     │
               ▼     ▼
           Replace  Check
           switch   cable
                    continuity
                    to unit

  NO OUTPUT / LOW POWER
         │
         ▼
  ┌─────────────────────────────┐
  │ Check output power meter    │
  │ (use ESU analyzer/load box) │
  └─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
  LOW       ZERO
    │         │
    ▼         ▼
  Check    Check RF
  output   oscillator
  MOSFET   stage
  transistors
  (gate drive)

  REM ALARM ACTIVE
         │
         ▼
  ┌─────────────────────────────┐
  │ Check patient plate contact │
  │ (skin prep, gel, placement) │
  └─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
  POOR      GOOD
  CONTACT   CONTACT
    │         │
    ▼         ▼
  Reapply  Check REM
  plate    cable
  with gel continuity
           and connector
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
                  <td>No output, unit powers on</td>
                  <td>Blown output fuse, failed MOSFET</td>
                  <td>Check fuses; measure MOSFET gate-drain resistance</td>
                  <td>Replace fuse/MOSFET; check driver circuit</td>
                </tr>
                <tr>
                  <td>REM alarm — plate connected</td>
                  <td>Dry skin, poor gel, cable fault</td>
                  <td>Measure plate resistance with ohmmeter (5–135Ω)</td>
                  <td>Re-prep skin, apply gel, replace cable/plate</td>
                </tr>
                <tr>
                  <td>Sparking at active electrode</td>
                  <td>Loose connector, damaged cable insulation</td>
                  <td>Visual inspection; insulation resistance test</td>
                  <td>Replace electrode cable; check connector</td>
                </tr>
                <tr>
                  <td>Excessive smoke/odor</td>
                  <td>Overheating output transformer or components</td>
                  <td>Thermal imaging; check ventilation fans</td>
                  <td>Clean filters; replace fan; check transformer</td>
                </tr>
                <tr>
                  <td>Inaccurate power output</td>
                  <td>Calibration drift, feedback circuit fault</td>
                  <td>ESU analyzer measurement vs. display</td>
                  <td>Recalibrate; replace feedback components</td>
                </tr>
                <tr>
                  <td>Interference with monitors</td>
                  <td>Poor RF shielding, grounding fault</td>
                  <td>Check chassis ground; inspect RF filters</td>
                  <td>Repair ground connection; replace RF filter caps</td>
                </tr>
                <tr>
                  <td>Patient burn at return site</td>
                  <td>REM circuit failure, poor plate contact</td>
                  <td>Test REM circuit with resistor substitution</td>
                  <td>Replace REM circuit board; retrain staff</td>
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
                <li>☐ Visual inspection of all cables and connectors</li>
                <li>☐ Check active electrode for damage/contamination</li>
                <li>☐ Verify patient plate cable integrity</li>
                <li>☐ Test REM alarm function</li>
                <li>☐ Check footswitch operation (cut and coag)</li>
                <li>☐ Verify power display accuracy</li>
                <li>☐ Clean exterior with approved disinfectant</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-3">📅 Monthly Checks</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>☐ Output power measurement (ESU analyzer)</li>
                <li>☐ Leakage current test (IEC 60601-1)</li>
                <li>☐ Earth continuity test (&lt;0.1Ω)</li>
                <li>☐ Insulation resistance test (&gt;100MΩ)</li>
                <li>☐ REM alarm threshold verification</li>
                <li>☐ Clean ventilation filters</li>
                <li>☐ Check all indicator lights and alarms</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h3 className="font-semibold text-purple-800 mb-3">📆 Annual Service</h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>☐ Full electrical safety test (IEC 60601-2-2)</li>
                <li>☐ Output power calibration across all modes</li>
                <li>☐ Replace electrolytic capacitors (if &gt;5 years)</li>
                <li>☐ Inspect and clean output transformer</li>
                <li>☐ Test all alarm systems</li>
                <li>☐ Verify isolated output (patient isolation)</li>
                <li>☐ Update service records and labels</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Tests */}
        <section className="mb-10">
          <h2 className="section-header">8. Safety Tests (IEC 60601-2-2)</h2>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  ESU SAFETY TEST SETUP
  ══════════════════════════════════════════════════════════════════

  OUTPUT POWER MEASUREMENT
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  ESU Unit                                                       │
  │  ┌──────────┐    Active Electrode Cable                        │
  │  │          │────────────────────────────┐                     │
  │  │  OUTPUT  │                            │                     │
  │  │          │    Return Electrode Cable  │                     │
  │  └──────────┘────────────────────────────┤                     │
  │                                          │                     │
  │                                   ┌──────┴──────┐              │
  │                                   │  ESU LOAD   │              │
  │                                   │  ANALYZER   │              │
  │                                   │  (200Ω load)│              │
  │                                   │  Measures:  │              │
  │                                   │  • Power(W) │              │
  │                                   │  • Voltage  │              │
  │                                   │  • Current  │              │
  │                                   │  • Crest    │              │
  │                                   │    Factor   │              │
  │                                   └─────────────┘              │
  │                                                                 │
  │  Standard Load: 200Ω (IEC 60601-2-2 Annex AA)                  │
  └─────────────────────────────────────────────────────────────────┘

  LEAKAGE CURRENT TEST
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  Mains ──[ESU]── Active Output ──[Measuring Device]── Earth    │
  │                                                                 │
  │  Limits (IEC 60601-1):                                          │
  │  • Earth leakage: ≤500μA (normal), ≤1000μA (single fault)      │
  │  • Patient leakage (HF): ≤100mA (normal condition)             │
  │  • Patient leakage (LF): ≤10μA (normal), ≤50μA (single fault)  │
  │                                                                 │
  │  CF-type applied parts (direct cardiac contact):                │
  │  • Patient leakage: ≤10μA (normal), ≤50μA (single fault)       │
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
                  <td>25A AC between mains earth pin and chassis</td>
                  <td>≤0.1Ω</td>
                  <td>IEC 60601-1</td>
                </tr>
                <tr>
                  <td>Insulation Resistance</td>
                  <td>500V DC between mains and chassis</td>
                  <td>≥100MΩ</td>
                  <td>IEC 60601-1</td>
                </tr>
                <tr>
                  <td>Earth Leakage Current</td>
                  <td>Measure current from chassis to earth</td>
                  <td>≤500μA (normal)</td>
                  <td>IEC 60601-1</td>
                </tr>
                <tr>
                  <td>HF Leakage Current</td>
                  <td>Measure HF current from patient circuit to earth</td>
                  <td>≤100mA</td>
                  <td>IEC 60601-2-2</td>
                </tr>
                <tr>
                  <td>Output Power Accuracy</td>
                  <td>ESU analyzer at 200Ω load, all modes</td>
                  <td>±20% of displayed value</td>
                  <td>IEC 60601-2-2</td>
                </tr>
                <tr>
                  <td>REM Alarm Test</td>
                  <td>Simulate open circuit and high resistance</td>
                  <td>Alarm at &gt;135Ω or &gt;10% imbalance</td>
                  <td>IEC 60601-2-2</td>
                </tr>
                <tr>
                  <td>Isolated Output Test</td>
                  <td>Measure isolation between output and earth</td>
                  <td>≥1MΩ at 500V DC</td>
                  <td>IEC 60601-2-2</td>
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
                  <li>• ESU Analyzer (e.g., Fluke Biomedical QA-ES III)</li>
                  <li>• 200Ω non-inductive load resistor</li>
                  <li>• Digital multimeter (True RMS)</li>
                  <li>• Oscilloscope (100 MHz bandwidth)</li>
                  <li>• Calibrated current probe</li>
                </ul>
                <h3 className="font-semibold text-gray-800 mb-3 mt-4">Calibration Steps</h3>
                <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                  <li>Connect ESU analyzer to active and return electrode ports</li>
                  <li>Set analyzer to 200Ω load mode</li>
                  <li>Set ESU to CUT mode, 50W setting</li>
                  <li>Activate output and record measured power</li>
                  <li>Adjust internal calibration potentiometer if &gt;±20% error</li>
                  <li>Repeat for COAG mode at 30W, 60W, 100W</li>
                  <li>Test BLEND modes (1, 2, 3) at mid-range settings</li>
                  <li>Test BIPOLAR mode at 10W, 30W, 50W</li>
                  <li>Record all results in calibration log</li>
                  <li>Affix calibration label with date and next due date</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Acceptance Criteria</h3>
                <div className="overflow-x-auto">
                  <table className="fault-table w-full text-sm">
                    <thead>
                      <tr>
                        <th>Mode</th>
                        <th>Set Power</th>
                        <th>Tolerance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Cut</td><td>50W</td><td>40–60W</td></tr>
                      <tr><td>Cut</td><td>100W</td><td>80–120W</td></tr>
                      <tr><td>Coag</td><td>30W</td><td>24–36W</td></tr>
                      <tr><td>Coag</td><td>60W</td><td>48–72W</td></tr>
                      <tr><td>Bipolar</td><td>30W</td><td>24–36W</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="warning-box p-3 rounded mt-4">
                  <strong>⚠️ Fire Safety:</strong> Never activate ESU output in open air
                  without a proper load. The high-voltage RF output can cause arcing
                  and ignite flammable materials. Always use a proper load resistor.
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>{/* End printable-content */}

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <a href="/traction-therapy" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
            ← Traction Therapy
          </a>
          <a href="/microwave-diathermy" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Microwave Diathermy →
          </a>
        </div>
      </div>
    </div>
  );
}
