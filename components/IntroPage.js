import React, { Component } from 'react';
import {
    StyleSheet,   // CSS-like styles
    Text,         // Renders text
    View,          // Container component
    ImageBackground,
    Image
} from 'react-native';
import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import Swiper from './Swiper';
import normalize from 'react-native-normalize';

export default class IntroPage extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Swiper navigation={this.props.navigation}>
                <View style={styles.container}>
                    <Image source={img1} style={styles.image} />
                    <Text style={styles.title}>Switch An Existing Loan</Text>
                    <Text style={styles.text}>To Help you to switch you loans without breaking any sweat</Text>
                </View>

                <View style={styles.container}>
                    <Image source={img2} style={styles.image} />
                    <Text style={styles.title}>Avail A New Home Loan</Text>
                    <Text style={styles.text}>For the entire process from application  to the final disbursement of a Loan</Text>
                </View>

                <View style={styles.container}>
                    <Image source={img3} style={styles.image} />
                    <Text style={styles.title}>Loan Against Property</Text>
                    <Text style={styles.text}>To make loans against Property as simple as ABC</Text>
                </View>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    // Slide styles
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    image: {
        width: normalize(350),
        height: normalize(350),
        resizeMode: "contain",
    },
    title: {
        color: "#581845",
        fontSize: normalize(25),
        fontWeight: "bold",
        width: "100%",
        textAlign: "center"
    },
    text: {
        color: "#581845",
        fontSize: normalize(16),
        marginLeft: "15%",
        marginRight: "15%",
        textAlign: "center",
        padding: 5,
        width: "100%"
    },
});