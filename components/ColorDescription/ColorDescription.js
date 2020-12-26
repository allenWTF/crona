import React from 'react';
import {Text, View} from "react-native";
import Svg, {
    Rect
} from 'react-native-svg';

const ColorDescription = (props) => {
    return (
        <View key={Math.random() * 100000} style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: 'red',
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0,
            maxHeight: 50
        }}>
            <View style={{padding: 10, flexBasis: 300}}><Text>{props.text}</Text></View>
            <View style={{
                padding: 10,
                borderLeftWidth: 1,
                borderLeftColor: '#EAEAEA',
            }}>{props.colorObject}
            </View>
        </View>
    )
};

export default ColorDescription