import styles from "../pages/style.module.css";
function RHFInput({label, id, error, register, type, onChange = () => undefined}) {
    const getErrorMsg = (prop) => prop?.message ?? "placeholder";
    const activeErrorStyling = (error) => (error ? 'opacity-100' : 'opacity-0 pointer-events-none');
    return <div className={styles.inputContainer}>
        <label htmlFor={id} >{label}</label>
        <input type={type} id={id} {...register(id) } className={styles.inputStyle} onChange={onChange}/>
        <span className={`${styles.errorStyle} ${activeErrorStyling(error)}`}>{getErrorMsg(error)}</span>
    </div>
}

function RHFSelect({label, id, error, register, children}) {
    const getErrorMsg = (prop) => prop?.message ?? "placeholder";
    const activeErrorStyling = (error) => (error ? 'opacity-100' : 'opacity-0 pointer-events-none');
    return <div className={styles.inputContainer}>
        <label htmlFor={id} >{label}</label>
        <select id={id} {...register(id) } className={styles.inputStyle}>
            {children}
        </select>
        <span className={`${styles.errorStyle} ${activeErrorStyling(error)}`}>{getErrorMsg(error)}</span>
    </div>
}

export { RHFInput, RHFSelect };