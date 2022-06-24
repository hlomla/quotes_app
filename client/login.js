import axios from 'axios';
import Register from './register';

export default function Login () {

    return {
        ...Register(),
        login_message:'',
        open: false,

        checkToken() {
            axios
            .post(`/api/login`, this.registerUser())
            .then(r => this.registerUser())
            alert('loggeddd')
            .then(() => {
                console.log(userData);
                this.registered = userData.data
                this.login_message = 'Logged In!!!';
                this.open = true;
            })
            
            .catch(err => console.log(err))
        },

    }
}