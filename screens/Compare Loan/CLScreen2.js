import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, TextInput, Keyboard, Button, Image, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import paisa from 'paisa.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
// import { RadioButton } from 'react-native-paper'
import { Divider } from 'react-native-elements';
import RadioForm, { RadioButtonInput, RadioButtonLabel, RadioButton } from 'react-native-simple-radio-button';
import History from '../History';
import ScheduleScreen from '../Calculator/ScheduleScreen';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
export default class CLScreen2 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            LoanA: "",
            RateA: "",
            TenureA: "",
            EMIA: "",
            InterestA: "",
            totalPaymentA: "",
            loanAInWords: "",
            emiAInWords: "",
            calcA: 3,
            radio_propsA: [
                { label: 'Loan', value: 0 },
                { label: 'Rate', value: 1 },
                { label: 'Tenure', value: 2 },
                { label: 'EMI', value: 3 },
            ],
            emiTextInputVisibleA: false,
            rateTextInputVisibleA: true,
            loanTextInputVisibleA: true,
            tenureTextInputVisibleA: true,
            LoanB: "",
            RateB: "",
            TenureB: "",
            EMIB: "",
            InterestB: "",
            totalPaymentB: "",
            loanBInWords: "",
            emiBInWords: "",
            calcB: 3,
            radio_propsB: [
                { label: 'Loan', value: 0 },
                { label: 'Rate', value: 1 },
                { label: 'Tenure', value: 2 },
                { label: 'EMI', value: 3 },
            ],
            emiTextInputVisibleB: false,
            rateTextInputVisibleB: true,
            loanTextInputVisibleB: true,
            tenureTextInputVisibleB: true,
            S: "",
            dispCalculation: false,
            totalDiff: ""
        }
    }
    _shareResuslts = async () => {
        try {
            let result = await captureRef(this._container, {
                format: 'png',
            });
            Sharing.shareAsync(result)
        }
        catch (snapshotError) {
            console.error(snapshotError);
        }
    }
    _storeData = async (values) => {
        var flag = 0;
        var existingData;
        try {
            existingData = await AsyncStorage.getItem('CLKey2');
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
                'CLKey2'
                , JSON.stringify(existingData));
        } catch (error) {
            console.log("error saving data")
        }
    };
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
    loanInputHandlerA = (enterdText) => {
        this.setState({
            LoanA: enterdText.replace(/,/g, ""),
        });
        var inWords = this.convertNumberToWords(Number(enterdText.replace(/,/g, '').replace('₹', '')));
        if (enterdText !== "")
            this.setState({
                loanAInWords: inWords
            })
        else this.setState({ loanAInWords: "" })
    }
    loanInputHandlerB = (enterdText) => {
        this.setState({
            LoanB: enterdText.replace(/,/g, ""),
        });
        var inWords = this.convertNumberToWords(Number(enterdText.replace(/,/g, '').replace('₹', '')));
        if (enterdText !== "")
            this.setState({
                loanBInWords: inWords
            })
        else this.setState({ loanBInWords: "" })
    }

    rateInputHandlerA = (enterdText) => {
        this.setState({
            RateA: enterdText
        });
    }
    rateInputHandlerB = (enterdText) => {
        this.setState({
            RateB: enterdText,
        });
    }
    tenureInputHandlerA = (enterdText) => {
        this.setState({
            TenureA: enterdText,
        });
    }
    tenureInputHandlerB = (enterdText) => {
        this.setState({
            TenureB: enterdText,
        });
    }
    emiInputHandlerA = (enterdText) => {
        this.setState({
            EMIA: enterdText.replace(/,/g, ""),
        });
        var inWords = this.convertNumberToWords(Number(enterdText.replace(/,/g, '').replace('₹', '')));
        if (enterdText !== "")
            this.setState({
                emiAInWords: inWords
            })
        else this.setState({ emiAInWords: "" })
    }
    emiInputHandlerB = (enterdText) => {
        this.setState({
            EMIB: enterdText.replace(/,/g, ""),
        });
        var inWords = this.convertNumberToWords(Number(enterdText.replace(/,/g, '').replace('₹', '')));
        if (enterdText !== "")
            this.setState({
                emiBInWords: inWords
            })
        else this.setState({ emiBInWords: "" })
    }
    radioCallA = (value) => {
        if (value == 3) {
            this.setState({ EMIA: "", emiAInWords: "" })
            this.setState({ emiTextInputVisibleA: false })
            this.setState({ rateTextInputVisibleA: true })
            this.setState({ loanTextInputVisibleA: true })
            this.setState({ tenureTextInputVisibleA: true })
        }
        else if (value == 1) {
            this.setState({ RateA: "" })
            this.setState({ emiTextInputVisibleA: true })
            this.setState({ rateTextInputVisibleA: false })
            this.setState({ loanTextInputVisibleA: true })
            this.setState({ tenureTextInputVisibleA: true })
        }
        else if (value == 0) {
            this.setState({ LoanA: "", loanAInWords: "" })
            this.setState({ emiTextInputVisibleA: true })
            this.setState({ rateTextInputVisibleA: true })
            this.setState({ loanTextInputVisibleA: false })
            this.setState({ tenureTextInputVisibleA: true })
        }
        else if (value == 2) {
            this.setState({ TenureA: "" })
            this.setState({ emiTextInputVisibleA: true })
            this.setState({ rateTextInputVisibleA: true })
            this.setState({ loanTextInputVisibleA: true })
            this.setState({ tenureTextInputVisibleA: false })
        }
        this.setState({ calcA: value })
    }
    radioCallB = (value) => {
        if (value == 3) {
            this.setState({ EMIB: "", emiBInWords: "" })
            this.setState({ emiTextInputVisibleB: false })
            this.setState({ rateTextInputVisibleB: true })
            this.setState({ loanTextInputVisibleB: true })
            this.setState({ tenureTextInputVisibleB: true })
        }
        else if (value == 1) {
            this.setState({ RateB: "" })
            this.setState({ emiTextInputVisibleB: true })
            this.setState({ rateTextInputVisibleB: false })
            this.setState({ loanTextInputVisibleB: true })
            this.setState({ tenureTextInputVisibleB: true })
        }
        else if (value == 0) {
            this.setState({ LoanB: "", loanBInWords: "" })
            this.setState({ emiTextInputVisibleB: true })
            this.setState({ rateTextInputVisibleB: true })
            this.setState({ loanTextInputVisibleB: false })
            this.setState({ tenureTextInputVisibleB: true })
        }
        else if (value == 2) {
            this.setState({ TenureB: "" })
            this.setState({ emiTextInputVisibleB: true })
            this.setState({ rateTextInputVisibleB: true })
            this.setState({ loanTextInputVisibleB: true })
            this.setState({ tenureTextInputVisibleB: false })
        }
        this.setState({ calcB: value })
    }
    calculateEMI = (Loan, Rate, Tenure) => {
        return Math.round((Loan * Rate) / (1 - (Math.pow((1 + Rate), -Tenure))))
    }
    calculateTenure = (EMI, Loan, Rate) => {
        var L = parseFloat(Loan.replace(/,/g, "").replace('₹', ''))
        var R = parseFloat(Rate) / 12 / 100
        var E = parseFloat(EMI.replace(/,/g, "").replace('₹', ''))
        var num = (E) / (E - (L * R))
        var dum = 1 + R;
        var T = (Math.log(num) / Math.log(dum)).toFixed(2).toString()
        return !isNaN(T) ? T : 0
    }
    calculateRate = (EMI, Loan, Tenure) => {
        var L = parseFloat(Loan.replace(/,/g, "").replace('₹', ''))
        var T = parseFloat(Tenure)
        var E = parseFloat(EMI.replace(/,/g, "").replace('₹', ''))
        var R = (this.RATE(T, -E, L, 0, 0, 0.01)).toFixed(2).toString()
        return R < 0 ? 0 : R
    }
    calculateLoan = (EMI, Tenure, Rate) => {
        var R = parseFloat(Rate) / 12 / 100
        var T = parseFloat(Tenure)
        var E = parseFloat(EMI.replace(/,/g, "").replace('₹', ''))
        var L = Math.round((E / R) * (1 - (Math.pow((1 + R), -T)))).toString()
        return L < 0 ? 0 : L
    }
    calculateInterestAndTotalPayment = (loanA, loanB, tenureA, tenureB, EMIA, EMIB) => {
        var intA = Math.round(((EMIA * tenureA) - loanA))
        var intB = Math.round(((EMIB * tenureB) - loanB))
        var totA = Math.round(EMIA * tenureA)
        var totB = Math.round(EMIB * tenureB)
        this.setState({
            InterestA: paisa.formatWithSymbol(intA * 100, 0),
            InterestB: paisa.formatWithSymbol(intB * 100, 0),
            totalPaymentA: paisa.formatWithSymbol(totA * 100, 0),
            totalPaymentB: paisa.formatWithSymbol(totB * 100, 0),
            totalDiff: paisa.formatWithSymbol((Math.abs(totA - totB)) * 100, 0),
            S: totA < totB ? 'A' : 'B',
            dispCalculation: true
        }, () => {
            this.setState({ loading: false })
            this._storeData([
                'Loan A\nLoan B',
                paisa.formatWithSymbol(Number(this.state.LoanA) * 100, 0) + '\n' + paisa.formatWithSymbol(Number(this.state.LoanB) * 100, 0),
                this.state.RateA + '\n' + this.state.RateB,
                this.state.TenureA + '\n' + this.state.TenureB,
                paisa.formatWithSymbol(EMIA * 100, 0) + '\n' + paisa.formatWithSymbol(EMIB * 100, 0), 1, 1
            ])
        })
    }
    compareLoan = async () => {
        Keyboard.dismiss()
        this.setState({ loading: true })
        if (!this.state.emiTextInputVisibleA) {
            var emiA = this.calculateEMI(parseFloat(this.state.LoanA), parseFloat(this.state.RateA) / 12 / 100, parseFloat(this.state.TenureA))
            await this.setState({ EMIA: emiA })
        }
        else if (!this.state.tenureTextInputVisibleA) {
            var tenureA = this.calculateTenure(this.state.EMIA, this.state.LoanA, this.state.RateA)
            await this.setState({ TenureA: tenureA })
        }
        else if (!this.state.rateTextInputVisibleA) {
            var rateA = this.calculateRate(this.state.EMIA, this.state.LoanA, this.state.TenureA)
            await this.setState({ RateA: rateA })
        }
        else if (!this.state.loanTextInputVisibleA) {
            var loanA = this.calculateLoan(this.state.EMIA, this.state.TenureA, this.state.RateA)
            await this.setState({ LoanA: loanA })
        }

        if (!this.state.emiTextInputVisibleB) {
            var emiB = this.calculateEMI(parseFloat(this.state.LoanB), parseFloat(this.state.RateB) / 12 / 100, parseFloat(this.state.TenureB))
            await this.setState({ EMIB: emiB })
        }
        else if (!this.state.tenureTextInputVisibleB) {
            var tenureB = this.calculateTenure(this.state.EMIB, this.state.LoanB, this.state.RateB)
            await this.setState({ TenureB: tenureB })
        }
        else if (!this.state.rateTextInputVisibleB) {
            var rateB = this.calculateRate(this.state.EMIB, this.state.LoanB, this.state.TenureB)
            await this.setState({ RateB: rateB })
        }
        else if (!this.state.loanTextInputVisibleB) {
            var loanB = this.calculateLoan(this.state.EMIB, this.state.TenureB, this.state.RateB)
            await this.setState({ LoanB: loanB })
        }
        if (this.state.LoanA != '' && this.state.LoanB != '' && this.state.RateA != '' && this.state.RateB != '' && this.state.TenureA != '' && this.state.TenureB != '' && this.state.EMIA != "" && this.state.EMIB != "")
            this.calculateInterestAndTotalPayment(this.state.LoanA, this.state.LoanB, this.state.TenureA, this.state.TenureB, this.state.EMIA, this.state.EMIB)
        else
            Alert.alert("","Enter all values!");
    }
    resetHandler = () => {
        this.setState({
            LoanA: "",
            RateA: "",
            TenureA: "",
            EMIA: "",
            InterestA: "",
            totalPaymentA: "",
            loanAInWords: "",
            emiAInWords: "",
            calcA: 3,
            radio_propsA: [
                { label: 'Loan', value: 0 },
                { label: 'Rate', value: 1 },
                { label: 'Tenure', value: 2 },
                { label: 'EMI', value: 3 },
            ],
            emiTextInputVisibleA: false,
            rateTextInputVisibleA: true,
            loanTextInputVisibleA: true,
            tenureTextInputVisibleA: true,
            LoanB: "",
            RateB: "",
            TenureB: "",
            EMIB: "",
            InterestB: "",
            totalPaymentB: "",
            loanBInWords: "",
            emiBInWords: "",
            calcB: 3,
            radio_propsB: [
                { label: 'Loan', value: 0 },
                { label: 'Rate', value: 1 },
                { label: 'Tenure', value: 2 },
                { label: 'EMI', value: 3 },
            ],
            emiTextInputVisibleB: false,
            rateTextInputVisibleB: true,
            loanTextInputVisibleB: true,
            tenureTextInputVisibleB: true,
            S: "",
            totalDiff: "",
            dispCalculation: false
        })
    }
    closeHandler = () => {
        this.resetHandler();
        this.props.navigation.navigate('HomeScreen')
    }
    render() {
        return (
            <View style={styles.container} ref={view => { this._container = view; }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ alignItems: "center", justifyContent: "flex-end", height: windowHeight / 9 }}>
                        <View style={styles.header}>
                            {this.state.dispCalculation ? (
                                <TouchableOpacity style={{ justifyContent: "center", width: normalize(40) }} onPress={() => this.setState({ dispCalculation: false })}>
                                    <Ionicons name="md-arrow-round-back" size={normalize(30)} color="black" />
                                </TouchableOpacity>
                            )
                                : null
                            }
                            <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                                <Text style={styles.headerText}>Compare Loan (Pro Mode)</Text>
                            </View>
                            <TouchableOpacity style={{ justifyContent: "center" }}
                                onPress={() => this.props.navigation.navigate('CLHistory',
                                    {
                                        key: 'CLKey2',
                                    })}>
                                <MaterialCommunityIcons name="history" size={normalize(30)} color="black" />
                            </TouchableOpacity><TouchableOpacity style={{ justifyContent: "center" }} onPress={this.closeHandler}>
                                <Feather name="x" size={normalize(30)} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        !this.state.dispCalculation ? (
                            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ height: (windowHeight - (windowHeight / 9)) }}>

                                <View style={styles.body}>
                                    <View style={{ width: "95%" }}>
                                        <Text style={{ fontSize: normalize(20), fontWeight: "bold", fontFamily: "Roboto" }}> Loan A : </Text>
                                        <View style={styles.radioCategory}>
                                            <RadioForm
                                                buttonSize={10}
                                                initial={this.state.calcA}
                                                formHorizontal={true}
                                            >
                                                {
                                                    this.state.radio_propsA.map((obj, i) => (
                                                        <RadioButton labelHorizontal={true} key={i} >
                                                            <RadioButtonInput
                                                                obj={obj}
                                                                index={i}
                                                                isSelected={this.state.calcA === i}
                                                                onPress={val => this.radioCallA(val)}
                                                                borderWidth={1}
                                                                buttonInnerColor={'#e74c3c'}
                                                                buttonOuterColor={this.state.calcA === i ? '#2196f3' : '#000'}
                                                                buttonSize={10}
                                                                buttonOuterSize={16}
                                                                buttonStyle={{}}
                                                                buttonWrapStyle={{ marginLeft: 10, paddingTop: 2 }}
                                                            />
                                                            <RadioButtonLabel
                                                                obj={obj}
                                                                index={i}
                                                                onPress={val => this.radioCallA(val)}
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
                                    <View style={{ width: '90%', alignItems: "center", justifyContent: "center", height: normalize(170) }}>
                                        {
                                            this.state.loanTextInputVisibleA ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <MaterialCommunityIcons name="sack" size={22} color="#FFA62F" style={{ top: "3%" }} />
                                                            <TextInput placeholder="Loan Amount A" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.loanInputHandlerA} value={this.state.LoanA != "" ? (paisa.format(Number(this.state.LoanA) * 100, 0)) : ""} ></TextInput>
                                                        </View>
                                                    </View>
                                                    <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "27%", left: "13%", paddingTop: 3, width: "81%" }}>{this.state.loanAInWords}</Text>
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.rateTextInputVisibleA ? (

                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <Feather name="percent" size={20} color="red" style={{ top: "3%" }} />
                                                            <TextInput placeholder="Interest Rate A" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.rateInputHandlerA} value={this.state.RateA}></TextInput>
                                                            <Text style={{ fontSize: normalize(20), right: "55%", top: "2%" }}>p.a</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.tenureTextInputVisibleA ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <Feather name="clock" size={20} color="red" style={{ top: "3%" }} />
                                                            <TextInput placeholder="Tenure A" keyboardType={"numeric"} style={styles.textInput1} onChangeText={this.tenureInputHandlerA} value={this.state.TenureA} ></TextInput>
                                                            <FontAwesome name="arrows-h" size={20} color="black" style={{ top: "5%" }} />
                                                            <TextInput style={styles.textInput1} value={this.state.TenureA != "" ? (Number(this.state.TenureA) / 12).toFixed(2) : ""} editable={false}></TextInput>
                                                        </View>
                                                    </View>
                                                    {
                                                        this.state.TenureA != "" ? <Text style={{ width: '18%', bottom: '85%', left: '34%', fontSize: normalize(16) }}>Months</Text>
                                                            : null
                                                    }
                                                    {
                                                        this.state.TenureA != "" ? <Text style={{ width: '15%', bottom: '130%', left: '81%', fontSize: normalize(16) }}>Years</Text>
                                                            : null
                                                    }
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.emiTextInputVisibleA ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <FontAwesome5 name="coins" size={20} color="#FFA62F" style={{ top: "3%" }} />
                                                            <TextInput placeholder="EMI A" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.emiInputHandlerA} value={this.state.EMIA != "" ? (paisa.format(Number(this.state.EMIA) * 100, 0)) : ""} ></TextInput>
                                                        </View>
                                                    </View>
                                                    <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "27%", left: "13%", paddingTop: 3, width: "81%" }}>{this.state.emiAInWords}</Text>
                                                </View>
                                            ) : null
                                        }

                                    </View>
                                </View>
                                <View style={styles.body1}>
                                    <View style={{ width: "95%" }}>
                                        <Text style={{ fontSize: normalize(20), fontWeight: "bold", fontFamily: "Roboto" }}> Loan B : </Text>
                                        <View style={styles.radioCategory}>
                                            <RadioForm
                                                buttonSize={10}
                                                initial={this.state.calcB}
                                                formHorizontal={true}
                                            >
                                                {
                                                    this.state.radio_propsB.map((obj, i) => (
                                                        <RadioButton labelHorizontal={true} key={i} >
                                                            <RadioButtonInput
                                                                obj={obj}
                                                                index={i}
                                                                isSelected={this.state.calcB === i}
                                                                onPress={val => this.radioCallB(val)}
                                                                borderWidth={1}
                                                                buttonInnerColor={'#e74c3c'}
                                                                buttonOuterColor={this.state.calcB === i ? '#2196f3' : '#000'}
                                                                buttonSize={10}
                                                                buttonOuterSize={16}
                                                                buttonStyle={{}}
                                                                buttonWrapStyle={{ marginLeft: 10, paddingTop: 2 }}
                                                            />
                                                            <RadioButtonLabel
                                                                obj={obj}
                                                                index={i}
                                                                onPress={val => this.radioCallB(val)}
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
                                    <View style={{ width: '90%', alignItems: "center", justifyContent: "center", height: normalize(170) }}>
                                        {
                                            this.state.loanTextInputVisibleB ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <MaterialCommunityIcons name="sack" size={22} color="#FFA62F" style={{ top: "3%" }} />
                                                            <TextInput placeholder="Loan Amount B" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.loanInputHandlerB} value={this.state.LoanB != "" ? (paisa.format(Number(this.state.LoanB) * 100, 0)) : ""} ></TextInput>
                                                        </View>
                                                    </View>
                                                    <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "27%", left: "13%", paddingTop: 3, width: "81%" }}>{this.state.loanBInWords}</Text>
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.rateTextInputVisibleB ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <Feather name="percent" size={20} color="red" style={{ top: "3%" }} />
                                                            <TextInput placeholder="Interest Rate B" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.rateInputHandlerB} value={this.state.RateB}></TextInput>
                                                            <Text style={{ fontSize: normalize(20), right: "55%", top: "2%" }}>p.a</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.tenureTextInputVisibleB ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <Feather name="clock" size={20} color="red" style={{ top: "3%" }} />
                                                            <TextInput placeholder="Tenure B" keyboardType={"numeric"} style={styles.textInput1} onChangeText={this.tenureInputHandlerB} value={this.state.TenureB} ></TextInput>
                                                            <FontAwesome name="arrows-h" size={20} color="black" style={{ top: "5%" }} />
                                                            <TextInput style={styles.textInput1} value={this.state.TenureB != "" ? (Number(this.state.TenureB) / 12).toFixed(2) : ""} editable={false}></TextInput>
                                                        </View>
                                                    </View>
                                                    {
                                                        this.state.TenureB != "" ? <Text style={{ width: '18%', bottom: '85%', left: '34%', fontSize: normalize(16) }}>Months</Text>
                                                            : null
                                                    }
                                                    {
                                                        this.state.TenureB != "" ? <Text style={{ width: '15%', bottom: '130%', left: '81%', fontSize: normalize(16) }}>Years</Text>
                                                            : null
                                                    }
                                                </View>
                                            ) : null
                                        }
                                        {
                                            this.state.emiTextInputVisibleB ? (
                                                <View style={{ width: '100%', height: "24%" }}>
                                                    <View style={{ alignItems: "center" }}>
                                                        <View style={styles.combo2}>
                                                            <FontAwesome5 name="coins" size={20} color="#FFA62F" style={{ top: "3%" }} />
                                                            <TextInput placeholder="EMI B" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.emiInputHandlerB} value={this.state.EMIB != "" ? (paisa.format(Number(this.state.EMIB) * 100, 0)) : ""} ></TextInput>
                                                        </View>
                                                    </View>
                                                    <Text style={{ fontSize: normalize(11), textAlign: "right", bottom: "27%", left: "13%", paddingTop: 3, width: "81%" }}>{this.state.emiBInWords}</Text>
                                                </View>
                                            ) : null
                                        }

                                    </View>

                                    <View style={{ flexDirection: "row", width: '80%', alignItems: "center", justifyContent: "space-around" }}>
                                        <View style={{ width: "45%", padding: 10, }}>
                                            <Button title="Reset" color="#e43f5a" onPress={this.resetHandler}></Button>
                                        </View>
                                        <View style={{ width: "45%", padding: 10, }}>
                                            <Button title="Compare" color="#00bcd4" onPress={this.compareLoan}></Button>
                                        </View>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        ) : (
                                <View style={{ alignItems: "center", marginTop: "12%" }}>
                                    <View style={styles.ansComponent}>
                                        <Text style={{ fontSize: normalize(20, windowHeight), color: "#161924", paddingBottom: normalize(15), fontWeight: "bold", fontFamily: "Roboto" }}>Loan Summary</Text>
                                        <View style={styles.ansCombo}>
                                            <Text style={styles.col1}> </Text>
                                            <Text style={[styles.col2, { fontFamily: 'Roboto', fontWeight: 'bold' }]}>Loan A</Text>
                                            <Text style={[styles.col2, { fontFamily: 'Roboto', fontWeight: 'bold' }]}>Loan B</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={styles.ansCombo}>
                                            <MaterialCommunityIcons name="sack" size={23} color="#FFA62F" style={styles.col1} />
                                            <Text style={styles.col2}>{paisa.formatWithSymbol(this.state.LoanA * 100, 0)}</Text>
                                            <Text style={styles.col2}>{paisa.formatWithSymbol(this.state.LoanB * 100, 0)}</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={styles.ansCombo}>
                                            <Feather name="percent" size={20} color="red" style={styles.col1} />
                                            <Text style={styles.col2}>{this.state.RateA} %</Text>
                                            <Text style={styles.col2}>{this.state.RateB} %</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={styles.ansCombo}>
                                            <Feather name="clock" size={20} color="red" style={styles.col1} />
                                            <Text style={styles.col2}>{this.state.TenureA} M</Text>
                                            <Text style={styles.col2}>{this.state.TenureB} M</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={styles.ansCombo}>
                                            <FontAwesome5 name="coins" size={20} color="#FFA62F" style={styles.col1} />
                                            <Text style={styles.col2}>{paisa.formatWithSymbol(this.state.EMIA * 100, 0)}</Text>
                                            <Text style={styles.col2}>{paisa.formatWithSymbol(this.state.EMIB * 100, 0)}</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={styles.ansCombo}>
                                            <Image source={require("../../assets/interest.png")} style={[styles.col1, { resizeMode: "contain", width: normalize(20), height: normalize(20) }]} />
                                            <Text style={styles.col2}>{this.state.InterestA}</Text>
                                            <Text style={styles.col2}>{this.state.InterestB}</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={styles.ansCombo}>
                                            <MaterialCommunityIcons name="sack-percent" size={23} color="#FFA62F" style={styles.col1} />
                                            <Text style={styles.col2}>{this.state.totalPaymentA}</Text>
                                            <Text style={styles.col2}>{this.state.totalPaymentB}</Text>
                                        </View>
                                        <View style={{ padding: normalize(12) }}>
                                            <Divider />
                                        </View>
                                        <View style={[styles.ansCombo, { paddingTop: normalize(10) }]}>
                                            <Text style={styles.ans}>You save {this.state.totalDiff} on</Text>
                                            <Text style={[styles.ans, { color: '#52D017' }]}>Loan {this.state.S}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: "center", width: "100%", top: normalize(20), marginBottom: normalize(20) }}>
                                        <View style={{ width: "85%", flexDirection: "row", justifyContent: "center" }}>
                                            <TouchableOpacity style={styles.btn2}
                                                onPress={() => this.props.navigation.navigate('ScheduleScreen3',
                                                    {
                                                        loanA: this.state.LoanA,
                                                        loanB: this.state.LoanB,
                                                        rateA: this.state.RateA,
                                                        rateB: this.state.RateB,
                                                        tenureA: this.state.TenureA,
                                                        tenureB: this.state.TenureB,
                                                        emiA: this.state.EMIA,
                                                        emiB: this.state.EMIB,
                                                    })}
                                            >
                                                <Text style={styles.btnText1}>Repayment Schedule</Text>
                                            </TouchableOpacity>
                                            <View style={{ flex: 0.2 }}></View>
                                            <TouchableOpacity style={styles.btn2} onPress={this._shareResuslts}>
                                                <Text style={styles.btnText1}>Share with Friends</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
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
    },
    headerText: {
        fontSize: normalize(22),
        borderBottomWidth: 2,
        borderBottomColor: "#e43f5a",
    },
    body: {
        top: normalize(15),
        alignItems: "center",
        justifyContent: "flex-start",
    },

    body1: {
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
        padding: 10,
        marginBottom: 10,
        fontSize: normalize(20),
    },
    textInput1: {
        color: "black",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        width: '44%',
        padding: 10,
        marginBottom: 10,
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
        backgroundColor: "#6e5773",
        flex: 1,
        height: normalize(50),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    ansCombo: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    ansComponent: {
        width: normalize(320),
        backgroundColor: '#FEFCFF',
        padding: normalize(15),
        paddingTop: normalize(20),
        paddingBottom: normalize(20),
        borderRadius: normalize(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    ans: {
        fontSize: normalize(16),
        color: "#161924",
    },
    col1: {
        flex: 0.5,
        textAlign: "center",
        textAlignVertical: "center",
        alignItems: "center"
    },
    col2: {
        flex: 1,
        fontSize: normalize(18),
        textAlign: 'center'
    },

})
