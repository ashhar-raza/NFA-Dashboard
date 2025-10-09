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
      // Search across all fields
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
          className="input-professional flex-1 min-w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="dropdown-professional"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="">All Risks</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          className="dropdown-professional"
          value={totalSpendFilter}
          onChange={(e) => setTotalSpendFilter(e.target.value)}
        >
          <option value="">All Spend</option>
          <option value="low">Low (&lt;20k)</option>
          <option value="medium">Medium (20k-50k)</option>
          <option value="high">High (&gt;50k)</option>
        </select>

        <select
          className="dropdown-professional"
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
      <div className="overflow-x-auto rounded-lg shadow-card">
        <table className="table-professional min-w-full">
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
                <tr key={item.NfaNumber} className="hover:bg-accent hover:text-accent-foreground">
                  <td>{item.NfaNumber}</td>
                  <td>
                    <span
                      className={`label-professional ${
                        item.Status === "Approved"
                          ? "label-approved"
                          : item.Status === "Pending"
                          ? "label-pending"
                          : "label-rejected"
                      }`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td>{item.DueDeligenceStatus ? "Yes" : "No"}</td>
                  <td>{calculateTAT(item.createdAt, item.lastModifiedAt)}</td>
                  <td>
                    <span
                      className={`label-professional ${
                        item.RiskCategory === "Low"
                          ? "label-risk-low"
                          : item.RiskCategory === "Medium"
                          ? "label-risk-medium"
                          : "label-risk-high"
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
                <td colSpan={8} className="text-center p-4 text-muted-foreground">
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
