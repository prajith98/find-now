import React from 'react'
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native'
import { DrawerNavigatorItems } from 'react-navigation-drawer'
import { normalize } from 'react-native-elements';
export default Sidebar = props => {
    return (
        <ScrollView>
            <ImageBackground
                source={require("../assets/background.png")}
                style={{ height: normalize(110), padding: 16, backgroundColor: "#f40552",alignItems:"center",flexDirection:"row" }} imageStyle={{ opacity: 0.3 }}
            >
                {
                    props.photoUrl !== null ? <Image source={{ uri: props.photoUrl }} style={styles.profile} />
                        : <Image source={require("../assets/profile-pic.png")} style={styles.profile} />
                }

                <Text style={styles.name}>{props.name}</Text>
            </ImageBackground>
            <View style={styles.container}>
                <DrawerNavigatorItems {...props} />
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profile: {
        width: normalize(80),
        height: normalize(80),
        borderRadius: normalize(40),
        borderColor: "#fff",
        borderWidth: 2
    },
    name: {
        color: "#fff",
        fontSize: normalize(19),
        fontWeight: "bold",
        fontFamily:"Roboto",
        textAlign:"left",
        paddingLeft:normalize(10)
    }
})