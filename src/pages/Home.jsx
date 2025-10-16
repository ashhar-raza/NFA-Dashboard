import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NfaDetails } from "../data/data";

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [totalSpendFilter, setTotalSpendFilter] = useState("");
  const [rfpDateFilter, setRfpDateFilter] = useState("");

  const calculateTAT = (createdAt, lastModifiedAt) => {
    const created = new Date(createdAt);
    const modified = new Date(lastModifiedAt);
    const diffTime = Math.abs(modified - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredData = useMemo(() => {
    return NfaDetails.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.NfaNumber.toLowerCase().includes(searchLower) ||
        item.ProjectDescription.toLowerCase().includes(searchLower) ||
        item.Status?.toLowerCase().includes(searchLower) ||
        item.RiskCategory?.toLowerCase().includes(searchLower);

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
    <div className="flex flex-col gap-6 px-10 mx-10">
      {/* Filters: 60% search, 40% filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search..."
          className="input flex-[0_0_60%]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2 flex-[0_0_40%]">
          <select className="select flex-1" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="">All Risks</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select className="select flex-1" value={totalSpendFilter} onChange={(e) => setTotalSpendFilter(e.target.value)}>
            <option value="">All Spend</option>
            <option value="low">Low (&lt;20k)</option>
            <option value="medium">Medium (20k-50k)</option>
            <option value="high">High (&gt;50k)</option>
          </select>
          <select className="select flex-1" value={rfpDateFilter} onChange={(e) => setRfpDateFilter(e.target.value)}>
            <option value="">All Years</option>
            {[...new Set(NfaDetails.map((d) => new Date(d.RfpPublishDate).getFullYear()))].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>NFA Number</th>
              <th>Status</th>
              <th>Vendor Due Diligence</th>
              <th>Average TAT</th>
              <th>Risk Category</th>
              <th>Total Spend</th>
              <th>Project Description</th>
              <th>RFP Publish Year</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((item) => (
                <tr
                  key={item.NfaNumber}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`${window.location.pathname}/${item.NfaNumber}`)} // row click navigation
                >
                  <td>{item.NfaNumber}</td>
                  <td><span className={`status-${item.Status.toLowerCase()} status-badge`}>{item.Status}</span></td>
                  <td>{item.DueDeligenceStatus ? "Yes" : "No"}</td>
                  <td>{calculateTAT(item.createdAt, item.lastModifiedAt)}</td>
                  <td><span className={`risk-${item.RiskCategory.toLowerCase()}`}>{item.RiskCategory}</span></td>
                  <td>{item.TotalSpend}</td>
                  <td>{item.ProjectDescription}</td>
                  <td>{new Date(item.RfpPublishDate).getFullYear()}</td>
                  <td>
                    <button
                      className="button-back"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row click when button is clicked
                        navigate(`${window.location.pathname}/${item.NfaNumber}`)
                      }}
                    >
                      &gt;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4 text-muted">No records found.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div >
  );
}
