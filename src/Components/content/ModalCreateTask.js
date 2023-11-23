import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import {useParams} from "react-router-dom";

function MyVerticallyCenteredModal(props) {
    const { setTasks } = props;
    const {projectId} = useParams();
    const sendRequest = async (e) => {
        e.preventDefault();
        try {
            const inputReq = document.getElementById('response-create-task');

            const response = await axios.post('http://127.0.0.1:8000/api/task', {
                name: inputReq.value,
                user_id: localStorage.getItem('userName'),
                status_id: 3,
                project_id: projectId,
            });

            // Обновите состояние с новыми данными
            axios.get(`http://127.0.0.1:8000/api/currentTask?project_id=${projectId}`).then(response => {
                console.log(response)
                setTasks(response.data.response.tasks.data);
            }).catch(error => {
                console.error(error);
            })
            // Закройте модальное окно
            props.onHide();
        } catch (error) {
            console.error(error);
        }
    };    return (
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
                        Додавання таску
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form action="" onSubmit={sendRequest}>
                        <input type="text" id='response-create-task' placeholder='Введіть назву завдання' autoComplete="off"/>
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

function ModalTask({ setTasks }) {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button
                variant="primary"
                className='button-control-task'
                style={{ height: '36px', marginTop: '0px' }}
                onClick={() => setModalShow(true)}
            >
                Додати завдання
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setTasks={setTasks}
            />
        </>
    );
}

export default function ModalCreateTask(props){
    const { setTasks } = props

    return(<>

        <ModalTask setTasks={setTasks}/>

    </>)
};