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
    // const userId = String(localStorage.getItem('userName'));

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/avatarLoad?user_id=${localStorage.getItem('userName')}`)
            .then(response => {
                setUserName(response.data.user.name);
                const avatarFileName = response.data.avatar;
                const fullAvatarUrl = `http://127.0.0.1:8000/storage/${avatarFileName}`;
                setAvatarUrl(fullAvatarUrl);
            })
            .catch(error => {
                console.error(error);
            });
    },[])
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