import { loginSchema } from "./../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Toaster, toast } from "react-hot-toast";
import { useRouteLoaderData, useNavigate, useRevalidator, useFetcher} from "react-router";
import { generateErrorToast } from "../utils.jsx";
import { RHFInput } from "../components/FormInputs.jsx";


function LoginForm() {
    const fetcher = useFetcher();
    const {handleSubmit, register, formState : {errors}} = useForm({ resolver : zodResolver(loginSchema) })
    const navigate = useNavigate();
    const {revalidate} = useRevalidator();
    const handler = async (data) => {
        fetcher.submit(data, {
            method: "POST",
            action: "/login"
        });
    }
    return <div className="flex flex-col self-stretch grow items-center">
        <Toaster></Toaster>
        <form onSubmit={handleSubmit(handler)} className="grow flex flex-col gap-8 justify-center min-w-1/2">
            <RHFInput label={"Email:"} id={"email"} type="text" register={register} error={errors.email}/>
            <RHFInput label={"Password:"} id={"password"} type="password" register={register} error={errors.password}/>
            <button type="submit" className="self-center">Submit</button>
        </form>
    </div>
}

export default LoginForm;