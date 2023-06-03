import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Appbar, Card, Button, Chip } from 'react-native-paper';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { markNeedAsCompleted } from '../store/needer.js';
import store from '../store/store.js';
import { showToast } from '../utils/functions.js';
import { getBackgrounColorByStatus, getTextByStatus, getIconNameByStatus } from '../utils/functions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RestaurantNeed({ navigation, route }) {
    const { need } = route.params;

    const handleMarkNeedAsCompleted = () => {
        store.dispatch(markNeedAsCompleted({ id: need.id })).then((res) => res.meta.requestStatus === 'fulfilled' && navigation.goBack())
        showToast(`Marked ${need.openFood.name} need as completed`);
    }

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title={need.openFood.name} titleStyle={{ color: 'white' }} />
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
                    <Card.Title title={need.openFood.name} titleStyle={styles.title} />
                    <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(need.status) }]}
                        icon={() => <Icons name={getIconNameByStatus(need.status)} size={30} color={'white'} />}
                        mode='outlined'
                    >
                        <Text style={styles.chipText}>{getTextByStatus(need.status)}</Text>
                    </Chip>
                    {!need.openFood.selfPickup && need.status === 'onTheWay' && (
                        <View
                            style={{
                                backgroundColor: 'tomato',
                                width: '90%',
                                alignSelf: 'center',
                                marginBottom: 10,
                                padding: 10,
                                borderRadius: 20,
                                flexDirection: 'row',
                            }}
                        >
                            <Icons name="alert" size={22} color="yellow" />
                            <Text style={{ color: 'white', textAlign: 'center' }}>
                                Your need is on the way. It will be delivered to your address soon.
                            </Text>
                        </View>
                    )}
                    <Card.Cover source={{ uri: need.openFood.photo }} style={styles.cover} />
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                        <Card.Content>
                            <Text style={styles.description}>{need.openFood.description}</Text>
                        </Card.Content>
                    </ScrollView>
                    {need.openFood.selfPickup && (
                        <>
                            <Text style={{ textAlign: 'center', color: 'tomato', fontWeight: 600, marginTop: 10, fontSize: 20 }}>Restaurant address to pick up</Text>
                            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                                <Card.Content>
                                    <Text style={styles.description}>{need.openFood.restaurantUser.address}</Text>
                                </Card.Content>
                            </ScrollView>
                        </>
                    )}
                    <Card.Actions style={{ justifyContent: 'space-around' }}>
                        {need.status !== 'completed' && (
                            <Button
                                mode={'elevated'}
                                icon={() => <Icons name="check-circle" size={22} color="white" />}
                                style={need.openFood.selfPickup ? need.status === 'takenFromBox' || need.status === 'inBox' ? styles.buttonStyle : styles.disabledButtonStyle : need.status === 'onTheWay' ? styles.buttonStyle : styles.disabledButtonStyle}
                                disabled={need.openFood.selfPickup ? !(need.status === 'takenFromBox' || need.status === 'inBox') : need.status !== 'onTheWay'}
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