import React from 'react';
import {Text, View} from "react-native";

const ResultTable = (props) => {
    const data = props.data || [];
    const dataRows = data.map((item, i, arr) => {
        return <View key={Math.random() * 100000} style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottomColor: '#EAEAEA',
            backgroundColor: ((i + 1) % 2 === 0 ? '#FAFAFA' : '#FFFFFF'),
            borderBottomWidth: (i + 1 < arr.length ? 1 : 0),
        }}>
            <View style={{padding: 10, flexBasis: 80}}><Text>Год {i}</Text></View>
            <View style={{
                padding: 10,
                borderLeftWidth: 1,
                borderLeftColor: '#EAEAEA',
            }}><Text>{typeof item === "string" ? item : item.toFixed(2)}{props.format && typeof item !== "string" ? " " + props.format : ""}</Text></View>
        </View>;
    });
    return <View style={{marginHorizontal: 16, marginTop: 10, borderWidth: 1, borderColor: '#EAEAEA', padding: 0}}>
        {dataRows}
    </View>;
};

export default ResultTable;