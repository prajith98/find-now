import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'

export default class Screen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={{ alignItems: "flex-start", margin: 16, marginTop:30 }}
                        onPress={this.props.navigation.openDrawer}
                    >
                        <Feather name="menu" size={24} color="#161924"  />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={styles.text}>{this.props.name}</Text>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    text: {
        color: "#161924",
        fontSize: 20,
        fontWeight: "500"
    }
})
