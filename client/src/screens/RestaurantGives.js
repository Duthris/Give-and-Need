import { StyleSheet, View, Image, Text } from 'react-native';
import { Appbar, List, Chip, ActivityIndicator } from 'react-native-paper';
import store from '../store/store.js';
import { useSelector } from 'react-redux';
import React from 'react';
import { getDonations, getOwnedDonations, ownedDonationsLoadingReducer, donationsLoadingReducer } from '../store/restaurant.js';
import { getTextByStatus, getIconNameByStatus, getBackgrounColorByStatus } from '../utils/functions.js';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RestaurantGives({ navigation }) {
    const [donationExpanded, setDonationExpanded] = React.useState(true);
    const [ownedDonationExpanded, setOwnedDonationExpanded] = React.useState(true);
    const donations = useSelector(state => state.restaurant.donations);
    const ownedDonations = useSelector(state => state.restaurant.ownedDonations);
    const loadingDonations = useSelector(state => state.restaurant.donationsLoading);
    const loadingOwnedDonations = useSelector(state => state.restaurant.ownedDonationsLoading);
    const [donationsData, setDonationsData] = React.useState([]);
    const [ownedDonationsData, setOwnedDonationsData] = React.useState([]);
    const handleDonationExpanded = () => setDonationExpanded(!donationExpanded);
    const handleOwnedDonationExpanded = () => setOwnedDonationExpanded(!ownedDonationExpanded);

    React.useEffect(() => {
        store.dispatch(getDonations()).then((res) => res.meta.requestStatus === 'fulfilled').then(() => store.dispatch(donationsLoadingReducer(false)));
        store.dispatch(getOwnedDonations()).then((res) => res.meta.requestStatus === 'fulfilled').then(() => store.dispatch(ownedDonationsLoadingReducer(false)));
    }, []);

    React.useEffect(() => {
        if (donations && donations.length > 0) {
            const existingDonations = donations.filter(donation => donation.quantity > 0)
            setDonationsData(existingDonations);
        }
    }, [donations]);

    React.useEffect(() => {
        if (ownedDonations && ownedDonations.length > 0) {
            setOwnedDonationsData(ownedDonations);
        }
    }, [ownedDonations]);

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
                <Appbar.Content style={{ color: 'white' }} color={'white'} title="My Donations" />
            </Appbar.Header>
            <View style={{ flex: 1 }}>
                <List.Section>
                    <List.Accordion
                        title="Owned Donations"
                        style={ownedDonationExpanded ? styles.accrodionStyle : undefined}
                        titleStyle={ownedDonationExpanded ? styles.accrodionTitleStyle : undefined}
                        left={props => <List.Icon color={ownedDonationExpanded ? 'white' : undefined} icon="food-takeout-box" />}
                        right={props => <List.Icon color={ownedDonationExpanded ? 'white' : undefined} icon={ownedDonationExpanded ? "chevron-up" : "chevron-down"} />}
                        expanded={ownedDonationExpanded}
                        onPress={handleOwnedDonationExpanded}>
                        {ownedDonationsData && ownedDonationsData.length > 0 && !loadingOwnedDonations ? ownedDonationsData.map((donation, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    title={donation.openFood.name.charAt(0).toUpperCase() + donation.openFood.name.slice(1)}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    description={
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
                                    }
                                    descriptionStyle={{ marginTop: 10 }}
                                    left={props => <Image style={{ width: 100, height: 70, marginLeft: 5 }} source={{ uri: donation.openFood.photo }} />}
                                    right={props => <List.Icon style={{ marginLeft: 10 }} icon="chevron-right" />}
                                    style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                    onPress={() => navigation.navigate('OwnedOpenDonation', { donation: donation })}
                                />
                            );
                        }) : loadingOwnedDonations ? <ActivityIndicator animating={true} color={'tomato'} size={'large'} style={{ marginTop: 20, marginRight: 70 }} />
                            : <List.Item
                                title="No Owned Donations"
                                description="You have no owneed donations yet."
                                style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                left={props => <List.Icon style={{ marginLeft: 10 }} icon="food-takeout-box" />}
                            />}
                    </List.Accordion>
                </List.Section>
                <List.Section>
                    <List.Accordion
                        title="Donations"
                        style={donationExpanded ? styles.accrodionStyle : undefined}
                        titleStyle={donationExpanded ? styles.accrodionTitleStyle : undefined}
                        left={props => <List.Icon color={donationExpanded ? 'white' : undefined} icon="food-takeout-box" />}
                        right={props => <List.Icon color={donationExpanded ? 'white' : undefined} icon={donationExpanded ? "chevron-up" : "chevron-down"} />}
                        expanded={donationExpanded}
                        onPress={handleDonationExpanded}>
                        {donationsData && donationsData.length > 0 && !loadingDonations ? donationsData.map((donation, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    title={donation.name.charAt(0).toUpperCase() + donation.name.slice(1)}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    description={
                                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(donation.status) }]}
                                            icon={() => <Icons name={getIconNameByStatus(donation.status)} size={30} color={'white'} />}
                                            mode='outlined'
                                        >
                                            <Text style={styles.chipText}>Quantity: {donation.quantity}</Text>
                                        </Chip>
                                    }
                                    descriptionStyle={{ marginTop: 10 }}
                                    left={props => <Image style={{ width: 100, height: 70, marginLeft: 5 }} source={{ uri: donation.photo }} />}
                                    right={props => <List.Icon style={{ marginLeft: 10 }} icon="chevron-right" />}
                                    style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                    onPress={() => navigation.navigate('OpenDonation', { donation: donation })}
                                />
                            );
                        }) : loadingDonations ? <ActivityIndicator animating={true} color={'tomato'} size={'large'} style={{ marginTop: 20, marginRight: 70 }} />
                            : <List.Item
                                title="No Donations"
                                description="You have no donations yet."
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
