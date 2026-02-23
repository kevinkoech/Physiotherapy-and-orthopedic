import Link from "next/link";

const modules = [
  {
    id: 1,
    title: "Short Wave Diathermy Machine",
    href: "/short-wave-diathermy",
    icon: "⚡",
    color: "bg-blue-600",
    topics: ["Main parts", "Uses", "Types of operation", "Fault diagnosis", "Maintenance", "Safety tests", "Calibration"],
    description: "Learn about SWD machines that use high-frequency electromagnetic energy for deep tissue heating therapy.",
  },
  {
    id: 2,
    title: "Muscle Stimulator",
    href: "/muscle-stimulator",
    icon: "🔋",
    color: "bg-purple-600",
    topics: ["Main parts", "Uses", "Types", "Fault diagnosis", "Maintenance", "Safety tests", "Calibration"],
    description: "Study electrical muscle stimulation devices used for rehabilitation, pain relief, and muscle re-education.",
  },
  {
    id: 3,
    title: "Infrared Therapy Lamp",
    href: "/infrared-therapy",
    icon: "💡",
    color: "bg-red-600",
    topics: ["Types", "Establishing rapport", "Facilitating resolution", "Developing action plans"],
    description: "Understand infrared therapy lamps used for heat treatment, pain relief, and tissue healing.",
  },
  {
    id: 4,
    title: "Ultrasound Therapy",
    href: "/ultrasound-therapy",
    icon: "🔊",
    color: "bg-sky-600",
    topics: ["Main parts", "Piezoelectric crystal", "Thermal/Non-thermal effects", "Fault diagnosis", "Safety tests", "Calibration"],
    description: "Learn about therapeutic ultrasound equipment using high-frequency sound waves for tissue healing.",
  },
  {
    id: 5,
    title: "Hydro-Collator Unit",
    href: "/hydro-collator",
    icon: "🌊",
    color: "bg-cyan-600",
    topics: ["Main parts", "Uses", "Types", "Fault diagnosis", "Maintenance", "Safety tests"],
    description: "Learn about hydro-collator units that heat moist heat packs for therapeutic applications.",
  },
  {
    id: 6,
    title: "Massage Therapy Machine",
    href: "/massage-therapy",
    icon: "🤲",
    color: "bg-green-600",
    topics: ["Main parts", "Uses", "Types", "Fault diagnosis", "Maintenance", "Safety tests"],
    description: "Study mechanical massage therapy devices used for muscle relaxation and pain management.",
  },
  {
    id: 7,
    title: "Orthopaedic Oscillator",
    href: "/orthopaedic-oscillator",
    icon: "🔧",
    color: "bg-orange-600",
    topics: ["Main parts", "Uses", "Types", "Fault diagnosis", "Maintenance", "Safety tests"],
    description: "Understand orthopaedic oscillators used for bone healing and fracture treatment.",
  },
  {
    id: 8,
    title: "Hot Air Oven",
    href: "/hot-air-oven",
    icon: "🌡️",
    color: "bg-yellow-600",
    topics: ["Main parts", "Uses", "Types", "Fault diagnosis", "Maintenance", "Safety tests"],
    description: "Learn about hot air ovens used for dry heat sterilization of medical equipment.",
  },
  {
    id: 9,
    title: "Traction Therapy Machine",
    href: "/traction-therapy",
    icon: "↔️",
    color: "bg-teal-600",
    topics: ["Main parts", "Uses", "Types", "Fault diagnosis", "Maintenance", "Safety tests"],
    description: "Study traction therapy machines used for spinal decompression and musculoskeletal treatment.",
  },
  {
    id: 10,
    title: "Electrosurgical Unit (ESU)",
    href: "/electrosurgical-unit",
    icon: "⚡",
    color: "bg-red-700",
    topics: ["Main parts", "RF generator circuit", "Waveform types", "Fault diagnosis", "Safety tests", "Calibration"],
    description: "Learn about electrosurgical units that use high-frequency current for surgical cutting and coagulation.",
  },
  {
    id: 11,
    title: "Microwave Diathermy",
    href: "/microwave-diathermy",
    icon: "📡",
    color: "bg-orange-600",
    topics: ["Main parts", "Magnetron circuit", "Tissue penetration", "Fault diagnosis", "Safety tests", "Calibration"],
    description: "Study microwave diathermy machines that use 2450 MHz radiation for deep tissue heating therapy.",
  },
  {
    id: 12,
    title: "Orthopaedic Saw",
    href: "/orthopaedic-saw",
    icon: "🔧",
    color: "bg-slate-600",
    topics: ["Main parts", "Oscillation mechanism", "Pneumatic circuit", "Fault diagnosis", "Maintenance", "Safety tests"],
    description: "Understand orthopaedic saws used for bone cutting in joint replacement and fracture surgery.",
  },
  {
    id: 13,
    title: "Orthopaedic Implants",
    href: "/implants",
    icon: "🦴",
    color: "bg-teal-700",
    topics: ["Types of implants", "Materials science", "Sterilization", "Failure diagnosis", "Quality control", "Regulatory"],
    description: "Comprehensive guide to orthopaedic implants including fracture fixation, joint replacement, and quality control.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-8 shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-3">
            🏥 Physiotherapy Equipment Maintenance
          </h1>
          <p className="text-blue-100 text-lg mb-4">
            Comprehensive learning notes with detailed diagrams, circuit diagrams, and simulations
            for maintaining physiotherapy and rehabilitation equipment.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-blue-800 px-3 py-1 rounded-full">📊 13 Learning Modules</span>
            <span className="bg-blue-800 px-3 py-1 rounded-full">🔌 Circuit Diagrams</span>
            <span className="bg-blue-800 px-3 py-1 rounded-full">⚙️ Fault Diagnosis</span>
            <span className="bg-blue-800 px-3 py-1 rounded-full">🛡️ Safety Tests</span>
            <span className="bg-blue-800 px-3 py-1 rounded-full">📐 Calibration Guides</span>
          </div>
        </div>
      </div>

      {/* Learning Outcomes Overview */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">📋 Course Learning Outcomes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map((mod) => (
            <div key={mod.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{mod.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">LO {mod.id}: {mod.title}</p>
                <p className="text-gray-500 text-xs mt-1">{mod.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Learning Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <Link key={mod.id} href={mod.href} className="group">
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 group-hover:border-blue-300">
              <div className={`${mod.color} text-white p-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mod.icon}</span>
                  <div>
                    <p className="text-xs font-medium opacity-80">Learning Outcome {mod.id}</p>
                    <h3 className="font-bold text-lg leading-tight">{mod.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{mod.description}</p>
                <div className="flex flex-wrap gap-1">
                  {mod.topics.map((topic) => (
                    <span key={topic} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
                  View Detailed Notes →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Study Tips */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-bold text-yellow-800 text-lg mb-3">💡 Study Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-700">
          <div>
            <p className="font-semibold mb-1">🔍 Understand Before Memorizing</p>
            <p>Focus on understanding how each machine works before memorizing fault codes and procedures.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">📐 Study the Diagrams</p>
            <p>Circuit diagrams and block diagrams help visualize signal flow and component relationships.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">⚠️ Safety First</p>
            <p>Always review safety tests and electrical safety standards before performing maintenance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
