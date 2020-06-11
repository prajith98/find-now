import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert, BackHandler } from 'react-native';
import Firebase, { db } from '../database/firebase';
import { RFValue } from "react-native-responsive-fontsize";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import OTPTextView from 'react-native-otp-textinput';
import normalize from 'react-native-normalize';

export default class OtpVerifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            timer: null,
            counter: 30
        }
        this.timeout = 0;
    }
    componentDidMount() {
       this.sendOTP();
        this.state.timer = setInterval(() => {
            this.setState({
                counter: this.state.counter - 1
            })
        }, 1000)
    }
    componentWillUnmount = () => {
        clearInterval(this.state.timer);
    }
    submit = () => {
        const mobile = this.props.navigation.state.params.mobile
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/verifyOTP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'app',
                mobile: mobile,
                otp: Number(this.state.otp)
            })
        })
            .then(response => response.json())
            .then((jsonData) => {
                console.log(jsonData)
                if (jsonData.type == "success") {
                    const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
                    updateDBRef.update({
                        mobile: mobile.toString(),
                        mobileVerified: true,
                    })
                        .then(() => this.props.navigation.navigate('ProfileScreen'))
                    Alert.alert("", "Verification Complete!")
                }
                else
                    alert(jsonData.message)
            })
            .catch((error) => {
                console.error(error)
                this.props.navigation.navigate('ProfileScreen')
            })
    }
    sendOTP = () => {
        const mobile = this.props.navigation.state.params.mobile
        console.log(mobile)
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/sendOTP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'app',
                mobile: mobile
            })
        })

    }
    reSendOTP = () => {
        const mobile = this.props.navigation.state.params.mobile
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/resendOTP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'app',
                mobile: mobile
            })
        })
        this.setState({ counter: 30 })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f8f3eb" }}>
                <View style={{ alignItems: "center", marginTop: '10%' }}>
                    <Image source={require('../components/images/logo1.png')} style={{ width: normalize(330), height: normalize(60) }}></Image>
                </View>
                <View style={{ alignItems: "center", height: normalize(230), top: "5%" }}>
                    <View style={styles.container}>
                        <KeyboardAvoidingView keyboardShouldPersistTaps='always' style={{ height: '100%', justifyContent: "space-evenly" }}>
                            <Text style={{ fontFamily: "Roboto", textAlign: "center", fontSize: RFValue(16, windowHeight) }}>Enter OTP sent to your mobile number</Text>
                            <OTPTextView
                                ref={(e) => (this.input1 = e)}
                                textInputStyle={{ fontSize: RFValue(16, windowHeight) }}
                                handleTextChange={(text) => this.setState({ otp: text })}
                                inputCount={4}
                                keyboardType="numeric"
                            />
                            <View style={{ alignItems: "flex-end" }}>
                                {
                                    this.state.counter >= 0 ?
                                        <Text style={{ textAlign: "right" }}>Resend OTP in {this.state.counter}s</Text>
                                        : <Text style={{ textAlign: "right", borderBottomWidth: 0.5, borderColor: 'blue', color: 'blue' }} onPress={this.reSendOTP}>Resend OTP</Text>
                                }
                            </View>
                            <TouchableOpacity onPress={this.submit} style={{ height: "15%", alignItems: "center", top: "5%" }} >
                                <Text style={styles.btnStyle}>Submit</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
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
        width: '85%',
        padding: normalize(20),
        borderColor: '#fff',
        borderRadius: normalize(15),
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