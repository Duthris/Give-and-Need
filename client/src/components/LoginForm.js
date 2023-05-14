import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import * as Paper from 'react-native-paper';
import { useSelector } from "react-redux";
import store from "../store/store";
import { reSendVerificationCode as sendNeeder } from "../store/needer";
import { reSendVerificationCode as sendGiver } from "../store/giver";
import { showToast } from "../utils/functions";

export default function LoginForm({ handleSubmit, handleVerify, handleForgot, handleChange, codeSent, setCodeSent, visible, setVisible, forgotVisible, setForgotVisible, noEmail = false }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [code, setCode] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [userType, setUserType] = useState('needer');
    const loading = useSelector(state => state.auth.authLoading);
    const forgotLoading = useSelector(state => state.needer.forgotLoading || state.giver.forgotLoading);
    const changeLoading = useSelector(state => state.needer.changeLoading || state.giver.changeLoading);
    const verifyLoading = useSelector(state => state.needer.verifyLoading || state.giver.verifyLoading);
    const resendLoading = useSelector(state => state.needer.resendLoading || state.giver.resendLoading);

    const showDialog = () => {
        setVisible(true);
        setCode("")
    }
    const hideDialog = () => {
        setVisible(false);
        setCode("")
    }

    const showForgotDialog = () => {
        setCodeSent(false);
        setForgotVisible(true);
        setSecureTextEntry(true);
        setPassword("");
        setConfirmationPassword("");
        setCode("");
    }
    const hideForgotDialog = () => {
        setForgotVisible(false);
        setCodeSent(false);
        setSecureTextEntry(true);
        setPassword("");
        setConfirmationPassword("");
        setCode("");
    }

    const handle = (e) => {
        handleSubmit(e, email, password, userType);
    }

    const verify = (e) => {
        handleVerify(e, email, code, userType);
    }

    const forgot = (e) => {
        handleForgot(e, email, userType);
    }

    const change = (e) => {
        handleChange(e, email, code, password, userType);
    }

    const handleResendCode = () => {
        const send = userType === 'needer' ? sendNeeder : sendGiver;
        store.dispatch(send({ email: email })).then((res) => res.meta.requestStatus === 'fulfilled' && showToast('Code sent successfully!'));
    }

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    return (
        <SafeAreaView style={styles.container}>
            {!noEmail && (
                <>
                    <Paper.SegmentedButtons
                        style={styles.segmentedButtons}
                        value={userType}
                        onValueChange={setUserType}
                        buttons={[
                            {
                                value: 'needer',
                                label: 'Needer',
                                icon: 'account',
                                checkedColor: 'white',
                                style: { backgroundColor: userType === 'needer' ? 'tomato' : 'transparent' }
                            },
                            {
                                value: 'giver',
                                label: 'Giver',
                                icon: 'account',
                                checkedColor: 'white',
                                style: { backgroundColor: userType === 'giver' ? 'tomato' : 'transparent' }
                            },
                            {
                                value: 'restaurant',
                                label: 'Restaurant',
                                icon: 'store-marker',
                                checkedColor: 'white',
                                style: { backgroundColor: userType === 'restaurant' ? 'tomato' : 'transparent' }
                            }
                        ]}
                    />
                    <Text style={styles.label}>Email</Text>
                    <Paper.TextInput
                        label='E-mail'
                        placeholder='example@example.com'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        minLength={3}
                        style={styles.input}
                        theme={styles.inputColor}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        mode='outlined'
                        left={
                            <Paper.TextInput.Icon
                                icon="email"
                                style={{ marginTop: 15 }}
                            />
                        }
                    />
                </>
            )}


            {noEmail && <Text style={styles.error}>Please confirm your current password to change your password!</Text>}

            <Text style={styles.label}>Password</Text>
            <Paper.TextInput
                label='Password'
                placeholder='******'
                value={password}
                onChangeText={text => setPassword(text)}
                minLength={3}
                style={styles.input}
                theme={styles.inputColor}
                underlineColorAndroid={'rgba(0,0,0,0)'}
                mode='outlined'
                secureTextEntry={secureTextEntry}
                right={
                    <Paper.TextInput.Icon
                        icon={secureTextEntry ? "eye" : "eye-off"}
                        onPress={() => {
                            setSecureTextEntry(!secureTextEntry)
                            return false;
                        }}
                        style={{ marginTop: 15 }}
                    />
                }

                left={
                    <Paper.TextInput.Icon
                        icon="lock"
                        style={{ marginTop: 15 }}
                    />
                }
            />

            <Paper.Button
                mode="contained"
                loading={loading}
                onPress={handle}
                style={{
                    opacity: noEmail ? !password ? 0.5 : 1 : !password || !email ? 0.5 : 1,
                    backgroundColor: 'tomato',
                    marginTop: 15,
                    marginBottom: 5
                }}
                disabled={noEmail ? !password : !email || !password}
                icon="login"
            >
                <Text style={styles.buttonText}>{noEmail ? 'Confirm' : 'Login'}</Text>
            </Paper.Button>

            {!noEmail && (
                <>
                    {userType !== 'restaurant' && (
                        <>
                            <TouchableOpacity
                                onPress={showForgotDialog}
                            >
                                <Text style={styles.resetText}>Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={showDialog}
                            >
                                <Text style={styles.signUpText}>Haven't verified your account yet? Verify Now!</Text>
                            </TouchableOpacity>
                            <Paper.Dialog visible={forgotVisible} onDismiss={hideForgotDialog} style={{ borderRadius: 20, marginBottom: 150 }}>
                                <Paper.Dialog.Title style={{ color: 'tomato' }}>Forgot Password</Paper.Dialog.Title>
                                <Paper.Dialog.Content>
                                    {!codeSent ? (
                                        <>
                                            <Paper.SegmentedButtons
                                                style={[styles.segmentedButtons, { marginLeft: 15 }]}
                                                value={userType}
                                                onValueChange={setUserType}
                                                buttons={[
                                                    {
                                                        value: 'needer',
                                                        label: 'Needer',
                                                        icon: 'account',
                                                        checkedColor: 'white',
                                                        style: { backgroundColor: userType === 'needer' ? 'tomato' : 'transparent' }
                                                    },
                                                    {
                                                        value: 'giver',
                                                        label: 'Giver',
                                                        icon: 'account',
                                                        checkedColor: 'white',
                                                        style: { backgroundColor: userType === 'giver' ? 'tomato' : 'transparent' }
                                                    },
                                                ]}
                                            />
                                            <Paper.TextInput
                                                label='Email'
                                                onChangeText={text => setEmail(text)}
                                                style={styles.verifyInput}
                                                value={email}
                                                theme={styles.inputColor}
                                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                                mode='outlined'
                                                left={
                                                    <Paper.TextInput.Icon
                                                        icon="email"
                                                        style={{ marginTop: 15 }}
                                                    />
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Paper.TextInput
                                                label='Verification Code'
                                                onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
                                                style={[styles.verifyInput, { width: '95%' }]}
                                                value={code}
                                                theme={styles.inputColor}
                                                keyboardType="numeric"
                                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                                mode='outlined'
                                                left={
                                                    <Paper.TextInput.Icon
                                                        icon="numeric"
                                                        style={{ marginTop: 15 }}
                                                    />
                                                }
                                            />
                                            <Paper.TextInput
                                                label='Password'
                                                onChangeText={text => setPassword(text)}
                                                style={[styles.verifyInput, { width: '95%' }]}
                                                value={password}
                                                placeholder='******'
                                                secureTextEntry={secureTextEntry}
                                                right={
                                                    <Paper.TextInput.Icon
                                                        icon={secureTextEntry ? "eye" : "eye-off"}
                                                        onPress={() => {
                                                            setSecureTextEntry(!secureTextEntry)
                                                            return false;
                                                        }}
                                                        style={{ marginTop: 15 }}
                                                    />
                                                }
                                                theme={styles.inputColor}
                                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                                mode='outlined'
                                                left={
                                                    <Paper.TextInput.Icon
                                                        icon="lock"
                                                        style={{ marginTop: 15 }}
                                                    />
                                                }
                                            />
                                            <Paper.TextInput
                                                label='Password Confirmation'
                                                onChangeText={text => setConfirmationPassword(text)}
                                                style={[styles.verifyInput, { width: '95%' }]}
                                                value={confirmationPassword}
                                                theme={styles.inputColor}
                                                placeholder='******'
                                                secureTextEntry={secureTextEntry}
                                                right={
                                                    <Paper.TextInput.Icon
                                                        icon={secureTextEntry ? "eye" : "eye-off"}
                                                        onPress={() => {
                                                            setSecureTextEntry(!secureTextEntry)
                                                            return false;
                                                        }}
                                                        style={{ marginTop: 15 }}
                                                    />
                                                }
                                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                                mode='outlined'
                                                left={
                                                    <Paper.TextInput.Icon
                                                        icon="lock"
                                                        style={{ marginTop: 15 }}
                                                    />
                                                }
                                            />
                                            {resendLoading ? (
                                                <Paper.ActivityIndicator animating={true} color={'tomato'} size={'small'} style={{ marginTop: 20 }} />
                                            ) : (
                                                <>
                                                    <TouchableOpacity
                                                        onPress={handleResendCode}
                                                        style={{ marginTop: 20, marginLeft: 25, textAlign: 'center' }}
                                                    >
                                                        <Text style={styles.signUpText}>Haven't you received a code? Click here to resend!</Text>
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Paper.Dialog.Content>
                                <Paper.Dialog.Actions>
                                    <Paper.Button onPress={hideForgotDialog} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }}>Cancel</Paper.Button>
                                    <Paper.Button
                                        onPress={!codeSent ? forgot : change}
                                        textColor={'tomato'}
                                        style={{ width: '50%', alignSelf: 'center' }}
                                        disabled={!codeSent ? !isValidEmail(email) : code.length !== 6 || password.length < 6 || password !== confirmationPassword}
                                        loading={forgotLoading || changeLoading}
                                    >
                                        {!codeSent ? 'Send Code' : 'Change Password'}
                                    </Paper.Button>
                                </Paper.Dialog.Actions>
                            </Paper.Dialog>
                        </>
                    )}
                    <Paper.Dialog visible={visible} onDismiss={hideDialog} style={{ borderRadius: 20, marginBottom: 150 }}>
                        <Paper.Dialog.Title style={{ color: 'tomato' }}>Verify Account</Paper.Dialog.Title>
                        <Paper.Dialog.Content>
                            <Paper.SegmentedButtons
                                style={[styles.segmentedButtons, { marginLeft: 15 }]}
                                value={userType}
                                onValueChange={setUserType}
                                buttons={[
                                    {
                                        value: 'needer',
                                        label: 'Needer',
                                        icon: 'account',
                                        checkedColor: 'white',
                                        style: { backgroundColor: userType === 'needer' ? 'tomato' : 'transparent' }
                                    },
                                    {
                                        value: 'giver',
                                        label: 'Giver',
                                        icon: 'account',
                                        checkedColor: 'white',
                                        style: { backgroundColor: userType === 'giver' ? 'tomato' : 'transparent' }
                                    },
                                ]}
                            />
                            <Paper.TextInput
                                label='Email'
                                onChangeText={text => setEmail(text)}
                                style={styles.verifyInput}
                                value={email}
                                theme={styles.inputColor}
                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                mode='outlined'
                                left={<Paper.TextInput.Icon icon="email" style={{ marginTop: 15 }} />}
                            />
                            <Paper.TextInput
                                label='Verification Code'
                                onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
                                style={styles.verifyInput}
                                value={code}
                                theme={styles.inputColor}
                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                mode='outlined'
                                keyboardType='numeric'
                                left={<Paper.TextInput.Icon icon="numeric" style={{ marginTop: 15 }} />}
                            />
                            {resendLoading ? (
                                <Paper.ActivityIndicator animating={true} color={'tomato'} size={'small'} style={{ marginTop: 20 }} />
                            ) : (
                                <>
                                    <TouchableOpacity
                                        onPress={handleResendCode}
                                        style={{ marginTop: 20, marginLeft: 25, textAlign: 'center' }}
                                    >
                                        <Text style={styles.signUpText}>Haven't you received a code? Click here to resend!</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Paper.Dialog.Content>
                        <Paper.Dialog.Actions>
                            <Paper.Button onPress={hideDialog} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }}>Cancel</Paper.Button>
                            <Paper.Button
                                textColor={'tomato'}
                                style={{ width: '30%', alignSelf: 'center' }}
                                loading={verifyLoading}
                                onPress={verify}
                                disabled={isValidEmail(email) && code.length === 6 ? false : true}
                            >Verify</Paper.Button>
                        </Paper.Dialog.Actions>
                    </Paper.Dialog>
                </>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    },
    input: {
        width: '80%',
        height: 50,
    },
    inputColor: {
        colors: {
            primary: 'tomato',
            placeholder: '#ccc',
            text: '#000',
        }
    },
    button: {
        backgroundColor: 'tomato',
        marginTop: 15,
        marginBottom: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        fontSize: 20,
        margin: 10,
        color: 'red',
    },
    error: {
        margin: 10,
        fontSize: 15,
        color: 'red',
        borderWidth: 2,
        borderColor: 'red',
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    label: {
        fontSize: 15,
        margin: 5,
        fontWeight: 'bold'
    },
    resetText: {
        fontSize: 15,
        margin: 5,
        fontWeight: '500',
        color: '#039BE5'
    },
    signUpText: {
        fontSize: 15,
        margin: 5,
        fontWeight: '500',
        color: 'tomato'
    },
    segmentedButtons: {
        width: '90%',
        marginBottom: 10
    },
    verifyInput: {
        width: '80%',
        height: 50,
        alignSelf: 'center',
        marginTop: 10,
        borderColor: 'tomato',
    },
});