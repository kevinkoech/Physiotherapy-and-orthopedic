import Link from "next/link";

export default function OrthopaedicOscillatorPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Orthopaedic Oscillator</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🔧 Orthopaedic Oscillator</h1>
        <p className="text-orange-100">Learning Outcome 6: Perform Orthopaedic Oscillator Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests"].map(t => (
            <span key={t} className="bg-orange-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-orange-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          An Orthopaedic Oscillator (also known as a Bone Growth Stimulator or Pulsed Electromagnetic
          Field/PEMF device) uses low-frequency pulsed electromagnetic fields or ultrasound to stimulate
          bone healing and repair. It is used in orthopaedic rehabilitation to accelerate fracture healing
          and treat non-union fractures.
        </p>
        <div className="note-box">
          <strong>📌 Key Principle:</strong> Bone is piezoelectric — mechanical stress generates electrical
          signals that stimulate osteoblast activity. Orthopaedic oscillators mimic these electrical signals
          to promote bone formation and healing. PEMF devices typically operate at <strong>1-100 Hz</strong>
          with field strengths of <strong>0.1-10 mT</strong>.
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Orthopaedic Oscillator</h2>
        </div>

        <div className="diagram-box mt-4">
{`
  ORTHOPAEDIC OSCILLATOR — BLOCK DIAGRAM:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                  ORTHOPAEDIC OSCILLATOR                         │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │  POWER   │───▶│ VOLTAGE  │───▶│    PULSE GENERATOR       │  │
  │  │  SUPPLY  │    │REGULATOR │    │  (Frequency & Duration)  │  │
  │  │(Battery/ │    │          │    │                          │  │
  │  │  Mains)  │    └──────────┘    └──────────────────────────┘  │
  │  └──────────┘                                │                  │
  │                                              ▼                  │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │ TREATMENT│◀───│COIL/TRANS│◀───│    POWER AMPLIFIER       │  │
  │  │  COILS   │    │  DUCER   │    │                          │  │
  │  │(Helmholtz│    │          │    │                          │  │
  │  │  coils)  │    └──────────┘    └──────────────────────────┘  │
  │  └──────────┘                                                   │
  │                                                                 │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │
  │  │ CONTROL  │    │  TIMER   │    │   DISPLAY/INDICATORS     │  │
  │  │  PANEL   │    │  CIRCUIT │    │                          │  │
  │  └──────────┘    └──────────┘    └──────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────┘
  
  TREATMENT COIL ARRANGEMENT:
  
  HELMHOLTZ COIL CONFIGURATION:
  
  Coil A                    Coil B
  ┌─────┐                  ┌─────┐
  │ ~~~ │                  │ ~~~ │
  │ ~~~ │◀── Fracture ────▶│ ~~~ │
  │ ~~~ │    Site          │ ~~~ │
  └─────┘                  └─────┘
  
  Uniform magnetic field between coils
  Field direction: perpendicular to coil plane
  
  SINGLE COIL (Solenoid):
  
  ┌─────────────────────────────────┐
  │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
  │ ~~~ Fracture Site ~~~~~~~~~~~~~~~~│
  │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
  └─────────────────────────────────┘
  Limb inserted through coil
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 PEMF Circuit Diagram</h3>
        <div className="circuit-diagram">
{`
  PEMF PULSE GENERATOR CIRCUIT:
  
  +VCC ──────────────────────────────────────────────────────────┐
                                                                 │
  ┌─────────────────────────────────────────────────────────┐   │
  │              MICROCONTROLLER / 555 TIMER                │   │
  │                                                         │   │
  │  Frequency: 1-100 Hz (adjustable)                       │   │
  │  Pulse Width: 0.1-10 ms                                 │   │
  │  Duty Cycle: 10-50%                                     │   │
  │                                                         │   │
  │  Output ────────────────────────────────────────────────┼───┤
  └─────────────────────────────────────────────────────────┘   │
                                                                 │
  Output ──[R_gate]──[MOSFET Q1]──────────────────────────────[L1]
                          │                                   (Treatment
                         GND                                   Coil)
                                                                 │
  FLYBACK PROTECTION:                                            │
  L1 ──[D1 Flyback Diode]──── +VCC                              │
                                                                 │
  CURRENT SENSING:                                               │
  L1 ──[R_sense]──[Op-Amp]──[ADC]──[MCU]                       │
                                                                 │
  GND ──────────────────────────────────────────────────────────┘
  
  WAVEFORM AT TREATMENT COIL:
  
  Current:  ┌──┐      ┌──┐      ┌──┐
            │  │      │  │      │  │
  ──────────┘  └──────┘  └──────┘  └──────
  
  Magnetic   ┌──┐      ┌──┐      ┌──┐
  Field (B): │  │      │  │      │  │
  ──────────┘  └──────┘  └──────┘  └──────
  
  Typical: 15 Hz, 200 μs pulse width, 1-5 mT peak field
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
              <tr><td><strong>Power Supply</strong></td><td>Provides operating power</td><td>Battery or mains, regulated DC</td></tr>
              <tr><td><strong>Pulse Generator</strong></td><td>Creates precise electromagnetic pulses</td><td>1-100 Hz, programmable</td></tr>
              <tr><td><strong>Power Amplifier</strong></td><td>Drives treatment coils</td><td>MOSFET-based, high current</td></tr>
              <tr><td><strong>Treatment Coils</strong></td><td>Generate therapeutic magnetic field</td><td>Helmholtz or solenoid configuration</td></tr>
              <tr><td><strong>Coil Housing</strong></td><td>Positions coils around treatment area</td><td>Rigid or flexible, various sizes</td></tr>
              <tr><td><strong>Timer</strong></td><td>Controls treatment duration</td><td>0-12 hours (some models)</td></tr>
              <tr><td><strong>Control Panel</strong></td><td>User interface</td><td>Frequency, intensity, timer controls</td></tr>
              <tr><td><strong>Display</strong></td><td>Shows treatment parameters</td><td>LCD or LED</td></tr>
              <tr><td><strong>Safety Circuits</strong></td><td>Protects patient and equipment</td><td>Overcurrent, overtemperature</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Orthopaedic Oscillator</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-orange-800 mb-2">🦴 Bone Healing Applications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Fracture healing acceleration</li>
              <li>Non-union fracture treatment</li>
              <li>Delayed union fractures</li>
              <li>Stress fractures</li>
              <li>Post-surgical bone healing</li>
              <li>Osteoporosis management</li>
              <li>Avascular necrosis</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">⚙️ Biological Effects</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Stimulates osteoblast activity</li>
              <li>Increases calcium uptake in bone</li>
              <li>Promotes collagen synthesis</li>
              <li>Enhances blood supply to bone</li>
              <li>Reduces osteoclast activity</li>
              <li>Anti-inflammatory effects</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">✅ Advantages</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Non-invasive treatment</li>
              <li>Can be used through casts</li>
              <li>Portable (some models)</li>
              <li>Minimal side effects</li>
              <li>Can be used at home</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Cardiac pacemakers</li>
              <li>Pregnancy</li>
              <li>Malignancy</li>
              <li>Epilepsy</li>
              <li>Metallic implants (some types)</li>
              <li>Active infection at site</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Orthopaedic Oscillator</h2>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Technology</th>
                <th>Parameters</th>
                <th>Application</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PEMF</strong> (Pulsed Electromagnetic Field)</td>
                <td>Pulsed magnetic field via coils</td>
                <td>1-100 Hz, 0.1-10 mT</td>
                <td>Fracture healing, osteoporosis</td>
              </tr>
              <tr>
                <td><strong>LIPUS</strong> (Low-Intensity Pulsed Ultrasound)</td>
                <td>Pulsed ultrasound at low intensity</td>
                <td>1.5 MHz, 30 mW/cm², 20 min/day</td>
                <td>Fresh fractures, non-unions</td>
              </tr>
              <tr>
                <td><strong>DC Stimulation</strong></td>
                <td>Direct current via implanted electrodes</td>
                <td>5-100 μA DC</td>
                <td>Non-union fractures (invasive)</td>
              </tr>
              <tr>
                <td><strong>Capacitive Coupling</strong></td>
                <td>AC electric field via skin electrodes</td>
                <td>60 kHz, 1-10 V/cm</td>
                <td>Non-union, fresh fractures</td>
              </tr>
              <tr>
                <td><strong>Combined PEMF/US</strong></td>
                <td>Both PEMF and ultrasound</td>
                <td>Combined parameters</td>
                <td>Complex fractures, enhanced healing</td>
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
                <td>No output/no field</td>
                <td>Dead battery, blown fuse, failed MOSFET</td>
                <td>Check power, measure coil current</td>
                <td>Replace battery/fuse/MOSFET</td>
              </tr>
              <tr>
                <td>Weak magnetic field</td>
                <td>Low battery, partial coil failure</td>
                <td>Measure field with gaussmeter</td>
                <td>Replace battery, check coil connections</td>
              </tr>
              <tr>
                <td>Incorrect frequency</td>
                <td>Faulty oscillator, drifted timing components</td>
                <td>Measure frequency with oscilloscope</td>
                <td>Replace timing components</td>
              </tr>
              <tr>
                <td>Coil overheating</td>
                <td>Excessive current, shorted turns in coil</td>
                <td>Measure coil resistance, check current</td>
                <td>Replace coil, check current limiting</td>
              </tr>
              <tr>
                <td>Display not working</td>
                <td>Faulty display, broken connection</td>
                <td>Check display supply voltage</td>
                <td>Replace display module</td>
              </tr>
              <tr>
                <td>Timer malfunction</td>
                <td>Faulty timer circuit</td>
                <td>Test timer with stopwatch</td>
                <td>Replace timer IC</td>
              </tr>
              <tr>
                <td>Intermittent operation</td>
                <td>Loose coil connection, intermittent component</td>
                <td>Check coil cable connections</td>
                <td>Resolder connections, replace cable</td>
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
              <li>Check battery level</li>
              <li>Inspect coil cables</li>
              <li>Verify display operation</li>
              <li>Clean coil housing</li>
              <li>Check indicator lights</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-700 mb-2">Monthly</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Measure output field strength</li>
              <li>Check frequency accuracy</li>
              <li>Inspect all connections</li>
              <li>Test timer accuracy</li>
              <li>Check coil resistance</li>
            </ul>
          </div>
          <div className="component-card border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-700 mb-2">Annual</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Full electrical safety test</li>
              <li>Calibrate field output</li>
              <li>Replace battery (preventive)</li>
              <li>Check insulation</li>
              <li>Full functional test</li>
            </ul>
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
                <td>Measure from mains earth to chassis (mains-powered units)</td>
                <td>≤ 0.1 Ω</td>
              </tr>
              <tr>
                <td><strong>Insulation Resistance</strong></td>
                <td>500V DC between live and earth</td>
                <td>≥ 2 MΩ</td>
              </tr>
              <tr>
                <td><strong>Patient Leakage Current</strong></td>
                <td>Measure at coil outputs</td>
                <td>≤ 100 μA (Type BF)</td>
              </tr>
              <tr>
                <td><strong>Magnetic Field Strength</strong></td>
                <td>Measure with gaussmeter at treatment position</td>
                <td>Within ±20% of specified value</td>
              </tr>
              <tr>
                <td><strong>Frequency Accuracy</strong></td>
                <td>Measure with oscilloscope/frequency counter</td>
                <td>Within ±10% of set value</td>
              </tr>
              <tr>
                <td><strong>Coil Temperature</strong></td>
                <td>Measure coil surface temperature during operation</td>
                <td>≤ 41°C (patient contact surface)</td>
              </tr>
              <tr>
                <td><strong>Timer Accuracy</strong></td>
                <td>Compare set time to actual elapsed time</td>
                <td>Within ±10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/massage-therapy" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← Massage Therapy
        </Link>
        <Link href="/hot-air-oven" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          Next: Hot Air Oven →
        </Link>
      </div>
    </div>
  );
}
