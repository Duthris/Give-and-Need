import { SafeAreaView, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as Paper from 'react-native-paper';
import { showToast } from '../../utils/functions';
import store from '../../store/store';
import { logout } from '../../store/auth';

export default function LogoutModal({ close }) {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            close();
            store.dispatch(logout());
            navigation.navigate('Home');
            showToast('Logged out successfully', 'success', 'top');
        } catch (e) {
            showToast('Something went wrong, please try again later', 'error', 'top');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Are you sure you want to logout?</Text>
            <Paper.Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
                icon="logout"
            >
                <Text style={styles.buttonText}>Logout</Text>
            </Paper.Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100%",
    },
    button: {
        backgroundColor: 'tomato',
        marginTop: 15,
        marginBottom: 5
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    label: {
        fontSize: 18,
        color: 'tomato',
        fontWeight: 'bold'
    }

});
