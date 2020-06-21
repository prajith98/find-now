import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { RFValue } from "react-native-responsive-fontsize";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Table, Row } from 'react-native-table-component';
import { normalize } from 'react-native-elements';
import paisa from 'paisa.js'
export default class ScheduleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHead: ['Month', 'Interest', 'Principal', 'Balance'],
            tableData: [],
            totalData: [],
            totalPayment: ""
        }
    }
    componentDidMount = () => {
        this.fetchData()
    }
    fetchData = () => {
        var Loan = this.props.navigation.state.params.Loan;
        var EMI = this.props.navigation.state.params.EMI;
        var Tenure = this.props.navigation.state.params.Tenure;
        var Rate = this.props.navigation.state.params.Rate;
        Rate = Rate / 1200
        var Data = [];
        var Total = [];
        Total.push('Total');
        var sumInt = 0;
        var sumPay = 0;
        for (var i = 0; i < Tenure; i++) {
            var row = [];
            var interest = Loan * Rate;
            var payment = EMI - interest;
            sumInt = sumInt + Math.round(interest)
            sumPay = sumPay + Math.round(payment)
            if (Loan - payment > 0) {
                Loan = Loan - payment;
                row.push((i + 1).toString())
                row.push(paisa.formatWithSymbol(Math.round(interest) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(payment) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(Loan) * 100, 0));
                Data.push(row);
            }
            else {
                Loan = 0;
                row.push((i + 1).toString())
                row.push(paisa.formatWithSymbol(Math.round(interest) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(payment) * 100, 0));
                row.push(Loan.toString());
                Data.push(row);
            }
        }
        Total.push(paisa.formatWithSymbol(sumInt * 100, 0))
        Total.push(paisa.formatWithSymbol(sumPay * 100, 0))
        Total.push("")
        this.setState({ totalPayment: paisa.formatWithSymbol((sumInt + sumPay) * 100, 0) })
        this.setState({ tableData: Data, totalData: Total })
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: "#e43f5a" }}>
                        <TouchableOpacity
                            style={{ alignItems: "flex-start", marginLeft: 16, marginTop: 30, width: "12%" }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Ionicons name="md-arrow-round-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ alignItems: "flex-start", justifyContent: "flex-end", width: "80%" }}>
                            <Text style={styles.headerText}>Schedule</Text>
                        </View>
                    </View>
                    <Table borderStyle={{ borderBottomWidth: 2, borderColor: 'white' }}>
                        <Row data={this.state.tableHead} flexArr={[0.6, 0.8, 0.8, 1]} style={styles.head} textStyle={styles.text1} />
                    </Table>
                    {
                        this.state.tableData != null ? (
                            <ScrollView style={styles.tableContainer}>
                                <Table>
                                    {
                                        this.state.tableData.map((rowData, index) => (
                                            <Row
                                                key={index}
                                                data={rowData}
                                                flexArr={[0.5, 0.9, 0.9, 1]}
                                                style={[styles.row, index % 2 && { backgroundColor: 'white' }]}
                                                textStyle={styles.text}
                                            />
                                        ))
                                    }
                                </Table>
                                <Table borderStyle={{ borderBottomWidth: 2, borderColor: 'white' }}>
                                    <Row data={this.state.totalData} flexArr={[0.5, 0.9, 0.9, 1]} style={styles.head} textStyle={styles.text1} />
                                </Table>
                                <Text style={[styles.head, styles.text1]}  >Total Payment: {this.state.totalPayment}</Text>
                            </ScrollView>
                        ) :
                            (
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <ActivityIndicator size="large" color="#e43f5a" />
                                </View>
                            )
                    }
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
    headerText: {
        color: "white",
        fontSize: RFValue(20, windowHeight),
        fontFamily: 'Roboto'
    },
    tableContainer: { flex: 1, },
    head: { height: 40, backgroundColor: '#e43f5a' },
    wrapper: { flexDirection: 'row' },
    text1: { textAlign: 'right', fontFamily: 'Roboto', color: 'white', fontSize: normalize(14), paddingRight: normalize(18) },
    text: { textAlign: 'center', fontWeight: '100' },
    row: { height: 28 },
    text: { textAlign: 'right', paddingRight: normalize(19) }
})
