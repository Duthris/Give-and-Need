import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Card, Button, Chip } from 'react-native-paper';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import store from '../store/store.js';
import { cancelGive } from '../store/giver.js';
import { showToast } from '../utils/functions.js';
import { getBackgrounColorByStatus, getTextByStatus, getIconNameByStatus } from '../utils/functions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function OwnedPackagedGive({ navigation, route }) {
    const { give } = route.params;

    const handleCancelGive = () => {
        store.dispatch(cancelGive({ donationId: give.id })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.goBack());
        showToast('Give cancelled successfully');
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title={give.packagedFood.name} titleStyle={{ color: 'white' }} />
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
                    <Card.Title title={give.packagedFood.name} titleStyle={styles.title} />
                    <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(give.status) }]}
                        icon={() => <Icons name={getIconNameByStatus(give.status)} size={30} color={'white'} />}
                        mode='outlined'
                    >
                        <Text style={styles.chipText}>{getTextByStatus(give.status)}</Text>
                    </Chip>
                    {give.status !== 'rejected' && give.status !== 'completed' && (
                        <View
                            style={{
                                backgroundColor: 'tomato',
                                width: '90%',
                                alignSelf: 'center',
                                marginBottom: 10,
                                padding: 10,
                                borderRadius: 20,
                            }}
                        >
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => copyToClipboard(give.FoodBox[0].password)}>
                                <Icons name="alert" size={22} color="yellow" />
                                <Text style={{ color: 'white', marginLeft: 10, flexWrap: 'wrap', flexShrink: 1 }}>
                                    Password for the box is
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                        {' '}{give.FoodBox[0].password}{' '}
                                    </Text>
                                    <Icons name="content-copy" size={18} color="white" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <Card.Cover source={{ uri: give.packagedFood.photo }} style={styles.cover} />
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                        <Card.Content>
                            <Text style={styles.description}>{give.packagedFood.description}</Text>
                        </Card.Content>
                    </ScrollView>
                    <Card.Actions style={{ justifyContent: 'space-around' }}>
                        {give.status !== 'rejected' && give.status !== 'completed' && give.status !== 'inBox' && (
                            <Button
                                style={styles.buttonStyle}
                                mode='contained'
                                buttonColor='tomato'
                                textColor='white'
                                icon={() => <Icons name='cancel' size={20} color='white' />}
                                onPress={handleCancelGive}
                            >
                                Reject Give
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
})