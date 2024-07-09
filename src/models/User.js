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
        console.log('first data about user');
        console.log(data.results[0]);
        Object.assign(this, data.results[0]);

        // if(data.results[0]){
        //     Object.assign(this, data.results[0]);
        // }else{
        //     // console.log('create new user');
        //     await userService.createUser()
        //     const { data: newData } = await userService.getUsers(filter, options)
        //     // console.log('second data about user');
        //     // console.log(newData);
        //     Object.assign(this, newData.results[0]);
        // }
        
        
    }
}