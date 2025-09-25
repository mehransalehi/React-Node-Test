import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
import NavLinkHeader from "../components/NavLinkHeader";
import LoginModal from "./LoginModal";
import LogoutConfirmModal from "./LogoutConfirmModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { NavigationContext } from "./NavigationContext";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.isLogin);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [fragmentNavLinksTop, setFragmentNavLinksTop] = useState(<></>);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const isSportsPage = location.pathname === "/sports";

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const refreshBalance = () => {
        setUserBalance("");
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        setUserBalance(result && result.balance);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {

    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
            setFragmentNavLinksTop(
                <>
                    <NavLinkHeader
                        title="Home"
                        pageCode="home"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino"
                        pageCode="casino"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Live Casino"
                        pageCode="live-casino"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Sport"
                        pageCode="sports"
                        icon=""
                    />
                </>
            );
        } else {
            setIsSlotsOnly("true");
            setFragmentNavLinksTop(
                <>
                    <NavLinkHeader
                        title="Home"
                        pageCode="home"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino"
                        pageCode="casino"
                        icon=""
                    />
                </>
            );
        }
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setIsLogin(true);
        refreshBalance();
        setShowLoginModal(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleChangePasswordClick = () => {
        setShowChangePasswordModal(true);
    };

    const handleLogoutConfirm = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            } else {
                setShowLogoutModal(false);
            }
        }, null);
    };

    const handleChangePasswordConfirm = () => {
        setShowLogoutModal(false);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        handleLoginClick,
        handleLogoutClick,
        handleChangePasswordClick,
        refreshBalance
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ fragmentNavLinksTop, selectedPage, setSelectedPage, getPage }}
            >
                <>
                    {showLoginModal && (
                        <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onConfirm={handleLoginConfirm}
                        />
                    )}
                    {showLogoutModal && (
                        <LogoutConfirmModal 
                            onConfirm={handleLogoutConfirm}
                            onClose={() => setShowLogoutModal(false)}
                        />
                    )}
                    {showChangePasswordModal && (
                        <ChangePasswordModal 
                            onConfirm={handleChangePasswordConfirm} 
                            onClose={() => setShowChangePasswordModal(false)}
                        />
                    )}
                    <>
                        <Header
                            isLogin={isLogin}
                            userBalance={userBalance}
                            handleLoginClick={handleLoginClick}
                            handleLogoutClick={handleLogoutClick}
                            handleChangePasswordClick={handleChangePasswordClick}
                            fragmentNavLinksTop={fragmentNavLinksTop}
                            isSlotsOnly={isSlotsOnly}
                        />
                        <main className="app__main">
                            <Outlet />
                        </main>
                        {
                            isMobile && !isSportsPage ? <Footer isSlotsOnly={isSlotsOnly} isSportsPage={isSportsPage} /> :
                                !isMobile ? <Footer isSlotsOnly={isSlotsOnly} isSportsPage={isSportsPage} /> : <></>
                        }
                    </>
                </>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;