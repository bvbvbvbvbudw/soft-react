import React, {useEffect} from "react";
import Button from 'react-bootstrap-v5/lib/Button';
import Modal from 'react-bootstrap-v5/lib/Modal';
import Layout from "./Layout/Layout";
import SiteBar from "./Components/header/SiteBar";

import './style/board.css';
import BoardTable from "./BoardTable";
import Table from "./Components/Table";
import withAuthentication from "./withAuthentication";

function Board() {
    const [modalShow, setModalShow] = React.useState(false);
    useEffect(() => {
        const sitebar = document.getElementById('sitebar');
        const mainPage = document.getElementById('board-wrapper');
        const handleSitebarToggle = () => {
            if (sitebar.classList.contains('closed')) {
                mainPage.classList.remove('maxSize');
            } else {
                mainPage.classList.add('maxSize')
            }
        };
        handleSitebarToggle();
        sitebar.addEventListener('transitionend', handleSitebarToggle);
        return () => { sitebar.removeEventListener('transitionend', handleSitebarToggle) };
    }, []);
    return (
        <>
            <Layout>
                <SiteBar />
                <div className="wrapper-board" id='board-wrapper'>
                    <div className="header-container-backlog">
                        <div className="breadcrumb-container">
                            <div className="breadcrumb-title">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">Library</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Data</li>
                                </ol>
                                <p className='title-backlog'>Backlog</p>
                            </div>
                            <button className='more-btn-header'>...</button>
                        </div>
                        <div className='search-container-backlog'>
                            <div className="search-container-left">
                                <input type="text"/>
                                <div className='images-users'>
                                    <img src="" alt=""/>
                                    <img src="" alt=""/>
                                    <img src="" alt=""/>
                                    <button className='add-new-user'>+</button>
                                </div>
                                <select name="" id="" defaultValue='default'>
                                    <option value="default">Epic</option>
                                    <option value="">No epic</option>
                                    <option value="">EPICCCCCCC</option>
                                </select>
                            </div>
                            <button className='insights'><img src="" alt=""/>Insights</button>
                        </div>
                    </div>

                    <div className="board-content">
                        <Table/>
                    </div>
                </div>
            </Layout>

        </>
    );
}
export default withAuthentication(Board)