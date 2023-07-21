import React, {useEffect, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from "axios";

function AlwaysOpenExample() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState({});
    const [openAccordion, setOpenAccordion] = useState({});
    const [userIds, setUserIds] = useState([]);
    const [showAvatars, setShowAvatars] = useState([]);
    const [currentTasks, setCurrentTasks] = useState([]);

    const choiseSelect = (event) => {
        const tables = document.querySelectorAll('.content-table-project');
        const paragraphs = document.querySelectorAll('.name-table');
        tables.forEach((table, index) => {
            table.addEventListener('click', function () {
                paragraphs[index].classList.toggle('done-work', event.target.value === '1');
            });
        });
        const target = event.target;
        target.classList.remove('active-first', 'active-second', 'active-third');
        if (target.value === '1') {
            target.classList.add('active-first');
        } else if (target.value === '2') {
            target.classList.add('active-second');
        } else if (target.value === '3') {
            target.classList.add('active-third');
        }
    };
    const handleChangeTaskInfo = (task, e) => {
        const selectValue = e.target.value;
        axios.post(`https://2718425.un507148.web.hosting-test.net/api/task?id=${task.id}`, {
            name: task.name,
            user_id: task.user_id,
            status_id: selectValue,
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        axios.get(`https://2718425.un507148.web.hosting-test.net/api/projects?user_id=${localStorage.getItem('userName')}`)
            .then(response => {
                setProjects(response.data.response.tasks.data)
            })
        axios.get(`https://2718425.un507148.web.hosting-test.net/api/information-task`)
            .then(response => {
                setCurrentTasks(response.data.response.status.data)
            })
    }, []);

    const test = (projectId) => {
        axios.get(`https://2718425.un507148.web.hosting-test.net/api/currentTask?project_id=${projectId}`)
            .then(response => {
                const userIds = {};
                response.data.forEach(item => {
                    if (!userIds[item.user_id]) {
                        userIds[item.user_id] = true;
                    }
                });
                setUserIds(Object.keys(userIds));
                setTasks(prevState => ({
                    ...prevState,
                    [projectId]: response.data
                }));

                const avatarRequests = Object.keys(userIds).map(avatar => {
                    return axios.get(`https://2718425.un507148.web.hosting-test.net/api/avatarLoad?user_id=${avatar}`);
                });

                Promise.all(avatarRequests)
                    .then(response => {
                        const avatarsData = response.map(response => response.data);
                        setShowAvatars(avatarsData);
                    })
                    .catch(error => console.error(error));
            }).catch(error => console.log(error));
    };


    const handleAccordionToggle = (index) => {
        setOpenAccordion(prevState => {
            const newState = {...prevState};
            newState[index] = !newState[index];
            return newState;
        });
        if (!openAccordion[index]) {
            test(projects[index].id);
        }
    };

    return (
        <Accordion alwaysOpen>
            {projects.map((project, index) => {
                const projectTasks = tasks[project.id] || [];
                return (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header onClick={() => handleAccordionToggle(index)}>
                            {project.project}
                        </Accordion.Header>
                        <Accordion.Body>
                            {projectTasks.length === 0 ? <p>tasks not found</p> :
                                projectTasks.map(task => {
                                    const taskAvatar = showAvatars.find(avatar => avatar.user_id === task.user_id.toString());
                                    if (currentTasks.some(currentTask => currentTask.task_id === task.id
                                        && localStorage.getItem('userName').toString() === currentTask.user_assigned.toString())) {
                                        return (
                                            <div className="content-table-project" key={task.id}>
                                                <div className="left-side-content">
                                                    <input type="checkbox"/>
                                                    <p className={`name-table ${task.status_id.toString() === '1' ? 'done-work' : ''}`}
                                                       id='name-table'>
                                                        SCT-6
                                                    </p>
                                                    <p className='description-table'>{task.name}</p>
                                                </div>
                                                <div className="right-side-content">
                                                    <select name=""
                                                            id="selection-work-progress"
                                                            className=
                                                                {task.status_id === 1 ? 'active-first' : ''
                                                                || task.status_id === 2 ? 'active-second' : ''
                                                                || task.status_id === 3 ? 'active-third' : ''}
                                                            onChange={(e) => handleChangeTaskInfo(task, e)}
                                                            onClick={choiseSelect}
                                                            defaultValue={task.status_id.toString()}>
                                                        <option value='1'>Done</option>
                                                        <option value='2'>Testing</option>
                                                        <option value='3'>To do</option>
                                                    </select>
                                                    {taskAvatar && (
                                                        <img src={`https://2718425.un507148.web.hosting-test.net/storage/${taskAvatar.avatar}`}
                                                             alt="Avatar" className={'avatar'}
                                                             style={{width: 30, height: 30}}
                                                             title={taskAvatar.user.name}/>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }
                            <a href={`/backlog/${project.id}`}
                               onClick={() => localStorage.setItem('currentProject', project.project)}>перейти на
                                проект</a>
                        </Accordion.Body>
                    </Accordion.Item>
                );
            })}
        </Accordion>
    );
}

export default function AccordionBacklog() {
    return (
        <>
            <AlwaysOpenExample/>
        </>
    );
}

