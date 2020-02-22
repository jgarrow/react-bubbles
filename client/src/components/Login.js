import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const Login = props => {
    // make a post request to retrieve a token from the api
    // when you have handled the token, navigate to the BubblePage route
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        axiosWithAuth()
            .post("/login", user)
            .then(res => {
                localStorage.setItem("token", res.data.payload);

                props.history.push("/bubbles");
            })
            .catch(err => console.log("Error logging in: ", err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                id="username"
                name="username"
                type="text"
                value={user.username}
                onChange={handleChange}
            />
            <label htmlFor="password">Password:</label>
            <input
                id="password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
