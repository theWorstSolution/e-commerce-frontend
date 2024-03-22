import {getUser} from '../services/userService'

export default class User{
    async refresh(){
        console.log('await getUser();')
        const res = await getUser();
        console.log('await getUser();123')
        Object.assign(this, res.data)
        // console.log(this)
    }
}