import { registerSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import { generateErrorToast } from "../utils.jsx";
import { styles } from "./style.module.css"
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
    const getErrorMsg = (prop) => prop?.message ?? "placeholder";
    const activeErrorStyling = (error) => (error ? 'opacity-100' : 'opacity-0 pointer-events-none');

    return <div className="grow self-stretch flex flex-col justify-center items-center">
        <Toaster></Toaster>
        <form onSubmit={handleSubmit(sendFormData)} className="grow flex flex-col min-w-1/2 gap-8 justify-center">
                <div className={inputContainerStyle}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="johndoe@gmail.com" {...register('email')} className={styles.inputStyle}/>
                    <span className={styles.errorStyle + activeErrorStyling(errors.email)}>{getErrorMsg(errors.email)}</span>
                </div>
                <div className={inputContainerStyle}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" {...register('password')} className={styles.inputStyle}/>
                    <span className={styles.errorStyle + activeErrorStyling(errors.password)}>{getErrorMsg(errors.password)}</span>
                </div>
                <div className={inputContainerStyle}>
                    <label htmlFor="confirm">Confirm password:</label>
                    <input type="password" id="confirm" {...register('confirmPassword')} className={styles.inputStyle}/>
                    <span className={styles.errorStyle + activeErrorStyling(errors.confirmPassword)}>{getErrorMsg(errors.confirmPassword)}</span>
                </div>
                <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
}

export default RegisterForm;