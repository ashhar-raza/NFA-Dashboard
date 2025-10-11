import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NfaDetails, NfaVendorData, NfaWorkflowHistory } from "../data/data";

export default function NfaObject() {
    const { nfaNumber } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [headerData, setHeaderData] = useState({});
    const [vendorSearch, setVendorSearch] = useState("");
    const [workflowSearch, setWorkflowSearch] = useState("");

    const nfa = NfaDetails.find((n) => n.NfaNumber === nfaNumber);
    const vendors = NfaVendorData.filter((v) => v.NfaNumber === nfaNumber)
        .filter((v) => v.VendorName.toLowerCase().includes(vendorSearch.toLowerCase()));
    const workflow = NfaWorkflowHistory.filter((w) => w.NfaNumber === nfaNumber)
        .filter((w) =>
            w.EmployeeName.toLowerCase().includes(workflowSearch.toLowerCase()) ||
            w.Status.toLowerCase().includes(workflowSearch.toLowerCase())
        );

    useEffect(() => {
        if (nfa) setHeaderData(nfa);
    }, [nfa]);

    if (!nfa) return <div className="p-10 text-center">NFA not found!</div>;

    const handleChange = (key, value) => setHeaderData({ ...headerData, [key]: value });

    // Render card item like SAP UI5 Object Page
    const renderHeaderCard = (key, value) => (
        <div className="flex flex-col p-4 rounded-lg shadow-lg bg-[var(--card-bg)]">
            <span className="text-[var(--text-muted)] font-semibold">{key}</span>
            {isEdit ? (
                <input
                    type="text"
                    value={value|| ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="input mt-1 w-full"
                />
            ) : (
                <span className="text-[var(--text-primary)]">{value}</span>
            )}
        </div>
    );

    return (
        <div className="p-10 flex flex-col gap-6 relative min-h-screen">
            {/* Top Buttons */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">NFA Details</h2>
                <div className="flex gap-4">
                    <button className="button-primary">Comparative Statement</button>
                    {!isEdit && <button className="button-secondary" onClick={() => setIsEdit(true)}>Edit</button>}
                </div>
            </div>

            {/* Header Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderHeaderCard("NFA Number", headerData.NfaNumber)}
                {renderHeaderCard("Project", headerData.ProjectDescription)}
                {renderHeaderCard("Status", headerData.Status)}
                {renderHeaderCard("Risk Category", headerData.RiskCategory)}
                {renderHeaderCard("Total Spend", headerData.TotalSpend)}
                {renderHeaderCard("Base Line Spend", headerData.BaseLineSpend)}
                {renderHeaderCard("Final Proposed Value", headerData.FinalProposedValue)}
                {renderHeaderCard("Owner", headerData.Owner)}
            </div>

            {/* Vendor Table */}
            <div className="mt-6">
                <h3 className="font-bold mb-2">Vendors</h3>
                <input
                    type="text"
                    placeholder="Search Vendor..."
                    className="input mb-2"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                />
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Original Quote</th>
                                <th>Final Quote</th>
                                <th>Awarded Vendor</th>
                                <th>Contract Period</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.length ? vendors.map((v) => (
                                <tr key={v.ProposedVendorCode}>
                                    <td>{v.VendorName}</td>
                                    <td>{v.OriginalQuote}</td>
                                    <td>{v.FinalQuote}</td>
                                    <td>{v.AwardedVendor ? "Yes" : "No"}</td>
                                    <td>{v.ContractPeriod} months</td>
                                    <td>
                                        <button
                                            className="button-back"
                                            onClick={() => {
                                                console.log(window.location.pathname.split("/"));
                                                navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`);
                                            }
                                            }
                                        >
                                            &gt;
                                        </button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={6} className="text-center p-4 text-muted">No vendors found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Workflow Table */}
            <div className="mt-6">
                <h3 className="font-bold mb-2">Workflow History</h3>
                <input
                    type="text"
                    placeholder="Search Workflow..."
                    className="input mb-2"
                    value={workflowSearch}
                    onChange={(e) => setWorkflowSearch(e.target.value)}
                />
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th>Employee Name</th>
                                <th>Status</th>
                                <th>Days Taken</th>
                                <th>Begin Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workflow.length ? workflow.map((w, i) => (
                                <tr key={i}>
                                    <td>{w.level}</td>
                                    <td>{w.EmployeeName}</td>
                                    <td>{w.Status}</td>
                                    <td>{w.DaysTaken}</td>
                                    <td>{new Date(w.BeginDateAndTime).toLocaleString()}</td>
                                    <td>{new Date(w.EndDateAndTime).toLocaleString()}</td>
                                </tr>
                            )) : <tr><td colSpan={6} className="text-center p-4 text-muted">No workflow found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save / Discard Buttons */}
            {isEdit && (
                <div className="fixed bottom-6 right-6 flex gap-4">
                    <button className="button-primary" onClick={() => setIsEdit(false)}>Save</button>
                    <button className="button-secondary" onClick={() => { setHeaderData(nfa); setIsEdit(false); }}>Discard</button>
                </div>
            )}
        </div>
    );
}
