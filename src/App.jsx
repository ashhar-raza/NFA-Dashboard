import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NfaDetailPage from "./pages/buyer/NfaDetailPage";
import VendorDetailPage from "./pages/buyer/VendorDetailPage";
import Home from "./pages/Home";
import NfaObject from "./pages/NfaObject";
import VendorObject from "./pages/VendorObject";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard Landing Page */}
          <Route index element={<Dashboard />} />

          {/* Buyer Routes */}
          <Route path="buyer" element={<Home />} />
          <Route path="buyer/:nfaNumber" element={<NfaObject />} />
          <Route path="buyer/:nfaNumber/vendor/:vendorCode" element={<VendorObject />} />

          {/* Approver Routes */}
          <Route path="approver" element={<Home />} />
          <Route path="approver/:nfaNumber" element={<NfaObject />} />
          <Route path="approver/:nfaNumber/vendor/:vendorCode" element={<VendorObject />} />

          {/* Admin Routes */}
          <Route path="admin" element={<Home />} />
          <Route path="admin/:nfaNumber" element={<NfaObject />} />
          <Route path="admin/:nfaNumber/vendor/:vendorCode" element={<VendorObject />} />
          {/* Vendor Routes */}
          <Route path="vendor" element={<Home />} />
          <Route path="vendor/:nfaNumber" element={<NfaObject />} />
          <Route path="vendor/:nfaNumber/vendor/:vendorCode" element={<VendorObject />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
