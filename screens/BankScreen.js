import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Linking, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { Feather, } from '@expo/vector-icons'
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class BankScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bank: [],
            refreshing: false,
            componentMounted: false,
            opened: false,
            dist: [],
            key: ''
        };
    }
    closeHandler = () => {
        this.props.navigation.navigate('HomeScreen')
    }
    componentDidMount = () => {
        this.fetchData();
    }
    fetchData = () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = Number(position.coords.latitude.toFixed(6));
                const longitude = Number(position.coords.longitude.toFixed(6));
                await fetch(`https://us-central1-global-gist-279416.cloudfunctions.net/BankNearby`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        latitude: latitude,
                        longitude: longitude,
                        from: 'app'
                    })
                })
                    .then(response => response.json())
                    .then((jsonData) => {
                        this.setState({ bank: jsonData.bank, dist: jsonData.dist, key: jsonData.key },
                            () => {
                                this.setState({
                                    componentMounted: true,
                                    refreshing: false
                                })
                            })
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchData()

    }
    openGps = (lat, lng, label) => {
        const location = lat + "," + lng
        const url = Platform.select({
            ios: 'maps:' + location,
            android: 'geo:' + location + '?center=' + location + '&q=' + label + '&z=24',
        });
        console.log('geo:' + location + '?center=' + location + '&q=' + location + '(' + label + ')&z=24')
        Linking.openURL(url);
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1, marginTop: 35 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-start" }}>
                                <Text style={styles.headerText}>Nearby Banks</Text>
                            </View>
                            <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={this.closeHandler}>
                                <Feather name="x" size={34} color="#e43f5a" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                    }>
                        {
                            this.state.componentMounted ? (<View style={{ flex: 1, width: '100%', height: "100%", padding: 5 }}>
                                {
                                    this.state.bank.map((value, index) => {
                                        var OC = "Closed";
                                        var photoAvailable = false;
                                        if (value.opening_hours != null) {
                                            if (value.opening_hours.open_now)
                                                OC = "Open"
                                        }
                                        else OC = ""
                                        if (value.photos != null) {
                                            photoAvailable = true
                                        }
                                        return (
                                            <TouchableOpacity style={styles.content} key={index} onPress={() => this.openGps(value.geometry.location.lat, value.geometry.location.lng, value.name)}>
                                                <View style={{ justifyContent: "center" }}>
                                                    {photoAvailable ?
                                                        <Image source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=125&photoreference=' + value.photos[0].photo_reference + '&key=' + this.state.key }} style={{ width: 125, height: 110, borderRadius: 5 }}></Image>
                                                        : <Image source={require("../assets/bank1.png")} style={{ width: 125, height: 110, borderRadius: 5 }}></Image>
                                                    }
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <View>
                                                        <Text style={styles.contentHeader}>{value.name}</Text>
                                                        <Text style={{ paddingLeft: 10, fontFamily: "Roboto", fontSize: 12, fontWeight: "bold", color: OC == 'Open' ? 'green' : 'red' }}>{OC}</Text>
                                                        <Text style={styles.contentDescription}>{value.vicinity}</Text>
                                                        <Text style={{ paddingLeft: 10, fontFamily: "Roboto", fontSize: 12, fontWeight: "bold" }}>{this.state.dist[index]}m</Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                                        <Text style={{ textAlign: "right", fontWeight: "bold", color: "#e43f5a", justifyContent: "flex-end" }}>Directions</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            ) : (
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                    </View>
                                )
                        }
                    </ScrollView>
                </SafeAreaView>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    radioCategory: {
        flexDirection: "row",
        backgroundColor: "#f8f3eb"
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb"
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: 80,
        justifyContent: "flex-start",
    },
    headerText: {
        color: "#e43f5a",
        fontSize: 28,
        fontWeight: "bold",
        alignContent: "flex-start",
        fontFamily: "Roboto"
    },
    contentHeader: {
        paddingLeft: 10,
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 16
    },
    contentDescription: {
        paddingLeft: 10,
        fontFamily: "Roboto",
        fontSize: 12
    },
    content: {
        flex: 1,
        height: "100%",
        backgroundColor: "#f8f3eb",
        padding: 5,
        flexDirection: "row",
        margin: 2,
        marginBottom: 5,
        justifyContent: "center"
    }
})
