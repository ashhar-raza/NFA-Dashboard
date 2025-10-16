// VendorObjectPage.jsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    NfaVendorDueDeligenceDetails,
    NfaVendorDueDeligenceDetailsGrade
} from "../data/data";

export default function VendorObjectPage() {
    const { nfaNumber, vendorCode } = useParams();

    // Vendor header
    const vendorData = useMemo(() => {
        return NfaVendorDueDeligenceDetails.find(
            d => d.NfaNumber === nfaNumber && d.ProposedVendorCode === vendorCode
        );
    }, [nfaNumber, vendorCode]);

    // Vendor grades
    const ddGrades = useMemo(() => {
        return NfaVendorDueDeligenceDetailsGrade.filter(
            g => g.NfaNumber === nfaNumber && g.ProposedVendorCode === vendorCode
        );
    }, [nfaNumber, vendorCode]);

    // Metrics for dynamic overview
    const overviewData = useMemo(() => {
        if (!vendorData) return null;

        const highRiskCount = ddGrades.filter(g => g.GradeDescription.toLowerCase().includes("high")).length;
        const totalAuthorizedCapital = Number(vendorData.AuthorizedCapital || 0);
        return {
            riskCategory: vendorData.RiskGrade,
            nfAsSubmitted: 1, // or count if multiple NFA entries exist
            highRiskGrades: highRiskCount,
            authorizedCapital: totalAuthorizedCapital,
            dueDiligenceStatus: vendorData.Description || "No info",
            comments: vendorData.Comments || "-"
        };
    }, [vendorData, ddGrades]);

    const renderHeaderCard = (key, value) => (
        <div className="flex flex-col p-4 rounded-lg shadow-lg card" style={{ backgroundColor: "var(--card)" }}>
            <span className="key font-semibold">{key}</span>
            <span className="value mt-1">{value || "-"}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 px-10 mx-10">

            {/* Vendor Compliance Overview */}
            {overviewData && (
                <section className="page-section">
                    <h3 className="section-title">Vendor Compliance Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderHeaderCard("Risk Category", overviewData.riskCategory)}
                        {renderHeaderCard("NFAs Submitted", overviewData.nfAsSubmitted)}
                        {renderHeaderCard("High-Risk Grades Count", overviewData.highRiskGrades)}
                        {renderHeaderCard("Authorized Capital", overviewData.authorizedCapital)}
                        {renderHeaderCard("Due Diligence Status", overviewData.dueDiligenceStatus)}
                        {renderHeaderCard("Comments", overviewData.comments)}
                    </div>
                </section>
            )}


            {/* Vendor Header Details */}
            <section className="page-section">
                <h3 className="section-title">Vendor Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendorData && Object.entries(vendorData).map(([key, value]) => {
                        if (["ID", "NfaNumber", "ProposedVendorCode", "round"].includes(key)) return null;
                        return renderHeaderCard(key, value);
                    })}
                </div>
            </section>

            {/* Due Diligence Grades */}
            <section className="page-section">
                <h3 className="section-title">Due Diligence Grades</h3>
                <div className="overflow-x-auto">
                    <table className="tableBtn">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Min Score</th>
                                <th>Max Score</th>
                                <th>Grade Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ddGrades.length ? (
                                ddGrades.map((g, idx) => (
                                    <tr key={idx}>
                                        <td>{g.Category}</td>
                                        <td>{g.MinScore}</td>
                                        <td>{g.MaxScore}</td>
                                        <td>
                                            <span
                                                className={`status-${g.GradeDescription.split(" ")[0].toLowerCase()
                                                    } status-badge`}
                                            >
                                                {g.GradeDescription}
                                            </span>
                                        </td>


                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-4 text-muted">
                                        No due diligence grades found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}
