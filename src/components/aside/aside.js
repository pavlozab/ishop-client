import React , { useState, useEffect }from "react";
import './aside.css';
import { Accordion, Form, ButtonGroup, Button} from "react-bootstrap";
import { AuthCheck } from "../../App";
import Service from "../../services/Service";


export default function Aside({sort,setSort,setUpdate,isAuth,setAuth,filterData,setFilterData}){
    const isAdmin = localStorage.getItem('role')==='admin'
    const [filters, setFilters] = useState({});
    const  s = new Service();
    const [colors, setColors] = useState([]); 
    const [diagonals, setDia] = useState([]); 
    const [memories, setMemo] = useState([]); 
    
    const createFilterList = (request, name, setter) => {
        request().then(({data})=>{
            let list = data.result.map((elem, index) => renderCheckbox(name, elem, index))
            setter(list);
        });
    }

    useEffect(()=>{
        // localStorage.setItem('role', 'admin');
        AuthCheck(setAuth);
        createFilterList(s.getColors, 'colors', setColors);
        createFilterList(s.getDiagonals, 'diagonals', setDia);
        createFilterList(s.getMemories, 'memories', setMemo);
    },[filterData])
    
    
    const makeQuery = (e, name, value) => {
        if(!filters[name]) filters[name]=[]
        if (e.target.checked) filters[name].push(value)
        else filters[name] = filters[name].filter(elem=>elem!==value);
        setFilters(filters)
    }

    const renderCheckbox = (name,value, index) => {
        return (
            <Form.Check 
                key={`${name}-${index}`}
                type='checkbox'
                id={`${name}-${index}`}
                label={value}
                onClick={(e) => makeQuery(e,name,value)}
            />
        )
    }

    return (
        <div className="aside">
            {isAuth && isAdmin ? <Button variant="dark" className="" onClick={()=>{setUpdate(true)}}>Додати знижку</Button> : null}
            <Form.Select onChange={(e)=> setSort(e.target.value)} aria-label="Сортувати за">
                <option disabled>Сортувати за</option>
                <option value="price ASC">Ціна ↑</option>
                <option value="price DESC">Ціна ↓</option>
                <option value="title ASC">Назва ↑</option>
                <option value="title DESC">Назва ↓</option>
            </Form.Select>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Пам'ять</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            {memories}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Діагональ екрану</Accordion.Header>
                    <Accordion.Body>
                        <Form>  
                            {diagonals}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Колір</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            {colors}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <ButtonGroup className="mb-2">
                <Button variant="dark" onClick={() => setFilterData({ filters, sort })}>Застосувати</Button>
                <Button variant="secondary" onClick={() => {
                    setSort('')
                    setFilters([]);
                    setFilterData({})
                }}>Скинути</Button>
            </ButtonGroup>
        </div>
    )
}