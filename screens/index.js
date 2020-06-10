import React from 'react'
import CalculatorScreen from './CalculatorScreen'
export const LoanScreen = ({ navigation }) => <CalculatorScreen navigation={navigation} name="Loan Eligibility Calculator" value={0}/>
export const RateScreen = ({ navigation }) => <CalculatorScreen navigation={navigation} name="Interest Rate Calculator" value={1}/>
export const TenureScreen = ({ navigation }) => <CalculatorScreen navigation={navigation} name="Remaining Tenure Calculator" value={2}/>
export const EMIScreen = ({ navigation }) => <CalculatorScreen navigation={navigation} name="EMI Calculator" value={3}/>