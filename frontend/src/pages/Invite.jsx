import { Form } from "react-router-dom";
import { inviteSchema } from "../../schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "react-router-dom";
import { RHFInput, RHFSelect } from "../components/FormInputs";
import { useState, useEffect } from "react";
import styles from "./style.module.css"

function Invite() {
    const WAIT_HALF_SECOND = 500;
    const searchFetcher = useFetcher();
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([])
    //debouncer
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
    //react to state being loaded
    useEffect(() => {
        if (searchFetcher.state === "idle" && searchFetcher.data !== undefined) {
            setSearchResults(searchFetcher.data.users);
        }
    }, [searchFetcher.state, searchFetcher.data])


    const onSubmit = () => {
        return null;
    }
    return <div className="flex flex-col grow items-center justify-center" >
        <Form onSubmit={onSubmit} className="grow flex flex-col min-w-1/2 gap-8 justify-center">
            <div className={styles.inputContainer}>
                <label htmlFor="email">Email:</label>
                <input 
                    type="text"
                    id="email" 
                    name="email"
                    value={searchInput}
                    onChange={e => setSearchInput(e.currentTarget.value)}
                />
            </div>
            
            <select id="role" name="role">
                <option value="">Select a role</option>
                <option value="EDIT">Edit</option>
                <option value="VIEW">View</option>
            </select>
            <button type="submit" className="self-center">Invite</button>
        </Form>
        <ul>
            {searchResults.map(elem => <li>{elem.email}</li>)}
        </ul>
    </div>
}

export default Invite;