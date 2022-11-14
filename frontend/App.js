import { createStackNavigator } from '@react-navigation/stack';
import UserScreen from './screens/UserScreen';
import VanScreen from './screens/VanScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="Home" 
        component={VanScreen}
        options={{
          title: 'Wen Wasel',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 32,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (<Entypo onPress={() => (alert("xx"))} name="menu" size={40} color="white" />)
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

