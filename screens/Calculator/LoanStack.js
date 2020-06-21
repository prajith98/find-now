import { LoanScreen } from './Screen'
import ScheduleScreen from './ScheduleScreen'
import { createStackNavigator } from 'react-navigation-stack'
import History from '../History'
const LoanStack = createStackNavigator({
    LoanScreen: {
        screen: LoanScreen,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        }),
    },
    History: {
        screen: History,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
    ScheduleScreen: {
        screen: ScheduleScreen,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },

}, {
    initialRouteParams: "LoanScreen",
})
export default LoanStack