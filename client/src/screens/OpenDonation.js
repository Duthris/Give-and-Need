import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { Appbar, Card, Button, TextInput, Dialog, Portal, Paragraph, Switch } from 'react-native-paper';
import React from 'react';
import store from '../store/store.js';
import { showToast } from '../utils/functions.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref } from "firebase/storage";
import { uploadImage, storage } from '../firebase.js';
import { EMPTY_OPEN_FOOD_PHOTO } from "@env";
import { deleteDonation, updateDonation } from '../store/restaurant.js';

export default function OpenDonation({ navigation, route }) {
    const { donation } = route.params;
    const [photo, setPhoto] = React.useState(donation.photo || "");
    const [name, setName] = React.useState(donation.name || "");
    const [description, setDescription] = React.useState(donation.description || "");
    const [quantity, setQuantity] = React.useState(donation.quantity.toString() || "");
    const [visible, setVisible] = React.useState(false);
    const [selfPickup, setSelfPickup] = React.useState(donation.selfPickup || false);

    const toggleSwitch = () => setSelfPickup(!selfPickup);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

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
        const imageName = `${donation.id}_${donation.name}`
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

    const handleUpdateDonation = async () => {
        const updatedDonation = {
            donationId: donation.id,
            name: name,
            description: description,
            quantity: quantity,
            photo: photo,
            selfPickup: selfPickup,
        }

        await store.dispatch(updateDonation(updatedDonation)).then((res) => res.meta.requestStatus === 'fulfilled' && showToast('Donation updated successfully'));
    }

    const handleDeleteDonation = async () => {
        await store.dispatch(deleteDonation({ donationId: donation.id })).then((res) => res.meta.requestStatus === 'fulfilled' && showToast('Donation deleted successfully')).then(() => navigation.goBack());
    }

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title={donation.name} titleStyle={{ color: 'white' }} />
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
                    <TouchableOpacity onPress={pickPhoto} style={styles.cover}>
                        <Image source={{ uri: photo }} style={styles.photo} />
                    </TouchableOpacity>
                    <TextInput
                        label='Choose an photo or paste a link...'
                        placeholder='https://example.com/photo.png'
                        onChangeText={text => setPhoto(text)}
                        style={styles.input}
                        value={photo === EMPTY_OPEN_FOOD_PHOTO ? '' : photo}
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
                            icon='close'
                            mode='contained'
                            style={{ width: '40%', backgroundColor: 'tomato' }}
                            onPress={showDialog}
                        >
                            Remove
                        </Button>

                        <Button
                            icon='check'
                            mode='contained'
                            style={{ width: '40%', backgroundColor: 'tomato' }}
                            onPress={handleUpdateDonation}
                            disabled={name === '' || description === '' || quantity === ''}
                        >
                            Update
                        </Button>

                    </Card.Actions>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>Remove Donation</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Are you sure you want to remove this donation?</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={handleDeleteDonation} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }} icon='check'>Yes</Button>
                                <Button onPress={hideDialog} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }} icon='close'>No</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
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
        backgroundColor: 'tomato',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
    },
    disabledButtonStyle: {
        backgroundColor: 'grey',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
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