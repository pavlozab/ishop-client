import React, {useEffect, useState} from 'react'
import './header.css'
import { Link, useLocation } from 'react-router-dom';
import {Navbar, Container, FormControl, Button, Form, Nav} from 'react-bootstrap'
import { useHistory } from 'react-router';
// import logo from '../../resources/images/logo.png';




const Header = ({setSearch, match, isAuth, setAuth}) => {
    const [inputValue, setValue] = useState('');
    const {pathname}= useLocation();
    const history = useHistory();
    let isAdmin = localStorage.getItem('role')==='admin';
    
    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container fluid>
                <Link className="navbar-brand" to="/products">iShop</Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                >
                <Link role="button" className={`nav-link ${isAuth && !isAdmin ? null : "disabled"}`} to="/cart">Кошик</Link>
                {!isAuth ? 
                <>
                    <Link  role="button" className="nav-link" to="/login">Увійти</Link>
                    <Link  role="button" className="nav-link" to="/register">Реєстрація</Link>
                </> : 
                <>
                    {isAdmin 
                    ? <Link  role="button" className="nav-link" to="/admin">Додати продукт</Link>
                    : <Link  role="button" className="nav-link" to="/user">Моя сторінка</Link>
                    }
                    <Nav.Link onClick={()=>{
                        setAuth(false)
                        localStorage.clear();
                        history.push('/login')
                    }}>Вийти</Nav.Link>
                </>}

                </Nav>
                <Form className="d-flex">
                    <FormControl
                    disabled={pathname!=='/products'}
                    type="search"
                    placeholder="Пошук"
                    className="me-2"
                    aria-label="Пошук"
                    onInput={(e)=>setValue(e.target.value)}
                    />
                    <Button variant="outline-success" onClick={()=> setSearch(inputValue)} disabled={pathname!=='/products'}>Пошук</Button>
                </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}
export default Header;