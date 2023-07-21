import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import {useParams} from "react-router-dom";

function MyVerticallyCenteredModal(props) {
    const {projectId} = useParams();
    const sendRequest = (e) => {
        const inputReq = document.getElementById('response-create-task')
        e.preventDefault()
            axios
                .post('https://2718425.un507148.web.hosting-test.net/api/task', {
                    name: inputReq.value,
                    user_id: localStorage.getItem('userName'),
                    status_id: 3,
                    project_id: projectId,
                })
                .then(response => {
                    window.location.reload()
                })
                .catch(error => console.error(error));
    };
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
                        <input type="text" id='response-create-task' placeholder='enter task name'/>
                        <button type='submit'>Add</button>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function ModalTask() {
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

export default function ModalCreateTask(){

    return(<>

        <ModalTask/>

    </>)
};