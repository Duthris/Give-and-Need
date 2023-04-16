import store from "../store/store";
import { closeModal, openModal } from "../store/modal";
import Toast from 'react-native-toast-message'
import { View, Dimensions } from "react-native";
import { uniqueNamesGenerator, names } from "unique-names-generator";

export const modalOpen = (name, data = false) => {
    store.dispatch(openModal({
        name,
        data
    }))
}

export const modalClose = () => {
    store.dispatch(closeModal());
}

export const showToast = (message, type, position) => {
    return Toast.show({
        text1: message,
        type: type,
        position: position,
    })
}

export function EmptyScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        </View>
    );
}

export function getWidth() {
    let width = Dimensions.get('window').width;

    width = width - 60;

    return width / 5;
}


export function generateRandomName() {
    return uniqueNamesGenerator({
        dictionaries: [names],
        length: 1,
        style: 'capital',
        separator: ' '
    })
}