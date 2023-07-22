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

    const [closedSiteBar, setClosedSiteBar] = useState(false);

    useEffect(() => {
        const sitebar = document.getElementById('sitebar');
        const roadMap = document.getElementById('roadMap')
        const board = document.getElementById('board')
        const backlog = document.getElementById('backlog')
        if (closedSiteBar) {
            sitebar.classList.add('closed');
        } else {
            sitebar.classList.remove('closed');
        }
        if(window.location.pathname === '/backlog'){
            roadMap.classList.remove('active-sitebar');
            board.classList.remove('active-sitebar');
            backlog.classList.add('active-sitebar');
        }
        if(window.location.pathname === '/board'){
            roadMap.classList.remove('active-sitebar')
            backlog.classList.remove('active-sitebar');
            board.classList.add('active-sitebar');
        }
        if(window.location.pathname === '/project'){
            board.classList.remove('active-sitebar')
            backlog.classList.remove('active-sitebar');
            roadMap.classList.add('active-sitebar')
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
                <button className='btn-close-sitebar' onClick={() => setClosedSiteBar(!closedSiteBar)} >&#8249;</button>
            </div>

            <div className="container-planning">
                <p className='title'>Planning</p>
                <a href='/project' id='roadMap'><span><img src={RoadMap} alt=""/></span>Всі доступні проекти</a>
                <a href='/backlog' id='backlog'><span><img src={BackLog} alt=""/></span>Мої завдання</a>
                <a href='/board' id='board'><span><img src={Board} alt=""/></span>Дошка</a>
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