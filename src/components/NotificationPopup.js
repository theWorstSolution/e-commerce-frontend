


export default function NotificationPopup({text, okCallback}){
    return(<section>
        <p>Notification</p>
        <p>{text}</p>
        <button onClick={okCallback}>OK</button>
    </section>)
}