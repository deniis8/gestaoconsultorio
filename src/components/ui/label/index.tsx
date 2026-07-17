import styles from "./label.module.css";

type LabelProp = {
 name: string,
 value?: string
}

export function Label({name, value} : LabelProp){
    return(
        <div className={styles['container-label']}>
            <span className={styles['title']}>{name}</span>
            <span className={styles['value']}>{value}</span>
        </div>
    )
}