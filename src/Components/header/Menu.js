import React, {useState, useEffect} from 'react';
import Logo from '../../images/Logo.png'
import Icon from '../../images/icon-sitebar.png';

import './styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap-v5/lib/Nav';
import Navbar from 'react-bootstrap-v5/lib/Navbar';
import {Container} from "react-bootstrap-v5";
import {NavDropdown} from "react-bootstrap-v5";
import {useNavigate} from "react-router-dom";

export default function Menu() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.setItem('token', null)
        localStorage.setItem('userName', null)
        navigate('/auth')
    };
    const [isLoggedIn, setIsLoggedIn] = useState()
    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn'));
    },[isLoggedIn])

    const [closedSiteBar, setClosedSiteBar] = useState(localStorage.getItem('siteBar'));

    useEffect(() => {
        const sitebar = document.getElementById('sitebar');
        if (sitebar.classList.contains('closed')) {
            sitebar.classList.remove('closed');
            localStorage.setItem("siteBar", false)
        } else {
            sitebar.classList.add('closed');
            localStorage.setItem("siteBar", true)
        }
    }, [closedSiteBar]);
    return (
        <>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href=""><img src={Icon} onClick={() => setClosedSiteBar(!closedSiteBar)} style={{ width: 45, height: 24, marginLeft: 30 }} alt='icon' /> <img className='logo' src={Logo} alt=""/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href='/' id="basic-nav-dropdown-1">Головна</Nav.Link>
                            <Nav.Link href='/contacts' id="basic-nav-dropdown-1">Наші контакти</Nav.Link>
                            <Nav.Link href='/about' id="basic-nav-dropdown-1">Про нас</Nav.Link>
                            <Nav.Link href='/support' id="basic-nav-dropdown-1">Для пропозицій та ідей</Nav.Link>

                            {token ?
                                token.length > 30 ? (
                                    <>
                                        <div className='gap-5'>
                                            <a className={'btn btn-primary'} href="/profile">Мій профіль</a>
                                            <button onClick={handleLogout} className={'btn btn-primary'}>Вийти з аккаунту</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='gap-5'>
                                            <a className={'btn btn-primary'} href="/auth">Увійти</a>
                                            <a className={'btn btn-primary'} href="/auth">Реєстрація</a>
                                        </div>
                                    </>
                                )
                                : "error"}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}