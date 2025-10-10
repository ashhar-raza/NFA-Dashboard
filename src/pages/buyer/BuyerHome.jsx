import React, { useState, useMemo } from "react";
import { NfaDetails } from "../../data/data";

export default function BuyerHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [totalSpendFilter, setTotalSpendFilter] = useState("");
  const [rfpDateFilter, setRfpDateFilter] = useState("");

  // Calculate Average TAT (in days)
  const calculateTAT = (createdAt, lastModifiedAt) => {
    const created = new Date(createdAt);
    const modified = new Date(lastModifiedAt);
    const diffTime = Math.abs(modified - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return NfaDetails.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.NfaNumber.toLowerCase().includes(searchLower) ||
        item.ProjectDescription.toLowerCase().includes(searchLower) ||
        (item.Status?.toLowerCase().includes(searchLower)) ||
        (item.RiskCategory?.toLowerCase().includes(searchLower)) ||
        (item.TotalSpend?.toString().includes(searchLower)) ||
        (item.DueDeligenceStatus ? "yes" : "no").includes(searchLower) ||
        (new Date(item.RfpPublishDate).getFullYear().toString().includes(searchLower));

      const matchesRisk = riskFilter ? item.RiskCategory === riskFilter : true;

      const matchesTotalSpend = totalSpendFilter
        ? totalSpendFilter === "low"
          ? Number(item.TotalSpend) < 20000
          : totalSpendFilter === "medium"
          ? Number(item.TotalSpend) >= 20000 && Number(item.TotalSpend) <= 50000
          : Number(item.TotalSpend) > 50000
        : true;

      const matchesRfpDate = rfpDateFilter
        ? new Date(item.RfpPublishDate).getFullYear().toString() === rfpDateFilter
        : true;

      return matchesSearch && matchesRisk && matchesTotalSpend && matchesRfpDate;
    });
  }, [searchTerm, riskFilter, totalSpendFilter, rfpDateFilter]);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          className="input"
          style={{ flex: 1, minWidth: "200px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="">All Risks</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          className="select"
          value={totalSpendFilter}
          onChange={(e) => setTotalSpendFilter(e.target.value)}
        >
          <option value="">All Spend</option>
          <option value="low">Low (&lt;20k)</option>
          <option value="medium">Medium (20k-50k)</option>
          <option value="high">High (&gt;50k)</option>
        </select>

        <select
          className="select"
          value={rfpDateFilter}
          onChange={(e) => setRfpDateFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {[...new Set(NfaDetails.map((d) => new Date(d.RfpPublishDate).getFullYear()))].map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>NFA Number</th>
              <th>Status</th>
              <th>Vendor Due Diligence</th>
              <th>Average TAT (days)</th>
              <th>Risk Category</th>
              <th>Total Spend</th>
              <th>Project Description</th>
              <th>RFP Publish Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((item) => (
                <tr key={item.NfaNumber}>
                  <td>{item.NfaNumber}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.Status === "Approved"
                          ? "status-approved"
                          : item.Status === "Pending"
                          ? "status-pending"
                          : "status-destructive"
                      }`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td>{item.DueDeligenceStatus ? "Yes" : "No"}</td>
                  <td>{calculateTAT(item.createdAt, item.lastModifiedAt)}</td>
                  <td>
                    <span
                      className={`risk-badge ${
                        item.RiskCategory === "Low"
                          ? "risk-low"
                          : item.RiskCategory === "Medium"
                          ? "risk-medium"
                          : "risk-high"
                      }`}
                    >
                      {item.RiskCategory}
                    </span>
                  </td>
                  <td>{item.TotalSpend}</td>
                  <td>{item.ProjectDescription}</td>
                  <td>{new Date(item.RfpPublishDate).getFullYear()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "1rem", color: "var(--muted-foreground)" }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
