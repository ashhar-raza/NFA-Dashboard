// VendorHome.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NfaVendorData } from "../data/data";

export default function VendorHome() {
  const { nfaNumber } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [awardFilter, setAwardFilter] = useState(""); // filter by awarded vendor
  const [roundFilter, setRoundFilter] = useState(""); // filter by round
  console.log(NfaVendorData);


  // Get vendors for the current NFA
  const vendors = useMemo(() => {
    const nfaVendors = NfaVendorData.filter(
      v => v.NfaNumber.toLowerCase() === nfaNumber.toLowerCase()
    );

    const uniqueMap = {};
    nfaVendors.forEach(v => {
      if (!uniqueMap[v.ProposedVendorCode] || uniqueMap[v.ProposedVendorCode].round < v.round) {
        uniqueMap[v.ProposedVendorCode] = v;
      }
    });

    let result = Object.values(uniqueMap);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(v => v.VendorName.toLowerCase().includes(lower));
    }
    if (awardFilter) {
      result = result.filter(v => (awardFilter === "awarded" ? v.AwardedVendor : !v.AwardedVendor));
    }
    if (roundFilter) {
      result = result.filter(v => v.round === Number(roundFilter));
    }

    return result;
  }, [nfaNumber, searchTerm, awardFilter, roundFilter]);

  return (
    <div className="flex flex-col gap-6 px-10 mx-10">

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search Vendor..."
          className="input flex-[0_0_60%]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2 flex-[0_0_40%]">
          <select className="select flex-1" value={awardFilter} onChange={(e) => setAwardFilter(e.target.value)}>
            <option value="">All Vendors</option>
            <option value="awarded">Awarded</option>
            <option value="not-awarded">Not Awarded</option>
          </select>
          <select className="select flex-1" value={roundFilter} onChange={(e) => setRoundFilter(e.target.value)}>
            <option value="">All Rounds</option>
            {[...new Set(NfaVendorData.filter(v => v.NfaNumber === nfaNumber).map(v => v.round))].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Vendor Code</th>
              <th>Vendor Name</th>
              <th>Latest Round</th>
              <th>Final Quote</th>
              <th>Awarded Vendor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vendors.length ? (
              vendors.map(v => (
                <tr
                  key={v.ProposedVendorCode}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`)}
                >
                  <td>{v.ProposedVendorCode}</td>
                  <td>{v.VendorName}</td>
                  <td>{v.round}</td>
                  <td>{v.FinalQuote}</td>
                  <td>{v.AwardedVendor ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="button-back"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`);
                      }}
                    >
                      &gt;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-muted">No vendors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
