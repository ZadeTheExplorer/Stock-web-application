import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css'
import {Button, Nav} from 'react-bootstrap';
import NavBar from 'react-bootstrap/Navbar'
import icon from '../media/trade-icon.png';


function NavigationBar({isLog,setIsLog}){
    const [token, setToken] = useState(localStorage.getItem('token'));
    const LogOut = () => {
        localStorage.clear();
        setToken(null);
        setIsLog(false);
        console.log('log out');
        alert('Log out!');
    }

    const logOutButton = () => {
        
        if (isLog || token !== null){
            const username = localStorage.getItem('username');
            return(
            <div style={{display: 'flex'}}>

                <NavBar.Text>Hi {username},{' '}</NavBar.Text>
                
                <Button variant='link' onClick={LogOut}>Logout</Button>
            </div>
            );
        }
    }

    return (
        <NavBar bg="dark" variant="dark" sticky='top'>
            <NavBar.Brand href="/"><img width='30px' height='30px' src={icon} alt='icon'/> Stock Prices</NavBar.Brand>
            <NavBar.Toggle aria-controls="responsive-navbar-nav" />

            <NavBar.Collapse id='responsive-navbar-nav'>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    
                </Nav>
                <Nav>
                    <Nav.Link id='loginPart' href="/login" style={(isLog || token !== null) ? {display: 'none'} : null}>Login</Nav.Link>
                    <Nav.Link id='loginPart' href="/register" style={(isLog || token !== null) ? {display: 'none'} : null}>Register</Nav.Link>
                </Nav>

                {logOutButton()}
                
            </NavBar.Collapse>

            

        </NavBar>
    );
}

export default NavigationBar;
