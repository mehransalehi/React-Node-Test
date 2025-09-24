import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Casino from "./pages/Casino";
import LiveCasino from "./pages/LiveCasino";
import Sports from "./pages/Sports";
import Login from "./pages/Login";
import Profile from "./pages/Profile/Profile";
import MobileProfileHistory from "./pages/Profile/MobileProfileHistory";
import MobileProfileChangePassword from "./pages/Profile/ChangePassword";
import Layout from "./components/Layout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/casino" element={<Casino />} />
                <Route path="/live-casino" element={<LiveCasino />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/pay-history" element={<MobileProfileHistory />} />
                <Route path="/profile/change-password" element={<MobileProfileChangePassword />} />
            </Route>
        </Routes>
    );
}