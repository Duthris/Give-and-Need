import Lottie from 'lottie-react-native';

export default function Splash({ navigation }) {
    return (
        <Lottie
            source={require('../../assets/animations/splash.json')}
            autoPlay
            loop={false}
            onAnimationFinish={() => {
                navigation.navigate('Main');
            }}
        />
    );
}