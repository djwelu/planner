import React, { Component } from "react";
import {AsyncStorage, StyleSheet, Text, View, Alert, ScrollView} from "react-native";
import {Calendar} from "react-native-calendars";
import PostMonth from './PostMonth.js';

export default class Month extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dateSelected: "",
            postArray: [],
            displayedPosts : [],
        };
    }

    componentDidMount = async() =>{
        let allAssignments;
        try {
            let yeee = await AsyncStorage.getItem('key');
            allAssignments = JSON.parse(yeee);
            if(allAssignments===null){
                return;
            }
        }catch(error){
            Alert.alert("error loading data");
        }
        let index;
        for(index=0; index<50; index++) {
            if (allAssignments[index] !== null) {
                this.state.postArray.push(allAssignments[index]);
            }
        }
        let nextIndex;
        for(index=0; index<this.state.postArray.length-1; index++){
            let curLowest = index;
            for(nextIndex=index+1; nextIndex<this.state.postArray.length; nextIndex++){
                if(this.dateToNum(this.state.postArray[nextIndex])<this.dateToNum(this.state.postArray[curLowest])){
                    let temp = this.state.postArray[nextIndex];
                    this.state.postArray[nextIndex] = this.state.postArray[curLowest];
                    this.state.postArray[curLowest] = temp;
                }
            }
        }
        this.setState({ postArray: this.state.postArray});
    };

    deletePost = async(key) =>{
        let needsDeleting = this.state.postArray[key];
        let parsedArray;
        try{
            let tempArray = await AsyncStorage.getItem('key');
            parsedArray = JSON.parse(tempArray);
            if(parsedArray===null){
                Alert.alert("error deleting post");
                return;
            }
        } catch (error) {
            Alert.alert("error deleting post");
            return;
        }
        let index;
        for(index=0; index<50; index++){
            if(parsedArray[index]!==null && parsedArray[index].newMessage===needsDeleting.newMessage){
                parsedArray[index]=null;
                break;
            }
        }
        let newPostArray = [];
        let newPostArrayEvents = [];
        for(index=0; index<50; index++){
            if(parsedArray[index]!==null){
                newPostArray.push(parsedArray[index]);
            }
        }
        try {
            await AsyncStorage.setItem('key', JSON.stringify(parsedArray));
            Alert.alert("Post has been deleted");
            this.setState({ postArray: newPostArray, displayedPosts: [], dateSelected: ""});
        } catch (error) {
            Alert.alert("error deleting post");
            return;
        }
    };

    dateToNum(post){
        return (10000*post.newDateYear)+(100*post.newDateMonth)+(post.newDateDay);
    }

    onDayPress = (day) => {
        let dayFormatted = day.dateString.substr(5,2)+"/"+day.dateString.substr(8,2)+"/"+day.dateString.substr(0,4)
        this.setState({dateSelected: dayFormatted});
        let nextArray = [];
        let index;
        for(index=0; index<this.state.postArray.length; index++){
            if(((this.state.postArray[index].newDateMonth)+"/"+(this.state.postArray[index].newDateDay)+"/"+(this.state.postArray[index].newDateYear))===dayFormatted){
                nextArray.push(this.state.postArray[index]);
            }
        }
        this.setState({ displayedPosts: nextArray});
    }

    componentWillReceiveProps = async(newProps) =>{
        if (newProps.screenProps.route_index === 1) {
            this.state.dateSelected = "";
            this.state.postArray = [];
            this.state.displayedPosts = [];
            let allAssignments;
            try {
                let yeee = await AsyncStorage.getItem('key');
                allAssignments = JSON.parse(yeee);
                if(allAssignments===null){
                    return;
                }
            }catch(error){
                Alert.alert("error loading data");
            }
            let index;
            for(index=0; index<50; index++) {
                if (allAssignments[index] !== null) {
                    this.state.postArray.push(allAssignments[index]);
                }
            }
            let nextIndex;
            for(index=0; index<this.state.postArray.length-1; index++){
                let curLowest = index;
                for(nextIndex=index+1; nextIndex<this.state.postArray.length; nextIndex++){
                    if(this.dateToNum(this.state.postArray[nextIndex])<this.dateToNum(this.state.postArray[curLowest])){
                        let temp = this.state.postArray[nextIndex];
                        this.state.postArray[nextIndex] = this.state.postArray[curLowest];
                        this.state.postArray[curLowest] = temp;
                    }
                }
            }
            this.setState({ postArray: this.state.postArray});
        }
    }

    render() {
        let posts = this.state.displayedPosts.map((val, key) =>
            {return <PostMonth key={key} keyval={key} val={val} deleteMethod={()=>this.deletePost(key)}/>});
        return (
            <View style={styles.container}>
                <View style={styles.calendarBorder}>
                    <Calendar
                        onDayPress={this.onDayPress}
                    />
                </View>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.body}>{this.state.dateSelected}</Text>
                    {posts}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 15,
    },
    content: {
        alignItems: 'center',
        paddingVertical: 20,

    },
    body: {
        fontSize: 20,
        fontFamily: 'Roboto',
        textDecorationLine: 'underline',
    },
    calendarBorder: {
        borderBottomColor: 'black',
        borderBottomWidth: 3,
    },
});