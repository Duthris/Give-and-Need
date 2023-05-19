import { SafeAreaView, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Paper from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref } from "firebase/storage";
import { uploadImage, storage } from '../firebase.js';
import { EMPTY_AVATAR_URL } from "@env";
import { generateRandomName } from "../utils/functions";
import { updateGiver, changePasswordGiver as changeGiver, reSendVerificationCode as sendGiver } from "../store/giver";
import { updateNeeder, changePasswordNeeder as changeNeeder, reSendVerificationCode as sendNeeder } from "../store/needer";
import store from "../store/store";
import { updateUser } from "../store/auth";
import { showToast } from "../utils/functions";

export default function Settings({ navigation }) {
    const user = useSelector(state => state.auth.user);
    const role = useSelector(state => state.auth.role);
    const needer = useSelector(state => state.needer.needer);
    const giver = useSelector(state => state.giver.giver);
    const updateLoading = useSelector(state => state.needer.updateLoading || state.giver.updateLoading);
    const changeLoading = useSelector(state => state.needer.changeLoading || state.giver.changeLoading);
    const resendLoading = useSelector(state => state.needer.resendLoading || state.giver.resendLoading);
    const [firstName, setFirstName] = useState(user.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : "");
    const [lastName, setLastName] = useState(user.lastName ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1) : "");
    const [avatar, setAvatar] = useState(user.photo || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [changeVisible, setChangeVisible] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const showChangeDialog = () => {
        handleResendCode();
        showToast('We have sent you a verification code to your email address. Please check your inbox and enter the code below.');
        setChangeVisible(true);
    }
    const hideChangeDialog = () => {
        setChangeVisible(false);
        setVerificationCode("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = {
            firstName,
            lastName,
            photo: avatar,
        }
        let update = role === 'giver' ? updateGiver : updateNeeder;
        const successOperations = {
            toast: () => showToast(`Your profile has been updated successfully.`),
        }
        await store.dispatch(update(data)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                successOperations.toast();
            }
        })
    }

    React.useEffect(() => {
        if (role !== 'restaurant') {
            let updatedUser = role === 'giver' ? giver : needer;
            store.dispatch(updateUser(updatedUser));
        }
    }, [needer, giver])

    const handleUpdatePass = async (e) => {
        e.preventDefault();
        let data = {
            email: user.email,
            verificationCode: verificationCode,
            password,
        }
        let update = role === 'giver' ? changeGiver : changeNeeder;
        const successOperations = {
            toast: () => showToast(`Your password has been updated successfully.`),
            set: () => { setPassword(""); setConfirmPassword(""); setVerificationCode(""); setChangeVisible(false); }
        }
        await store.dispatch(update(data)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                successOperations.toast();
                successOperations.set();
            }
        })
    }

    const pickAvatar = async () => {
        const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!canceled && assets.length > 0) {
            await setAvatarURL(assets[0].uri);
        }
    };

    const setAvatarURL = async (pickedPhoto) => {
        const imageName = `${user.id}_${user.firstName}_${user.lastName}`
        const storageRef = ref(storage, `avatars/${imageName}`);
        await uploadImage(pickedPhoto, imageName, 'avatars').then(() => {
            setTimeout(async () => {
                getDownloadURL(storageRef).then(url => {
                    setAvatar(url);
                }
                ).catch((error) => {
                    console.log(error);
                })
            }, 1000);
        })
    }

    const handleRemoveAvatar = async () => {
        setAvatar(EMPTY_AVATAR_URL);
        await setAvatarURL(EMPTY_AVATAR_URL);
    }

    const handleRandomName = () => {
        setDisplayName(generateRandomName());
    }

    const handleResendCode = () => {
        const send = role === 'needer' ? sendNeeder : sendGiver;
        store.dispatch(send({ email: user.email })).then((res) => res.meta.requestStatus === 'fulfilled' && showToast('Code sent successfully!'));
    }

    return (
        <>
            <Paper.Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Paper.Appbar.Content style={{ color: 'white' }} color={'white'} title="Settings" />
            </Paper.Appbar.Header>
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
                {role !== 'restaurant' && (
                    <ScrollView>
                        <SafeAreaView style={styles.container}>
                            <>
                                <Text style={styles.title}>First Name</Text>
                                <Paper.TextInput
                                    label='First Name'
                                    placeholder='John'
                                    value={firstName}
                                    onChangeText={text => {
                                        const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
                                        setFirstName(capitalizedText);
                                    }}
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
                                            onPress={handleRandomName}
                                        />
                                    }
                                />

                                <Text style={styles.title}>Last Name</Text>
                                <Paper.TextInput
                                    label='Last Name'
                                    placeholder='Doe'
                                    value={lastName}
                                    onChangeText={text => {
                                        const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
                                        setLastName(capitalizedText);
                                    }}
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
                                            onPress={handleRandomName}
                                        />
                                    }
                                />

                                <Text style={styles.title}>Avatar</Text>
                                {avatar && avatar !== '' &&
                                    <TouchableOpacity onPress={pickAvatar}>
                                        <Image source={{ uri: avatar }} style={styles.avatar} />
                                    </TouchableOpacity>
                                }

                                <Paper.TextInput
                                    label='Choose avatar or paste link'
                                    placeholder='https://example.com/avatar.png'
                                    onChangeText={text => setAvatar(text)}
                                    style={styles.input}
                                    value={avatar === EMPTY_AVATAR_URL ? '' : avatar}
                                    theme={styles.inputColor}
                                    underlineColorAndroid={'rgba(0,0,0,0)'}
                                    mode='outlined'
                                    left={
                                        <Paper.TextInput.Icon
                                            icon="image-move"
                                            style={{ marginTop: 15 }}
                                            onPress={pickAvatar}
                                        />
                                    }
                                    right={
                                        <Paper.TextInput.Icon
                                            icon="image-remove"
                                            style={{ marginTop: 15 }}
                                            onPress={handleRemoveAvatar}
                                        />
                                    }
                                />



                                <Paper.Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    style={{
                                        opacity: firstName === '' || lastName === '' || avatar === ''
                                            || (firstName === (user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1))
                                                && lastName === (user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)) && avatar === user.photo) ? 0.5 : 1,
                                        backgroundColor: 'tomato',
                                        marginTop: 15,
                                        marginBottom: 5
                                    }}
                                    loading={updateLoading}
                                    disabled={firstName === '' || lastName === '' || avatar === '' || (firstName === (user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1))
                                        && lastName === (user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)) && avatar === user.photo)}
                                    icon="content-save-edit"
                                >
                                    <Text style={styles.buttonText}>Update</Text>
                                </Paper.Button>

                                <Paper.Divider style={{ marginTop: 10, marginBottom: 10, width: '80%' }} theme={{ colors: { color: 'tomato' } }} />

                                {password !== confirmPassword &&
                                    <Text style={styles.warning}>
                                        Passwords do not match!
                                    </Text>
                                }

                                <Text style={styles.title}>Password</Text>
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

                                <Text style={styles.title}>Confirm Password</Text>
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
                                    onPress={showChangeDialog}
                                    style={{
                                        opacity: !password && !confirmPassword || password !== confirmPassword ? 0.5 : 1,
                                        backgroundColor: 'tomato',
                                        marginTop: 15,
                                        marginBottom: 5
                                    }}
                                    disabled={!password && !confirmPassword || password !== confirmPassword}
                                    icon="content-save-edit"
                                >
                                    <Text style={styles.buttonText}>Change Password</Text>
                                </Paper.Button>
                                <Paper.Dialog visible={changeVisible} onDismiss={hideChangeDialog} style={{ borderRadius: 20, marginBottom: 150 }}>
                                    <Paper.Dialog.Title style={{ color: 'tomato' }}>Change Password</Paper.Dialog.Title>
                                    <Paper.Dialog.Content>
                                        <Paper.TextInput
                                            label='Verification Code'
                                            onChangeText={text => setVerificationCode(text.replace(/[^0-9]/g, ''))}
                                            style={styles.verifyInput}
                                            value={verificationCode}
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
                                        <Paper.Button onPress={hideChangeDialog} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }}>Cancel</Paper.Button>
                                        <Paper.Button
                                            textColor={'tomato'}
                                            style={{ width: '50%', alignSelf: 'center' }}
                                            loading={changeLoading}
                                            onPress={handleUpdatePass}
                                            disabled={verificationCode.length !== 6}
                                        >Change Password</Paper.Button>
                                    </Paper.Dialog.Actions>
                                </Paper.Dialog>
                            </>
                        </SafeAreaView>
                    </ScrollView>
                )}
            </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 45,
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
    title: {
        fontSize: 15,
        margin: 5,
        fontWeight: 'bold'
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
    warning: {
        margin: 10,
        fontSize: 15,
        color: 'red',
        borderWidth: 2,
        borderColor: 'red',
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        marginTop: 10
    },
    signUpText: {
        fontSize: 15,
        margin: 5,
        fontWeight: '500',
        color: 'tomato'
    },
    verifyInput: {
        width: '80%',
        height: 50,
        alignSelf: 'center',
        marginTop: 10,
        borderColor: 'tomato',
    },
});