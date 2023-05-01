import { StyleSheet, View, Image, Text } from 'react-native';
import { Appbar, List, Chip } from 'react-native-paper';
import store from '../store/store.js';
import { useSelector } from 'react-redux';
import React from 'react';
import { getNeeds } from '../store/needer.js';
import { getTextByStatus, getIconNameByStatus, getBackgrounColorByStatus } from '../utils/functions.js';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Needs({ navigation }) {
    const [packagedExpanded, setPackagedExpanded] = React.useState(true);
    const [restaurantExpanded, setRestaurantExpanded] = React.useState(true);
    const needs = useSelector(state => state.needer.needs);
    const [packagedNeeds, setPackagedNeeds] = React.useState([]);
    const [restaurantNeeds, setRestaurantNeeds] = React.useState([]);

    const handlePackagedExpanded = () => setPackagedExpanded(!packagedExpanded);
    const handleRestaurantExpanded = () => setRestaurantExpanded(!restaurantExpanded);

    React.useEffect(() => {
        store.dispatch(getNeeds()).then((res) => res.meta.requestStatus === 'fulfilled');
    }, []);

    React.useEffect(() => {
        if (needs && needs.length > 0) {
            const packaged = needs.filter(need => need.packagedFood !== null);
            const restaurant = needs.filter(need => need.openFood !== null);
            packaged && setPackagedNeeds(packaged);
            restaurant && setRestaurantNeeds(restaurant);
        }
    }, [needs]);

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title="My Needs" />
            </Appbar.Header>
            <View style={{ flex: 1 }}>
                <List.Section>
                    <List.Accordion
                        title="Packaged Food Needs"
                        style={packagedExpanded ? styles.accrodionStyle : undefined}
                        titleStyle={packagedExpanded ? styles.accrodionTitleStyle : undefined}
                        left={props => <List.Icon color={packagedExpanded ? 'white' : undefined} icon="food-takeout-box" />}
                        right={props => <List.Icon color={packagedExpanded ? 'white' : undefined} icon={packagedExpanded ? "chevron-up" : "chevron-down"} />}
                        expanded={packagedExpanded}
                        onPress={handlePackagedExpanded}>
                        {packagedNeeds && packagedNeeds.length > 0 ? packagedNeeds.map((need, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    title={need.packagedFood.name.charAt(0).toUpperCase() + need.packagedFood.name.slice(1)}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    description={
                                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(need.status) }]}
                                            icon={() => <Icons name={getIconNameByStatus(need.status)} size={30} color={'white'} />}
                                            mode='outlined'
                                        >
                                            <Text style={styles.chipText}>{getTextByStatus(need.status)}</Text>
                                        </Chip>
                                    }
                                    descriptionStyle={{ marginTop: 10 }}
                                    left={props => <Image style={{ width: 100, height: 70, marginLeft: 5 }} source={{ uri: need.packagedFood.photo }} />}
                                    right={props => <List.Icon style={{ marginLeft: 10 }} icon="chevron-right" />}
                                    style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                    onPress={() => navigation.navigate('PackagedNeed', { need: need })}
                                />
                            );
                        })
                            : <List.Item
                                title="No Needs"
                                description="You have no packaged food needs yet."
                                style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                left={props => <List.Icon style={{ marginLeft: 10 }} icon="food-takeout-box" />}
                            />}
                    </List.Accordion>
                </List.Section>
                <List.Section>
                    <List.Accordion
                        style={restaurantExpanded ? styles.accrodionStyle : undefined}
                        titleStyle={restaurantExpanded ? styles.accrodionTitleStyle : undefined}
                        title="Restaurant Food Needs"
                        expanded={restaurantExpanded}
                        onPress={handleRestaurantExpanded}
                        left={props => <List.Icon color={restaurantExpanded ? 'white' : undefined} icon="food" />}
                        right={props => <List.Icon color={restaurantExpanded ? 'white' : undefined} icon={restaurantExpanded ? "chevron-up" : "chevron-down"} />}
                    >
                        {restaurantNeeds && restaurantNeeds.length > 0 ? restaurantNeeds.map((need, idx) => {
                            return (
                                <List.Item
                                    key={idx}
                                    title={need.openFood.name.charAt(0).toUpperCase() + need.openFood.name.slice(1)}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    description={
                                        <Chip style={[styles.chip, { backgroundColor: getBackgrounColorByStatus(need.status) }]}
                                            icon={() => <Icons name={getIconNameByStatus(need.status)} size={30} color={'white'} />}
                                            mode='outlined'
                                        >
                                            <Text style={styles.chipText}>{getTextByStatus(need.status)}</Text>
                                        </Chip>
                                    }
                                    descriptionStyle={{ marginTop: 10 }}
                                    left={props => <Image style={{ width: 100, height: 70, marginLeft: 5 }} source={{ uri: need.openFood.photo }} />}
                                    right={props => <List.Icon style={{ marginLeft: 10 }} icon="chevron-right" />}
                                    style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                    onPress={() => navigation.navigate('RestaurantNeed', { need: need })}
                                />
                            );
                        })
                            : <List.Item
                                title="No Needs"
                                description="You have no restaurant food needs yet."
                                style={{ borderBottomWidth: 1, borderBottomColor: 'tomato' }}
                                left={props => <List.Icon style={{ marginLeft: 10 }} icon="food" />}
                            />
                        }
                    </List.Accordion>
                </List.Section>
            </View>
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
});
