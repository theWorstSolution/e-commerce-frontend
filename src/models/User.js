import {getUser} from '../services/userService'

export default class User{
    // constructor(){
    //     this.role = null;
    //     this.emailVerified = null;
    //     this.providerData = null;
    //     this.email = null;
    //     this.id = null;
    // }
    async refresh(){
        const res = await getUser()
        Object.assign(this, res.data);
        
        // console.log(this)
    }
}