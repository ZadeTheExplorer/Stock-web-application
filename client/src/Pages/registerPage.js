import React, {useState} from 'react';

export default function RegisterPage(){

    const [user, setUser] = useState({email:'', password:''});

    const FetchPostRegister = async () => {
        try {
            const register = await fetch(`http://131.181.190.87:3000/user/register`, {
                method: "POST",
                headers: { 
                    accept: "application/json", 
                    "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.username,
                    password: user.password
                })
            })
    
            const regiterDetail = await register.json();
    
            if(!regiterDetail.error){
                alert(regiterDetail.message + ". Click Login to start your journey!");
            } else {
                alert(regiterDetail.message);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setUser(prevUser => { return { password: prevUser.password, username: email } })
    }

    const onChangePassword = (e) => {
        const password = e.target.value;
        setUser(prevUser => { return { username: prevUser.username, password: password } })
    }

    const onBtnRegisterHandler = (event) => {
        event.preventDefault();
		FetchPostRegister();
	}
    return (
        <div className="rootContainer">
            <form id="log-form" className="formContainer">
                <h1>Register</h1>
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
                <button onClick={onBtnRegisterHandler}>Register</button>
                <p>Already have an account? <a style={{color: '#b2ed1c'}} href='/login'>Login!</a></p>
            </form>

        </div>
    )
}