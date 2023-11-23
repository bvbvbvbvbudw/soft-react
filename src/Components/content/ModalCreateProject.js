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
            .post('http://127.0.0.1:8000/api/projects', {
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
                        Додавання проекту
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form action="" onSubmit={sendRequest}>
                        <input type="text" id='response-create-project' placeholder='Введіть назву' autoComplete="off"/>
                        <button type='submit' className='btn btn-primary'>Додати</button>
                    </form>
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
                Додати новий проект
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