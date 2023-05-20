import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {

    const navigation = useNavigation();

    const [viewedOnboarding, setViewedOnboarding] = useState(false);

    const checkOnboarding = async () => {
        try {
            const value = await AsyncStorage.getItem('@viewedOnboarding');
            if (value !== null) {
                setViewedOnboarding(true);
            }
        } catch (error) {
            console.log('Error @checkOnboarding: ', error);
        }
    }

    useEffect(() => {
        checkOnboarding();
    }, [])


    return (
        <Lottie
            source={require('../../assets/animations/splash.json')}
            autoPlay
            loop={false}
            onAnimationFinish={() => {
                if (viewedOnboarding) {
                    navigation.navigate('Main');
                } else {
                    navigation.navigate('Onboarding');
                }
            }}
        />
    );
}