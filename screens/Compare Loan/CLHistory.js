import React, { Component } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, AsyncStorage, Share } from 'react-native'
import { Feather, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import normalize from 'react-native-normalize';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class CLHistory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tableData: [],
            tableHead: ['Name', 'Loan', 'Interest', 'Tenure', 'Share', 'Delete'],
        }
    }
    _deleteIndex = async (index) => {
        var key = this.props.navigation.state.params.key
        var Data = this.state.tableData;
        Data.splice(index, 1);
        this.setState({ tableData: Data })
        var changeData = JSON.stringify(Data);
        try {
            await AsyncStorage.setItem(
                key
                , changeData);
        } catch (error) {
            console.log("error saving data")
        }
    }
    _shareIndex = async (index) => {
        var Data = this.state.tableData;
        var name = Data[index][0].split('\n')
        var loan = Data[index][1].split('\n')
        var rate = Data[index][2].split('\n')
        var tenure = Data[index][3].split('\n')
        var emi = Data[index][4].split('\n')
        try {
            await Share.share({
                message:
                    name[0] + '\nLoan : ' + loan[0] + '\nRate : ' + rate[0] + '%\nTenure : ' + tenure[0] + " months\nEMI : " + emi[0] + "\n\n" +
                    name[1] + '\nLoan : ' + loan[1] + '\nRate : ' + rate[1] + '%\nTenure : ' + tenure[1] + " months\nEMI : " + emi[1]
            });
        } catch (error) {
            alert(error.message);
        }
    };
    componentDidMount = async () => {
        var key = this.props.navigation.state.params.key
        var Data = []
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                Data.push(JSON.parse(value))
            }
            else {
                console.log("no data")
            }
        } catch (error) {
            console.log(error)
        }
        await this.setState({ tableData: Data[0] })
    }
    render() {
        const state = this.state;
        const elementDelete = (index) => (
            <TouchableOpacity onPress={() => this._deleteIndex(index)}>
                <FontAwesome5 name="trash" size={20} color="red" style={{ textAlign: "center" }} />
            </TouchableOpacity>
        );

        const elementShare = (index) => (
            <TouchableOpacity onPress={() => this._shareIndex(index)}>
                <MaterialIcons name="share" size={20} color="#52D017" style={{ textAlign: "center" }} />
            </TouchableOpacity>
        );
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
                    <View style={styles.header}>
                        <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center", padding: normalize(15) }}>
                            <Text style={styles.headerText}>Compare Loan</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "center", marginRight: normalize(10) }} onPress={() => this.props.navigation.goBack()}>
                            <Feather name="x" size={34} color="black" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView >
                        <Table >
                            <Row data={state.tableHead} style={styles.head} textStyle={styles.text1} widthArr={[normalize(60), normalize(90), normalize(65), normalize(65), normalize(55), normalize(55)]} />
                            {state.tableData ?
                                state.tableData.map((rowData, index) => (
                                    <TableWrapper key={index} style={[styles.row, !(index % 2) && { backgroundColor: 'white' }]} >
                                        {
                                            rowData.map((cellData, cellIndex) => (
                                                <Cell key={cellIndex}
                                                    data={cellIndex === 6 ? elementDelete(index) : cellIndex === 5 ? elementShare(index) : cellData}
                                                    textStyle={styles.text}
                                                    width={cellIndex === 0 ? normalize(60) : cellIndex === 1 ? normalize(90) : cellIndex === 2 ? normalize(65) : cellIndex === 3 ? normalize(65) : cellIndex === 4 ? 0 : normalize(55)}
                                                />
                                            ))
                                        }
                                    </TableWrapper>
                                ))
                                : <Text></Text>
                            }
                        </Table>

                    </ScrollView>
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
        width: "95%",
        height: windowHeight / 6,
    },
    headerText: {
        fontSize: normalize(24),
        borderBottomWidth: 2,
        borderBottomColor: "#e43f5a",
    },
    row: { flexDirection: 'row', height: normalize(40) },
    head: { height: 40, backgroundColor: '#e43f5a' },
    text: { textAlign: "left", paddingLeft: normalize(10) },
    text1: { textAlign: 'left', fontFamily: 'Roboto', color: 'white', fontSize: normalize(16), paddingLeft: normalize(5) },

})
