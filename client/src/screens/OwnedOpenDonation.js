import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Portal, Appbar, Card, Button, Chip, IconButton } from 'react-native-paper';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import store from '../store/store.js';
import { cancelOwnedDonation, updateDonationStatusToNextStep } from '../store/restaurant.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getBackgrounColorByStatus, getTextByStatus, getIconNameByStatus, showToast } from '../utils/functions';

export default function OwnedOpenDonation({ navigation, route }) {
    const { donation } = route.params;
    let address = !donation.openFood.selfPickup && donation.addressId !== null && donation.neederUser?.Address?.length > 0 && donation.neederUser.Address.find((address) => address.id === donation.addressId);
    console.log(address);

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleUpdateStatus = async (status) => {
        await store.dispatch(updateDonationStatusToNextStep({ donationId: donation.id })).then((res) => res.meta.requestStatus === 'fulfilled' && hideModal())
        navigation.goBack();
        showToast('Donation status updated successfully');
    }

    const handleCancelDonation = () => {
        store.dispatch(cancelOwnedDonation({ donationId: donation.id })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.goBack());
        showToast('Donation cancelled successfully');
    };

    const nextStepCondition = donation.openFood.selfPickup ? (donation.status === 'pending' || donation.status === 'accepted') : (donation.status === 'pending' || donation.status === 'accepted' || donation.status === 'onTheWay');

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title={donation.openFood.name} titleStyle={{ color: 'white' }} />
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
                    <Card.Title title={donation.openFood.name} titleStyle={styles.title} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                                <Text style={styles.modalText}>Are you sure you want to set the status to next step?</Text>
                                <Button onPress={handleUpdateStatus} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }} icon='check'>Yes</Button>
                                <Button onPress={hideModal} textColor={'tomato'} style={{ width: '30%', alignSelf: 'center' }} icon='close'>No</Button>
                            </Modal>
                        </Portal>
                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(donation.status) }]}
                            icon={() => <Icons name={getIconNameByStatus(donation.status)} size={30} color={'white'} />}
                            mode='outlined'
                        >
                            <Text style={styles.chipText}>
                                {
                                    donation.status === 'inBox' ? 'Ready' : donation.status === 'takenFromBox' ? 'Delivered' : getTextByStatus(donation.status)
                                }
                            </Text>
                        </Chip>
                        {nextStepCondition && (
                            <IconButton
                                icon="arrow-right"
                                containerColor={'#01b34a'}
                                iconColor={'white'}
                                size={30}
                                onPress={showModal}
                            />
                        )}
                    </View>
                    <Card.Cover source={{ uri: donation.openFood.photo }} style={styles.cover} />
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                        <Card.Content>
                            <Text style={styles.description}>{donation.openFood.description}</Text>
                        </Card.Content>
                    </ScrollView>
                    {address && (
                        <>
                            <Text style={styles.addressText}>Needer Address to be Delivered</Text>
                            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                                <Card.Content>
                                    <Text style={styles.description}>{address.address}</Text>
                                </Card.Content>
                            </ScrollView>
                        </>

                    )}
                    <Card.Actions style={{ justifyContent: 'space-around' }}>
                        {donation.status !== 'rejected' && donation.status !== 'completed' && donation.status !== 'inBox' && donation.status !== 'takenFromBox' && (
                            <Button
                                style={styles.buttonStyle}
                                mode='contained'
                                buttonColor='tomato'
                                textColor='white'
                                icon={() => <Icons name='cancel' size={20} color='white' />}
                                onPress={handleCancelDonation}
                            >
                                Reject Donation
                            </Button>
                        )}
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
    addressText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        color: 'tomato',
        fontWeight: 'bold',
    },
})