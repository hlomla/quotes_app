import axios from 'axios';

export default function Register () {
    return {
        register: {
            username: '',
            password: ''
        },

        registerUser(){
            axios
            .post(`localhost:4017/api/register`, this.register)
            .then(r => r.json())
                .then(userData => {
                    console.log(userData);
                    this.registered = userData.data

                }).catch(err => console.log(err))
        }
    }

}