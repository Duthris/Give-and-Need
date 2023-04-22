import { StyleSheet, SafeAreaView, Text, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Paper from 'react-native-paper';
import store from '../store/store.js';
import { openModal } from '../store/modal';
import { useSelector } from 'react-redux';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Home() {
    const [packagedFoods, setPackagedFoods] = React.useState([]);
    const loading = useSelector((state) => state.auth.loginLoading);
    const isLogged = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const handleLogout = () => {
        store.dispatch(openModal({
            name: 'logout',
        }));
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
            {isLogged && (
                <>
                    <Paper.Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 10}>
                        <Paper.Appbar.Content style={{ color: 'white' }} titleStyle={{ fontWeight: 'bold' }} color={'white'} title="Give & Need" />
                        <Paper.Appbar.Action icon="logout" color="white" onPress={handleLogout} />
                    </Paper.Appbar.Header>
                    <SafeAreaView style={styles.container}>
                        {isLogged && (
                            <>
                                <Image source={user.photo ? { uri: user.photo } : null} style={styles.logo} />
                                <Text style={styles.label}>Welcome to Give & Need - {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + ` ` + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}</Text>
                            </>
                        )}
                    </SafeAreaView>
                </>
            )}
        </KeyboardAwareScrollView>
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
    }
});