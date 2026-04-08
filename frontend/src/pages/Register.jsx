import { registerSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from 'react-hook-form';
import {useState} from 'react';

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
    const [formData, updateForm] = useState({
        'email' : '',
        'password' : '',
        'confirmPassword' : ''
    });
    function handleChange(event) {
        updateForm({...formData, [event.target.name] : event.target.value})
    }
    async function sendFormData(data, e) {
        e.preventDefault(); // stop page reload
        const reqHeader = new Headers();
        reqHeader.append( "Content-Type", "application/json");
        const response = await fetch("/api/register", 
        {
            method: "POST",
            headers: reqHeader,
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        console.log(responseData);
};


    return <form onSubmit={handleSubmit(sendFormData)}>
        <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="johndoe@gmail.com" {...register('email', {onChange : handleChange})}/>
            {errors.email && <span className="text-red-500 ml-10">{errors.email.message}</span>}
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" {...register('password', {onChange : handleChange})}/>
            {errors.password && <span className="text-red-500 ml-10">{errors.password.message}</span>}
        </div>
        <div>
            <label htmlFor="confirm">Confirm password:</label>
            <input type="password" id="confirm" {...register('confirmPassword', {onChange : handleChange})}/>
            {errors.confirmPassword && <span className="text-red-500 ml-10">{errors.confirmPassword.message}</span>}
        </div>
        <button type="submit">Submit</button>
    </form>
}

export default RegisterForm;