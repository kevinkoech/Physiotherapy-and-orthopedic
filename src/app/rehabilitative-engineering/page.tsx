"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function RehabilitativeEngineeringPage() {
  // Rehabilitation Engineering Design Simulator
  const simulateRehabEngineering = (params: Record<string, number | string>) => {
    const disabilityType = params.disabilityType as string;
    const severityLevel = params.severityLevel as number;
    const ageGroup = params.ageGroup as string;
    const assistiveTech = params.assistiveTech as string;
    
    // Calculate functional independence measure (FIM) score
    const baseFIM = 126; // Maximum FIM score
    const disabilityImpact = disabilityType === "Motor" ? 0.4 : disabilityType === "Cognitive" ? 0.3 : 0.35;
    const severityImpact = severityLevel / 100;
    
    const estimatedFIM = Math.round(baseFIM * (1 - disabilityImpact * severityImpact));
    
    // Calculate assistive technology effectiveness
    let techEffectiveness = 0;
    let techComplexity = 0;
    
    if (assistiveTech === "Wheelchair") {
      techEffectiveness = 75;
      techComplexity = 2;
    } else if (assistiveTech === "Prosthesis") {
      techEffectiveness = 65;
      techComplexity = 4;
    } else if (assistiveTech === "Communication Aid") {
      techEffectiveness = 80;
      techComplexity = 3;
    } else if (assistiveTech === "Mobility Aid") {
      techEffectiveness = 70;
      techComplexity = 1;
    }
    
    // Adjust for severity
    techEffectiveness = techEffectiveness * (1 - severityImpact * 0.3);
    
    // Calculate rehabilitation potential
    const rehabPotential = Math.min(100, (estimatedFIM / baseFIM) * 100 + techEffectiveness * 0.3);
    
    // Calculate cost estimation (in KES)
    let baseCost = 0;
    if (assistiveTech === "Wheelchair") {
      baseCost = 50000;
    } else if (assistiveTech === "Prosthesis") {
      baseCost = 150000;
    } else if (assistiveTech === "Communication Aid") {
      baseCost = 80000;
    } else if (assistiveTech === "Mobility Aid") {
      baseCost = 20000;
    }
    
    const totalCost = baseCost * (1 + techComplexity * 0.1) * (severityLevel / 50);
    
    // Training hours estimation
    const trainingHours = techComplexity * 10 * (severityLevel / 50);
    
    // Maintenance frequency (per year)
    const maintenanceFreq = techComplexity * 2;
    
    // Status indicators
    const fimStatus = estimatedFIM < 60 ? "danger" as const : estimatedFIM < 90 ? "warning" as const : "normal" as const;
    const potentialStatus = rehabPotential < 50 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Estimated FIM Score", value: estimatedFIM.toString(), unit: "/126", status: fimStatus, numericValue: estimatedFIM, min: 18, max: 126 },
      { parameter: "Functional Independence", value: ((estimatedFIM / baseFIM) * 100).toFixed(1), unit: "%", status: fimStatus, numericValue: (estimatedFIM / baseFIM) * 100, min: 0, max: 100 },
      { parameter: "Tech Effectiveness", value: techEffectiveness.toFixed(1), unit: "%", status: "normal" as const, numericValue: techEffectiveness, min: 0, max: 100 },
      { parameter: "Rehab Potential", value: rehabPotential.toFixed(1), unit: "%", status: potentialStatus, numericValue: rehabPotential, min: 0, max: 100 },
      { parameter: "Est. Cost (KES)", value: totalCost.toFixed(0), unit: "", status: "normal" as const, numericValue: totalCost, min: 0, max: 500000 },
      { parameter: "Training Required", value: trainingHours.toFixed(0), unit: "hours", status: "normal" as const, numericValue: trainingHours, min: 0, max: 100 },
      { parameter: "Maintenance/Year", value: maintenanceFreq.toFixed(0), unit: "times", status: "normal" as const, numericValue: maintenanceFreq, min: 0, max: 12 },
      { parameter: "Disability Type", value: disabilityType, unit: "", status: "normal" as const },
      { parameter: "Assistive Technology", value: assistiveTech, unit: "", status: "normal" as const },
    ];
  };

  const theoryText = `
    <h3>Fundamental Principles of Rehabilitation Engineering</h3>
    
    <h4>1. International Classification of Functioning (ICF) Model</h4>
    <p>The ICF framework describes:</p>
    <ul>
      <li><strong>Body Functions/Structures:</strong> Physiological and anatomical aspects</li>
      <li><strong>Activities:</strong> Execution of tasks by an individual</li>
      <li><strong>Participation:</strong> Involvement in life situations</li>
      <li><strong>Environmental Factors:</strong> Physical, social, attitudinal environment</li>
    </ul>
    
    <h4>2. Functional Independence Measure (FIM)</h4>
    <p><strong>FIM Score Range: 18-126</strong></p>
    <p>18 = Total dependence; 126 = Complete independence</p>
    <p>Categories: Motor (13 items) + Cognitive (5 items)</p>
    <p>Each item scored 1-7:</p>
    <ul>
      <li>1 = Total assistance (patient < 25%)</li>
      <li>2 = Maximal assistance (patient 25-49%)</li>
      <li>3 = Moderate assistance (patient 50-74%)</li>
      <li>4 = Minimal assistance (patient 75-99%)</li>
      <li>5 = Supervision/setup</li>
      <li>6 = Modified independence</li>
      <li>7 = Complete independence</li>
    </ul>
    
    <h4>3. Assistive Technology Service Delivery</h4>
    <p><strong>HAAT Model (Human Activity Assistive Technology)</strong></p>
    <p>Components: Human + Activity + Assistive Technology + Context</p>
    
    <h4>4. Universal Design Principles</h4>
    <ol>
      <li>Equitable Use</li>
      <li>Flexibility in Use</li>
      <li>Simple and Intuitive Use</li>
      <li>Perceptible Information</li>
      <li>Tolerance for Error</li>
      <li>Low Physical Effort</li>
      <li>Size and Space for Approach and Use</li>
    </ol>
    
    <h4>5. Wheelchair Seating Biomechanics</h4>
    <p><strong>Seat Height:</strong> Popliteal height + 2-3 inches</p>
    <p><strong>Seat Depth:</strong> Thigh length - 2 inches</p>
    <p><strong>Seat Width:</strong> Hip width + 1 inch</p>
    <p><strong>Backrest Height:</strong> Scapular height for support</p>
    
    <h4>6. Pressure Distribution Formula</h4>
    <p><strong>P = F / A</strong></p>
    <p>Where P = pressure, F = force, A = contact area</p>
    <p>Goal: Minimize peak pressure, maximize contact area</p>
    <p>Pressure ulcer risk: P > 32 mmHg sustained</p>
    
    <h4>7. Cost-Benefit Analysis</h4>
    <p><strong>ROI = (Benefits - Costs) / Costs × 100%</strong></p>
    <p>Benefits include: Increased independence, reduced caregiver burden, employment opportunities</p>
  `;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Rehabilitative Engineering</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-lime-800 to-lime-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">♿ Rehabilitative Engineering</h1>
        <p className="text-lime-100">Learning Outcome: Apply Engineering Principles to Rehabilitation</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["ICF Model","Assistive Tech","Wheelchair Design","Seating","Accessibility","Assessment"].map(t => (
            <span key={t} className="bg-lime-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        <div className="mt-4">
          <PrintButton title="Rehabilitative Engineering - Learning Notes" theoryText={theoryText} />
        </div>
      </div>

      <div id="printable-content">
        <SimulationPanel
          title="Rehabilitation Planning Simulator"
          description="Calculate functional independence measures and assistive technology requirements"
          parameters={[
            { name: "Disability Type", key: "disabilityType", unit: "", min: 0, max: 0, default: "Motor", type: "select", options: [
              { value: "Motor", label: "Motor Impairment" },
              { value: "Cognitive", label: "Cognitive Impairment" },
              { value: "Sensory", label: "Sensory Impairment" },
            ]},
            { name: "Severity Level", key: "severityLevel", unit: "%", min: 10, max: 100, step: 10, default: 50 },
            { name: "Age Group", key: "ageGroup", unit: "", min: 0, max: 0, default: "Adult", type: "select", options: [
              { value: "Pediatric", label: "Pediatric (0-18)" },
              { value: "Adult", label: "Adult (18-65)" },
              { value: "Geriatric", label: "Geriatric (65+)" },
            ]},
            { name: "Assistive Technology", key: "assistiveTech", unit: "", min: 0, max: 0, default: "Wheelchair", type: "select", options: [
              { value: "Wheelchair", label: "Wheelchair" },
              { value: "Prosthesis", label: "Prosthesis" },
              { value: "Communication Aid", label: "Communication Aid" },
              { value: "Mobility Aid", label: "Mobility Aid (Walker/Crutches)" },
            ]},
          ]}
          simulate={simulateRehabEngineering}
        />

        <div className="grid gap-6">
          {/* Introduction */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-lime-800 mb-4">📖 Introduction</h2>
            <p className="text-gray-700 mb-4">
              Rehabilitation Engineering applies engineering principles to design, develop, and adapt assistive 
              technology devices and systems that help people with disabilities achieve greater independence 
              and quality of life. This field bridges biomedical engineering, clinical rehabilitation, and 
              user-centered design.
            </p>
            <div className="bg-lime-50 border-l-4 border-lime-500 p-4">
              <p className="text-sm text-lime-800">
                <strong>Core Mission:</strong> Remove barriers and enable participation through technology, 
                following the principle of &quot;design for all&quot; and universal accessibility.
              </p>
            </div>
          </section>

          {/* ICF Model */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-lime-800 mb-4">🌐 ICF Framework</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`
    INTERNATIONAL CLASSIFICATION OF FUNCTIONING (ICF)
    ═════════════════════════════════════════════════
    
    ┌─────────────────────────────────────────────────────┐
    │                 HEALTH CONDITION                     │
    │            (Disorder/Disease/Injury)                │
    └───────────────────────┬─────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │    BODY       │ │   ACTIVITY    │ │ PARTICIPATION │
    │  FUNCTIONS &  │ │   (Execution  │ │  (Involvement │
    │   STRUCTURES  │ │    of tasks)  │ │  in life)     │
    └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
            │                 │                 │
            │         ┌───────┴───────┐         │
            │         │               │         │
            ▼         ▼               ▼         ▼
    ┌─────────────────────────────────────────────────────┐
    │              CONTEXTUAL FACTORS                      │
    │  ┌─────────────────┐   ┌─────────────────┐         │
    │  │   ENVIRONMENTAL │   │    PERSONAL     │         │
    │  │     FACTORS     │   │    FACTORS      │         │
    │  │  (External)     │   │  (Internal)     │         │
    │  └─────────────────┘   └─────────────────┘         │
    └─────────────────────────────────────────────────────┘
`}</pre>
            </div>
          </section>

          {/* Assistive Technology */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-lime-800 mb-4">🔧 Assistive Technology Categories</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lime-700 mb-2">Mobility Aids</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Manual wheelchairs</li>
                  <li>• Power wheelchairs</li>
                  <li>• Scooters</li>
                  <li>• Walkers and rollators</li>
                  <li>• Crutches and canes</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lime-700 mb-2">Communication Aids</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Speech generating devices (SGD)</li>
                  <li>• Picture exchange systems</li>
                  <li>• Eye-tracking devices</li>
                  <li>• Text-to-speech software</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lime-700 mb-2">Sensory Aids</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Hearing aids and cochlear implants</li>
                  <li>• Screen readers</li>
                  <li>• Braille displays</li>
                  <li>• Magnification devices</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lime-700 mb-2">Daily Living Aids</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Adaptive eating utensils</li>
                  <li>• Dressing aids</li>
                  <li>• Bathroom safety equipment</li>
                  <li>• Environmental control units</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Wheelchair Seating */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-lime-800 mb-4">🦼 Wheelchair Seating Principles</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-lime-100">
                    <th className="border p-2 text-left">Dimension</th>
                    <th className="border p-2 text-left">Measurement</th>
                    <th className="border p-2 text-left">Clinical Significance</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border p-2">Seat Height</td>
                    <td className="border p-2">Popliteal height + 5 cm</td>
                    <td className="border p-2">Enables foot propulsion, transfers</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Seat Depth</td>
                    <td className="border p-2">Thigh length - 5 cm</td>
                    <td className="border p-2">Prevents posterior knee pressure</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Seat Width</td>
                    <td className="border p-2">Hip width + 2.5 cm</td>
                    <td className="border p-2">Accommodates clothing, allows movement</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Backrest Height</td>
                    <td className="border p-2">Based on trunk control</td>
                    <td className="border p-2">Provides appropriate support level</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Armrest Height</td>
                    <td className="border p-2">Elbow flexion 90° + 2.5 cm</td>
                    <td className="border p-2">Supports upper extremities</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Assessment */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-lime-800 mb-4">📝 Assessment Questions</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">1. What is the maximum FIM score?</p>
                <p className="text-sm text-gray-600">a) 18 | b) 63 | c) 126 | d) 147</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">2. What does ICF stand for?</p>
                <p className="text-sm text-gray-600">a) International Classification of Functioning | b) Integrated Care Framework | c) International Clinical Form | d) Individual Care Function</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">3. What is the pressure ulcer risk threshold?</p>
                <p className="text-sm text-gray-600">a) 12 mmHg | b) 32 mmHg | c) 50 mmHg | d) 100 mmHg</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">4. How many principles are in Universal Design?</p>
                <p className="text-sm text-gray-600">a) 5 | b) 7 | c) 9 | d) 12</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-lime-50 rounded-lg">
              <p className="text-sm text-lime-800">
                <strong>Answers:</strong> 1-c, 2-a, 3-b, 4-b
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
