import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

// Buyer Pages
import BuyerHome from "./pages/buyer/BuyerHome";

// Approver Pages
import ApproverHome from "./pages/approver/ApproverHome";
// Admin Pages
import AdminHome from "./pages/admin/AdminHome";
// Vendor Pages
import VendorHome from "./pages/vendor/VendorHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard Landing Page */}
          <Route index element={<Dashboard />} />

          {/* Buyer Routes */}
          <Route path="buyer" element={<BuyerHome />} />

          {/* Approver Routes */}
          <Route path="approver" element={<ApproverHome />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminHome />} />

          {/* Vendor Routes */}
          <Route path="vendor" element={<VendorHome />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
