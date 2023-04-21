import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import axios from 'axios'
import store from './src/store/store'
import { Provider as PaperProvider } from 'react-native-paper';
import ModalOpen from './src/constants/ModalOpen';
import Splash from './src/constants/Splash';
import NavBar from './src/components/layouts/NavBar';
import Donations from './src/screens/Donations';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
            </Stack.Navigator>
            <Toast />
            <ModalOpen />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
