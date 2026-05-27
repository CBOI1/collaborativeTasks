import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Toaster, toast } from "react-hot-toast";
import { useRouteLoaderData, useNavigate, useRevalidator} from "react-router";
import { generateErrorToast } from "../utils.jsx";


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
        const data = await res.json();
        generateErrorToast(data.errors);
        return false;
    }
    return true;
}

function LoginForm() {
    const {handleSubmit, register, formState : {errors}} = useForm({ resolver : zodResolver(loginSchema) })
    const navigate = useNavigate();
    const {revalidate} = useRevalidator();
    const handler = async (data) => {
        const successfulLogin = await login(data);
        if (successfulLogin) {
            revalidate();
            navigate('/dashboard');
        }
    }
    const errorStyle = "text-red-500 ";
    const inputStyle = "bg-gray-200 rounded-lg border-black/25 p-1 border-1";
    const inputContainerStyle = "flex flex-col";
    const getErrorMsg = (prop) => prop?.message ?? "placeholder";
    const activeErrorStyling = (error) => (error ? 'opacity-100' : 'opacity-0 pointer-events-none');

    return <div className="flex flex-col self-stretch grow items-center">
        <Toaster></Toaster>
        <form onSubmit={handleSubmit(handler)} className="grow flex flex-col gap-8 justify-center min-w-1/2">
            <div className={inputContainerStyle}>
                <label htmlFor="email" >Email:</label>
                <input type="text" id="email" {...register("email") } className={inputStyle}/>
                <span className={errorStyle + activeErrorStyling(errors.email)}>{getErrorMsg(errors.email)}</span>
            </div>
            <div className={inputContainerStyle}>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" {...register("password")} className={inputStyle}/>
                <span className={errorStyle + activeErrorStyling(errors.password)}>{getErrorMsg(errors.password)}</span>
            </div>
            <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
}

export default LoginForm;