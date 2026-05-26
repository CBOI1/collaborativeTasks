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
    const inputStyle = "bg-gray-200 rounded-lg border-black/25 p-1 border-1 min-w-1/2";
    const inputContainerStyle = "flex flex-col";
    return <div className="flex flex-col self-stretch grow items-center">
        <form onSubmit={handleSubmit(handler)} className="grow flex flex-col gap-8 justify-center min-w-1/2">
            <div className={inputContainerStyle}>
                <label htmlFor="email" >Email:</label>
                <input type="text" id="email" {...register("email") } className={inputStyle}/>
            </div>
            <div className={inputContainerStyle}>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" {...register("password")} className={inputStyle}/>
            </div>
            <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
    
    
    

}

export default LoginForm;