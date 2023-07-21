import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

function MyVerticallyCenteredModal(props) {
    const sendRequest = (e) => {
        const inputReq = document.getElementById('response-create-project')
        e.preventDefault()
        console.log(inputReq.value);
        axios
            .post('https://2718425.un507148.web.hosting-test.net/api/projects', {
                project: inputReq.value,
                creator_id: localStorage.getItem('userName')
            })
            .then(response => {
                window.location.reload();
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
                        <input type="text" id='response-create-project' placeholder='enter project name'/>
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