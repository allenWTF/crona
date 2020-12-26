import React, {Component} from 'react';

import {Text, StyleSheet, View} from 'react-native';
import Div from "../Div/Div";


class ToggleTitle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpened: false
        };

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(e) {
        this.setState({
            isOpened: !this.state.isOpened
        });
    }

    render() {
        const {children, elemToShow, ...restProps} = this.props;
        return (
            <View>
                <Text style={styles.title} onPress={this.handleToggle} maxFontSizeMultiplier={1}>{children}</Text>
                {this.state.isOpened && elemToShow}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 13,
        color: '#666666',
        fontWeight: "500",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 0,
        textTransform: 'uppercase'
    }
});

export default ToggleTitle;

