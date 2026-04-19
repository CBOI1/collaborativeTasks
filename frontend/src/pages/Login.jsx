import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router";;

function LoginForm() {
    const {handleSubmit, register, formState : {errors}} = useForm({ resolver : zodResolver(loginSchema) })
    const navigate = useNavigate();
    const loginSubmit = async (data, e) => {
        e.preventDefault(); // stop page reload
        const reqHeader = new Headers();
        reqHeader.append( "Content-Type", "application/json");
        const response = await fetch("/api/login", 
        {
            method: "POST",
            headers: reqHeader,
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        //handle response
        if (responseData.success) {
            navigate("/dashboard");
        } else {
            console.log(responseData.errors);
        }
    }
    return <form action="/api/login" method="POST" onSubmit={handleSubmit(loginSubmit)}>
        <div>
            <label htmlFor="email"></label>
            <input type="text" id="email" {...register("email")}/>
        </div>
        <div>
            <label htmlFor="email"></label>
            <input type="password" id="email" {...register("password")}/>
        </div>
        <button type="submit">Submit</button>
    </form>

}

export default LoginForm;