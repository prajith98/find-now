import { EMIScreen } from './Screen'
import ScheduleScreen from './ScheduleScreen'
import { createStackNavigator } from 'react-navigation-stack'
import History from '../History'
const EMIStack = createStackNavigator({
    EMIScreen: {
        screen: EMIScreen,
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
    initialRouteParams: "EMIScreen",
})
export default EMIStack