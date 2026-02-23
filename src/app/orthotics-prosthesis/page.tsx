"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function OrthoticsProsthesisPage() {
  // Orthotics/Prosthesis Design Simulator
  const simulateOrthoticsProsthesis = (params: Record<string, number | string>) => {
    const patientWeight = params.patientWeight as number;
    const activityLevel = params.activityLevel as string;
    const amputationLevel = params.amputationLevel as string;
    const materialType = params.materialType as string;
    
    // Calculate load requirements
    const staticLoad = patientWeight * 9.81; // N (Newton)
    const dynamicLoadFactor = activityLevel === "High" ? 3.0 : activityLevel === "Medium" ? 2.0 : 1.5;
    const dynamicLoad = staticLoad * dynamicLoadFactor; // N
    
    // Material properties
    let materialStrength = 0;
    let materialDensity = 0;
    let modulusOfElasticity = 0;
    
    if (materialType === "Carbon Fiber") {
      materialStrength = 1500; // MPa
      materialDensity = 1.6; // g/cm³
      modulusOfElasticity = 230; // GPa
    } else if (materialType === "Titanium") {
      materialStrength = 900; // MPa
      materialDensity = 4.5; // g/cm³
      modulusOfElasticity = 116; // GPa
    } else if (materialType === "Stainless Steel") {
      materialStrength = 505; // MPa
      materialDensity = 7.9; // g/cm³
      modulusOfElasticity = 193; // GPa
    } else if (materialType === "Polypropylene") {
      materialStrength = 35; // MPa
      materialDensity = 0.9; // g/cm³
      modulusOfElasticity = 1.5; // GPa
    }
    
    // Calculate safety factor
    const safetyFactor = (materialStrength * 1000000) / dynamicLoad; // Convert MPa to Pa
    
    // Estimate prosthesis weight based on amputation level
    let baseWeight = 0;
    if (amputationLevel === "Transtibial") {
      baseWeight = 1.5; // kg
    } else if (amputationLevel === "Transfemoral") {
      baseWeight = 2.5; // kg
    } else if (amputationLevel === "Disarticulation") {
      baseWeight = 2.0; // kg
    }
    
    const prosthesisWeight = baseWeight * (materialDensity / 2.5); // Adjust for material
    
    // Calculate energy expenditure increase
    const energyIncrease = amputationLevel === "Transfemoral" ? 65 : amputationLevel === "Transtibial" ? 25 : 40;
    
    // Calculate alignment parameters
    const socketFlexion = amputationLevel === "Transfemoral" ? 10 : 5; // degrees
    const socketAbduction = amputationLevel === "Transfemoral" ? 8 : 0; // degrees
    
    // Safety status
    const safetyStatus = safetyFactor < 2 ? "danger" as const : safetyFactor < 4 ? "warning" as const : "normal" as const;
    const weightStatus = prosthesisWeight > 3 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Static Load", value: staticLoad.toFixed(1), unit: "N", status: "normal" as const, numericValue: staticLoad, min: 0, max: 1500 },
      { parameter: "Dynamic Load", value: dynamicLoad.toFixed(1), unit: "N", status: "normal" as const, numericValue: dynamicLoad, min: 0, max: 4500 },
      { parameter: "Safety Factor", value: safetyFactor.toFixed(1), unit: "", status: safetyStatus, numericValue: safetyFactor, min: 0, max: 50 },
      { parameter: "Material Strength", value: materialStrength.toString(), unit: "MPa", status: "normal" as const, numericValue: materialStrength, min: 0, max: 2000 },
      { parameter: "Prosthesis Weight", value: prosthesisWeight.toFixed(2), unit: "kg", status: weightStatus, numericValue: prosthesisWeight, min: 0, max: 5 },
      { parameter: "Energy Increase", value: energyIncrease.toString(), unit: "%", status: "normal" as const, numericValue: energyIncrease, min: 0, max: 100 },
      { parameter: "Socket Flexion", value: socketFlexion.toString(), unit: "°", status: "normal" as const, numericValue: socketFlexion, min: 0, max: 20 },
      { parameter: "Material Type", value: materialType, unit: "", status: "normal" as const },
      { parameter: "Amputation Level", value: amputationLevel, unit: "", status: "normal" as const },
    ];
  };

  const theoryText = `
    <h3>Fundamental Principles of Orthotics and Prosthesis</h3>
    
    <h4>1. Biomechanical Principles</h4>
    <p><strong>Force Distribution:</strong> F = P × A</p>
    <p>Where F = force (N), P = pressure (Pa), A = area (m²)</p>
    <p>Proper socket design distributes forces over maximum surface area to minimize pressure points.</p>
    
    <h4>2. Safety Factor Calculation</h4>
    <p><strong>SF = σ<sub>ult</sub> / σ<sub>working</sub></strong></p>
    <p>Where SF = safety factor, σ<sub>ult</sub> = ultimate strength, σ<sub>working</sub> = working stress</p>
    <p>Recommended safety factor for prosthetics: SF ≥ 4</p>
    
    <h4>3. Material Selection Criteria</h4>
    <p><strong>Specific Strength = σ / ρ</strong></p>
    <p>Where σ = strength, ρ = density</p>
    <p>Higher specific strength indicates better strength-to-weight ratio.</p>
    
    <h4>4. Dynamic Load Factor</h4>
    <p><strong>F<sub>dynamic</sub> = F<sub>static</sub> × K</strong></p>
    <p>Where K = dynamic load factor (1.5-3.0 depending on activity level)</p>
    
    <h4>5. Energy Expenditure in Amputees</h4>
    <ul>
      <li>Transtibial amputation: 25-40% increase in energy expenditure</li>
      <li>Transfemoral amputation: 60-100% increase in energy expenditure</li>
      <li>Bilateral amputation: 200-280% increase in energy expenditure</li>
    </ul>
    
    <h4>6. Socket Design Principles</h4>
    <p><strong>Total Surface Bearing (TSB):</strong> Distributes load over entire residual limb</p>
    <p><strong>Patellar Tendon Bearing (PTB):</strong> Concentrates load on pressure-tolerant areas</p>
    
    <h4>7. Alignment Parameters</h4>
    <p><strong>Socket Flexion:</strong> 5-15° for transfemoral, 3-7° for transtibial</p>
    <p><strong>Socket Abduction:</strong> 6-10° for transfemoral prostheses</p>
    
    <h4>8. Material Properties</h4>
    <table border="1" style="border-collapse: collapse; margin: 10px 0;">
      <tr style="background: #f3f4f6;">
        <th style="padding: 8px;">Material</th>
        <th style="padding: 8px;">Strength (MPa)</th>
        <th style="padding: 8px;">Density (g/cm³)</th>
        <th style="padding: 8px;">Modulus (GPa)</th>
      </tr>
      <tr><td style="padding: 8px;">Carbon Fiber</td><td style="padding: 8px;">1500</td><td style="padding: 8px;">1.6</td><td style="padding: 8px;">230</td></tr>
      <tr><td style="padding: 8px;">Titanium</td><td style="padding: 8px;">900</td><td style="padding: 8px;">4.5</td><td style="padding: 8px;">116</td></tr>
      <tr><td style="padding: 8px;">Stainless Steel</td><td style="padding: 8px;">505</td><td style="padding: 8px;">7.9</td><td style="padding: 8px;">193</td></tr>
      <tr><td style="padding: 8px;">Polypropylene</td><td style="padding: 8px;">35</td><td style="padding: 8px;">0.9</td><td style="padding: 8px;">1.5</td></tr>
    </table>
  `;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span>›</span>
        <span className="text-gray-700">Orthotics & Prosthesis</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-800 to-rose-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">🦿 Orthotics & Prosthesis</h1>
        <p className="text-rose-100">Learning Outcome: Understand Orthotics and Prosthesis Design Principles</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {["Types","Materials","Biomechanics","Design","Fabrication","Fitting","Maintenance"].map(t => (
            <span key={t} className="bg-rose-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        <div className="mt-4">
          <PrintButton title="Orthotics and Prosthesis - Learning Notes" theoryText={theoryText} />
        </div>
      </div>

      <div id="printable-content">
        <SimulationPanel
          title="Prosthesis Design Simulator"
          description="Calculate load requirements, safety factors, and material selection for prosthetic devices"
          parameters={[
            { name: "Patient Weight", key: "patientWeight", unit: "kg", min: 30, max: 150, step: 5, default: 70 },
            { name: "Activity Level", key: "activityLevel", unit: "", min: 0, max: 0, default: "Medium", type: "select", options: [
              { value: "Low", label: "Low (K1 - Limited walker)" },
              { value: "Medium", label: "Medium (K2 - Community walker)" },
              { value: "High", label: "High (K3/K4 - Active)" },
            ]},
            { name: "Amputation Level", key: "amputationLevel", unit: "", min: 0, max: 0, default: "Transtibial", type: "select", options: [
              { value: "Transtibial", label: "Transtibial (Below Knee)" },
              { value: "Transfemoral", label: "Transfemoral (Above Knee)" },
              { value: "Disarticulation", label: "Disarticulation" },
            ]},
            { name: "Material Type", key: "materialType", unit: "", min: 0, max: 0, default: "Carbon Fiber", type: "select", options: [
              { value: "Carbon Fiber", label: "Carbon Fiber Composite" },
              { value: "Titanium", label: "Titanium Alloy" },
              { value: "Stainless Steel", label: "Stainless Steel" },
              { value: "Polypropylene", label: "Polypropylene" },
            ]},
          ]}
          simulate={simulateOrthoticsProsthesis}
        />

        <div className="grid gap-6">
          {/* Introduction */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-rose-800 mb-4">📖 Introduction</h2>
            <p className="text-gray-700 mb-4">
              Orthotics and prosthetics are specialized medical devices designed to support, align, prevent, 
              or correct deformities, or to replace missing limbs. This module covers the fundamental principles 
              of design, material selection, biomechanics, and clinical applications.
            </p>
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4">
              <p className="text-sm text-rose-800">
                <strong>Key Distinction:</strong> Orthotics are external devices that support existing body parts, 
                while prosthetics replace missing body parts.
              </p>
            </div>
          </section>

          {/* Types */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-rose-800 mb-4">📊 Types of Orthotics & Prosthetics</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Orthotics Classification</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-rose-700 mb-2">Upper Limb Orthotics</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Static orthoses (immobilization)</li>
                  <li>• Dynamic orthoses (assisted movement)</li>
                  <li>• Functional orthoses (task-specific)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-rose-700 mb-2">Lower Limb Orthotics</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• AFO (Ankle-Foot Orthosis)</li>
                  <li>• KAFO (Knee-Ankle-Foot Orthosis)</li>
                  <li>• HKAFO (Hip-Knee-Ankle-Foot Orthosis)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Prosthetics Classification</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-rose-700 mb-2">Lower Limb</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Transtibial (BK)</li>
                  <li>• Transfemoral (AK)</li>
                  <li>• Knee disarticulation</li>
                  <li>• Hip disarticulation</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-rose-700 mb-2">Upper Limb</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Transradial (BE)</li>
                  <li>• Transhumeral (AE)</li>
                  <li>• Shoulder disarticulation</li>
                  <li>• Cosmetic vs functional</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-rose-700 mb-2">Components</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Socket (interface)</li>
                  <li>• Suspension system</li>
                  <li>• Joints (knee/ankle)</li>
                  <li>• Terminal device (foot/hand)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Materials */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-rose-800 mb-4">🔧 Materials Science</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-rose-100">
                    <th className="border p-2 text-left">Material</th>
                    <th className="border p-2 text-left">Strength (MPa)</th>
                    <th className="border p-2 text-left">Density (g/cm³)</th>
                    <th className="border p-2 text-left">Applications</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border p-2">Carbon Fiber Composite</td>
                    <td className="border p-2">1500</td>
                    <td className="border p-2">1.6</td>
                    <td className="border p-2">High-performance feet, sockets</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Titanium Alloy (Ti-6Al-4V)</td>
                    <td className="border p-2">900</td>
                    <td className="border p-2">4.5</td>
                    <td className="border p-2">Joints, pylons, adapters</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Stainless Steel (316L)</td>
                    <td className="border p-2">505</td>
                    <td className="border p-2">7.9</td>
                    <td className="border p-2">Hardware, temporary devices</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Polypropylene</td>
                    <td className="border p-2">35</td>
                    <td className="border p-2">0.9</td>
                    <td className="border p-2">AFOs, sockets, diagnostic devices</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Silicone</td>
                    <td className="border p-2">10</td>
                    <td className="border p-2">1.1</td>
                    <td className="border p-2">Liners, cosmetic covers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Biomechanics */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-rose-800 mb-4">📐 Biomechanical Principles</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`
    PROSTHETIC ALIGNMENT PARAMETERS
    ═══════════════════════════════
    
                    Frontal Plane View          Sagittal Plane View
                    ─────────────────           ──────────────────
    
                         │                              │
                         │    Socket                   │    Socket
                         │   ┌─────┐                   │   ┌─────┐
                         │   │     │                   │   │     │
                    Abduction  │     │              Flexion  │     │
                    Angle  │   │     │              Angle │   │     │
                         │   │     │                   │   │     │
                         │   └──┬──┘                   │   └──┬──┘
                         │      │                      │      │
                         │      │                      │      │
                         │   ┌──┴──┐                   │   ┌──┴──┐
                         │   │Knee │                   │   │Knee │
                         │   │Joint│                   │   │Joint│
                         │   └──┬──┘                   │   └──┬──┘
                         │      │                      │      │
                         │      │                      │      │
                         │   ┌──┴──┐                   │   ┌──┴──┐
                         │   │Foot │                   │   │Foot │
                         │   └─────┘                   │   └─────┘
                         │                              │
    
    TRANSFEMORAL ALIGNMENT:
    • Socket Flexion: 10-15°
    • Socket Abduction: 6-10°
    • Initial Socket Adduction: 5-8°
    
    TRANSTIBIAL ALIGNMENT:
    • Socket Flexion: 3-7°
    • Tibial Angle: 85-90°
    • Heel Height: ±10mm from neutral
`}</pre>
            </div>
          </section>

          {/* Assessment */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-rose-800 mb-4">📝 Assessment Questions</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">1. What is the recommended safety factor for prosthetic devices?</p>
                <p className="text-sm text-gray-600">a) 1.5 | b) 2.0 | c) 4.0 | d) 10.0</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">2. Which material has the highest strength-to-weight ratio?</p>
                <p className="text-sm text-gray-600">a) Stainless Steel | b) Titanium | c) Carbon Fiber | d) Polypropylene</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">3. What does AFO stand for?</p>
                <p className="text-sm text-gray-600">a) Ankle-Foot Orthosis | b) Anterior Foot Orthotic | c) Articulated Foot Orthosis | d) Active Foot Orthotic</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">4. What is the typical energy expenditure increase for a transtibial amputee?</p>
                <p className="text-sm text-gray-600">a) 10-15% | b) 25-40% | c) 60-100% | d) 150-200%</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-rose-50 rounded-lg">
              <p className="text-sm text-rose-800">
                <strong>Answers:</strong> 1-c, 2-c, 3-a, 4-b
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
