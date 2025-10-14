import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NfaDetails, NfaVendorData, VendorItems } from "../../data/data";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ComparativeScreen3() {
  const { nfaNumber } = useParams();
  const [nfa, setNfa] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [expandedVendors, setExpandedVendors] = useState(false);
  const [showNfaDetails, setShowNfaDetails] = useState(true);
  const [showAwardedVendor, setShowAwardedVendor] = useState(true);

  // Theme Colors
  const theme = {
    background: "#E4E4E1", // Platinum
    backgroundAlt: "#ECECE9", // Bright Gray
    card: "#FFFFFF",
    primary: "#1D74DE", // Bright Navy Blue
    primaryLight: "#04A4FF", // Vivid Cerulean
    primaryDark: "#304CC0", // Cerulean Blue
    primaryForeground: "#FFFFFF",
    border: "#DAD8D4", // Timberwolf
    borderLight: "#E4E4E1",
    textPrimary: "#1E1E1E",
    textSecondary: "#3B3B3B",
    accent: "#F0F9FF",
    accentForeground: "#1D4ED8"
  };

  useEffect(() => {
    setNfa(NfaDetails.find(n => n.NfaNumber === nfaNumber));
    setVendors(NfaVendorData.filter(v => v.NfaNumber === nfaNumber));
  }, [nfaNumber]);

  if (!nfa) return <div className="p-10 text-center">NFA not found!</div>;

  const uniqueVendors = [...new Map(vendors.map(v => [v.ProposedVendorCode, v])).values()];

  const getRounds = (vendorCode) => {
    const rounds = [...new Set(
      VendorItems.filter(i => i.NfaNumber === nfaNumber && i.ProposedVendorCode === vendorCode)
        .map(i => i.round)
    )];
    return rounds.sort((a, b) => a - b);
  };

  const getVendorItemsByRound = (vendorCode, round) =>
    VendorItems.filter(i => i.NfaNumber === nfaNumber && i.ProposedVendorCode === vendorCode && i.round === round);

  return (
    <div style={{ background: theme.backgroundAlt }} className="p-10 flex flex-col gap-6 min-h-screen">

      {/* NFA Header */}
      <section className="page-section">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowNfaDetails(!showNfaDetails)}
        >
          <h3 style={{ color: theme.primary }} className="text-2xl font-bold mb-4 flex items-center gap-2">
            NFA Details
            {showNfaDetails ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 overflow-hidden ${showNfaDetails ? "max-h-[1000px]" : "max-h-0"}`}>
          {[
            { label: "Project Description", value: nfa.ProjectDescription },
            { label: "Subject of Proposal/Order", value: nfa.SubjectofProposalOROrder },
            { label: "Base Line Spend", value: nfa.BaseLineSpend },
            { label: "Final Proposed Value", value: nfa.FinalProposedValue },
            { label: "RFP Number", value: nfa.RfpNumber },
            { label: "SBU Unit Location", value: nfa.SBUUnitLocation },
            { label: "Status", value: nfa.Status },
          ].map((field, idx) => (
            <div key={idx} style={{ background: theme.card, borderColor: theme.border, boxShadow: `0 4px 12px rgba(0,0,0,0.05)` }} className="p-4 rounded-lg border">
              <p style={{ color: theme.primaryLight, fontWeight: 600 }}>{field.label}</p>
              <p style={{ color: theme.textPrimary }}>{field.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awarded Vendor Table */}
      <section
        className="page-section mt-6"
        style={{
          background: "var(--background)", // Timberwolf / Platinum base
          borderRadius: "0.5rem",
          padding: "1rem",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAwardedVendor(!showAwardedVendor)}
          style={{ marginBottom: "0.5rem" }}
        >
          <h3
            className="section-title mb-2 flex items-center gap-2"
            style={{ color: "var(--primary)" }} // Vivid Cerulean
          >
            Awarded Vendor
            {showAwardedVendor ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
        </div>

        <div
          className={`overflow-x-auto border rounded-lg shadow-md transition-all duration-500 ${showAwardedVendor ? "max-h-[1000px]" : "max-h-0"
            }`}
          style={{
            background: "var(--card)", // Platinum/Bright Gray
            borderColor: "var(--border)"
          }}
        >
          <table className="tableBtn">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-2 text-left">Vendor Name</th>
                <th className="px-4 py-2 text-left">Vendor Code</th>
                <th className="px-4 py-2 text-left">Rounds</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {uniqueVendors
                .filter((v) => v.AwardedVendor)
                .map((v) => {
                  const rounds = getRounds(v.ProposedVendorCode);
                  return (
                    <tr key={v.ProposedVendorCode} className="hover:bg-blue-50">
                      <td className="px-4 py-2">{v.VendorName}</td>
                      <td className="px-4 py-2">{v.ProposedVendorCode}</td>
                      <td className="px-4 py-2">{rounds.join(", ")}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>


      {/* All Vendors Cards */}
      <section className="page-section mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ color: theme.primary }}>All Vendors</h3>
          <button
            className={expandedVendors ? "button-logout" : "button-back"}
            onClick={() => setExpandedVendors(!expandedVendors)}
          >
            {expandedVendors ? "Collapse" : "Expand"}
          </button>

        </div>

        <div className={`grid gap-6 transition-all duration-500 ${expandedVendors ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {uniqueVendors.map(vendor => {
            const rounds = getRounds(vendor.ProposedVendorCode);
            return (
              <div
                key={vendor.ProposedVendorCode}
                style={{ background: theme.card, borderColor: theme.border, boxShadow: `0 4px 12px rgba(0,0,0,0.05)` }}
                className="p-4 rounded-lg border transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p style={{ color: theme.primary }} className="font-semibold"><strong>Vendor Name:</strong> {vendor.VendorName}</p>
                    <p style={{ color: theme.primaryLight }} className="font-semibold mb-4"><strong>Vendor Code:</strong> {vendor.ProposedVendorCode}</p>
                  </div>
                </div>

                {/* Extra fields on expand */}
                <div className={`overflow-hidden transition-all duration-500 ${expandedVendors ? "max-h-[1000px] mb-4" : "max-h-0"}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div style={{ background: theme.accent }} className="p-2 rounded-lg shadow">
                      <p style={{ color: theme.primary }} className="font-semibold">Awarded Vendor</p>
                      <p style={{ color: theme.textPrimary }}>{vendor.AwardedVendor ? "Yes" : "No"}</p>
                    </div>
                    <div style={{ background: theme.accent }} className="p-2 rounded-lg shadow">
                      <p style={{ color: theme.primary }} className="font-semibold">Email</p>
                      <p style={{ color: theme.textPrimary }}>{vendor.Email || "N/A"}</p>
                    </div>
                    <div style={{ background: theme.accent }} className="p-2 rounded-lg shadow">
                      <p style={{ color: theme.primary }} className="font-semibold">Phone</p>
                      <p style={{ color: theme.textPrimary }}>{vendor.Phone || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Rounds tables */}
                <div className={`flex gap-4 transition-all duration-500 pb-2 overflow-x-auto ${expandedVendors ? 'justify-evenly overflow-visible' : ''}`} style={{ marginBottom: '10px' }}>
                  {rounds.map(round => {
                    const items = getVendorItemsByRound(vendor.ProposedVendorCode, round);
                    return (
                      <div
                        key={round}
                        style={{
                          minWidth: expandedVendors ? '350px' : '250px',
                          background: expandedVendors ? theme.backgroundAlt : theme.accent
                        }}
                        className="border p-2 rounded-lg shadow-md transition-all duration-500"
                      >
                        <p style={{ color: theme.primary }} className="text-center font-semibold mb-2">Round {round}</p>
                        <table className="table-auto border w-full text-sm divide-y rounded-md shadow-inner">
                          <thead style={{ background: theme.accent, color: theme.accentForeground }}>
                            <tr>
                              <th className="border px-4 py-2 text-center">Unit Price</th>
                              <th className="border px-4 py-2 text-center">Quantity</th>
                              <th className="border px-4 py-2 text-center">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                                <td className="border px-4 py-2 text-center">{item.UnitPrice}</td>
                                <td className="border px-4 py-2 text-center">{item.Quantity}</td>
                                <td className="border px-4 py-2 text-center">{(item.Quantity * parseFloat(item.UnitPrice || 0)).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
