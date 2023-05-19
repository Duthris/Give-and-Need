import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Appbar, Card, Button, TextInput } from 'react-native-paper';
import React from 'react';
import store from '../store/store.js';
import moment from 'moment';
import { showToast } from '../utils/functions.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref } from "firebase/storage";
import { uploadImage, storage } from '../firebase.js';
import { EMPTY_PACKAGED_FOOD_PHOTO } from "@env";
import { makeDonation } from '../store/giver.js';

export default function MakeDonation({ navigation }) {
    const [photo, setPhoto] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [expirationDate, setExpirationDate] = React.useState("");

    const handleExpirationDateChange = (text) => {
        const formattedDate = text.replace(/[^\d]/g, '')
        let dateString = ''

        if (formattedDate.length > 0) {
            dateString = formattedDate.slice(0, 4)
        }
        if (formattedDate.length > 4) {
            const month = formattedDate.slice(4, 6)
            if (month <= 12) {
                dateString += `-${month}`
            } else {
                return
            }
        }
        if (formattedDate.length > 6) {
            const day = formattedDate.slice(6, 8)
            if (day <= 31) {
                dateString += `-${day}`
            } else {
                return
            }
        }

        setExpirationDate(dateString)
    }

    const pickPhoto = async () => {
        const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!canceled && assets.length > 0) {
            await setPhotoURL(assets[0].uri);
        }
    };

    const setPhotoURL = async (pickedPhoto) => {
        const imageName = `${name}`
        const storageRef = ref(storage, `packaged_foods/${imageName}`);
        await uploadImage(pickedPhoto, imageName, 'packaged_foods').then(() => {
            setTimeout(async () => {
                getDownloadURL(storageRef).then(url => {
                    setPhoto(url);
                }
                ).catch((error) => {
                    console.log(error);
                })
            }, 1000);
        })
    }

    const handleMakeDonation = async () => {
        const donationData = {
            name,
            photo,
            quantity,
            description,
            expirationDate: new Date(expirationDate),
        }

        if (name === '' || photo === '' || quantity === '' || description === '' || expirationDate === '') {
            showToast('Please fill in all fields!')
            return
        } else if (moment(expirationDate).isBefore(moment())) {
            showToast('Expiration date must be in the future!')
            return
        } else if (quantity <= 0) {
            showToast('Quantity must be greater than 0!')
            return
        } else {
            await store.dispatch(makeDonation(donationData)).then((res) => res.meta.requestStatus === 'fulfilled')
            showToast('Donation successfully is made!')
            navigation.navigate('Gives')
        }
    }

    React.useEffect(() => {
        if (expirationDate === 'Invalid date') {
            setExpirationDate('')
        }
    }, [expirationDate])

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} titleStyle={{ color: 'white' }} title="Make Donation" />
            </Appbar.Header>
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                scrollToOverflowEnabled={true}
                keyboardShouldPersistTaps='handled'
                enableAutomaticScroll={true}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                bounces={false}
                enableResetScrollToCoords={false}
                style={{ marginTop: photo === '' ? 50 : 0 }}
                resetScrollToCoords={{ y: 0, x: 0 }}
                keyboardOpeningTime={0}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Card style={styles.card}>
                    <TextInput
                        label='Name'
                        onChangeText={text => setName(text)}
                        style={styles.input}
                        value={name}
                        theme={styles.inputColor}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        mode='outlined'
                    />
                    <TextInput
                        label='Description'
                        onChangeText={text => setDescription(text)}
                        style={[styles.input, { height: 200 }]}
                        value={description}
                        numberOfLines={10}
                        multiline
                        theme={styles.inputColor}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        mode='outlined'
                    />
                    <TextInput
                        label='Quantity'
                        style={styles.input}
                        value={quantity}
                        theme={styles.inputColor}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        keyboardType='numeric'
                        onChangeText={text => setQuantity(text.replace(/[^0-9]/g, ''))}
                        mode='outlined'
                    />
                    <TextInput
                        label='Expiration Date'
                        style={styles.input}
                        placeholder='YYYY-MM-DD'
                        value={expirationDate}
                        theme={styles.inputColor}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        onChangeText={(text) => handleExpirationDateChange(text)}
                        maxLength={10}
                        mode='outlined'
                        keyboardType='numeric'
                    />
                    {photo !== '' && (
                        <TouchableOpacity onPress={pickPhoto} style={styles.cover}>
                            <Image source={{ uri: photo }} style={styles.photo} />
                        </TouchableOpacity>
                    )}
                    <TextInput
                        label='Choose an photo or paste a link...'
                        placeholder='https://example.com/photo.png'
                        onChangeText={text => setPhoto(text)}
                        style={styles.input}
                        value={photo === EMPTY_PACKAGED_FOOD_PHOTO ? '' : photo}
                        theme={styles.inputColor}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        mode='outlined'
                        left={
                            <TextInput.Icon
                                icon="image-move"
                                style={{ marginTop: 15 }}
                                onPress={pickPhoto}
                            />
                        }
                    />
                    <Card.Actions style={{ justifyContent: 'space-around' }}>
                        <Button
                            icon='plus-circle'
                            mode='contained'
                            style={name === '' || description === '' || quantity === '' || expirationDate === '' || photo === '' ? styles.disabledButtonStyle : styles.buttonStyle}
                            onPress={handleMakeDonation}
                            disabled={name === '' || description === '' || quantity === '' || expirationDate === '' || photo === ''}
                        >
                            Add
                        </Button>

                    </Card.Actions>
                </Card>
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        height: '100%',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
        color: 'tomato',
        fontWeight: 'bold',
    },
    cover: {
        height: 220,
        width: 320,
        alignSelf: 'center',
        backgroundColor: 'tomato',
        marginTop: 10,
        borderRadius: 15,
    },
    description: {
        textAlign: 'center',
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    scrollView: {
        height: '20%',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'tomato',
        borderRadius: 10,
        margin: 10,
    },
    chip: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'tomato',
        borderWidth: 1,
        borderColor: 'white',
        height: 50,
        borderRadius: 10,
    },
    chipText: {
        color: 'white',
        fontSize: 16,
    },
    buttonStyle: {
        width: '40%',
        backgroundColor: 'tomato',
        marginTop: 10
    },
    disabledButtonStyle: {
        width: '40%',
        backgroundColor: '#dcd8df',
        marginTop: 10
    },
    photo: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    input: {
        width: '80%',
        height: 50,
        alignSelf: 'center',
        marginTop: 10,
        borderColor: 'tomato',
    },
    inputColor: {
        colors: {
            primary: 'tomato',
            placeholder: '#ccc',
            text: '#000',
        }
    },
})