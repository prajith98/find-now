import { TenureScreen } from './Screen'
import ScheduleScreen from './ScheduleScreen'
import { createStackNavigator } from 'react-navigation-stack'
import History from '../History'
const TenureStack = createStackNavigator({
    TenureScreen: {
        screen: TenureScreen,
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
    initialRouteParams: "TenureScreen",
})
export default TenureStack