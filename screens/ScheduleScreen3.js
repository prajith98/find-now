import React, { Component } from 'react';
import { BackHandler, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { RFValue } from "react-native-responsive-fontsize";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { normalize } from 'react-native-elements';
import paisa from 'paisa.js'
export default class ScheduleScreen3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHead: ['Month', 'Interest', 'Principal', 'Balance'],
            tableDataA: [],
            totalDataA: [],
            tableDataB: [],
            totalDataB: [],
            A: true,
            B: false,
            totalPaymentA: "",
            totalPaymentB: "",
        }
    }
    componentDidMount = () => {
        this.fetchData()
    }
    switch = (val) => {
        if (val == 'A') {
            this.setState({ A: true, B: false });
        }
        else if (val == 'B') {
            this.setState({ A: false, B: true })
        }
    }
    fetchData = () => {
        var { loanA, emiA, tenureA, rateA, loanB, emiB, tenureB, rateB, } = this.props.navigation.state.params;
        rateA = rateA / 1200;
        rateB = rateB / 1200;
        var DataA = [], DataB = [];
        var TotalA = [], TotalB = [];
        TotalA.push('Total');
        TotalB.push('Total');
        var sumIntA = 0;
        var sumPayA = 0;
        var sumIntB = 0;
        var sumPayB = 0;
        for (var i = 0; i < tenureA; i++) {
            var row = [];
            var interest = loanA * rateA;
            var payment = emiA - interest;
            sumIntA = sumIntA + Math.round(interest)
            sumPayA = sumPayA + Math.round(payment)
            if (loanA - payment > 0) {
                loanA = loanA - payment;
                row.push((i + 1).toString())
                row.push(paisa.formatWithSymbol(Math.round(interest) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(payment) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(loanA) * 100, 0));
                DataA.push(row);
            }
            else {
                loanA = 0;
                row.push((i + 1).toString())
                row.push(paisa.formatWithSymbol(Math.round(interest) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(payment) * 100, 0));
                row.push(loanA.toString());
                DataA.push(row);
            }
        }
        for (var i = 0; i < tenureB; i++) {
            var row = [];
            var interest = loanB * rateB;
            var payment = emiB - interest;
            sumIntB = sumIntB + Math.round(interest)
            sumPayB = sumPayB + Math.round(payment)
            if (loanB - payment > 0) {
                loanB = loanB - payment;
                row.push((i + 1).toString())
                row.push(paisa.formatWithSymbol(Math.round(interest) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(payment) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(loanB) * 100, 0));
                DataB.push(row);
            }
            else {
                loanB = 0;
                row.push((i + 1).toString())
                row.push(paisa.formatWithSymbol(Math.round(interest) * 100, 0));
                row.push(paisa.formatWithSymbol(Math.round(payment) * 100, 0));
                row.push(loanB.toString());
                DataB.push(row);
            }
        }
        TotalA.push(paisa.formatWithSymbol(sumIntA * 100, 0))
        TotalA.push(paisa.formatWithSymbol(sumPayA * 100, 0))
        TotalA.push("")
        TotalB.push(paisa.formatWithSymbol(sumIntB * 100, 0))
        TotalB.push(paisa.formatWithSymbol(sumPayB * 100, 0))
        TotalB.push("")
        this.setState({
            tableDataA: DataA,
            totalDataA: TotalA,
            tableDataB: DataB,
            totalDataB: TotalB,
            totalPaymentA: paisa.formatWithSymbol((sumIntA + sumPayA) * 100, 0),
            totalPaymentB: paisa.formatWithSymbol((sumIntB + sumPayB) * 100, 0)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: "#e43f5a" }}>
                        <TouchableOpacity
                            style={{ alignItems: "flex-start", marginLeft: 16, marginTop: 30, width: "12%" }}
                            onPress={() => this.props.navigation.navigate('CLScreen')}
                        >
                            <Ionicons name="md-arrow-round-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ alignItems: "flex-start", justifyContent: "flex-end", width: "60%" }}>
                            <Text style={styles.headerText}>Schedule</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: normalize(80), alignItems: "flex-end", justifyContent: "flex-end", height: normalize(50) }}>
                            <TouchableOpacity onPress={() => this.switch('A')} style={[styles.switch, { borderTopLeftRadius: normalize(5), borderBottomLeftRadius: normalize(5) }, this.state.A && { backgroundColor: "white" }]}>
                                <Text>A</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.switch('B')} style={[styles.switch, { borderTopRightRadius: normalize(5), borderBottomRightRadius: normalize(5) }, this.state.B && { backgroundColor: "white" }]}>
                                <Text>B</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Table>
                        <Row data={this.state.tableHead} flexArr={[0.6, 0.8, 0.8, 1]} style={styles.head} textStyle={styles.text1} />
                    </Table>
                    {
                        this.state.tableDataA != null ? (
                            <ScrollView style={styles.tableContainer}>
                                <Table>
                                    {this.state.A ?
                                        this.state.tableDataA.map((rowData, index) => (
                                            <Row
                                                key={index}
                                                data={rowData}
                                                flexArr={[0.5, 0.9, 0.9, 1]}
                                                style={[styles.row, index % 2 && { backgroundColor: 'white' }]}
                                                textStyle={styles.text}
                                            />
                                        ))
                                        :
                                        this.state.tableDataB.map((rowData, index) => (
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
                                <Table >
                                    <Row data={this.state.A ? this.state.totalDataA : this.state.totalDataB} flexArr={[0.5, 0.9, 0.9, 1]} style={styles.head} textStyle={{ textAlign: 'right', fontFamily: 'Roboto', color: 'white', fontSize: normalize(14), paddingRight: normalize(15) }} />
                                </Table>{
                                    this.state.A ? (
                                        <Text style={[styles.head, styles.text1]}  >Total Payment: {this.state.totalPaymentA}</Text>
                                    ) :
                                        <Text style={[styles.head, styles.text1]}  >Total Payment: {this.state.totalPaymentB}</Text>
                                }
                            </ScrollView>
                        ) :
                            (
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <ActivityIndicator size="large" color="#e43f5a" />
                                </View>
                            )
                    }
                </SafeAreaView>
            </View >
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
    head: { height: normalize(40), backgroundColor: '#e43f5a', },
    wrapper: { flexDirection: 'row' },
    text1: { textAlign: 'right', fontFamily: 'Roboto', color: 'white', fontSize: normalize(14), paddingRight: normalize(18) },
    text: { textAlign: 'center' },
    row: { height: 28 },
    text: { textAlign: 'right', paddingRight: normalize(19) },
    switch: {
        borderWidth: 0.5,
        borderColor: "white",
        width: "50%",
        height: "50%",
        alignItems: "center",
        justifyContent: "center"
    }
})
