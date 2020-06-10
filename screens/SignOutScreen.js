import React, { Component } from 'react'
import Firebase from '../database/firebase'
import { AsyncStorage, View } from 'react-native'
class SignOutScreen extends Component {
    constructor(props) {
        super(props)
        Firebase.auth().signOut().then(() => this.props.navigation.navigate('Auth'))

    }
    componentDidMount = async () => {
        try {
            await AsyncStorage.setItem(
                "LogKey"
                , JSON.stringify({ status: true }));
        } catch (error) {
            console.log(error)
        }
    }
    render() {
        return <View></View>
    }
}

export default SignOutScreen
