import React, {useState, useEffect} from 'react';
import Logo from '../../images/Logo.png'
import Icon from '../../images/img.png';

import './styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap-v5/lib/Nav';
import Navbar from 'react-bootstrap-v5/lib/Navbar';
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
    const [closedSiteBar, setClosedSiteBar] = useState(false);
    useEffect(() => {
        const sitebar = document.getElementById('sitebar');
        if (sitebar.classList.contains('closed')) {
            sitebar.classList.remove('closed');
        } else {
            sitebar.classList.add('closed');
        }
    }, [closedSiteBar]);
    return (
        <>
            <Navbar bg="white" variant="white" className='header-container'>
                <Nav.Link href=''> <img src={Icon} onClick={() => setClosedSiteBar(!closedSiteBar)} style={{ width: 24, height: 24, marginLeft: 30 }} alt='icon' /></Nav.Link>
                    <Navbar.Brand href=""><img className='logo' src={Logo} alt=""/></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href='/' id="basic-nav-dropdown-1">Головна</Nav.Link>
                        <Nav.Link href='/contacts' id="basic-nav-dropdown-1">Наші контакти</Nav.Link>
                        <Nav.Link href='/about' id="basic-nav-dropdown-1">Про нас</Nav.Link>
                        <Nav.Link href='/support' id="basic-nav-dropdown-1">Для пропозицій та ідей</Nav.Link>
                    </Nav>

                {/*<div className="float-right px-3 d-flex gap-3">*/}
                {/*    {token.length > 30 ? (*/}
                {/*        <>*/}
                {/*            <a className={'btn btn-primary'} href="/profile">Мій профіль</a>*/}
                {/*            <button onClick={handleLogout} className={'btn btn-primary'}>Вийти з аккаунту</button>*/}
                {/*        </>*/}
                {/*    ) : (*/}
                {/*        <>*/}
                {/*            <a className={'btn btn-primary'} href="/auth">Логін</a>*/}
                {/*            <a className={'btn btn-primary'} href="/auth">Реєстрація</a>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</div>*/}
            </Navbar>
        </>
    );
}