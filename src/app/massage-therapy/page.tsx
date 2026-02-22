import Link from "next/link";

export default function MassageTherapyPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Massage Therapy Machine</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🤲 Massage Therapy Machine</h1>
        <p className="text-green-100">Learning Outcome 5: Perform Massage Therapy Machine Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests"].map(t => (
            <span key={t} className="bg-green-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-green-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          Mechanical massage therapy machines use motorized mechanisms to deliver therapeutic massage
          to patients. They replicate manual massage techniques through vibration, percussion, kneading,
          or rolling actions. These devices are used in physiotherapy, rehabilitation, and wellness settings.
        </p>
        <div className="note-box">
          <strong>📌 Key Principle:</strong> Mechanical massage works through mechanical stimulation of
          soft tissues, promoting circulation, reducing muscle tension, and providing pain relief through
          sensory stimulation and endorphin release.
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Massage Therapy Machine</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  MASSAGE THERAPY MACHINE — BLOCK DIAGRAM:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                  MASSAGE THERAPY MACHINE                        │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │  MAINS   │───▶│  POWER   │───▶│    MOTOR CONTROL         │  │
  │  │  INPUT   │    │  SUPPLY  │    │    CIRCUIT               │  │
  │  │ 220-240V │    │  UNIT    │    │  (Speed/Intensity)       │  │
  │  └──────────┘    └──────────┘    └──────────────────────────┘  │
  │                                                  │              │
  │                                                  ▼              │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │ MASSAGE  │◀───│MECHANICAL│◀───│    ELECTRIC MOTOR        │  │
  │  │  HEAD/   │    │CONVERSION│    │  (AC or DC)              │  │
  │  │ APPLICATOR│   │MECHANISM │    │                          │  │
  │  └──────────┘    └──────────┘    └──────────────────────────┘  │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐                                  │
  │  │ CONTROL  │    │  TIMER   │                                  │
  │  │  PANEL   │    │  CIRCUIT │                                  │
  │  └──────────┘    └──────────┘                                  │
  └─────────────────────────────────────────────────────────────────┘
  
  MECHANICAL CONVERSION MECHANISMS:
  
  VIBRATION TYPE:          PERCUSSION TYPE:         KNEADING TYPE:
  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
  │  Motor      │          │  Motor      │          │  Motor      │
  │  ┌──────┐   │          │  ┌──────┐   │          │  ┌──────┐   │
  │  │Eccen-│   │          │  │Cam   │   │          │  │Gear  │   │
  │  │tric  │   │          │  │Mech- │   │          │  │Box   │   │
  │  │Weight│   │          │  │anism │   │          │  │      │   │
  │  └──────┘   │          │  └──────┘   │          │  └──────┘   │
  │  Vibration  │          │  Percussion │          │  Rotation   │
  │  50-100 Hz  │          │  Strokes    │          │  Kneading   │
  └─────────────┘          └─────────────┘          └─────────────┘
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Motor Control Circuit</h3>
        <div className="circuit-diagram">
{`
  VARIABLE SPEED MOTOR CONTROL CIRCUIT:
  
  MAINS AC ──[Fuse]──[Switch]──────────────────────────────────────┐
                                                                   │
                                                            [TRIAC/SCR]
                                                                   │
                                                            [AC Motor]
                                                                   │
  NEUTRAL ──────────────────────────────────────────────────────────┘
  
  SPEED CONTROL:
  
  ┌─────────────────────────────────────────────────────────────┐
  │                    TRIAC CONTROL CIRCUIT                    │
  │                                                             │
  │  Speed Pot ──[R1]──[C1]──[DIAC]──[Gate of TRIAC]          │
  │                                                             │
  │  Phase angle control:                                       │
  │  ├── Low speed: TRIAC fires late in cycle (small angle)    │
  │  └── High speed: TRIAC fires early in cycle (large angle)  │
  │                                                             │
  │  AC Waveform:                                               │
  │  ┌─────────────────────────────────────────────────────┐   │
  │  │  Full wave:  ╭──╮    ╭──╮    ╭──╮                  │   │
  │  │              │  │    │  │    │  │                   │   │
  │  │  ────────────╯  ╰────╯  ╰────╯  ╰──────────────    │   │
  │  │                                                     │   │
  │  │  Half power: ╭─╮      ╭─╮      ╭─╮                 │   │
  │  │              │ │      │ │      │ │                  │   │
  │  │  ────────────╯ ╰──────╯ ╰──────╯ ╰──────────────   │   │
  │  └─────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────┘
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
              <tr><td><strong>Electric Motor</strong></td><td>Provides mechanical power</td><td>AC induction or DC motor, 50-200W</td></tr>
              <tr><td><strong>Eccentric Weight/Cam</strong></td><td>Converts rotation to vibration/percussion</td><td>Adjustable eccentricity</td></tr>
              <tr><td><strong>Massage Head</strong></td><td>Applies massage to patient</td><td>Various shapes: round, flat, pointed</td></tr>
              <tr><td><strong>Speed Control</strong></td><td>Adjusts massage intensity</td><td>Triac-based, variable 0-100%</td></tr>
              <tr><td><strong>Timer</strong></td><td>Controls treatment duration</td><td>0-30 minutes</td></tr>
              <tr><td><strong>Power Supply</strong></td><td>Provides operating power</td><td>Mains 220-240V AC</td></tr>
              <tr><td><strong>Housing/Handle</strong></td><td>Ergonomic grip for operator</td><td>Insulated plastic or rubber</td></tr>
              <tr><td><strong>Applicator Heads</strong></td><td>Different massage effects</td><td>Interchangeable, various materials</td></tr>
              <tr><td><strong>Flexible Drive Cable</strong></td><td>Transmits rotation to head (some models)</td><td>Flexible shaft in protective sleeve</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Massage Therapy Machine</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">💆 Therapeutic Uses</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Muscle relaxation and tension relief</li>
              <li>Pain management (chronic and acute)</li>
              <li>Improved blood and lymph circulation</li>
              <li>Reduction of muscle spasm</li>
              <li>Post-exercise recovery</li>
              <li>Scar tissue mobilization</li>
              <li>Oedema reduction</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">⚙️ Physiological Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Vasodilation and hyperaemia</li>
              <li>Increased lymphatic drainage</li>
              <li>Endorphin release</li>
              <li>Reduced muscle tone</li>
              <li>Improved tissue nutrition</li>
              <li>Mechanical breakdown of adhesions</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-purple-800 mb-2">🏥 Clinical Applications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Fibromyalgia management</li>
              <li>Sports injury rehabilitation</li>
              <li>Chronic back and neck pain</li>
              <li>Peripheral neuropathy</li>
              <li>Cellulite treatment</li>
              <li>Relaxation therapy</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Acute inflammation or infection</li>
              <li>Thrombosis or phlebitis</li>
              <li>Malignancy in treatment area</li>
              <li>Open wounds or skin conditions</li>
              <li>Osteoporosis (high intensity)</li>
              <li>Pregnancy (abdomen)</li>
              <li>Fractures</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Massage Therapy Machine</h2>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Mechanism</th>
                <th>Frequency/Speed</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Vibration Massager</strong></td>
                <td>Eccentric weight creates vibration</td>
                <td>20-100 Hz</td>
                <td>General muscle relaxation, pain relief</td>
              </tr>
              <tr>
                <td><strong>Percussion Massager</strong></td>
                <td>Cam mechanism creates rapid strokes</td>
                <td>20-40 strokes/sec</td>
                <td>Deep tissue, muscle knots</td>
              </tr>
              <tr>
                <td><strong>Kneading Massager</strong></td>
                <td>Rotating nodes simulate kneading</td>
                <td>Variable rotation speed</td>
                <td>Neck, shoulders, back</td>
              </tr>
              <tr>
                <td><strong>Rolling Massager</strong></td>
                <td>Rollers move along body surface</td>
                <td>Variable</td>
                <td>Back, legs, large muscle groups</td>
              </tr>
              <tr>
                <td><strong>Ultrasound Massager</strong></td>
                <td>Ultrasonic vibration (1-3 MHz)</td>
                <td>1 or 3 MHz</td>
                <td>Deep tissue, scar tissue</td>
              </tr>
              <tr>
                <td><strong>Hydro-massage</strong></td>
                <td>Water jets under pressure</td>
                <td>Variable pressure</td>
                <td>Full body, relaxation</td>
              </tr>
              <tr>
                <td><strong>Pneumatic Compression</strong></td>
                <td>Air bladders inflate/deflate</td>
                <td>Programmable cycles</td>
                <td>Lymphoedema, DVT prevention</td>
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
                <td>Motor won&apos;t start</td>
                <td>Blown fuse, faulty switch, motor failure</td>
                <td>Check fuse, test switch continuity, measure motor resistance</td>
                <td>Replace fuse/switch/motor</td>
              </tr>
              <tr>
                <td>Motor runs but no vibration</td>
                <td>Broken eccentric weight, worn cam mechanism</td>
                <td>Visual inspection of mechanism</td>
                <td>Replace eccentric weight or cam</td>
              </tr>
              <tr>
                <td>Speed control not working</td>
                <td>Faulty triac, worn potentiometer</td>
                <td>Measure voltage at motor at different settings</td>
                <td>Replace triac or potentiometer</td>
              </tr>
              <tr>
                <td>Excessive noise/vibration</td>
                <td>Worn bearings, loose components, imbalance</td>
                <td>Listen for bearing noise, check for loose parts</td>
                <td>Replace bearings, tighten components</td>
              </tr>
              <tr>
                <td>Overheating</td>
                <td>Blocked ventilation, motor overload, bearing failure</td>
                <td>Check ventilation, measure motor current</td>
                <td>Clean vents, reduce load, replace bearings</td>
              </tr>
              <tr>
                <td>Intermittent operation</td>
                <td>Loose connections, intermittent switch</td>
                <td>Wiggle test, check all connections</td>
                <td>Resolder joints, replace switch</td>
              </tr>
              <tr>
                <td>Massage head wobbles</td>
                <td>Worn attachment mechanism, loose head</td>
                <td>Physical inspection</td>
                <td>Tighten or replace attachment</td>
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
                <li>Clean massage heads after each use</li>
                <li>Inspect power cable for damage</li>
                <li>Check all applicator heads</li>
                <li>Test speed control range</li>
                <li>Wipe housing clean</li>
              </ul>
            </div>
            <div className="component-card border-l-4 border-blue-500 mt-3">
              <h4 className="font-bold text-blue-700 mb-2">Monthly</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Lubricate moving parts (bearings, cam)</li>
                <li>Check motor brushes (if DC motor)</li>
                <li>Inspect flexible drive cable</li>
                <li>Test timer accuracy</li>
                <li>Check all electrical connections</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Lubrication Guide</h3>
            <div className="diagram-box text-xs">
{`
  LUBRICATION POINTS:
  
  ┌─────────────────────────────────────┐
  │  MOTOR BEARINGS                     │
  │  ├── Type: Light machine oil        │
  │  ├── Frequency: Every 6 months      │
  │  └── Amount: 2-3 drops per bearing  │
  │                                     │
  │  CAM/ECCENTRIC MECHANISM            │
  │  ├── Type: Grease (lithium-based)   │
  │  ├── Frequency: Every 3 months      │
  │  └── Amount: Small amount on cam    │
  │                                     │
  │  FLEXIBLE DRIVE CABLE               │
  │  ├── Type: Cable lubricant          │
  │  ├── Frequency: Every 3 months      │
  │  └── Method: Apply to inner cable   │
  │                                     │
  │  PIVOT POINTS/JOINTS                │
  │  ├── Type: Light oil                │
  │  ├── Frequency: Monthly             │
  │  └── Amount: 1-2 drops              │
  └─────────────────────────────────────┘
  
  ⚠️  Do NOT over-lubricate
  ⚠️  Keep lubricant away from electrical parts
  ⚠️  Wipe off excess lubricant
`}
            </div>
          </div>
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
                <td>Measure from mains earth to metal parts</td>
                <td>≤ 0.1 Ω</td>
              </tr>
              <tr>
                <td><strong>Insulation Resistance</strong></td>
                <td>500V DC between live and earth</td>
                <td>≥ 2 MΩ</td>
              </tr>
              <tr>
                <td><strong>Leakage Current</strong></td>
                <td>Measure earth leakage</td>
                <td>≤ 500 μA (Class I)</td>
              </tr>
              <tr>
                <td><strong>Mechanical Safety</strong></td>
                <td>Check all guards and covers are secure</td>
                <td>No exposed moving parts</td>
              </tr>
              <tr>
                <td><strong>Speed Accuracy</strong></td>
                <td>Measure vibration frequency at each setting</td>
                <td>Within ±20% of indicated</td>
              </tr>
              <tr>
                <td><strong>Noise Level</strong></td>
                <td>Measure sound level during operation</td>
                <td>≤ 70 dB(A) at 1 meter</td>
              </tr>
              <tr>
                <td><strong>Temperature Rise</strong></td>
                <td>Measure housing temperature after 30 min</td>
                <td>≤ 48°C above ambient</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/hydro-collator" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Hydro-Collator
        </Link>
        <Link href="/orthopaedic-oscillator" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Next: Orthopaedic Oscillator →
        </Link>
      </div>
    </div>
  );
}
