import React, { useState } from 'react';
import Layout from "./Layout/Layout";
import SiteBar from "./Components/header/SiteBar";
import './style/Auth.css';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function Auth({ isLoggedIn, setIsLoggedIn, setIsAdmin }) {
    const navigate = useNavigate()
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [correctForms, setCorrectForms] = useState(false);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (loginEmail && loginPassword) {
            const userData = {
                email: loginEmail,
                password: loginPassword
            };

            axios.post('http://2718425.un507148.web.hosting-test.net/api/login', userData)
                .then(response => {
                    localStorage.setItem('userName', response.data.name)
                    const token = response.data.token;
                    localStorage.setItem('token', token);
                    setIsLoggedIn(true);
                    navigate('/')
                })
                .catch(error => {
                    console.error(error);
                    setCorrectForms(true)
                });
        } else {
            console.log('Please fill in all fields in the login form');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (registerEmail && registerPassword && typeof registerName === "string" && registerPassword.length >= 8) {
            try {
                console.log('Registration form is valid');
                const userData = {
                    name: registerName,
                    email: registerEmail,
                    password: registerPassword,
                };

                const response = await axios.get('http://2718425.un507148.web.hosting-test.net/api/csrf-cookie');

                if (response.status === 200) {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': response.data.csrfToken,
                        }
                    };

                    const registerResponse = await axios.post('http://2718425.un507148.web.hosting-test.net/api/register', userData, config);
                    console.log(registerResponse.data);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Please fill in all fields in the registration form');
        }
    };

    return (
        <>
            <div className="wrapper-container-auth">
                <Layout>
                    <SiteBar />
                    <div className="container">
                        <div className="form-container">
                            <h1>Вход</h1>
                            <form onSubmit={handleLoginSubmit} onChange={() => setCorrectForms(false)}>
                                <input type="email" placeholder="Email пользователя" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="username" />
                                <input type="password" placeholder="Пароль" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" />
                                <button type="submit">Войти</button>
                                {correctForms ? <p>error</p> : null}
                            </form>
                        </div>
                        <div className="form-container">
                            <h1>Регистрация</h1>
                            <form onSubmit={handleRegisterSubmit}>
                                <input type="text" placeholder="name пользователя" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required autoComplete="name" />
                                <input type="email" placeholder="Email пользователя" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required autoComplete="username" />
                                <input type="password" placeholder="Пароль" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required autoComplete="new-password" />
                                <button type="submit">
                                    Зарегистрироваться
                                </button>
                            </form>
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    );
}
