import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import Firebase, { db } from '../database/firebase';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import LinkedInModal, { LinkedInToken } from 'react-native-linkedin'
import normalize from 'react-native-normalize';
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
          .createUserWithEmailAndPassword(userInfo.email, userInfo.id)
          .then((res) => {
            res.user.updateProfile({
              displayName: userInfo.name,
              photoURL: userInfo.picture.data.url
            })
            const user = {
              email: userInfo.email,
              name: userInfo.name,
              photoUrl: userInfo.picture.data.url,
              gender: "Not Set",
              confirmed: false,
              emailVerified: true,
              mobileVerified: false,
            }
            db.collection('users')
              .doc(res.user.uid)
              .set(user)
            this.props.navigation.navigate('ConfirmAccount', { email: user.email, name: user.name })
          })
          .catch(error => {
            var err = error
            if (err.toString() === "Error: The email address is already in use by another account.") {
              Firebase.auth()
                .signInWithEmailAndPassword(userInfo.email, userInfo.id)
                .then(() => this.props.navigation.navigate('App'))
                .catch(error => alert("Invalid Email Id or Password"))
            }
          })
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
        behavior: 'system',
        androidClientId: androidClientId,
        iosClientId: iosClientId,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        Firebase.auth()
          .createUserWithEmailAndPassword(result.user.email, result.user.photoUrl)
          .then((res) => {
            res.user.updateProfile({
              displayName: result.user.givenName + " " + result.user.familyName,
              photoURL: result.user.photoUrl
            })
            const user = {
              email: result.user.email,
              name: result.user.givenName + " " + result.user.familyName,
              photoUrl: result.user.photoUrl,
              gender: "Not Set",
              confirmed: false,
              emailVerified: true,
              mobileVerified: false,
            }
            db.collection('users')
              .doc(res.user.uid)
              .set(user)
            this.props.navigation.navigate('ConfirmAccount', { email: user.email, name: user.name })
          })
          .catch(error => {
            var err = error
            if (err.toString() === "Error: The email address is already in use by another account.") {
              Firebase.auth()
                .signInWithEmailAndPassword(result.user.email, result.user.photoUrl)
                .then(() => this.props.navigation.navigate('App'))
                .catch(error => alert("Invalid Email Id or Password"))
            }
          })
        return result.accessToken;
      } else {
        Alert.alert("", "The email address is already in use by another account.")
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
      .catch(error => alert("Invalid Email Id or Password"))
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  // signinWithLinkedin = (name, email, photoURL) => {
  //   if (name != "" && email != null && photoURL != null) {
  //     Firebase.auth()
  //       .createUserWithEmailAndPassword(email, photoURL)
  //       .then((res) => {
  //         res.user.updateProfile({
  //           displayName: name,
  //           photoURL: photoURL
  //         })
  //         const user = {
  //           email: email,
  //           name: name,
  //           mobile: "",
  //           photoUrl: photoURL,
  //           gender: "Not Set",
  //           confirmed: false,
  //           emailVerified: true,
  //           mobileVerified: false,
  //         }

  //         db.collection('users')
  //           .doc(res.user.uid)
  //           .set(user)
  //         this.props.navigation.navigate('ConfirmAccount', { email: email, name: name })
  //       })
  //       .catch(error => {
  //         var err = error
  //         if (err.toString() === "Error: The email address is already in use by another account.") {
  //           Firebase.auth()
  //             .signInWithEmailAndPassword(email, photoU)
  //             .then(() => this.props.navigation.navigate('App'))
  //             .catch(error => alert("Invalid Email Id or Password"))
  //         }
  //       })
  //   }
  //   else {
  //     Alert.alert('Login error', "Please use a different sign-in method")
  //   }
  // }
  // getLinkedinUser = async (data) => {
  //   const { access_token, authentication_code } = data

  //   if (!authentication_code) {
  //     this.setState({ refreshing: true })

  //     const response = await fetch('https://api.linkedin.com/v2/me', {
  //       method: 'GET',
  //       headers: {
  //         Authorization: 'Bearer ' + access_token,
  //       },
  //     })
  //     const getEmail = await fetch('https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))', {
  //       method: 'GET',
  //       headers: {
  //         Authorization: 'Bearer ' + access_token,
  //       },
  //     })
  //     const getPhotoUrl = await fetch('https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~:playableStreams))', {
  //       method: 'GET',
  //       headers: {
  //         Authorization: 'Bearer ' + access_token,
  //       },
  //     })
  //     const payload = await response.json()
  //     var name = payload.localizedFirstName + ' ' + payload.localizedLastName;
  //     const payload2 = await getEmail.json()
  //     var email = payload2.elements[0]['handle~'].emailAddress
  //     const payload3 = await getPhotoUrl.json()
  //     var photoURL = payload3.profilePicture["displayImage~"].elements[3].identifiers[0].identifier
  //     this.signinWithLinkedin(name, email, photoURL);
  //     return;
  //   } else {
  //     Alert.alert('Login error', "Please use a different sign-in method")
  //     return;
  //   }
  // }
  // renderLinkedinButton = async () => {

  //   return (
  //     <TouchableOpacity>
  //       <Entypo name="linkedin-with-circle" color="#0e76a8" size={45} onPress={() => this.modal.open()} />
  //     </TouchableOpacity>
  //   );
  // };
  // returnClientId = () => {
  //   return CLIENT_ID
  // }
  // returnClientSecret = () => {
  //   return CLIENT_SECRET
  // }
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
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardShouldPersistTaps='always'>
            <Text>{'\n\n'}</Text>
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
              {/* <LinkedInModal
                  ref={ref => { this.modal = ref; }}
                  renderButton={this.renderLinkedinButton}
                  clientID={CLIENT_ID}
                  clientSecret={CLIENT_SECRET}
                  redirectUri='https://oauth.io/auth'
                  onSuccess={(token) => this.getLinkedinUser(token)}
                />
               */}
            </View>
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
    height: normalize(400),
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
  visibilityBtn:
  {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5
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