import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";


export default function BuySuccess(){
    return(<div>
        <AdminHeader logoLink={'/'} />
        <div className="centerChildren">
            <div className="success-message">
            <h2>Transaction Succeeded!</h2>
            <p>Your transaction was completed successfully. The order status will be updated within 15 minutes.</p>
            <Link to={'/user/buy-history'}>View Order Details</Link>
            <p>Thank you! Have a nice day!</p>
        </div>
    </div>
    </div>)
}