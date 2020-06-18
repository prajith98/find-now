import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import normalize from 'react-native-normalize';
import PhoneInput from "react-native-phone-input";
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      mobile: '',
      password: '',
      hidePassword: true,
      isLoading: false,
      t_cVisible: false,
      pickerData: null,
      validNumber: "",
      value: ""
    }
  }

  componentDidMount = () => {
    this.setState({
      pickerData: this.phone.getPickerData(),
      validNumber: this.phone.isValidNumber(),
    });
  }
  updateMobile = () => {
    this.setState({
      mobile: this.phone.getValue(),
      validNumber: this.phone.isValidNumber(),
    })
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  handleSignUp = () => {
    const mobileType = this.phone.getNumberType();
    const { name, email, password, mobile } = this.state
    if (name === "" || email == "" || password == "" || mobile == "") {
      Alert.alert("", "Enter all the details to signup")
      return 0;
    }
    else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
      Alert.alert("Invalid Details!", "Invalid Email ID")
      return 0;
    }
    else if (!this.state.validNumber) {
      Alert.alert("Invalid Details!", "Invalid Mobile Number")
      return 0;
    }
    else if (this.state.validNumber) {
      console.log(this.state.mobile)
      console.log(this.phone.getNumberType())
      if (mobileType !== "MOBILE" && mobileType !== "FIXED_LINE_OR_MOBILE")
        Alert.alert("Invalid Details!", "Invalid Mobile Number")
      else if (mobileType === "MOBILE" || mobileType === "FIXED_LINE_OR_MOBILE")
        this.props.navigation.navigate('OtpVerification', { name: this.state.name, email: this.state.email, mobile: this.state.mobile, password: this.state.password, photoURL: "", emailVerified: false })
    }
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
      <View style={{ flex: 1, backgroundColor: "#f8f3eb" }}>
        <View style={{ alignItems: "center", marginTop: '10%' }}>
          <Image source={require('./images/logo1.png')} style={{ width: normalize(330), height: normalize(60) }}></Image>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={styles.container}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <FontAwesome5 name="user" size={normalize(20)} color="#581845" style={styles.icon} />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Name"
                  value={this.state.name}
                  onChangeText={(val) => this.updateInputVal(val, 'name')}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <FontAwesome5 name="envelope" size={normalize(20)} color="#581845" style={styles.icon} />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Email"
                  value={this.state.email}
                  onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
              </View>
              <Text style={{ bottom: normalize(15), textAlign: "right", fontSize: normalize(10), color: "red" }}>{(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) || this.state.email == "" ? "" : "Invalid Email ID"}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", bottom: normalize(7) }}>
                <FontAwesome5 name="phone" size={normalize(20)} color="#581845" style={{ right: "8%" }} />
                <PhoneInput
                  initialCountry="in"
                  textProps={{ placeholder: "Mobile No" }}
                  ref={ref => {
                    this.phone = ref;
                  }}
                  onChangePhoneNumber={this.updateMobile}
                  style={styles.inputStyle}
                />
              </View>
              <Text style={{ bottom: normalize(25), textAlign: "right", fontSize: normalize(10), color: "red" }}>{this.state.validNumber || this.state.mobile == "" ? "" : "Invalid Mobile Number"}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", bottom: normalize(19) }}>
                <FontAwesome5 name="key" size={normalize(20)} color="#581845" style={styles.icon} />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Password"
                  value={this.state.password}
                  onChangeText={(val) => this.updateInputVal(val, 'password')}
                  maxLength={15}
                  secureTextEntry={this.state.hidePassword}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                  <Image source={(this.state.hidePassword) ? require('./images/hide.png') : require('./images/view.png')} style={styles.btnImage} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.handleSignUp}>
                <Text style={styles.btnStyle}>SIGN UP</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: normalize(12), top: normalize(10) }}>  By signing up you agree to our </Text>
                <Text onPress={() => this.setState({ t_cVisible: true })} style={{ fontSize: normalize(12), top: normalize(10), textDecorationLine: "underline", fontWeight: "bold", width: "40%" }}>Terms {'&'} Conditions</Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={{ marginTop: normalize(25) }}>
                <Text style={styles.loginText}>
                  Already Registered? Click here to login
            </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
            <View>
              <Modal isVisible={this.state.t_cVisible}
                backdropOpacity={0.9}
                backdropColor="#ccc">
                <View style={{ alignItems: "center", justifyContent: "center", }}>
                  <View style={styles.modalcontainer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: normalize(18), textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>Terms {'&'} Conditions</Text>
                      <TouchableOpacity onPress={() => this.setState({ t_cVisible: false })}>
                        <Feather name="x" size={normalize(20)} color="black" style={{ textAlign: "right" }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
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
    top: normalize(40),
    padding: normalize(25),
    paddingTop:normalize(30),
    paddingBottom:normalize(30),
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
    textAlign: 'center',
    fontSize: normalize(14)
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
    top: "2%",
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
  },
  modalText: {
    fontSize: normalize(16),
    fontFamily: "Roboto",
    textAlign: "left"
  },
  modalcontainer: {
    width: normalize(350),
    height: normalize(350),
    padding: normalize(16),
    paddingTop: normalize(30),
    backgroundColor: '#fff',
    borderRadius: normalize(10)
  },
});