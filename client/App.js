import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
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
  )

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
            </Stack.Navigator>
            <Toast />
            <ModalOpen />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
