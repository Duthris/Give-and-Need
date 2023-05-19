import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../../screens/Home';
import Login from '../../screens/Login';
import Register from '../../screens/Register';
import Settings from '../../screens/Settings';
import { useSelector } from "react-redux";
import { View, Image, TouchableOpacity, Platform } from 'react-native';
import native from '../../../assets/native.png';
import { Animated } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { EmptyScreen, getWidth } from '../../utils/functions';
import { Menu } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NavBar({ navigation }) {
    const Tab = createBottomTabNavigator();
    const user = useSelector(state => state.auth.user);
    const role = useSelector(state => state.auth.role);
    const tabOffset = React.useRef(new Animated.Value(0)).current;

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);


    return (
        <>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, size }) => {
                        let iconName;
                        let routeName = route.name;
                        if (routeName === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (routeName === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        } else if (routeName === 'Login') {
                            iconName = focused ? 'log-in' : 'log-in-outline';
                        } else if (routeName === 'Register') {
                            iconName = focused ? 'create' : 'create-outline';
                        }

                        return <Ionicons style={{ marginTop: 10 }} name={iconName} size={size} color={focused ? 'tomato' : 'gray'} />;
                    },
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        position: 'absolute',
                        bottom: 20,
                        marginHorizontal: 20,
                        height: Platform.OS === 'ios' ? 80 : 60,
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: {
                            width: 10,
                            height: 10
                        },
                        paddingHorizontal: 20,
                    },
                    headerShown: false,
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    tabBarHideOnKeyboard: true,
                })}
            >

                <Tab.Screen name="Home"
                    component={Home}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            Animated.spring(tabOffset, {
                                toValue: 0,
                                useNativeDriver: true
                            }).start();
                        }
                    })}
                />
                {user &&
                    <>
                        <Tab.Screen name={'ActionButton'}
                            component={EmptyScreen}
                            options={{
                                tabBarIcon: ({ focused }) => (
                                    <TouchableOpacity
                                        onPress={openMenu}
                                    >
                                        <View style={{
                                            width: 55,
                                            height: 55,
                                            backgroundColor: 'tomato',
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: Platform.OS === 'ios' ? 5 : 30,
                                            shadowColor: 'black',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                        }}>
                                            <Menu
                                                visible={visible}
                                                onDismiss={closeMenu}
                                                anchorPosition={'top'}
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    padding: 50,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 1000,
                                                    borderRadius: 10,
                                                    paddingHorizontal: 20,
                                                }}
                                                anchor={<Image source={native}
                                                    style={{
                                                        width: 22,
                                                        height: 22,
                                                        tintColor: 'white'
                                                    }} />}>
                                                <Menu.Item
                                                    onPress={() => {
                                                        navigation.navigate('Donations')
                                                        closeMenu()
                                                    }}
                                                    title="Donations"
                                                    leadingIcon={() => <Icons name="cards-heart" style={{ marginBottom: 2, marginLeft: 2 }} size={24} color="tomato" />}
                                                    titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'tomato' }}
                                                />
                                                {role === 'needer' && (
                                                    <Menu.Item
                                                        onPress={() => {
                                                            navigation.navigate('Needs')
                                                            closeMenu()
                                                        }}
                                                        title="My Needs"
                                                        leadingIcon={() => <Icons name="cart-heart" style={{ marginBottom: 2 }} size={26} color="tomato" />}
                                                        titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'tomato' }}
                                                    />
                                                )}
                                                {role === 'giver' && (
                                                    <>
                                                        <Menu.Item
                                                            onPress={() => {
                                                                navigation.navigate('Gives')
                                                                closeMenu()
                                                            }}
                                                            title="My Gives"
                                                            leadingIcon={() => <Icons name="hand-heart" style={{ marginBottom: 2, marginLeft: 2 }} size={24} color="tomato" />}
                                                            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'tomato' }}
                                                        />
                                                        <Menu.Item
                                                            onPress={() => {
                                                                navigation.navigate('MakeDonation')
                                                                closeMenu()
                                                            }}
                                                            title="Make Donation"
                                                            leadingIcon={() => <Icons name="plus-circle" style={{ marginBottom: 2, marginLeft: 2 }} size={24} color="tomato" />}
                                                            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'tomato' }}
                                                        />
                                                    </>
                                                )}
                                            </Menu>
                                        </View>
                                    </TouchableOpacity>
                                ),
                                tabBarLabel: '',
                            }}
                        />
                        <Tab.Screen
                            name="Settings"
                            component={Settings}
                            listeners={({ navigation, route }) => ({
                                tabPress: e => {
                                    Animated.spring(tabOffset, {
                                        toValue: getWidth() * 3.11,
                                        useNativeDriver: true
                                    }).start();
                                }
                            })}
                        />
                    </>
                }
                {!user &&
                    <>
                        <Tab.Screen
                            name="Login"
                            component={Login}
                            listeners={({ navigation, route }) => ({
                                tabPress: e => {
                                    Animated.spring(tabOffset, {
                                        toValue: getWidth() * 1.6,
                                        useNativeDriver: true
                                    }).start();
                                }
                            })}
                        />
                        <Tab.Screen
                            name="Register"
                            component={Register}
                            listeners={({ navigation, route }) => ({
                                tabPress: e => {
                                    Animated.spring(tabOffset, {
                                        toValue: getWidth() * 3.13,
                                        useNativeDriver: true
                                    }).start();
                                }
                            })}
                        />
                    </>
                }
            </Tab.Navigator>

            <HideWithKeyboard>
                <Animated.ScrollView style={{
                    width: getWidth() - 20,
                    height: 2,
                    backgroundColor: 'tomato',
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 100 : 79,
                    left: 69,
                    borderRadius: 50,
                    transform: [
                        {
                            translateX: tabOffset
                        }
                    ]
                }}>
                </Animated.ScrollView>
            </HideWithKeyboard>
        </>
    )
}