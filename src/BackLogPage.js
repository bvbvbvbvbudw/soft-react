import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

import Layout from "./Layout/Layout";
import SiteBar from "./Components/header/SiteBar";
import ModalWindow from "./Components/content/ModalWindow";
import ModalWindowUser from "./Components/content/ModalWindowUser";
import ModalCreateTask from "./Components/content/ModalCreateTask";
import withAuthentication from "./withAuthentication";
import Loading from "./Components/Loading";

import avatarDefault from './images/avatar/default.svg';

import './style/backlog.css';

const BackLogPage = () => {
    const navigate = useNavigate();
    const {projectId} = useParams();

    const [comments, setComments] = useState([]);

    const [tasks, setTasks] = useState([]);
    const [avatars, setAvatars] = useState([])
    const [showAvatars, setShowAvatars] = useState([]);
    const [assignedUser, setAssignedUser] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [nameProject, setNameProject] = useState(localStorage.getItem('currentProject'))
    const [currentUserRole, setCurrentUserRole] = useState();
    const [foundUser, setFoundUser] = useState();
    const [loading, setLoading] = useState(true);
    const [finishValuesUpdate, setFinishValuesUpdate] = useState(false);
    const [valuesSelect, setValuesSelect] = useState({
        todo: null, done: null, testing: null
    })

    const choiseSelect = (event) => {
        const tables = document.querySelectorAll('.content-table-project');
        const paragraphs = document.querySelectorAll('.name-table');
        tables.forEach((table, index) => {
            table.addEventListener('click', function () {
                if (event.target.value === '1') {
                    paragraphs[index].classList.add('done-work')
                } else {
                    paragraphs[index].classList.remove('done-work')
                }
            });
        });
        if (event.target.value === '1') {
            event.target.classList.remove('active-second', 'active-third');
            event.target.classList.add('active-first');
        } else if (event.target.value === '2') {
            event.target.classList.remove('active-first', 'active-third');
            event.target.classList.add('active-second');
        } else if (event.target.value === '3') {
            event.target.classList.remove('active-first', 'active-second');
            event.target.classList.add('active-third');
        }
    }

    useEffect(() => {
        const handleSitebarToggle = () => {
            const sitebar = document.getElementById('sitebar');
            const mainPage = document.getElementById('wrapper-backlog');
            if (sitebar.classList.contains('closed')) {
                mainPage.classList.remove('maxSize');
            } else {
                mainPage.classList.add('maxSize')
            }
        };
        handleSitebarToggle();
        const sitebar = document.getElementById('sitebar');
        sitebar.addEventListener('transitionend', handleSitebarToggle);
        return () => {
            sitebar.removeEventListener('transitionend', handleSitebarToggle)
        };
    }, []);
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [tasksResponse, projectResponse] = await axios.all([
                    axios.get(`http://127.0.0.1:8000/api/currentTask?project_id=${projectId}`),
                    axios.get(`http://127.0.0.1:8000/api/projectadduser?project_id=${projectId}&user_id=${encodeURIComponent(localStorage.getItem('userName'))}`)
                ]);

                // Set tasks first
                setTasks(tasksResponse.data.response.tasks.data);
                setTimeout(() => {
                    handlerCount();

                },100)

                // Use the updated tasks state
                const updatedTasks = tasksResponse.data.response.tasks.data;

                // Use a Promise to ensure setComments is called after setTasks
                await new Promise(resolve => setTimeout(resolve, 0));

                // Update comments based on the updated tasks state
                updatedTasks.forEach(task => {
                    setComments(prevComments => prevComments.concat({ id: task.id, comments: task.comments }));
                });

                // Set other state values
                setAvatars(projectResponse.data.response.comments.data);
                setCurrentUserRole(projectResponse.data.response.comments.roles[0].access_level);
                setLoading(false);
                formatTaskName(nameProject);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        Promise.all(avatars.map(avatar => {
            return axios.get(`http://127.0.0.1:8000/api/avatarLoad?user_id=${avatar.id}`);
        }))
            .then(responses => {
                const avatarsData = responses.map(response => response.data);
                const foundUser = avatarsData.find((item) => Number(item.user_id) === Number(localStorage.getItem('userName')));
                setFoundUser(foundUser)
                setAssignedUser(avatarsData)
                setShowAvatars(avatarsData);
            })
            .catch(error => console.error(error));
    }, [avatars, setShowAvatars]);
    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         handlerCount();
    //     }, 1000);
    //
    //     return () => clearTimeout(timeout);
    // }, []);

    const handlerCount = () => {
        const selects = Array.from(document.querySelectorAll('.select-progress'));
        const updatedValues = { todo: 0, testing: 0, done: 0 };

        selects.forEach(select => {
            if (select.value === "3") {
                updatedValues.todo++;
            } else if (select.value === "2") {
                updatedValues.testing++;
            } else if (select.value === "1") {
                updatedValues.done++;
            }
        });
        setValuesSelect(updatedValues);
        setFinishValuesUpdate(true);
    };

    const deleteTaskHandler = (id) => {
        axios.post(`http://127.0.0.1:8000/api/task?deleteId=${id}`)
            .then(response => {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            })
            .catch(error => console.error(error));
    }
    const deleteProjectHandler = (project) => {
        axios.post(`http://127.0.0.1:8000/api/projects?deleteId=${project}`).then(response => navigate('/project'))
    }
    const editProjectHandler = () => {
        const nameElement = document.getElementById('currentProject');
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = nameElement.innerText;

        inputElement.onblur = function () {
            const updatedName = this.value;
            nameElement.innerHTML = updatedName;
            this.parentNode.replaceChild(nameElement, this);

            axios
                .post(`http://127.0.0.1:8000/api/projects?id=${projectId}`, {
                    project: updatedName,
                    creator_id: encodeURIComponent(localStorage.getItem('userName'))
                })
                .then(response => {
                    localStorage.setItem('currentProject', updatedName);
                    formatTaskName(updatedName);
                })
                .catch(error => {
                    console.log(error);
                });
        };
        nameElement.parentNode.replaceChild(inputElement, nameElement);
    };

    const deleteUserHandler = (id) => {
        console.log(id)
        axios.post(`http://127.0.0.1:8000/api/projectadduser?deleteId=${id}&project_id=${projectId}`)
            .then(response =>
                window.location.reload()
            )
            .catch(error => {
                console.log(error)
            })
    }
    const handleChangeTaskInfo = (task, e) => {
        const selectValue = e.target.value;
        axios.post(`http://127.0.0.1:8000/api/task?id=${task.id}`, {
            name: task.name,
            user_id: task.user_id,
            status_id: selectValue,
        }).catch(error => {
            console.log(error);
        });
    };

    function formatTaskName(name) {
        const words = name.split(' ');
        if (words.length === 1) {
            setNameProject(words[0].substring(0, 2).toUpperCase());
        } else {
            setNameProject(words.map(word => word.charAt(0).toUpperCase()).join(''))
        }
    }
    return (
        <>
            <Layout>
                <SiteBar/>
                <div className="container-backlog" id='wrapper-backlog'>
                    <div className="header-container-backlog">
                        <div className="breadcrumb-container">
                            <div className="breadcrumb-title">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/project">Projects</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">tasks</li>
                                </ol>
                                <p className='title-backlog'>{localStorage.getItem('currentProject').charAt(0).toUpperCase() + localStorage.getItem('currentProject').slice(1)} проект</p>
                            </div>
                        </div>
                        <div className='search-container-backlog'>
                            <div className="search-container-left">
                                <div className="search-input-tasks">
                                    <input
                                        type="text"
                                        placeholder="Пошук...."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery.length !== 0 && (
                                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                                            X
                                        </button>
                                    )}
                                </div>
                                    <div className='images-users' style={{marginTop:'20px'}}>
                                        {showAvatars.map((avatar, index) => (
                                            <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                                                <img
                                                    src={avatar.avatar ? `http://127.0.0.1:8000/storage/${avatar.avatar}` : avatarDefault}
                                                    className="avatar"
                                                    alt="Avatar"
                                                    title={avatar.user.name}
                                                    onClick={
                                                        currentUserRole === 'teamlead'
                                                            ? () => {
                                                                deleteUserHandler(avatar.user_id);
                                                            }
                                                            : null
                                                    }
                                                />
                                                <p>{avatar.user.name}</p>
                                            </div>
                                        ))}

                                        {currentUserRole === 'teamlead' ?
                                            <>
                                                <ModalWindowUser/>
                                                <div className='wrapper-buttons-task'>
                                                    <button className={'btn btn-primary button-control-task'}
                                                            onClick={() => editProjectHandler(projectId)}>Редагувати назву проекту
                                                    </button>
                                                    <button className={'btn btn-primary button-control-task'}
                                                            onClick={() => deleteProjectHandler(projectId)}>Видалити проект
                                                    </button>
                                                </div>
                                            </> : null
                                        }
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-main-content">
                        <div className="project-information">
                            <div className="left-side-information">
                                <p style={{fontWeight:'bold'}}>проект: </p>
                                <p className='name-project'
                                   id='currentProject'>{localStorage.getItem('currentProject').charAt(0).toUpperCase() + localStorage.getItem('currentProject').slice(1)}
                                </p>
                            </div>
                            <div className="right-side-information">
                                {currentUserRole === 'teamlead' ?
                                    <ModalCreateTask setTasks={setTasks}/> : null
                                }
                                {finishValuesUpdate ?
                                    <>
                                        <p className="count first" id="todo">{valuesSelect.todo}</p>
                                        <p className="count second" id="testing">{valuesSelect.testing}</p>
                                        <p className="count third" id="done">{valuesSelect.done}</p>
                                    </> : null
                                }
                                <button className='submit-btn btn btn-secondary disabled complete-projects-btn' style={{fontSize:"10px", width:'120px'}}>Завершити проект</button>
                            </div>
                        </div>
                        <div className="content-table">
                            {loading && <Loading display="visible" />}
                            {tasks ?
                                tasks.length > 0 ? (
                                    tasks.map((task, index) => {
                                        const hideClass = searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 'hide' : '';
                                        return (
                                            <div className={`content-table-project ${hideClass}`} key={task.id}>
                                                <div className="left-side-content">
                                                    <p className={`name-table ${task.status_id.toString() === '1' ? 'done-work' : ''}`} id="name-table" key={task.id}>
                                                        {nameProject}-{index + 1}
                                                    </p>
                                                    <p className="description-table">{task.name}</p>
                                                </div>
                                                <div className="right-side-content">
                                                    {currentUserRole === 'teamlead' ? (
                                                        <button className="delete-content" onClick={() => deleteTaskHandler(task.id)}>
                                                            -
                                                        </button>
                                                    ) : null}
                                                    <ModalWindow
                                                        comments={task.comments}
                                                        informationTask={task.informationTask}
                                                        photoTask={task.photo.length !== 0 ? task.photo[0].photo : null}
                                                        description={task.description.length !== 0? task.description[0].description : null}
                                                        task={task}
                                                        taskId={task.id}
                                                        currentUserRole={currentUserRole}
                                                        foundUser={foundUser}
                                                        assignedUser={assignedUser}
                                                    />
                                                    <select
                                                        name=""
                                                        id="selection-work-progress"
                                                        className={`select-progress ${task.status_id === 1 ? 'active-first' : '' || task.status_id === 2 ? 'active-second' : '' || task.status_id === 3 ? 'active-third' : ''}`}
                                                        onChange={e => {
                                                            handleChangeTaskInfo(task, e);
                                                            handlerCount();
                                                        }}
                                                        onClick={choiseSelect}
                                                        defaultValue={task.status_id.toString()}
                                                    >
                                                        <option value="1">Зроблено</option>
                                                        <option value="2">Тестування</option>
                                                        <option value="3">В роботі</option>
                                                    </select>
                                                    <img src={task.user.avatar.avatar ? `http://127.0.0.1:8000/storage/${task.user.avatar.avatar}` : avatarDefault} className="avatar" alt="Avatar" />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Не знайдено завдань.</p>
                                )
                                : null }

                        </div>
                        <button className='submit-btn btn btn-secondary disabled complete-projects-btn-down' style={{fontSize:"10px", width:'120px'}}>Завершити проект</button>
                    </div>
                </div>
            </Layout>
        </>
    );
}
// export default BackLogPage
export default withAuthentication(BackLogPage);
