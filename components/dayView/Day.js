import React from "react";
import { AsyncStorage, StyleSheet, Text, View, Alert, ScrollView, StatusBar } from "react-native";
import Post from './Post.js';

export default class Day extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            postArray: [],
            postArrayEvents: [],
        };
    }

    getDate = () => (
        <View>
            <Text style={styles.header}>{(new Date().getMonth()+1)+"/"+(new Date().getDate())+"/"+(new Date().getFullYear())}</Text>
        </View>
    );

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
            return;
        }
        let index;
        for(index=0; index<50; index++) {
            if (allAssignments[index] !== null && !allAssignments[index].newIsEvent) {
                this.state.postArray.push(allAssignments[index]);
            }
        }
        for(index=0; index<50; index++) {
            if (allAssignments[index] !== null && allAssignments[index].newIsEvent) {
                this.state.postArrayEvents.push(allAssignments[index]);
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
        this.setState({ postArray: this.state.postArray, postArrayEvents: this.state.postArrayEvents});
    };

    dateToNum(post){
        return (10000*post.newDateYear)+(100*post.newDateMonth)+(post.newDateDay);
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
            if(parsedArray[index]!==null  && !parsedArray[index].newIsEvent){
                newPostArray.push(parsedArray[index]);
            }
        }
        for(index=0; index<50; index++){
            if(parsedArray[index]!==null  && parsedArray[index].newIsEvent){
                newPostArrayEvents.push(parsedArray[index]);
            }
        }
        try {
            await AsyncStorage.setItem('key', JSON.stringify(parsedArray));
            Alert.alert("Post has been deleted");
            this.setState({ postArray: newPostArray, postArrayEvents: newPostArrayEvents});
        } catch (error) {
            Alert.alert("error deleting post");
            return;
        }
    };

    componentWillReceiveProps = async(newProps) =>{
        if (newProps.screenProps.route_index === 0) {
            this.state.postArray = [];
            this.state.postArrayEvents = [];
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
                if (allAssignments[index] !== null && !allAssignments[index].newIsEvent) {
                    this.state.postArray.push(allAssignments[index]);
                }
            }
            for(index=0; index<50; index++) {
                if (allAssignments[index] !== null && allAssignments[index].newIsEvent) {
                    this.state.postArrayEvents.push(allAssignments[index]);
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
            this.setState({ postArray: this.state.postArray, postArrayEvents: this.state.postArrayEvents});
        }
    }

    render() {
        let posts = this.state.postArray.map((val, key) => {
            return <Post key={key} keyval={key} val={val} deleteMethod={()=>this.deletePost(key)}/>});
        let eventPosts = this.state.postArrayEvents.map((val, key) =>
            {if(val.newDateMonth==new Date().getMonth()+1 && val.newDateDay==new Date().getDate() &&
                val.newDateYear==new Date().getFullYear())
                return <Post key={key} keyval={key} val={val} deleteMethod={()=>this.deletePost(key)}/>});
        return (
            <View style={styles.container}>
                <StatusBar hidden/>
                <ScrollView>
                    <View style={styles.content}>
                        {this.getDate()}
                        <Text style={styles.header2}>Assignments</Text>
                        {posts}
                        <Text style={styles.header2}>Events</Text>
                        {eventPosts}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 25,
        fontFamily: 'Roboto'
    },
    header2: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 20,
        fontFamily: 'Roboto',
        textDecorationLine: 'underline',
    },
    content: {
        alignItems: 'center',
    },
});