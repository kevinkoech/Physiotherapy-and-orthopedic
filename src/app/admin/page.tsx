"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

interface Report {
  id: number;
  traineeId: number;
  equipmentName: string;
  score: number;
  grade: string;
  status: string;
  submittedAt: Date;
  gradedAt: Date;
  traineeName: string;
  admissionNumber: string;
  className: string;
  simulationData?: string;
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterEquipment, setFilterEquipment] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationImage, setNotificationImage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState("all");
  const [sendingNotification, setSendingNotification] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { sendNotification } = useNotifications();

  useEffect(() => {
    // Check if user is admin or trainer
    if (!user || (user.role !== "admin" && user.role !== "trainer")) {
      router.push("/login");
      return;
    }
    fetchAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reports/admin");
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

  const filteredReports = reports.filter(report => {
    const matchesEquipment = !filterEquipment || 
      report.equipmentName.toLowerCase().includes(filterEquipment.toLowerCase());
    const matchesClass = !filterClass || 
      report.className.toLowerCase().includes(filterClass.toLowerCase());
    return matchesEquipment && matchesClass;
  });

  // Group reports by trainee
  const reportsByTrainee = reports.reduce((acc, report) => {
    const key = `${report.admissionNumber}_${report.className}`;
    if (!acc[key]) {
      acc[key] = {
        traineeName: report.traineeName,
        admissionNumber: report.admissionNumber,
        className: report.className,
        reports: [],
      };
    }
    acc[key].reports.push(report);
    return acc;
  }, {} as Record<string, { traineeName: string; admissionNumber: string; className: string; reports: Report[] }>);

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

  // Statistics
  const stats = {
    total: reports.length,
    graded: reports.filter(r => r.status === 'graded').length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    averageScore: reports.length > 0 
      ? Math.round(reports.reduce((sum, r) => sum + (r.score || 0), 0) / reports.length) 
      : 0,
  };

  const uniqueClasses = [...new Set(reports.map(r => r.className))].sort();
  const uniqueEquipments = [...new Set(reports.map(r => r.equipmentName))].sort();

  // Handle Excel export
  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/reports/export/excel");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trainee-marks.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      alert("Failed to export Excel file");
    }
  };

  // Handle Excel export per equipment
  const handleExportExcelPerEquipment = async (equipmentName: string) => {
    try {
      const encodedEquipmentName = encodeURIComponent(equipmentName);
      const response = await fetch(`/api/reports/export/excel/${encodedEquipmentName}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
      a.download = `${sanitizeFilename(equipmentName)}-marks.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      alert("Failed to export Excel file");
    }
  };

  // Handle zip export
  const handleExportZip = async () => {
    try {
      const response = await fetch("/api/reports/export/zip");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trainee-reports.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting zip file:", error);
      alert("Failed to export zip file");
    }
  };

  // Handle send notification
  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      alert("Please enter a title and message");
      return;
    }

    setSendingNotification(true);
    try {
      const success = await sendNotification(
        notificationTitle,
        notificationMessage,
        notificationImage || undefined,
        notificationTarget
      );

      if (success) {
        alert("Notification sent successfully!");
        setShowNotificationForm(false);
        setNotificationTitle("");
        setNotificationMessage("");
        setNotificationImage("");
        setNotificationTarget("all");
      } else {
        alert("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  // Download individual report as PDF
  const downloadReportPDF = async (report: Report) => {
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
      const filename = `${sanitizeFilename(report.admissionNumber)}_${sanitizeFilename(report.traineeName)}_${sanitizeFilename(report.className)}-${sanitizeFilename(report.equipmentName)}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  // Download individual report as Excel
  const downloadReportExcel = async (report: Report) => {
    try {
      const XLSX = (await import('xlsx')).default;
      
      const workbook = XLSX.utils.book_new();
      
      // Report info sheet
      const reportInfo = [
        { Field: 'Trainee Name', Value: report.traineeName },
        { Field: 'Admission Number', Value: report.admissionNumber },
        { Field: 'Class', Value: report.className },
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
      const filename = `${sanitizeFilename(report.admissionNumber)}_${sanitizeFilename(report.traineeName)}_${sanitizeFilename(report.className)}-${sanitizeFilename(report.equipmentName)}.xlsx`;
      
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
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Trainee Name</div>
            <div style="font-size: 16px; font-weight: bold; color: #1e40af;">${report.traineeName}</div>
          </div>
          <div style="text-align: center; margin: 5px 10px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Admission No.</div>
            <div style="font-size: 16px; font-weight: bold; color: #1e40af;">${report.admissionNumber}</div>
          </div>
          <div style="text-align: center; margin: 5px 10px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Class</div>
            <div style="font-size: 16px; font-weight: bold; color: #1e40af;">${report.className}</div>
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
            <div style="font-weight: bold; color: #1e40af;">${report.traineeName}</div>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and monitor trainee reports</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowNotificationForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Send Notification
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export All as Excel
            </button>
            <button
              onClick={handleExportZip}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download All Reports (Zip)
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Export Buttons */}
      {uniqueEquipments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Marks per Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueEquipments.map(equipmentName => (
              <button
                key={equipmentName}
                onClick={() => handleExportExcelPerEquipment(equipmentName)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {equipmentName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Graded Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.graded}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Trainees</p>
              <p className="text-2xl font-semibold text-gray-900">{Object.keys(reportsByTrainee).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filterEquipment" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Equipment
            </label>
            <select
              id="filterEquipment"
              value={filterEquipment}
              onChange={(e) => setFilterEquipment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Equipment</option>
              {uniqueEquipments.map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filterClass" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Class
            </label>
            <select
              id="filterClass"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchAllReports}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Reports by Trainee (Folder Structure) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reports by Trainee</h2>
          <p className="text-gray-600 text-sm mt-1">
            {Object.keys(reportsByTrainee).length} trainees with submitted reports
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {Object.entries(reportsByTrainee).map(([key, traineeData]) => (
            <div key={key} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{traineeData.traineeName}</h3>
                    <p className="text-sm text-gray-500">{traineeData.admissionNumber} | {traineeData.className}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{traineeData.reports.length} reports</span>
                  <span className="text-sm font-semibold text-blue-600">
                    Avg: {Math.round(traineeData.reports.reduce((sum, r) => sum + (r.score || 0), 0) / traineeData.reports.length)}%
                  </span>
                </div>
              </div>
              
              <div className="ml-13 space-y-2">
                {traineeData.reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.equipmentName}</p>
                        <p className="text-xs text-gray-500">{formatDate(report.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.grade === 'A' ? 'bg-green-100 text-green-800' :
                        report.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        report.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        report.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.grade} ({report.score}%)
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => downloadReportPDF(report)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Download PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => downloadReportExcel(report)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Download Excel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Reports</h2>
          <p className="text-gray-600 text-sm mt-1">
            Showing {filteredReports.length} of {reports.length} report{reports.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainee
                </th>
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
                  Class
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
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.traineeName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.admissionNumber}
                    </div>
                  </td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.className}
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
                    <div className="flex gap-1">
                      <button
                        onClick={() => downloadReportPDF(report)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Download PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => downloadReportExcel(report)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Download Excel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  <p className="text-sm text-gray-500">Trainee</p>
                  <p className="font-semibold">{selectedReport.traineeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Admission Number</p>
                  <p className="font-semibold">{selectedReport.admissionNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-semibold">{selectedReport.className}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Equipment</p>
                  <p className="font-semibold">{selectedReport.equipmentName}</p>
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

      {/* Send Notification Modal */}
      {showNotificationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Send Push Notification
                </h2>
                <button
                  onClick={() => setShowNotificationForm(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-orange-100 mt-1">Send notifications to all trainees</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={notificationTarget}
                  onChange={(e) => setNotificationTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Users</option>
                  <option value="trainee">Trainees Only</option>
                  <option value="trainer">Trainers Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  maxLength={100}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter notification message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  maxLength={500}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={notificationImage}
                  onChange={(e) => setNotificationImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNotificationForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={sendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingNotification ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
