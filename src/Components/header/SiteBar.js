 import React, {useEffect, useState} from 'react';

//styles
 import '../../style/sitebar.css';

// icons
 import LogoProject from '../../images/wallet.png';
 import RoadMap from '../../images/roadmapicon.png';
 import BackLog from '../../images/backlogicon.png';
 import Board from '../../images/Board.png';
 import CodeIcon from '../../images/CodeIcon.png';
 import ProjectPages from '../../images/project-pages.png';
 import ShortCut from '../../images/shortcut.png';
 import Settings from '../../images/settings.png';

export default function SiteBar(){

    const [closedSiteBar, setClosedSiteBar] = useState(
        localStorage.getItem('siteBar') === 'true' // Convert the string to a boolean
    );

    // Toggle the sidebar state when the close button is clicked
    const handleToggleSidebar = () => {
        setClosedSiteBar(!closedSiteBar);
    };

    useEffect(() => {
        // Get the sidebar element and the navigation links
        const sitebar = document.getElementById('sitebar');
        const roadMap = document.getElementById('roadMap');
        const board = document.getElementById('board');
        const backlog = document.getElementById('backlog');

        // Toggle the sidebar classes based on the 'closedSiteBar' state
        if (closedSiteBar) {
            sitebar.classList.add('closed');
        } else {
            sitebar.classList.remove('closed');
        }

        // Set the 'closedSiteBar' state in local storage
        localStorage.setItem('siteBar', closedSiteBar);

        // Add or remove the 'active-sitebar' class to the navigation links based on the current pathname
        if (window.location.pathname === '/backlog') {
            roadMap.classList.remove('active-sitebar');
            board.classList.remove('active-sitebar');
            backlog.classList.add('active-sitebar');
        } else if (window.location.pathname === '/board') {
            roadMap.classList.remove('active-sitebar');
            backlog.classList.remove('active-sitebar');
            board.classList.add('active-sitebar');
        } else if (window.location.pathname === '/project') {
            board.classList.remove('active-sitebar');
            backlog.classList.remove('active-sitebar');
            roadMap.classList.add('active-sitebar');
        }
    }, [closedSiteBar]);


    return(<>

        <div className={`container-sitebar ${closedSiteBar ? 'closed' : ''}`} id='sitebar'>
            <div className="description-and-button">
                <div className="current-project">
                    <img className='logo-project' src={LogoProject} alt=""/>
                    <p className='project-name'>Project Name This</p>
                    <p className='role'>Software project</p>
                </div>
                <button className='btn-close-sitebar' onClick={handleToggleSidebar}>
                    &#8249;
                </button>
            </div>

            <div className="container-planning">
                <p className='title'>Planning</p>
                <a className='control-link' href='/project' id='roadMap'><span><img src={RoadMap} alt=""/></span>Всі доступні проекти</a>
                <a className='control-link' href='/backlog' id='backlog'><span><img src={BackLog} alt=""/></span>Мої завдання</a>
                <a className='control-link' href='/board' id='board'><span><img src={Board} alt=""/></span>Дошка</a>
            </div>

            <div className="container-development">
                <p className='title'>Development</p>
                <p><span><img src={CodeIcon} alt=""/></span>Code</p>
            </div>
            <hr/>
            <div className="control-button">
                <p><span><img src={ProjectPages} alt=""/></span>Project pages</p>
                <p><span><img src={ShortCut} alt=""/></span>Add shortcut</p>
                <p><span><img src={Settings} alt=""/></span>Project settings</p>
            </div>
        </div>

    </>)
}