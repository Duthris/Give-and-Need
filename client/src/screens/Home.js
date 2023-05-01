import { StyleSheet, SafeAreaView, Text, Image, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Paper from 'react-native-paper';
import store from '../store/store.js';
import { openModal } from '../store/modal';
import { useSelector } from 'react-redux';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import donation from '../../assets/donate.png';
import logo from '../../assets/giveandneed.png';
import jwt_decode from 'jwt-decode';
import { setRole } from '../store/auth.js';

export default function Home() {
    const isLogged = useSelector((state) => state.auth.token);
    const decoded = isLogged ? jwt_decode(isLogged) : null;
    const user = useSelector((state) => state.auth.user);
    const handleLogout = () => {
        store.dispatch(openModal({
            name: 'logout',
        }));
    }

    React.useEffect(() => {
        if (isLogged) {
            store.dispatch(setRole(decoded.role));
        }
    }, [decoded])

    return (
        <>
            <Paper.Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Paper.Appbar.Content style={{ color: 'white' }} titleStyle={{ fontWeight: 'bold' }} color={'white'} title="Give & Need" />
                {isLogged && <Paper.Appbar.Action icon="logout" color="white" onPress={handleLogout} />}
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
                <Image source={logo} style={styles.giveAndNeed} />
                {isLogged && (
                    <>
                        <SafeAreaView style={styles.container}>
                            {isLogged && (
                                <>
                                    <Image source={user.photo ? { uri: user.photo } : null} style={styles.logo} />
                                    <Text style={styles.label}>Welcome to Give & Need - {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + ` ` + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}</Text>
                                    {decoded.role === 'needer' && user.dailyNeedQuota > 0 && (
                                        <View
                                            style={{
                                                backgroundColor: 'tomato',
                                                width: '90%',
                                                alignSelf: 'center',
                                                marginBottom: 10,
                                                padding: 10,
                                                borderRadius: 20,
                                                marginTop: 10
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Icons name="alert" size={22} color="yellow" />
                                                <Text style={{ color: 'white', marginLeft: 10, flexWrap: 'wrap', flexShrink: 1 }}>
                                                    Your daily need quota is {user.dailyNeedQuota}.
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    {decoded.role === 'needer' && user.dailyNeedQuota === 0 && (
                                        <View
                                            style={{
                                                backgroundColor: 'tomato',
                                                width: '90%',
                                                alignSelf: 'center',
                                                marginBottom: 10,
                                                padding: 10,
                                                borderRadius: 20,
                                                marginTop: 10
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Icons name="alert" size={22} color="yellow" />
                                                <Text style={{ color: 'white', marginLeft: 10, flexWrap: 'wrap', flexShrink: 1 }}>
                                                    Your daily need quota is 0. You can't request any more items today.
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                        </SafeAreaView>
                    </>
                )}
                <Image source={donation} style={styles.donationImage} />
                {!isLogged && (
                    <>
                        <SafeAreaView style={styles.welcomeBox}>
                            <Text style={styles.welcome}>Welcome to Give & Need</Text>
                            <Text style={styles.loginOrRegister}>Please login or register to continue.</Text>
                        </SafeAreaView>
                    </>
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
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        margin: 10,
        width: '80%',
        borderRadius: 5
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
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        marginTop: 10
    },
    logo: {
        width: "100%",
        height: 100,
        marginBottom: 10,
        marginTop: 10,
        resizeMode: 'contain'

    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'tomato'
    },
    donationImage: {
        width: "100%",
        height: 300,
        marginBottom: 10,
        resizeMode: 'contain'
    },
    giveAndNeed: {
        width: "90%",
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    welcome: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10
    },
    loginOrRegister: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10
    },
    welcomeBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'tomato',
        borderRadius: 20,
        margin: 20,
    }
});