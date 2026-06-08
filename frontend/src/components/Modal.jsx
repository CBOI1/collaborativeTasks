import { useEffect, useRef } from "react";
import { FiXCircle } from "react-icons/fi";

function Modal({title, confirmText, onConfirm, onClose, isOpen, id}) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            dialogRef.current.showModal()
        }
        if (!isOpen) {
            dialogRef.current.close();
        }
    }, [isOpen]);
    return <dialog id={id} ref={dialogRef} className="fixed top-1/2 right-auto bottom-auto left-1/2 -translate-1/2 p-5 open:flex flex-col gap-2">
        <div className="p-2 text-rose-500 shrink-0 flex flex-row justify-end"><FiXCircle onClick={onClose}></FiXCircle></div>
        <h2>{title}</h2>
        <button onClick={async () => {
            await onConfirm();
        }}>
          {confirmText}  
        </button>
    </dialog>
}

export default Modal;