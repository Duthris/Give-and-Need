import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../../screens/Home';
import Login from '../../screens/Login';
import Register from '../../screens/Register';
import { useSelector } from "react-redux";
import { View, Image, TouchableOpacity } from 'react-native';
import native from '../../../assets/native.png';
import { Animated } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { EmptyScreen, getWidth } from '../../utils/functions';
import { Menu } from 'react-native-paper';

export default function NavBar({ navigation }) {
    const Tab = createBottomTabNavigator();
    const user = useSelector(state => state.auth.user);
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

                        return <Ionicons name={iconName} size={size} color={focused ? 'tomato' : 'gray'} />;
                    },
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        position: 'absolute',
                        bottom: 20,
                        marginHorizontal: 20,
                        height: 60,
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowOffset: {
                            width: 10,
                            height: 10
                        },
                        paddingHorizontal: 20,
                    },
                    headerShown: false,
                    tabBarActiveTintColor: 'red',
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
                                            backgroundColor: 'red',
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 30,
                                            // shadow
                                            shadowColor: 'black',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,
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
                                                <Menu.Item onPress={() => {
                                                    navigation.navigate('Donations')
                                                    closeMenu()
                                                }} title="Donations" />
                                                {/* <Menu.Item onPress={() => { }} title="Item 2" />
                                                <Menu.Item onPress={() => { }} title="Item 3" /> */}
                                            </Menu>
                                        </View>
                                    </TouchableOpacity>
                                ),
                                tabBarLabel: '',
                            }}
                        />
                        <Tab.Screen
                            name="Settings"
                            component={Home}
                            listeners={({ navigation, route }) => ({
                                tabPress: e => {
                                    Animated.spring(tabOffset, {
                                        toValue: getWidth() * 3.15,
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
                    backgroundColor: 'red',
                    position: 'absolute',
                    bottom: 79,
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