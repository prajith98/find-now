
import React from 'react';
import { Image, Dimensions, StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity, Button, Keyboard, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { YellowBox } from 'react-native';
import paisa from 'paisa.js'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Divider, normalize } from 'react-native-elements';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;
export default class CLScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loanA: "",
            rateA: "",
            tenureA: "",
            emiA: "",
            loanB: "",
            rateB: "",
            tenureB: "",
            emiB: "",
            totalIntrestA: "",
            totalIntrestB: "",
            totalA: "",
            totalB: "",
            totalDiff: "",
            dispCalculation: false,
            S: '',
            loading: false,
            loanAInWords: "",
            loanBInWords: "",
        }
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
            existingData = await AsyncStorage.getItem('CLKey');
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
                'CLKey'
                , JSON.stringify(existingData));
        } catch (error) {
            console.log("error saving data")
        }
    };
    loanInputHandlerA = (enterdText) => {
        this.setState({
            loanA: enterdText.replace(/,/g, ""),
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
            loanB: enterdText.replace(/,/g, ""),
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
            rateA: enterdText
        });
    }
    rateInputHandlerB = (enterdText) => {
        this.setState({
            rateB: enterdText,
        });
    }
    tenureInputHandlerA = (enterdText) => {
        this.setState({
            tenureA: enterdText,
        });
    }
    tenureInputHandlerB = (enterdText) => {
        this.setState({
            tenureB: enterdText,
        });
    }
    resetHandler = () => {
        this.setState({
            loanA: "",
            rateA: "",
            tenureA: "",
            loanB: "",
            rateB: "",
            tenureB: "",
            totalDiff: "",
            dispCalculation: false,
            S: '',
            loading: false,
            loanAInWords: "",
            loanBInWords: ""
        })
    }
    compareLoan = async () => {
        Keyboard.dismiss()
        this.setState({ loading: true })
        if (this.state.loanA != '' && this.state.loanB != '' && this.state.rateA != '' && this.state.rateB != '' && this.state.tenureA != '' && this.state.tenureB != '') {
            var rateA = parseFloat(this.state.rateA) / 12 / 100
            var tenureA = parseFloat(this.state.tenureA)
            var loanA = parseFloat(this.state.loanA)
            var rateB = parseFloat(this.state.rateB) / 12 / 100
            var tenureB = parseFloat(this.state.tenureB)
            var loanB = parseFloat(this.state.loanB)
            var EMIA = Math.round((loanA * rateA) / (1 - (Math.pow((1 + rateA), -tenureA))))
            var EMIB = Math.round((loanB * rateB) / (1 - (Math.pow((1 + rateB), -tenureB))))
            var intA = Math.round(((EMIA * tenureA) - loanA))
            var intB = Math.round(((EMIB * tenureB) - loanB))
            var totA = Math.round(EMIA * tenureA)
            var totB = Math.round(EMIB * tenureB)
            this.setState({
                emiA: paisa.formatWithSymbol(EMIA * 100, 0),
                emiB: paisa.formatWithSymbol(EMIB * 100, 0),
                totalIntrestA: paisa.formatWithSymbol(intA * 100, 0),
                totalIntrestB: paisa.formatWithSymbol(intB * 100, 0),
                totalA: paisa.formatWithSymbol(totA * 100, 0),
                totalB: paisa.formatWithSymbol(totB * 100, 0),
                totalDiff: paisa.formatWithSymbol((Math.abs(totA - totB)) * 100, 0),
                S: totA < totB ? 'A' : 'B',
                dispCalculation: true
            }, () => {
                this.setState({ loading: false })
                this._storeData([
                    'Loan A\nLoan B',
                    paisa.formatWithSymbol(Number(this.state.loanA) * 100, 0) + '\n' + paisa.formatWithSymbol(Number(this.state.loanB) * 100, 0),
                    this.state.rateA + '\n' + this.state.rateB,
                    this.state.tenureA + '\n' + this.state.tenureB,
                    paisa.formatWithSymbol(EMIA * 100, 0) + '\n' + paisa.formatWithSymbol(EMIB * 100, 0), 1, 1
                ])
            })
        }
        else {
            Alert.alert("", "Enter all the values to compare Loan")
            this.setState({ loading: false })
        }
    }
    render() {
        return (
            <View style={styles.container} ref={view => { this._container = view; }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        {this.state.dispCalculation ? (
                            <TouchableOpacity style={{ justifyContent: "center", paddingLeft: normalize(10) }} onPress={() => this.setState({ dispCalculation: false })}>
                                <Ionicons name="md-arrow-round-back" size={normalize(30)} color="black" />
                            </TouchableOpacity>
                        )
                            : null
                        }
                        <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-start", padding: normalize(20), flexDirection: "row" }}>
                            <Text style={styles.headerText}>Compare Loan</Text>
                            <Text> </Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "center" }}
                            onPress={() => this.props.navigation.navigate('CLHistory',
                                {
                                    key: 'CLKey',
                                })}>
                            <MaterialCommunityIcons name="history" size={normalize(30)} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: "center", marginRight: normalize(10) }} onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Feather name="x" size={34} color="black" />
                        </TouchableOpacity>
                    </View>
                    {
                        !this.state.loading ? (
                            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' >
                                {
                                    !this.state.dispCalculation ?
                                        (
                                            <View>
                                                <View style={{ alignItems: "center", marginTop: normalize(5) }}>
                                                    <View style={styles.body}>
                                                        <Text style={styles.headTitle}>LOAN A</Text>
                                                        <View style={{ alignItems: "center", height: "30%" }}>
                                                            <View style={styles.combo2}>
                                                                <MaterialCommunityIcons name="sack" size={20} color="#FFA62F" style={{ top: "5%" }} />
                                                                <TextInput placeholder="Loan Amount A" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.loanInputHandlerA} value={this.state.loanA != "" ? (paisa.format(Number(this.state.loanA) * 100, 0)) : ""}></TextInput>
                                                            </View>
                                                            <Text style={{ fontSize: 12, width: "83%", left: normalize(8), bottom: normalize(10), textAlign: "right" }}>{this.state.loanAInWords}</Text>
                                                        </View>
                                                        <View style={{ alignItems: "center", height: "30%" }}>
                                                            <View style={styles.combo2}>
                                                                <Feather name="percent" size={20} color="red" style={{ top: "5%" }} />
                                                                <TextInput placeholder="Interest Rate A" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.rateInputHandlerA} value={this.state.rateA}></TextInput>
                                                                <Text style={{ fontSize: normalize(15), right: normalize(35), padding: normalize(10) }}>p.a</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ alignItems: "center", height: "30%" }}>
                                                            <View style={styles.combo2}>
                                                                <Feather name="clock" size={20} color="red" style={{ top: "5%" }} />
                                                                <TextInput placeholder="Tenure A" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.tenureInputHandlerA} value={this.state.tenureA}></TextInput>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ alignItems: "center", marginTop: normalize(5) }}>
                                                    <View style={styles.body}>
                                                        <Text style={styles.headTitle}>LOAN B</Text>
                                                        <View style={{ alignItems: "center", height: "30%" }}>
                                                            <View style={styles.combo2}>
                                                                <MaterialCommunityIcons name="sack" size={20} color="#FFA62F" style={{ top: "5%" }} />
                                                                <TextInput placeholder="Loan Amount B" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.loanInputHandlerB} value={this.state.loanB != "" ? (paisa.format(Number(this.state.loanB) * 100, 0)) : ""}></TextInput>
                                                            </View>
                                                            <Text style={{ fontSize: 12, width: "83%", left: normalize(8), bottom: normalize(10), textAlign: "right" }}>{this.state.loanBInWords}</Text>
                                                        </View>
                                                        <View style={{ alignItems: "center", height: "30%" }}>
                                                            <View style={styles.combo2}>
                                                                <Feather name="percent" size={20} color="red" style={{ top: "5%" }} />
                                                                <TextInput placeholder="Interest Rate B" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.rateInputHandlerB} value={this.state.rateB}></TextInput>
                                                                <Text style={{ fontSize: normalize(15), right: normalize(35), padding: normalize(10) }}>p.a</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ alignItems: "center", height: "30%" }}>
                                                            <View style={styles.combo2}>
                                                                <Feather name="clock" size={20} color="red" style={{ top: "5%" }} />
                                                                <TextInput placeholder="Tenure B" keyboardType={"numeric"} style={styles.textInput} onChangeText={this.tenureInputHandlerB} value={this.state.tenureB}></TextInput>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", width: '90%', alignItems: "center", justifyContent: "space-around", paddingTop: normalize(15), paddingBottom: normalize(15) }}>
                                                        <View style={{ width: "45%", padding: normalize(10) }}>
                                                            <Button title="Compare" color="#00bcd4" onPress={this.compareLoan}></Button>
                                                        </View>
                                                        <View style={{ width: "45%", padding: normalize(10) }}>
                                                            <Button title="clear" color="#e43f5a" onPress={this.resetHandler} ></Button>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ) :
                                        (
                                            <View style={{ marginTop: normalize(10), width: '100%', alignItems: "center", height: windowHeight - (windowHeight / 7) }}>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={styles.ansComponent}>
                                                        <Text style={{ fontSize: normalize(20), color: "#161924", paddingBottom: normalize(15), fontWeight: "bold", fontFamily: "Roboto" }}>Loan Summary</Text>
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
                                                            <Text style={styles.col2}>{paisa.formatWithSymbol(this.state.loanA * 100, 0)}</Text>
                                                            <Text style={styles.col2}>{paisa.formatWithSymbol(this.state.loanB * 100, 0)}</Text>
                                                        </View>
                                                        <View style={{ padding: normalize(12) }}>
                                                            <Divider />
                                                        </View>
                                                        <View style={styles.ansCombo}>
                                                            <Feather name="percent" size={20} color="red" style={styles.col1} />
                                                            <Text style={styles.col2}>{this.state.rateA} %</Text>
                                                            <Text style={styles.col2}>{this.state.rateB} %</Text>
                                                        </View>
                                                        <View style={{ padding: normalize(12) }}>
                                                            <Divider />
                                                        </View>
                                                        <View style={styles.ansCombo}>
                                                            <Feather name="clock" size={20} color="red" style={styles.col1} />
                                                            <Text style={styles.col2}>{this.state.tenureA} M</Text>
                                                            <Text style={styles.col2}>{this.state.tenureB} M</Text>
                                                        </View>
                                                        <View style={{ padding: normalize(12) }}>
                                                            <Divider />
                                                        </View>
                                                        <View style={styles.ansCombo}>
                                                            <FontAwesome5 name="coins" size={20} color="#FFA62F" style={styles.col1} />
                                                            <Text style={styles.col2}>{this.state.emiA}</Text>
                                                            <Text style={styles.col2}>{this.state.emiB}</Text>
                                                        </View>
                                                        <View style={{ padding: normalize(12) }}>
                                                            <Divider />
                                                        </View>
                                                        <View style={styles.ansCombo}>
                                                            <Image source={require("../../assets/interest.png")} style={[styles.col1, { resizeMode: "contain", width: normalize(20), height: normalize(20) }]} />
                                                            <Text style={styles.col2}>{this.state.totalIntrestA}</Text>
                                                            <Text style={styles.col2}>{this.state.totalIntrestB}</Text>
                                                        </View>
                                                        <View style={{ padding: normalize(12) }}>
                                                            <Divider />
                                                        </View>
                                                        <View style={styles.ansCombo}>
                                                            <MaterialCommunityIcons name="sack-percent" size={23} color="#FFA62F" style={styles.col1} />
                                                            <Text style={styles.col2}>{this.state.totalA}</Text>
                                                            <Text style={styles.col2}>{this.state.totalB}</Text>
                                                        </View>
                                                        <View style={{ padding: normalize(12) }}>
                                                            <Divider />
                                                        </View>
                                                        <View style={[styles.ansCombo, { paddingTop: normalize(10) }]}>
                                                            <Text style={styles.ans}>You save {this.state.totalDiff} on</Text>
                                                            <Text style={[styles.ans, { color: '#52D017' }]}>Loan {this.state.S}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ alignItems: "center", top: normalize(20), }}>
                                                        <View style={{ width: "85%", flexDirection: "row", justifyContent: "center" }}>
                                                            <TouchableOpacity style={styles.btn2}
                                                                onPress={() => this.props.navigation.navigate('ScheduleScreen3',
                                                                    {
                                                                        loanA: this.state.loanA,
                                                                        loanB: this.state.loanB,
                                                                        rateA: this.state.rateA,
                                                                        rateB: this.state.rateB,
                                                                        tenureA: this.state.tenureA,
                                                                        tenureB: this.state.tenureB,
                                                                        emiA: Number(this.state.emiA.replace(/,/g, '').replace('₹', '')),
                                                                        emiB: Number(this.state.emiB.replace(/,/g, '').replace('₹', '')),
                                                                    })}
                                                            >
                                                                <Text style={styles.btnText1}>Repayment{'\n'}Schedule</Text>
                                                            </TouchableOpacity>
                                                            <View style={{ flex: 0.2 }}></View>
                                                            <TouchableOpacity style={styles.btn2} onPress={this._shareResuslts}>
                                                                <Text style={styles.btnText1}>Share with{'\n'}Friends</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                }
                            </KeyboardAwareScrollView>
                        ) : (
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <ActivityIndicator size="large" color="#0000ff" />
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
        backgroundColor: "#f8f3eb"
    },
    body: {
        flex: 1,
        backgroundColor: '#FEFCFF',
        height: normalize(200),
        width: '90%',
        padding: normalize(15),
        borderRadius: normalize(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation: 2,
    },
    text: {
        color: "#440733",
        fontSize: normalize(20),
        fontWeight: "500",
        paddingTop: normalize(20),
        paddingBottom: normalize(10)
    },
    textInput: {
        color: "#440733",
        borderBottomColor: "#440733",
        borderBottomWidth: 1,
        width: '95%',
        padding: normalize(10),
        marginBottom: normalize(10),
        fontSize: normalize(15),
    },
    headerText: {
        color: "#161924",
        fontSize: normalize(24),
        borderBottomWidth: 2,
        borderColor: "#e43f5a"
    },
    combo2: {
        flexDirection: "row",
        width: "85%",
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        width: "100%",
        height: windowHeight / 7,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    combo: {
        flexDirection: "row", justifyContent: "space-between", width: '90%'
    },
    btn: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: '60%',
        marginTop: 35
    },
    btnSize: {
        width: normalize(80)
    },
    headTitle: {
        color: "#440733",
        fontWeight: "bold",
        fontFamily: "Roboto",
        fontSize: normalize(16)
    },
    ansCombo: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    ansComponent: {
        width: normalize(320),
        height: normalize(420),
        backgroundColor: '#FEFCFF',
        padding: normalize(15),
        borderRadius: normalize(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    ans: {
        bottom: normalize(10),
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
        fontSize: normalize(16),
        textAlign: 'center'
    },
    btnText1: {
        fontSize: normalize(14),
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
})
