import {toast} from 'react-hot-toast';
import Role from './constants';
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

export {generateErrorToast};