import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, TouchableOpacity, Image, Alert, KeyboardAvoidingView } from 'react-native';
import Firebase from '../database/firebase';
import { FontAwesome5, Entypo } from '@expo/vector-icons';

export default class ResetPassword extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isLoading: false,
            hidePassword: true,
        }
    }

    handleLogin = () => {
        const { email } = this.state

        Firebase.auth()
            .sendPasswordResetEmail(email)
            .then(() => Alert.alert("Password reset email has been sent"))
            .catch(error => alert(error))
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: "#f8f3eb" }} >
                <View style={{ alignItems: "center", marginTop: '10%' }}>
                    <Image source={require('./images/logo1.png')} style={{ width: 330, height: 60, }}></Image>
                </View>
                <View style={styles.container}>
                    <KeyboardAvoidingView keyboardShouldPersistTaps='always'>
                        <Text>{'\n\n'}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <FontAwesome5 name="envelope" size={20} color="#581845" style={styles.icon} />
                            <TextInput
                                style={styles.inputStyle}
                                placeholder="Email"
                                value={this.state.email}
                                onChangeText={(val) => this.setState({ email: val })}
                            />
                        </View>
                        <Button
                            color="#f40552"
                            title="Reset Password"
                            onPress={this.handleLogin}
                        />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text
                                style={styles.loginText}
                            >
                                Back to Login
            </Text>
                        </TouchableOpacity>

                    </KeyboardAvoidingView>
                </View>
            </View>
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
        height: 350,
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
    btnImage:
    {
        resizeMode: 'contain',
        height: '100%',
        width: '100%'
    },
    icon: {
        marginTop: "2%",
        right: "8%"
    }
});