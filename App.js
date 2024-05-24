import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HttpExample from './HttpExample';
import Home from './assets/Home';
import Login from './assets/Login';
import Signup from './assets/Signup';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="HttpExample" component={HttpExample}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
