import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import Firebase, { db } from '../database/firebase';
import { FontAwesome5 } from '@expo/vector-icons';

export default class ConfirmAccount extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            mobile: '',
            isLoading: true,
            confirmed: false,
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state
        this.setState({
            email: params.email,
            name: params.name,
            isLoading: false
        })
    }
    mobileInputHandler = (enteredText) => {
        this.setState({
            mobile: enteredText
        })
    }

    done = () => {
        this.setState({
            isLoading: true,
        });
        const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
        updateDBRef.update({
            mobile: this.state.mobile,
            confirmed: true
        }).then(() => {
            this.setState({
                isLoading: false,
                confirmed: false,
            });
        })
            .then(() => {
                this.props.navigation.navigate('OtpVerification', { mobile: Number(this.state.mobile) })

            })
            .catch((error) => {
                console.error("Error: ", error);
                this.setState({
                    isLoading: false,
                });
            });
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#f40552" />
                </View>
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: "#f8f3eb" }}>
                <View style={{ alignItems: "center", marginTop: '10%' }}>
                    <Image source={require('./images/logo1.png')} style={{ width: 330, height: 60, }}></Image>
                </View>
                <View style={styles.container}>
                    <KeyboardAvoidingView keyboardShouldPersistTaps='always'>
                        <Text style={{ fontWeight: "bold", fontFamily: "Roboto", textAlign: "center", fontSize: 20 }}>Confirm Your Account</Text>
                        <Text>{}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <FontAwesome5 name="user" size={20} color="#581845" style={styles.icon} />
                            <TextInput
                                style={styles.inputStyle}
                                value={this.state.name}
                                editable={false}
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <FontAwesome5 name="envelope" size={20} color="#581845" style={styles.icon} />
                            <TextInput
                                style={styles.inputStyle}
                                value={this.state.email}
                                editable={false}
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <FontAwesome5 name="phone" size={20} color="#581845" style={styles.icon} />
                            <TextInput
                                style={styles.inputStyle}
                                placeholder="Mobile No"
                                value={this.state.mobile}
                                onChangeText={this.mobileInputHandler}
                            />
                        </View>
                        <Text>{}</Text>
                        <TouchableOpacity onPress={this.done}>
                            <Text style={styles.btnStyle}>DONE</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
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
        justifyContent: "center",
        alignItems: "center",
        width: '80%',
        left: '10%',
        top: "25%",
        bottom: '10%',
        height: 400,
        padding: 25,
        borderColor: '#fff',
        borderWidth: 5,
        borderRadius: 15,
        backgroundColor: '#fff',
        position: "absolute",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 15,
    },
    inputStyle: {
        width: '85%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    loginText: {
        color: 'grey',
        marginTop: 25,
        textAlign: 'center'
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
    icon: {
        marginTop: "2%",
        right: "8%"
    },

    btnStyle: {
        backgroundColor: "#f40552",
        textAlign: "center",
        height: 35,
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