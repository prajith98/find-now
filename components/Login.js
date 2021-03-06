import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableOpacity, Image, Keyboard, Alert } from 'react-native';
import Firebase, { db } from '../database/firebase';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import * as Device from 'expo-device';
import LinkedInModal, { LinkedInToken } from 'react-native-linkedin'
import normalize from 'react-native-normalize';
import * as Network from 'expo-network';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Constants from "expo-constants";
export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      hidePassword: true,
    }
  }
  loginWithFacebook = async () => {
    var apiKey;
    await fetch(`https://us-central1-global-gist-279416.cloudfunctions.net/facebookAPI`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parameter: 'app',
      })
    })
      .then(response => response.json())
      .then((jsonData) => {
        apiKey = jsonData.apiKey
      })
      .catch((error) => {
        console.error(error)
      })
    try {
      await Facebook.initializeAsync(apiKey);
      const {
        type,
        token,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=name,picture.type(large),email`);
        const userInfo = await response.json();
        Firebase.auth()
          .signInWithEmailAndPassword(userInfo.email, userInfo.id)
          .then(() => this.props.navigation.navigate('App'))
          .then(async () => {
            const dbRef = db.collection('device_log').doc(Firebase.auth().currentUser.uid)
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds
            var lastLogIn = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec
            var oldLog = {}
            await dbRef.get()
              .then((res) => {
                oldLog = res.data();
              })
            const curr_log = {
              Device: Device.modelName,
              lastLogIn: lastLogIn,
              ipAdress: await Network.getIpAddressAsync(),
            }
            var count = Object.keys(oldLog).length;
            oldLog[count] = curr_log
            db.collection('device_log')
              .doc(Firebase.auth().currentUser.uid)
              .update(oldLog)
          })
          .catch(error => {
            var err = error
            if (err.toString() === "Error: The password is invalid or the user does not have a password.") {
              Alert.alert("Account Already Exists!", "Try sign in with your password")
              return 0;
            }
            else if (err.toString() === "Error: There is no user record corresponding to this identifier. The user may have been deleted.")
              this.props.navigation.navigate('ConfirmAccount', { email: userInfo.email, name: userInfo.name, password: userInfo.id, photoUrl: userInfo.picture.data.url })
          }
          )
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }
  signInWithGoogleAsync = async () => {
    var androidClientId, iosClientId;
    await fetch(`https://us-central1-global-gist-279416.cloudfunctions.net/googleAPI`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parameter: 'app',
      })
    })
      .then(response => response.json())
      .then((jsonData) => {
        androidClientId = jsonData.androidClientId,
          iosClientId = jsonData.iosClientId
      })
      .catch((error) => {
        console.error(error)
      })
    try {
      const result = await Google.logInAsync({
        androidClientId: androidClientId,
        iosClientId: iosClientId,
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        console.log("in here")
        Firebase.auth()
          .signInWithEmailAndPassword(result.user.email, result.user.photoUrl)
          .then(() => this.props.navigation.navigate('App'))
          .then(async () => {
            const dbRef = db.collection('device_log').doc(Firebase.auth().currentUser.uid)
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds
            var lastLogIn = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec
            var oldLog = {}
            await dbRef.get()
              .then((res) => {
                oldLog = res.data();
              })
            console.log(oldLog)
            const curr_log = {
              Device: Device.modelName,
              lastLogIn: lastLogIn,
              ipAdress: await Network.getIpAddressAsync(),
            }
            var count = Object.keys(oldLog).length;
            oldLog[count] = curr_log
            db.collection('device_log')
              .doc(Firebase.auth().currentUser.uid)
              .update(oldLog)
          })
          .catch(error => {
            var err = error
            if (err.toString() === "Error: The password is invalid or the user does not have a password.") {
              Alert.alert("Account Already Exists!", "Try sign in with your password")
              return 0;
            }
            else if (err.toString() === "Error: There is no user record corresponding to this identifier. The user may have been deleted.")
              this.props.navigation.navigate('ConfirmAccount', { email: result.user.email, name: result.user.givenName + " " + result.user.familyName, password: result.user.photoUrl, photoUrl: result.user.photoUrl })
          }
          )
        return result.accessToken;
      } else {
        Alert.alert("Signin Error", "Try using different method.")
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  handleLogin = () => {
    const { email, password } = this.state
    Keyboard.dismiss()
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('App'))
      .then(async () => {
        const dbRef = db.collection('device_log').doc(Firebase.auth().currentUser.uid)
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        var lastLogIn = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec
        var oldLog = {}
        await dbRef.get()
          .then((res) => {
            oldLog = res.data();
          })
        const curr_log = {
          Device: Device.modelName,
          lastLogIn: lastLogIn,
          ipAdress: await Network.getIpAddressAsync(),
        }
        var count = Object.keys(oldLog).length;
        oldLog[count] = curr_log
        db.collection('device_log')
          .doc(Firebase.auth().currentUser.uid)
          .update(oldLog)
      })
      .catch(error => alert("Invalid Email Id or Password"))
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
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
          <Image source={require('./images/logo1.png')} style={{ width: normalize(330), height: normalize(60) }}></Image>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={styles.container}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <FontAwesome5 name="user" size={20} color="#581845" style={styles.icon} />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Email"
                  value={this.state.email}
                  onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <FontAwesome5 name="key" size={20} color="#581845" style={styles.icon} />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Password"
                  value={this.state.password}
                  onChangeText={(val) => this.updateInputVal(val, 'password')}
                  secureTextEntry={this.state.hidePassword}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                  <Image source={(this.state.hidePassword) ? require('./images/hide.png') : require('./images/view.png')} style={styles.btnImage} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ bottom: "2%" }} onPress={() => this.props.navigation.navigate('ResetPassword')}>
                <Text style={{ textAlign: "right" }}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleLogin}>
                <Text style={styles.btnStyle}>LOG IN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                <Text
                  style={styles.loginText}
                >
                  Don't have account? Signup
            </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20 }}>
                <TouchableOpacity>
                  <Entypo name="google--with-circle" color="#EA4335" size={45} onPress={this.signInWithGoogleAsync} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Entypo name="facebook-with-circle" color="#3b5998" size={45} onPress={this.loginWithFacebook} />
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: '80%',
    top: normalize(50),
    padding: normalize(25),
    paddingTop:normalize(50),
    paddingBottom:normalize(40),
    borderColor: '#fff',
    borderWidth: 5,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 15,
  },
  inputStyle: {
    fontSize: normalize(15),
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
  visibilityBtn:
  {
    position: 'absolute',
    right: normalize(3),
    height: normalize(30),
    width: normalize(30),
    padding: normalize(5)
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
  },
  btnStyle: {
    backgroundColor: "#f40552",
    textAlign: "center",
    height: normalize(35),
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