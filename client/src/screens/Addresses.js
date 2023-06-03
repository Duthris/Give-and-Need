import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Appbar, List, ActivityIndicator, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAddresses, addAddress, deleteAddress, updateAddress } from '../store/needer';
import store from '../store/store';
import { showToast } from '../utils/functions';
import { useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function Addresses({ navigation }) {
    const addresses = useSelector(state => state.needer.addresses);
    const loadingAddresses = useSelector(state => state.needer.loadingAddresses);

    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [visibleAdd, setVisibleAdd] = React.useState(false);
    const [visibleDelete, setVisibleDelete] = React.useState(false);
    const [visibleUpdate, setVisibleUpdate] = React.useState(false);
    const [selectedAddress, setSelectedAddress] = React.useState(null);

    const showAdd = () => {
        setAddress('');
        setName('');
        setVisibleAdd(true);
    }
    const hideAdd = () => {
        setVisibleAdd(false);
        setName('');
        setAddress('');
    }

    const showDelete = (address) => {
        setVisibleDelete(true);
        setSelectedAddress(address);
    }
    const hideDelete = () => {
        setVisibleDelete(false);
        setSelectedAddress(null);
    }

    const showUpdate = (item) => {
        setName(item.name);
        setAddress(item.address);
        setVisibleUpdate(true);
        setSelectedAddress(item);
    }

    const hideUpdate = () => {
        setVisibleUpdate(false);
        setSelectedAddress(null);
    }

    const handleAddAddress = () => {
        store.dispatch(addAddress({ name, address })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                showToast('Address added successfully');
                hideAdd();
            }
        });
    }

    const handleDeleteAddress = (id) => {
        store.dispatch(deleteAddress({ id })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                showToast('Address deleted successfully');
                hideDelete();
            }
        });
    }

    const handleUpdateAddress = () => {
        store.dispatch(updateAddress({ id: selectedAddress?.id, name, address })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                showToast('Address updated successfully');
                hideUpdate();
            }
        });
    }

    React.useEffect(() => {
        store.dispatch(getAddresses()).then((res) => res.meta.requestStatus === 'fulfilled');
    }, []);

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title="My Addresses" />
                <Appbar.Action icon="plus-circle-outline" style={{ mt: 2 }} color={'white'} onPress={showAdd} />
            </Appbar.Header>
            <List.Section>
                <List.Accordion
                    title="Addresses"
                    style={styles.accrodionStyle}
                    titleStyle={styles.accrodionTitleStyle}
                    left={props => <List.Icon color={'white'} icon="map-marker" />}
                    expanded={true}
                    right={props => undefined}
                    disabled
                >
                    {loadingAddresses && (
                        <ActivityIndicator animating={true} color={'tomato'} size={'large'} style={{ marginTop: 20, marginRight: 70 }} />
                    )}
                    {!addresses || addresses.length === 0 && (
                        <List.Item
                            title="No Addresses"
                            description="You have no addresses yet."
                            style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                            left={props => <List.Icon style={{ marginLeft: 10 }} color={'tomato'} icon="map-marker" />}
                        />
                    )}
                </List.Accordion>
            </List.Section>
            {addresses && addresses.length > 0 && (
                <SwipeListView
                    data={addresses}
                    renderItem={(data, rowMap) => (
                        <View style={styles.rowFront}>
                            <List.Icon style={{ marginLeft: 10, alignSelf: 'flex-start', margin: 10 }} color={'tomato'} icon="map-marker" />
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 5 }} onPress={() => showUpdate(data.item)}>
                                <Text style={{ alignSelf: 'flex-start', fontSize: 22, fontWeight: 400, color: 'tomato' }}>{data.item.name}</Text>
                                <Text style={{ alignSelf: 'flex-start', fontSize: 18, fontWeight: 300 }}>{data.item.address}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                onPress={() => showDelete(data.item)}
                            >
                                <List.Icon style={{ alignSelf: 'center' }} icon="delete" color={'white'} />
                            </TouchableOpacity>
                        </View>
                    )}
                    leftOpenValue={0}
                    rightOpenValue={-75}
                    disableRightSwipe={true}
                    stopLeftSwipe={75}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                />
            )}
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
                <View style={{ flex: 1 }}>
                    <Portal>
                        <Dialog visible={visibleAdd} onDismiss={hideAdd}>
                            <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>Add Address</Dialog.Title>
                            <Dialog.Content style={{ alignItems: 'center', height: 300 }}>
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
                                    label='Address'
                                    onChangeText={text => setAddress(text)}
                                    style={[styles.input, { height: 200 }]}
                                    value={address}
                                    numberOfLines={10}
                                    multiline
                                    theme={styles.inputColor}
                                    underlineColorAndroid={'rgba(0,0,0,0)'}
                                    mode='outlined'
                                />
                            </Dialog.Content>
                            <Dialog.Actions style={{ marginTop: 50 }}>
                                <Button
                                    icon='close'
                                    mode='contained'
                                    style={{ width: '40%', backgroundColor: 'tomato' }}
                                    onPress={hideAdd}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    icon='check'
                                    mode='contained'
                                    style={{ width: '40%', backgroundColor: 'tomato' }}
                                    onPress={handleAddAddress}
                                    disabled={name === '' || address === ''}
                                >
                                    Add
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog visible={visibleDelete} onDismiss={hideDelete}>
                            <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>Delete Address</Dialog.Title>
                            <Dialog.Content style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 400, color: 'tomato' }}>Are you sure you want to delete {selectedAddress?.name}?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <Button
                                        icon='close'
                                        mode='contained'
                                        style={{ width: '40%', backgroundColor: 'tomato', marginRight: 10 }}
                                        onPress={hideDelete}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        icon='check'
                                        mode='contained'
                                        style={{ width: '40%', backgroundColor: 'tomato' }}
                                        onPress={() => handleDeleteAddress(selectedAddress?.id)}
                                    >
                                        Delete
                                    </Button>
                                </View>
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog visible={visibleUpdate} onDismiss={hideUpdate}>
                            <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>Update Address</Dialog.Title>
                            <Dialog.Content style={{ alignItems: 'center', height: 300 }}>
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
                                    label='Address'
                                    onChangeText={text => setAddress(text)}
                                    style={[styles.input, { height: 200 }]}
                                    value={address}
                                    numberOfLines={10}
                                    multiline
                                    theme={styles.inputColor}
                                    underlineColorAndroid={'rgba(0,0,0,0)'}
                                    mode='outlined'
                                />
                            </Dialog.Content>
                            <Dialog.Actions style={{ marginTop: 50 }}>
                                <Button
                                    icon='backspace'
                                    mode='contained'
                                    style={{ width: '40%', backgroundColor: 'tomato' }}
                                    onPress={hideUpdate}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    icon='check'
                                    mode='contained'
                                    style={{ width: '40%', backgroundColor: 'tomato' }}
                                    onPress={handleUpdateAddress}
                                    disabled={name === '' || address === ''}
                                >
                                    Update
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyle: {
        backgroundColor: 'tomato',
        width: 100,
    },
    disabledButtonStyle: {
        backgroundColor: 'grey',
        width: 100,
        opacity: 0.5,
    },
    accrodionStyle: {
        backgroundColor: 'tomato',
    },
    accrodionTitleStyle: {
        color: 'white',
    },
    chip: {
        marginTop: 10,
        marginBottom: 10,
        width: 180,
        height: 40,
        backgroundColor: 'tomato',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
    },
    chipText: {
        color: 'white',
        fontSize: 16,
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
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#f2f2f2',
        borderBottomColor: 'tomato',
        borderBottomWidth: 1,
        height: 100,
        flexDirection: 'row',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'tomato',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'tomato',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
});
