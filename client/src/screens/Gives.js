import { StyleSheet, View, Image, Text } from 'react-native';
import { Appbar, List, Chip } from 'react-native-paper';
import store from '../store/store.js';
import { useSelector } from 'react-redux';
import React from 'react';
import { getGives, getOwnedGives } from '../store/giver.js';
import { getTextByStatus, getIconNameByStatus, getBackgrounColorByStatus } from '../utils/functions.js';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Gives({ navigation }) {
    const [packagedExpanded, setPackagedExpanded] = React.useState(true);
    const [ownedPackagedExpanded, setOwnedPackagedExpanded] = React.useState(true);
    const gives = useSelector(state => state.giver.gives);
    const ownedGives = useSelector(state => state.giver.ownedGives);
    const [packagedGives, setPackagedGives] = React.useState([]);
    const [ownedPackagedGives, setOwnedPackagedGives] = React.useState([]);
    const handlePackagedExpanded = () => setPackagedExpanded(!packagedExpanded);
    const handleOwnedPackagedExpanded = () => setOwnedPackagedExpanded(!ownedPackagedExpanded);

    React.useEffect(() => {
        store.dispatch(getGives()).then((res) => res.meta.requestStatus === 'fulfilled');
        store.dispatch(getOwnedGives()).then((res) => res.meta.requestStatus === 'fulfilled');
    }, []);

    React.useEffect(() => {
        if (gives && gives.length > 0) {
            const existingGives = gives.filter(give => give.quantity > 0)
            setPackagedGives(existingGives);
        }
    }, [gives]);

    React.useEffect(() => {
        if (ownedGives && ownedGives.length > 0) {
            setOwnedPackagedGives(ownedGives);
        }
    }, [ownedGives]);

    return (
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
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title="My Gives" />
            </Appbar.Header>
            <View style={{ flex: 1 }}>
                <List.Section>
                    <List.Accordion
                        title="Owned Packaged Food Gives"
                        style={ownedPackagedExpanded ? styles.accrodionStyle : undefined}
                        titleStyle={ownedPackagedExpanded ? styles.accrodionTitleStyle : undefined}
                        left={props => <List.Icon color={ownedPackagedExpanded ? 'white' : undefined} icon="food-takeout-box" />}
                        right={props => <List.Icon color={ownedPackagedExpanded ? 'white' : undefined} icon={ownedPackagedExpanded ? "chevron-up" : "chevron-down"} />}
                        expanded={ownedPackagedExpanded}
                        onPress={handleOwnedPackagedExpanded}>
                        {ownedPackagedGives && ownedPackagedGives.length > 0 ? ownedPackagedGives.map((give, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    title={give.packagedFood.name.charAt(0).toUpperCase() + give.packagedFood.name.slice(1)}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    description={
                                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(give.status) }]}
                                            icon={() => <Icons name={getIconNameByStatus(give.status)} size={30} color={'white'} />}
                                            mode='outlined'
                                        >
                                            <Text style={styles.chipText}>{getTextByStatus(give.status)}</Text>
                                        </Chip>
                                    }
                                    descriptionStyle={{ marginTop: 10 }}
                                    left={props => <Image style={{ width: 100, height: 70, marginLeft: 5 }} source={{ uri: give.packagedFood.photo }} />}
                                    right={props => <List.Icon style={{ marginLeft: 10 }} icon="chevron-right" />}
                                    style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                    onPress={() => navigation.navigate('OwnedPackagedGive', { give: give })}
                                />
                            );
                        })
                            : <List.Item
                                title="No Gives"
                                description="You have no packaged food gives yet."
                                style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                left={props => <List.Icon style={{ marginLeft: 10 }} icon="food-takeout-box" />}
                            />}
                    </List.Accordion>
                </List.Section>
                <List.Section>
                    <List.Accordion
                        title="Packaged Food Gives"
                        style={packagedExpanded ? styles.accrodionStyle : undefined}
                        titleStyle={packagedExpanded ? styles.accrodionTitleStyle : undefined}
                        left={props => <List.Icon color={packagedExpanded ? 'white' : undefined} icon="food-takeout-box" />}
                        right={props => <List.Icon color={packagedExpanded ? 'white' : undefined} icon={packagedExpanded ? "chevron-up" : "chevron-down"} />}
                        expanded={packagedExpanded}
                        onPress={handlePackagedExpanded}>
                        {packagedGives && packagedGives.length > 0 ? packagedGives.map((give, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    title={give.name.charAt(0).toUpperCase() + give.name.slice(1)}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    description={
                                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(give.status) }]}
                                            icon={() => <Icons name={getIconNameByStatus(give.status)} size={30} color={'white'} />}
                                            mode='outlined'
                                        >
                                            <Text style={styles.chipText}>Quantity: {give.quantity}</Text>
                                        </Chip>
                                    }
                                    descriptionStyle={{ marginTop: 10 }}
                                    left={props => <Image style={{ width: 100, height: 70, marginLeft: 5 }} source={{ uri: give.photo }} />}
                                    right={props => <List.Icon style={{ marginLeft: 10 }} icon="chevron-right" />}
                                    style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                    onPress={() => navigation.navigate('PackagedGive', { give: give })}
                                />
                            );
                        })
                            : <List.Item
                                title="No Gives"
                                description="You have no packaged food gives yet."
                                style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                left={props => <List.Icon style={{ marginLeft: 10 }} icon="food-takeout-box" />}
                            />}
                    </List.Accordion>
                </List.Section>
            </View>
        </KeyboardAwareScrollView>
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
});
