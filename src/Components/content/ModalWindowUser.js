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
            .get(`http://2718425.un507148.web.hosting-test.net/api/findUser?name=${inputReq.value}`)
            .then(response => {
                setAddUser(response.data);
                setTimeout(() => {
                    axios
                        .get(`http://2718425.un507148.web.hosting-test.net/api/avatarLoad?user_id=${response.data[0].id}`)
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
            .post('http://2718425.un507148.web.hosting-test.net/api/projectadduser',
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
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <form action="" onSubmit={sendRequest}>
                    <input type="text" id='req' placeholder='enter user name'/>
                    <button type='submit'>Add</button>
                </form>

                <div className="response-find-user">
                    {addUsers.map(user => (
                        <div key={user.id} style={{display:'flex'}}>
                            <img
                                src={`http://2718425.un507148.web.hosting-test.net/storage/${userAvatar}`}
                                className="avatar"
                                alt={user.name}
                            />
                            <div>
                                <p>Name: {user.name}</p>
                                <p>Email: {user.email}</p>
                            </div>
                            <select name="" id="choice-member" defaultValue='teamlead'>
                                <option value="teamlead">teamlead</option>
                                <option value="teamworker">teamworker</option>
                            </select>
                            <button onClick={() => addUserHandler(user.id)}>add current user</button>
                        </div>
                    ))}
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

function ModalUser() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                +
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