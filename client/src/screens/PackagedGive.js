import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Modal, Portal, Appbar, Card, Button, Chip, TextInput, IconButton } from 'react-native-paper';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import store from '../store/store.js';
import moment from 'moment';
import { showToast } from '../utils/functions.js';
// import { getBackgrounColorByStatus, getTextByStatus, getIconNameByStatus } from '../utils/functions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref } from "firebase/storage";
import { uploadImage, storage } from '../firebase.js';
import { EMPTY_PACKAGED_FOOD_PHOTO } from "@env";
import { updateGive } from '../store/giver.js';
// import { updatGiveStatusToNextStep } from '../store/giver.js';

export default function PackagedGive({ navigation, route }) {
    const { give } = route.params;
    const [photo, setPhoto] = React.useState(give.photo || "");
    const [name, setName] = React.useState(give.name || "");
    const [description, setDescription] = React.useState(give.description || "");
    const [quantity, setQuantity] = React.useState(give.quantity.toString() || "");
    const [expirationDate, setExpirationDate] = React.useState(moment(give.expirationDate).format('YYYY-MM-DD') || "");

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

    // const [visible, setVisible] = React.useState(false);

    // const showModal = () => setVisible(true);
    // const hideModal = () => setVisible(false);

    // const handleUpdateStatus = async (status) => {
    //     console.log(give.id);
    //     await store.dispatch(updatGiveStatusToNextStep({ donationId: give.id }));
    // }

    // const handleRemovePhoto = async () => {
    //     setPhoto(EMPTY_PACKAGED_FOOD_PHOTO);
    // }

    // https://www.micvac.com/wp-content/uploads/2015/12/mv_simply_delicious.png

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
        const imageName = `${give.id}_${give.name}`
        const storageRef = ref(storage, `packaged_foods/${imageName}`);
        await uploadImage(pickedPhoto, imageName).then(() => {
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

    const handleUpdateGive = async () => {
        const updatedGive = {
            packagedFoodId: give.id,
            name: name,
            description: description,
            quantity: quantity,
            expirationDate: new Date(expirationDate),
            photo: photo,
        }

        await store.dispatch(updateGive(updatedGive)).then((res) => res.meta.requestStatus === 'fulfilled' && showToast('Give updated successfully'));
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
                <Appbar.Content style={{ color: 'white' }} color={'white'} title={give.name} titleStyle={{ color: 'white' }} />
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


                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                                <Text style={styles.modalText}>Are you sure you want to remove the photo?</Text>
                                <Button onPress={handleUpdateStatus} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }} icon='check'>Yes</Button>
                                <Button onPress={hideModal} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }} icon='close'>No</Button>
                            </Modal>
                        </Portal>
                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(give.status) }]}
                            icon={() => <Icons name={getIconNameByStatus(give.status)} size={30} color={'white'} />}
                            mode='outlined'
                        >
                            <Text style={styles.chipText}>{getTextByStatus(give.status)}</Text>
                        </Chip>
                        <IconButton
                            icon="arrow-right"
                            containerColor={'#01b34a'}
                            iconColor={'white'}
                            size={30}
                            onPress={showModal}
                        />
                    </View> */}
                    <TouchableOpacity onPress={pickPhoto} style={styles.cover}>
                        <Image source={{ uri: photo }} style={styles.photo} />
                    </TouchableOpacity>
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
                            icon='check'
                            mode='contained'
                            style={{ width: '40%', backgroundColor: 'tomato' }}
                            onPress={handleUpdateGive}
                        >
                            Update
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
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 20,
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
})