import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import store from './src/store/store'
import ModalOpen from './src/constants/ModalOpen';
import Splash from './src/constants/Splash';
import NavBar from './src/components/layouts/NavBar';
import Donations from './src/screens/Donations';
import Needs from './src/screens/Needs';
import PackagedNeed from './src/screens/PackagedNeed';
import RestaurantNeed from './src/screens/RestaurantNeed';
import Gives from './src/screens/Gives';
import PackagedGive from './src/screens/PackagedGive';
import OwnedPackagedGive from './src/screens/OwnedPackagedGive';
import MakeDonation from './src/screens/MakeDonation';
import Settings from './src/screens/Settings';
import Onboarding from './src/components/Onboarding';
import RestaurantGives from './src/screens/RestaurantGives';
import OwnedOpenDonation from './src/screens/OwnedOpenDonation';
import OpenDonation from './src/screens/OpenDonation';
import MakeOpenDonation from './src/screens/MakeOpenDonation';

export default function App() {
  axios.interceptors.request.use(
    async (config) => {
      const token = store.getState().auth.token
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  );

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@viewedOnboarding');
    } catch (error) {
      console.log('Error @clearOnboarding: ', error);
    }
  }

  React.useEffect(() => {
    const version = AsyncStorage.getItem('@version')
    const packageJson = require('./package.json');
    const appVersion = packageJson.version;

    if (!version || version !== appVersion) {
      clearOnboarding()
      AsyncStorage.setItem('@version', appVersion)
    } else return;
  }, [])

  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Splash"
                component={Splash}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='Main'
                component={NavBar}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='Donations'
                component={Donations}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='Needs'
                component={Needs}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='PackagedNeed'
                component={PackagedNeed}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='RestaurantNeed'
                component={RestaurantNeed}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='Gives'
                component={Gives}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='PackagedGive'
                component={PackagedGive}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='OwnedPackagedGive'
                component={OwnedPackagedGive}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='MakeDonation'
                component={MakeDonation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='Settings'
                component={Settings}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='Onboarding'
                component={Onboarding}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='RestaurantGives'
                component={RestaurantGives}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='OwnedOpenDonation'
                component={OwnedOpenDonation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='OpenDonation'
                component={OpenDonation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='MakeOpenDonation'
                component={MakeOpenDonation}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
            <Toast />
            <ModalOpen />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
