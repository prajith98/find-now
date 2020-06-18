import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, TextInput, Keyboard, Button, BackHandler, Share } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import paisa from 'paisa.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
import { Divider } from 'react-native-elements';
import RadioForm, { RadioButtonInput, RadioButtonLabel, RadioButton } from 'react-native-simple-radio-button';
import History from './History';
import ScheduleScreen from './ScheduleScreen';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import PieChart from 'react-native-pie-chart';
export default class CalculatorScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            Loan: "",
            Rate: "",
            Tenure: "",
            EMI: "",
            Interest: "",
            totalPayment: "",
            value: '',
            loanInWords: "",
            emiInWords: "",
            from: "",
            calc: 4,
            radio_props: [
                { label: 'Loan', value: 0 },
                { label: 'Rate', value: 1 },
                { label: 'Tenure', value: 2 },
                { label: 'EMI', value: 3 },
            ],
            loanPlaceHolder: "Loan Amount",
            ratePlaceHolder: "Rate of Interest",
            tenurePlaceHolder: "Tenure",
            emiPlaceHolder: "EMI",
            emiTextInputVisible: true,
            rateTextInputVisible: true,
            loanTextInputVisible: true,
            tenureTextInputVisible: true,
            historyMode: false,
            displaySchedule: false,
            currentPage: true,
            tenureMode: false,
            calculation: [],
        }
    }
    componentDidMount = () => {
        const val = this.props.value
        this.setState({
            calc: val
        })
        if (val == 0)
            this.setState({ loanTextInputVisible: false, loanPlaceHolder: "Calculate ?" })
        else if (val == 1)
            this.setState({ rateTextInputVisible: false, ratePlaceHolder: "Calculate ?" })
        else if (val == 2)
            this.setState({ tenureTextInputVisible: false, tenurePlaceHolder: "Calculate ?" })
        else if (val == 3)
            this.setState({ emiTextInputVisible: false, emiPlaceHolder: "Calculate ?" })
        var t = this.props.name;
        if (t == "EMI Calculator")
            this.setState({ from: "EMIScreen" })
        else if (t == "Loan Eligibility Calculator")
            this.setState({ from: "LoanScreen" })
        else if (t == "Interest Rate Calculator")
            this.setState({ from: "RateScreen" })
        else if (t == "Remaining Tenure Calculator")
            this.setState({ from: "TenureScreen" })
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.onBackPress
        );
    }
    _shareResuslts = async () => {
        try {
            await Share.share({
                message:
                    "Loan : " + paisa.formatWithSymbol(this.state.Loan * 100, 0) + "\nRate : " + this.state.Rate + "%\nTenure : " + this.state.Tenure + " Months\nEMI: " + paisa.formatWithSymbol(this.state.EMI * 100, 0),
            })
        }
        catch (snapshotError) {
            console.error(snapshotError);
        }
    }
    _storeData = async (values) => {
        var key = this.props.name;
        var flag = 0;
        var existingData
        try {
            existingData = await AsyncStorage.getItem(key);
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
                key
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
        var l = enterdText.replace(/,/g, '').replace('₹', '');
        this.setState({
            Loan: l
        });
        if (this.state.calc == 3) {
            if (this.state.Rate != "" && this.state.Tenure != "") {
                this.calculateEMI(l, this.state.Rate, this.state.Tenure);
            }
        }
        else if (this.state.calc == 1) {
            if (this.state.EMI != "" && this.state.Tenure != "") {
                this.calculateRate(this.state.EMI, l, this.state.Tenure);
            }
        }
        else if (this.state.calc == 2) {
            if (this.state.EMI != "" && this.state.Rate != "") {
                this.calculateTenure(this.state.EMI, l, this.state.Rate);
            }
        }
        var inWords = this.convertNumberToWords(Number(l));
        if (enterdText !== "")
            this.setState({
                loanInWords: inWords
            })
        else this.setState({ loanInWords: "" })
    }

    rateInputHandler = (enterdText) => {
        var r = enterdText
        this.setState({
            Rate: r,
        });
        if (this.state.calc == 3) {
            if (this.state.Loan != "" && this.state.Tenure != "")
                this.calculateEMI(this.state.Loan, r, this.state.Tenure);
        }
        else if (this.state.calc == 0) {
            if (this.state.EMI != "" && this.state.Tenure != "") {
                this.calculateLoan(this.state.EMI, this.state.Tenure, r);
            }
        }
        else if (this.state.calc == 2) {
            if (this.state.EMI != "" && this.state.Loan != "") {
                this.calculateTenure(this.state.EMI, this.state.Loan, r);
            }
        }
    }
    tenureInputHandler = (enterdText) => {
        var t = enterdText
        this.setState({
            Tenure: t,
        });
        if (this.state.calc == 3) {
            if (this.state.Rate != "" && this.state.Loan != "")
                this.calculateEMI(this.state.Loan, this.state.Rate, t);
        }
        else if (this.state.calc == 0) {
            if (this.state.EMI != "" && this.state.Rate != "") {
                this.calculateLoan(this.state.EMI, t, this.state.Rate);
            }
        }
        else if (this.state.calc == 1) {
            if (this.state.EMI != "" && this.state.Loan != "") {
                this.calculateRate(this.state.EMI, this.state.Loan, t);
            }
        }
    }
    emiInputHandler = (enterdText) => {
        var E = enterdText.replace(/,/g, '').replace('₹', '');
        this.setState({
            EMI: E,
        });
        if (this.state.calc == 0) {
            if (this.state.Tenure != "" && this.state.Rate != "") {
                this.calculateLoan(E, this.state.Tenure, this.state.Rate);
            }
        }
        else if (this.state.calc == 1) {
            if (this.state.Tenure != "" && this.state.Loan != "") {
                this.calculateRate(E, this.state.Loan, this.state.Tenure);
            }
        }
        else if (this.state.calc == 2) {
            if (this.state.Rate != "" && this.state.Loan != "") {
                this.calculateTenure(E, this.state.Loan, this.state.Rate);
            }
        }
        var inWords = this.convertNumberToWords(Number(E));
        if (enterdText !== "")
            this.setState({
                emiInWords: inWords
            })
        else this.setState({ emiInWords: "" })
    }
    calculateLoan = (EMI, Tenure, Rate) => {
        var R = parseFloat(Rate) / 12 / 100
        var T = !this.state.tenureMode ? parseFloat(Tenure) : parseFloat(Tenure) * 12
        var E = parseFloat(EMI.replace(/,/g, "").replace('₹', ''))
        var L = Math.round((E / R) * (1 - (Math.pow((1 + R), -T)))).toString()
        if (!isNaN(L)) {
            this.setState({
                Loan: L
            })
            var inWords = this.convertNumberToWords(Number(L.replace(/,/g, "")));
            this.setState({
                loanInWords: inWords
            })
            this.calculateInterest(E, T, L)
        }

        return L
    }
    calculateRate = (EMI, Loan, Tenure) => {
        var L = parseFloat(Loan.replace(/,/g, "").replace('₹', ''))
        var T = !this.state.tenureMode ? parseFloat(Tenure) : parseFloat(Tenure) * 12
        var E = parseFloat(EMI.replace(/,/g, "").replace('₹', ''))
        var R = (this.RATE(T, -E, L, 0, 0, 0.01)).toFixed(2).toString()
        if (!isNaN(R)) {
            this.setState({
                Rate: R
            })
            this.calculateInterest(E, T, L)
        }
        return R
    }
    calculateTenure = (EMI, Loan, Rate) => {
        var L = parseFloat(Loan.replace(/,/g, "").replace('₹', ''))
        var R = parseFloat(Rate) / 12 / 100
        var E = parseFloat(EMI.replace(/,/g, "").replace('₹', ''))
        var num = (E) / (E - (L * R))
        var dum = 1 + R;
        var T = (Math.log(num) / Math.log(dum)).toFixed(2).toString()
        if (!isNaN(T)) {
            this.setState({
                Tenure: T
            })
            this.calculateInterest(E, T, L)
        }
        return T
    }
    calculateEMI = (Loan, Rate, Tenure) => {
        var R = parseFloat(Rate) / 12 / 100
        var T = !this.state.tenureMode ? parseFloat(Tenure) : parseFloat(Tenure) * 12
        var L = parseFloat(Loan.replace(/,/g, "").replace('₹', ''))
        var E = Math.round((L * R) / (1 - (Math.pow((1 + R), -T)))).toString()
        if (!isNaN(E)) {
            this.setState({
                EMI: E
            })
            var inWords = this.convertNumberToWords(Number(E.replace(/,/g, "")));
            this.setState({
                emiInWords: inWords
            })
            this.calculateInterest(E, T, L)
        }
        return E
    }
    calculateInterest = (EMI, Tenure, Loan) => {
        var series = []
        series.push(Math.round(EMI * Tenure - Loan));
        series.push(Number(Loan))
        this.setState({ calculation: series })
        this.setState({
            Interest: paisa.formatWithSymbol(Math.round(EMI * Tenure - Loan) * 100, 0),
            totalPayment: paisa.formatWithSymbol(Math.round(EMI * Tenure) * 100, 0)
        })
    }
    toggleTenure = () => {
        this.setState({ tenureMode: !this.state.tenureMode })
    }
    resetHandler = () => {
        this.setState({
            Loan: "",
            Rate: "",
            Tenure: "",
            EMI: "",
            Interest: "",
            totalPayment: "",
            value: this.props.value,
            loanInWords: "",
            emiInWords: "",
            historyMode: false
        })
        const val = this.props.value
        this.setState({
            calc: val
        })
        if (val == 0)
            this.setState({ loanTextInputVisible: false, emiTextInputVisible: true, rateTextInputVisible: true, tenureTextInputVisible: true, loanPlaceHolder: "Calculate ?", ratePlaceHolder: "Rate of Interest", tenurePlaceHolder: "Tenure", emiPlaceHolder: "EMI" })
        else if (val == 1)
            this.setState({ rateTextInputVisible: false, emiTextInputVisible: true, loanTextInputVisible: true, tenureTextInputVisible: true, ratePlaceHolder: "Calculate ?", loanPlaceHolder: "Loan Amount", tenurePlaceHolder: "Tenure", emiPlaceHolder: "EMI" })
        else if (val == 2)
            this.setState({ tenureTextInputVisible: false, emiTextInputVisible: true, rateTextInputVisible: true, loanTextInputVisible: true, tenurePlaceHolder: "Calculate ?", loanPlaceHolder: "Loan Amount", ratePlaceHolder: "Rate of Interest", emiPlaceHolder: "EMI" })
        else if (val == 3)
            this.setState({ emiTextInputVisible: false, rateTextInputVisible: true, loanTextInputVisible: true, tenureTextInputVisible: true, emiPlaceHolder: "Calculate ?", loanPlaceHolder: "Loan Amount", ratePlaceHolder: "Rate of Interest", tenurePlaceHolder: "Tenure" })
    }
    radioCall = (value) => {
        if (value == 3) {
            if (this.state.calc == 1)
                this.setState({ ratePlaceHolder: "Rate of Interest" })
            else if (this.state.calc == 0)
                this.setState({ loanPlaceHolder: "Loan Amount" })
            else if (this.state.calc == 2)
                this.setState({ tenurePlaceHolder: "Tenure" })
            this.setState({ emiPlaceHolder: "Calculate ?", EMI: "", emiInWords: "" })
            this.setState({ emiTextInputVisible: false })
            this.setState({ rateTextInputVisible: true })
            this.setState({ loanTextInputVisible: true })
            this.setState({ tenureTextInputVisible: true })
        }
        else if (value == 1) {
            if (this.state.calc == 3)
                this.setState({ emiPlaceHolder: "EMI" })
            else if (this.state.calc == 0)
                this.setState({ loanPlaceHolder: "Loan Amount" })
            else if (this.state.calc == 2)
                this.setState({ tenurePlaceHolder: "Tenure" })
            this.setState({ ratePlaceHolder: "Calculate ?", Rate: "" })
            this.setState({ emiTextInputVisible: true })
            this.setState({ rateTextInputVisible: false })
            this.setState({ loanTextInputVisible: true })
            this.setState({ tenureTextInputVisible: true })
        }
        else if (value == 0) {
            if (this.state.calc == 1)
                this.setState({ ratePlaceHolder: "Interest Rate" })
            else if (this.state.calc == 3)
                this.setState({ emiPlaceHolder: "EMI" })
            else if (this.state.calc == 2)
                this.setState({ tenurePlaceHolder: "Tenure" })
            this.setState({ loanPlaceHolder: "Calculate ?", Loan: "", loanInWords: "" })
            this.setState({ emiTextInputVisible: true })
            this.setState({ rateTextInputVisible: true })
            this.setState({ loanTextInputVisible: false })
            this.setState({ tenureTextInputVisible: true })
        }
        else if (value == 2) {
            if (this.state.calc == 1)
                this.setState({ ratePlaceHolder: "Interest Rate" })
            else if (this.state.calc == 0)
                this.setState({ loanPlaceHolder: "Loan Amount" })
            else if (this.state.calc == 3)
                this.setState({ emiPlaceHolder: "EMI" })
            this.setState({ tenurePlaceHolder: "Calculate ?", Tenure: "" })
            this.setState({ emiTextInputVisible: true })
            this.setState({ rateTextInputVisible: true })
            this.setState({ loanTextInputVisible: true })
            this.setState({ tenureTextInputVisible: false })
        }
        this.setState({ calc: value })
    }
    calculateHandler = () => {
        Keyboard.dismiss();
        if (this.state.Loan == "" && this.state.Rate != "" && this.state.Tenure != "" && this.state.EMI != "")
            this.calculateLoan(this.state.EMI, this.state.Tenure, this.state.Rate)
        else if (this.state.Rate == "" && this.state.Loan != "" && this.state.Tenure != "" && this.state.EMI != "")
            this.calculateRate(this.state.EMI, this.state.Loan, this.state.Tenure)
        else if (this.state.Tenure == "" && this.state.Rate != "" && this.state.Loan != "" && this.state.EMI != "")
            this.calculateTenure(this.state.EMI, this.state.Loan, this.state.Rate)
        else if (this.state.EMI == "" && this.state.Rate != "" && this.state.Tenure != "" && this.state.Loan != "")
            this.calculateEMI(this.state.Loan, this.state.Rate, this.state.Tenure)
        if (this.state.Loan != "" && this.state.Rate != "" && this.state.Tenure != "" && this.state.EMI != "")
            this._storeData([paisa.formatWithSymbol(Number(this.state.Loan) * 100, 0), this.state.Rate, this.state.Tenure, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])
    }
    showRepaymentSchedule = () => {
        this._storeData([paisa.formatWithSymbol(Number(this.state.Loan) * 100, 0), this.state.Rate, this.state.Tenure, paisa.formatWithSymbol(Number(this.state.EMI) * 100, 0), 1, 1])
        this.setState({ displaySchedule: true })
    }
    hideRepaymentSchedule = (val) => {
        this.setState({ displaySchedule: val })
    }
    closeHandler = () => {
        this.resetHandler();
        Keyboard.dismiss();
        this.props.navigation.navigate('HomeScreen')
    }
    onBackPress = () => {
        if (this.state.displaySchedule) {
            this.setState({ displaySchedule: false })
        }
        else if (this.state.historyMode) {
            this.setState({ historyMode: false })
        }
        else
            this.props.navigation.navigate("HomeScreen")
        return true;
    }
    render() {
        const chart_wh = 210
        const sliceColor = ['#e43f5a', '#FFEB3B'];
        if (!this.state.displaySchedule)
            return (
                <SafeAreaView style={styles.container} ref={view => { this._container = view; }} >
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
                                <Text style={styles.headerText}>{this.props.name}</Text>
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
                            <History val={this.props.name} />
                            :
                            (
                                <KeyboardAwareScrollView keyboardShouldPersistTaps="always" >

                                    <View style={styles.body}>
                                        <View style={{ width: "85%" }}>
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
                                                                    labelStyle={{ fontSize: normalize(20), color: 'black', paddingTop: 3 }}
                                                                    labelWrapStyle={{}}
                                                                />
                                                            </RadioButton>
                                                        ))
                                                    }
                                                </RadioForm>
                                            </View>
                                        </View>
                                        <View style={{ width: '95%', alignItems: "center", justifyContent: "center", height: normalize(220), right: normalize(5), top: normalize(5) }}>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(54), bottom: normalize(12), color: "grey" }} >{this.state.Loan != "" ? "Loan" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <MaterialCommunityIcons name="sack" size={20} color="#FFA62F" style={{ top: "4%" }} />
                                                        <TextInput placeholder={this.state.loanPlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.loanInputHandler} value={this.state.Loan != "" ? (paisa.format(Number(this.state.Loan) * 100, 0)) : ""} editable={this.state.loanTextInputVisible}></TextInput>
                                                    </View>
                                                </View>
                                                <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "60%", left: "13%", paddingTop: 3, width: "81%" }}>{this.state.loanInWords}</Text>
                                            </View>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(54), bottom: normalize(12), color: "grey" }} >{this.state.Rate != "" ? "Rate" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <Feather name="percent" size={20} color="red" style={{ top: "4%" }} />
                                                        <TextInput placeholder={this.state.ratePlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.rateInputHandler} value={this.state.Rate} editable={this.state.rateTextInputVisible}></TextInput>
                                                        <Text style={{ fontSize: normalize(20), right: "55%", top: normalize(7) }}>p.a</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(54), bottom: normalize(12), color: "grey" }} >{this.state.Tenure != "" ? "Tenure" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <Feather name="clock" size={20} color="red" style={{ top: "4%" }} />
                                                        <TextInput placeholder={this.state.tenurePlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.tenureInputHandler} value={!this.state.tenureTextInputVisible ? (this.state.Tenure != "" ? (!this.state.tenureMode ? this.state.Tenure : (parseFloat(this.state.Tenure) / 12).toFixed(2)) : "") : this.state.Tenure} editable={this.state.tenureTextInputVisible}></TextInput>
                                                        <View style={{ top: normalize(5), backgroundColor: "white", borderColor: "#E7E7E7", borderRadius: normalize(50), right: normalize(60), justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", borderWidth: 2, width: normalize(60), height: normalize(25) }}>
                                                            <TouchableOpacity style={[styles.switchBtn, { borderWidth: !this.state.tenureMode ? 1 : 0, backgroundColor: !this.state.tenureMode ? "#e43f5a" : null }]} onPress={this.toggleTenure}>
                                                                <Text style={{ textAlign: "center", color: !this.state.tenureMode ? "white" : null, fontWeight: "bold" }}>M</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={[styles.switchBtn, { borderWidth: this.state.tenureMode ? 1 : 0, backgroundColor: this.state.tenureMode ? "#e43f5a" : null }]} onPress={this.toggleTenure}>
                                                                <Text style={{ textAlign: "center", color: this.state.tenureMode ? "white" : null, fontWeight: "bold" }}>Y</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ width: '100%', height: "24%" }}>
                                                <Text style={{ width: "15%", left: normalize(54), bottom: normalize(12), color: "grey" }} >{this.state.EMI != "" ? "EMI" : ""}</Text>
                                                <View style={{ alignItems: "center", bottom: normalize(25) }}>
                                                    <View style={styles.combo2}>
                                                        <FontAwesome5 name="coins" size={20} color="#FFA62F" style={{ top: "4%" }} />
                                                        <TextInput placeholder={this.state.emiPlaceHolder} keyboardType={"numeric"} style={styles.textInput} onChangeText={this.emiInputHandler} value={this.state.EMI != "" ? (paisa.format(Number(this.state.EMI) * 100, 0)) : ""} editable={this.state.emiTextInputVisible}></TextInput>
                                                    </View>
                                                </View>
                                                <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "60%", left: "13%", paddingTop: 3, width: "81%" }}>{this.state.emiInWords}</Text>
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
                                    <View style={this.state.Interest != "" ? { height: windowHeight / 1.7 } : { height: 0 }}>
                                        {
                                            this.state.Interest != "" ? (
                                                <View style={{ alignItems: "center", top: normalize(20) }}>
                                                    <PieChart
                                                        chart_wh={chart_wh}
                                                        series={this.state.calculation}
                                                        sliceColor={sliceColor}
                                                        doughnut={true}
                                                        coverRadius={0.45}
                                                        coverFill={'#FFF'}
                                                        withVerticalLabels={false}
                                                        withHorizontalLabels={false}
                                                    />
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.Interest != "" ? (
                                                <View style={{ alignItems: "center", top: normalize(20) }}>
                                                    <View style={{ height: normalize(70), width: normalize(360), flexDirection: "row", justifyContent: "center" }}>
                                                        <View style={[styles.solution, { borderRightWidth: 0.5, borderColor: 'grey' }]}>
                                                            <Text style={styles.solText}>Total Interest</Text>
                                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                <Text style={{ color: "#e43f5a", fontSize: normalize(25) }}>⬤ </Text>
                                                                <Text style={styles.solText}>{this.state.Interest}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={[styles.solution, { borderRightWidth: 0.5, borderColor: 'grey' }]}>
                                                            <Text style={styles.solText}>Principal</Text>
                                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                <Text style={{ color: "#FFEB3B", fontSize: normalize(25) }}>⬤ </Text>
                                                                <Text style={styles.solText}>{paisa.formatWithSymbol(this.state.Loan * 100, 0)}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.solution} >
                                                            <Text style={styles.solText}>Total Payment</Text>
                                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                <Text style={{ color: "#f8f3eb", fontSize: normalize(25) }}> </Text>
                                                                <Text style={styles.solText}>{this.state.totalPayment}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.Interest != "" ? (
                                                <View style={{ alignItems: "center", top: normalize(35) }}>
                                                    <View style={{ width: normalize(320), flexDirection: "row", justifyContent: "center" }}>
                                                        <TouchableOpacity style={styles.btn2} onPress={this.showRepaymentSchedule}
                                                        >
                                                            <Text style={styles.btnText1}>Repayment{'\n'}Schedule</Text>
                                                        </TouchableOpacity>
                                                        <View style={{ flex: 0.2 }}></View>
                                                        <TouchableOpacity style={styles.btn2} onPress={this._shareResuslts}>
                                                            <Text style={styles.btnText1}>Share with{'\n'}Friends</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ) : null
                                        }

                                    </View>
                                </KeyboardAwareScrollView>
                            )
                    }

                </SafeAreaView>
            )
        else
            return (
                <ScheduleScreen Loan={Number(this.state.Loan.replace(/,/g, '').replace('₹', ''))} EMI={Number(this.state.EMI.replace(/,/g, '').replace('₹', ''))} Tenure={this.state.tenureMode ? Number(this.state.Tenure) * 12 : Number(this.state.Tenure)} Rate={Number(this.state.Rate)} getBack={this.hideRepaymentSchedule} />
            )
    }
}
const styles = StyleSheet.create({
    radioCategory: {
        flexDirection: "row",
        paddingTop: 10,
        justifyContent: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f3eb",
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: windowHeight / 7

    },
    headerText: {
        fontSize: normalize(24),
        borderBottomWidth: 2,
        borderBottomColor: "#e43f5a",
    },
    body: {
        top: normalize(15),
        alignItems: "center",
        justifyContent: "flex-start",
        height: normalize(320, windowHeight),
    },
    combo: {
        flexDirection: "row",
        width: "85%",
        justifyContent: "space-between",
        paddingBottom: 2,
        height: normalize(50),
    },
    combo2: {
        flexDirection: "row",
        width: "85%",
        height: normalize(50),
        justifyContent: "space-between",
    },
    textInput: {
        color: "black",
        borderBottomColor: "black",
        borderBottomWidth: 1,

        width: '94%',
        padding: normalize(10),
        marginBottom: normalize(10),
        fontSize: normalize(20),
    },
    btn: {
        flex: 1,
        height: normalize(40),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    btnText: {
        fontSize: normalize(18),
        color: "white"
    },
    solution: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    solText: {
        fontSize: normalize(18),
    },
    btnText1: {
        fontSize: normalize(16),
        color: "white",
        textAlign: "center"
    },
    btn2: {
        backgroundColor: "#1b6ca8",
        flex: 1,
        height: normalize(50),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    switchBtn: {
        borderColor: "grey",
        borderRadius: normalize(30),
        height: normalize(30),
        width: "52%",
        justifyContent: "center",
        width: "50%",
    }
})
