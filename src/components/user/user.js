import React, {useState, useEffect} from "react";
import { useHistory } from "react-router";
import Service from "../../services/Service";
import './user.css';


export default function User(){
    const history = useHistory()
    const s = new Service();
    const [orders,setOrders] = useState([]);

    const renderOrders = (orders) => { 
        const newOrders = orders.map((order,index)=>{
            const newProds = order.products.map((prod,index)=>{
                return <li className="order" key={index+prod.amount}>
                    <div className="order__title">{prod.title}</div>
                    <div className="order__amount">{prod.amount}</div>
                </li>
            })
            return <ul className="orders__item" key={index+order.totalPrice}>
                <div className="orders__date">{order.date.split('T')[0]} {order.date.split('T')[1].split('.')[0]}</div>
                {newProds}
                <div className="orders__price">{order.totalPrice}₴</div>
            </ul>
        })
        return <ul className="orders__list">
            {newOrders}
        </ul>
    }

    useEffect(()=>{
        if(localStorage.getItem('role')==='admin') history.push('/admin')
        s.getOrders()
            .then(order => {
                setOrders(order.data.result);
            })
            .catch(err=> {
                if(err.status===401) history.push('/login')
            })
    }, [])


    return (
        
        <div className="order-wrapper">
            <div className="orders">
                <div className="orders__header">Мої покупки:</div>
                    {renderOrders(orders)}
                
            </div>
        </div>
    )
}


