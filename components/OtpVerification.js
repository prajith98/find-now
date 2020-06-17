import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert, BackHandler } from 'react-native';
import Firebase, { db } from '../database/firebase';
const { windowWidth, windowHeight } = Dimensions.get('window');
import OTPTextView from 'react-native-otp-textinput';
import normalize from 'react-native-normalize';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
export default class OtpVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            timer: null,
            counter: 30,
            name: '',
            email: '',
            mobile: '',
            password: '',
            photoURL: '',
            emailVerified: false,
            loading: false,
        }
        this.timeout = 0;
    }
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const { params } = this.props.navigation.state;
            this.setState({
                name: params.name,
                email: params.email,
                mobile: params.mobile,
                password: params.password,
                photoURL: params.photoURL,
                emailVerified: params.emailVerified,
                counter: 30,
            }, () => this.sendOTP())
        })
        this.state.timer = setInterval(() => {
            this.setState({
                counter: this.state.counter - 1
            })
        }, 1000)

    }
    componentWillUnmount = () => {
        this.focusListener.remove();
        clearInterval(this.state.timer);
    }
    submit = () => {
        this.setState({ loading: true })
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/verifyOTP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'app',
                mobile: this.state.mobile,
                otp: Number(this.state.otp)
            })
        })
            .then(response => response.json())
            .then((jsonData) => {
                console.log(jsonData)
                if (jsonData.type == "success" || jsonData.message == "Mobile no. already verified") {
                    Firebase.auth()
                        .createUserWithEmailAndPassword(this.state.email, this.state.password)
                        .then(async (res) => {
                            res.user.updateProfile({
                                displayName: this.state.name,
                                photoURL: this.state.photoURL,
                            })
                            const user = {
                                email: this.state.email,
                                name: this.state.name,
                                mobile: this.state.mobile.toString(),
                                photoUrl: this.state.photoURL,
                                gender: "Not Set",
                                confirmed: true,
                                emailVerified: this.state.emailVerified,
                                mobileVerified: true,
                            }
                            var date = new Date().getDate(); //Current Date
                            var month = new Date().getMonth() + 1; //Current Month
                            var year = new Date().getFullYear(); //Current Year
                            var hours = new Date().getHours(); //Current Hours
                            var min = new Date().getMinutes(); //Current Minutes
                            var sec = new Date().getSeconds(); //Current Seconds
                            var lastLogIn = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
                            var log = {}
                            const device = {
                                Device: Device.modelName,
                                lastLogIn: lastLogIn,
                                ipAdress: await Network.getIpAddressAsync(),
                            }
                            log[0] = device
                            db.collection('users')
                                .doc(res.user.uid)
                                .set(user)
                            db.collection('device_log')
                                .doc(res.user.uid)
                                .set(log)
                            if (!this.state.emailVerified)
                                res.user
                                    .sendEmailVerification()
                                    .then(() => Alert.alert("Please verify your e-mail", "A verifaction mail has been sent to your mail address"))
                                    .catch(error => alert(error))
                                    .catch(function (error) {
                                        // Some error occurred, you can inspect the code: error.code
                                    });
                            this.props.navigation.navigate('App').then(() => this.setState({ loading: false }))
                        })
                        .catch(error => {
                            var err = error
                            if (err.toString() === "Error: The email address is already in use by another account.") {
                                Firebase.auth()
                                    .signInWithEmailAndPassword(this.state.email, this.state.password)
                                    .then(() => this.props.navigation.navigate('App').then(() => this.setState({ loading: false })))
                                    .catch(error => alert("Invalid Email Id or Password"))
                            }
                            else console.log(error)
                            this.setState({ loading: false })
                        })
                    Alert.alert("", "Verification Complete!")
                }
                else {
                    alert(jsonData.message)
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
    sendOTP = () => {
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/sendOTP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'app',
                mobile: this.state.mobile
            })
        })

    }
    reSendOTP = () => {
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/resendOTP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'app',
                mobile: this.state.mobile
            })
        })
        this.setState({ counter: 30 })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f8f3eb" }}>
                <View style={{ alignItems: "center", marginTop: '10%' }}>
                    <Image source={require('./images/logo1.png')} style={{ width: normalize(330), height: normalize(60) }}></Image>
                </View>
                <View style={{ alignItems: "center", height: normalize(220), top: "5%" }}>
                    <View style={styles.container}>
                        <KeyboardAvoidingView keyboardShouldPersistTaps='always' style={{ height: '100%', justifyContent: "space-evenly" }}>
                            <Text style={{ fontFamily: "Roboto", textAlign: "center", fontSize: normalize(16) }}>Enter OTP sent to {this.state.mobile.replace('+91', '+91 ')}</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Text style={{ fontFamily: "Roboto", textAlign: "right", fontSize: normalize(15), color: "#0CE2FE" }}>Wrong Number?</Text>
                            </TouchableOpacity>
                            <OTPTextView
                                ref={(e) => (this.input1 = e)}
                                textInputStyle={{ fontSize: normalize(16) }}
                                handleTextChange={(text) => this.setState({ otp: text })}
                                inputCount={4}
                                keyboardType="numeric"
                            />
                            <View style={{ alignItems: "flex-end" }}>
                                {
                                    this.state.counter >= 0 ?
                                        <Text style={{ textAlign: "right" }}>Resend OTP in {this.state.counter}s</Text>
                                        : <Text style={{ textAlign: "right", borderBottomWidth: 0.5, borderColor: '#009EFB', color: '#009EFB' }} onPress={this.reSendOTP}>Resend OTP</Text>
                                }
                            </View>
                            <TouchableOpacity onPress={this.submit} style={{ height: normalize(40), alignItems: "center", top: "5%" }} >
                                <Text style={styles.btnStyle}>Submit</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                        <Spinner
                            textStyle={{ color: "white", width: "100%", textAlign: "center" }}
                            visible={this.state.loading}
                            textContent={'Loading...'}
                        />
                    </View>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: '87%',
        padding: 20,
        borderColor: '#fff',
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 15,
    },
    textOTP: {
        width: '18%',
        height: "100%",
        alignSelf: "center",
        borderColor: "grey",
        borderBottomWidth: 1,
        textAlign: "center",
        borderRadius: 5
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    btnStyle: {
        backgroundColor: "#f40552",
        textAlign: "center",
        width: '90%',
        height: "100%",
        textAlignVertical: "center",
        color: "white",
        fontFamily: "Roboto",
        fontWeight: "bold",
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    }
});