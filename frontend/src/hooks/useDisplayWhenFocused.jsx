import { useEffect } from "react";

function useDisplayWhenFocused(isFocused, displayRef) {
    useEffect(() => {
        if (isFocused && displayRef.current) {
            displayRef.current.style.setProperty('display', 'block');
        } else if (displayRef.current) {
            displayRef.current.style.setProperty('display', 'none'); 
        }
    }, [isFocused])
}

export default useDisplayWhenFocused;