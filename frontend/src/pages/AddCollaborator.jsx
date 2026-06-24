import { Form } from "react-router-dom";
import { inviteSchema } from "../../schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "react-router-dom";
import { RHFInput, RHFSelect } from "../components/FormInputs";
import { useState, useEffect, useRef } from "react";
import useDisplayWhenFocused from "../hooks/useDisplayWhenFocused";
import styles from "./style.module.css"

function AddCollaborator() {
    const WAIT_HALF_SECOND = 500;
    const searchFetcher = useFetcher();
    const submitFetcher = useFetcher();
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const listRef = useRef(null);
    //debounce user input to limit fetch requests to server
    useEffect(() => {
        //return immediately on empty queries
        if (!searchInput.trim()) {
            setSearchResults([]);
            return;
        }
        const searchParams = new URLSearchParams({'email' : searchInput});
        const timeoutId = setTimeout(() => searchFetcher.load(`/search?${searchParams.toString()}`), WAIT_HALF_SECOND);
        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchInput]);
    //react to server response being loaded
    useEffect(() => {
        if (searchFetcher.state === "idle" && searchFetcher.data !== undefined) {
            setSearchResults(searchFetcher.data.users);
        }
    }, [searchFetcher.state, searchFetcher.data])

    //display server response body only when search input element is focused
    useDisplayWhenFocused(isFocused, listRef);

    return <div className="flex flex-col grow items-center justify-center" >
        <Form method="post" className="grow flex flex-col min-w-1/2 gap-8 justify-center">
            <div className={`${styles.inputContainer} relative`} >
                <label htmlFor="email">Email:</label>
                <input 
                    type="text"
                    id="email" 
                    className={styles.inputStyle}
                    name="email"
                    value={searchInput}
                    onChange={e => setSearchInput(e.currentTarget.value)}
                    autoComplete="off"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {   searchResults.length > 0 &&
                    <ul 
                        className="absolute z-1 bg-gray-50 rounded-lg p-1 border-b-black border-1 top-13" 
                        ref={listRef}
                        //prevent click from causing focus to be lost
                        onMouseDown={(e) => e.preventDefault()} 
                    >
                        {searchResults.map((elem, index, a) => 
                        <li
                            key={elem.id}
                            className="pointer"
                            onClick={e => {
                                setSearchInput(e.currentTarget.textContent);
                            }}
                        >
                            {elem.email}
                            {index + 1 < a.length && <hr className="-mx-1"/>}
                        </li>)}
                    </ul>
                }
            </div>
            <div>
                <label htmlFor="role" className={styles.inputContainer}>Select a role</label>
                <select id="role" name="role" className={`${styles.inputStyle} px-4`}>
                    <option value="MEMBER">Member</option>
                </select>
            </div>
            <button type="submit" className="self-center">Add</button>
        </Form>
    </div>
}

export default AddCollaborator;