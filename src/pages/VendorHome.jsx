import React, { useState, useEffect } from "react";
import { NfaDetails, NfaVendorDueDeligenceDetails } from "../data/data";
import { FaFileExport } from "react-icons/fa";
import { FileText } from "lucide-react"; // PDF / export icon

export default function VendorHome() {
  const [riskSummary, setRiskSummary] = useState({ High: 0, Medium: 0, Low: 0 });
  const [highRiskNfa, setHighRiskNfa] = useState([]);
  const [dueDeligenceStatus, setDueDeligenceStatus] = useState({ Completed: 0, Missing: 0 });

  useEffect(() => {
    // Compute vendor risk summary
    const riskCount = { High: 0, Medium: 0, Low: 0 };
    NfaVendorDueDeligenceDetails.forEach((v) => {
      if (v.RiskGrade === "High") riskCount.High += 1;
      else if (v.RiskGrade === "Medium") riskCount.Medium += 1;
      else riskCount.Low += 1;
    });
    setRiskSummary(riskCount);

    // High-risk vendors NFAs
    const highRisk = NfaVendorDueDeligenceDetails.filter((v) => v.RiskGrade === "High").map((v) => {
      const nfa = NfaDetails.find((n) => n.NfaNumber === v.NfaNumber);
      return { NfaNumber: v.NfaNumber, FinalProposedValue: nfa?.FinalProposedValue || 0 };
    });
    setHighRiskNfa(highRisk);

    // Due diligence status
    let completed = 0;
    let missing = 0;
    NfaVendorDueDeligenceDetails.forEach((v) => {
      if (v.CompanyName && v.CompanyStatus) completed += 1;
      else missing += 1;
    });
    setDueDeligenceStatus({ Completed: completed, Missing: missing });
  }, []);

  const exportAuditTrail = () => {
    const csvHeader = "NfaNumber,VendorCode,Round,RiskGrade,DueDeligenceStatus\n";
    const csvRows = NfaVendorDueDeligenceDetails.map(
      (v) => `${v.NfaNumber},${v.ProposedVendorCode},${v.round},${v.RiskGrade},${v.CompanyName ? "Completed" : "Missing"}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeader, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendor_audit_trail.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-4">Vendor Compliance Dashboard</h1>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["High", "Medium", "Low"].map((level) => (
          <div
            key={level}
            className={`card flex flex-col items-center justify-center p-4`}
          >
            <h3 className="text-lg font-semibold mb-2">{level} Risk Vendors</h3>
            <p
              className={`text-3xl font-bold ${
                level === "High"
                  ? "text-risk-high"
                  : level === "Medium"
                  ? "text-risk-medium"
                  : "text-risk-low"
              }`}
            >
              {riskSummary[level]}
            </p>
          </div>
        ))}
      </div>

      {/* High-risk NFAs Table */}
      <div className="card p-4 mb-6">
        <h2 className="section-title">High-Risk NFAs</h2>
        {highRiskNfa.length === 0 ? (
          <p className="text-muted">No high-risk vendor NFAs found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>NFA Number</th>
                  <th>Final Value (INR)</th>
                </tr>
              </thead>
              <tbody>
                {highRiskNfa.map((n, idx) => (
                  <tr key={idx}>
                    <td>{n.NfaNumber}</td>
                    <td>{n.FinalProposedValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Due Diligence Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card flex flex-col items-center justify-center p-4">
          <h3 className="text-lg font-semibold mb-2">Due Diligence Completed</h3>
          <p className="text-3xl font-bold text-success">{dueDeligenceStatus.Completed}</p>
        </div>
        <div className="card flex flex-col items-center justify-center p-4">
          <h3 className="text-lg font-semibold mb-2">Due Diligence Missing</h3>
          <p className="text-3xl font-bold text-destructive">{dueDeligenceStatus.Missing}</p>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportAuditTrail}
          className="button-comparative flex py-4"
        >
          <FileText /> Export Audit Trail
        </button>
      </div>
    </div>
  );
}
