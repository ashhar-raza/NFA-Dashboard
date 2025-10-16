import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NfaDetails, NfaVendorData, NfaWorkflowHistory } from "../data/data";
import { FileText } from "lucide-react"; // PDF icon

export default function NfaObject({ role }) {
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

    const [attachments, setAttachments] = useState([]);

    // Handler for file upload
    const handleAttachmentUpload = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toLocaleString(), // store uploaded date
        }));
        setAttachments((prev) => [...prev, ...newAttachments]);
    };


    useEffect(() => {
        if (nfa) setHeaderData(nfa);
    }, [nfa]);

    if (!nfa) return <div className="p-10 text-center">NFA not found!</div>;

    const handleChange = (key, value) => setHeaderData({ ...headerData, [key]: value });

    // Render card item like SAP UI5 Object Page
    const renderHeaderCard = (key, value) => (
        <div
            className="flex flex-col p-4 rounded-lg shadow-lg card"
            style={{ backgroundColor: "var(--card)" }}
        >
            <span className="key">{key}</span>
            {isEdit ? (
                <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                />
            ) : (
                <span className="value">{value}</span>
            )}
        </div>
    );

    // Approver button handlers
    const handleClarification = () => alert("Need for Clarification clicked");
    const handleApprove = () => alert("Approve clicked");
    const handleReject = () => alert("Reject clicked");

    return (
        <div className="p-10 flex flex-col gap-6 relative min-h-screen">

            {/* Top Buttons */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">NFA Details</h3>
                <div className="flex gap-4">
                    {/* Comparative button */}
                    {(role === "approver") && !isEdit && (
                        <button className="button-primary button-comparative" onClick={() => {
                            navigate(`/approver/comparative/${nfaNumber}`)
                        }}>Comparative Statement</button>
                    )}
                    {/* Edit button */}
                    {(role === "buyer") && !isEdit && (
                        <button className="button-secondary button-edit" onClick={() => setIsEdit(true)}>Edit</button>
                    )}
                </div>
            </div>

            {/* Header Section */}
            <section className="page-section">
                <h3 className="section-title">NFA Details</h3>
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
            </section>

            {/* Vendor Table Section */}
            <section className="page-section">
                <h3 className="section-title">Vendors</h3>
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
                                <tr
                                    key={v.ProposedVendorCode}
                                    className="cursor-pointer hover:bg-gray-100" // optional hover effect
                                    onClick={() => navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`)}
                                >
                                    <td>{v.VendorName}</td>
                                    <td>{v.OriginalQuote}</td>
                                    <td>{v.FinalQuote}</td>
                                    <td>{v.AwardedVendor ? "Yes" : "No"}</td>
                                    <td>{v.ContractPeriod} months</td>
                                    <td>
                                        <button
                                            className="button-back"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent triggering row click
                                                navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`);
                                            }}
                                        >
                                            &gt;
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center p-4 text-muted">No vendors found.</td></tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </section>

            {/* Attachment Section */}
            <section className="page-section">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="section-title">Attachments</h3>

                    {/* Show Upload button only in edit mode */}
                    {isEdit && (
                        <label className="button-primary cursor-pointer">
                            Upload
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleAttachmentUpload}
                            />
                        </label>
                    )}
                </div>


                <div className="attachment-container">
                    {attachments.length ? (
                        attachments.map((att, i) => (
                            <div
                                key={i}
                                className="attachment-row flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
                                onClick={() => window.open(att.url, "_blank")}
                            >
                                {/* Icon */}
                                <div className="text-red-500 mt-1">
                                    <FileText size={28} />
                                </div>

                                {/* Text Details */}
                                <div className="flex flex-col">
                                    <span className="attachment-name font-medium text-gray-800">
                                        {att.name}
                                    </span>
                                    <span className="attachment-date text-sm text-gray-500">
                                        {att.uploadedAt}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="attachment-row text-center text-gray-400 py-3">
                            No attachments uploaded.
                        </div>
                    )}
                </div>
            </section>




            {/* Workflow Table Section */}
            <section className="page-section">
                <h3 className="section-title">Workflow History</h3>
                <input
                    type="text"
                    placeholder="Search Workflow..."
                    className="input mb-2"
                    value={workflowSearch}
                    onChange={(e) => setWorkflowSearch(e.target.value)}
                />
                <div className="overflow-x-auto">
                    <table className="tableBtn">
                        <thead>
                            <tr >
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
            </section>

            {/* Bottom Buttons */}
            {isEdit && (
                <div className="fixed bottom-6 right-6 flex gap-4">
                    <button className="button-primary button-save" onClick={() => setIsEdit(false)}>Save</button>
                    <button className="button-secondary button-discard" onClick={() => { setHeaderData(nfa); setIsEdit(false); }}>Discard</button>
                </div>
            )}

            {role === "approver" && !isEdit && (
                <section >
                    <div className=" flex gap-4 items-end justify-end">
                        <button className="button-secondary button-clarification" onClick={handleClarification}>Need for Clarification</button>
                        <button className="button-primary button-save" onClick={handleApprove}>Approve</button>
                        <button className="button-destructive button-logout" onClick={handleReject}>Reject</button>
                    </div>
                </section>
            )}
        </div>
    );
}
