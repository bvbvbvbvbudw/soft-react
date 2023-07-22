import React, {useEffect} from 'react';
import Layout from "./Layout/Layout";
import SiteBar from "./Components/header/SiteBar";
import './style/backlog.css';
import withAuthentication from "./withAuthentication";
import AccordionBacklog from "./Components/content/AccordionBacklog";

function BackLog() {
    useEffect(() => {
        const sitebar = document.getElementById('sitebar');
        const mainPage = document.getElementById('wrapper-backlog');
        const handleSitebarToggle = () => {
            if (sitebar.classList.contains('closed')) {
                mainPage.classList.remove('maxSize');
            } else {
                mainPage.classList.add('maxSize')
            }
        };
        handleSitebarToggle();
        sitebar.addEventListener('transitionend', handleSitebarToggle);
        return () => {
            sitebar.removeEventListener('transitionend', handleSitebarToggle)
        };
    }, []);
    return (<>
        <Layout>
            <SiteBar/>
            <div className="container-backlog" id='wrapper-backlog'>
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
                    </div>
                    <div className='search-container-backlog'>
                        <div className="search-container-left">
                            <input type="text"/>
                        </div>
                    </div>
                </div>
                <div className="container-backlog-accordion">
                    <div className="content-table">
                        <AccordionBacklog/>
                    </div>
                </div>
            </div>
        </Layout>
    </>)
}
export default withAuthentication(BackLog)