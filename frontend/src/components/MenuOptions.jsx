import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import { useRef } from "react";

function MenuOptions({className, onOutsideClick = () => {}, children}) {
    const menuRef = useRef(null);
    useDetectOutsideClick(menuRef, onOutsideClick);
    return <ul ref={menuRef} className={className}>
        {children}
    </ul>
}

export default MenuOptions;