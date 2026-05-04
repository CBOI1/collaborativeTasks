import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from "react-router";
import { useAuthContext } from "../AuthContext";

function LoginForm() {
    const {handleSubmit, register, formState : {errors}} = useForm({ resolver : zodResolver(loginSchema) })
    const {login} = useAuthContext();
    const navigate = useNavigate();
    const loginSubmit = async (data) => {
        await login(data);
        navigate('/dashboard');
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