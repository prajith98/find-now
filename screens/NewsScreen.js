import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather, } from '@expo/vector-icons'
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import normalize from 'react-native-normalize';
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class NewsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            componentMounted: false,
            news: [],
            refreshing: false
        }
    }

    fetchData = async () => {
        await fetch(`https://us-central1-global-gist-279416.cloudfunctions.net/getNews`)
            .then(response => response.json())
            .then((jsonData) => {
                this.setState({ news: jsonData.news }, () => this.setState({ componentMounted: true }))
            })
            .catch((error) => {
                console.error(error)
            })
        this.setState({ refreshing: false })
    }
    closeHandler = () => {
        this.props.navigation.navigate('HomeScreen')
    }
    componentDidMount = async () => {
        this.fetchData()
    }
    FiftyChar = (text) => {
        var str = ""
        if (text === null)
            return ""
        for (var i = 0; i < 110; i++)
            str += text.charAt(i)
        return str + "..."
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchData();
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1, marginTop: 35 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-start" }}>
                                <Text style={styles.headerText}>Daily News</Text>
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
                                    this.state.news.map((value, index) => {
                                        var title = value.title.split(" - ")
                                        var description = this.FiftyChar(value.description)
                                        return (
                                            <TouchableOpacity style={styles.content} key={index} onPress={() => Linking.openURL(value.url)}>
                                                <View style={{ justifyContent: "center" }}>
                                                    <Image source={{ uri: value.urlToImage }} style={{ width: normalize(100), height: normalize(100), resizeMode: "cover", borderRadius: 5 }}></Image>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <View>
                                                        <Text style={styles.contentHeader}>{title[0]}</Text>
                                                        <Text style={styles.contentDescription}>{description}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                                        <Text style={{ textAlign: "right", fontWeight: "bold", color: "#e43f5a" }}>Read More</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            ) : (
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
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
        height: normalize(50),
        justifyContent: "flex-start",
    },
    headerText: {
        color: "#e43f5a",
        fontSize: normalize(28),
        fontWeight: "bold",
        alignContent: "flex-start",
        fontFamily: "Roboto"
    },
    contentHeader: {
        paddingLeft: normalize(10),
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: normalize(16)
    },
    contentDescription: {
        paddingLeft: normalize(10),
        fontFamily: "Roboto",
        fontSize: normalize(12)
    },
    content: {
        flex: 1,
        height: "100%",
        backgroundColor: "#f8f3eb",
        padding: normalize(5),
        flexDirection: "row",
        margin: normalize(2),
        marginBottom: normalize(5),
        justifyContent: "center"
    }
})
