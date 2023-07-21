import React, {useEffect, useRef, useState} from "react";
import Modal from 'react-bootstrap-v5/lib/Modal';
import Button from 'react-bootstrap-v5/lib/Button';
import axios from "axios";

// images
import attach from '../../images/attach.png';
import child from '../../images/childissue.png';
import share from '../../images/share-link.png';

import '../../style/comments.css';
import Loading from "../Loading";
import Accordion from "react-bootstrap/Accordion";
import Select from 'react-select'

function MyVerticallyCenteredModal(props) {
    let {
        tasks,
        comments,
        buttonId,
        taskComments,
        users,
        avatarload,
        currentUserRole,
        foundUser,
        assignedUser,
        sendRequestModal,
        setSendRequestModal,
        ...rest
    } = props;
    const [loading, setLoading] = useState(true);
    const currentUser = localStorage.getItem('userName');
    const task = tasks.find((task) => task.id === buttonId);
    const findCommentId = taskComments.filter((comment) => comment.task_id === task.id);
    const commentIds = findCommentId.map((comment) => comment.comment_id);
    const outputComments = comments.filter((comment) => commentIds.includes(comment.id));
    const formatDate = (inputDate) => {
        const dateObj = new Date(inputDate);
        const options = {day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'};
        return dateObj.toLocaleDateString('uk-UA', options);
    };
    const commentUserIds = outputComments.map(comment => comment.user_id);
    const [userAvatars, setUserAvatars] = useState([]);
    const [information, setInformation] = useState([]);
    const [defaultValue, setDefaultValue] = useState([]);
    const [photoTask, setPhotoTask] = useState([]);
    const [deadline, setDeadline] = useState();
    const [selectedValue, setSelectedValue] = useState();
    const [showAcc, setShowAcc] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');

    let aShow = avatarload

    useEffect(() => {
        const photos = Array.from(new Set(commentUserIds));
        if (aShow === true) {
            const requests = photos.map((userId) => {
                return axios.get(`http://2718425.un507148.web.hosting-test.net/api/avatarLoad?user_id=${userId}`)
                    .then(response => {
                        setUserAvatars(prevAvatars => [...prevAvatars, response.data]);
                        return response.data;
                    })
                    .catch(error => {
                        console.error(error);
                        return null;
                    });
            });
            axios
                .get(`http://2718425.un507148.web.hosting-test.net/api/description-task?task=${buttonId}`)
                .then(response => {
                    if (response.data.response.tasks.description && response.data.response.tasks.description.description) {
                        setDescription(response.data.response.tasks.description.description);
                    } else setDescription('');
                }).catch(error => {
                console.log(error);
            });
            axios.get(`http://2718425.un507148.web.hosting-test.net/api/task-photo-get?task_id=${task.id}`)
                .then(response => {
                    if (response.data.photo) {
                        setPhotoTask(response.data.photo);
                    } else setPhotoTask('');
                }).catch(error => {
                console.log(error)
            })
            Promise.all(requests)
                .then(results => {
                    setUserAvatars(results);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [aShow, buttonId, commentUserIds, task.id]);
    useEffect(() => {
        if (sendRequestModal) {
            axios
                .get(`http://2718425.un507148.web.hosting-test.net/api/information-task?task=${buttonId}`)
                .then(response => {
                    const newDefaultValue = response.data.response.status.data.map(user => ({
                        value: user.user.id,
                        label: user.user.name
                    }));
                    setShowAcc(true);
                    setDefaultValue(newDefaultValue);
                    setInformation(response.data.response.status.data);
                    if (response.data.response.status.data[0].deadline) {
                        setDeadline(response.data.response.status.data[0].deadline);
                    } else {
                        setDeadline('');
                    }
                    setSelectedValue(response.data.response.status.data[0].complexity);
                })
                .catch(error => {
                    console.log(error);
                });
            setSendRequestModal(false);
        }
    }, [sendRequestModal, buttonId, setSendRequestModal]);

    const handleImageClick = () => {
        setIsFullScreen(true);
    };
    const handleFullScreenExit = () => {
        setIsFullScreen(false);
    };

    const CreateCommentsHandler = (e) => {
        e.preventDefault();
        const inp = document.getElementById('comment-input');
        const comment = {
            description: inp.value,
            user_id: parseInt(localStorage.getItem('userName')),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            task_id: task.id,
        };

        axios.post('http://2718425.un507148.web.hosting-test.net/api/comment', comment)
            .then(response => {
                const createdComment = response.data.response.comment.data;
                const inp = document.getElementById('comment-input');
                inp.value = '';
                outputComments.push(createdComment);
                updateComments()
            });
    };
    const updateDescription = (e, task) => {
        e.preventDefault();
        const inp = document.getElementById('description-input');
        axios.post(`http://2718425.un507148.web.hosting-test.net/api/description-task`, {
            task_id: task,
            description: inp.value
        }).catch(error => console.error(error))
    };
    const deleteCommentHandler = (commentId) => {
        axios.post(`http://2718425.un507148.web.hosting-test.net/api/comment?deleteId=${parseInt(commentId)}`)
            .then(response => {
                const commentIndex = outputComments.findIndex(comment => comment.id === parseInt(commentId));
                if (commentIndex !== -1) {
                    outputComments.splice(commentIndex, 1);
                }
                updateComments();
            })
    }
    const updateComments = () => {
        const container = document.querySelector('.container-comments');
        container.innerHTML = '';

        if (outputComments.length === 0) {
            container.textContent = 'Leave first comment';
        } else {
            container.innerHTML = outputComments
                .map(comment => {
                    const user = users.find(user => user.id === comment.user_id);
                    const avatar = userAvatars.find(
                        avatar => Number(avatar.user_id) === Number(comment.user_id)
                    );

                    if (user && avatar) {
                        return `
            <div class="comment-container">
              <div class="user-info">
                <img src="http://2718425.un507148.web.hosting-test.net/storage/${avatar.avatar}" class="avatar" alt="${user.name}">
                <p class="user-name">${user.name}</p>
                <p class="comment-date">${formatDate(comment.created_at)}</p>
              </div>
              <p class="comment-text">${comment.description}</p>
              ${
                            parseInt(currentUser) === user.id
                                ? `<button class="delete-button" data-id="${comment.id}">Delete</button>`
                                : ''
                        }
            </div>
          `;
                    } else {
                        return 'Error !';
                    }
                })
                .join('');

            const deleteButtons = container.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const commentId = button.dataset.id;
                    deleteCommentHandler(commentId);
                });
            });
        }
    };


    const handleSortChange = (e) => {
        const sortType = e.target.value;

        if (sortType === 'newest') {
            outputComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortType === 'oldest') {
            outputComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortType === 'longest') {
            outputComments.sort((a, b) => b.description.length - a.description.length);
        }

        updateComments();
    };
    const handleComplexityChange = (e) => {
        setSelectedValue(e.target.value);
    }
    const handleDeadlineChange = (event) => {
        setDeadline(event.target.value);
    };
    const handleUserChange = (selectedOptions) => {
        const removedUserIds = defaultValue.filter(
            (defaultValue) => !selectedOptions.some((option) => option.value === defaultValue.value)
        );
        if (removedUserIds.length > 0) {
            removedUserIds.forEach((removedUserId) => {
                axios
                    .post(`http://2718425.un507148.web.hosting-test.net/api/information-task?deleteId=${removedUserId.value}`)
                    .then((response) => {
                        const updatedArray = defaultValue.filter(
                            (defaultValue) => defaultValue.value !== removedUserId.value
                        );
                        setDefaultValue(updatedArray);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        }

        if (selectedOptions.length > 0) {
            selectedOptions.forEach((selectedOption) => {
                const alreadyAdded = defaultValue.some(
                    (defaultValue) => defaultValue.value === selectedOption.value
                );
                if (!alreadyAdded) {
                    const updatedArray = [...defaultValue, selectedOption];
                    setDefaultValue(updatedArray);
                }
            });
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("photo", selectedFile);
            formData.append("task_id", task.id);

            axios
                .post("http://2718425.un507148.web.hosting-test.net/api/task-photo", formData)
                .catch((error) => {
                    console.error(error);
                });
        }
    };
    const sendRequest = () => {
        const select = document.getElementById('select-information');
        const date = document.getElementById('date-information');
        const userIds = defaultValue.map((user) => user.value);
        axios
            .post('http://2718425.un507148.web.hosting-test.net/api/information-task', {
                task_id: task.id,
                user_assigned: userIds,
                deadline: date.value,
                complexity: select.value,
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <>
            <div className="modal-window">
                <Modal {...rest} size="xl h-75" aria-labelledby="contained-modal-title-vcenter" centered
                       animation={false}>
                    <Modal.Body>
                        <div className="wrapper-modal">
                            <div className="left-side-modal">
                                <p className='title-on-modal'>{task.name}</p>
                                <div className="container-buttons">
                                    <button><span><img src={attach} alt=""/></span>Attach</button>
                                    <button><span><img src={child} alt=""/></span>Add a child issue</button>
                                    <button><span><img src={share} alt=""/></span>Link issue</button>
                                    <button>...</button>
                                </div>
                                <div className="container-for-description">
                                    <h6>Description</h6>

                                    <form action="" onSubmit={(e) => updateDescription(e, task.id)}>
                                        <input
                                            id="description-input"
                                            type="text"
                                            placeholder="Add a description..."
                                            disabled={currentUserRole === 'teamworker'}
                                            readOnly={currentUserRole !== 'teamlead'}
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                        {currentUserRole === 'teamlead' ? (
                                            <button type="submit" className={'btn btn-primary'}>Send</button>
                                        ) : null}
                                    </form>

                                </div>
                                <div className="activity">
                                    <div className="buttons">
                                        <h6>Activity</h6>

                                        <p>Show:</p>
                                        <button>All</button>
                                        <button>Comments</button>
                                        <button>History</button>
                                    </div>
                                    <div>
                                        <select name="" id="" defaultValue={'newest'} onChange={handleSortChange}>
                                            <option value="newest">newest first</option>
                                            <option value="oldest">oldest</option>
                                            <option value="longest">longest</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="create-comments">
                                    <img
                                        src={foundUser ? `http://2718425.un507148.web.hosting-test.net/storage/${foundUser.avatar}` : null}
                                        className="avatar" alt='avatar'
                                    />
                                    <form action="" onSubmit={CreateCommentsHandler}>
                                        <input type="text" placeholder='type new comment here...' id='comment-input'/>
                                        <button type='submit' className='send-comments-btn btn btn-primary'>
                                            Send
                                        </button>
                                    </form>
                                </div>
                                <div className="container-comments">
                                    {loading && <Loading display="visible"/>}
                                    {outputComments.length === 0 ? "leave first comment" : ""}
                                    {outputComments.map(comment => {
                                        const user = users.find(user => user.id === comment.user_id);
                                        const avatar = userAvatars.find(avatar => Number(avatar.user_id) === Number(comment.user_id));
                                        if (user && avatar) {
                                            return (
                                                <div key={comment.id} className="comment-container">
                                                    <div className="user-info">
                                                        <img
                                                            src={`http://2718425.un507148.web.hosting-test.net/storage/${avatar.avatar}`}
                                                            className="avatar"
                                                            alt={user.name}
                                                        />
                                                        <p className="user-name">{user.name}</p>
                                                        <p className="comment-date">{formatDate(comment.created_at)}</p>
                                                    </div>
                                                    <p className="comment-text">{comment.description}</p>
                                                    <>
                                                        {parseInt(currentUser) === user.id ? (
                                                            <>
                                                                <button className="delete-button"
                                                                        onClick={() => deleteCommentHandler(comment.id)}>Delete
                                                                </button>
                                                            </>
                                                        ) : null}
                                                    </>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                            <div className="right-side-modal">
                                    <div className={`gallery ${isFullScreen ? 'fullscreen' : ''}`}>
                                        { !isFullScreen && (
                                            <>
                                                <img className="task-photo"
                                                     src={`http://2718425.un507148.web.hosting-test.net/storage/${photoTask}`} alt=""
                                                     onClick={handleImageClick}/>
                                                {currentUserRole === 'teamlead' ?
                                                    <div className="control-gallery">
                                                        <input type="file" onChange={handleFileChange}/>
                                                        <button className={'btn btn-primary'}
                                                                onClick={handleUpload}>Upload
                                                        </button>
                                                    </div> : null
                                                }
                                            </>
                                        )}
                                        {isFullScreen && (
                                            <div className="fullscreen-overlay" onClick={handleFullScreenExit}>
                                                <img className="fullscreen-image"
                                                     src={`http://2718425.un507148.web.hosting-test.net/storage/${photoTask}`} alt=""/>
                                            </div>
                                        )}
                                    </div>
                                <div className="container-in-modal">
                                    {showAcc ?
                                        <Accordion className='w-100' defaultActiveKey={'1'}>
                                            <Accordion.Item eventKey='1'>
                                                <Accordion.Header>Інформація</Accordion.Header>
                                                <Accordion.Body>
                                                    <form className="accordion-body-form" action="" onChange={sendRequest}>
                                                        <div className="container-select-complexity">
                                                            <p className="complexity-label">Пріоритет: </p>
                                                            <select
                                                                name=""
                                                                id="select-information"
                                                                value={selectedValue}
                                                                disabled={currentUserRole !== 'teamlead'}
                                                                onChange={handleComplexityChange}
                                                                className={`complexity-select ${currentUserRole !== 'teamlead' ? 'disabled' : ''}`}
                                                            >
                                                                <option value='' disabled>Пріоритет</option>
                                                                <option value="1">Низький</option>
                                                                <option value="2">Середній</option>
                                                                <option value="3">Вищий</option>
                                                                <option value="4">Найвищий</option>
                                                            </select>

                                                        </div>
                                                        <Select
                                                            name="user"
                                                            id="user-select"
                                                            isMulti
                                                            defaultValue={defaultValue.map((user) => ({
                                                                value: user.value,
                                                                label: user.label
                                                            }))}
                                                            options={assignedUser.map((user) => ({
                                                                value: user.user.id,
                                                                label: user.user.name
                                                            }))}
                                                            onChange={handleUserChange}
                                                            onInputChange={sendRequest}
                                                            isDisabled={currentUserRole !== 'teamlead'}
                                                            className="user-select"
                                                        />
                                                        <p className="deadline-label">
                                                            deadline:
                                                            {currentUserRole === 'teamlead' ? (
                                                                <input
                                                                    type="date"
                                                                    id="date-information"
                                                                    value={deadline}
                                                                    onChange={handleDeadlineChange}
                                                                    className="deadline-input"
                                                                />
                                                            ) : (
                                                                information && information.deadline ? information.deadline : 'не вказано'
                                                            )}
                                                        </p>
                                                    </form>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion> : null}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

function ButtonModal({tasks, buttonId, currentUserRole, foundUser, assignedUser}) {
    const [avatarShow, setAvatarShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [sendRequestModal, setSendRequestModal] = useState(false);
    const [taskComments, setTaskComments] = useState([]);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            axios
                .get(`http://2718425.un507148.web.hosting-test.net/api/commenttaskuser`)
                .then(response => {
                    const responseData = response.data.response.data;
                    setComments(responseData.comments);
                    setUsers(responseData.user);
                    setTaskComments(responseData.taskComment);
                })
                .catch(error => {
                    console.log(error);
                });
            isMounted.current = true;
        }
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {showButton && (
                <Button variant="primary" onClick={() => {
                    setAvatarShow(true);
                    setModalShow(true);
                    setSendRequestModal(true)
                }}>
                    Відкрити детальніше
                </Button>
            )}
            <MyVerticallyCenteredModal
                setSendRequestModal={setSendRequestModal}
                currentUserRole={currentUserRole}
                avatarload={avatarShow}
                show={modalShow}
                foundUser={foundUser}
                onHide={() => setModalShow(false)}
                sendRequestModal={sendRequestModal}
                users={users}
                assignedUser={assignedUser}
                comments={comments}
                taskComments={taskComments}
                tasks={tasks}
                buttonId={buttonId}
            />
        </>
    );
}

export default function ModalWindow(props) {
    const {tasks, taskId, currentUserRole, foundUser, assignedUser} = props;
    return (<>
            <ButtonModal tasks={tasks} buttonId={taskId} currentUserRole={currentUserRole} foundUser={foundUser}
                         assignedUser={assignedUser}/>
        </>
    );
}