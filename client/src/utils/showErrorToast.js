import Toast from 'react-native-toast-message'

export const showErrorToast = (error) => {
    return Toast.show({
        text1: error,
        type: 'error',
        position: 'top',
    })
}