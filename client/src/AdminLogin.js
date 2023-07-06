import React, { useState } from 'react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UserContext from './UserContext';
import axios from "axios";


function AdminLogin() {

    const [errors, setErrors] = React.useState({});

    const [values, setValues] = React.useState({});

    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const { login } = useContext(UserContext);

    const handleLogin = (loggedInUserId) => {
        console.log("loggedInUserId id " + loggedInUserId);
        setUserId(loggedInUserId);
        login(loggedInUserId);
    };

    const loginUser = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.loginUserform;

        const newUser = {
            username: formName.username.value,
            password: formName.password.value
        }

        let tempValues = {};
        tempValues.username = newUser.username;
        tempValues.password = newUser.password;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.username = "";
        temp.password = "";


        if (newUser.username === "") {
            isvalid = false;
            temp.username = 'This field is required.';
        }

        if (newUser.password === "") {
            isvalid = false;
            temp.password = 'This field is required.';
        }


        if (isvalid) {
            await loginUserfunc(e, newUser);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    }

    // http://localhost:80/myrsvpapi/apiserver/login.php

    const loginUserfunc = async (e, newUser) => {

        let username = newUser.username;
        let password = newUser.password;

        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        response.json().then(response => {
            const parsedResponse = response;

            if (parsedResponse == "false") {
                alert("Log in failed! Please check your credentials");
            }
            else {
                handleLogin(parsedResponse.id)
                e.target.reset();
                navigate(`/events`);
                window.location.reload(false);
            }

        });

    }


    return (


        <div>

            <div id="homecontent">
                <hr id="linehr" />
            </div>

            <div class="twocolumnslogin">

                <div>
                    <img class="serprologinimg" src="cust1.jpg" ></img>
                </div>

                <Box component="form" id="loginUserform" name="loginUserform" onSubmit={loginUser} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                    <div class="signupformdiv">

                        <h3 id="formhead">Login</h3>

                        <TextField style={{
                            width: '80%'
                        }} required id="username" type="text" label="User Name" name="username" helperText={errors.username} defaultValue={values.username} /> <br />

                        <TextField style={{
                            width: '80%'
                        }} required id="password" type="password" label="Password" name="password" helperText={errors.password} defaultValue={values.password} /> <br />

                        <div>
                            <Button variant="contained" type="submit" class="registerbuttonstyle">Login</Button>
                        </div>

                    </div>
                </Box>

            </div>
        </div>

    )

}

export default AdminLogin;