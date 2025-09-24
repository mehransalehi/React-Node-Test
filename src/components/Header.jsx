import { useState } from "react";
import UserMenu from "../components/UserMenu";
import NavLinkHeader from "../components/NavLinkHeader";
import ImgLogo from "/src/assets/img/logo.png";
import IconCurrency from "/src/assets/svg/currency.svg";
import IconProfile from "/src/assets/svg/profile.svg";
import IconLogout from "/src/assets/svg/logout.svg";

const Header = ({ isLogin, userBalance, handleLoginClick, handleLogoutClick, fragmentNavLinksTop, isSlotsOnly }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const openMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <header className="header_header">
            <div className="header_headerInner">
                <div className="header_headerLeftContent">
                    <a href="/">
                        <img
                            title="Casino"
                            alt="Casino"
                            src={ImgLogo}
                            className="logo-domain"
                        />
                    </a>
                </div>
                <div className="header_headerLinks">
                    {
                        isLogin ? fragmentNavLinksTop :
                        <>
                            {
                                isSlotsOnly === "" ?
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
                                        pageCode="casinolive"
                                        icon=""
                                    />
                                    <NavLinkHeader
                                        title="Sport"
                                        pageCode="sports"
                                        icon=""
                                    />
                                </> : isSlotsOnly === "false" ?
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
                                        pageCode="casinolive"
                                        icon=""
                                    />
                                    <NavLinkHeader
                                        title="Sport"
                                        pageCode="sports"
                                        icon=""
                                    />
                                </> :
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
                            }
                        </>
                    }
                </div>
                <div className="header-right_headerRight">
                    <div className="header-right_headerBalance">{userBalance}</div>
                    {isLogin ? (
                        <div class="header-right_headerRightUser">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                <path fill="#fff" d="M10 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 12.5c5.525 0 10 2.238 10 5V20H0v-2.5c0-2.762 4.475-5 10-5"></path>
                            </svg>
                            <span class="header-right_unreadNotificationCounter">
                                <div class="notifications-counter_notificationsCounter header-right_unreadCounter notifications-counter_sm">
                                    <span class="notifications-counter_notificationCounter">1</span>
                                </div>
                            </span>
                        </div>
                    ) : (
                        <div className="header-right_headerRight">
                            <div className="header-right_headerBalance"></div>
                            <div className="header-right_guestRightMenu">
                                <button className="button_button button_zeusPrimary button_xs" onClick={() => handleLoginClick()}>Login</button>
                                <button className="button_button button_ghost button_md header-right_burgerButton hidden md:flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 25 25">
                                        <path fill="#fff" d="M3.019 18.582v-2h18v2zm0-5v-2h18v2zm0-5v-2h18v2z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                    {showUserMenu && <UserMenu handleLogoutClick={handleLogoutClick} />}
                </div>
            </div>
        </header>
    );
};

export default Header;