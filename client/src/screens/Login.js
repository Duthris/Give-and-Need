import React from 'react';
import { restaurantLogin, giverLogin, neederLogin } from '../store/auth';
import LoginForm from '../components/LoginForm';
import store from '../store/store.js';
import { verifyGiver, changePasswordGiver, forgotPasswordGiver } from '../store/giver';
import { verifyNeeder, changePasswordNeeder, forgotPasswordNeeder } from '../store/needer';
import { showToast } from '../utils/functions';

export default function Login({ navigation }) {
    const [visible, setVisible] = React.useState(false);
    const [forgotVisible, setForgotVisible] = React.useState(false);
    const [codeSent, setCodeSent] = React.useState(false);

    const handleSubmit = async (e, email, password, userType) => {
        e.preventDefault();
        let login = userType === 'needer' ? neederLogin : userType === 'giver' ? giverLogin : restaurantLogin;
        store.dispatch(login({
            email: email,
            password: password
        })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.replace('Main'));
    }

    const handleVerify = async (e, email, verificationCode, userType) => {
        e.preventDefault();
        let verify = userType === 'needer' ? verifyNeeder : verifyGiver;
        const successOperations = {
            toast: () => showToast(`Your ${userType.charAt(0).toUpperCase() + userType.slice(1)} account verified!`),
            set: () => setVisible(false)
        }
        store.dispatch(verify({
            email: email,
            verificationCode: verificationCode
        })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                successOperations.toast();
                successOperations.set();
            }
        })
    }

    const handleForgot = async (e, email, userType) => {
        e.preventDefault();
        let forgot = userType === 'needer' ? forgotPasswordNeeder : forgotPasswordGiver;
        const successOperations = {
            toast: () => showToast(`Verification code sent to ${email}`),
            set: () => setForgotVisible(false),
            sent: () => setCodeSent(true)
        }
        store.dispatch(forgot({
            email: email
        })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                successOperations.toast();
                successOperations.sent();
            }
        })
    }

    const handleChange = async (e, email, verificationCode, password, userType) => {
        e.preventDefault();
        let change = userType === 'needer' ? changePasswordNeeder : changePasswordGiver;
        const successOperations = {
            toast: () => showToast(`Your ${userType.charAt(0).toUpperCase() + userType.slice(1)} account password changed!`),
            set: () => setForgotVisible(false),
            reset: () => setCodeSent(false)
        }
        store.dispatch(change({
            email: email,
            verificationCode: verificationCode,
            password: password
        })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                successOperations.toast();
                successOperations.set();
                successOperations.reset();
            }
        })
    }

    return <LoginForm
        handleSubmit={handleSubmit}
        handleVerify={handleVerify}
        visible={visible}
        setVisible={setVisible}
        forgotVisible={forgotVisible}
        setForgotVisible={setForgotVisible}
        handleForgot={handleForgot}
        handleChange={handleChange}
        codeSent={codeSent}
        setCodeSent={setCodeSent}
    />;
}