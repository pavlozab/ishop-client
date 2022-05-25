import React, {useState, useEffect} from "react";
import {Form, Button}  from 'react-bootstrap';
import { useHistory } from "react-router";
import Service from "../../services/Service";
import './admin.css';


export default function Admin(){
    const history = useHistory()
    const s = new Service();


    useEffect(()=>{
        if(localStorage.getItem('role')==='user') history.push('/user')
        s.getOrders()
            .catch(err=> {
                if(err.status===401) history.push('/login')
            })
    }, [])

    const createProduct = (e) => {
        e.preventDefault();
        let form = document.forms[1]
        console.log(form);
        let obj = {};
        for (const key in form.elements) {
            if (Object.hasOwnProperty.call(form.elements, key) && isNaN(key)) {
                obj[key] = form.elements[key].value;
            }
        }
        console.log(obj);
        s.postProduct(obj)
            .then(data => {
                form.reset()
                console.log(data)
            })
            .catch(err=> console.log(err))
    }

    return (
       
        <Form className="form" onSubmit={(e)=>createProduct(e)}>
        <Form.Group className="mb-3" controlId="image">
            <Form.Label>Фото</Form.Label>
            <Form.Control  required type="text" placeholder="Фото" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="title">
            <Form.Label>Назва</Form.Label>
            <Form.Control  required type="text" placeholder="Назва" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="memory">
            <Form.Label>Пам'ять</Form.Label>
            <Form.Control required min="1" type="number" placeholder="Пам'ять" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
            <Form.Label>Ціна</Form.Label>
            <Form.Control required min="1" step="0.01" type="number" placeholder="Ціна" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="newPrice">
            <Form.Label>Ціна по знижці</Form.Label>
            <Form.Control  min="0" type="number" step="0.01" placeholder="Ціна по знижці " />
        </Form.Group>
        <Form.Group className="mb-3" controlId="diagonal">
            <Form.Label>Діагональ</Form.Label>
            <Form.Control required min="1" step="0.1" type="number" placeholder="Діагональ" />
        </Form.Group> 
        <Form.Group className="mb-3" controlId="color">
            <Form.Label>Колір</Form.Label>
            <Form.Control   required type="text" placeholder="Колір" />
        </Form.Group> 
        <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Кількість</Form.Label>
            <Form.Control  required min="1" type="number" placeholder="Кількість" />
        </Form.Group> 
        <Button variant="primary" type="submit">
            Додати
        </Button>
    </Form>

    )
}