import React from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { YellowBox } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import paisa from 'paisa.js'
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
let LoanT = [{ value: "Home Loan" }, { value: "Car Loan" }, { value: "Education Loan" }, { value: "Loan Against Property" }, { value: "Topup Loan" }, { value: "Business Term Loan" }, { value: "Lease Rent Discounting" }, { value: "Commercial Property Loan" }, { value: "others" }]
import Firebase, { db } from '../database/firebase';
import LoanProfile from '../components/LoanProfile'
import normalize from 'react-native-normalize';
export default class LPScreen extends React.Component {
    constructor(props) {
        super(props)
        this.firestoreRef = db.collection('USER :' + Firebase.auth().currentUser.email);
        this.emailVerifiedRef = db.collection('users').doc(Firebase.auth().currentUser.uid)
        this.state = {
            showInputFields: false,
            LoanProfile: [],
            emailVerified: false
        }
    }
    componentDidMount() {
        if (Firebase.auth().currentUser.emailVerified) {
            this.setState({ emailVerified: true });
            this.emailVerifiedRef.update({
                emailVerified: true
            })
        }
        else {
            this.emailVerifiedRef.get().then((res) => {
                if (res.exists) {
                    const user = res.data();
                    this.setState({
                        emailVerified: user.emailVerified
                    },
                        () => {
                            if (user.emailVerified)
                                this.setState({ emailVerified: true })
                        });
                } else {
                    console.log("Document does not exist!");
                }
            });
        }

    }

    closeHandler = () => {
        this.props.navigation.navigate('HomeScreen')
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1, marginTop: 35 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            <View style={{ alignItems: "flex-start", flexDirection: "row", width: "80%" }}>
                                <Text style={styles.headerText}>Loan Profile</Text>
                                <View style={{ top: 8 }}>
                                    <TouchableOpacity style={{}} onPress={() => this.setState({ showInputFields: true })}>
                                        <Entypo name="squared-plus" size={35} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={this.closeHandler}>
                                <Feather name="x" size={34} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        {
                            this.state.emailVerified ? (
                                <View style={{ width: "90%" }}>
                                    <Text style={{ fontSize: normalize(18), bottom: normalize(35), textAlign: "center" }}>We are currently updataing the feature of this section for better experience!</Text>
                                </View>
                            )
                                : (
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <Text>Kindly verify your email to use this feature</Text>
                                        <ActivityIndicator size="large" color="#f40552" />
                                    </View>
                                )
                        }
                    </View>
                </SafeAreaView>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb"
    },
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 20,
        backgroundColor: "#f8f3eb"
    },
    headerText: {
        color: "#161924",
        fontSize: 35,
        borderBottomWidth: 2,
        borderColor: "#e43f5a"
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: 70,
        justifyContent: "space-between",
    },
    text: {
        color: "#161924",
        fontSize: 20,
        fontWeight: "500"
    },
    textInput: {
        borderBottomColor: "black",
        borderBottomWidth: 1,
        width: '85%',
        padding: 5,
        fontSize: 20
    },
    combo: {
        width: '85%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 7
    },
    combo1: {
        width: '85%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 14
    },
    dropdown: {
        width: '85%',
        fontSize: 40,
        bottom: "3%",
        paddingLeft: 5,
    },
    textOutput: {
        padding: 30,
        fontSize: 20
    },
    answer: {
        flexDirection: "column",
    },
    tableContainer: {
        flex: 1,
        padding: 18,
        paddingTop: 35,
        backgroundColor: '#ffffff'
    },
    TableText: {
        margin: 10
    }
})
