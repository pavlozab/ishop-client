import React, {useState, useEffect} from 'react';
import Header from './components/header/header';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/register/register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Products from './components/products/products';
import Aside from './components/aside/aside';
import Login from './components/login/login';
import Product from './components/product/product';
import {Button } from "react-bootstrap";
import Cart from './components/cart/cart';
import Service from './services/Service';
import User from './components/user/user';
import Admin from './components/admin/admin';

const AuthCheck = (setter) => {
  const s = new Service();
  s.getOrders()
      .then(()=> {
          setter(true)
      })
      .catch(err=> {
          if(err.status===401) {
              localStorage.removeItem('token')
              setter(false)
          };
      })
}



function App() {
  const [isAuth, setAuth] = useState(!!localStorage.getItem('token'))
  
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState({});
  const [limit, setLimit] = useState(8);
  const [discountParam, setDiscountParam] = useState(null);

  const [updateOpen, setUpdate] = useState(false);

  useEffect(()=>{
    AuthCheck(setAuth)
  },[])

  

  return (
    <Router>
      <Header isAuth={isAuth} setAuth={setAuth} setSearch={setSearch}/>
      <div className="container-fluid main-con">

        <Switch>
          <Route path="/register">
            <Register/>
          </Route>
          <Route path="/login">
            <Login isAuth={isAuth} setAuth={setAuth}/>
          </Route>
          <Route exact={true} path="/products">
            <Products renderList={{setLimit,sort,updateOpen,setUpdate,filterData, limit,search,setDiscountParam,discountParam}}/>
            <Aside setUpdate={setUpdate} setSort={setSort} sort={sort} isAuth={isAuth} setAuth={setAuth} filterData={filterData} setFilterData={setFilterData}/>
            <Button className="load-more" variant="primary" onClick={()=>setLimit(limit+4)}>Завантажити ще</Button>
          </Route>
          <Route  path="/products/:id">
            <Product search={search} setFilterData={setFilterData}/>
          </Route>
          <Route  path="/cart">
            <Cart/>
          </Route>
          <Route  path="/user">
            <User/>
          </Route>
          <Route  path="/admin">
            <Admin/>
          </Route>
        </Switch>
      </div>
      <footer>footer</footer>
    </Router>
  );

}

export default App;
export {AuthCheck} ;
