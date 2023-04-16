import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { Provider as PaperProvider } from 'react-native-paper';
import ModalOpen from './src/constants/ModalOpen';
import Splash from './src/constants/Splash';
import NavBar from './src/components/layouts/NavBar';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
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
          </Stack.Navigator>
          <Toast />
          <ModalOpen />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
