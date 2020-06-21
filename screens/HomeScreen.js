import React from 'react';
import { StyleSheet, Dimensions, Text, View, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Linking, AsyncStorage } from 'react-native';
import { Feather } from '@expo/vector-icons'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Firebase, { db } from '../database/firebase'
import normalize from 'react-native-normalize';
import * as Device from 'expo-device';
export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.firestoreRef = db.collection('users');
        this.state = {
            name: '',
            photoUrl: '',
            photoAvailable: false,
            news: [],
            loggedin: false,
            displayHead: "Hi ",
            displayStatus: "Let's have a check on your status!",
        }
    }
    componentDidMount = async () => {
        const { navigation } = this.props;
        this.fetchData()
        this.focusListener = navigation.addListener('didFocus', () => {
            this.fetchData()
        });
        const value = await AsyncStorage.getItem("LogKey");
        const stat = JSON.parse(value).status
        stat ? this.setState({ displayHead: "Welcome, " }) : null
        stat ? this.setState({ displayStatus: "Hope you and your family are doing well" }) : null
    }
    componentWillUnmount = () => {
        this.focusListener.remove();
    }
    fetchData = () => {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const dbRef = db.collection('users').doc(Firebase.auth().currentUser.uid)
                dbRef.get().then((res) => {
                    if (res.exists) {
                        const user = res.data();
                        var n1 = user.name.split(" ")
                        this.setState({
                            name: n1[0],
                            photoUrl: user.photoUrl,
                        }, () => {
                            if (this.state.photoUrl !== "")
                                this.setState({ photoAvailable: true })
                            else this.setState({ photoAvailable: false })
                        });
                    } else {
                        console.log("Document does not exist!");
                    }
                });
                this.setState({ loggedin: true })

            }
            else
                this.setState({ loggedin: false })
        })
    }
    render() {
        if (this.state.loggedin)
            return (
                <View style={styles.container}>
                    <SafeAreaView style={{ flex: 1, marginTop: normalize(35) }}>
                        <View style={{ alignItems: "center", height: "20%" }}>
                            <View style={styles.header}>
                                <TouchableOpacity style={{ flex: 0.5, alignItems: "flex-start" }} onPress={this.props.navigation.openDrawer}>
                                    <Feather name="menu" size={normalize(24)} color="black" />
                                </TouchableOpacity>
                                <View style={{ flex: 4, alignItems: "flex-start" }}>
                                    <Text style={styles.headerText}>Home{'\n'}</Text>
                                    <Text style={styles.subHeaderText}>{this.state.displayHead + this.state.name}</Text>
                                    <Text style={styles.subHeaderText2}>{this.state.displayStatus}</Text>
                                </View>
                                <TouchableOpacity style={styles.profile} onPress={() => this.props.navigation.navigate("ProfileScreen")}>
                                    {this.state.photoAvailable ? (<Image source={{ uri: this.state.photoUrl }} style={{resizeMode:"cover", width: normalize(70), height: normalize(70), borderRadius:normalize(90) }} />)
                                        : <Image source={require("../assets/profile-pic.png")} style={{ resizeMode: "contain", width: normalize(70), height: normalize(70) }} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.body}>
                            <TouchableOpacity style={styles.moratorium} onPress={() => this.props.navigation.navigate('MCCScreen')}>
                                <Image source={require("../assets/moratorium.png")} style={styles.btnIcon1} />
                                <View style={{ flexDirection: "column", alignItems: "center" }}>
                                    <Text style={{ fontSize: normalize(15), fontFamily: "Roboto", color: "white" }}> Moratorium Calulator (COVID-19) </Text>
                                </View>
                                <Image source={require("../assets/new.png")} style={{ width: normalize(25), height: normalize(25), resizeMode: "contain" }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.emi} onPress={() => this.props.navigation.navigate('EMIScreen')}>
                                <Image source={require("../assets/calculator.png")} style={styles.btnIcon1} />
                                <View style={{ flexDirection: "column", alignItems: "center" }}>
                                    <Text style={{ fontSize: normalize(15), fontFamily: "Roboto", color: "white" }}> EMI Calculator</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.loanProfile} onPress={() => this.props.navigation.navigate('LPScreen')}>
                                <Image source={require("../assets/loan.png")} style={styles.btnIcon1} />
                                <View style={{ flexDirection: "column", alignItems: "center" }}>
                                    <Text style={{ fontSize: normalize(15), fontFamily: "Roboto", color: "white" }}> Track your Loan</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: normalize(18), fontWeight: '500', fontFamily: "Roboto", color: "#44233e", width: "100%", paddingLeft: 10 }}>{'\n'}Useful Links:</Text>
                        <View style={{ flex: 1, flexDirection: "row", marginTop: 20, justifyContent: "space-evenly" }}>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => this.props.navigation.navigate('NewsScreen')}>
                                <Image source={require("../assets/news.png")} style={{ width: "55%", height: "65%", resizeMode: "contain" }} />
                                <Text style={styles.btnText}>Daily News</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => Linking.openURL('https://www.cibil.com/freecibilscore')}>
                                <Image source={require("../assets/cibil.png")} style={{ width: "55%", height: "65%", resizeMode: "contain" }} />
                                <Text style={styles.btnText}>Free CIBIL Score</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => this.props.navigation.navigate('BankScreen')}>
                                <Image source={require("../assets/bank.png")} style={{ width: "55%", height: "65%", resizeMode: "contain" }} />
                                <Text style={styles.btnText}>Bank Finder</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            )
        else
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#de0647" />
                </View>
            )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb",
        width: windowWidth,
        height: windowHeight
    },
    headerText: {
        fontSize: normalize(18),
        color: "#44233e",
        width: "100%",
        fontFamily: "Roboto"
    },
    subHeaderText: {
        fontSize: normalize(20),
        color: "#44233e",
        fontWeight: "bold",
        fontFamily: "Roboto",
        width: "100%"
    },
    subHeaderText2: {
        fontSize: normalize(14),
        fontFamily: "Roboto",
        color: "#44233e",
        width: "100%"
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: "100%",
        backgroundColor: "#f8f3eb",
    },
    moratorium: {
        flexDirection: "row",
        backgroundColor: "#de0647",
        justifyContent: "flex-start",
        width: normalize(350),
        height: normalize(65),
        alignItems: "center",
        borderRadius: normalize(40),
        left: "30%",
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 20,
    },
    emi: {
        flexDirection: "row",
        backgroundColor: "#de0647",
        justifyContent: "flex-start",
        width: normalize(350),
        height: normalize(65),
        alignItems: "center",
        borderRadius: normalize(40),
        left: "50%",
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 20,
    },
    loanProfile: {
        flexDirection: "row",
        backgroundColor: "#de0647",
        justifyContent: "flex-start",
        width: normalize(350),
        height: normalize(65),
        alignItems: "center",
        borderRadius: normalize(40),
        left: "70%",
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: normalize(20),
    },
    body: {
        backgroundColor: "#f8f3eb",
        width: '100%',
        height: '40%',
        justifyContent: "space-evenly"
    },
    btnIcon1: {
        height: normalize(35),
        width: normalize(35),
        marginLeft: normalize(10),
        resizeMode: "contain"
    },
    profile: {
        flex: 1,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        elevation: 10,
        width: normalize(70),
        height: normalize(70),
        borderRadius: normalize(50),
    },
    btnStyle: {
        alignItems: "center",
        width: "30%",
        height: "50%",
        justifyContent: 'center',
        borderRadius: normalize(20),
        margin: normalize(20),
    },
    btnText: {
        color: "#de0647",
        fontSize: normalize(15),
        fontFamily: "Roboto",
        textAlign: "center"
    },
})
