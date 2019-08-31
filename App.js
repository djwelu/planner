import React from "react";
import {StyleSheet, Text, View, Alert} from "react-native";
import {createAppContainer, createMaterialTopTabNavigator,} from 'react-navigation';
import { Icon } from 'react-native-elements';
import Month from './Month';
import Day from './Day';
import Inputs from './Inputs';

const Tabs = createAppContainer(createMaterialTopTabNavigator({
    Day: {
        screen: Day,
        navigationOptions: {
            tabBarLabel: 'Day',
            tabBarIcon: ({ tintColor }) => <Icon name="day" size={35} color={tintColor} />
        }
    },
    Month: {
        screen: Month,
        navigationOptions: {
            tabBarLabel: 'Month',
            tabBarIcon: ({ tintColor }) => <Icon name="month" size={35} color={tintColor} />
        }
    },
    Inputs: {
        screen: Inputs,
        navigationOptions:{
            tabBarLabel: 'New',
            tabBarIcon: ({ tintColor }) => <Icon name="inputs" size={35} color={tintColor} />
        }
    }
},
    {
        tabBarOptions: {
            style: {backgroundColor: 'red',},
        },
    }
));

export default class App extends React.Component {
    navChange = (prevState, newState) => {
        this.setState({...this.state, route_index: newState.index});
    }
    render() {
        return (
            <Tabs onNavigationStateChange={this.navChange} screenProps={this.state} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
