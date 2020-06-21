import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { RFValue } from "react-native-responsive-fontsize";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { normalize } from 'react-native-elements';
export default class ScheduleScreen2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Loan: 0,
            EMI: 0,
            Tenure: 0,
            Rate: 0,
            changeInTenure: 0,
            tableHead: ['Month', 'Interest', 'Principal', 'Balance'],
            tableData: [],
            totalData: [],
            tableLoaded: false,
            totalPayment: "",
        }
    }
    componentDidMount = () => {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.fetchData();
        })
    }
    fetchData = () => {
        this.setState({ tableLoaded: false })
        const { Loan, EMI, Tenure, Rate, changeInTenure } = this.props.navigation.state.params;
        this.setState({
            Loan,
            EMI,
            Tenure,
            Rate,
            changeInTenure
        })
        fetch('https://us-central1-global-gist-279416.cloudfunctions.net/amortization', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Loan: Loan,
                Rate: Rate,
                EMI: EMI,
                Tenure: Tenure,
            })
        })
            .then(response => response.json())
            .then((jsonData) => {
                this.setState({
                    tableData: jsonData.Data,
                    totalData: jsonData.Total,
                    totalPayment: jsonData.totalPayment
                }, () => this.setState({ tableLoaded: true }))
            })
            .catch((error) => {
                console.error(error)
            })
    }
    componentWillUnmount() {
        this.focusListener.remove();
        this.setState({
            from: '',
            Loan: '',
            EMI: '',
            Tenure: '',
            Rate: '',
            Title: '',
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: "#e43f5a" }}>
                        <TouchableOpacity
                            style={{ alignItems: "flex-start", marginLeft: 16, marginTop: 30, width: "12%" }}
                            onPress={() => this.props.navigation.navigate('MCCScreen')}
                        >
                            <Ionicons name="md-arrow-round-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ alignItems: "flex-start", justifyContent: "flex-end", width: "80%" }}>
                            <Text style={styles.headerText}>Revised Repayment Schedule</Text>
                        </View>
                    </View>
                    <Table>
                        <Row data={this.state.tableHead} flexArr={[0.6, 0.8, 0.8, 1]} style={styles.head} textStyle={styles.text1} />
                    </Table>
                    {
                        this.state.tableLoaded ? (
                            <ScrollView style={styles.tableContainer}>
                                <Table >
                                    {
                                        this.state.tableData.map((rowData, index) => {

                                            return (
                                                <Row
                                                    key={index}
                                                    data={rowData}
                                                    flexArr={[0.5, 0.9, 0.9, 1]}
                                                    style={[styles.row, index % 2 && { backgroundColor: 'white' }]}
                                                    textStyle={index > (this.state.Tenure - this.state.changeInTenure - 1) ? styles.text2 : styles.text}
                                                />
                                            )
                                        })
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
    text1: { textAlign: 'right', fontFamily: 'Roboto', color: 'white', fontSize: normalize(13), paddingRight: normalize(18) },
    text: { textAlign: 'center', fontWeight: '100' },
    row: { height: 28 },
    text: { textAlign: 'right', paddingRight: normalize(19) },
    text2: { textAlign: 'right', paddingRight: normalize(18), color: "red" }
})
