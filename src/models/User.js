import {getUser} from '../services/userService'

export default class User{
    // constructor(){
    //     this.role = null;
    //     this.emailVerified = null;
    //     this.providerData = null;
    //     this.email = null;
    //     this.id = null;
    // }
    setId(uid) {
        this.uid = uid
    }
    async refresh(){
        console.log('id: ' + this.uid);
        const res = await getUser(this.uid)
        Object.assign(this, res.data);
        
        // console.log(this)
    }
}