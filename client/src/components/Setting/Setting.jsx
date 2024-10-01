import styles from './Setting.module.scss'

const Setting = ({ name, value, options, handleChange, children }) => {
    const dropdown = options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))

    return (
        <div className={styles.setting}>
            <div>
                <label htmlFor={name}>
                    {`${name.charAt(0).toUpperCase()}${name.slice(1)}:`}
                </label>
                <select name={name} value={value} onChange={handleChange}>
                    {dropdown}
                </select>
            </div>
            {children}
        </div>
    )
}

export default Setting