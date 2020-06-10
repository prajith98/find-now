import React, { Component } from 'react'
import { AsyncStorage, View, TouchableOpacity, Dimensions, Text, Share } from 'react-native'
import { StyleSheet } from 'react-native'
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component'
import normalize from 'react-native-normalize'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
const windowWidth = Dimensions.get('window').width;

export default class History extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Data: [],
            tableHead: ['Loan', 'Interest', 'Tenure', 'EMI', 'Share', 'Delete'],
            tableData: []
        }
    }
    _deleteIndex = async (index) => {
        var Data = this.state.tableData;
        Data.splice(index, 1);
        this.setState({ tableData: Data })
        var changeData = JSON.stringify(Data);
        try {
            await AsyncStorage.setItem(
                this.props.val
                , changeData);
        } catch (error) {
            console.log("error saving data")
        }
    }
    _shareIndex = async (index) => {
        var Data = this.state.tableData;
        try {
            await Share.share({
                message:
                    'Loan : '+Data[index][0]+'\nRate : '+Data[index][1]+'%\nTenure : '+Data[index][2]+" months\nEMI : "+Data[index][3],
            });
        } catch (error) {
            alert(error.message);
        }
    };
    componentDidMount = async () => {
        var Data = []
        try {
            const value = await AsyncStorage.getItem(this.props.val);
            if (value !== null) {
                // We have data!!
                Data.push(JSON.parse(value))
            }
            else {
                console.log("no data")
            }
        } catch (error) {
            console.log(error)
        }
        this.setState({ tableData: Data[0] })
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
            <View styles={styles.container}>
                <ScrollView>
                    <Table>
                        <Row data={state.tableHead} style={styles.head} textStyle={styles.text1} widthArr={[normalize(90), normalize(60), normalize(55), normalize(75), normalize(50), normalize(57)]} />
                        {state.tableData ?
                            state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={[styles.row, !(index % 2) && { backgroundColor: 'white' }]} >
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <Cell key={cellIndex}
                                                data={cellIndex === 5 ? elementDelete(index) : cellIndex === 4 ? elementShare(index) : cellData}
                                                textStyle={styles.text}
                                                width={cellIndex === 0 ? normalize(95) : cellIndex === 1 ? normalize(55) : cellIndex === 2 ? normalize(55) : cellIndex === 3 ? normalize(78) : normalize(55)}
                                            />
                                        ))
                                    }
                                </TableWrapper>
                            ))
                            : <Text></Text>
                        }
                    </Table>

                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        backgroundColor: "#f8f3eb",
    },
    row: { flexDirection: 'row',borderBottomWidth:0.5,borderBottomColor:"white" },
    head: { height: 40, backgroundColor: '#e43f5a' },
    text: { margin: 10, textAlign: "left" },
    text1: { textAlign: 'left', fontFamily: 'Roboto', color: 'white', fontSize: normalize(16), paddingLeft: normalize(10) },
})
