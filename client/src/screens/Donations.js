import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Button, Dialog, Portal, Chip, Checkbox, Appbar } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { getPackagedFoods, getRestaurantFoods } from '../store/donation';
import store from '../store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';
import { packagedFoodTerms } from '../utils/constants';
import { useSelector } from 'react-redux';

const Donations = ({ navigation }) => {
    const [packagedFoods, setPackagedFoods] = React.useState([]);
    const [restaurantFoods, setRestaurantFoods] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [activeIndexRestaurant, setActiveIndexRestaurant] = React.useState(0);
    const [activeItem, setActiveItem] = React.useState({});
    const [activeItemRestaurant, setActiveItemRestaurant] = React.useState({});
    const width = Dimensions.get('window').width;
    const [visible, setVisible] = React.useState(false);
    const [visibleRestaurant, setVisibleRestaurant] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [checkedRestaurant, setCheckedRestaurant] = React.useState(false);
    const [openTerms, setOpenTerms] = React.useState(false);
    const [openTermsRestaurant, setOpenTermsRestaurant] = React.useState(false);
    const [scrolledToEnd, setScrolledToEnd] = React.useState(false);
    const [scrolledToEndRestaurant, setScrolledToEndRestaurant] = React.useState(false);
    const packagedFoodsSelector = useSelector((state) => state.donation.packagedFoods);
    const restaurantFoodsSelector = useSelector((state) => state.donation.restaurantFoods);
    const role = useSelector((state) => state.auth.role);

    const handleScrollToEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            setScrolledToEnd(true);
        }
    };

    const handleScrollToEndRestaurant = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            setScrolledToEndRestaurant(true);
        }
    };

    const showDialog = () => setVisible(true);
    const showDialogRestaurant = () => setVisibleRestaurant(true);

    const hideDialog = () => setVisible(false);
    const hideDialogRestaurant = () => setVisibleRestaurant(false);

    const showTerms = () => setOpenTerms(true);
    const showTermsRestaurant = () => setOpenTermsRestaurant(true);

    const hideTerms = () => {
        setOpenTerms(false)
        setChecked(false);
        setScrolledToEnd(false);
    }

    const hideTermsRestaurant = () => {
        setOpenTermsRestaurant(false)
        setCheckedRestaurant(false);
        setScrolledToEndRestaurant(false);
    }

    const agreeTerms = () => {
        setChecked(true);
        setOpenTerms(false);
    }

    const agreeTermsRestaurant = () => {
        setCheckedRestaurant(true);
        setOpenTermsRestaurant(false);
    }

    const handleGetPackagedFoods = () => {
        store.dispatch(getPackagedFoods()).then((res) => res.meta.requestStatus === 'fulfilled');
    }

    const handleGetRestaurantFoods = () => {
        store.dispatch(getRestaurantFoods()).then((res) => res.meta.requestStatus === 'fulfilled');
    }

    React.useEffect(() => {
        handleGetPackagedFoods();
        handleGetRestaurantFoods();
    }, []);

    React.useEffect(() => {
        if (packagedFoods.length > 0) {
            setActiveItem(packagedFoods[activeIndex]);
        }
    }, [activeIndex]);

    React.useEffect(() => {
        if (restaurantFoods.length > 0) {
            setActiveItemRestaurant(restaurantFoods[activeIndexRestaurant]);
        }
    }, [activeIndexRestaurant]);

    React.useEffect(() => {
        if (packagedFoodsSelector.length > 0) {
            setActiveItem(packagedFoodsSelector[activeIndex]);
            let filtered = packagedFoodsSelector.filter((item) => item.photo !== null && item.ownable !== false && item.quantity > 0 && (item.expirationDate === null || moment(item.expirationDate).diff(moment(), 'days') > 0));
            setPackagedFoods(filtered);
        }
    }, [packagedFoodsSelector])

    React.useEffect(() => {
        if (restaurantFoodsSelector.length > 0) {
            setActiveItemRestaurant(restaurantFoodsSelector[activeIndexRestaurant]);
            let filtered = restaurantFoodsSelector.filter((item) => item.photo !== null && item.ownable !== false && item.quantity > 0);
            setRestaurantFoods(filtered);
        }
    }, [restaurantFoodsSelector])

    React.useEffect(() => {
        if (visible) {
            setChecked(false);
            setScrolledToEnd(false);
        }
    }, [visible])

    React.useEffect(() => {
        if (visibleRestaurant) {
            setCheckedRestaurant(false);
            setScrolledToEndRestaurant(false);
        }
    }, [visibleRestaurant])

    return (
        <>
            <Appbar.Header style={{ backgroundColor: 'tomato' }} mode='center-aligned' statusBarHeight={Platform.OS === 'ios' ? 40 : 25}>
                <Appbar.BackAction color={'white'} onPress={() => navigation.goBack()} />
                <Appbar.Content style={{ color: 'white' }} color={'white'} title="Donations" />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.carouselContainer}>
                    {packagedFoods.length > 0 && (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: 800, color: 'tomato' }}>
                                Packaged Foods
                            </Text>
                            <Carousel
                                width={width}
                                height={width / 2}
                                mode={'parallax'}
                                autoFillData={false}
                                data={packagedFoods.map((item) => item.photo).filter((item) => item !== null)}
                                parallaxAdjacentItemScale={0.8}
                                parallaxScale={0.8}
                                onSnapToItem={(index) => setActiveIndex(index)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.carouselItem}
                                        onPress={showDialog}
                                    >
                                        <Image source={{ uri: item }} style={styles.carouselImage} />
                                    </TouchableOpacity>
                                )}
                            />
                            <Portal>
                                <Dialog visible={visible} onDismiss={hideDialog}>
                                    <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>{activeItem.name}</Dialog.Title>
                                    {activeItem.expirationDate && moment(activeItem.expirationDate).isBefore(moment().add(1, 'week')) && moment(activeItem.expirationDate).isAfter(moment()) && (
                                        <Chip icon={() => <Icon name="alert" size={22} color="yellow" />}
                                            style={{ backgroundColor: 'tomato', width: '90%', alignSelf: 'center', marginBottom: 10 }}
                                        >
                                            <Text style={{ color: 'white' }}>
                                                This item will expire in {moment(activeItem.expirationDate).fromNow()}.
                                            </Text>
                                        </Chip>
                                    )}
                                    <Dialog.ScrollArea style={{ maxHeight: 220, paddingHorizontal: 0 }}>
                                        <ScrollView
                                            contentContainerStyle={{ paddingHorizontal: 24 }}
                                        >
                                            <Text style={{ fontSize: 18, padding: 10 }}>
                                                {activeItem.description}
                                            </Text>
                                        </ScrollView>
                                    </Dialog.ScrollArea>
                                    <Dialog.Content style={{ alignItems: 'center', height: role === 'needer' ? 100 : 300 }}>
                                        <Image source={{ uri: activeItem.photo }} style={styles.dialogImage} />
                                    </Dialog.Content>
                                    {role === 'needer' && (
                                        <>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 100 }}>
                                                <Checkbox.Android
                                                    status={checked ? 'checked' : 'unchecked'}
                                                    color={'tomato'}
                                                    style={{ marginLeft: -10 }}
                                                    onPress={showTerms}
                                                />
                                                <Text style={{ fontWeight: 500, marginBottom: 1, color: checked ? 'tomato' : '#000' }}>
                                                    I have read the terms and conditions.
                                                </Text>
                                                <Portal>
                                                    <Dialog visible={openTerms} onDismiss={hideTerms}>
                                                        <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>Terms and Conditions</Dialog.Title>
                                                        <Dialog.ScrollArea style={{ maxHeight: 220, paddingHorizontal: 0 }}>
                                                            <ScrollView
                                                                contentContainerStyle={{ paddingHorizontal: 24 }}
                                                                onMomentumScrollEnd={({ nativeEvent }) => {
                                                                    handleScrollToEnd(nativeEvent)
                                                                }}
                                                            >
                                                                <Text style={{ fontSize: 18, padding: 10 }}>
                                                                    {packagedFoodTerms}
                                                                </Text>
                                                            </ScrollView>
                                                        </Dialog.ScrollArea>
                                                        <Dialog.Actions>
                                                            <Button
                                                                mode={'elevated'}
                                                                icon={() => <Icon name="check-circle" size={22} color="white" />}
                                                                style={!scrolledToEnd ? styles.disabledButtonStyle : styles.buttonStyle}
                                                                disabled={!scrolledToEnd}
                                                                onPress={agreeTerms}
                                                            >
                                                                <Text style={{ color: 'white', fontWeight: 600 }}>Agree</Text>
                                                            </Button>
                                                            <Button
                                                                mode={'elevated'}
                                                                icon={() => <Icon name="cancel" size={22} color="white" />}
                                                                style={styles.buttonStyle}
                                                                onPress={hideTerms}
                                                            >
                                                                <Text style={{ color: 'white', fontWeight: 600 }}>Cancel</Text>
                                                            </Button>
                                                        </Dialog.Actions>
                                                    </Dialog>
                                                </Portal>
                                            </View>
                                            <Dialog.Actions>
                                                <Button
                                                    mode={'elevated'}
                                                    icon={() => <Icon name="hand-heart" style={{ marginBottom: 5 }} size={22} color="white" />}
                                                    disabled={!checked}
                                                    onPress={hideDialog}
                                                    style={checked ? styles.buttonStyle : styles.disabledButtonStyle}
                                                >
                                                    <Text style={{ color: 'white', fontWeight: 600 }}>Need</Text>
                                                </Button>
                                                <Button
                                                    mode={'elevated'}
                                                    icon={() => <Icon name="cancel" size={22} color="white" />}
                                                    style={styles.buttonStyle}
                                                    onPress={hideDialog}
                                                >
                                                    <Text style={{ color: 'white', fontWeight: 600 }}>Cancel</Text>
                                                </Button>
                                            </Dialog.Actions>
                                        </>
                                    )}
                                </Dialog>
                            </Portal>
                        </>
                    )}
                </View>
                <View style={styles.carouselContainer}>
                    {restaurantFoods.length > 0 && (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: 800, color: 'tomato' }}>
                                Restaurant Foods
                            </Text>
                            <Carousel
                                width={width}
                                height={width / 2}
                                mode={'parallax'}
                                autoFillData={false}
                                data={restaurantFoods.map((item) => item.photo).filter((item) => item !== null)}
                                parallaxAdjacentItemScale={0.8}
                                parallaxScale={0.8}
                                onSnapToItem={(index) => setActiveIndexRestaurant(index)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.carouselItem}
                                        onPress={showDialogRestaurant}
                                    >
                                        <Image source={{ uri: item }} style={styles.carouselImage} />
                                    </TouchableOpacity>
                                )}
                            />
                            <Portal>
                                <Dialog visible={visibleRestaurant} onDismiss={hideDialogRestaurant}>
                                    <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>{activeItemRestaurant.name}</Dialog.Title>
                                    {activeItemRestaurant.expirationDate && moment(activeItemRestaurant.expirationDate).isBefore(moment().add(1, 'week')) && (
                                        <Chip icon={() => <Icon name="alert" size={22} color="yellow" />}
                                            style={{ backgroundColor: 'tomato', width: '90%', alignSelf: 'center', marginBottom: 10 }}
                                        >
                                            <Text style={{ color: 'white' }}>
                                                This item will expire in {moment(activeItemRestaurant.expirationDate).fromNow()}.
                                            </Text>
                                        </Chip>
                                    )}
                                    <Dialog.ScrollArea style={{ maxHeight: 220, paddingHorizontal: 0 }}>
                                        <ScrollView
                                            contentContainerStyle={{ paddingHorizontal: 24 }}
                                        >
                                            <Text style={{ fontSize: 18, padding: 10 }}>
                                                {activeItemRestaurant.description}
                                            </Text>
                                        </ScrollView>
                                    </Dialog.ScrollArea>
                                    <Dialog.Content style={{ alignItems: 'center', height: 100 }}>
                                        <Image source={{ uri: activeItemRestaurant.photo }} style={styles.dialogImage} />
                                    </Dialog.Content>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 100 }}>
                                        <Checkbox.Android
                                            status={checkedRestaurant ? 'checked' : 'unchecked'}
                                            color={'tomato'}
                                            style={{ marginLeft: -10 }}
                                            onPress={showTermsRestaurant}
                                        />
                                        <Text style={{ fontWeight: 500, marginBottom: 1, color: checkedRestaurant ? 'tomato' : '#000' }}>
                                            I have read the terms and conditions.
                                        </Text>
                                        <Portal>
                                            <Dialog visible={openTermsRestaurant} onDismiss={hideTermsRestaurant}>
                                                <Dialog.Title style={{ fontSize: 28, fontWeight: 800, color: 'tomato' }}>Terms and Conditions</Dialog.Title>
                                                <Dialog.ScrollArea style={{ maxHeight: 220, paddingHorizontal: 0 }}>
                                                    <ScrollView
                                                        contentContainerStyle={{ paddingHorizontal: 24 }}
                                                        onMomentumScrollEnd={({ nativeEvent }) => {
                                                            handleScrollToEndRestaurant(nativeEvent)
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 18, padding: 10 }}>
                                                            {packagedFoodTerms}
                                                        </Text>
                                                    </ScrollView>
                                                </Dialog.ScrollArea>
                                                <Dialog.Actions>
                                                    <Button
                                                        mode={'elevated'}
                                                        icon={() => <Icon name="check-circle" size={22} color="white" />}
                                                        style={!scrolledToEndRestaurant ? styles.disabledButtonStyle : styles.buttonStyle}
                                                        disabled={!scrolledToEndRestaurant}
                                                        onPress={agreeTermsRestaurant}
                                                    >
                                                        <Text style={{ color: 'white', fontWeight: 600 }}>Agree</Text>
                                                    </Button>
                                                    <Button
                                                        mode={'elevated'}
                                                        icon={() => <Icon name="cancel" size={22} color="white" />}
                                                        style={styles.buttonStyle}
                                                        onPress={hideTermsRestaurant}
                                                    >
                                                        <Text style={{ color: 'white', fontWeight: 600 }}>Cancel</Text>
                                                    </Button>
                                                </Dialog.Actions>
                                            </Dialog>
                                        </Portal>
                                    </View>
                                    <Dialog.Actions>
                                        <Button
                                            mode={'elevated'}
                                            icon={() => <Icon name="hand-heart" style={{ marginBottom: 5 }} size={22} color="white" />}
                                            disabled={!checkedRestaurant}
                                            onPress={hideDialogRestaurant}
                                            style={checkedRestaurant ? styles.buttonStyle : styles.disabledButtonStyle}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 600 }}>Need</Text>
                                        </Button>
                                        <Button
                                            mode={'elevated'}
                                            icon={() => <Icon name="cancel" size={22} color="white" />}
                                            style={styles.buttonStyle}
                                            onPress={hideDialogRestaurant}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 600 }}>Cancel</Text>
                                        </Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </>
                    )}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carouselContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carouselImage: {
        flex: 1,
        height: 120,
        padding: 10,
        margin: 10,
        marginTop: 20,
        width: 280,
        borderRadius: 10,
    },
    carouselItem: {
        flex: 1,
        shadowColor: '#000',
        elevation: 10,
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        backgroundColor: 'tomato',
        borderRadius: 20,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    dialogImage: {
        flex: 1,
        padding: 100,
        width: 300,
        borderRadius: 10,
    },
    buttonStyle: {
        backgroundColor: 'tomato',
        width: 100,
    },
    disabledButtonStyle: {
        backgroundColor: 'grey',
        width: 100,
        opacity: 0.5,
    }
});

export default Donations;