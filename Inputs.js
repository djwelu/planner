import React, { Component } from "react";
import {AsyncStorage, StyleSheet, Text, TextInput, View, ScrollView, Switch, Alert, KeyboardAvoidingView} from "react-native";
import Button from "react-native-button";

export default class Inputs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEvent: false,
            date: "",
            message: ""
        };
    }

    componentDidMount = async() => {
        let postArray;
        try{
            let tempArray = await AsyncStorage.getItem('key');
            postArray = JSON.parse(tempArray);
            if(postArray===null){
                await AsyncStorage.setItem('key', JSON.stringify(new Array(50)));
                return;
            }
        } catch (error){
            return;
        }
        let index;
        for(index=0; index<50; index++){
            if(postArray[index]!==null){
                let tempDay = postArray[index].newDateDay;
                let tempMonth = postArray[index].newDateMonth;
                let tempYear = postArray[index].newDateYear;
                if (tempYear < new Date().getFullYear() || (tempYear == new Date().getFullYear() && tempMonth < new Date().getMonth() + 1)
                    || (tempYear == new Date().getFullYear() && tempMonth == new Date().getMonth() + 1 && tempDay < new Date().getDate())) {
                    postArray[index] = null;
                    break;
                }
            }
        }
        try {
            await AsyncStorage.setItem('key', JSON.stringify(postArray));
        } catch (error) {
            Alert.alert("Error updating post");
        }
    };

    store = async () => {
        let newPost={
            newIsEvent: this.state.isEvent,
            newDateDay: this.state.date.substr(3,2),
            newDateMonth: this.state.date.substr(0,2),
            newDateYear: this.state.date.substr(6,4),
            newMessage: this.state.message
        }
        let postArray;
        try{
            let tempArray = await AsyncStorage.getItem('key');
            postArray = JSON.parse(tempArray);
            if(postArray===null){
                postArray = new Array(50);
            }
        } catch (error){
            postArray = new Array(50);
        }
        let index = 0;
        for(index=0; index<50; index++){
            if(postArray[index]===null){
                postArray[index]=newPost;
                break;
            }
        }
        if(index===50){
            Alert.alert("50 post is the maximum");
            return;
        }
        try {
            await AsyncStorage.setItem('key', JSON.stringify(postArray));
            Alert.alert("Post has been saved!");
        } catch (error) {
            Alert.alert("Error saving post");
        }
    }


    buttonCheck = () =>{
        if(this.state.date.length!==10||this.state.date.charAt(2)!=='/'||this.state.date.charAt(5)!=='/'||
            isNaN(this.state.date.substr(0,2))||isNaN(this.state.date.substr(3,2))||isNaN(this.state.date.substr(6,4))){
            Alert.alert("date not in correct format");
            return;
        }
        let tempDay = parseInt(this.state.date.substr(3,2));
        let tempMonth = parseInt(this.state.date.substr(0,2));
        let tempYear = parseInt(this.state.date.substr(6,4));
        if(tempMonth<1||tempMonth>12){
            Alert.alert("month does not exist");
            return;
        }
        if(tempDay<1||((tempMonth==1||tempMonth==3||tempMonth==5||tempMonth==7||tempMonth==8||tempMonth==10||tempMonth==12)&&tempDay>31)
            ||((tempMonth==4||tempMonth==6||tempMonth==9||tempMonth==11)&&tempMonth>30)||(tempMonth==2&&tempDay>29)){
            Alert.alert("day does not exist");
            return;
        }
        if(tempYear<new Date().getFullYear()||(tempYear==new Date().getFullYear()&&tempMonth<new Date().getMonth()+1)
        ||(tempYear==new Date().getFullYear()&&tempMonth==new Date().getMonth()+1&&tempDay<new Date().getDate())){
            Alert.alert("date already happened");
            return;
        }
        if(tempYear>new Date().getFullYear()+2){
            Alert.alert("date too far away");
            return;
        }
        this.store();
        this.setState({isEvent: false, date: "", message: ""})
    }

    clearAll = async() =>{
        let clearedArray = new Array(50);
        try {
            await AsyncStorage.setItem('key', JSON.stringify(clearedArray));
            Alert.alert("cleared!")
        } catch (error) {
            Alert.alert("Error clearing")
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <Text style={styles.header}>New Post</Text>
                <Text style={{marginTop:50}}>Assignment/Event</Text>
                <Switch
                    value={this.state.isEvent}
                    onValueChange={(value) => this.setState({isEvent:value})} />
                <Text style={{marginTop:50}}>Date Due</Text>
                <TextInput
                    style={{height: 40, width: 100}}
                    placeholder=" MM/DD/YYYY"
                    value={this.state.date}
                    onChangeText={(date) => this.setState({date})}
                    maxLength={10}
                />
                <Text style={{marginTop:50}}>Name and Details</Text>
                <TextInput
                    style={{height: 40, width: 170}}
                    value={this.state.message}
                    placeholder="message"
                    onChangeText={(message) => this.setState({message})}
                    maxLength={30}
                />
                <Button
                    onPress={this.buttonCheck}
                    style={{color:'white', fontSize:45, padding:10}}
                    containerStyle={{position: 'absolute', bottom:20, right:20, height:66, width:66, overflow:'hidden',
                        borderRadius:33, backgroundColor: 'red', justifyContent: 'center', alignItems:'center'}}>
                    +
                </Button>
                <Button
                    onPress={this.clearAll}
                    style={{color:'white', fontSize:12, padding:10}}
                    containerStyle={{position: 'absolute', bottom:20, left:20, height:30, width:80, overflow:'hidden',
                        borderRadius:10, backgroundColor: 'red', justifyContent: 'center', alignItems:'center'}}>
                    clear all
                </Button>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    header: {
        marginTop: 50,
        fontSize: 30,
        fontFamily: 'Roboto'
    },
    content: {
    },
});