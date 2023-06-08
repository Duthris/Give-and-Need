import Toast from 'react-native-toast-message'

export const showErrorToast = (error) => {
    if (error.includes('authorized')) return;
    else return Toast.show({
        text1: error,
        type: 'error',
        position: 'top',
    })
}