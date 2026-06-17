import { registerSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useFetcher } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import { generateErrorToast } from "../utils.jsx";
import styles from "./style.module.css"
import { RHFInput } from "../components/FormInputs.jsx";
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
    const fetcher = useFetcher();
    const navigate = useNavigate();
    async function sendFormData(data, e) {
        fetcher.submit(data, {
            method: "POST",
            action: '/register'
        });
    }
    const getErrorMsg = (prop) => (prop?.message ?? "placeholder");
    const activeErrorStyling = (error) => (error ? 'opacity-100' : 'opacity-0 pointer-events-none');

    return <div className="grow self-stretch flex flex-col justify-center items-center">
        <Toaster></Toaster>
        <form onSubmit={handleSubmit(sendFormData)} className="grow flex flex-col min-w-1/2 gap-8 justify-center">
            <RHFInput id="email" label="Email:" register={register} type="text" error={errors.email}/>
            <RHFInput id="password" label="Password:" type="password" register={register} error={errors.password}/>
            <RHFInput id="confirmPassword" label="Confirm Password:" type="password" register={register} error={errors.confirmPassword}/>
            <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
}

export default RegisterForm;