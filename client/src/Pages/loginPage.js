import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import '../style.css';

export default function LoginPage({isLogged, setLoggedIn}){

    const [user, setUser] = useState({ username: "", password: "" });

    const onChangeEmail = (event) => {
        const email = event.target.value;
        setUser(prevUser => { return { password: prevUser.password, username: email } })
    }

    const onChangePassword = (event) => {
        const password = event.target.value;
        setUser(prevUser => { return { username: prevUser.username, password: password } })
    }

    const onBtnLoginHandler = (event) => {
        event.preventDefault();
        FetchPostLogin();
    }

    const FetchPostLogin = async () => {
        try {
            const login = await fetch("http://131.181.190.87:3000/user/login", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.username,
                    password: user.password
                })
            })
        
            const loginDetail = await login.json();

            if(!loginDetail.error) {
                
                console.log(loginDetail);
                localStorage.setItem('token', loginDetail.token);
                localStorage.setItem('username', user.username);

                alert("Login successfully!");
                setLoggedIn(true);
            } else {
                alert(loginDetail.message);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }

    if(isLogged){
        return <Redirect to="/"/>
    }

    return (
            <div className="rootContainer">
                
                <form id="log-form" className="formContainer">
                    <h1>Login</h1>
                    <input
                        name="email"
                        type="email"
                        placeholder="email"
                        onChange={onChangeEmail}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={onChangePassword}
                    />
                    <button onClick={onBtnLoginHandler}>Login</button>
                    <p>Not a member, <a style={{color: '#b2ed1c'}} href='/register'>click</a> to register</p>
                </form>
                
            </div>
    )
}