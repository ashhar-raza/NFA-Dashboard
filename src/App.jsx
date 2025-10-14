import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NfaObject from "./pages/NfaObject";
import VendorObject from "./pages/VendorObject";
import ComparativeScreen3 from "./pages/ComparativeScreenPages/ComparativeScreen3";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard Landing Page */}
          <Route index element={<Dashboard />} />

          {/* Buyer Routes */}
          <Route path="buyer" element={<Home role="buyer" />} />
          <Route path="buyer/:nfaNumber" element={<NfaObject role="buyer" />} />
          <Route
            path="buyer/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="buyer" />}
          />

          {/* Approver Routes */}
          <Route path="approver" element={<Home role="approver" />} />
          <Route
            path="approver/:nfaNumber"
            element={<NfaObject role="approver" />}
          />
          <Route
            path="approver/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="approver" />}
          />
          <Route
            path="approver/comparative/:nfaNumber"
            element={<ComparativeScreen3/>}
          />

          {/* Admin Routes */}
          <Route path="admin" element={<Home role="admin" />} />
          <Route path="admin/:nfaNumber" element={<NfaObject role="admin" />} />
          <Route
            path="admin/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="admin" />}
          />

          {/* Vendor Routes */}
          <Route path="vendor" element={<Home role="vendor" />} />
          <Route path="vendor/:nfaNumber" element={<NfaObject role="vendor" />} />
          <Route
            path="vendor/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="vendor" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
