import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

function LoginForm() {
    const {handleSubmit, register, formState : {errors}} = useForm({ resolver : zodResolver(loginSchema) })
    const navigate = useNavigate();
    const {user, setUser} = useContext(AuthContext);
    const loginSubmit = async (data, e) => {
        e.preventDefault(); // stop page reload
        const reqHeader = new Headers();
        reqHeader.append( "Content-Type", "application/json");
        console.log("before fetch...");
        const response = await fetch("/api/login", 
        {
            method: "POST",
            headers: reqHeader,
            body: JSON.stringify(data),
            credentials: "include"
        });
        console.log("after fetch...");
        const responseData = await response.json();
        setUser(responseData.user);
        //handle response
        if (responseData.user !== null) {
            navigate("/dashboard");
        } else {
            console.log(responseData.errors);
        }
    }
    return <form onSubmit={handleSubmit(loginSubmit)}>
        <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" {...register("email")}/>
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" {...register("password")}/>
        </div>
        <button type="submit">Submit</button>
    </form>

}

export default LoginForm;