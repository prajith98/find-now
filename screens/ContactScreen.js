
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons'
import { ClassicHeader } from "@freakycoder/react-native-header-view";
import { YellowBox } from 'react-native';
import normalize from 'react-native-normalize';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class ContactScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mobile: '+91 74588 22895'
        }
    }
    openDialScreen = () => {
        let number = '';
        if (Platform.OS === 'ios') {
            number = 'telprompt:${' + this.state.mobile + '}';
        }
        else {
            number = 'tel:${' + this.state.mobile + '}';
        }
        Linking.openURL(number);
    };

    closeHandler = () => {
        this.props.navigation.navigate('HomeScreen')
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                                <Text style={styles.headerText}>Contact Us</Text>
                            </View>
                            <TouchableOpacity style={{ justifyContent: "center" }} onPress={this.closeHandler}>
                                <Feather name="x" size={normalize(30)} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.combo}>
                            <FontAwesome5 name="map-marker-alt" size={25} color="#44233e" onPress={() => Linking.openURL('mailto:support@switchtosave.in')} />
                            <Text style={styles.text}>SwitchToSave Technolgies, Model Colony, Pune, Maharashtra , India  411001</Text>
                        </View>
                        <TouchableOpacity style={styles.combo} onPress={() => this.openDialScreen()}>
                            <FontAwesome5 name="headset" size={25} color="#44233e" />
                            <Text style={styles.text}>{this.state.mobile}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.combo} onPress={() => Linking.openURL('mailto:support@switchtosave.in')}>
                            <FontAwesome5 name="envelope" size={25} color="#44233e" />
                            <Text style={styles.text}>support@switchtosave.in</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb",
    },
    body: {
        flex: 1,
        justifyContent: "flex-start",
        marginTop: normalize(40),
        backgroundColor: "#f8f3eb",
        marginLeft: normalize(15),
        marginRight: normalize(15),
        bottom:normalize(30)
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: windowHeight / 7
    },
    headerText: {
        fontSize: normalize(30),
        borderBottomWidth: 2,
        borderBottomColor: "#e43f5a",
    },
    text: {
        color: "#161924",
        fontSize: normalize(20),
        paddingLeft: normalize(20),
        textAlign: "left",
        bottom: "1.5%",
        fontFamily: "Roboto"
    },
    combo: {
        flexDirection: "row",
        paddingBottom: normalize(30)
    }
})
