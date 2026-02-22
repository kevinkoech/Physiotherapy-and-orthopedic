import Link from "next/link";

export default function TractionTherapyPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Traction Therapy Machine</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">↔️ Traction Therapy Machine</h1>
        <p className="text-teal-100">Learning Outcome 8: Perform Traction Therapy Machine Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests"].map(t => (
            <span key={t} className="bg-teal-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-teal-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          Traction therapy machines apply a pulling force (traction) to the spine or limbs to
          decompress joints, relieve nerve compression, and reduce pain. Mechanical traction devices
          use motorized systems to apply precise, controlled forces. They are widely used in
          physiotherapy for cervical (neck) and lumbar (lower back) conditions.
        </p>
        <div className="note-box">
          <strong>📌 Key Parameters:</strong><br/>
          • Cervical traction: 3–15 kg (7–33 lbs) force<br/>
          • Lumbar traction: 25–50% of body weight (typically 20–60 kg)<br/>
          • Treatment duration: 10–30 minutes<br/>
          • Modes: Continuous, intermittent, or progressive
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Traction Therapy Machine</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  TRACTION THERAPY MACHINE — BLOCK DIAGRAM:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                  TRACTION THERAPY MACHINE                       │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │  MAINS   │───▶│  POWER   │───▶│    MOTOR CONTROL         │  │
  │  │  INPUT   │    │  SUPPLY  │    │    CIRCUIT               │  │
  │  │ 220-240V │    │  UNIT    │    │  (Force/Speed Control)   │  │
  │  └──────────┘    └──────────┘    └──────────────────────────┘  │
  │                                                  │              │
  │                                                  ▼              │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │ TRACTION │◀───│ DRIVE    │◀───│    ELECTRIC MOTOR        │  │
  │  │  HARNESS │    │MECHANISM │    │  (DC servo or AC)        │  │
  │  │ (Patient)│    │(Rope/Belt│    │                          │  │
  │  └──────────┘    │ & Pulley)│    └──────────────────────────┘  │
  │                  └──────────┘                                   │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │  FORCE   │    │  TIMER   │    │   CONTROL PANEL          │  │
  │  │  SENSOR  │    │  CIRCUIT │    │   (Force, Time, Mode)    │  │
  │  │(Load Cell│    │          │    │                          │  │
  │  └──────────┘    └──────────┘    └──────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────┘
  
  MECHANICAL ARRANGEMENT — LUMBAR TRACTION:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  MOTOR ──[Gearbox]──[Lead Screw/Rope]──[Spreader Bar]          │
  │                                               │                 │
  │                                        [Pelvic Harness]        │
  │                                               │                 │
  │                                          PATIENT                │
  │                                               │                 │
  │                                        [Thoracic Harness]      │
  │                                               │                 │
  │                                        [Fixed Anchor]          │
  │                                                                 │
  │  FORCE MEASUREMENT:                                             │
  │  Load Cell ──[Amplifier]──[ADC]──[Microcontroller]──[Display]  │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Motor Control Circuit</h3>
        <div className="circuit-diagram">
{`
  DC SERVO MOTOR CONTROL FOR TRACTION:
  
  +VDC ──────────────────────────────────────────────────────────┐
                                                                 │
  ┌─────────────────────────────────────────────────────────┐   │
  │              MICROCONTROLLER / PLC                      │   │
  │                                                         │   │
  │  Force Setpoint ──▶ [PID Controller] ──▶ [PWM Output]  │   │
  │       ▲                                       │         │   │
  │       │                                       │         │   │
  │  Load Cell ──[Amplifier]──[ADC]───────────────┘         │   │
  │  (Force Feedback)                                       │   │
  │                                                         │   │
  │  Timer ──▶ [Mode Controller] ──▶ [Direction Control]   │   │
  │                                                         │   │
  └─────────────────────────────────────────────────────────┘   │
                                                                 │
  PWM ──[H-Bridge Driver]──[DC Motor]──[Gearbox]──[Rope/Screw]  │
              │                                                   │
         [Current Sense]──[Overcurrent Protection]               │
                                                                 │
  GND ──────────────────────────────────────────────────────────┘
  
  TRACTION MODES:
  
  CONTINUOUS:    ████████████████████████████████████
  Force:         ─────────────────────────────────────▶ Time
  
  INTERMITTENT:  ████    ████    ████    ████    ████
  Force:         ─────────────────────────────────────▶ Time
                 ON: 30s  OFF: 10s (typical)
  
  PROGRESSIVE:   ▁▂▃▄▅▆▇█████████████▇▆▅▄▃▂▁
  Force:         ─────────────────────────────────────▶ Time
                 Ramp up → Hold → Ramp down
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
              <tr><td><strong>Electric Motor</strong></td><td>Provides pulling force</td><td>DC servo or AC motor, 100-500W</td></tr>
              <tr><td><strong>Gearbox/Reduction</strong></td><td>Reduces speed, increases torque</td><td>High reduction ratio for precise control</td></tr>
              <tr><td><strong>Rope/Belt/Lead Screw</strong></td><td>Transmits force to patient</td><td>High-strength, rated for max load</td></tr>
              <tr><td><strong>Load Cell</strong></td><td>Measures applied traction force</td><td>Strain gauge type, 0-100 kg range</td></tr>
              <tr><td><strong>Traction Table</strong></td><td>Supports patient during treatment</td><td>Split table for lumbar, adjustable</td></tr>
              <tr><td><strong>Cervical Harness</strong></td><td>Applies traction to cervical spine</td><td>Adjustable chin/occipital support</td></tr>
              <tr><td><strong>Pelvic Harness</strong></td><td>Applies traction to lumbar spine</td><td>Padded, adjustable belt</td></tr>
              <tr><td><strong>Thoracic Harness</strong></td><td>Anchors upper body during lumbar traction</td><td>Padded, adjustable belt</td></tr>
              <tr><td><strong>Control Panel</strong></td><td>User interface for settings</td><td>Force, time, mode, hold/relax controls</td></tr>
              <tr><td><strong>Emergency Stop</strong></td><td>Immediately releases traction</td><td>Patient-operated hand switch</td></tr>
              <tr><td><strong>Timer</strong></td><td>Controls treatment duration</td><td>0-60 minutes</td></tr>
              <tr><td><strong>Display</strong></td><td>Shows force and time</td><td>Digital display, kg and minutes</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Traction Therapy Machine</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-teal-800 mb-2">🦴 Spinal Applications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Cervical disc herniation</li>
              <li>Lumbar disc herniation</li>
              <li>Cervical spondylosis</li>
              <li>Lumbar spondylosis</li>
              <li>Nerve root compression</li>
              <li>Facet joint syndrome</li>
              <li>Muscle spasm of spine</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">⚙️ Therapeutic Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Disc decompression (increases disc height)</li>
              <li>Nerve root decompression</li>
              <li>Muscle relaxation</li>
              <li>Joint mobilization</li>
              <li>Reduction of muscle spasm</li>
              <li>Pain relief</li>
              <li>Improved spinal mobility</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">✅ Indications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Radiculopathy (nerve root pain)</li>
              <li>Sciatica</li>
              <li>Cervicogenic headache</li>
              <li>Degenerative disc disease</li>
              <li>Spinal stenosis (mild)</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Spinal instability/fracture</li>
              <li>Osteoporosis (severe)</li>
              <li>Malignancy of spine</li>
              <li>Pregnancy</li>
              <li>Aortic aneurysm</li>
              <li>Acute inflammatory conditions</li>
              <li>Vertebrobasilar insufficiency (cervical)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Traction Therapy Machine</h2>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Force Range</th>
                <th>Application</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Motorized Cervical</strong></td>
                <td>Electric motor applies cervical traction</td>
                <td>0–20 kg</td>
                <td>Cervical disc, spondylosis</td>
              </tr>
              <tr>
                <td><strong>Motorized Lumbar</strong></td>
                <td>Electric motor applies lumbar traction</td>
                <td>0–80 kg</td>
                <td>Lumbar disc, sciatica</td>
              </tr>
              <tr>
                <td><strong>Combined Cervical/Lumbar</strong></td>
                <td>Single unit for both applications</td>
                <td>0–80 kg</td>
                <td>Multi-purpose clinical use</td>
              </tr>
              <tr>
                <td><strong>Pneumatic Traction</strong></td>
                <td>Air pressure drives traction mechanism</td>
                <td>0–60 kg</td>
                <td>Smooth, controlled traction</td>
              </tr>
              <tr>
                <td><strong>Gravity Traction</strong></td>
                <td>Uses patient body weight</td>
                <td>Body weight dependent</td>
                <td>Inversion therapy, simple traction</td>
              </tr>
              <tr>
                <td><strong>Underwater Traction</strong></td>
                <td>Traction applied in water (hydrotherapy)</td>
                <td>Reduced by buoyancy</td>
                <td>Combined hydrotherapy and traction</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">📊 Traction Modes Comparison</h3>
        <div className="diagram-box">
{`
  TRACTION MODES:
  
  1. CONTINUOUS TRACTION:
     Force: ████████████████████████████████████████
     Time:  ─────────────────────────────────────────▶
     
     • Constant force throughout treatment
     • Used for: Muscle relaxation, mild disc conditions
     • Duration: 10-30 minutes
     • Force: Lower (10-30% body weight for lumbar)
  
  2. INTERMITTENT TRACTION:
     Force: ████    ████    ████    ████    ████    ████
     Time:  ─────────────────────────────────────────────▶
            ←ON→←OFF→
     
     • Alternates between traction and rest
     • ON time: 10-60 seconds
     • OFF time: 5-30 seconds
     • Used for: Disc herniation, nerve root compression
     • Force: Higher (25-50% body weight for lumbar)
  
  3. PROGRESSIVE TRACTION:
     Force: ▁▂▃▄▅▆▇████████████████▇▆▅▄▃▂▁
     Time:  ─────────────────────────────────────────────▶
            ←Ramp→←──── Hold ────→←Ramp→
     
     • Gradually increases to set force, holds, then decreases
     • Reduces patient discomfort
     • Used for: First treatments, sensitive patients
`}
        </div>
      </div>

      {/* Section 4: Fault Diagnosis */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">4. Fault Diagnosis</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  FAULT DIAGNOSIS FLOWCHART — TRACTION MACHINE:
  
  SYMPTOM: Machine won't apply traction
  ──────────────────────────────────────
  
  START
    │
    ▼
  Check mains supply ──── No power? ─────▶ Check socket, fuse, circuit breaker
    │ OK
    ▼
  Check power switch ──── Faulty? ───────▶ Replace switch
    │ OK
    ▼
  Check emergency stop ── Activated? ────▶ Reset emergency stop
    │ OK
    ▼
  Check motor ──────────── No movement? ─▶ Check motor supply, replace motor
    │ OK
    ▼
  Check drive mechanism ── Jammed? ──────▶ Clear jam, lubricate mechanism
    │ OK
    ▼
  Check force sensor ────── Faulty? ─────▶ Calibrate or replace load cell
    │ OK
    ▼
  Check control circuit ─── Faulty? ─────▶ Repair/replace control board
    │ OK
    ▼
  Traction applies normally ✓
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
                <td>No traction force</td>
                <td>Motor failure, drive mechanism jam, blown fuse</td>
                <td>Check motor operation, inspect mechanism</td>
                <td>Replace motor/fuse, clear jam</td>
              </tr>
              <tr>
                <td>Incorrect force reading</td>
                <td>Load cell drift, calibration error</td>
                <td>Apply known weight, compare reading</td>
                <td>Recalibrate or replace load cell</td>
              </tr>
              <tr>
                <td>Force not holding steady</td>
                <td>Slipping drive mechanism, PID tuning issue</td>
                <td>Monitor force display during treatment</td>
                <td>Adjust PID parameters, check drive</td>
              </tr>
              <tr>
                <td>Emergency stop not working</td>
                <td>Faulty switch, broken connection</td>
                <td>Test switch continuity</td>
                <td>Replace emergency stop switch</td>
              </tr>
              <tr>
                <td>Timer malfunction</td>
                <td>Faulty timer circuit</td>
                <td>Compare to stopwatch</td>
                <td>Replace timer IC</td>
              </tr>
              <tr>
                <td>Excessive noise</td>
                <td>Worn bearings, loose components</td>
                <td>Listen for bearing noise, check for loose parts</td>
                <td>Replace bearings, tighten components</td>
              </tr>
              <tr>
                <td>Rope/belt fraying</td>
                <td>Normal wear, overloading</td>
                <td>Visual inspection</td>
                <td>Replace rope/belt immediately</td>
              </tr>
              <tr>
                <td>Display incorrect</td>
                <td>Faulty display, sensor error</td>
                <td>Compare to calibrated reference</td>
                <td>Recalibrate, replace display</td>
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
              <li>Inspect rope/belt for wear</li>
              <li>Test emergency stop</li>
              <li>Check harnesses for damage</li>
              <li>Verify force display accuracy</li>
              <li>Clean table surface</li>
              <li>Check all connections</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-700 mb-2">Monthly</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Calibrate force measurement</li>
              <li>Lubricate drive mechanism</li>
              <li>Check motor brushes (DC motors)</li>
              <li>Inspect all pulleys and guides</li>
              <li>Test all modes of operation</li>
              <li>Check timer accuracy</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-700 mb-2">Annual</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Full electrical safety test</li>
              <li>Replace rope/belt (preventive)</li>
              <li>Replace motor bearings</li>
              <li>Full calibration</li>
              <li>Load cell verification</li>
              <li>Structural integrity check</li>
            </ul>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔧 Force Calibration Procedure</h3>
        <div className="diagram-box">
{`
  FORCE CALIBRATION PROCEDURE:
  
  EQUIPMENT NEEDED:
  ├── Calibrated weights (5 kg, 10 kg, 20 kg, 50 kg)
  ├── Or calibrated force gauge
  └── Calibration certificate for reference weights
  
  PROCEDURE:
  
  1. ZERO CALIBRATION
     ├── Remove all load from traction mechanism
     ├── Power on machine
     ├── Allow 10 min warm-up
     └── Adjust zero trimmer until display reads 0.0 kg
  
  2. SPAN CALIBRATION
     ├── Apply known weight (e.g., 20 kg) to traction rope
     ├── Read display value
     ├── If display ≠ 20 kg, adjust span trimmer
     └── Repeat until display reads correctly
  
  3. LINEARITY CHECK
     ├── Apply 5 kg → record reading
     ├── Apply 10 kg → record reading
     ├── Apply 20 kg → record reading
     ├── Apply 50 kg → record reading
     └── All readings should be within ±5% of actual
  
  4. DOCUMENTATION
     ├── Record all readings
     ├── Note any adjustments made
     ├── Sign calibration certificate
     └── Attach calibration label to machine
  
  ACCEPTANCE CRITERIA:
  └── Force accuracy: ±5% of indicated value
      (or per manufacturer specification)
`}
        </div>

        <div className="warning-box mt-4">
          <strong>⚠️ CRITICAL SAFETY:</strong> Always test the emergency stop before each treatment session.
          The emergency stop must immediately release all traction force. Never leave a patient unattended
          during traction therapy. Ensure the patient can reach the emergency stop at all times.
        </div>
      </div>

      {/* Section 6: Safety Tests */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">6. Safety Tests</h2>
        </div>

        <div className="note-box mt-4">
          <strong>📌 Standards:</strong> IEC 60601-1 (Medical Electrical Equipment — General Requirements).
          Traction devices must comply with mechanical safety standards for patient-applied forces.
          Maximum force limits must be clearly marked and enforced by the control system.
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
                <td>≤ 500 μA (Class I)</td>
              </tr>
              <tr>
                <td><strong>Emergency Stop Function</strong></td>
                <td>Activate emergency stop during operation</td>
                <td>Force must drop to zero within 1 second</td>
              </tr>
              <tr>
                <td><strong>Force Accuracy</strong></td>
                <td>Apply calibrated weights, compare to display</td>
                <td>Within ±5% of indicated force</td>
              </tr>
              <tr>
                <td><strong>Maximum Force Limit</strong></td>
                <td>Attempt to exceed maximum force setting</td>
                <td>Machine must not exceed set maximum</td>
              </tr>
              <tr>
                <td><strong>Rope/Belt Strength</strong></td>
                <td>Visual inspection, check manufacturer rating</td>
                <td>Rated for at least 3× maximum working load</td>
              </tr>
              <tr>
                <td><strong>Timer Accuracy</strong></td>
                <td>Compare set time to actual elapsed time</td>
                <td>Within ±10% of set time</td>
              </tr>
              <tr>
                <td><strong>Structural Integrity</strong></td>
                <td>Apply maximum rated load, inspect for deformation</td>
                <td>No permanent deformation or failure</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Emergency Stop Circuit</h3>
        <div className="circuit-diagram">
{`
  EMERGENCY STOP CIRCUIT:
  
  +VDC ──[E-Stop Switch (NC)]──[Motor Controller Enable]──[Motor]
              │
              │ When E-Stop pressed:
              │ ├── Motor controller disabled immediately
              │ ├── Motor braking applied
              │ └── Traction force released
  
  PATIENT HAND SWITCH:
  
  Patient ──[Hand Switch]──[E-Stop Circuit]──[Motor Controller]
  
  The hand switch is a normally-closed (NC) switch.
  Pressing it OPENS the circuit, cutting motor power.
  
  FORCE LIMITING CIRCUIT:
  
  Load Cell ──[Amplifier]──[Comparator]──[Motor Controller]
                                │
                          [Max Force Setpoint]
                                │
                          If Force > Max:
                          └── Motor stops immediately
  
  SAFETY RELAY:
  
  All safety inputs (E-Stop, Overload, Limit Switches)
  are wired through a safety relay module that:
  ├── Requires manual reset after fault
  ├── Monitors for relay contact welding
  └── Provides redundant shutdown path
`}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/hot-air-oven" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Hot Air Oven
        </Link>
        <Link href="/" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Back to Home →
        </Link>
      </div>
    </div>
  );
}
