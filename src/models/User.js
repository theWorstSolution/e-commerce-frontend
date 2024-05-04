import userService from '../services/userService'

export default class User {
    // constructor(){
    //     this.role = null;
    //     this.emailVerified = null;
    //     this.providerData = null;
    //     this.email = null;
    //     this.id = null;
    // }
    setId(uid) {
        this.uid = uid
        this.id = uid
    }
    async refresh() {
        console.log('id: ' + this.uid);
        const filter = { _id: this.uid }
        const options = { populate: 'cart' }
        const { data } = await userService.getUsers(filter, options)
        console.log(data);
        Object.assign(this, data.results[0]);
    }
}