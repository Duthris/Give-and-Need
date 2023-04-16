import React from 'react';
import { restaurantLogin, giverLogin, neederLogin } from '../store/auth';
import LoginForm from '../components/LoginForm';
import store from '../store/store.js';

export default function Login({ navigation }) {
    const handleSubmit = async (e, email, password, userType) => {
        e.preventDefault();
        let login = userType === 'needer' ? neederLogin : userType === 'giver' ? giverLogin : restaurantLogin;
        store.dispatch(login({
            email: email,
            password: password
        })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.replace('Main'));
    }
    
    return <LoginForm handleSubmit={handleSubmit} />;
}