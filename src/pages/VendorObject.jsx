import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NfaVendorData, NfaWorkflowHistory } from "../data/data";

export default function VendorObject() {
    const { vendorCode } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});
    const [workflowSearch, setWorkflowSearch] = useState("");

    const vendor = NfaVendorData.find((v) => v.ProposedVendorCode === vendorCode);
    const workflowHistory = NfaWorkflowHistory.filter((w) => w.NfaNumber === vendor?.NfaNumber);

    useEffect(() => {
        if (vendor) setVendorData(vendor);
    }, [vendor]);

    if (!vendor) return <div className="p-10 text-center">Vendor not found!</div>;

    const handleChange = (key, value) => setVendorData({ ...vendorData, [key]: value });

    // Render single key-value card item (stacked like SAP UI5 Object Page)
    const renderCardItem = (key, value) => (
        <div className="flex flex-col p-4 rounded-lg shadow-lg bg-[var(--card-bg)]">
            <span className="text-[var(--text-muted)] font-semibold">{key}</span>
            {isEdit ? (
                <input
                    type="text"
                    value={value || ""}
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
            {/* Header Top Buttons */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">Vendor Details</h2>
                <div className="flex gap-4">
                    {!isEdit && <button className="button-secondary" onClick={() => setIsEdit(true)}>Edit</button>}
                </div>
            </div>

            {/* Vendor Header Card - SAP UI5 Object Page style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderCardItem("Vendor Name", vendorData.VendorName)}
                {renderCardItem("Original Quote", vendorData.OriginalQuote)}
                {renderCardItem("Final Quote", vendorData.FinalQuote)}
                {renderCardItem("Awarded Vendor", vendorData.AwardedVendor ? "Yes" : "No")}
                {renderCardItem("Contract Period", vendorData.ContractPeriod + " months")}
                {renderCardItem("Contract Value", vendorData.ContractValueBasicValue)}
                {renderCardItem("Budget", vendorData.Budget)}
                {renderCardItem("Delivery Lead Time", vendorData.DeliveryLeadTime)}
            </div>

            {/* Workflow Table */}
            <div className="mt-8">
                <h3 className="font-bold mb-2">Vendor Workflow History</h3>
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
                            {workflowHistory
                                .filter(
                                    (w) =>
                                        w.EmployeeName.toLowerCase().includes(workflowSearch.toLowerCase()) ||
                                        w.Status.toLowerCase().includes(workflowSearch.toLowerCase())
                                )
                                .map((w, i) => (
                                    <tr key={i}>
                                        <td>{w.level}</td>
                                        <td>{w.EmployeeName}</td>
                                        <td>{w.Status}</td>
                                        <td>{w.DaysTaken}</td>
                                        <td>{new Date(w.BeginDateAndTime).toLocaleDateString()}</td>
                                        <td>{new Date(w.EndDateAndTime).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save / Discard Buttons fixed bottom-right */}
            {isEdit && (
                <div className="fixed bottom-6 right-6 flex gap-4">
                    <button className="button-primary" onClick={() => setIsEdit(false)}>Save</button>
                    <button
                        className="button-secondary"
                        onClick={() => {
                            setVendorData(vendor);
                            setIsEdit(false);
                        }}
                    >
                        Discard
                    </button>
                </div>
            )}
        </div>
    );
}
