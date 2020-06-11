
import React from 'react';
import { Dimensions, StyleSheet, Image, Text, TextInput, View, SafeAreaView, TouchableOpacity, Button, ActivityIndicator, Alert } from 'react-native';
import { Feather, Entypo, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { ClassicHeader } from "@freakycoder/react-native-header-view";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { YellowBox } from 'react-native';
import Firebase, { db } from '../database/firebase'
import RadioForm from 'react-native-simple-radio-button';
import normalize from 'react-native-normalize';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.firestoreRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
        this.state = {
            name: "",
            email: "",
            mobile: "",
            photoUrl: "",
            gender: "",
            newMobile: "",
            newEmail: "",
            emailVerified: false,
            mobileVerified: false,
            photoAvailable: false,
            editable: false,
            isLoading: true,
            radio_props: [
                { label: 'Male          ', value: 0 },
                { label: 'Female ', value: 1 }
            ],
            initial: 0,
            encMobile: "",
            encEmail: "",
        }
    }
    componentDidMount = async () => {
        await this.getDataFromFirestore();
        this.setState({ isLoading: false })
        this.getPermissionAsync();
    }
    getDataFromFirestore = () => {
        const firestoreRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
        firestoreRef.get()
            .then(async (doc) => {
                if (doc.exists) {
                    await this.setState({
                        name: doc.data().name,
                        email: doc.data().email,
                        mobile: doc.data().mobile,
                        newMobile: doc.data().mobile,
                        newEmail: doc.data().email,
                        photoUrl: doc.data().photoUrl,
                        gender: doc.data().gender,
                        emailVerified: doc.data().emailVerified,
                        mobileVerified: doc.data().mobileVerified
                    },
                        () => {
                            if (this.state.gender == "Male")
                                this.setState({ initial: 0 })
                            else
                                this.setState({ initial: 1 })
                            if (!this.state.emailVerified)
                                if (Firebase.auth().currentUser.emailVerified) {
                                    const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
                                    updateDBRef.update({
                                        emailVerified: true
                                    }).then(() => {
                                        this.setState({ emailVerified: true })
                                    })
                                }
                            var number = this.state.mobile.slice(0, 4) + "XXXX" + this.state.mobile.slice(8, 10)
                            this.setState({ encMobile: number })
                            var n = this.state.email.indexOf('@')
                            var e = this.state.email.slice(0, 4) + 'x'.repeat(n - 4) + this.state.email.slice(n, this.state.email.length)
                            this.setState({ encEmail: e })
                        })
                    if (this.state.photoUrl !== "")
                        this.setState({ photoAvailable: true })
                }
                else {
                    console.log("No such document!");
                }

            })
    }
    editMode = () => {
        this.setState({ editable: true })
    }
    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }
    capturePhoto = () => {
        this.RBSheet.close()
        this.props.navigation.navigate("CameraScreen");
    }
    uploadPhoto = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
            if (!result.cancelled) {
                const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
                updateDBRef.update({
                    photoUrl: result.uri

                }).then(() => {
                    this.setState({ editable: false, isLoading: false, photoUrl: result.uri, photoAvailable: true })
                })
                    .catch((error) => {
                        console.error("Error: ", error);
                        this.setState({
                            isLoading: false,
                        });
                    });
                Firebase.auth().currentUser.updateProfile({
                    photoURL: result.uri
                })
            }
        } catch (E) {
            console.log(E);
        }
    }
    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };
    removePhoto = () => {
        this.setState({
            isLoading: true,
        });
        const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
        updateDBRef.update({
            photoUrl: ""

        }).then(() => {
            this.setState({ editable: false, isLoading: false, photoUrl: "", photoAvailable: false })
        })
            .catch((error) => {
                console.error("Error: ", error);
                this.setState({
                    isLoading: false,
                });
            });
        Firebase.auth().currentUser.updateProfile({
            photoURL: null
        })
    }
    doneEdit = () => {
        console.log(this.state.newMobile)
        if (this.state.newMobile == "" || this.state.newEmail == "")
            Alert.alert('', 'Kindly enter the values');
        else {
            this.setState({
                isLoading: true,
            });
            if (this.state.newMobile != this.state.mobile) {
                this.props.navigation.navigate("OtpVerifyScreen", { mobile: Number(this.state.newMobile) })
                const firestoreRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
                firestoreRef.get()
                    .then(async (doc) => {
                        if (doc.exists) {
                            console.log(doc.data())
                            await this.setState({
                                mobile: doc.data().mobile,
                                newMobile: doc.data().mobile
                            })
                        }
                    })
            }
            if (this.state.newEmail != this.state.email) {
                var user = Firebase.auth().currentUser;
                user.updateEmail(this.state.newEmail).then(function () {
                    Alert.alert('Email ID Updated!', 'Kindly verify your new email.')
                    user.sendEmailVerification()
                    const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
                    updateDBRef.update({
                        emailVerified: false,
                    })
                    this.setState({ emailVerified: false })
                }).catch(function (error) {
                    console.log(error);
                });
            }
            const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
            updateDBRef.update({
                gender: this.state.gender,
            })
        }
        this.setState({ editable: false, isLoading: false })
    }
    goToVerification = () => {
        Alert.alert(
            "Not Verified!",
            "Kindly verify your mobile number",
            [
                {
                    text: "Later",
                    style: "cancel"
                },
                {
                    text: "Verify",
                    onPress: () => {
                        this.props.navigation.navigate("OtpVerifyScreen", { mobile: Number(this.state.mobile) })
                    }
                }
            ],
            { cancelable: false }
        )
    }
    sendEmailVerify = () => {
        Alert.alert(
            "Not Verified!",
            "Kindly verify your email",
            [
                {
                    text: "Later",
                    style: "cancel"
                },
                {
                    text: "Send Mail",
                    onPress: () => {
                        Firebase.auth().currentUser.sendEmailVerification()
                    }
                }
            ],
            { cancelable: false }
        )
    }
    render() {
        if (this.state.isLoading)
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#f40552" />
                </View>
            )
        else
            return (
                <View style={styles.container}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <ClassicHeader
                            centerComponent={
                                <View style={{ justifyContent: "center", alignItems: "center", top: "4%", width: "70%" }}>
                                    {this.state.photoAvailable ? (<Image source={{ uri: this.state.photoUrl }} style={styles.profile} />)
                                        : (<Image source={require("../assets/profile-pic.png")} style={styles.profile} />)
                                    }
                                    <Text style={{ fontSize: normalize(25), color: '#f8f3eb', fontWeight: "bold", width: "140%", textAlign: "center" }}>{this.state.name}</Text>
                                    <TouchableOpacity onPress={() => this.RBSheet.open()} style={{ left: normalize(45), bottom: normalize(85), width: normalize(45), height: normalize(45), borderRadius: normalize(50), justifyContent: "center", alignItems: "center", backgroundColor: "#15D29D" }}>
                                        <Image source={require("../assets/photograph.png")} style={{ resizeMode: "contain", width: normalize(25), height: normalize(25) }} />
                                    </TouchableOpacity>
                                </View>}

                            backgroundColor="#f40552"
                            height={normalize(240)}
                            leftComponent={
                                <TouchableOpacity
                                    style={{ alignItems: "flex-start", top: "-50%", left: "5%" }}
                                    onPress={this.props.navigation.openDrawer}
                                >
                                    <Feather name="menu" size={30} color="white" />
                                </TouchableOpacity>
                            }
                            rightComponentDisable={true}
                        />
                        <RBSheet
                            ref={ref => {
                                this.RBSheet = ref;
                            }}
                            height={normalize(175)}
                            openDuration={250}
                            customStyles={{
                                container: {
                                }
                            }}
                        >
                            <View style={{ alignItems: "flex-start" }}>
                                <Text style={{ fontFamily: "Roboto", fontSize: normalize(20), fontWeight: "bold", padding: normalize(20) }}>Profile Photo</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <TouchableOpacity onPress={this.removePhoto}>
                                        <View style={styles.picBtn}>
                                            <Image source={require("../assets/delete.png")} style={{ width: normalize(50), height: normalize(50), resizeMode: "contain" }} />
                                            <Text style={styles.picBtnText}>Remove{'\n'}photo</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.uploadPhoto}>
                                        <View style={styles.picBtn}>
                                            <Image source={require("../assets/gallery.png")} style={{ width: normalize(50), height: normalize(50), resizeMode: "contain" }} />
                                            <Text style={styles.picBtnText}>Gallery{'\n'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.capturePhoto}>
                                        <View style={styles.picBtn}>
                                            <Image source={require("../assets/camera.png")} style={{ width: normalize(50), height: normalize(50), resizeMode: "contain" }} />
                                            <Text style={styles.picBtnText}>Camera{'\n'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </RBSheet>
                        <KeyboardAwareScrollView keyboardShouldPersistTaps='always' >
                            {
                                !this.state.editable ? (
                                    <View style={styles.body}>
                                        <View style={{ alignItems: "flex-start", padding: normalize(15), borderBottomWidth: 1, borderColor: "#f40552", width: "95%" }}>
                                            <Text style={{ fontSize: normalize(18), fontWeight: "bold", fontFamily: "Roboto" }}>Your Details</Text>
                                        </View>
                                        <View style={styles.combo}>
                                            <Feather name="phone" size={24} />
                                            <View style={{ width: '60%' }}>
                                                <Text style={styles.textHeader}>Mobile Number</Text>
                                                <Text style={styles.textInput}>{this.state.encMobile}</Text>
                                            </View>
                                            {this.state.mobileVerified ?
                                                <Image source={require("../assets/verified.png")} style={{ left: normalize(70), width: normalize(30), height: normalize(30), resizeMode: "contain" }} />
                                                : (
                                                    <TouchableOpacity onPress={this.goToVerification} style={{ left: normalize(70), }}>
                                                        <Image source={require("../assets/notverified.png")} style={{ width: normalize(30), height: normalize(30), resizeMode: "contain" }} />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                        <View style={styles.combo}>
                                            <Entypo name="mail" size={24} />
                                            <View style={{ width: '60%' }}>
                                                <Text style={styles.textHeader}>Email Address</Text>
                                                <Text style={styles.textInput}>{this.state.encEmail}</Text>
                                            </View>
                                            {this.state.emailVerified ?
                                                <Image source={require("../assets/verified.png")} style={{ left: normalize(70), width: normalize(30), height: normalize(30), resizeMode: "contain" }} />
                                                : (
                                                    <TouchableOpacity onPress={this.sendEmailVerify}>
                                                        <Image source={require("../assets/notverified.png")} style={{ left: normalize(70), width: normalize(30), height: normalize(30), resizeMode: "contain" }} />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                        <View style={styles.combo}>
                                            <SimpleLineIcons name="user" size={24} />
                                            <View>
                                                <Text style={styles.textHeader}>Gender</Text>
                                                <Text style={styles.textInput} >{this.state.gender}</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: "flex-start", padding: 15, borderBottomWidth: 1, borderColor: "#f40552", width: "95%" }}>
                                            <Text style={{ fontSize: normalize(18), fontWeight: "bold", fontFamily: "Roboto" }}>Actions</Text>
                                        </View>
                                        <TouchableOpacity style={styles.combo} onPress={this.editMode}>
                                            <Entypo name="edit" size={24} />
                                            <Text style={styles.textHeader2}>Edit Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.combo} onPress={() => this.props.navigation.navigate("SignOutScreen")}>
                                            <MaterialCommunityIcons name="logout" size={24} />
                                            <Text style={styles.textHeader2}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                                    : (
                                        <View style={styles.body}>
                                            <View style={{ alignItems: "flex-start", padding: 15, borderBottomWidth: 1, borderColor: "#f40552", width: "95%" }}>
                                                <Text style={{ fontSize: normalize(18), fontWeight: "bold", fontFamily: "Roboto" }}>User Details</Text>
                                            </View>
                                            <View style={styles.combo1}>
                                                <Feather name="phone" size={24} />
                                                <View>
                                                    <Text style={styles.textHeader}>Mobile Number</Text>
                                                    <TextInput keyboardType={"phone-pad"} style={styles.textInput} onChangeText={(val) => this.updateInputVal(val, 'newMobile')} value={this.state.newMobile} editable={this.state.editable}></TextInput>
                                                </View>
                                            </View>
                                            <View style={styles.combo1}>
                                                <Entypo name="mail" size={24} />
                                                <View>
                                                    <Text style={styles.textHeader}>Email Address</Text>
                                                    <TextInput style={styles.textInput} onChangeText={(val) => this.updateInputVal(val, 'newEmail')} value={this.state.newEmail} editable={this.state.editable}></TextInput>
                                                </View>
                                            </View>
                                            <View style={styles.combo1}>
                                                <SimpleLineIcons name="user" size={24} />
                                                <View >
                                                    <Text style={styles.textHeader}>Gender</Text>
                                                    <View style={{ paddingLeft: 20, padding: 5 }}>
                                                        <RadioForm
                                                            radio_props={this.state.radio_props}
                                                            initial={this.state.initial}
                                                            formHorizontal={true}
                                                            onPress={(value) => {
                                                                if (value == 0) this.setState({ gender: "Male" })
                                                                else this.setState({ gender: "Female" })
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", width: '80%', alignItems: "center", justifyContent: "space-around" }}>
                                                <View style={{ width: "45%", padding: 10, paddingBottom: 20 }}>
                                                    <Button title="DONE" color="#00bcd4" onPress={this.doneEdit}></Button>
                                                </View>
                                                <View style={{ width: "45%", padding: 10, paddingBottom: 20 }}>
                                                    <Button title="CANCEL" color="#e43f5a" onPress={() => this.setState({ editable: false })}></Button>
                                                </View>
                                            </View>
                                        </View>
                                    )
                            }
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
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
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        color: "#161924",
        fontSize: normalize(20),
        fontWeight: "500",
        fontFamily: "Roboto"
    },
    textHeader: {
        fontSize: normalize(12),
        paddingLeft: normalize(20),
        paddingRight: normalize(50),
        color: "grey",
        fontFamily: "Roboto"
    },
    textHeader2: {
        fontSize: normalize(16),
        paddingLeft: normalize(20),
        paddingRight: normalize(50),
        fontFamily: "Roboto"
    },
    textInput: {
        fontSize: normalize(16),
        paddingLeft: normalize(20),
        paddingRight: normalize(50),
        fontFamily: "Roboto",
        width: normalize(350)
    },
    combo: {
        width: '90%',
        flexDirection: "row",
        alignItems: "center",
        padding: normalize(15),
    },
    combo1: {
        width: '90%',
        flexDirection: "row",
        alignItems: "center",
        padding: normalize(15),
        backgroundColor: "white",
        borderWidth: normalize(5),
        borderColor: "#f8f3eb"
    },
    profile: {
        width: normalize(150),
        height: normalize(150),
        borderWidth: 5,
        borderRadius: normalize(90),
        borderColor: "white"
    },
    picBtn: {
        width: normalize(110),
        alignItems: "center",
        height: normalize(90),
        justifyContent: 'center',
        borderRadius: normalize(20),
    },
    picBtnText: {
        color: "black",
        fontSize: normalize(14),
        textAlign: "center",
        fontFamily: "Roboto",
    },
})
