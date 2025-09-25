import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import UserInfo from "./UserInfo";
import BonusProgram from "./BonusProgram";
import Promocode from "./Promocode";
import ChangePassword from "./ChangePassword";
import PayHistory from "./PayHistory";
import IconChevronLeft from "/src/assets/svg/chevron-left.svg";
import IconBell from "/src/assets/svg/bell.svg";
import IconHistory from "/src/assets/svg/history.svg";
import IconWhiteLock from "/src/assets/svg/white-lock.svg";

const Profile = () => {
    const navigate = useNavigate();
    const { contextData } = useContext(AppContext);

    const logout = () => {
        callApi(contextData, "POST", "/logout", callbackLogout, null);
    };

    const callbackLogout = () => {
        localStorage.removeItem("session");
        window.location.href = "/";
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    return (
        <>
            <div class="me-content_meContent">
                <h2 class="me-content_title">My Data</h2>
                <p class="me-content_subTitle">Personal Data</p>
                <div class="me-content_meContentInner">
                    <div class="me-content_contentTextCard">
                        <p class="me-content_contentTextCardTitle">User ID</p>
                        <p class="me-content_contentTextCardText">{contextData?.session?.user?.id || '******'}</p>
                    </div>
                    <div class="me-content_separator"></div>
                    <div class="me-content_contentTextCard">
                        <p class="me-content_contentTextCardTitle">User</p>
                        <p class="me-content_contentTextCardText">{contextData?.session?.user?.name || 'Guest'}</p>
                    </div>
                    <div class="me-content_separator"></div>
                    <div class="me-content_contentTextCard">
                        <p class="me-content_contentTextCardTitle">Mail</p>
                        <p class="me-content_contentTextCardText">{contextData?.session?.user?.email || ''}</p>
                    </div>
                    <div class="me-content_separator"></div>
                    <div class="me-content_contentTextCard">
                        <p class="me-content_contentTextCardTitle">Currency</p>
                        <p class="me-content_contentTextCardText">ARS</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;