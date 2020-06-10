import ScheduleScreen3 from './ScheduleScreen3'
import CLHistory from './CLHistory'
import { createStackNavigator } from 'react-navigation-stack'
import CLScreen2 from './CLScreen2'
const CompareLoanStack2 = createStackNavigator({
    CLScreen: {
        screen: CLScreen2,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        }),
    },
    ScheduleScreen3: {
        screen: ScheduleScreen3,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
    CLHistory: {
        screen: CLHistory,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
}, {
    initialRouteParams: "CLScreen",
})
export default CompareLoanStack2