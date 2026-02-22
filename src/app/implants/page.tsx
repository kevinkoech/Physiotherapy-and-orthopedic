"use client";

import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { SimulationPanel } from "@/components/SimulationPanel";

export default function ImplantsPage() {
  // Implant Material Selection Simulation
  const simulateImplant = (params: Record<string, number | string>) => {
    const material = params.material as string;
    const implantType = params.implantType as string;
    const patientWeight = params.patientWeight as number;
    const activityLevel = params.activityLevel as string;
    
    // Material properties
    let yieldStrength = 0;
    let elasticModulus = 0;
    let density = 0;
    let corrosionResistance = 0;
    let biocompatibility = "";
    
    if (material === "Ti-6Al-4V") {
      yieldStrength = 880; // MPa
      elasticModulus = 110; // GPa
      density = 4.43; // g/cm³
      corrosionResistance = 95; // %
      biocompatibility = "Excellent";
    } else if (material === "316L SS") {
      yieldStrength = 290; // MPa
      elasticModulus = 200; // GPa
      density = 8.0; // g/cm³
      corrosionResistance = 70; // %
      biocompatibility = "Good";
    } else if (material === "CoCrMo") {
      yieldStrength = 450; // MPa
      elasticModulus = 210; // GPa
      density = 8.3; // g/cm³
      corrosionResistance = 90; // %
      biocompatibility = "Good";
    } else {
      yieldStrength = 20; // MPa (UHMWPE)
      elasticModulus = 0.5; // GPa
      density = 0.94; // g/cm³
      corrosionResistance = 100; // % (inert)
      biocompatibility = "Excellent";
    }
    
    // Load calculation based on implant type and patient weight
    let loadFactor = 0;
    if (implantType === "Hip") {
      loadFactor = 2.5; // Joint force is 2.5x body weight during walking
    } else if (implantType === "Knee") {
      loadFactor = 3.0;
    } else if (implantType === "Shoulder") {
      loadFactor = 0.9;
    } else {
      loadFactor = 1.5; // Spine
    }
    
    // Activity multiplier
    let activityMultiplier = 1;
    if (activityLevel === "Moderate") {
      activityMultiplier = 1.5;
    } else if (activityLevel === "High") {
      activityMultiplier = 2.0;
    }
    
    const estimatedLoad = patientWeight * 9.81 * loadFactor * activityMultiplier; // Newtons
    const safetyFactor = (yieldStrength * 100) / (estimatedLoad / 100); // Simplified
    
    // Safety thresholds
    const loadStatus = estimatedLoad > 3000 ? "warning" as const : "normal" as const;
    const safetyStatus = safetyFactor < 2 ? "danger" as const : safetyFactor < 4 ? "warning" as const : "normal" as const;
    const corrosionStatus = corrosionResistance < 80 ? "warning" as const : "normal" as const;
    
    return [
      { parameter: "Yield Strength", value: yieldStrength.toString(), unit: "MPa", status: "normal" as const, numericValue: yieldStrength, min: 100, max: 1500 },
      { parameter: "Elastic Modulus", value: elasticModulus.toString(), unit: "GPa", status: "normal" as const, numericValue: elasticModulus, min: 50, max: 250 },
      { parameter: "Density", value: density.toFixed(2), unit: "g/cm³", status: "normal" as const, numericValue: density, min: 2, max: 20 },
      { parameter: "Corrosion Resistance", value: corrosionResistance.toString(), unit: "%", status: corrosionStatus, numericValue: corrosionResistance, min: 0, max: 100 },
      { parameter: "Biocompatibility", value: biocompatibility, unit: "", status: "normal" as const },
      { parameter: "Est. Peak Load", value: estimatedLoad.toFixed(0), unit: "N", status: loadStatus, numericValue: estimatedLoad, min: 0, max: 5000 },
      { parameter: "Safety Factor", value: safetyFactor.toFixed(1), unit: "", status: safetyStatus, numericValue: safetyFactor, min: 1, max: 10 },
      { parameter: "Material", value: material, unit: "", status: "normal" as const },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="breadcrumb mb-4">
            <Link href="/" className="text-teal-200 hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Orthopaedic Implants</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">🦴 Orthopaedic Implants</h1>
          <p className="text-xl text-teal-100">Module 12 — Types, Materials, Maintenance & Quality Control</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-teal-600 rounded-lg p-3">
              <div className="text-2xl font-bold">Ti-6Al-4V</div>
              <div className="text-teal-200 text-sm">Titanium Alloy</div>
            </div>
            <div className="bg-teal-600 rounded-lg p-3">
              <div className="text-2xl font-bold">316L SS</div>
              <div className="text-teal-200 text-sm">Stainless Steel</div>
            </div>
            <div className="bg-teal-600 rounded-lg p-3">
              <div className="text-2xl font-bold">UHMWPE</div>
              <div className="text-teal-200 text-sm">Polyethylene</div>
            </div>
            <div className="bg-teal-600 rounded-lg p-3">
              <div className="text-2xl font-bold">ISO</div>
              <div className="text-teal-200 text-sm">5832 Standard</div>
            </div>
          </div>
          {/* Print/Export Buttons */}
          <div className="mt-4">
            <PrintButton title="Orthopaedic Implants - Learning Notes" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Printable Content Wrapper */}
        <div id="printable-content">

        {/* Simulation Panel */}
        <SimulationPanel
          title="Implant Material Selector"
          description="Select implant material and patient parameters to analyze suitability"
          parameters={[
            { 
              name: "Material", 
              key: "material", 
              unit: "", 
              min: 0, 
              max: 0, 
              default: "Ti-6Al-4V",
              type: "select",
              options: [
                { value: "Ti-6Al-4V", label: "Titanium Alloy (Ti-6Al-4V)" },
                { value: "316L SS", label: "Stainless Steel (316L)" },
                { value: "CoCrMo", label: "Cobalt-Chrome (CoCrMo)" },
                { value: "UHMWPE", label: "Polyethylene (UHMWPE)" },
              ]
            },
            { 
              name: "Implant Type", 
              key: "implantType", 
              unit: "", 
              min: 0, 
              max: 0, 
              default: "Hip",
              type: "select",
              options: [
                { value: "Hip", label: "Hip Replacement" },
                { value: "Knee", label: "Knee Replacement" },
                { value: "Shoulder", label: "Shoulder Replacement" },
                { value: "Spine", label: "Spinal Implant" },
              ]
            },
            { name: "Patient Weight", key: "patientWeight", unit: "kg", min: 40, max: 150, step: 5, default: 70 },
            { 
              name: "Activity Level", 
              key: "activityLevel", 
              unit: "", 
              min: 0, 
              max: 0, 
              default: "Moderate",
              type: "select",
              options: [
                { value: "Low", label: "Low (Sedentary)" },
                { value: "Moderate", label: "Moderate (Walking)" },
                { value: "High", label: "High (Sports)" },
              ]
            },
          ]}
          simulate={simulateImplant}
          equipmentName="Orthopaedic Implants"
        />

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="section-header">1. Introduction to Orthopaedic Implants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What are Orthopaedic Implants?</h3>
              <p className="text-gray-600 mb-3">
                Orthopaedic implants are medical devices surgically placed into the body to replace,
                support, or augment damaged bone or joint structures. They must be biocompatible,
                mechanically strong, corrosion-resistant, and able to withstand millions of loading cycles.
              </p>
              <div className="note-box p-3 rounded">
                <strong>Key Requirements:</strong> Biocompatibility (no toxic/allergic response),
                mechanical strength (withstand physiological loads), corrosion resistance
                (body fluids are corrosive), osseointegration (bone grows onto/into implant),
                and sterilizability.
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Implant Materials Comparison</h3>
              <div className="overflow-x-auto">
                <table className="fault-table w-full text-sm">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Strength</th>
                      <th>Biocompat.</th>
                      <th>MRI Safe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Ti-6Al-4V</td><td>High</td><td>Excellent</td><td>Conditional</td></tr>
                    <tr><td>316L SS</td><td>High</td><td>Good</td><td>Conditional</td></tr>
                    <tr><td>CoCrMo</td><td>Very High</td><td>Good</td><td>Conditional</td></tr>
                    <tr><td>UHMWPE</td><td>Medium</td><td>Excellent</td><td>Safe</td></tr>
                    <tr><td>Hydroxyapatite</td><td>Low</td><td>Excellent</td><td>Safe</td></tr>
                    <tr><td>PEEK</td><td>Medium</td><td>Excellent</td><td>Safe</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Implants */}
        <section className="mb-10">
          <h2 className="section-header">2. Types of Orthopaedic Implants</h2>

          <h3 className="text-xl font-semibold text-gray-700 mb-4">2.1 Fracture Fixation Implants</h3>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
╔══════════════════════════════════════════════════════════════════════════════╗
║              FRACTURE FIXATION IMPLANTS — OVERVIEW                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  BONE PLATES                                                                 ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  Dynamic Compression Plate (DCP):                                   │    ║
║  │  ○──○──○──○──○──○──○──○──○──○──○──○──○──○──○──○──○──○──○──○──○   │    ║
║  │  Oval holes allow screw angulation for compression                  │    ║
║  │                                                                     │    ║
║  │  Locking Compression Plate (LCP):                                   │    ║
║  │  ⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕──⊕   │    ║
║  │  Threaded holes — screws lock into plate (angular stability)        │    ║
║  │                                                                     │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                              ║
║  INTRAMEDULLARY NAILS                                                        ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  Femoral Nail:                                                      │    ║
║  │                                                                     │    ║
║  │  Proximal end ──┬── Proximal locking screws (×2)                   │    ║
║  │                 │                                                   │    ║
║  │                 │   Nail body (titanium/stainless steel)            │    ║
║  │                 │   Diameter: 9–13 mm                               │    ║
║  │                 │   Length: 300–480 mm                              │    ║
║  │                 │                                                   │    ║
║  │  Distal end ────┴── Distal locking screws (×2)                     │    ║
║  │                                                                     │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                              ║
║  SCREWS                                                                      ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  Cortical Screw:  ──────────────────────────────────────────────── │    ║
║  │                   Fine thread, full length, for cortical bone       │    ║
║  │                                                                     │    ║
║  │  Cancellous Screw: ─────────────────────────────────────────────── │    ║
║  │                    Coarse thread, partial thread, for spongy bone   │    ║
║  │                                                                     │    ║
║  │  Locking Screw:   ⊕──────────────────────────────────────────────  │    ║
║  │                   Threaded head locks into plate hole               │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`}
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-4">2.2 Joint Replacement Implants</h3>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
╔══════════════════════════════════════════════════════════════════════════════╗
║              TOTAL KNEE REPLACEMENT (TKR) COMPONENTS                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  FEMORAL COMPONENT (CoCrMo alloy)                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │         ╭─────────────────────────────────────────╮                │    ║
║  │        ╭╯  Femoral condyles (articulating surface) ╰╮               │    ║
║  │       ╭╯   Polished CoCrMo surface                  ╰╮              │    ║
║  │      ╭╯    Patellar groove                           ╰╮             │    ║
║  │     ╭╯                                               ╰╮            │    ║
║  │     │  Fixation pegs/keel (cement or cementless)      │            │    ║
║  │     ╰╮                                               ╭╯            │    ║
║  │      ╰────────────────────────────────────────────────╯             │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                              ║
║  TIBIAL COMPONENT                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  Tibial Tray (Titanium):                                            │    ║
║  │  ┌─────────────────────────────────────────────────────────────┐   │    ║
║  │  │  ████████████████████████████████████████████████████████  │   │    ║
║  │  │  ████████████████████████████████████████████████████████  │   │    ║
║  │  └──────────────────────────┬──────────────────────────────────┘   │    ║
║  │                             │ Tibial stem (fixation)                │    ║
║  │                             │                                       │    ║
║  │  UHMWPE Insert (bearing):                                           │    ║
║  │  ┌─────────────────────────────────────────────────────────────┐   │    ║
║  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   │    ║
║  │  │  Articulates with femoral component                         │   │    ║
║  │  └─────────────────────────────────────────────────────────────┘   │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                              ║
║  PATELLAR COMPONENT (UHMWPE dome)                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │  ╭──────────────────────────────────────────────────────────────╮  │    ║
║  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │    ║
║  │  ╰──────────────────────────────────────────────────────────────╯  │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`}
          </div>

          <div className="diagram-box p-6 rounded-xl mb-6">
{`
╔══════════════════════════════════════════════════════════════════════════════╗
║              TOTAL HIP REPLACEMENT (THR) COMPONENTS                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ACETABULAR CUP (Hemispherical shell)                                       ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  Outer Shell (Titanium, porous coated):                             │    ║
║  │       ╭──────────────────────────────────────────────────╮         │    ║
║  │      ╭╯  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ╰╮        │    ║
║  │     ╭╯   ░ Porous titanium surface for bone ingrowth ░░  ╰╮       │    ║
║  │     │    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │       │    ║
║  │     ╰╮                                                   ╭╯       │    ║
║  │      ╰────────────────────────────────────────────────────╯        │    ║
║  │                                                                     │    ║
║  │  Inner Liner (UHMWPE, ceramic, or metal):                           │    ║
║  │       ╭──────────────────────────────────────────────────╮         │    ║
║  │      ╭╯  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ╰╮        │    ║
║  │     ╭╯   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ╰╮       │    ║
║  │     ╰╮                                                   ╭╯       │    ║
║  │      ╰────────────────────────────────────────────────────╯        │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                              ║
║  FEMORAL STEM + HEAD                                                         ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  Femoral Head (CoCrMo or Ceramic):                                  │    ║
║  │       ╭──────────────────────────────────────────────────╮         │    ║
║  │      ╭╯  Polished spherical surface                       ╰╮        │    ║
║  │     ╭╯   Diameter: 28, 32, 36, 40 mm                      ╰╮       │    ║
║  │     ╰╮                                                     ╭╯       │    ║
║  │      ╰────────────────────────────────────────────────────╯         │    ║
║  │                │ Morse taper connection                              │    ║
║  │                ▼                                                     │    ║
║  │  Femoral Stem (Titanium alloy):                                      │    ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │    ║
║  │  │  ████████████████████████████████████████████████████████   │   │    ║
║  │  │  ████ Proximal body ████████████████████████████████████   │   │    ║
║  │  │  ████████████████████████████████████████████████████████   │   │    ║
║  │  │                                    ████ Distal stem ████   │   │    ║
║  │  └──────────────────────────────────────────────────────────────┘   │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`}
          </div>
        </section>

        {/* Materials Science */}
        <section className="mb-10">
          <h2 className="section-header">3. Implant Materials — Detailed Properties</h2>
          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Composition</th>
                  <th>Yield Strength</th>
                  <th>Elastic Modulus</th>
                  <th>Applications</th>
                  <th>Concerns</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ti-6Al-4V</strong></td>
                  <td>90% Ti, 6% Al, 4% V</td>
                  <td>880 MPa</td>
                  <td>114 GPa</td>
                  <td>Femoral stems, plates, screws</td>
                  <td>Vanadium toxicity concerns; Ti-6Al-7Nb preferred</td>
                </tr>
                <tr>
                  <td><strong>316L Stainless Steel</strong></td>
                  <td>Fe, 17% Cr, 12% Ni, 2.5% Mo</td>
                  <td>690 MPa</td>
                  <td>200 GPa</td>
                  <td>Plates, screws, nails (temporary)</td>
                  <td>Nickel allergy; corrosion in body fluids</td>
                </tr>
                <tr>
                  <td><strong>CoCrMo (Cast)</strong></td>
                  <td>Co, 28% Cr, 6% Mo</td>
                  <td>450 MPa</td>
                  <td>210 GPa</td>
                  <td>Femoral heads, acetabular cups</td>
                  <td>Metal ion release; metal-on-metal concerns</td>
                </tr>
                <tr>
                  <td><strong>UHMWPE</strong></td>
                  <td>Ultra-high molecular weight polyethylene</td>
                  <td>21 MPa</td>
                  <td>0.9 GPa</td>
                  <td>Tibial inserts, acetabular liners</td>
                  <td>Wear debris → osteolysis; oxidation aging</td>
                </tr>
                <tr>
                  <td><strong>Alumina Ceramic</strong></td>
                  <td>Al₂O₃ (99.9% pure)</td>
                  <td>300 MPa</td>
                  <td>380 GPa</td>
                  <td>Femoral heads, acetabular liners</td>
                  <td>Brittle — catastrophic fracture risk</td>
                </tr>
                <tr>
                  <td><strong>Hydroxyapatite (HA)</strong></td>
                  <td>Ca₁₀(PO₄)₆(OH)₂</td>
                  <td>40 MPa</td>
                  <td>80 GPa</td>
                  <td>Coating on stems/cups for bone ingrowth</td>
                  <td>Coating delamination; resorption over time</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Implant Classification */}
        <section className="mb-10">
          <h2 className="section-header">4. Classification of Orthopaedic Implants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">By Fixation Method</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <strong>Cemented:</strong> Bone cement (PMMA) fills gap between implant and bone.
                  Immediate fixation. Used in elderly patients with poor bone quality.
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <strong>Cementless (Press-fit):</strong> Porous/HA-coated surface allows bone ingrowth.
                  Biological fixation. Used in younger, active patients.
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <strong>Hybrid:</strong> Cemented stem + cementless cup (or vice versa).
                  Combines advantages of both methods.
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">By Duration</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded">
                  <strong>Temporary:</strong> Removed after healing (fracture plates, external fixators).
                  Usually stainless steel. Planned removal surgery required.
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <strong>Permanent:</strong> Designed to remain in body for life (joint replacements,
                  spinal implants). Must withstand 10–30 years of cyclic loading.
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <strong>Biodegradable:</strong> Dissolves over time (PLA, PGA screws).
                  Used in pediatric surgery and soft tissue fixation.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sterilization and Storage */}
        <section className="mb-10">
          <h2 className="section-header">5. Sterilization, Storage & Quality Control</h2>
          <div className="circuit-diagram p-6 rounded-xl mb-6">
{`
  IMPLANT STERILIZATION METHODS
  ══════════════════════════════════════════════════════════════════

  GAMMA IRRADIATION (Most Common for Implants)
  ─────────────────────────────────────────────────────────────────
  Source: Co-60 (1.17 MeV and 1.33 MeV gamma rays)
  Dose: 25–40 kGy (minimum 25 kGy for sterility assurance level 10⁻⁶)
  
  Process:
  Packaged implant → Irradiation chamber → Dose verification → Release
  
  Advantages: Penetrates packaging, no heat, no residue
  Disadvantages: UHMWPE oxidation (use nitrogen atmosphere packaging)

  ETHYLENE OXIDE (EtO) STERILIZATION
  ─────────────────────────────────────────────────────────────────
  Gas: 100% EtO or EtO/CO₂ mixture
  Temperature: 37–55°C
  Humidity: 40–80% RH
  Exposure time: 2–6 hours
  Aeration: 12–24 hours (to remove EtO residue)
  
  Advantages: Low temperature (suitable for polymers)
  Disadvantages: Toxic gas, long cycle, residue concerns

  STEAM AUTOCLAVE (For Reusable Instruments)
  ─────────────────────────────────────────────────────────────────
  Temperature: 134°C
  Pressure: 3 bar (300 kPa)
  Time: 3–18 minutes (pre-vacuum or gravity cycle)
  
  Suitable for: Metal implants, instruments
  NOT suitable for: UHMWPE (deforms), electronics

  STERILITY ASSURANCE LEVEL (SAL):
  ─────────────────────────────────────────────────────────────────
  SAL 10⁻⁶ = probability of 1 non-sterile unit in 1,000,000 units
  Required for all implantable medical devices (ISO 11135, ISO 11137)
`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Storage Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Temperature:</strong> 15–25°C (avoid extremes)</li>
                <li>• <strong>Humidity:</strong> &lt;60% RH (prevent packaging degradation)</li>
                <li>• <strong>Light:</strong> Avoid direct UV (UHMWPE oxidation)</li>
                <li>• <strong>FIFO:</strong> First In, First Out stock rotation</li>
                <li>• <strong>Expiry:</strong> Check sterility expiry date before use</li>
                <li>• <strong>Packaging:</strong> Inspect for tears, moisture, damage</li>
                <li>• <strong>Traceability:</strong> Lot number, serial number records</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Pre-operative Checks</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Verify correct implant size and type</li>
                <li>• Check sterility indicator (color change)</li>
                <li>• Inspect packaging integrity</li>
                <li>• Verify expiry date</li>
                <li>• Check for visible damage or corrosion</li>
                <li>• Confirm implant matches surgical plan</li>
                <li>• Record lot number for traceability</li>
                <li>• Verify compatible instruments available</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Fault/Failure Diagnosis */}
        <section className="mb-10">
          <h2 className="section-header">6. Implant Failure Diagnosis</h2>
          <div className="diagram-box p-6 rounded-xl mb-6">
{`
  IMPLANT FAILURE MODES AND DIAGNOSIS
  ══════════════════════════════════════════════════════════════════

  MECHANICAL FAILURE
  ─────────────────────────────────────────────────────────────────
  Fatigue Fracture:
  ┌─────────────────────────────────────────────────────────────┐
  │  Cyclic loading → Crack initiation → Crack propagation      │
  │  → Catastrophic fracture                                    │
  │                                                             │
  │  Signs: Sudden pain, loss of function, X-ray shows fracture │
  │  Causes: Stress concentration, corrosion pits, overload     │
  │  Prevention: Correct sizing, avoid stress risers            │
  └─────────────────────────────────────────────────────────────┘

  CORROSION FAILURE
  ─────────────────────────────────────────────────────────────────
  Crevice Corrosion (at screw-plate interface):
  ┌─────────────────────────────────────────────────────────────┐
  │  Plate ──[screw]── Bone                                     │
  │         ↑                                                   │
  │  Crevice between screw head and plate hole                  │
  │  Low oxygen → Acidic environment → Corrosion                │
  │                                                             │
  │  Signs: Discoloration, pitting, metal ion release           │
  │  Prevention: Use same material for plate and screws         │
  └─────────────────────────────────────────────────────────────┘

  ASEPTIC LOOSENING (Joint Replacements)
  ─────────────────────────────────────────────────────────────────
  Wear debris → Macrophage activation → Osteolysis → Loosening
  ┌─────────────────────────────────────────────────────────────┐
  │  UHMWPE wear particles (0.1–10 μm)                          │
  │       ↓                                                     │
  │  Macrophages engulf particles                               │
  │       ↓                                                     │
  │  Release of cytokines (IL-1, TNF-α)                         │
  │       ↓                                                     │
  │  Osteoclast activation → Bone resorption                    │
  │       ↓                                                     │
  │  Implant loosening → Pain → Revision surgery                │
  │                                                             │
  │  Signs: Pain on weight bearing, X-ray lucency around stem   │
  └─────────────────────────────────────────────────────────────┘
`}
          </div>

          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Failure Mode</th>
                  <th>Clinical Signs</th>
                  <th>Imaging Findings</th>
                  <th>Management</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Implant fracture</td>
                  <td>Sudden pain, deformity, loss of function</td>
                  <td>X-ray: visible fracture line through implant</td>
                  <td>Urgent revision surgery; remove broken implant</td>
                </tr>
                <tr>
                  <td>Aseptic loosening</td>
                  <td>Gradual pain, instability, reduced ROM</td>
                  <td>X-ray: radiolucent line around implant</td>
                  <td>Revision arthroplasty; bone grafting if needed</td>
                </tr>
                <tr>
                  <td>Periprosthetic infection</td>
                  <td>Pain, swelling, fever, wound discharge</td>
                  <td>Bone scan, CT: periimplant changes</td>
                  <td>Antibiotics; debridement; implant removal if needed</td>
                </tr>
                <tr>
                  <td>Dislocation (hip)</td>
                  <td>Sudden pain, leg shortening/rotation</td>
                  <td>X-ray: femoral head outside acetabulum</td>
                  <td>Closed reduction; revision if recurrent</td>
                </tr>
                <tr>
                  <td>Corrosion/metal ion release</td>
                  <td>Pain, swelling, pseudotumor (ALVAL)</td>
                  <td>MRI: soft tissue mass; elevated serum metal ions</td>
                  <td>Revision to non-metal bearing surface</td>
                </tr>
                <tr>
                  <td>Periprosthetic fracture</td>
                  <td>Pain, deformity after fall/trauma</td>
                  <td>X-ray: fracture around implant</td>
                  <td>ORIF with plate/nail; revision if implant loose</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Maintenance and Quality Control */}
        <section className="mb-10">
          <h2 className="section-header">7. Implant Inventory Management & Quality Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-3">📦 Receiving Inspection</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>☐ Verify delivery against purchase order</li>
                <li>☐ Check packaging integrity</li>
                <li>☐ Verify sterility indicators</li>
                <li>☐ Check expiry dates</li>
                <li>☐ Record lot numbers</li>
                <li>☐ Inspect for damage/corrosion</li>
                <li>☐ Store in correct conditions</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-3">🏥 Intraoperative Handling</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>☐ Open packaging aseptically</li>
                <li>☐ Handle with sterile instruments only</li>
                <li>☐ Avoid dropping (may cause micro-cracks)</li>
                <li>☐ Do not mix metals (galvanic corrosion)</li>
                <li>☐ Record implant details in patient notes</li>
                <li>☐ Complete implant traceability form</li>
                <li>☐ Return unused implants per protocol</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h3 className="font-semibold text-purple-800 mb-3">📋 Traceability Requirements</h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>☐ Patient name and ID</li>
                <li>☐ Implant manufacturer and model</li>
                <li>☐ Lot/batch number</li>
                <li>☐ Serial number (if applicable)</li>
                <li>☐ Date of implantation</li>
                <li>☐ Surgeon name</li>
                <li>☐ Hospital/facility</li>
                <li>☐ Register with national implant registry</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Tests */}
        <section className="mb-10">
          <h2 className="section-header">8. Quality Control & Testing Standards</h2>
          <div className="overflow-x-auto">
            <table className="fault-table w-full">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Method</th>
                  <th>Standard</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mechanical Fatigue Testing</td>
                  <td>Cyclic loading to 10 million cycles at physiological loads</td>
                  <td>ISO 7206 (hip), ISO 14879 (knee)</td>
                  <td>Verify implant survives expected service life</td>
                </tr>
                <tr>
                  <td>Corrosion Testing</td>
                  <td>Immersion in simulated body fluid (SBF) at 37°C</td>
                  <td>ISO 10993-15, ASTM F746</td>
                  <td>Assess corrosion resistance and ion release</td>
                </tr>
                <tr>
                  <td>Biocompatibility Testing</td>
                  <td>Cytotoxicity, sensitization, implantation tests</td>
                  <td>ISO 10993-1 to -20</td>
                  <td>Verify no toxic/allergic response in body</td>
                </tr>
                <tr>
                  <td>Wear Testing</td>
                  <td>Hip/knee simulator, 5 million cycles in bovine serum</td>
                  <td>ISO 14242 (hip), ISO 14243 (knee)</td>
                  <td>Measure wear rate and debris generation</td>
                </tr>
                <tr>
                  <td>Sterility Testing</td>
                  <td>Biological indicator, membrane filtration</td>
                  <td>ISO 11135, ISO 11137, ISO 11607</td>
                  <td>Verify SAL 10⁻⁶ sterility assurance</td>
                </tr>
                <tr>
                  <td>Dimensional Inspection</td>
                  <td>CMM (Coordinate Measuring Machine), gauges</td>
                  <td>ISO 5832, manufacturer drawings</td>
                  <td>Verify dimensions within tolerance</td>
                </tr>
                <tr>
                  <td>Surface Finish</td>
                  <td>Profilometer (Ra measurement)</td>
                  <td>ISO 7206, manufacturer spec</td>
                  <td>Verify articulating surface smoothness</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Regulatory */}
        <section className="mb-10">
          <h2 className="section-header">9. Regulatory Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Classification</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Class III (USA FDA):</strong> Highest risk — requires PMA (Premarket Approval)</li>
                <li>• <strong>Class IIb (EU MDR):</strong> High risk — requires Notified Body review</li>
                <li>• <strong>ISO 13485:</strong> Quality management system for medical devices</li>
                <li>• <strong>ISO 14971:</strong> Risk management for medical devices</li>
                <li>• <strong>ISO 5832:</strong> Materials for surgical implants</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Post-Market Surveillance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>National Joint Registry (NJR):</strong> Tracks revision rates</li>
                <li>• <strong>MAUDE Database (FDA):</strong> Adverse event reporting</li>
                <li>• <strong>EUDAMED (EU):</strong> European device database</li>
                <li>• <strong>Vigilance reporting:</strong> Mandatory for serious incidents</li>
                <li>• <strong>Field Safety Corrective Actions:</strong> Recalls and safety notices</li>
              </ul>
            </div>
          </div>
          <div className="warning-box p-4 rounded mt-4">
            <strong>⚠️ Recall Awareness:</strong> Biomedical engineers must monitor FDA/MHRA/TGA
            safety notices and recalls. When a recalled implant is identified in a patient,
            follow the manufacturer&apos;s Field Safety Notice instructions and notify the clinical team.
            Document all actions taken.
          </div>
        </section>

        </div>{/* End printable-content */}

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          <Link href="/orthopaedic-saw" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
            ← Orthopaedic Saw
          </Link>
          <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  );
}
