import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import {useParams} from "react-router-dom";

function MyVerticallyCenteredModal(props) {
    const { projectId } = useParams();
    const [addUsers, setAddUser] = useState([]);
    const [userAvatar, setUserAvatar] = useState();
    const sendRequest = (e) => {
        const inputReq = document.getElementById('req')
        e.preventDefault();
        axios
            .get(`https://bvbvbvbvbudw-001-site1.atempurl.com/api/findUser?name=${inputReq.value}`)
            .then(response => {
                setAddUser(response.data);
                setTimeout(() => {
                    axios
                        .get(`https://bvbvbvbvbudw-001-site1.atempurl.com/api/avatarLoad?user_id=${response.data[0].id}`)
                        .then(response => {
                            setUserAvatar(response.data.avatar)
                        })
                        .catch(error => console.error(error));
                }, 300);
            })
            .catch(error => console.error(error));
    };

    const addUserHandler = (id) => {
        const select = document.getElementById('choice-member')
        axios
            .post('https://bvbvbvbvbudw-001-site1.atempurl.com/api/projectadduser',
                {
                project_id: projectId ,
                user_id: id,
                access_level: select.value,
            })
    }
    return (
        <div className='modal-window-user-add'>
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Додавання користувача
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="" onSubmit={sendRequest}>
                    <input type="text" id='req' placeholder='Введіть нік користувача'/>
                    <button type='submit'>Шукати</button>
                </form>

                <div className="response-find-user">
                    {addUsers.map(user => (
                        <div key={user.id} style={{display:'flex'}}>
                            <img
                                src={`https://bvbvbvbvbudw-001-site1.atempurl.com/storage/${userAvatar}`}
                                className="avatar"
                                alt={user.name}
                            />
                            <div>
                                <p>І'мя: {user.name}</p>
                                <p>Емейл: {user.email}</p>
                            </div>
                            <select name="" id="choice-member" defaultValue='teamlead'>
                                <option value="teamlead">ТімЛід</option>
                                <option value="teamworker">Виконавець</option>
                            </select>
                            <button onClick={() => addUserHandler(user.id)}>Додати користувача</button>
                        </div>
                    ))}
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Закрити</Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

function ModalUser() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button variant="primary" className='button-control-task' onClick={() => setModalShow(true)}>
                Додати користувача
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default function ModalWindowUser(){

    return(<>

    <ModalUser/>

    </>)
};