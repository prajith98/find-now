import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
export default function LoanProfile(props) {
    const [expand, expandState] = useState(false)
    const [id, setID] = useState(-1)
    const expandStateHandler = (index) => {
        if (expand)
            expandState(false)
        else
            expandState(true)
        setID(index)
    }
    const getIconImage = (loanType) => {
        switch (loanType) {
            case "Home Loan":
            case "Loan Against Property":
            case "Lease Rent Discounting":
                return require('../assets/homeLoan.png');
            case "Car Loan":
                return require('../assets/carLoan.png');
            case "Education Loan":
                return require('../assets/eduLoan.png');
            case "Topup Loan":
                return require('../assets/topupLoan.png');
            case "Business Term Loan":
                return require('../assets/businessLoan.png');
            case "Commercial Property Loan":
                return require('../assets/comLoan.png');
            case "others":
                return require('../assets/othersLoan.png');
            default:
                return require('../assets/othersLoan.png');
        }
    }
    const profiles = props.profiles.map((obj, index) =>
        <View style={{ padding: 5, alignItems: "center" }} key={index}>
            <View style={styles.profile}>
                <TouchableOpacity style={{ flexDirection: "row", justifyContent: "flex-start", }} onPress={() => expandStateHandler(index)} >
                    <View style={{ padding: 20 }}>
                        <Image source={getIconImage(obj.loanType)} style={{ width: 60, height: 60 }} />
                    </View>
                    <View style={{ flexDirection: "column", padding: 5 }}>
                        <Text style={styles.title}>{obj.loanName}</Text>
                        <Text style={styles.subtext}>EMI: {obj.EMI}</Text>
                        <Text style={styles.subtext}>Loan Amount: {obj.amount}</Text>
                        {expand && id === index ? (
                            <View >
                                <Text style={styles.subtext}>Loan Type: {obj.loanType}</Text>
                                <Text style={styles.subtext}>Bank Name: {obj.bankName}</Text>
                                <Text style={styles.subtext}>Interest Rate : {obj.rate}%</Text>
                                <Text style={styles.subtext}>Tenure(Months): {obj.tenure}</Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
    return (

        <View style={styles.container}>
            {profiles}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile: {
        padding: 15,
        width: "95%",
        borderRadius: 20,
        backgroundColor: "white",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#440733"
    },
    subtext: {
        fontSize: 18,
        color: "#440733"
    }
})
