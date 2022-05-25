import React, { useEffect, useState } from 'react'
import './product.css'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router'
import { Button, Modal } from 'react-bootstrap';
import Service from '../../services/Service';



export default function Product(){
    const {id} = useParams()
    const s = new Service();
    const history = useHistory();
    const [phone, setPhone] = useState({})
    const [modalOpen, setModal] = useState(false);
    const [modalAmount, setModalAmount] = useState(0);

    let isAdmin = localStorage.getItem('role')==='admin';
    let isAuth = !!localStorage.getItem('role');
    
    

    useEffect(()=>{
        s.getProduct(id)
            .then((data)=> {
                setPhone(data)
            })
            .catch(err=> {
                history.push('/products')
            })
        
    },[id])
 
    const addProduct = () =>{
        const products = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        const prod = {...phone}
        if(prod.newPrice) prod.price = prod.newPrice;
        products.push({title: prod.title,id, amount: modalAmount,price: prod.price})
        if(prod.amount >= modalAmount){
            setModal(false);
            localStorage.setItem('cart',JSON.stringify(products))
        }
        else alert('На складі немає стільки в наявності!')
    }

    const renderProduct=(phone)=>{
        const {price,newPrice, title, memory, color, diagonal, image, amount} = phone;
        return (
            <>
                <div className="product-block">
                    <div className="image-wrapper">
                        <img src={`../assets/${image}`} alt="product-image"/>
                    </div>
                    <div className="product-info">
                        <div className="product-title">{title}</div>
                        Характеристики:
                        <ul className="product-char">      
                            <li>Пам'ять: {memory} Gb</li>
                            <li>Колір: {color}</li>
                            <li>Діагональ екрану: {diagonal}"</li>
                        </ul>
                        {newPrice ? 
                            <div className="product-price">{newPrice}$ <span>{price}$</span></div> 
                            : <div className="product-price">{price}$</div>
                        } 
                    </div>
                </div>
                <Button disabled={!isAuth ||  isAdmin || amount <= modalAmount} onClick={()=>setModal(true)} variant="dark">
                    {amount <= modalAmount ? 'Немає в наявності' : 'В кошик' }
                </Button>
            </>
        )
    }
    
    return (
        <>
            <div className="product">
                {renderProduct(phone)}
            </div>
            {modalOpen ? 
                <Modal.Dialog className="product-buy">
                    <Modal.Header onClick={()=>setModal(false)} closeButton>
                        <Modal.Title>{phone.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="buy" onSubmit={(e)=>{
                            e.preventDefault();
                            addProduct(phone)
                        }}>
                            <input type="number" required min="0" onInput={(e)=>setModalAmount(e.target.value)} defaultValue="0"/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" form="buy" variant="secondary" >В кошик</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            : null}
            
        </>
    )
}
