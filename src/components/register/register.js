import React, {useState} from "react";
import { Form, Button , Modal} from "react-bootstrap";
import './register.css'
import Service from "../../services/Service";
export default function Register(){
    const s= new Service();
    const [passwordValue, setPass] = useState(''); 
    const [emailValue, setEmail] = useState(''); 
    const [errModal, setModalOpen] = useState(false);
    const [errMess, setErrMess] = useState('Error messajhghjghjgjhkjkjhkjhkjhjkhkjhkjhge');
    const [passwordCheck, setPassCheck] = useState('');
    const signUpUser=(password,email)=>{
        if(password && email){
            if(passwordCheck === passwordValue){
                setModalOpen(false)
                s.signUp({password,email})
                    .then(data=>{
                        setPass('')
                        setEmail('')
                        setPassCheck('')
                    })
                    .catch(err=>{
                        if(err.status===401) setErrMess('Користувач з такою поштою вже існує.')
                        else if(err.status===400) setErrMess('Не валідний пароль.')
                        else setErrMess("Невідома помилка.")
                        setModalOpen(true)
                    })
            }
            else{
                setModalOpen(true)
                setErrMess('Паролі не збігаються')
            }
        }
    }
    return (
        <>
            <Form className="form" onSubmit={(e)=>{
                e.preventDefault();
                signUpUser(passwordValue, emailValue);
            }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Ел.пошта</Form.Label>
                    <Form.Control onInput={(e)=>setEmail(e.target.value)} value={emailValue} type="email" placeholder="Ел.пошта" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control onInput={(e)=>setPass(e.target.value)} value={passwordValue} type="password" placeholder="Пароль" />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicPasswordCheck">
                    <Form.Label>Перевірка паролю</Form.Label>
                    <Form.Control onInput={(e)=>setPassCheck(e.target.value)} type="password" value={passwordCheck} placeholder="Перевірка паролю" />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                    Зареєструватись
                </Button>
            </Form>
            {errModal ?
                
                <Modal.Dialog className="err-modal">
                    <Modal.Header onClick={()=>setModalOpen(false)} closeButton>
                        <Modal.Title>{errMess}</Modal.Title>
                    </Modal.Header>
                </Modal.Dialog>
            : null}
        </>
    )
}