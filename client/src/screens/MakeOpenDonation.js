import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { Appbar, Card, Button, TextInput, Switch } from 'react-native-paper';
import React from 'react';
import store from '../store/store.js';
import { showToast } from '../utils/functions.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref } from "firebase/storage";
import { uploadImage, storage } from '../firebase.js';
import { EMPTY_PACKAGED_FOOD_PHOTO } from "@env";
import { makeDonation } from '../store/restaurant.js';

export default function MakeOpenDonation({ navigation }) {
    const [photo, setPhoto] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [selfPickup, setSelfPickup] = React.useState(false);

    const toggleSwitch = () => setSelfPickup(!selfPickup);

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
        const storageRef = ref(storage, `open_foods/${imageName}`);
        await uploadImage(pickedPhoto, imageName, 'open_foods').then(() => {
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
            selfPickup
        }

        if (name === '' || photo === '' || quantity === '' || description === '') {
            showToast('Please fill in all fields!')
            return
        } else if (quantity <= 0) {
            showToast('Quantity must be greater than 0!')
            return
        } else {
            await store.dispatch(makeDonation(donationData)).then((res) => res.meta.requestStatus === 'fulfilled')
            showToast('Donation successfully is made!')
            navigation.navigate('RestaurantGives')
        }
    }

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
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Self Pickup:</Text>
                        <Switch color='tomato' value={selfPickup} onValueChange={toggleSwitch} style={styles.switch} />
                    </View>
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
                            style={name === '' || description === '' || quantity === '' || photo === '' ? styles.disabledButtonStyle : styles.buttonStyle}
                            onPress={handleMakeDonation}
                            disabled={name === '' || description === '' || quantity === '' || photo === ''}
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
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#79747e',
    },
    switchText: {
        fontSize: 20,
        marginTop: -3,
        color: 'tomato',
    },
    switch: {
        marginLeft: 10,
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
})