"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Report {
  id: number;
  equipmentName: string;
  score: number;
  grade: string;
  status: string;
  submittedAt: Date;
  gradedAt: Date;
  simulationData?: string;
  traineeName?: string;
  admissionNumber?: string;
  className?: string;
}

export default function ReportHistoryPage() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { user } = useAuth();

  // Auto-fill admission number from logged-in user
  useEffect(() => {
    if (user && user.admissionNumber) {
      setAdmissionNumber(user.admissionNumber);
      fetchReports(user.admissionNumber);
    }
  }, [user]);

  const fetchReports = async (admNumber: string) => {
    if (!admNumber.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/reports/trainee?admissionNumber=${encodeURIComponent(admNumber.trim())}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.reports.map((report: any) => ({
          ...report,
          submittedAt: new Date(report.submittedAt),
          gradedAt: report.gradedAt ? new Date(report.gradedAt) : null,
        })));
      } else {
        setError(data.error || "Failed to fetch reports");
      }
    } catch (err) {
      setError("Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchReports(admissionNumber);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExportExcel = async () => {
    const admNumber = user?.admissionNumber || admissionNumber;
    if (!admNumber) {
      alert("Please enter your admission number");
      return;
    }
    try {
      const response = await fetch(`/api/reports/export/excel/trainee/${encodeURIComponent(admNumber.trim())}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trainee-marks-${admNumber.trim()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      alert("Failed to export Excel file");
    }
  };

  // Download individual report as PDF
  const downloadReportPDF = async (report: Report) => {
    const admNumber = user?.admissionNumber || admissionNumber;
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      // Create report HTML
      const reportHTML = generateReportHTML(report);
      
      // Create temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      document.body.appendChild(container);
      container.innerHTML = reportHTML;
      
      // Capture content
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      document.body.removeChild(container);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      const totalPages = Math.ceil(scaledHeight / pdfHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        const y = -(i * pdfHeight);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, y, scaledWidth, scaledHeight);
      }
      
      const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
      const filename = `${sanitizeFilename(admNumber)}-${sanitizeFilename(report.equipmentName)}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  // Download individual report as Excel
  const downloadReportExcel = async (report: Report) => {
    const admNumber = user?.admissionNumber || admissionNumber;
    try {
      const XLSX = (await import('xlsx')).default;
      
      const workbook = XLSX.utils.book_new();
      
      // Report info sheet
      const reportInfo = [
        { Field: 'Equipment', Value: report.equipmentName },
        { Field: 'Score', Value: `${report.score}%` },
        { Field: 'Grade', Value: report.grade },
        { Field: 'Status', Value: report.status },
        { Field: 'Submitted At', Value: formatDate(report.submittedAt) },
      ];
      
      const infoSheet = XLSX.utils.json_to_sheet(reportInfo);
      XLSX.utils.book_append_sheet(workbook, infoSheet, 'Report Info');
      
      // Simulation data sheet
      if (report.simulationData) {
        try {
          const simData = JSON.parse(report.simulationData);
          
          if (simData.parameters) {
            const paramsData = Object.entries(simData.parameters).map(([key, value]) => ({
              Parameter: key,
              Value: value,
            }));
            const paramsSheet = XLSX.utils.json_to_sheet(paramsData);
            XLSX.utils.book_append_sheet(workbook, paramsSheet, 'Parameters');
          }
          
          if (simData.results) {
            const resultsData = simData.results.map((r: any) => ({
              Parameter: r.parameter,
              Value: r.value,
              Unit: r.unit,
              Status: r.status,
            }));
            const resultsSheet = XLSX.utils.json_to_sheet(resultsData);
            XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Results');
          }
        } catch (e) {
          console.error('Error parsing simulation data:', e);
        }
      }
      
      const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
      const filename = `${sanitizeFilename(admNumber)}-${sanitizeFilename(report.equipmentName)}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Failed to download Excel');
    }
  };

  // Generate report HTML for PDF
  const generateReportHTML = (report: Report) => {
    let simulationHTML = '';
    
    if (report.simulationData) {
      try {
        const simData = JSON.parse(report.simulationData);
        
        if (simData.parameters) {
          simulationHTML += `
            <h3 style="color: #1e40af; margin: 15px 0 10px;">Input Parameters</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Parameter</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Value</th>
              </tr>
              ${Object.entries(simData.parameters).map(([key, value]) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${key}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">${value}</td>
                </tr>
              `).join('')}
            </table>
          `;
        }
        
        if (simData.results) {
          simulationHTML += `
            <h3 style="color: #1e40af; margin: 15px 0 10px;">Results</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Parameter</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Value</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Unit</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Status</th>
              </tr>
              ${simData.results.map((r: any) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${r.parameter}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">${r.value}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${r.unit}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; color: ${r.status === 'normal' ? '#059669' : r.status === 'warning' ? '#d97706' : '#dc2626'}; font-weight: bold;">${r.status.toUpperCase()}</td>
                </tr>
              `).join('')}
            </table>
          `;
        }
      } catch (e) {
        console.error('Error parsing simulation data:', e);
      }
    }
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: white;">
        <div style="text-align: center; border-bottom: 3px double #1e40af; padding-bottom: 15px; margin-bottom: 20px;">
          <div style="font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 4px;">The Nyeri National Polytechnic</div>
          <div style="font-size: 14px; color: #374151; margin-bottom: 2px;">EEE Department - Biomedical Engineering</div>
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">Unit Trainer: Kevin Koech</div>
          <h1 style="font-size: 24px; color: #1e40af; margin-bottom: 8px;">SIMULATION REPORT</h1>
          <div style="font-size: 14px; color: #6b7280;">${report.equipmentName}</div>
        </div>
        
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-around; flex-wrap: wrap;">
          <div style="text-align: center; margin: 5px 10px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Admission No.</div>
            <div style="font-size: 16px; font-weight: bold; color: #1e40af;">${admissionNumber}</div>
          </div>
          <div style="text-align: center; margin: 5px 10px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Class</div>
            <div style="font-size: 16px; font-weight: bold; color: #1e40af;">${report.className || 'N/A'}</div>
          </div>
        </div>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h2 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">Score: ${report.score}% (${report.grade})</h2>
          <p style="color: #6b7280;">Submitted: ${formatDate(report.submittedAt)}</p>
        </div>
        
        ${simulationHTML}
        
        <div style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <div style="border: 2px solid #1e40af; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 10px;">Trainee</div>
            <div style="font-weight: bold; color: #1e40af;">${report.traineeName || 'Trainee'}</div>
            <div style="border-bottom: 1px solid #374151; margin: 30px 0 8px 0;"></div>
            <div style="font-size: 11px; color: #9ca3af;">Signature</div>
          </div>
          <div style="border: 2px solid #1e40af; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 10px;">Trainer</div>
            <div style="font-weight: bold; color: #1e40af;">Kevin Koech</div>
            <div style="border-bottom: 1px solid #374151; margin: 30px 0 8px 0;"></div>
            <div style="font-size: 11px; color: #9ca3af;">Signature</div>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af;">
          <p>Generated on ${dateStr} at ${timeStr}</p>
        </div>
      </div>
    `;
  };

  // Calculate statistics
  const stats = {
    total: reports.length,
    averageScore: reports.length > 0 
      ? Math.round(reports.reduce((sum, r) => sum + (r.score || 0), 0) / reports.length) 
      : 0,
    gradeA: reports.filter(r => r.grade === 'A').length,
    gradeB: reports.filter(r => r.grade === 'B').length,
    gradeC: reports.filter(r => r.grade === 'C' || r.grade === 'D').length,
    gradeF: reports.filter(r => r.grade === 'F').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report History</h1>
            <p className="text-gray-600">View and download your submitted simulation reports</p>
          </div>
          {reports.length > 0 && (
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export All as Excel
            </button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        {user ? (
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">Logged in as:</span>
                <span className="font-semibold text-gray-900">{user.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{user.role}</span>
              </div>
              <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Admission Number
              </label>
              <input
                type="text"
                id="admissionNumber"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchReports(admissionNumber)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your admission number"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => fetchReports(admissionNumber)}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "View Reports"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Please sign in to view your reports</p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Sign In
            </a>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {reports.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-blue-600">{stats.averageScore}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Grade A/B</p>
            <p className="text-2xl font-bold text-green-600">{stats.gradeA + stats.gradeB}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Grade C/D/F</p>
            <p className="text-2xl font-bold text-orange-600">{stats.gradeC + stats.gradeF}</p>
          </div>
        </div>
      )}

      {/* Reports List */}
      {reports.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Reports</h2>
            <p className="text-gray-600 text-sm mt-1">
              Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.equipmentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {report.score}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.grade === 'A' ? 'bg-green-100 text-green-800' :
                        report.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        report.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        report.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.grade}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusBadgeClass(report.status)
                      }`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadReportPDF(report)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </button>
                        <button
                          onClick={() => downloadReportExcel(report)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Excel
                        </button>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {reports.length === 0 && !loading && admissionNumber.trim() && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">You have not submitted any reports yet. Complete a simulation to get started.</p>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Equipment</p>
                  <p className="font-semibold">{selectedReport.equipmentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-semibold">{formatDate(selectedReport.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="font-semibold text-2xl">{selectedReport.score}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className={`font-semibold text-2xl ${
                    selectedReport.grade === 'A' ? 'text-green-600' :
                    selectedReport.grade === 'B' ? 'text-blue-600' :
                    selectedReport.grade === 'C' ? 'text-yellow-600' :
                    selectedReport.grade === 'D' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>{selectedReport.grade}</p>
                </div>
              </div>
              
              {selectedReport.simulationData && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Simulation Data</h3>
                  {(() => {
                    try {
                      const simData = JSON.parse(selectedReport.simulationData);
                      return (
                        <div className="space-y-4">
                          {simData.parameters && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Parameters</h4>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <table className="w-full text-sm">
                                  <tbody>
                                    {Object.entries(simData.parameters).map(([key, value]) => (
                                      <tr key={key}>
                                        <td className="py-1 text-gray-600">{key}</td>
                                        <td className="py-1 font-medium text-right">{String(value)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          {simData.results && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Results</h4>
                              <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="py-2 text-left text-gray-600">Parameter</th>
                                      <th className="py-2 text-left text-gray-600">Value</th>
                                      <th className="py-2 text-left text-gray-600">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {simData.results.map((r: any, i: number) => (
                                      <tr key={i} className="border-b border-gray-100">
                                        <td className="py-2">{r.parameter}</td>
                                        <td className="py-2 font-medium">{r.value} {r.unit}</td>
                                        <td className="py-2">
                                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            r.status === 'normal' ? 'bg-green-100 text-green-800' :
                                            r.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {r.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } catch {
                      return <p className="text-gray-500">Unable to parse simulation data</p>;
                    }
                  })()}
                </div>
              )}
              
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => downloadReportPDF(selectedReport)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => downloadReportExcel(selectedReport)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
