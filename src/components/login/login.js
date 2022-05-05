import React,{useState} from "react";
import { Form, Button , Modal} from "react-bootstrap";
import {  useHistory} from "react-router-dom";



import './login.css';
import Service from "../../services/Service";

export default function Login({setAuth}){
    const history = useHistory();
    const s= new Service();
    const [passwordValue, setPass] = useState(''); 
    const [emailValue, setEmail] = useState(''); 
    const [errModal, setModalOpen] = useState(false);
    const [errMess, setErrMess] = useState('');

    const signInUser=(password,email)=>{
        if(password && email){
            s.signIn({password,email})
                .then(response => {
                    const token = response.data.result.access_token;
                    const role = response.data.result.user_role.toLowerCase();
                    localStorage.setItem('token', token);
                    localStorage.setItem('role', role);
                    setAuth(true)
                    setPass('')
                    setEmail('')  
                    if(role==='admin') history.push('/admin')
                    else history.push(`/user`);
                })
                .catch(err=>{
                    console.log(err);
                    if(err.status===401) setErrMess('Користувач з такою поштою вже існує.')
                    else setErrMess("Невідома помилка.")
                    setModalOpen(true)
                })
        }
        
    }
    return (
        <>
        <Form className="form" onSubmit={(e)=>{
                e.preventDefault();
                signInUser(passwordValue, emailValue);
            }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Ел.пошта</Form.Label>
                <Form.Control onInput={(e)=>setEmail(e.target.value)} value={emailValue} type="email" placeholder="Ел.пошта" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control onInput={(e)=>setPass(e.target.value)} value={passwordValue} type="password" placeholder="Пароль" />
            </Form.Group> 
            
            <Button variant="primary" type="submit">
                Увійти
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