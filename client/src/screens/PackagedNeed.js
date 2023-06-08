import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Card, Button, Chip } from 'react-native-paper';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { markNeedAsCompleted } from '../store/needer.js';
import store from '../store/store.js';
import { showToast } from '../utils/functions.js';
import { getBackgrounColorByStatus, getTextByStatus, getIconNameByStatus } from '../utils/functions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Clipboard from 'expo-clipboard';

export default function PackagedNeed({ navigation, route }) {
    const { need } = route.params;

    const handleMarkNeedAsCompleted = () => {
        store.dispatch(markNeedAsCompleted({ id: need.id })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.goBack())
        showToast(`Marked ${need.packagedFood.name} need as completed`);
    }

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(need.FoodBox[0].password);
        showToast('Password copied to clipboard');
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title={need.packagedFood.name} titleStyle={{ color: 'white' }} />
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
                    <Card.Title title={need.packagedFood.name} titleStyle={styles.title} />
                    <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(need.status) }]}
                        icon={() => <Icons name={getIconNameByStatus(need.status)} size={30} color={'white'} />}
                        mode='outlined'
                    >
                        <Text style={styles.chipText}>{getTextByStatus(need.status)}</Text>
                    </Chip>
                    {need.status === 'inBox' && (
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
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => copyToClipboard(need.FoodBox[0].password)}>
                                <Icons name="alert" size={22} color="yellow" />
                                <Text style={{ color: 'white', marginLeft: 10, flexWrap: 'wrap', flexShrink: 1 }}>
                                    Your need is in the box. You can pick it up from the food box with the code
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                        {' '}{need.FoodBox[0].password}{' '}
                                    </Text>
                                    <Icons name="content-copy" size={18} color="white" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {need.status !== 'completed' && moment(need.packagedFood.expirationDate).diff(moment(), 'days') <= 7 && moment(need.packagedFood.expirationDate).diff(moment(), 'days') > 0 && (
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
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icons name="alert" size={22} color="yellow" />
                                <Text
                                    style={{
                                        color: 'white',
                                        marginLeft: 10,
                                        flexWrap: 'wrap',
                                        flexShrink: 1,
                                    }}
                                >
                                    This item will expire in{' '}
                                    {moment(need.packagedFood.expirationDate).fromNow()}. Please use it
                                    as soon as possible when you receive it.
                                </Text>
                            </View>
                        </View>
                    )}
                    {moment(need.packagedFood.expirationDate).diff(moment(), 'days') <= 0 && (
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
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icons name="alert" size={22} color="yellow" />
                                <Text
                                    style={{
                                        color: 'white',
                                        marginLeft: 10,
                                        flexWrap: 'wrap',
                                        flexShrink: 1,
                                    }}
                                >
                                    This item has expired. Please do not use it if you have not used it yet.
                                </Text>
                            </View>
                        </View>
                    )
                    }
                    <Card.Cover source={{ uri: need.packagedFood.photo }} style={styles.cover} />
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                        <Card.Content>
                            <Text style={styles.description}>{need.packagedFood.description}</Text>
                        </Card.Content>
                    </ScrollView>
                    <Card.Actions style={{ justifyContent: 'space-around' }}>
                        {need.status !== 'completed' && (
                            <Button
                                mode={'elevated'}
                                icon={() => <Icons name="check-circle" size={22} color="white" />}
                                style={need.status === 'takenFromBox' || need.status === 'inBox' ? styles.buttonStyle : styles.disabledButtonStyle}
                                disabled={!(need.status === 'takenFromBox' || need.status === 'inBox')}
                                onPress={handleMarkNeedAsCompleted}
                            >
                                <Text style={{ color: 'white', fontWeight: 600 }}>Mark as completed</Text>
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