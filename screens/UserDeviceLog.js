import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons'
import Firebase, { db } from '../database/firebase'
import normalize from 'react-native-normalize';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

export default class UserDeviceLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHead: ["Sr No.", "Device Name", "IP Address", "Last Login"],
            tableData: [],
            loading: false
        }
    }
    componentDidMount = async () => {
        this.setState({ loading: true })
        const dbRef = db.collection('device_log').doc(Firebase.auth().currentUser.uid)
        var table = []
        var t_title = []
        await dbRef.get()
            .then((log) => {
                Object.values(log.data()).reverse().map((value, key) => {
                    var curr = []
                    curr.push((key + 1).toString())
                    curr = curr.concat(Object.values(value))
                    console.log(curr)
                    table.push(curr)
                })
            })
        this.setState({ tableData: table, loading: false })
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                                <Text style={styles.headerText}>Device Log</Text>
                            </View>
                            <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => this.props.navigation.navigate('HomeScreen')}>
                                <Feather name="x" size={normalize(30)} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "100%", height: windowHeight - (windowHeight / 8) }}>
                            <Table borderstyle={{ borderWidth: 1 }}>
                                <Row data={this.state.tableHead} flexArr={[0.5, 1, 1, 1]} style={styles.head} textStyle={styles.text, { color: "white", paddingLeft: normalize(10) }} />
                                {this.state.loading ? (
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", top: normalize(30) }}>
                                        <ActivityIndicator size="large" color="#de0647" />
                                    </View>
                                )
                                    : (
                                        <Table>
                                            {
                                                this.state.tableData.map((rowData, index) => (
                                                    <Row
                                                        key={index}
                                                        data={rowData}
                                                        flexArr={[0.4, 1, 1, 1]}
                                                        style={[styles.row, !(index % 2) && { backgroundColor: 'white' }]}
                                                        textStyle={styles.text}
                                                    />
                                                ))
                                            }
                                        </Table>
                                    )
                                }
                            </Table>
                        </View>
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
    header: {
        flexDirection: "row",
        width: "90%",
        height: windowHeight / 8

    },
    headerText: {
        fontSize: normalize(24),
        borderBottomWidth: 2,
        borderBottomColor: "#e43f5a",
    },
    head: { height: normalize(45), backgroundColor: "#e43f5a" },
    wrapper: { flexDirection: 'row' },
    title: { flex: 0.5 },
    row: { height: normalize(32) },
    text: { textAlign: 'left', paddingLeft: normalize(10) }
})
