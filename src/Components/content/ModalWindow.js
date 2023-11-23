import React, {useEffect, useState} from "react";
import Modal from 'react-bootstrap-v5/lib/Modal';
import Button from 'react-bootstrap-v5/lib/Button';
import axios from "axios";

// images
import attach from '../../images/attach.png';
import child from '../../images/childissue.png';
import share from '../../images/share-link.png';

import '../../style/comments.css';
// import Loading from "../Loading";
import Accordion from "react-bootstrap/Accordion";
import Select from 'react-select';

import avatarDefault from '../../images/avatar/default.svg';
import defaultPhoto from '../../images/avatar/photo-task.png';

function MyVerticallyCenteredModal(props) {
    let {
        task,
        comments,
        informationTask,
        description,
        photoTask,
        buttonId,
        users,
        currentUserRole,
        foundUser,
        assignedUser,
         setSendRequestModal,
         ...rest
     } = props;
     const formatDate = (inputDate) => {
         const dateObj = new Date(inputDate);
         const options = {day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'};
         return dateObj.toLocaleDateString('uk-UA', options);
     };
     const [information, setInformation] = useState([]);
     const [defaultValue, setDefaultValue] = useState([]);
     const [deadline, setDeadline] = useState();
     const [selectedValue, setSelectedValue] = useState();
     const [showAcc, setShowAcc] = useState(false);
     const [isFullScreen, setIsFullScreen] = useState(false);
     const [selectedFile, setSelectedFile] = useState(null);

     console.log(task)

    const [newComments, setNewComments] = useState([]);

     const handleImageClick = () => {
         setIsFullScreen(true);
     };
     const handleFullScreenExit = () => {
         setIsFullScreen(false);
     };

     const CreateCommentsHandler = (e, taskId) => {
         e.preventDefault();
         const inp = document.getElementById('comment-input');
         const comment = {
             description: inp.value,
             user_id: parseInt(localStorage.getItem('userName')),
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString(),
             task_id: task.id,
         };

         axios.post('http://127.0.0.1:8000/api/comment', comment)
             .then(response => {
                 const createdComment = response.data.response.comment.data;
                 const inp = document.getElementById('comment-input');
                 inp.value = '';
                 updateComments(taskId);
             })
             .catch(error => {
                 console.log(error);
             });

     };
     const updateDescription = (e, task) => {
         e.preventDefault();
         const inp = document.getElementById('description-input');
         axios.post(`http://127.0.0.1:8000/api/description-task`, {
             task_id: task,
             description: inp.value
         })
             .then(response => {
                 console.log(response);
             }).catch(error => console.error(error))
     };
     const deleteCommentHandler = (commentId, taskId) => {
         axios.post(`http://127.0.0.1:8000/api/comment?deleteId=${parseInt(commentId)}`)
             .then(response => {
                 updateComments(taskId);
             })
     }
    const updateComments = (taskId) => {
        axios.get(`http://127.0.0.1:8000/api/currentTask?id_task=${taskId}`)
            .then(response => {
                setNewComments(response.data.response.tasks.data.comments);
                const comments = response.data.response.tasks.data.comments;
                const container = document.querySelector('.container-comments');
                container.innerHTML = ''; // Clear the container

                if (comments.length === 0) {
                    container.textContent = 'Leave the first comment';
                } else {
                    const commentElements = comments.map(commentData => {
                        const comment = commentData.comment;

                        const commentContainer = document.createElement('div');
                        commentContainer.className = 'comment-container';

                        const userInfo = document.createElement('div');
                        userInfo.className = 'user-info';

                        const avatar = document.createElement('img');
                        avatar.src = `http://127.0.0.1:8000/storage/${comment.user.avatar.avatar}`;
                        avatar.className = 'avatar';
                        avatar.alt = comment.user.name;

                        const userName = document.createElement('p');
                        userName.className = 'user-name';
                        userName.textContent = comment.user.name;

                        const commentDate = document.createElement('p');
                        commentDate.className = 'comment-date';
                        commentDate.textContent = formatDate(comment.created_at);

                        userInfo.appendChild(avatar);
                        userInfo.appendChild(userName);
                        userInfo.appendChild(commentDate);

                        const commentText = document.createElement('p');
                        commentText.className = 'comment-text';
                        commentText.textContent = comment.description;

                        const deleteButton = document.createElement('button');
                        deleteButton.className = 'delete-button';
                        deleteButton.textContent = `Видалити`;
                        deleteButton.addEventListener('click', () => {
                            deleteCommentHandler(comment.id, task.id);
                        });

                        commentContainer.appendChild(userInfo);
                        commentContainer.appendChild(commentText);
                        commentContainer.appendChild(deleteButton);

                        return commentContainer;
                    });

                    commentElements.forEach(commentElement => {
                        container.appendChild(commentElement);
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    };



    const handleSortChange = (e) => {
    //      const sortType = e.target.value;
    //
    //      // if (sortType === 'newest') {
    //      //     outputComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    //      // } else if (sortType === 'oldest') {
    //      //     outputComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    //      // } else if (sortType === 'longest') {
    //      //     outputComments.sort((a, b) => b.description.length - a.description.length);
    //      // }
    //
    //      updateComments();
     };
     const handleComplexityChange = (e) => {
         setSelectedValue(e.target.value);
     }
     const handleDeadlineChange = (event) => {
         setDeadline(event.target.value);
     };
     const handleUserChange = (selectedOptions) => {
         console.log(selectedOptions)
         const removedUserIds = defaultValue.filter(
             (defaultValue) => !selectedOptions.some((option) => option.value === defaultValue.value)
         );
         if (removedUserIds.length > 0) {
             removedUserIds.forEach((removedUserId) => {
                 axios
                     .post(`http://127.0.0.1:8000/api/information-task?deleteId=${removedUserId.value}`)
                     .then((response) => {
                         console.log(response)
                         const updatedArray = defaultValue.filter(
                             (defaultValue) => defaultValue.value !== removedUserId.value
                         );
                         setDefaultValue(updatedArray);
                         assignedUser = updatedArray
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
                 .post("http://127.0.0.1:8000/api/task-photo", formData)
                 .then(response => {
                     const imagePath = response.data.path;
                     const imgElements = document.querySelectorAll(`.task-photo-${task.id}`);
                     imgElements.forEach(img => {
                         img.src = `http://127.0.0.1:8000/storage/${imagePath}`;
                     });
                 })
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
             .post('http://127.0.0.1:8000/api/information-task', {
                 task_id: task.id,
                 user_assigned: userIds,
                 deadline: date.value,
                 complexity: select.value,
             }).then(response => {
                 console.log('----')
                 console.log(response.data.response.comment.data)
                assignedUser = response.data.response.comment.data
         })
             .catch((error) => {
                 console.error(error);
             });
     };
     return (
         <>
             <div className="modal-window modal-window-big">
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
                                     <h6>Опис</h6>
                                     <form action="" onSubmit={(e) => updateDescription(e, task.id)}>
                                         <input
                                             id="description-input"
                                             type="text"
                                             placeholder="Додати опис до таску..."
                                             disabled={currentUserRole === 'teamworker'}
                                             readOnly={currentUserRole !== 'teamlead'}
                                             defaultValue={description ? description : ''}
                                         />
                                         {currentUserRole === 'teamlead' ? (
                                             <button type="submit" className={'btn btn-primary'}>Відправити</button>
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
                                             <option value="newest">Спочатку нові</option>
                                             <option value="oldest">Спочатку старі</option>
                                             <option value="longest">По довжині</option>
                                         </select>
                                     </div>
                                 </div>
                                 <div className="create-comments">
                                     <img
                                         src={foundUser ? `http://127.0.0.1:8000/storage/${foundUser.avatar}` : avatarDefault}
                                         className="avatar" alt='avatar'
                                     />
                                     <form action="" onSubmit={(e) => CreateCommentsHandler(e, task.id)}>
                                         <input type="text" placeholder='Введіть свій коментар...' id='comment-input' autoComplete="off"/>
                                         <button type='submit' className='send-comments-btn btn btn-primary'>
                                             Відправити
                                         </button>
                                     </form>
                                 </div>
                                 <div className="container-comments">
                                     {comments.length === 0 ? "Напишіть перший коментар" :
                                         comments.map(comment => {
                                                 const currentUser = localStorage.getItem('userName');
                                                 return (
                                                     <div key={comment.id} className="comment-container">
                                                         <div className="user-info">
                                                             <img
                                                                 src=
                                                                     {comment.comment.user.avatar.avatar ?
                                                                         `http://127.0.0.1:8000/storage/${comment.comment.user.avatar.avatar}`
                                                                         : avatarDefault}
                                                                 className="avatar"
                                                                 alt={comment.comment.user.name}
                                                             />
                                                             <p className="user-name">{comment.comment.user.name}</p>
                                                             <p className="comment-date">{formatDate(comment.comment.created_at)}</p>
                                                         </div>
                                                         <p className="comment-text">{comment.comment.description}</p>
                                                         <>
                                                             {parseInt(currentUser) === parseInt(comment.comment.user.id ? comment.comment.user.id : null) ? (
                                                                 <>
                                                                     <button className="delete-button" onClick={() => deleteCommentHandler(comment.comment_id, task.id)}>
                                                                         Видалити
                                                                     </button>
                                                                 </>
                                                             ) : null}
                                                         </>
                                                     </div>
                                                 );
                                             })
                                     }

                                 </div>
                             </div>
                             <div className="right-side-modal">
                                     <div className={`gallery ${isFullScreen ? 'fullscreen' : ''}`}>
                                         { !isFullScreen && (
                                             <>
                                                 <img className={`task-photo task-photo-${task.id}`}
                                                      src={photoTask ? `http://127.0.0.1:8000/storage/${photoTask}` : defaultPhoto} alt="photo task"
                                                      onClick={handleImageClick}/>
                                                 {currentUserRole === 'teamlead' ?
                                                     <div className="control-gallery">
                                                         <input type="file" onChange={handleFileChange}/>
                                                         <button className={'btn btn-primary'}
                                                                 onClick={handleUpload}>Завантажити
                                                         </button>
                                                     </div>
                                                     : null}
                                             </>
                                         )}
                                         {isFullScreen && (
                                             <div className="fullscreen-overlay" onClick={handleFullScreenExit}>
                                                 <img className="fullscreen-image "
                                                      src={`http://127.0.0.1:8000/storage/${photoTask}`} alt=""/>
                                             </div>
                                         )}
                                     </div>
                                 <div className="container-in-modal">
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
                                                             defaultValue={task && task.information_task ? task.information_task.map(user => ({
                                                                 value: user.user.id,
                                                                 label: user.user.name
                                                             })) : []}
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
                                                             Дедлайн:
                                                             {currentUserRole === 'teamlead' ? (
                                                                 <input
                                                                     type="date"
                                                                     id="date-information"
                                                                     // value={task.informationTask ? task.informationTask.deadline : ''}
                                                                     onChange={handleDeadlineChange}
                                                                     className="deadline-input"
                                                                 />
                                                             ) : (
                                                                 task && task.informationTask ? information.deadline : 'не вказано'
                                                             )}
                                                         </p>
                                                     </form>
                                                 </Accordion.Body>
                                             </Accordion.Item>
                                         </Accordion>
                                 </div>
                             </div>
                         </div>
                     </Modal.Body>
                     <Modal.Footer>
                         <Button onClick={props.onHide}>Закрити</Button>
                     </Modal.Footer>
                 </Modal>
             </div>
         </>
     );
 }

function ButtonModal({tasks, buttonId, currentUserRole, foundUser, assignedUser,comments,informationTask,description,photoTask,task}) {
    const [modalShow, setModalShow] = useState(false);
    return (
        <>
                <Button variant="primary" className='show-more' onClick={() => {
                    setModalShow(true);
                }}>
                    Відкрити детальніше
                </Button>
            <MyVerticallyCenteredModal
                task={task}
                informationTask={informationTask}
                photoTask={photoTask}
                description={description}
                comments={comments}
                currentUserRole={currentUserRole}
                show={modalShow}
                foundUser={foundUser}
                onHide={() => setModalShow(false)}
                assignedUser={assignedUser}
                tasks={tasks}
                buttonId={buttonId}
            />
        </>
    );
}

export default function ModalWindow(props) {
    const {
        task,
        comments,
        informationTask,
        photoTask,
        description,
        tasks,
        taskId,
        currentUserRole,
        foundUser,
        assignedUser
    } = props;
    return (<>
            <ButtonModal
                task={task}
                informationTask={informationTask}
                photoTask={photoTask}
                description={description}
                comments={comments}
                tasks={tasks}
                buttonId={taskId}
                currentUserRole={currentUserRole}
                foundUser={foundUser}
                assignedUser={assignedUser}
            />
        </>
    );
}