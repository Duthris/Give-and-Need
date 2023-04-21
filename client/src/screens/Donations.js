import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, Chip, Checkbox } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { getPackagedFoods } from '../store/donation';
import store from '../store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';

const Donations = () => {
    const [packagedFoods, setPackagedFoods] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [activeItem, setActiveItem] = React.useState({});
    const width = Dimensions.get('window').width;
    const [visible, setVisible] = React.useState(false);
    const [checked, setChecked] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);


    const handleGetPackagedFoods = () => {
        store.dispatch(getPackagedFoods()).then((res) => res.meta.requestStatus === 'fulfilled' && setPackagedFoods(res.payload.data));
    }

    React.useEffect(() => {
        handleGetPackagedFoods();
    }, []);

    React.useEffect(() => {
        if (packagedFoods.length > 0) {
            setActiveItem(packagedFoods[activeIndex]);
        }
    }, [activeIndex]);

    React.useEffect(() => {
        if (packagedFoods.length > 0) {
            setActiveItem(packagedFoods[activeIndex]);
        }
    }, [packagedFoods])

    React.useEffect(() => {
        if (visible) {
            setChecked(false);
        }
    }, [visible])

    return (
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
                                {activeItem.expirationDate && moment(activeItem.expirationDate).isBefore(moment().add(1, 'week')) && (
                                    <Chip icon={() => <Icon name="alert" size={22} color="yellow" />}
                                        style={{ backgroundColor: 'tomato', width: '90%', alignSelf: 'center', marginBottom: 10 }}
                                    >
                                        <Text>
                                            This item will expire in {moment(activeItem.expirationDate).fromNow()}.
                                        </Text>
                                    </Chip>
                                )}
                                <Dialog.Content>
                                    <Text style={{ fontSize: 18 }}>{activeItem.description}</Text>
                                </Dialog.Content>
                                <Dialog.Content style={{ alignItems: 'center', height: '50%' }}>
                                    <Image source={{ uri: activeItem.photo }} style={styles.dialogImage} />
                                </Dialog.Content>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkbox.Item
                                        status={checked ? 'checked' : 'unchecked'}
                                        color={'tomato'}
                                        style={{ marginLeft: -10 }}
                                        onPress={() => {
                                            setChecked(!checked);
                                        }}
                                    />
                                    <Text style={{ fontWeight: 500, marginBottom: 3, marginLeft: -15, color: checked ? 'tomato' : '#000' }}>
                                        I have read the terms and conditions and agreed.
                                    </Text>
                                </View>
                                <Dialog.Actions>
                                    <Button onPress={hideDialog}>
                                        <Text style={{ color: 'tomato', fontWeight: 600 }}>Cancel</Text>
                                    </Button>
                                    <Button disabled={!checked} onPress={hideDialog}>
                                        <Text style={{ color: 'tomato', fontWeight: 600 }}>Need</Text>
                                    </Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </>
                )}
            </View>
        </View>
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
        elevation: 5,
        shadowOpacity: 0.4,
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
        height: 20,
        padding: 10,
        margin: 10,
        marginTop: 20,
        width: 250,
        borderRadius: 10,
    },
});

export default Donations;