import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Toaster, toast } from "react-hot-toast";
import { useRouteLoaderData, useNavigate, useRevalidator} from "react-router";
import { generateErrorToast } from "../utils.jsx";
import { RHFInput } from "../components/RHFInput.jsx";

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
    return <div className="flex flex-col self-stretch grow items-center">
        <Toaster></Toaster>
        <form onSubmit={handleSubmit(handler)} className="grow flex flex-col gap-8 justify-center min-w-1/2">
            <RHFInput label={"Email:"} id={"email"} register={register} error={errors.email}/>
            <RHFInput label={"Password:"} id={"password"} register={register} error={errors.password}/>
            <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
}

export default LoginForm;