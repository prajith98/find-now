import React from 'react';
import { Slider, StyleSheet, ScrollView, Text, TextInput, View, SafeAreaView, TouchableOpacity, Button, Keyboard, Alert, ActivityIndicator, Dimensions, AsyncStorage, BackHandler } from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons, FontAwesome, EvilIcons, Entypo, Ionicons } from '@expo/vector-icons'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import paisa from 'paisa.js'
import { YellowBox } from 'react-native';
import Modal from 'react-native-modal';
import normalize from 'react-native-normalize';
import History from './History';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class MCCScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Loan: "",
            Rate: "",
            Tenure: "",
            EMI: "",
            TenureY: "",
            loanPlaceHolder: "Balance Loan",
            ratePlaceHolder: "Rate of Interest",
            tenurePlaceHolder: "Tenure",
            emiPlaceHolder: "Current EMI",
            tableTitle: [],
            tableHead: ['MM', 'New Balance', 'New Tenure', 'Increase in Tenure (M)', 'Additional Interest'],
            tableHead2: ['MM', 'New Balance', 'New EMI', 'Increase EMI By', 'Additional Interest'],
            modalTable: [
                ['1.', 'MM means number of Moratorium Months'],
                ['2.', 'New Balance means sum of Loan Balance & Accumulated Interest'],
                ['3.', 'New Tenure means Total Tenure based on New Balance'],
                ['4.', 'Increase in Tenure means difference between new and old tenure'],
                ['5.', 'Additional Interest means product of EMI and Increase in Tenure'],
            ],
            DataTable: [],
            DataTable2: [],
            showTable: false,
            showSolution: false,
            calc: 4,
            calc2: 3,
            radio_props: [
                { label: 'EMI', value: 0 },
                { label: 'Rate', value: 1 },
                { label: 'Loan', value: 2 },
                { label: 'Tenure', value: 3 }
            ],
            emiTextInputVisible: true,
            rateTextInputVisible: true,
            loanTextInputVisible: true,
            tenureTextInputVisible: true,
            tableLoaded: false,
            onReset: false,
            emiInWords: "",
            loanInWords: "",
            MM: 3,
            mm: "3 Months",
            infoVisible: false,
            a: false,
            b: false,
            c: false,
            d: false,
            newLoan: "",
            newEMI: "",
            newTenure: "",
            changeInEMI: "",
            changeInTenure: "",
            historyMode: false,
            displaySchedule: false,
            savings: "",
        }
    }
    componentDidMount = () => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.onBackPress
        );
    }
    onBackPress = () => {
        if (this.state.displaySchedule) {
            this.setState({ displaySchedule: false })
            this.props.navigation.navigate("MCCScreen")
        }
        else if (this.state.historyMode) {
            this.setState({ historyMode: false })
        }
        else
            this.props.navigation.navigate("HomeScreen")
        return true;
    }
    _storeData = async (values) => {
        var flag = 0;
        var existingData
        try {
            existingData = await AsyncStorage.getItem('MCCKey');
            existingData = JSON.parse(existingData);
            if (!existingData) {
                existingData = []
            }
            for (var i = 0; i < existingData.length; i++)
                if (JSON.stringify(existingData[i]) == JSON.stringify(values))
                    flag = 1;
            if (flag == 0)
                existingData.push(values)
        }
        catch (error) {
            console.log(error)
        }
        try {
            await AsyncStorage.setItem(
                'MCCKey'
                , JSON.stringify(existingData));
        } catch (error) {
            console.log("error saving data")
        }
    };
    convertNumberToWords = (amount) => {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            var value = "";
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crore ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakh ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string;
    }
    // calculate Rate
    RATE = (periods, payment, present, future, type, guess) => {
        guess = (guess === undefined) ? 0.01 : guess;
        future = (future === undefined) ? 0 : future;
        type = (type === undefined) ? 0 : type;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Set maximum number of iterations
        var iterMax = 10;

        // Implement Newton's method
        var y, y0, y1, x0, x1 = 0,
            f = 0,
            i = 0;
        var rate = guess;
        if (Math.abs(rate) < epsMax) {
            y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
        } else {
            f = Math.exp(periods * Math.log(1 + rate));
            y = present * f + payment * (1 / rate + type) * (f - 1) + future;
        }
        y0 = present + payment * periods + future;
        y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
        i = x0 = 0;
        x1 = rate;
        while ((Math.abs(y0 - y1) > epsMax) && (i < iterMax)) {
            rate = (y1 * x0 - y0 * x1) / (y1 - y0);
            x0 = x1;
            x1 = rate;
            if (Math.abs(rate) < epsMax) {
                y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
            } else {
                f = Math.exp(periods * Math.log(1 + rate));
                y = present * f + payment * (1 / rate + type) * (f - 1) + future;
            }
            y0 = y1;
            y1 = y;
            ++i;
        }
        return rate * 12 * 100;
    }
    loanInputHandler = (enterdText) => {
        var L = enterdText.replace(/,/g, '')
        this.setState({
            Loan: L
        });
        if (this.state.a && this.state.b && !this.state.d)
            this.calculateTenure(this.state.EMI, L, this.state.Rate)
        else if (this.state.b && this.state.d && !this.state.a)
            this.calculateEMI(L, this.state.Tenure, this.state.Rate)
        else if (this.state.a && this.state.d && !this.state.b)
            this.calculateRate(this.state.EMI, L, this.state.Tenure)
        var inWords = this.convertNumberToWords(Number(L));
        if (enterdText !== "")
            this.setState({
                loanInWords: inWords
            })
        else this.setState({ loanInWords: "" })
    }
    rateInputHandler = (enterdText) => {
        var R = enterdText
        this.setState({
            Rate: R,
        });
        if (this.state.a && this.state.c && !this.state.d)
            this.calculateTenure(this.state.EMI, this.state.Loan, R)
        else if (this.state.c && this.state.d && !this.state.a)
            this.calculateEMI(this.state.Loan, this.state.Tenure, R)
        else if (this.state.a && this.state.d && !this.state.c)
            this.calculateLoan(this.state.EMI, this.state.Tenure, R)

    }
    tenureInputHandler = (enterdText) => {
        var T = enterdText
        this.setState({
            Tenure: T
        });
        if (this.state.a && this.state.b && !this.state.c)
            this.calculateLoan(this.state.EMI, T, this.state.Rate)
        else if (this.state.b && this.state.c && !this.state.a)
            this.calculateEMI(this.state.Loan, T, this.state.Rate)
        else if (this.state.a && this.state.c && !this.state.b)
            this.calculateRate(this.state.EMI, this.state.Loan, T)
    }

    emiInputHandler = (enterdText) => {
        var E = enterdText.replace(/,/g, '')
        this.setState({
            EMI: E,
        });
        if (this.state.b && this.state.c && !this.state.d)
            this.calculateTenure(E, this.state.Loan, this.state.Rate)
        else if (this.state.c && this.state.d && !this.state.b)
            this.calculateRate(E, this.state.Loan, this.state.Tenure)
        else if (this.state.b && this.state.d && !this.state.c)
            this.calculateLoan(E, this.state.Tenure, this.state.Rate)
        var inWords = this.convertNumberToWords(Number(E));
        if (enterdText !== "")
            this.setState({
                emiInWords: inWords
            })
        else this.setState({ emiInWords: "" })
    }
    resetHandler = () => {
        Keyboard.dismiss()
        this.setState({
            Loan: "",
            Rate: "",
            Tenure: "",
            EMI: "",
            showTable: false,
            showSolution: false,
            DataTable: [],
            DataTable2: [],
            calc: 4,
            onReset: false,
            emiInWords: "",
            loanInWords: "",
            MM: 3,
            mm: "3 Months",
            emiTextInputVisible: true,
            rateTextInputVisible: true,
            loanTextInputVisible: true,
            tenureTextInputVisible: true,
            loanPlaceHolder: "Balance Loan",
            ratePlaceHolder: "Rate of Interest",
            tenurePlaceHolder: "Tenure",
            emiPlaceHolder: "Current EMI",
            a: false,
            b: false,
            c: false,
            d: false,
            historyMode: false
        })

    }
    calculateEMI = (Loan, Tenure, Rate) => {
        var R = parseFloat(Rate) / 12 / 100
        var T = parseFloat(Tenure)
        var L = parseFloat(Loan.replace(/,/g, ""))
        var E = Math.round((L * R) / (1 - (Math.pow((1 + R), -T)))).toString()
        if (!isNaN(E)) {
            this.setState({
                EMI: E
            })
            var inWords = this.convertNumberToWords(Number(E.replace(/,/g, "")));
            this.setState({
                emiInWords: inWords
            })
        }
        return E
    }
    calculateLoan = (EMI, Tenure, Rate) => {
        var R = parseFloat(Rate) / 12 / 100
        var T = parseFloat(Tenure)
        var E = parseFloat(EMI.replace(/,/g, ""))
        var L = Math.round((E / R) * (1 - (Math.pow((1 + R), -T)))).toString()
        if (!isNaN(L)) {
            this.setState({
                Loan: L
            })
            var inWords = this.convertNumberToWords(Number(L.replace(/,/g, "")));
            this.setState({
                loanInWords: inWords
            })
        }
        return L
    }
    calculateRate = (EMI, Loan, Tenure) => {
        var L = parseFloat(Loan.replace(/,/g, ""))
        var T = parseFloat(Tenure)
        var E = parseFloat(EMI.replace(/,/g, ""))
        var R = (this.RATE(T, -E, L, 0, 0, 0.01)).toFixed(2).toString()
        if (!isNaN(R) && R > 0)
            this.setState({
                Rate: R
            })
        return R
    }
    calculateTenure = (EMI, Loan, Rate) => {
        var L = parseFloat(Loan.replace(/,/g, ""))
        var R = parseFloat(Rate) / 12 / 100
        var E = parseFloat(EMI.replace(/,/g, ""))
        var num = (E) / (E - (L * R))
        var dum = 1 + R;
        var T = (Math.log(num) / Math.log(dum)).toFixed(2).toString()
        if (!isNaN(T)) {
            this.setState({
                Tenure: T
            })
        }
        return T
    }
    calculateNewTenure = (EMI, Loan, Rate) => {
        var L = parseFloat(Loan.replace(/,/g, ""))
        var R = parseFloat(Rate) / 12 / 100
        var E = parseFloat(EMI.replace(/,/g, ""))
        var num = (E) / (E - (L * R))
        var dum = 1 + R;
        var T = (Math.log(num) / Math.log(dum)).toFixed(2).toString()
        return T
    }
    calculateTable = async (Loan, Rate, Tenure, EMI, value) => {
        var tt = []
        this.setState({ tableLoaded: false, showTable: true })
        for (var i = 0; i < value; i++)
            tt.push((i + 1).toString())
        this.setState({ tableTitle: tt });
        await fetch('https://us-central1-global-gist-279416.cloudfunctions.net/calculateMCCTable', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Loan: parseFloat(Loan.replace(/,/g, "")),
                Rate: parseFloat(Rate) / 12 / 100,
                EMI: parseFloat(EMI.replace(/,/g, "")),
                Tenure: parseFloat(Tenure),
                value: value
            })
        })
            .then(response => response.json())
            .then((jsonData) => {
                this.setState({
                    DataTable: jsonData.DataTable,
                    DataTable2: jsonData.DataTable2,
                    tableLoaded: true,
                    newLoan: jsonData.newLoan,
                    newEMI: jsonData.newEMI,
                    newTenure: jsonData.newTenure,
                    changeInEMI: jsonData.changeInEMI,
                    changeInTenure: jsonData.changeInTenure,
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }
    checkInterest = (Loan, Rate, EMI) => {
        var l = parseFloat(Loan.replace(/,/g, ""));
        var r = parseFloat(Rate) / 12 / 100;
        var emi = parseFloat(EMI.replace(/,/g, ""));
        var interest = r * l
        if (emi < interest) {
            Alert.alert("", 'You might have entered ONE incorrect value!')
            this.setState({ showTable: false })
        }

    }
    calculateHandler = () => {
        Keyboard.dismiss()
        var L = "", R = "", T = "", E = "";
        if (this.state.EMI == "")
            E = this.calculateEMI(this.state.Loan, this.state.Tenure, this.state.Rate)
        else if (this.state.Rate == "")
            R = this.calculateRate(this.state.EMI, this.state.Loan, this.state.Tenure)
        else if (this.state.Loan == "")
            L = this.calculateLoan(this.state.EMI, this.state.Tenure, this.state.Rate)
        else if (this.state.Tenure == "")
            T = this.calculateTenure(this.state.EMI, this.state.Loan, this.state.Rate)
        if (L != "") {
            this.calculateTable(L, this.state.Rate, this.state.Tenure, this.state.EMI, this.state.MM)
            this.checkInterest(L, this.state.Rate, this.state.EMI)
            this._storeData([paisa.formatWithSymbol(Number(L) * 100, 0), this.state.Rate, this.state.Tenure, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])

        }
        else if (E != "") {
            this.calculateTable(this.state.Loan, this.state.Rate, this.state.Tenure, E, this.state.MM)
            this.checkInterest(this.state.Loan, this.state.Rate, E)
            this._storeData([paisa.formatWithSymbol(Number(this.state.Loan) * 100, 0), this.state.Rate, this.state.Tenure, paisa.formatWithSymbol(Number(E) * 100, 0), 1, 1])
        }
        else if (R != "") {
            this.calculateTable(this.state.Loan, R, this.state.Tenure, this.state.EMI, this.state.MM)
            this.checkInterest(this.state.Loan, R, this.state.EMI)
            this._storeData([paisa.formatWithSymbol(Number(this.state.Loan) * 100, 0), R, this.state.Tenure, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])
        }
        else if (T != "") {
            this.calculateTable(this.state.Loan, this.state.Rate, T, this.state.EMI, this.state.MM)
            this.checkInterest(this.state.Loan, this.state.Rate, this.state.EMI)
            this._storeData([paisa.formatWithSymbol(Number(this.state.Loan) * 100, 0), this.state.Rate, T, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])
        }
        else {
            this.calculateTable(this.state.Loan, this.state.Rate, this.state.Tenure, this.state.EMI, this.state.MM)
            this.checkInterest(this.state.Loan, this.state.Rate, this.state.EMI)
            this._storeData([paisa.formatWithSymbol(Number(L) * 100, 0), this.state.Rate, this.state.Tenure, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])
        }
        if ((R != '' || this.state.Rate != '') && (Number(R) > 7 || Number(this.state.Rate) > 7)) {
            var newTenure = ''
            if (E == '')
                newTenure = this.calculateNewTenure(this.state.EMI, this.state.Loan, '7')
            else
                newTenure = this.calculateNewTenure(E, this.state.Loan, '7')
            var diffTenure = 0;
            if (T == '')
                diffTenure = (Number(this.state.Tenure) - Number(newTenure)).toFixed(2);
            else
                diffTenure = (Number(T) - Number(newTenure)).toFixed(2);
            var savings = ''
            if (E == '')
                savings = paisa.formatWithSymbol(Math.round(diffTenure * Number(this.state.EMI.replace(/,/g, ''))) * 100, 0)
            else
                savings = paisa.formatWithSymbol(Math.round(diffTenure * Number(E)) * 100, 0)
            this.setState({ savings: savings })
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                if (!this.state.infoVisible)
                    Alert.alert(
                        "Wait! You are paying way too much as interest!!",
                        "You can save upto " + savings + " !!! For more details contact us",
                        [
                            {
                                text: "Contact us",
                                onPress: () => this.props.navigation.navigate('ContactScreen'),
                                style: "cancel"
                            },
                            { text: "Later" }
                        ],
                        { cancelable: false }
                    );
            }, 7000)
            if (this.state.Loan != "" && this.state.Rate != "" && this.state.Tenure != "" && this.state.EMI != "")
                this._storeData([paisa.formatWithSymbol(Number(this.state.Loan) * 100, 0), this.state.Rate, this.state.Tenure, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])
        }
    }
    _afterModalClosed = () => {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            Alert.alert(
                "Wait! You are paying way too much as interest!!",
                "You can save upto " + this.state.savings + " !!! For more details contact us",
                [
                    {
                        text: "Contact us",
                        onPress: () => this.props.navigation.navigate('ContactScreen'),
                        style: "cancel"
                    },
                    { text: "Later" }
                ],
                { cancelable: false }
            );
        }, 3000)
    }
    radioCall = (value) => {
        if (this.state.calc === value) {
            this.setState({ calc: 4 })
            if (value == 3)
                this.setState({ tenurePlaceHolder: "Tenure" })
            if (value == 2)
                this.setState({ loanPlaceHolder: "Balance Loan" })
            if (value == 1)
                this.setState({ ratePlaceHolder: "Rate of Interest" })
            if (value == 0)
                this.setState({ emiPlaceHolder: "Current EMI" })
            this.setState({ emiTextInputVisible: true })
            this.setState({ rateTextInputVisible: true })
            this.setState({ loanTextInputVisible: true })
            this.setState({ tenureTextInputVisible: true })
        }
        else {
            if (value == 0) {
                if (this.state.calc == 1)
                    this.setState({ ratePlaceHolder: "Rate of Interest" })
                else if (this.state.calc == 2)
                    this.setState({ loanPlaceHolder: "Balance Loan" })
                else if (this.state.calc == 3)
                    this.setState({ tenurePlaceHolder: "Tenure" })
                this.setState({ emiPlaceHolder: "?", EMI: "", emiInWords: "", a: false })
                this.setState({ emiTextInputVisible: false })
                this.setState({ rateTextInputVisible: true })
                this.setState({ loanTextInputVisible: true })
                this.setState({ tenureTextInputVisible: true })
            }
            else if (value == 1) {
                if (this.state.calc == 0)
                    this.setState({ emiPlaceHolder: "Current EMI" })
                else if (this.state.calc == 2)
                    this.setState({ loanPlaceHolder: "Balance Loan" })
                else if (this.state.calc == 3)
                    this.setState({ tenurePlaceHolder: "Tenure" })
                this.setState({ ratePlaceHolder: "?", Rate: "", b: false })
                this.setState({ emiTextInputVisible: true })
                this.setState({ rateTextInputVisible: false })
                this.setState({ loanTextInputVisible: true })
                this.setState({ tenureTextInputVisible: true })
            }
            else if (value == 2) {
                if (this.state.calc == 1)
                    this.setState({ ratePlaceHolder: "Interest Rate" })
                else if (this.state.calc == 0)
                    this.setState({ emiPlaceHolder: "Current EMI" })
                else if (this.state.calc == 3)
                    this.setState({ tenurePlaceHolder: "Tenure" })
                this.setState({ loanPlaceHolder: "?", Loan: "", loanInWords: "", c: false })
                this.setState({ emiTextInputVisible: true })
                this.setState({ rateTextInputVisible: true })
                this.setState({ loanTextInputVisible: false })
                this.setState({ tenureTextInputVisible: true })
            }
            else if (value == 3) {
                if (this.state.calc == 1)
                    this.setState({ ratePlaceHolder: "Interest Rate" })
                else if (this.state.calc == 2)
                    this.setState({ loanPlaceHolder: "Balance Loan" })
                else if (this.state.calc == 0)
                    this.setState({ emiPlaceHolder: "Current EMI" })
                this.setState({ tenurePlaceHolder: "?", Tenure: "", d: false })
                this.setState({ emiTextInputVisible: true })
                this.setState({ rateTextInputVisible: true })
                this.setState({ loanTextInputVisible: true })
                this.setState({ tenureTextInputVisible: false })
            }
            this.setState({ calc: value })
        }
    }
    closeHandler = () => {
        this.props.navigation.navigate('HomeScreen')
        this.resetHandler()
    }
    showSoln = () => {
        this.setState({ showSolution: true })
    }
    setMM = (val) => {
        if (val == 1)
            this.setState({ MM: val, mm: val.toString() + " Month" })
        else
            this.setState({ MM: val, mm: val.toString() + " Months" })
    }
    _shareResuslts = async (sharing) => {
        try {
            let result = await captureRef(sharing, {
                format: 'png',
            });
            Sharing.shareAsync(result)
        }
        catch (snapshotError) {
            console.error(snapshotError);
        }
    }
    toggleInfo = () => {
        this.setState({ infoVisible: !this.state.infoVisible }, () => {
            if (!this.state.infoVisible)
                this._afterModalClosed();
        });
    };
    render() {


        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.header}>
                            {
                                this.state.historyMode ? (
                                    <TouchableOpacity style={{ justifyContent: "center", paddingRight: normalize(10) }} onPress={() => this.setState({ historyMode: false })}>
                                        <Ionicons name="md-arrow-round-back" size={normalize(30)} color="black" />
                                    </TouchableOpacity>
                                )
                                    : null
                            }
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                                <Text style={styles.headerText}>Moratorium Calculator</Text>
                            </View>
                            {
                                !this.state.historyMode ? (
                                    <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => this.setState({ historyMode: true })}>
                                        <MaterialCommunityIcons name="history" size={normalize(30)} color="black" />
                                    </TouchableOpacity>
                                )
                                    : null
                            }
                            <TouchableOpacity style={{ justifyContent: "center" }} onPress={this.closeHandler}>
                                <Feather name="x" size={normalize(30)} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.state.historyMode ?
                            <History val="MCCKey" />
                            :
                            (
                                <ScrollView keyboardShouldPersistTaps="always">
                                    <View style={styles.body}>
                                        <View style={{ width: "85%" }}>
                                            <Text>   Choose any 1, if you don't have its value!</Text>
                                            <View style={styles.radioCategory}>
                                                <RadioForm
                                                    buttonSize={10}
                                                    initial={this.state.calc}
                                                    formHorizontal={true}
                                                >
                                                    {
                                                        this.state.radio_props.map((obj, i) => (
                                                            <RadioButton labelHorizontal={true} key={i} >
                                                                <RadioButtonInput
                                                                    obj={obj}
                                                                    index={i}
                                                                    isSelected={this.state.calc === i}
                                                                    onPress={val => this.radioCall(val)}
                                                                    borderWidth={1}
                                                                    buttonInnerColor={'#e74c3c'}
                                                                    buttonOuterColor={this.state.calc === i ? '#2196f3' : '#000'}
                                                                    buttonSize={10}
                                                                    buttonOuterSize={16}
                                                                    buttonStyle={{}}
                                                                    buttonWrapStyle={{ marginLeft: 10, paddingTop: 2 }}
                                                                />
                                                                <RadioButtonLabel
                                                                    obj={obj}
                                                                    index={i}
                                                                    onPress={val => this.radioCall(val)}
                                                                    labelHorizontal={true}
                                                                    labelStyle={{ fontSize: normalize(18), color: 'black', paddingTop: 3, }}
                                                                />
                                                            </RadioButton>
                                                        ))
                                                    }
                                                </RadioForm>
                                            </View>
                                        </View>
                                        <View style={{ width: '98%', alignItems: "center", justifyContent: "flex-start", height: normalize(220), right: normalize(12) }}>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(55), bottom: normalize(10), color: "grey" }} >{this.state.EMI != "" ? "EMI" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <FontAwesome5 name="coins" size={20} color="#FFA62F" style={{ top: "5%" }} />
                                                        <TextInput onTouchStart={() => this.setState({ a: true })} placeholder={this.state.emiPlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.emiInputHandler} value={this.state.EMI != "" ? (this.state.EMI != "?" ? (paisa.format(Number(this.state.EMI) * 100, 0)) : "?") : ""} editable={this.state.emiTextInputVisible}></TextInput>
                                                    </View>
                                                </View>
                                                <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "60%", left: "13%", paddingTop: 3, width: "85%" }}>{this.state.emiInWords}</Text>
                                            </View>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(55), bottom: normalize(10), color: "grey" }} >{this.state.Rate != "" ? "Rate" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <Feather name="percent" size={20} color="red" style={{ top: "5%" }} />
                                                        <TextInput onTouchStart={() => this.setState({ b: true })} placeholder={this.state.ratePlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.rateInputHandler} value={this.state.Rate} editable={this.state.rateTextInputVisible}></TextInput>
                                                        <Text style={{ fontSize: normalize(20), right: normalize(35), padding: normalize(10), top: normalize(7) }}>p.a</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(55), bottom: normalize(10), color: "grey" }} >{this.state.Loan != "" ? "Loan" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <MaterialCommunityIcons name="sack" size={20} color="#FFA62F" style={{ top: "5%" }} />
                                                        <TextInput onTouchStart={() => this.setState({ c: true })} placeholder={this.state.loanPlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.loanInputHandler} value={this.state.Loan != "" ? (this.state.EMI != "?" ? (paisa.format(Number(this.state.Loan) * 100, 0)) : "?") : ""} editable={this.state.loanTextInputVisible}></TextInput>
                                                    </View>
                                                </View>
                                                <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "60%", left: "13%", paddingTop: 3, width: "85%" }}>{this.state.loanInWords}</Text>
                                            </View>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(55), bottom: normalize(10), color: "grey" }} >{this.state.Tenure != "" ? "Tenure" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <Feather name="clock" size={20} color="red" style={{ top: "5%" }} />
                                                        <TextInput onTouchStart={() => this.setState({ d: true })} placeholder={this.state.tenurePlaceHolder} keyboardType={"numeric"} style={styles.textInput1} onChangeText={this.tenureInputHandler} value={this.state.Tenure} editable={this.state.tenureTextInputVisible}></TextInput>
                                                        <FontAwesome name="arrows-h" size={20} color="black" style={{ top: "5%" }} />
                                                        <TextInput style={styles.textInput1} value={this.state.Tenure != "" ? (Number(this.state.Tenure) / 12).toFixed(2).toString() : ""} editable={false}></TextInput>
                                                    </View>
                                                </View>
                                                {
                                                    this.state.Tenure != "" ? <Text style={{ width: '18%', bottom: '115%', left: '35%', fontSize: normalize(16) }}>Months</Text>
                                                        : null
                                                }
                                                {
                                                    this.state.Tenure != "" ? <Text style={{ width: '15%', bottom: '150%', left: '82%', fontSize: normalize(16) }}>Years</Text>
                                                        : null
                                                }
                                            </View>
                                        </View>
                                        <View style={{ left: "3%", width: "100%", backgroundColor: "#f8f3eb", alignItems: "center", top: normalize(5) }}>
                                            <View style={{ flexDirection: "row", width: "95%" }}>
                                                <FontAwesome name="calendar" size={20} color="#FFA62F" style={{ paddingRight: normalize(10), top: "2%" }} />
                                                <TextInput style={{ paddingLeft: normalize(10), width: "100%", right: normalize(10), fontSize: normalize(20) }} placeholder="Moratorium Period : 3 Months" value={"Moratorium Period : " + this.state.mm} />
                                            </View>
                                            <View style={styles.sliderStyle}>
                                                <Slider
                                                    thumbTintColor='red'
                                                    minimumTrackTintColor="#00bcd4"
                                                    maximumTrackTintColor="grey"
                                                    animateTransitions={true}
                                                    style={{ width: normalize(342) }}
                                                    step={1}
                                                    minimumValue={1}
                                                    maximumValue={12}
                                                    value={this.state.MM}
                                                    onValueChange={val => this.setMM(val)}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", width: '80%', alignItems: "center", justifyContent: "space-around" }}>
                                            <View style={{ width: "45%", padding: 10, }}>
                                                <Button title="Reset" color="#e43f5a" onPress={this.resetHandler}></Button>
                                            </View>
                                            <View style={{ width: "45%", padding: 10, }}>
                                                <Button title="Calculate" color="#00bcd4" onPress={this.calculateHandler}></Button>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <Modal isVisible={this.state.infoVisible}
                                            backdropOpacity={0.9}
                                            backdropColor="#ccc">
                                            <View style={{ alignItems: "center", justifyContent: "center", }}>
                                                <View style={styles.modalcontainer}>
                                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                        <Text style={{ fontSize: normalize(18), textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>Heading Definitions</Text>
                                                        <TouchableOpacity onPress={this.toggleInfo}>
                                                            <Feather name="x" size={normalize(30)} color="black" style={{ textAlign: "right" }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Table >
                                                        <Rows data={this.state.modalTable} flexArr={[0.4, 5]} style={{ height: normalize(50), justifyContent: "flex-start" }} textStyle={styles.modalText} />
                                                    </Table>
                                                </View>

                                            </View>
                                        </Modal>
                                    </View>
                                    {this.state.showTable ? (
                                        this.state.tableLoaded ? (
                                            <View style={styles.tableContainer}>
                                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                                    <TouchableOpacity onPress={this.toggleInfo}>
                                                        <Entypo name="info-with-circle" size={15} />
                                                    </TouchableOpacity>
                                                    <Text style={{ textAlign: "center", fontSize: normalize(20), fontWeight: "bold", width: "90%", paddingBottom: normalize(10) }}>Impact : If Moratorium is Opted</Text>
                                                </View>
                                                <Table borderStyle={{ borderWidth: 1, borderColor: "#f8f3eb" }} ref={view => { this._container1 = view; }}>
                                                    <Row data={this.state.tableHead} flexArr={[0.6, 1.4, 1, 1, 1]} style={styles.head} textStyle={styles.tableText} />

                                                    <TableWrapper style={styles.wrapper}>
                                                        <Rows data={this.state.DataTable} flexArr={[0.6, 1.4, 1, 1, 1]} style={styles.row} textStyle={styles.tableText2} />
                                                    </TableWrapper>
                                                </Table>
                                                <Text style={{ fontSize: normalize(10), color: "grey" }}>Note : All values are in round up format.{'\n'}</Text>
                                                <View style={{ alignItems: "center" }}>
                                                    <View style={styles.body3}>
                                                        <TouchableOpacity style={styles.btn2}
                                                            onPress={() => {
                                                                this.setState({ displaySchedule: true })
                                                                this.props.navigation.navigate('ScheduleScreen2',
                                                                    {
                                                                        Loan: Number(this.state.newLoan),
                                                                        EMI: Number(this.state.EMI.replace(/,/g, '').replace('₹', '')),
                                                                        Tenure: Number(this.state.newTenure),
                                                                        Rate: Number(this.state.Rate),
                                                                        changeInTenure: this.state.changeInTenure
                                                                    })
                                                            }}>
                                                            <Text style={styles.btnText}>SCHEDULE</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.btn2} onPress={() => this._shareResuslts(this._container1)}>
                                                            <Text style={styles.btnText}>SHARE</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {!this.state.showSolution ? (
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={{ width: "65%", padding: normalize(10), paddingTop: normalize(20) }}>
                                                            <Button title="Need a solution to reduce the impact ? Find now !" color="#00bcd4" onPress={this.showSoln}></Button>
                                                        </View>

                                                    </View>
                                                ) : null
                                                }

                                            </View>
                                        ) : (
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <ActivityIndicator size="large" color="#e43f5a" />
                                                </View>
                                            )
                                    ) : null}
                                    {this.state.showSolution ? (
                                        <View >
                                            <View style={styles.tableContainer} >
                                                <Text style={{ textAlign: "center", fontSize: normalize(20), fontWeight: "bold", paddingLeft: 20, paddingBottom: 10 }}>Increase Your EMI </Text>

                                                <Table borderStyle={{ borderWidth: 1, borderColor: "#f8f3eb" }} ref={view => { this._container2 = view; }}>
                                                    <Row data={this.state.tableHead2} flexArr={[0.6, 1.4, 1, 1, 1]} style={styles.head} textStyle={styles.tableText} />
                                                    <TableWrapper style={styles.wrapper}>
                                                        <Rows data={this.state.DataTable2} flexArr={[0.6, 1.4, 1, 1, 1]} style={styles.row} textStyle={styles.tableText2} />
                                                    </TableWrapper>
                                                </Table>
                                                <Text style={{ fontSize: normalize(10), color: "grey" }}>Note : All values are in round up format.{'\n'}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', paddingBottom: 15 }}>
                                                <View style={styles.body3}>
                                                    <TouchableOpacity style={styles.btn2}
                                                        onPress={() => {
                                                            this.setState({ displaySchedule: true })
                                                            this.props.navigation.navigate('ScheduleScreen2',
                                                                {
                                                                    Loan: Number(this.state.newLoan),
                                                                    EMI: Number(this.state.newEMI),
                                                                    Tenure: Number(this.state.Tenure),
                                                                    Rate: Number(this.state.Rate)
                                                                })
                                                        }}>
                                                        <Text style={styles.btnText}>SCHEDULE</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.btn2} onPress={() => this._shareResuslts(this._container2)}>
                                                        <Text style={styles.btnText}>SHARE</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ) : null
                                    }
                                </ScrollView>
                            )
                    }

                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    radioCategory: {
        flexDirection: "row",
        paddingTop: normalize(10),
        paddingBottom: normalize(15),
        justifyContent: "center"
    },
    sliderStyle: {
        right: normalize(4),
        paddingBottom: normalize(15),
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb"
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: normalize(100),
    },
    headerText: {
        color: "#161924",
        fontSize: normalize(28),
        borderBottomWidth: 2,
        borderColor: "#e43f5a",
        alignContent: "flex-start",
        fontFamily: "Roboto"
    },
    body: {
        top: normalize(15),
        alignItems: "center",
        justifyContent: "flex-start",
        height: normalize(420)
    },
    body3: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
    },
    text: {
        color: "#161924",
        fontSize: normalize(20),
        fontWeight: "500"
    },
    textInput: {
        color: "black",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        width: '100%',
        textAlignVertical: "bottom",
        padding: normalize(10),
        marginBottom: normalize(10),
        fontSize: normalize(20),
    },
    textInput1: {
        color: "black",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        width: '47.5%',
        padding: normalize(10),
        marginBottom: normalize(10),
        fontSize: normalize(20),
    },
    combo2: {
        flexDirection: "row",
        width: "85%",
        height: "100%",
        justifyContent: "space-between",
    },
    btn: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: '60%',
        marginTop: normalize(35)
    },
    btnSize: {
        width: normalize(80)
    },
    textOutput: {
        padding: normalize(30),
        fontSize: normalize(20)
    },
    answer: {
        flexDirection: "column",
    },
    btn2: {
        padding: normalize(20),
        width: "45%",
        height: normalize(30),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b6ca8",
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 5,
    },
    btnText: {
        color: "white",
        fontSize: normalize(18),
        fontFamily: "Roboto",
    },
    modalText: {
        fontSize: normalize(16),
        fontFamily: "Roboto",
        textAlign: "left"
    },
    modalcontainer: {
        width: normalize(350),
        height: normalize(350),
        padding: normalize(16),
        paddingTop: normalize(30),
        backgroundColor: '#fff',
        borderRadius: normalize(10)
    },
    tableContainer: { flex: 1, padding: 10, top: normalize(10), backgroundColor: '#f8f3eb' },
    head: { height: normalize(60), backgroundColor: '#fffff3', },
    wrapper: { flexDirection: 'row' },
    title: { flex: 0.6, backgroundColor: '#fffff1', },
    row: { height: normalize(40), backgroundColor: '#fffff1' },
    tableText: { textAlign: 'center', fontSize: normalize(12), fontFamily: "Roboto", fontWeight: "bold" },
    tableText2: { textAlign: 'center', fontSize: normalize(12), fontFamily: "Roboto" }
})
