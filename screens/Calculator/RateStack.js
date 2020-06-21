import { RateScreen } from './Screen'
import ScheduleScreen from './ScheduleScreen'
import { createStackNavigator } from 'react-navigation-stack'
import History from '../History'
const RateStack = createStackNavigator({
    RateScreen: {
        screen: RateScreen,
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
    initialRouteParams: "RateScreen",
})
export default RateStack