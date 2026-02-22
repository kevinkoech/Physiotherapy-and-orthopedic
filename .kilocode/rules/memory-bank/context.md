# Active Context: Physiotherapy Equipment Maintenance Learning App

## Current State

**App Status**: ✅ Fully functional with 12 equipment modules

The application is a comprehensive physiotherapy equipment maintenance learning notes app with interactive simulations and print/export functionality.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] 12 equipment learning modules with detailed content
- [x] ASCII diagrams and circuit diagrams
- [x] Fault diagnosis tables
- [x] Safety tests and calibration guides
- [x] Assessment sections for all original 8 modules
- [x] Print/Export PDF functionality for all modules
- [x] Interactive simulation panels for all 12 equipment types
- [x] Graphical visualizations (bar charts and gauges) for simulation results
- [x] Enhanced print/export to capture simulation results with charts

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page with navigation | ✅ Complete |
| `src/app/layout.tsx` | Root layout | ✅ Complete |
| `src/app/globals.css` | Global styles | ✅ Complete |
| `src/components/PrintButton.tsx` | PDF export component with chart capture | ✅ Complete |
| `src/components/SimulationPanel.tsx` | Interactive simulation with charts | ✅ Complete |
| `src/app/short-wave-diathermy/` | SWD module | ✅ Complete |
| `src/app/muscle-stimulator/` | Muscle stimulator module | ✅ Complete |
| `src/app/infrared-therapy/` | IR therapy module | ✅ Complete |
| `src/app/hydro-collator/` | Hydro-collator module | ✅ Complete |
| `src/app/massage-therapy/` | Massage therapy module | ✅ Complete |
| `src/app/orthopaedic-oscillator/` | Orthopaedic oscillator module | ✅ Complete |
| `src/app/hot-air-oven/` | Hot air oven module | ✅ Complete |
| `src/app/traction-therapy/` | Traction therapy module | ✅ Complete |
| `src/app/electrosurgical-unit/` | ESU module | ✅ Complete |
| `src/app/microwave-diathermy/` | Microwave diathermy module | ✅ Complete |
| `src/app/orthopaedic-saw/` | Orthopaedic saw module | ✅ Complete |
| `src/app/implants/` | Orthopaedic implants module | ✅ Complete |

## Features

### Print/Export PDF
- Each equipment page has a "Print/Export PDF" button
- Opens a new window with formatted printable content
- Includes all learning notes, diagrams, and tables
- **NEW**: Captures simulation results with graphical visualizations (bar charts and gauges)
- Simulation results stored in data attributes for print capture

### Interactive Simulations
Each equipment page has a simulation panel with:
- Adjustable parameters (sliders and dropdowns)
- Real-time calculation of derived values
- Safety status indicators (normal/warning/danger)
- **NEW**: Bar chart visualization of all numeric results
- **NEW**: Gauge visualizations for parameters with min/max ranges
- Print results functionality with charts included

### Simulation Parameters by Equipment

| Equipment | Parameters |
|-----------|------------|
| Short Wave Diathermy | Power, Frequency, Treatment Time, Electrode Gap |
| Muscle Stimulator | Pulse Width, Frequency, Current, Mode |
| Infrared Therapy | Lamp Power, Distance, Treatment Time, Emitter Type |
| Hydro-Collator | Water Temp, Heater Power, Water Volume, Pack Size |
| Massage Therapy | Speed, Intensity, Treatment Time, Massage Type |
| Orthopaedic Oscillator | Frequency, Field Strength, Treatment Time, Coil Type |
| Hot Air Oven | Temperature, Sterilization Time, Chamber Volume, Load Mass |
| Traction Therapy | Force, Hold/Relax Time, Duration, Traction Type |
| Electrosurgical Unit | Power, Activation Time, Mode, Electrode Type |
| Microwave Diathermy | Power, Treatment Time, Applicator Distance, Applicator Type |
| Orthopaedic Saw | Speed, Cutting Depth, Blade Type, Power Source |
| Implants | Material Type, Implant Type, Patient Weight, Activity Level |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-22 | Built comprehensive physiotherapy equipment maintenance learning notes app with 8 modules |
| 2026-02-22 | Added 4 additional modules (ESU, Microwave Diathermy, Orthopaedic Saw, Implants) |
| 2026-02-22 | Added assessment sections to original 8 modules |
| 2026-02-22 | Added Print/Export PDF and interactive simulation features to all 12 equipment pages |
| 2026-02-22 | Enhanced simulation panel with bar charts and gauge visualizations |
| 2026-02-22 | Updated print/export to capture simulation results with graphical charts as SVG |
