export default function OrthopaedicSawPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="breadcrumb mb-4">
            <a href="/" className="text-slate-300 hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <span>Orthopaedic Saw</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">🔧 Orthopaedic Saw</h1>
          <p className="text-xl text-slate-200">Module 11 — Maintenance, Fault Diagnosis & Safety</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-600 rounded-lg p-3">
              <div className="text-2xl font-bold">10,000</div>
              <div className="text-slate-300 text-sm">RPM (Rotary)</div>
            </div>
            <div className="bg-slate-600 rounded-lg p-3">
              <div className="text-2xl font-bold">15,000</div>
              <div className="text-slate-300 text-sm">OPM (Oscillating)</div>
            </div>
            <div className="bg-slate-600 rounded-lg p-3">
              <div className="text-2xl font-bold">Sterile</div>
              <div className="text-slate-300 text-sm">Autoclavable</div>
            </div>
            <div className="bg-slate-600 rounded-lg p-3">
              <div className="text-2xl font-bold">IEC</div>
              <div className="text-slate-300 text-sm">60601-2-2 Standard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="section-header">1. Introduction to Orthopaedic Saws</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is an Orthopaedic Saw?</h3>
              <p className="text-gray-600 mb-3">
                Orthopaedic saws are powered surgical instruments used to cut bone during orthopaedic
                procedures such as joint replacement, fracture fixation, and osteotomy. They use
                pneumatic (compressed air/nitrogen) or electric power to drive oscillating, reciprocating,
                or sagittal saw blades.
              </p>
              <div className="note-box p-3 rounded">
                <strong>Key Principle:</strong> Orthopaedic saws use high-frequency oscillation
                (not rotation) to cut bone with minimal soft tissue damage. The blade moves
                back and forth at 10,000–20,000 oscillations per minute.
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Power Sources</h3>
              <div className="overflow-x-auto">
                <table className="fault-table w-full text-sm">
                  <thead>
                    <tr>
                      <th>Power Source</th>
                      <th>Advantages</th>
                      <th>Disadvantages</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Pneumatic</strong></td>
                      <td>Lightweight, no EMI, high torque</td>
                      <td>Requires N₂ supply, noisy</td>
                    </tr>
                    <tr>
                      <td><strong>Electric (AC)</strong></td>
                      <td>Consistent power, no gas supply</td>
                      <td>Heavier, EMI risk, cord</td>
                    </tr>
                    <tr>
                      <td><strong>Battery</strong></td>
                      <td>Cordless, portable, no gas</td>
                      <td>Limited run time, battery aging</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Main Parts */}
        <section className="mb-10">
          <h2 className="section-header">2. Main Parts of an Orthopaedic Saw</h2>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
╔══════════════════════════════════════════════════════════════════════════════╗
║              ORTHOPAEDIC SAW — SYSTEM BLOCK DIAGRAM                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  PNEUMATIC SYSTEM                    ELECTRIC SYSTEM                        ║
║  ┌─────────────────────┐             ┌─────────────────────┐                ║
║  │ N₂ Cylinder         │             │ Battery Pack        │                ║
║  │ (800–1200 kPa)      │             │ (14.4V Li-Ion)      │                ║
║  │         │           │             │         │           │                ║
║  │  [Pressure Reg.]    │             │  [Motor Controller] │                ║
║  │  (400–600 kPa)      │             │  (PWM Speed Ctrl)   │                ║
║  │         │           │             │         │           │                ║
║  │  [Flow Control]     │             │  [Brushless Motor]  │                ║
║  │  [Trigger Valve]    │             │  (High torque)      │                ║
║  └─────────┬───────────┘             └─────────┬───────────┘                ║
║            │                                   │                            ║
║            └──────────────┬────────────────────┘                            ║
║                           │ Mechanical Power                                ║
║                           ▼                                                 ║
║                  ┌─────────────────────┐                                    ║
║                  │   HANDPIECE BODY    │                                    ║
║                  │  ┌───────────────┐  │                                    ║
║                  │  │ Motor/Turbine │  │                                    ║
║                  │  │ Gear Reduction│  │                                    ║
║                  │  │ Eccentric Cam │  │                                    ║
║                  │  │ (Oscillation) │  │                                    ║
║                  │  └───────┬───────┘  │                                    ║
║                  │          │          │                                    ║
║                  │  ┌───────▼───────┐  │                                    ║
║                  │  │ BLADE CHUCK   │  │                                    ║
║                  │  │ (Quick-release│  │                                    ║
║                  │  │  mechanism)   │  │                                    ║
║                  │  └───────┬───────┘  │                                    ║
║                  └──────────┼──────────┘                                    ║
║                             │                                               ║
║                    ┌────────┴────────┐                                      ║
║                    │   SAW BLADE     │                                      ║
║                    │ (Oscillating/   │                                      ║
║                    │  Reciprocating/ │                                      ║
║                    │  Sagittal)      │                                      ║
║                    └─────────────────┘                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { name: "Handpiece Body", desc: "Ergonomic housing containing motor/turbine, gear train, and eccentric cam mechanism for oscillation", icon: "🔧" },
              { name: "Motor/Turbine", desc: "Pneumatic turbine or brushless DC motor providing rotational power; speed controlled by trigger", icon: "⚙️" },
              { name: "Eccentric Cam", desc: "Converts rotational motion to oscillating/reciprocating motion for the saw blade", icon: "🔄" },
              { name: "Blade Chuck", desc: "Quick-release mechanism for rapid blade changes; accepts various blade types and sizes", icon: "🔩" },
              { name: "Saw Blades", desc: "Disposable or reusable stainless steel blades; various tooth patterns for different bone types", icon: "⚡" },
              { name: "Trigger/Speed Control", desc: "Variable speed trigger allows surgeon to control cutting speed from 0 to maximum", icon: "🎛️" },
              { name: "Irrigation System", desc: "Saline irrigation through handpiece cools blade and bone, preventing thermal necrosis", icon: "💧" },
              { name: "Sterilization Tray", desc: "Autoclavable tray for steam sterilization at 134°C; all components must be sterilizable", icon: "🧪" },
              { name: "Pressure Regulator", desc: "Pneumatic units: reduces cylinder pressure (800 kPa) to working pressure (400–600 kPa)", icon: "📊" },
            ].map((part, i) => (
              <div key={i} className="component-card p-4 rounded-lg">
                <div className="text-2xl mb-2">{part.icon}</div>
                <h4 className="font-semibold text-gray-800">{part.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{part.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Circuit/Mechanism Diagrams */}
        <section className="mb-10">
          <h2 className="section-header">3. Mechanism Diagrams</h2>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">3.1 Oscillating Mechanism (Eccentric Cam)</h3>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  ECCENTRIC CAM OSCILLATION MECHANISM
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  Motor Shaft (Rotation)                                             │
  │       │                                                             │
  │       ▼                                                             │
  │  ┌────────────────────────────────────────────────────────────┐    │
  │  │                                                            │    │
  │  │  Rotation:  ──────────────────────────────────────────▶   │    │
  │  │                                                            │    │
  │  │  Eccentric Cam:                                            │    │
  │  │                                                            │    │
  │  │  Position 1:  ○──────────────────── Blade at LEFT         │    │
  │  │               ↑ cam offset                                 │    │
  │  │                                                            │    │
  │  │  Position 2:  ──○──────────────────  Blade at CENTER      │    │
  │  │                                                            │    │
  │  │  Position 3:  ──────────────────○──  Blade at RIGHT       │    │
  │  │                                 ↑ cam offset               │    │
  │  │                                                            │    │
  │  │  Oscillation angle: ±3° to ±5°                            │    │
  │  │  Frequency: 10,000–20,000 OPM                              │    │
  │  └────────────────────────────────────────────────────────────┘    │
  │                                                                     │
  │  BLADE MOTION PATTERN:                                              │
  │                                                                     │
  │  ←──────────────────────────────────────────────────────────→      │
  │  LEFT                    CENTER                           RIGHT     │
  │                                                                     │
  │  Time: ──────────────────────────────────────────────────────▶     │
  │  Blade: ←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→←→     │
  └─────────────────────────────────────────────────────────────────────┘

  BLADE TYPES AND APPLICATIONS
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  OSCILLATING SAW BLADE:                                             │
  │  ┌──────────────────────────────────────────────────────────────┐  │
  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
  │  │ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ │  │
  │  └──────────────────────────────────────────────────────────────┘  │
  │  Use: Knee/hip arthroplasty, osteotomy                              │
  │                                                                     │
  │  RECIPROCATING SAW BLADE:                                           │
  │  ┌──────────────────────────────────────────────────────────────┐  │
  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
  │  │ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ │  │
  │  └──────────────────────────────────────────────────────────────┘  │
  │  Motion: In-out (like jigsaw)                                       │
  │  Use: Cast removal, amputation                                      │
  └─────────────────────────────────────────────────────────────────────┘
`}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">3.2 Pneumatic Circuit Diagram</h3>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  PNEUMATIC ORTHOPAEDIC SAW CIRCUIT
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  N₂ Cylinder                                                        │
  │  (800–1200 kPa)                                                     │
  │       │                                                             │
  │  [Cylinder Valve]                                                   │
  │       │                                                             │
  │  [High Pressure Hose]                                               │
  │       │                                                             │
  │  [Pressure Regulator] ──── Gauge (0–1000 kPa)                      │
  │  Set to: 400–600 kPa                                                │
  │       │                                                             │
  │  [Safety Relief Valve] (opens at 700 kPa)                          │
  │       │                                                             │
  │  [Quick-Connect Coupling]                                           │
  │       │                                                             │
  │  [Handpiece Hose] (sterile, autoclavable)                           │
  │       │                                                             │
  │  ┌────┴────────────────────────────────────────────────────────┐   │
  │  │  HANDPIECE                                                  │   │
  │  │                                                             │   │
  │  │  [Trigger Valve] ──── Variable flow control                │   │
  │  │       │                                                     │   │
  │  │  [Air Turbine] ──── 10,000–40,000 RPM                      │   │
  │  │       │                                                     │   │
  │  │  [Gear Reduction] ──── 3:1 to 10:1 ratio                   │   │
  │  │       │                                                     │   │
  │  │  [Eccentric Cam] ──── Converts rotation to oscillation     │   │
  │  │       │                                                     │   │
  │  │  [Blade Chuck] ──── Quick-release                          │   │
  │  │       │                                                     │   │
  │  │  [SAW BLADE] ──── Oscillates at 10,000–20,000 OPM         │   │
  │  │                                                             │   │
  │  │  Exhaust air ──── Vented through handpiece body            │   │
  │  └─────────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────────┘
`}
          </div>
        </section>

        {/* Uses */}
        <section className="mb-10">
          <h2 className="section-header">4. Uses of Orthopaedic Saws</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-green-700 mb-3">✅ Surgical Applications</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Total Knee Replacement (TKR):</strong> Tibial and femoral bone cuts</li>
                <li>• <strong>Total Hip Replacement (THR):</strong> Femoral neck osteotomy</li>
                <li>• <strong>Osteotomy:</strong> Corrective bone cuts for deformity</li>
                <li>• <strong>Fracture fixation:</strong> Bone preparation for plates/nails</li>
                <li>• <strong>Amputation:</strong> Bone transection</li>
                <li>• <strong>Spinal surgery:</strong> Laminectomy, discectomy</li>
                <li>• <strong>Cast removal:</strong> Oscillating cast saw (safe for skin)</li>
                <li>• <strong>Bone grafting:</strong> Harvesting cortical bone grafts</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-red-700 mb-3">⚠️ Safety Precautions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Thermal necrosis:</strong> Use irrigation to cool blade and bone</li>
                <li>• <strong>Blade breakage:</strong> Never force blade; use correct blade for bone type</li>
                <li>• <strong>Soft tissue injury:</strong> Use retractors to protect vessels and nerves</li>
                <li>• <strong>Aerosol generation:</strong> Bone dust — use appropriate PPE</li>
                <li>• <strong>Sterilization:</strong> All components must be sterile before use</li>
                <li>• <strong>Pressure check:</strong> Verify N₂ pressure before pneumatic use</li>
                <li>• <strong>Blade inspection:</strong> Check for cracks/damage before each use</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="mb-10">
          <h2 className="section-header">5. Types of Orthopaedic Saws</h2>
          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Motion</th>
                  <th>Speed</th>
                  <th>Blade Orientation</th>
                  <th>Primary Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Oscillating Saw</strong></td>
                  <td>Side-to-side oscillation</td>
                  <td>10,000–20,000 OPM</td>
                  <td>Perpendicular to handle</td>
                  <td>Arthroplasty, osteotomy, cast removal</td>
                </tr>
                <tr>
                  <td><strong>Reciprocating Saw</strong></td>
                  <td>In-out (push-pull)</td>
                  <td>8,000–15,000 SPM</td>
                  <td>Parallel to handle</td>
                  <td>Amputation, large bone cuts</td>
                </tr>
                <tr>
                  <td><strong>Sagittal Saw</strong></td>
                  <td>In-plane oscillation</td>
                  <td>10,000–18,000 OPM</td>
                  <td>In plane of handle</td>
                  <td>Precise cuts, arthroplasty</td>
                </tr>
                <tr>
                  <td><strong>Micro Saw</strong></td>
                  <td>Oscillating (small)</td>
                  <td>15,000–25,000 OPM</td>
                  <td>Various</td>
                  <td>Hand surgery, pediatric, small bones</td>
                </tr>
                <tr>
                  <td><strong>Cast Saw</strong></td>
                  <td>Oscillating (safe)</td>
                  <td>10,000–15,000 OPM</td>
                  <td>Perpendicular</td>
                  <td>Cast removal — blade stops at skin contact</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Fault Diagnosis */}
        <section className="mb-10">
          <h2 className="section-header">6. Fault Diagnosis</h2>
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
                  <td>Saw does not start</td>
                  <td>No N₂ pressure, dead battery, trigger fault</td>
                  <td>Check pressure gauge; test battery voltage; check trigger continuity</td>
                  <td>Refill N₂; charge/replace battery; replace trigger</td>
                </tr>
                <tr>
                  <td>Low cutting speed/power</td>
                  <td>Low N₂ pressure, worn turbine/motor, dull blade</td>
                  <td>Check pressure; measure no-load speed; inspect blade</td>
                  <td>Adjust pressure; service turbine; replace blade</td>
                </tr>
                <tr>
                  <td>Excessive vibration</td>
                  <td>Worn bearings, loose blade, eccentric cam wear</td>
                  <td>Run without blade; listen for bearing noise</td>
                  <td>Replace bearings; tighten blade chuck; replace cam</td>
                </tr>
                <tr>
                  <td>Blade does not lock</td>
                  <td>Worn chuck mechanism, debris in chuck</td>
                  <td>Inspect chuck; test with new blade</td>
                  <td>Clean chuck; replace chuck assembly</td>
                </tr>
                <tr>
                  <td>Air/fluid leakage (pneumatic)</td>
                  <td>Worn O-rings, cracked hose, loose fittings</td>
                  <td>Soap bubble test on all connections</td>
                  <td>Replace O-rings; replace hose; tighten fittings</td>
                </tr>
                <tr>
                  <td>Overheating during use</td>
                  <td>Insufficient irrigation, dull blade, excessive pressure</td>
                  <td>Check irrigation flow; inspect blade sharpness</td>
                  <td>Increase irrigation; replace blade; reduce pressure</td>
                </tr>
                <tr>
                  <td>Corrosion after sterilization</td>
                  <td>Improper drying, incompatible sterilization method</td>
                  <td>Visual inspection; check sterilization records</td>
                  <td>Lubricate after sterilization; use correct method</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Maintenance */}
        <section className="mb-10">
          <h2 className="section-header">7. Maintenance Procedures</h2>
          <div className="diagram-box p-6 rounded-xl mb-4">
{`
  ORTHOPAEDIC SAW MAINTENANCE WORKFLOW
  ══════════════════════════════════════════════════════════════════

  POST-OPERATIVE CLEANING:
  ─────────────────────────────────────────────────────────────────
  1. Remove blade immediately after use
  2. Flush handpiece with sterile water (if irrigation port present)
  3. Wipe exterior with enzymatic cleaner
  4. Disassemble per manufacturer instructions
  5. Ultrasonic cleaning of metal components (15 min, 40°C)
  6. Rinse with purified water
  7. Dry thoroughly with compressed air
  8. Lubricate per manufacturer specification
  9. Reassemble and function test
  10. Package and sterilize

  LUBRICATION POINTS:
  ─────────────────────────────────────────────────────────────────
  Handpiece Body:
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  [Turbine/Motor] ←── 2 drops instrument oil (pre-steril.)  │
  │  [Gear Train]    ←── Grease (per manufacturer spec)        │
  │  [Eccentric Cam] ←── Light machine oil                     │
  │  [Blade Chuck]   ←── Dry lubricant (PTFE spray)            │
  │  [O-rings]       ←── Silicone grease                       │
  │                                                             │
  │  NEVER use petroleum-based oils on rubber components!       │
  └─────────────────────────────────────────────────────────────┘

  STERILIZATION CYCLE (Steam Autoclave):
  ─────────────────────────────────────────────────────────────────
  Pre-vacuum cycle:  134°C, 3 minutes, 3 bar
  Gravity cycle:     134°C, 18 minutes, 3 bar
  Drying:            10–15 minutes
  
  ⚠️ Check manufacturer's instructions — some components
     may require EtO (ethylene oxide) sterilization
`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-3">🗓️ After Each Use</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>☐ Remove and dispose of blade</li>
                <li>☐ Flush irrigation ports</li>
                <li>☐ Clean with enzymatic solution</li>
                <li>☐ Ultrasonic cleaning</li>
                <li>☐ Lubricate per protocol</li>
                <li>☐ Function test before sterilization</li>
                <li>☐ Sterilize and package</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-3">📅 Monthly Checks</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>☐ No-load speed measurement</li>
                <li>☐ Torque/power output test</li>
                <li>☐ Blade chuck function test</li>
                <li>☐ Bearing noise assessment</li>
                <li>☐ Hose/cable integrity check</li>
                <li>☐ Pressure regulator calibration</li>
                <li>☐ Review sterilization logs</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h3 className="font-semibold text-purple-800 mb-3">📆 Annual Service</h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>☐ Full disassembly and inspection</li>
                <li>☐ Replace all O-rings and seals</li>
                <li>☐ Replace bearings (if worn)</li>
                <li>☐ Inspect gear train for wear</li>
                <li>☐ Battery capacity test (electric)</li>
                <li>☐ Pressure regulator service</li>
                <li>☐ Update service records</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Tests */}
        <section className="mb-10">
          <h2 className="section-header">8. Safety Tests</h2>
          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Method</th>
                  <th>Acceptance Limit</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>No-load Speed Test</td>
                  <td>Tachometer at blade chuck (no blade)</td>
                  <td>Within ±10% of rated speed</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <td>Blade Chuck Security</td>
                  <td>Attempt to remove blade without release; apply lateral force</td>
                  <td>Blade must not release unintentionally</td>
                  <td>Each use</td>
                </tr>
                <tr>
                  <td>Pressure Test (Pneumatic)</td>
                  <td>Measure working pressure at handpiece inlet</td>
                  <td>400–600 kPa (per manufacturer)</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <td>Leak Test (Pneumatic)</td>
                  <td>Soap bubble test at all connections</td>
                  <td>No visible bubbles</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <td>Electrical Safety (Electric)</td>
                  <td>Earth continuity, insulation resistance, leakage current</td>
                  <td>IEC 60601-1 limits</td>
                  <td>Annual</td>
                </tr>
                <tr>
                  <td>Sterilization Validation</td>
                  <td>Biological indicator (Geobacillus stearothermophilus)</td>
                  <td>No growth after incubation</td>
                  <td>Weekly/per cycle</td>
                </tr>
                <tr>
                  <td>Vibration Level</td>
                  <td>Accelerometer at handpiece grip</td>
                  <td>&lt;2.5 m/s² (8-hour exposure limit)</td>
                  <td>Annual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <a href="/microwave-diathermy" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
            ← Microwave Diathermy
          </a>
          <a href="/implants" className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Implants →
          </a>
        </div>
      </div>
    </div>
  );
}
