import React from 'react';
import {FlatList, Modal, StyleSheet, Text, View} from "react-native";
import Button from "../Button/Button";
import {Colors} from "react-native/Libraries/NewAppScreen";

const ModalWindow = (props) => {
    const {header, description, data, buttons, ...restProps} = props;
    return (
        <Modal animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalMain}>
                        <Text style={styles.modalHeader}>{header}</Text>
                        <Text style={{
                            ...styles.commonText,
                            paddingLeft: 0,
                            paddingRight: 0,
                            marginBottom: 20
                        }}>{description}</Text>
                        <FlatList style={styles.modalReasonsList} data={data}
                                  renderItem={({item}) => <Text style={{marginBottom: 10}}>{item.key}</Text>}
                        />
                    </View>
                    <View style={styles.modalButtons}>
                        {buttons}
                    </View>
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    commonText: {
        fontSize: 16,
        color: '#000000',
        paddingTop: 0,
        marginTop: 0,
        paddingLeft: 16,
        paddingRight: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10
    },
    modalMain: {
        margin: 16,
    },
    modalButtons: {
        marginBottom: 16
    },
    modalHeader: {
        fontSize: 22,
        color: '#666666',
        fontWeight: "700",
        textTransform: 'uppercase',
        marginBottom: 10,
        textAlign: "center"
    },
    modalReasonsList: {
        flexGrow: 0,
        maxHeight: 200
    }
});

export default ModalWindow;