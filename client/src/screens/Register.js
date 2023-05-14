import { StyleSheet, SafeAreaView, Text } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Paper from 'react-native-paper';
import { generateRandomName } from '../utils/functions';
import store from '../store/store';
import { giverRegister, neederRegister } from '../store/auth';
import { useSelector } from 'react-redux';

export default function Register({ navigation }) {
    const [userType, setUserType] = useState('needer');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const loading = useSelector(state => state.auth.authLoading);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let register = userType === 'needer' ? neederRegister : giverRegister;
        store.dispatch(register({ firstName, lastName, email, password })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.navigate('Login'));
    }

    const passwordsAreNotEqual = () => {
        return password !== confirmPassword;
    }

    const handleRandomFirstName = () => {
        setFirstName(generateRandomName());
    }

    const handleRandomLastName = () => {
        setLastName(generateRandomName());
    }

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            scrollToOverflowEnabled={true}
            keyboardShouldPersistTaps='handled'
            enableAutomaticScroll={true}
            scrollEnabled={true}
            style={{ marginBottom: 100 }}
            showsVerticalScrollIndicator={true}
            bounces={false}
            enableResetScrollToCoords={false}
            resetScrollToCoords={{ y: 0, x: 0 }}
            keyboardOpeningTime={0}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <SafeAreaView style={styles.container}>
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
                    ]}
                />
                <Text style={styles.label}>First Name</Text>
                <Paper.TextInput
                    label='First Name'
                    placeholder='John'
                    value={firstName}
                    onChangeText={text => setFirstName(text)}
                    minLength={3}
                    style={styles.input}
                    theme={styles.inputColor}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    mode='outlined'
                    left={
                        <Paper.TextInput.Icon
                            icon="account"
                            style={{ marginTop: 15 }}
                        />
                    }
                    right={

                        <Paper.TextInput.Icon
                            icon="refresh"
                            style={{ marginTop: 15 }}
                            onPress={handleRandomFirstName}
                        />
                    }
                />

                <Text style={styles.label}>Last Name</Text>
                <Paper.TextInput
                    label='Last Name'
                    placeholder='Wick'
                    value={lastName}
                    onChangeText={text => setLastName(text)}
                    minLength={3}
                    style={styles.input}
                    theme={styles.inputColor}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    mode='outlined'
                    left={
                        <Paper.TextInput.Icon
                            icon="account"
                            style={{ marginTop: 15 }}
                        />
                    }
                    right={

                        <Paper.TextInput.Icon
                            icon="refresh"
                            style={{ marginTop: 15 }}
                            onPress={handleRandomLastName}
                        />
                    }
                />


                <Text style={styles.label}>E-mail</Text>
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

                {passwordsAreNotEqual() && <Text style={styles.error}>Passwords do not match!</Text>}
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

                <Text style={styles.label}>Confirm Password</Text>
                <Paper.TextInput
                    label='Confirm Password'
                    placeholder='******'
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
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
                    onPress={handleSubmit}
                    loading={loading}
                    style={{
                        opacity: passwordsAreNotEqual() || !firstName || !lastName || !email || !password || !confirmPassword ? 0.5 : 1,
                        backgroundColor: 'tomato',
                        marginTop: 15,
                        marginBottom: 5
                    }}
                    disabled={!firstName || !lastName || !email || !password || !confirmPassword || passwordsAreNotEqual()}
                    icon="account-edit"
                >
                    <Text style={styles.buttonText}>Register</Text>
                </Paper.Button>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
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
        padding: 12,
        margin: 12,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    label: {
        fontSize: 15,
        margin: 5,
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        margin: 10,
        fontSize: 15,
        borderWidth: 2,
        borderColor: 'red',
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    textInputOutlineStyle: {
        colors: {
            placeholder: 'white',
            text: 'white', primary: 'white',
            underlineColor: 'transparent',
            background: '#0f1a2b'
        }
    },
    loginText: {
        color: '#039BE5',
        fontSize: 15,
        margin: 5,
        fontWeight: 'bold',
    },
    segmentedButtons: {
        width: '90%',
        marginBottom: 10
    }
});