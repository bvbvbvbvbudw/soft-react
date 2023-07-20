import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

function MyVerticallyCenteredModal(props) {
    const [addUsers, setAddUser] = useState([]);
    const [userAvatar, setUserAvatar] = useState();
    const sendRequest = (e) => {
        const inputReq = document.getElementById('response-create-project')
        e.preventDefault()
        console.log(inputReq.value);
        axios
            .post('http://localhost:8000/api/projects', {
                project: inputReq.value,
                creator_id: localStorage.getItem('userName')
            })
            .then(response => {
                window.location.reload();
            })
            .catch(error => console.error(error));
    };

    // const addUserHandler = (id) => {
    //     console.log(id)
    // }
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
                        <input type="text" id='response-create-project' placeholder='enter project name'/>
                        <button type='submit'>Add</button>
                    </form>

                    {/*<div className="response-find-user">*/}
                    {/*    {addUsers.map(user => (*/}
                    {/*        <div key={user.id}>*/}
                    {/*            <img*/}
                    {/*                src={`http://localhost:8000/storage/${userAvatar}`}*/}
                    {/*                className="avatar"*/}
                    {/*                alt={user.name}*/}
                    {/*            />*/}
                    {/*            <p>Name: {user.name}</p>*/}
                    {/*            <p>Email: {user.email}</p>*/}
                    {/*            <button onClick={() => addUserHandler(user.id)}>add current user</button>*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</div>*/}

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
                Create new project
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default function ModalCreateProject(){

    return(<>

        <ModalUser/>

    </>)
};