import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useRouteLoaderData, useNavigate, useRevalidator} from "react-router";


const login = async (credentials) => {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });
    if (!res.ok) {
        throw new Error('Error: Login failed');
    }
}



function LoginForm() {
    const {handleSubmit, register, formState : {errors}} = useForm({ resolver : zodResolver(loginSchema) })
    const navigate = useNavigate();
    const {revalidate} = useRevalidator();
    const handler = async (data) => {
        await login(data);
        revalidate();
        navigate('/dashboard');
    }
    return <form onSubmit={handleSubmit(handler)}>
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