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

export const getIconNameByStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'account-clock-outline';
        case 'accepted':
            return 'account-check-outline';
        case 'rejected':
            return 'account-remove-outline';
        case 'onTheWay':
            return 'truck-delivery-outline';
        case 'inBox':
            return 'inbox-arrow-down';
        case 'takenFromBox':
            return 'inbox-remove';
        case 'completed':
            return 'check-circle-outline';
        default:
            return 'account-clock-outline';
    }
}

export const getTextByStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'accepted':
            return 'Accepted';
        case 'rejected':
            return 'Rejected';
        case 'onTheWay':
            return 'On the way';
        case 'inBox':
            return 'Put in box';
        case 'takenFromBox':
            return 'Taken from box';
        case 'completed':
            return 'Completed';
        default:
            return 'Pending';
    }
}

export const getBackgrounColorByStatus = (status) => {
    switch (status) {
        case 'pending':
            return '#DAC13F';
        case 'accepted':
            return '#B8E986';
        case 'rejected':
            return 'red';
        case 'onTheWay':
            return '#D3A640';
        case 'inBox':
            return '#A486E9';
        case 'takenFromBox':
            return '#78F8C3';
        case 'completed':
            return 'green';
        default:
            return 'tomato';
    }
}