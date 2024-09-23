import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StudentListScreen from './screens/StudentListScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentList">
        <Stack.Screen name="StudentList" component={StudentListScreen} options={{ title: 'Students' }} />
        <Stack.Screen name="StudentProfile" component={StudentProfileScreen} options={{ title: 'Student Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
