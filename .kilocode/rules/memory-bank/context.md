# Active Context: Physiotherapy Equipment Maintenance Learning App

## Current State

**App Status**: ✅ Fully functional with 17 equipment modules

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
- [x] Line chart visualization for simulation results (matplotlib/MATLAB style)
- [x] Practical report format with experiment title, theory, observations, data, results, conclusion, and sign-off sections
- [x] Trainee information capture (name, admission number, and class) via dialog
- [x] Standalone simulation report print button next to simulate button
- [x] Institution header on reports (The Nyeri National Polytechnic, EEE Department, Biomedical Engineering, Unit Trainer: Kevin Koech)
- [x] Page numbers on printed/exported PDF reports
- [x] Report archiving and grading system
- [x] Database integration with Drizzle ORM and SQLite
- [x] Admin dashboard to manage reports and view statistics
- [x] Report history page for trainees to view their submissions
- [x] Automatic grading functionality based on simulation results
- [x] New filename format for printed reports: `admno_name_class-equipment-topic.pdf`

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page with navigation | ✅ Complete |
| `src/app/layout.tsx` | Root layout | ✅ Complete |
| `src/app/globals.css` | Global styles | ✅ Complete |
| `src/components/PrintButton.tsx` | PDF export component with chart capture | ✅ Complete |
| `src/components/SimulationPanel.tsx` | Interactive simulation with charts and standalone print | ✅ Complete |
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
| `src/app/electrotherapy/` | Electrotherapy module | ✅ Complete |
| `src/app/orthotics-prosthesis/` | Orthotics & prosthesis module | ✅ Complete |
| `src/app/rehabilitative-engineering/` | Rehabilitative engineering module | ✅ Complete |
| `src/app/tissue-engineering/` | Tissue engineering module | ✅ Complete |
| `src/app/report-history/` | Trainee report history page | ✅ Complete |
| `src/app/admin/` | Admin dashboard page | ✅ Complete |
| `src/app/api/reports/` | API routes for report management | ✅ Complete |
| `src/db/` | Database schema and client | ✅ Complete |

## Features

### Print/Export PDF (Full Content)
- Each equipment page has a "Print/Export PDF" button at the top
- Prompts for trainee name and admission number before generating report
- Generates a practical report with structured sections:
  1. Experiment Title/Topic
  2. Theory
  3. Observations
  4. Data (simulation parameters and results tables)
  5. Results (with line chart visualization)
  6. Conclusion
  7. Sign-off (trainee and trainer signature areas)
- Includes line chart visualization of simulation results
- Simulation results stored in data attributes for print capture

### Standalone Simulation Report
- "Print Report" button appears next to "Run Simulation" button after simulation runs
- Captures trainee name and registration number via dialog
- Generates a standalone PDF report with:
  - Header with equipment name and date/time
  - Trainee information section
  - Simulation parameters table
  - Simulation results table with status indicators
  - Line chart visualization of results
  - Summary section
  - Signature areas for trainee and trainer
- Opens in new window for printing/saving

### Report Archiving and Grading
- **Report Submission**: Trainees can submit simulation reports directly from the simulation panel
- **Automatic Grading**: Reports are automatically graded based on simulation results (percentage of normal parameters)
- **Report History**: Trainees can view their submitted reports with scores and grades
- **Admin Dashboard**: Admins can manage all reports, view statistics, and filter by equipment or class
- **Filename Format**: Reports are saved with the format: `admno_name_class-equipment-topic.pdf`

### Interactive Simulations
Each equipment page has a simulation panel with:
- Adjustable parameters (sliders and dropdowns)
- Real-time calculation of derived values
- Safety status indicators (normal/warning/danger)
- Line chart visualization of all numeric results (matplotlib/MATLAB style)
- Results table with parameter values and status
- Summary showing counts of normal/warning/danger parameters
- Standalone print report button after simulation runs
- Report submission button for archiving

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
| Electrotherapy | TENS, NMES, IFC, Strength-duration curve, Fault diagnosis, Safety tests |
| Orthotics & Prosthesis | Types, Materials, Biomechanics, Design principles, Fabrication, Fitting |
| Rehabilitative Engineering | ICF Model, Assistive technology, Wheelchair design, Seating principles, Accessibility |
| Tissue Engineering | Culture Temperature, pH Level, Dissolved Oxygen, Glucose Concentration, Media Injection Volume, Culture Time, Agitation Speed, Injection Interval, CO₂ Concentration, Media Replacement Rate |

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
| 2026-02-22 | Removed gauge visualizations, restructured report as practical format with experiment title, theory, observations, data, results, conclusion, and sign-off sections |
| 2026-02-22 | Fixed print/export to capture simulation panels - moved SimulationPanel inside printable-content div for all 12 equipment pages |
| 2026-02-22 | Added standalone simulation report print feature with trainee info capture - "Print Report" button appears next to simulate button after running simulation |
| 2026-02-22 | Added institution header (The Nyeri National Polytechnic, EEE Department, Biomedical Engineering, Unit Trainer: Kevin Koech), page numbers, and class field to trainee info in PDF reports |
| 2026-02-22 | Fixed chunk loading error by updating service worker to use network-first strategy for Next.js static chunks; Fixed chart display issues with CSS visibility and edge case handling |
| 2026-02-24 | Added report archiving and grading system with database integration, admin dashboard, and report history page |
| 2026-03-01 | Fixed hydration errors in all client components by ensuring consistent hook order |
| 2026-03-01 | Changed database from remote @kilocode/app-builder-db to local SQLite with better-sqlite3 |
| 2026-03-01 | Updated database connection configuration in src/db/index.ts and src/db/migrate.ts |
| 2026-03-01 | Installed better-sqlite3 and @types/better-sqlite3 dependencies |
