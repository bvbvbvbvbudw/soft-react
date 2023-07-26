// import react and routes
import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
// import components
import Layout from "./Layout/Layout";
import SiteBar from "./Components/header/SiteBar";
// import styles
import './style/Auth.css';

export default function Auth({setIsLoggedIn}) {
    const navigate = useNavigate()
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [correctForms, setCorrectForms] = useState(false);

    const [error, setError] = useState();
    const [errorRegister, setErrorRegister] = useState();
    const [itsError, setItsError] = useState(false)

    const handlerTestAcc = () => {
        setLoginEmail('admin@softui.com');
        setLoginPassword('secret');
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        if (loginEmail && loginPassword) {
            const userData = {
                email: loginEmail,
                password: loginPassword
            };

            axios.post('https://bvbvbvbvbudw-001-site1.atempurl.com/api/login', userData)
                .then(response => {
                    localStorage.setItem('userName', response.data.name)
                    const token = response.data.token;
                    localStorage.setItem('token', token);
                    setIsLoggedIn(true);
                    navigate('/')
                })
                .catch(error => {
                    setError('Неправильний пароль або пошта користувача')
                    console.error(error);
                    setCorrectForms(true)
                });
        } else {
            console.log('Please fill in all fields in the login form');
            setError('Будь ласка, заповніть всі форми які вище')
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

                const response = await axios.get('https://bvbvbvbvbudw-001-site1.atempurl.com/api/csrf-cookie');

                if (response.status === 200) {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': response.data.csrfToken,
                        }
                    };

                    const registerResponse = await axios.post('https://bvbvbvbvbudw-001-site1.atempurl.com/api/register', userData, config);
                    console.log(registerResponse.data);
                    setErrorRegister(registerResponse.data.message);
                }
            } catch (error) {
                setErrorRegister(error.message)
                console.error(error);
                setItsError(true)

            }
        } else {
            setError('Будь ласка, заповніть всі форми які вище')
            console.log('Please fill in all fields in the registration form');
        }
    };

    return (
        <>
            <div className="wrapper-container-auth">
                <Layout>
                    <SiteBar />
                    <div className="container wrapper-auth">
                        <div className="form-container">
                            <h1>Вход</h1>
                            <form onSubmit={handleLoginSubmit} onChange={() => setCorrectForms(false)}>
                                <input id='email-log' type="email" placeholder="Пошта користувача" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="username" />
                                <input id='pass-log' type="password" placeholder="Пароль" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" />
                                <button type="submit">Увійти</button>
                                {!correctForms ? <p style={{color:'red', fontSize:'16px', fontWeight:'bold'}}>{error}</p> : null}
                            </form>
                        </div>
                        <div className="form-container">
                            <h1>Регистрация</h1>
                            <form onSubmit={handleRegisterSubmit}>
                                <input type="text" placeholder="Нік користувача" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required autoComplete="name" />
                                <input type="email" placeholder="Email користувача" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required autoComplete="username" />
                                <input type="password" placeholder="Пароль" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required autoComplete="new-password" />
                                <button type="submit">
                                    Зареєструватися
                                </button>
                            </form>
                            {errorRegister === 'Registration successful' ?
                            <p style={{color:'green', fontSize:'16px', fontWeight:'bold'}}>{errorRegister},будь ласка, увійдіть в свій аккаунт</p> : null}
                            {errorRegister !== 'Registration successful' && itsError ?
                            <p style={{color:'red', fontSize:'16px', fontWeight:'bold'}}>{errorRegister}, можливо, це помилка тому що, такий нік або пошта вже зайнята</p> : null}
                        </div>
                    </div>
                    <div className="container d-flex">
                        <button onClick={handlerTestAcc}>Натисніть сюди, якщо хочете увійти в тестовий аккаунт</button>
                        <p>Після натискання нажміть кнопку "Увійти"</p>
                    </div>
                </Layout>
            </div>
        </>
    );
}