import Link from "next/link";

export default function MuscleStimulatorPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Muscle Stimulator</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🔋 Muscle Stimulator Machine</h1>
        <p className="text-purple-100">Learning Outcome 2: Perform Muscle Stimulator Maintenance</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Main Parts","Uses","Types","Fault Diagnosis","Maintenance","Safety Tests","Calibration"].map(t => (
            <span key={t} className="bg-purple-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-purple-900 mb-3">📖 Introduction</h2>
        <p className="text-gray-700 mb-3">
          A Muscle Stimulator (also called Electrical Muscle Stimulator or EMS) is a device that delivers
          controlled electrical impulses to muscles via surface electrodes. These impulses cause muscle
          contractions, mimicking the natural nerve signals from the brain.
        </p>
        <div className="note-box">
          <strong>📌 Key Principle:</strong> Electrical stimulation works by depolarizing nerve and muscle cell
          membranes. When the applied current exceeds the threshold potential (~-55 mV), an action potential
          is generated, causing muscle contraction.
        </div>
      </div>

      {/* Section 1: Main Parts */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">1. Main Parts of Muscle Stimulator</h2>
        </div>

        <h3 className="font-bold text-gray-800 mt-4 mb-2">🔷 Block Diagram</h3>
        <div className="diagram-box">
{`
  ┌──────────────────────────────────────────────────────────────────┐
  │                    MUSCLE STIMULATOR MACHINE                     │
  │                                                                  │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐   │
  │  │  POWER   │───▶│ VOLTAGE  │───▶│    WAVEFORM GENERATOR    │   │
  │  │  SUPPLY  │    │REGULATOR │    │  (Pulse Width, Frequency) │   │
  │  │(Battery/ │    │          │    │                          │   │
  │  │  Mains)  │    └──────────┘    └──────────────────────────┘   │
  │  └──────────┘                                │                  │
  │                                              ▼                  │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐   │
  │  │ PATIENT  │◀───│ OUTPUT   │◀───│    CURRENT/VOLTAGE       │   │
  │  │ELECTRODES│    │ ISOLATION│    │    AMPLIFIER STAGE       │   │
  │  │          │    │TRANSFORMER│   │                          │   │
  │  └──────────┘    └──────────┘    └──────────────────────────┘   │
  │                                                                  │
  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐   │
  │  │ CONTROL  │    │  TIMER   │    │   INTENSITY/PARAMETER    │   │
  │  │  PANEL   │    │  CIRCUIT │    │   CONTROL CIRCUITS       │   │
  │  └──────────┘    └──────────┘    └──────────────────────────┘   │
  └──────────────────────────────────────────────────────────────────┘
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Circuit Diagram — Pulse Generator Stage</h3>
        <div className="circuit-diagram">
{`
  BIPHASIC PULSE GENERATOR CIRCUIT:
  
  +VCC ──────────────────────────────────────────────────────────┐
                                                                 │
  ┌─────────────────────────────────────────────────────────┐   │
  │              555 TIMER / MICROCONTROLLER                │   │
  │                                                         │   │
  │  Frequency Control ──[R_freq]──[C_freq]── Pin 2,6      │   │
  │  Pulse Width Control ──[R_pw]──[C_pw]──── Pin 5        │   │
  │                                                         │   │
  │  Output Pin 3 ──────────────────────────────────────────┼───┤
  └─────────────────────────────────────────────────────────┘   │
                                                                 │
  Output ──[R_base]──[Q1 NPN]──[R_collector]──────────────────[T1]
                         │                                   (Isolation
                        GND                                 Transformer)
                                                                 │
  BIPHASIC BRIDGE:                                               │
                                                                 │
  ┌──[Q2]──┬──[Q3]──┐                                           │
  │        │        │                                           │
  T1 ──────┤        ├──── T1                                    │
  │        │        │                                           │
  └──[Q4]──┴──[Q5]──┘                                           │
       │                                                         │
  Electrode (+) ──── Patient ──── Electrode (-)                 │
                                                                 │
  CURRENT FEEDBACK:                                              │
  Electrode ──[R_sense]──[Op-Amp]──[ADC]──[Microcontroller]    │
                                                                 │
  GND ──────────────────────────────────────────────────────────┘
  
  WAVEFORM TYPES:
  
  Monophasic:  ┌──┐
               │  │
  ─────────────┘  └──────────────────
  
  Biphasic:    ┌──┐
               │  │
  ─────────────┘  └──┐
                     │  │
                     └──┘──────────
  
  Interferential: ~~~~~~~~~~~~~~~~~~~~~
                  (two medium freq. AC)
`}
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">📋 Main Components</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Function</th>
                <th>Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Power Supply</strong></td><td>Provides operating voltages</td><td>Battery (9V/12V) or mains adapter</td></tr>
              <tr><td><strong>Microcontroller/Timer IC</strong></td><td>Generates precise pulse timing</td><td>555 timer or MCU (PIC/AVR)</td></tr>
              <tr><td><strong>Waveform Generator</strong></td><td>Creates therapeutic waveforms</td><td>Programmable, multiple waveforms</td></tr>
              <tr><td><strong>Power Amplifier</strong></td><td>Amplifies pulses to therapeutic levels</td><td>Output: 0-80 mA, 0-400V peak</td></tr>
              <tr><td><strong>Isolation Transformer</strong></td><td>Provides patient isolation (safety)</td><td>Isolation voltage: ≥1500V</td></tr>
              <tr><td><strong>Current Feedback Circuit</strong></td><td>Maintains constant current output</td><td>Constant current source</td></tr>
              <tr><td><strong>Electrode Leads</strong></td><td>Connect machine to patient electrodes</td><td>Colour-coded, 2-4 channels</td></tr>
              <tr><td><strong>Surface Electrodes</strong></td><td>Apply current to skin surface</td><td>Self-adhesive or carbon rubber</td></tr>
              <tr><td><strong>Control Panel</strong></td><td>User interface</td><td>Intensity, frequency, pulse width, timer</td></tr>
              <tr><td><strong>Display</strong></td><td>Shows parameters</td><td>LCD or LED display</td></tr>
              <tr><td><strong>Timer</strong></td><td>Controls treatment duration</td><td>0-60 minutes</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Uses */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">2. Uses of Muscle Stimulator</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="component-card">
            <h4 className="font-bold text-purple-800 mb-2">💪 Muscle Rehabilitation</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Muscle re-education after nerve injury</li>
              <li>Prevention of muscle atrophy</li>
              <li>Strengthening weak muscles</li>
              <li>Post-surgical rehabilitation</li>
              <li>Spasticity management</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-blue-800 mb-2">🩺 Pain Management</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>TENS for acute and chronic pain</li>
              <li>Gate control theory pain relief</li>
              <li>Endorphin release stimulation</li>
              <li>Post-operative pain control</li>
              <li>Neuropathic pain management</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-green-800 mb-2">🔄 Circulation & Healing</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Improved blood circulation</li>
              <li>Oedema reduction</li>
              <li>Wound healing acceleration</li>
              <li>Prevention of DVT</li>
              <li>Lymphatic drainage</li>
            </ul>
          </div>
          <div className="component-card">
            <h4 className="font-bold text-red-800 mb-2">⛔ Contraindications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Cardiac pacemakers</li>
              <li>Over carotid sinus</li>
              <li>Pregnancy (abdomen/pelvis)</li>
              <li>Active malignancy</li>
              <li>Epilepsy (head/neck area)</li>
              <li>Thrombosis/thrombophlebitis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="section-header">
          <h2 className="text-xl font-bold">3. Types of Muscle Stimulator</h2>
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Waveform</th>
                <th>Frequency</th>
                <th>Primary Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>TENS</strong> (Transcutaneous Electrical Nerve Stimulation)</td>
                <td>Biphasic pulsed</td>
                <td>1-150 Hz</td>
                <td>Pain relief</td>
              </tr>
              <tr>
                <td><strong>EMS</strong> (Electrical Muscle Stimulation)</td>
                <td>Biphasic pulsed</td>
                <td>20-100 Hz</td>
                <td>Muscle strengthening, re-education</td>
              </tr>
              <tr>
                <td><strong>NMES</strong> (Neuromuscular Electrical Stimulation)</td>
                <td>Biphasic pulsed</td>
                <td>20-50 Hz</td>
                <td>Functional muscle activation</td>
              </tr>
              <tr>
                <td><strong>IFT</strong> (Interferential Therapy)</td>
                <td>Two medium-freq AC (4000 Hz ± beat freq)</td>
                <td>Beat: 1-150 Hz</td>
                <td>Deep pain, oedema, muscle spasm</td>
              </tr>
              <tr>
                <td><strong>Russian Current</strong></td>
                <td>Burst-modulated AC (2500 Hz)</td>
                <td>50 Hz burst rate</td>
                <td>Muscle strengthening</td>
              </tr>
              <tr>
                <td><strong>Galvanic/DC</strong></td>
                <td>Direct current (continuous or interrupted)</td>
                <td>0 Hz (DC)</td>
                <td>Iontophoresis, denervated muscle</td>
              </tr>
              <tr>
                <td><strong>Diadynamic</strong></td>
                <td>Half/full-wave rectified AC</td>
                <td>50/100 Hz</td>
                <td>Pain, circulation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">📊 Waveform Comparison Diagram</h3>
        <div className="diagram-box">
{`
  WAVEFORM TYPES IN MUSCLE STIMULATION:
  
  1. MONOPHASIC PULSED (Faradic-type):
     ┌─┐   ┌─┐   ┌─┐   ┌─┐
     │ │   │ │   │ │   │ │
  ───┘ └───┘ └───┘ └───┘ └───
  
  2. BIPHASIC SYMMETRICAL:
     ┌─┐       ┌─┐       ┌─┐
     │ │       │ │       │ │
  ───┘ └──┐   ┌┘ └──┐   ┌┘ └──
          │   │     │   │
          └───┘     └───┘
  
  3. BIPHASIC ASYMMETRICAL:
     ┌──┐         ┌──┐
     │  │         │  │
  ───┘  └──┐   ───┘  └──┐
           │─┘          │─┘
  
  4. INTERFERENTIAL (two channels):
  
  Ch1: ~~~~~~~~~~~~~~~~~~~~~ (4000 Hz)
  Ch2: ~~~~~~~~~~~~~~~~~~~~~ (4100 Hz)
  
  Result (beat frequency = 100 Hz):
  ┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐
  
  5. RUSSIAN CURRENT (2500 Hz burst):
  ┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐
  │                          │
  └──────────────────────────┘
  Burst ON: 10ms, Burst OFF: 10ms
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
  FAULT DIAGNOSIS FLOWCHART — MUSCLE STIMULATOR:
  
  SYMPTOM: No output / Patient feels nothing
  ─────────────────────────────────────────────
  
  START
    │
    ▼
  Check power ──── Battery dead/no mains? ──▶ Replace battery/check supply
    │ OK
    ▼
  Check electrode leads ── Broken? ──────────▶ Replace leads
    │ OK
    ▼
  Check electrodes ──────── Poor contact? ───▶ Replace electrodes, clean skin
    │ OK
    ▼
  Check intensity setting ─ At zero? ────────▶ Increase intensity
    │ OK
    ▼
  Test output with meter ── No signal? ──────▶ Check waveform generator
    │ OK
    ▼
  Check amplifier stage ─── No output? ──────▶ Replace output transistors
    │ OK
    ▼
  Check isolation transformer ─ Open? ───────▶ Replace transformer
    │ OK
    ▼
  Output present ✓
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
                <td>No output</td>
                <td>Dead battery, broken leads, failed output stage</td>
                <td>Measure output voltage/current</td>
                <td>Replace battery/leads/output components</td>
              </tr>
              <tr>
                <td>Weak output</td>
                <td>Low battery, aging capacitors, weak transistors</td>
                <td>Measure output at max setting</td>
                <td>Replace battery/capacitors/transistors</td>
              </tr>
              <tr>
                <td>Uneven output (one channel)</td>
                <td>Faulty channel amplifier, broken lead</td>
                <td>Test each channel separately</td>
                <td>Repair/replace faulty channel components</td>
              </tr>
              <tr>
                <td>Incorrect frequency</td>
                <td>Faulty timer IC, drifted capacitor</td>
                <td>Measure frequency with oscilloscope</td>
                <td>Replace timer IC or timing capacitor</td>
              </tr>
              <tr>
                <td>Display not working</td>
                <td>Faulty LCD/LED, broken connection</td>
                <td>Check display supply voltage</td>
                <td>Replace display module</td>
              </tr>
              <tr>
                <td>Tingling/burning sensation</td>
                <td>DC offset in output, electrode problem</td>
                <td>Check for DC component in output</td>
                <td>Check coupling capacitors, replace electrodes</td>
              </tr>
              <tr>
                <td>Machine shuts off during use</td>
                <td>Overload protection, thermal shutdown</td>
                <td>Check load impedance, temperature</td>
                <td>Check electrode contact, allow cooling</td>
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
            <h3 className="font-bold text-gray-800 mb-3">Routine Maintenance Checklist</h3>
            <div className="component-card border-l-4 border-green-500">
              <h4 className="font-bold text-green-700 mb-2">Daily</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Inspect electrode leads for damage</li>
                <li>Check electrode condition</li>
                <li>Verify battery level</li>
                <li>Test output on all channels</li>
                <li>Clean housing with damp cloth</li>
              </ul>
            </div>
            <div className="component-card border-l-4 border-blue-500 mt-3">
              <h4 className="font-bold text-blue-700 mb-2">Monthly</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Calibrate output current/voltage</li>
                <li>Check frequency accuracy</li>
                <li>Inspect all connectors</li>
                <li>Test timer accuracy</li>
                <li>Check battery backup (if applicable)</li>
              </ul>
            </div>
            <div className="component-card border-l-4 border-purple-500 mt-3">
              <h4 className="font-bold text-purple-700 mb-2">Annual</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Full electrical safety test</li>
                <li>Replace electrolytic capacitors</li>
                <li>Check isolation transformer</li>
                <li>Full calibration</li>
                <li>Leakage current measurement</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Electrode Maintenance</h3>
            <div className="diagram-box text-xs">
{`
  ELECTRODE CARE PROCEDURE:
  
  SELF-ADHESIVE ELECTRODES:
  ├── Single-use: Discard after each patient
  ├── Multi-use: Clean with damp cloth
  ├── Check adhesive quality
  ├── Store in sealed bag
  └── Replace when adhesion fails
  
  CARBON RUBBER ELECTRODES:
  ├── Clean after each use
  │   └── Mild soap and water
  ├── Inspect for cracks/tears
  ├── Check snap connector
  ├── Store flat, away from heat
  └── Replace if surface damaged
  
  LEAD WIRE MAINTENANCE:
  ├── Check for kinks and breaks
  ├── Test continuity with ohmmeter
  │   └── Should be < 1Ω
  ├── Check connector pins
  ├── Avoid sharp bends
  └── Replace if resistance > 5Ω
  
  SKIN PREPARATION:
  ├── Clean skin with alcohol wipe
  ├── Allow to dry completely
  ├── Apply conductive gel if needed
  └── Ensure good electrode contact
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

        <div className="note-box mt-4">
          <strong>📌 Standard:</strong> IEC 60601-1 (General) and IEC 60601-2-10 (Particular requirements for
          nerve and muscle stimulators). Type BF or CF applied parts required.
        </div>

        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Procedure</th>
                <th>Limit</th>
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
                <td><strong>Patient Leakage Current</strong></td>
                <td>Measure at electrode outputs</td>
                <td>≤ 100 μA (Type BF), ≤ 10 μA (Type CF)</td>
              </tr>
              <tr>
                <td><strong>Output Current Accuracy</strong></td>
                <td>Measure into 500Ω load at each setting</td>
                <td>Within ±20% of indicated value</td>
              </tr>
              <tr>
                <td><strong>DC Component</strong></td>
                <td>Measure DC offset in output</td>
                <td>≤ 10 μA DC (to prevent electrolysis)</td>
              </tr>
              <tr>
                <td><strong>Isolation Test</strong></td>
                <td>Apply 1500V AC between patient circuit and earth</td>
                <td>No breakdown for 1 minute</td>
              </tr>
              <tr>
                <td><strong>Timer Accuracy</strong></td>
                <td>Compare set time to actual time</td>
                <td>Within ±10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-gray-800 mt-6 mb-2">🔌 Output Current Measurement Setup</h3>
        <div className="circuit-diagram">
{`
  OUTPUT CURRENT MEASUREMENT:
  
  Stimulator                    Measurement
  Output ──────────────────────────────────────────────┐
                                                       │
                                                  [500Ω Load]
                                                       │
                                                  [Ammeter/
                                                   Oscilloscope]
                                                       │
  Return ──────────────────────────────────────────────┘
  
  Note: 500Ω represents typical skin impedance
  
  DC COMPONENT TEST:
  
  Output ──[1μF Capacitor]──[Ammeter]──[500Ω]── Return
                │
                └── DC blocked by capacitor
                    Only DC component measured by ammeter
  
  PATIENT LEAKAGE CURRENT TEST:
  
  Mains Live ──[SWD Machine]── Neutral
                    │
              [Patient Output]
                    │
              [Measuring Device]  ← 1kΩ || 0.015μF
                    │
                   GND
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
            <h3 className="font-bold text-gray-800 mb-3">Calibration Equipment Needed</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Digital oscilloscope (≥20 MHz bandwidth)</li>
              <li>Precision resistor load (500Ω, 1%)</li>
              <li>True RMS multimeter</li>
              <li>Frequency counter</li>
              <li>Stopwatch (for timer calibration)</li>
              <li>Safety analyzer (for leakage tests)</li>
            </ul>

            <h3 className="font-bold text-gray-800 mt-4 mb-3">Calibration Points</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Parameter</th><th>Tolerance</th></tr>
                </thead>
                <tbody>
                  <tr><td>Output current</td><td>±20% of indicated</td></tr>
                  <tr><td>Pulse frequency</td><td>±10% of set value</td></tr>
                  <tr><td>Pulse width</td><td>±20% of set value</td></tr>
                  <tr><td>Timer</td><td>±10% of set time</td></tr>
                  <tr><td>Rise/fall time</td><td>Per manufacturer spec</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Calibration Procedure</h3>
            <div className="diagram-box text-xs">
{`
  STEP-BY-STEP CALIBRATION:
  
  1. SETUP
     ├── Connect 500Ω precision load
     ├── Connect oscilloscope to load
     └── Allow 10 min warm-up
  
  2. FREQUENCY CALIBRATION
     ├── Set frequency to 50 Hz
     ├── Measure with oscilloscope/counter
     ├── Adjust trimmer if needed
     └── Repeat at 10, 100 Hz
  
  3. PULSE WIDTH CALIBRATION
     ├── Set pulse width to 200 μs
     ├── Measure on oscilloscope
     ├── Adjust if outside ±20%
     └── Repeat at 100, 300 μs
  
  4. CURRENT CALIBRATION
     ├── Set intensity to 10 mA
     ├── Measure current through load
     ├── Adjust if outside ±20%
     └── Repeat at 20, 40, 80 mA
  
  5. TIMER CALIBRATION
     ├── Set timer to 10 minutes
     ├── Start stopwatch simultaneously
     ├── Compare at end
     └── Adjust if outside ±10%
  
  6. DOCUMENT RESULTS
     └── Record all readings, sign cert.
`}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Link href="/short-wave-diathermy" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          ← SWD Machine
        </Link>
        <Link href="/infrared-therapy" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Next: Infrared Therapy →
        </Link>
      </div>
    </div>
  );
}
