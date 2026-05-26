import { registerSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router";
import toast, { Toaster } from 'react-hot-toast';

const ToastConfig = {
    position: "top-center",
    duration: 5000,
    removeDelay: 1000,
}

const generateErrorToast = (errors) => {
    return toast.custom(
        <div className="flex flex-col bg-gray-200 rounded-full p-4 border-black/50 border-1">
            <h2 className="font-bold">Please correct the following error(s):</h2>
            <ul>
                {errors.map(e => <li className="text-red-500">
                    {e.msg}
                </li>)}
            </ul>
        </div>
    , ToastConfig);
}

function RegisterForm() {
    const {
        register, 
        handleSubmit, 
        formState : {
            errors
        }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const navigate = useNavigate();
    async function sendFormData(data, e) {
        e.preventDefault(); // stop page reload
        const response = await fetch("/api/register", 
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        //handle response
        if (responseData.success) {
            navigate("/login");
        } else {
            generateErrorToast(responseData.errors);
        }
    }
    const inputStyle = "bg-gray-200 rounded-lg border-black/25 p-1 border-1 min-w-1/2";
    const errorStyle = "text-red-500 " ;
    const inputContainerStyle = "flex flex-col";
    const getErrorMsg = (prop) => prop?.message ?? "placeholder";
    const activeErrorStyling = (error) => (error ? 'opacity-100' : 'opacity-0 pointer-events-none');
    const createRange = (size) => (new Array(size)).fill(null);

    return <div className="grow  self-stretch flex flex-col justify-center items-center">
        <Toaster></Toaster>
        <form onSubmit={handleSubmit(sendFormData)} className="grow flex flex-col min-w-1/2 gap-8 justify-center">
                <div className={inputContainerStyle}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="johndoe@gmail.com" {...register('email')} className={inputStyle}/>
                    <span className={errorStyle + activeErrorStyling(errors.email)}>{getErrorMsg(errors.email)}</span>
                </div>
                <div className={inputContainerStyle}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" {...register('password')} className={inputStyle}/>
                    <span className={errorStyle + activeErrorStyling(errors.password)}>{getErrorMsg(errors.password)}</span>
                </div>
                <div className={inputContainerStyle}>
                    <label htmlFor="confirm">Confirm password:</label>
                    <input type="password" id="confirm" {...register('confirmPassword')} className={inputStyle}/>
                    <span className={errorStyle + activeErrorStyling(errors.confirmPassword)}>{getErrorMsg(errors.confirmPassword)}</span>
                </div>
                <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
}

export default RegisterForm;