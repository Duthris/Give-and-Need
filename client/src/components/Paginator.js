import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native'
import React from 'react'

export default function Paginator({ data, scrollX }) {

    const { width } = useWindowDimensions()

    return (
        <View style={styles.container}>
            {
                data.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 20, 10],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                    })

                    return <Animated.View
                        style={[styles.dot, {
                            width: scale,
                            opacity,
                        }]}
                        key={i.toString()} />
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: 'tomato',
        marginHorizontal: 10,
    }

})