import axios from 'axios';
import Register from './register';

export default function Login () {

    return {
        ...Register(),
        logged:{
            username: '',
            password: ''
        },
        checkToken() {
            axios
            .post(`/api/login`, this.logged)
            .then(this.logged === this.logged)
            alert('loggeddd')
            .then(userData => {
                console.log(userData);
                this.registered = userData.data
                this.login_message = 'Logged In!!!';
                this.open = true;
            })
            
            .catch(err => console.log(err))
        },

    }
}