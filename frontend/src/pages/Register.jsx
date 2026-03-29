import { registerSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from 'react-hook-form';

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
    function onSubmit(data) {
        console.log(data);
    }
    return <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="johndoe@gmail.com" {...register('email')}/>
            {errors.email && <span>{errors.email.message}</span>}
        </div>
        
        <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" {...register('password')}/>
        </div>
        <div>
            <label htmlFor="confirm">Confirm password:</label>
            <input type="password" id="confirm" {...register('confirmPassword')}/>
        </div>
        <button type="submit">Submit</button>
    </form>
}

export default RegisterForm;