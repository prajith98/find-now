import React from 'react';
import { View, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { YellowBox } from 'react-native';
import Firebase, { db } from '../database/firebase';
import normalize from 'react-native-normalize';
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class Loading extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmed: false,
        }
    }
    componentDidMount = () => {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const firestoreRef = db.collection('users').doc(Firebase.auth().currentUser.uid)
                firestoreRef.get().then((res) => {
                    if (res.exists) {
                        const user = res.data();
                        this.setState({
                            confirmed: user.confirmed
                        }, () => {
                            if (this.state.confirmed)
                                this.props.navigation.navigate('App')
                        })
                    }
                    else {
                        console.log("Document does not exist!");
                    }
                });
            }
            else
                this.props.navigation.navigate('IntroPage')
        })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f8f3eb" }}>
                <SafeAreaView style={{ flex: 1, marginTop: 35 }}>
                    <View style={{ alignItems: "center", marginTop: '10%' }}>
                        <Image source={require('./images/logo1.png')} style={{ width: normalize(330), height: normalize(60) }}></Image>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#f40552" />
                    </View>
                </SafeAreaView>
            </View >
        )
    }
}