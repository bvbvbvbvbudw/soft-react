import React, {useEffect, useState} from 'react';
import Layout from "./Layout/Layout";
import SiteBar from "./Components/header/SiteBar";
import AvatarUpload from "./Components/content/AvatarUpload";
import axios from "axios";
import withAuthentication from "./withAuthentication";
import './style/profile.css'

function MyProfile() {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userName, setUserName] = useState('');
    const userId = String(localStorage.getItem('userName'));

    useEffect(() => {
        axios
            .get('2718425.un507148.web.hosting-test.net/api/avatarLoad', {params: {userId}})
            .then(response => {
                setUserName(response.data.user.name);
                const avatarFileName = response.data.avatar;
                const fullAvatarUrl = `2718425.un507148.web.hosting-test.net/api/storage/${avatarFileName}`;
                setAvatarUrl(fullAvatarUrl);
            })
            .catch(error => {
                console.error(error);
            });
    },[userId])
    return (
        <Layout>
            <SiteBar />
            <div className="wrapper-container container">
                <img src={avatarUrl} alt="avatar" />
                <div className="control-avatar">
                    <AvatarUpload />
                    <p>name User: {userName}</p>
                </div>
            </div>
        </Layout>
    );
}
export default withAuthentication(MyProfile)