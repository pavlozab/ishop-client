import React from "react";
import {Card, Row, Button, Col ,Modal} from 'react-bootstrap';
import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import './products.css';
import Service from "../../services/Service";

export default  function Products({renderList}){
    const {limit,filterData,search,setUpdate, updateOpen, setDiscountParam,discountParam, setLimit} = renderList;
    const s = new Service();
    const [products, setProductsList] = useState([]);
    const history  = useHistory();
    const [discount, setDiscount] = useState(0);


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        setDiscount(0);
        s.getAllProducts({limit, ...filterData, search, discountParam})
            .then((data) => {
                setProductsList(data)
                setDiscountParam(null)
            })
            .catch(err=>console.log(err))
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, [limit, filterData, search])

    const handleScroll = (event)=> {
        let scroller = window.innerHeight - 150 - document.querySelector('nav').offsetHeight + window.scrollY;
        if(scroller === document.querySelector('.main-con').offsetHeight) setLimit(prev=>prev+4);
    }

    const renderItems = (arr) => {
        let cols =  arr.map((product, index) => {
            const {price, newPrice, title, image, id} = product;
            return (
                <Col key={index}>
                    <Card className="card">
                        <Card.Img variant="top" src={`./assets/${image}`}/>
                        <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        {newPrice ? 
                        <Card.Subtitle>{newPrice}$ <span>{price}$</span></Card.Subtitle>
                        :
                        <Card.Subtitle>{price}$</Card.Subtitle>
                        }
                        <Card.Text>
                            Щоб прочитати детальну інформацію нажміть сюди
                        </Card.Text>
                        </Card.Body>
                        <Button onClick={()=> history.push(`/products/${id}`)} variant="dark">Інфо</Button>
                    </Card>
                </Col>
            )
        })
        let rows = []
        for (let i = 0; i <Math.ceil(cols.length/4); i++) rows[i] = cols.slice((i*4), (i*4) + 4);
        return rows.map((arr,index)=>  <Row xs={3} md={4} key={index*Math.random()} className="g-4">{arr}</Row>)
    }

    return (
        <>
            <div className="products">
                {renderItems(products)}
            </div>
            {updateOpen ?
                <Modal.Dialog className="product-update">
                    <Modal.Header onClick={()=>setUpdate(false)} closeButton>
                        <Modal.Title>Вкажіть знижку</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="update" onSubmit={(e)=>{
                            e.preventDefault();
                            setDiscountParam(discount)
                            e.target.reset();
                            setUpdate(false)
                        }}>
                            <label>Знижка:</label>
                            <input type="number" required min="0" placeholder="Знижка" max="99" onInput={(e)=>setDiscount(e.target.value)}/>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button type="submit" form="update" variant="secondary">Додати знижку</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            : null}
        </>
    )
}