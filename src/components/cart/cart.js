import React, {useState, useEffect} from "react";
import {ListGroup,CloseButton, Button}  from 'react-bootstrap';
import { useHistory } from "react-router";
import Service from "../../services/Service";
import './cart.css';


export default function Cart(){
    const history = useHistory()
    const s = new Service();
    const [cartList, setCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);

    useEffect(()=>{
        if(localStorage.getItem('role')==='admin') history.push('/admin')
        const currentCart =  JSON.parse(localStorage.getItem('cart'));
        if(currentCart && currentCart.length) setCart(currentCart)
        s.getOrders()
            .catch(err=> {
                if(err.status===401) history.push('/login')
            })
    }, [])

    const makeOrder = (products)=>{
        products = products.map(({id,amount}) => {return {productId:id,  amount}})
        s.postOrder({products})
            .then(data=>{
                setCart([]);
                localStorage.removeItem('cart')
            })
            
        
            
    }
    const renderCart = (cart) => {
        const newArr = cart.map(({title,amount},index) => {
            return (
            <ListGroup.Item className="cart__product" key={index+amount*Math.random()}>
                <div className="cart__title">{title}</div>
                <div className="cart__amount">Кількість: {amount}</div>
                <CloseButton type="button" onClick={()=>{
                    let newArr = [...cartList];
                    newArr.splice(index,1);
                    setCart(newArr)
                    localStorage.setItem('cart',JSON.stringify(newArr))
                }}/>
            </ListGroup.Item>
            )
        })
        return newArr;
    }
    const total = cartList.reduce((prev, curr)=>prev + curr.price*curr.amount,0)

    return (
        
        <form className="cart__wrapper"  onSubmit={(e)=> {
            e.preventDefault();
            makeOrder(cartList, total)
        }}>
            <div className="cart__header">Кошик:</div>
            <ul className="cart">
                <ListGroup variant="flush">
                    {renderCart(cartList)}
                </ListGroup>
                <div className="cart__total">Сума: {total}$</div>
            </ul>
            <Button variant="secondary" type="submit" disabled={!!!cartList.length} className="button button__secondary" >
                Замовити
            </Button>
            <Button variant="light" type="button" className="cart__clear" onClick={()=>{
                localStorage.removeItem('cart');
                setCart([])
            }}>Очистити</Button>

        </form>


    )
}


