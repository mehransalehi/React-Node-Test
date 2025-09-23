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
                    <a className="header-desktop__logo-container" href="/">
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
                <div className="header-desktop__right">
                    <div className="user-block">
                        {isLogin ? (
                            <div className="user-block__top">
                                <div className="user-block__border">
                                    <div className="user-block__info">
                                        <span className="user-block__info-icon">
                                            <span className="SVGInline SVG-component__content">
                                                <img src={IconCurrency} />
                                            </span>
                                        </span>
                                        <span className="user-block__text">{userBalance}</span>
                                        <span className="user-block__currency">ARS</span>
                                    </div>
                                </div>
                                <div className="user-block__border">
                                    <div className="user-block__user-wrapper">
                                        <span className="user-block__user-icon" onClick={openMenu}>
                                            <span className="SVGInline SVG-component__content">
                                                <img src={IconProfile} />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="user-block__border">
                                    <div className="user-block__user-wrapper">
                                        <span
                                            className="user-block__user-icon"
                                            onClick={handleLogoutClick}
                                        >
                                            <span className="SVGInline SVG-component__content">
                                                <img src={IconLogout} alt="Logout icon" />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="header-login-block-desktop">
                                <div className="header-login-block-desktop__button">
                                    <button
                                        type="button"
                                        className="button-desktop button-desktop_color_default"
                                        onClick={handleLoginClick}
                                    >
                                        <span className="header-login-block-desktop__button-text">Login</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {showUserMenu && <UserMenu handleLogoutClick={handleLogoutClick} />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;