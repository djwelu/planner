import React, { Component } from "react";
import {TouchableOpacity, StyleSheet, Text, View} from "react-native";

export default class PostMonth extends React.Component {

    render() {
        return (
            <View key={this.props.keyval} style={styles.container}>
                <TouchableOpacity onLongPress={this.props.deleteMethod}>
                    <Text>{this.props.val.newMessage}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 3,
        marginBottom: 3,
    },
});
