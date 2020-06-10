import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, TextInput, Image, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons'
import normalize from 'react-native-normalize';
import { Divider } from 'react-native-elements';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Firebase, { db } from '../database/firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class Screen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            d: false,
            n: false,
            s: false,
            v: false,
            category: "",
            suggestions: false,
            bug: false,
            compliments: false,
            feedback: ""
        }
    }
    _category = (val) => {
        this.setState({ category: val })
        if (val == 'suggestion') {
            this.setState({ suggestions: true })
            this.setState({ bug: false })
            this.setState({ compliments: false })
        }
        else if (val == 'bug') {
            this.setState({ suggestions: false })
            this.setState({ bug: true })
            this.setState({ compliments: false })
        }
        else if (val == 'compliments') {
            this.setState({ suggestions: false })
            this.setState({ bug: false })
            this.setState({ compliments: true })
        }
    }
    _select = (val) => {
        if (val == 'd') {
            this.setState({ d: true })
            this.setState({ n: false })
            this.setState({ s: false })
            this.setState({ v: false })
        }
        else if (val == 'n') {
            this.setState({ d: false })
            this.setState({ n: true })
            this.setState({ s: false })
            this.setState({ v: false })
        }
        else if (val == 's') {
            this.setState({ d: false })
            this.setState({ n: false })
            this.setState({ s: true })
            this.setState({ v: false })
        }
        else if (val == 'v') {
            this.setState({ d: false })
            this.setState({ n: false })
            this.setState({ s: false })
            this.setState({ v: true })
        }
    }
    feedbackInputHandler = (val) => {
        this.setState({ feedback: val })
    }
    onSubmit = async () => {
        var oldFeedback = {}
        console.log("feedback :" + this.state.feedback)
        const firestoreRef = db.collection('feedback').doc(this.state.category);
        await firestoreRef.get()
            .then((doc) => {
                if (doc.exists) {
                    oldFeedback = doc.data()
                    console.log(doc.data())
                }
                else {
                    console.log("creating new doc")
                    db.collection('feedback').doc(this.state.category)
                        .set({
                            1: this.state.feedback
                        })
                    return 1;
                }
            })
        var count = Object.keys(oldFeedback).length;
        console.log("count : " + count)
        oldFeedback[count] = this.state.feedback
        db.collection('feedback').doc(this.state.category).update(oldFeedback);
        Alert.alert("", "Thank you for your feedback!")
        this.reset();
    }
    reset = () => {
        this.setState({
            d: false,
            n: false,
            s: false,
            v: false,
            category: "",
            suggestions: false,
            bug: false,
            compliments: false,
            feedback: ""
        })
    }
    closeHandler = () => {
        this.reset();
        this.props.navigation.navigate('HomeScreen')
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                                <Text style={styles.headerText}>Feedback</Text>
                            </View>
                            <TouchableOpacity style={{ justifyContent: "center" }} onPress={this.closeHandler}>
                                <Feather name="x" size={normalize(30)} color="black" />
                            </TouchableOpacity>
                        </View>
                        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                            <View style={{ width: "100%", alignItems: "center", height: windowHeight - (windowHeight / 7) }}>
                                <Text style={{ fontSize: normalize(18), paddingBottom: normalize(30), fontWeight: "bold" }}>We would like your feedback to improve our app</Text>
                                <Text style={{ fontSize: normalize(16), paddingBottom: normalize(10) }}>What is your opinion of this app</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <TouchableOpacity style={{ width: normalize(70), height: normalize(70) }} onPress={() => this._select("d")}>
                                        <MaterialIcons name="sentiment-dissatisfied" size={normalize(60)} color={this.state.d ? "red" : "#2C3539"} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ width: normalize(70), height: normalize(70) }} onPress={() => this._select("n")}>
                                        <MaterialIcons name="sentiment-neutral" size={normalize(60)} color={this.state.n ? "orange" : "#2C3539"} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ width: normalize(70), height: normalize(70) }} onPress={() => this._select("s")}>
                                        <MaterialIcons name="sentiment-satisfied" size={normalize(60)} color={this.state.s ? "lime" : "#2C3539"} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ width: normalize(70), height: normalize(70) }} onPress={() => this._select("v")}>
                                        <MaterialIcons name="sentiment-very-satisfied" size={normalize(60)} color={this.state.v ? "green" : "#2C3539"} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ padding: 12, width: "90%" }}>
                                    <Divider style={{ height: normalize(3) }} />
                                </View>
                                <Text style={{ fontSize: normalize(16), paddingBottom: normalize(10) }}>Please select your feedback category below.</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
                                    <View>
                                        <TouchableOpacity style={[styles.btn2, { borderWidth: this.state.suggestions ? 1 : 0, borderColor: this.state.suggestions ? "orange" : "#f8f3eb" }]} onPress={() => this._category("suggestion")}>
                                            <Image source={require("../assets/suggestion.png")} style={styles.btnImage} />
                                            <Text style={styles.btnText}>Suggestions</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={[styles.btn2, { borderWidth: this.state.bug ? 1 : 0, borderColor: this.state.bug ? "orange" : "#f8f3eb" }]} onPress={() => this._category("bug")}>
                                            <Image source={require("../assets/bug.png")} style={[styles.btnImage, { left: normalize(10) }]} />
                                            <Text style={styles.btnText}>Bug Report</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={[styles.btn2, { borderWidth: this.state.compliments ? 1 : 0, borderColor: this.state.compliments ? "orange" : "#f8f3eb" }]} onPress={() => this._category("compliments")}>
                                            <Image source={require("../assets/like.png")} style={[styles.btnImage, { left: normalize(10) }]} />
                                            <Text style={styles.btnText}>Compliments</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ padding: 12, width: "90%" }}>
                                    <Divider style={{ height: normalize(3) }} />
                                </View>
                                <Text style={{ fontSize: normalize(16), paddingBottom: normalize(10), width: normalize(300) }}>Please leave your feedback below.</Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={6}
                                    onChangeText={this.feedbackInputHandler}
                                    style={{ borderRadius: normalize(5), borderColor: "grey", backgroundColor: 'white', width: normalize(300), borderWidth: 1, height: normalize(100), textAlignVertical: "top" }}
                                />
                                <View style={{ width: '90%', alignItems: "flex-end", height: normalize(45), justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={{ borderRadius: normalize(10), padding: normalize(10), width: normalize(90), alignItems: "center", justifyContent: "center", backgroundColor: "#667C26" }} onPress={this.onSubmit}>
                                        <Text style={{ color: "white", fontWeight: "900", fontFamily: "Roboto", fontSize: normalize(15) }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb",
    },
    text: {
        color: "#161924",
        fontSize: 20,
        fontWeight: "500"
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: windowHeight / 7

    },
    headerText: {
        fontSize: normalize(24),
        borderBottomWidth: 2,
        borderBottomColor: "#e43f5a",
    },
    btn2: {
        width: normalize(110),
        height: normalize(120),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    btnImage: {
        width: normalize(70),
        height: normalize(70),
        resizeMode: "contain",

    },
    btnText: {
        fontSize: normalize(16),
        textAlign: "left"
    }
})
