import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './src/Screens/RegisterScreen';
import AuthenticatedUserProvider, { AuthenticatedUserContext } from './Context/AuthenticationContext';
import { useContext, useEffect, useState } from 'react';
import HomeScreen from './src/Screens/HomeScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import ProfileScreen from './src/Screens/ProfileScreen';

const loadingGif = require('./assets/record-8329_128.gif')


const Stack = createNativeStackNavigator();

function Rootnavigator(){
  const {user, setUser}=useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoading(false);
      }else{
        setIsLoading(false);
      }
    });
    setIsLoading(false);
  }, []);

  return (
    <NavigationContainer>
     {!user && isLoading === true ?(<Image source={loadingGif}/>): !user&& isLoading === false ? (<AuthStack />):( <MainStack />)}
    </NavigationContainer>
  );
      }
function AuthStack(){
  return(
  
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
 
  )
}

function MainStack(){
  return(
  
      <Stack.Navigator> 
        <Stack.Screen name='profile' component={ProfileScreen}/>
        <Stack.Screen name='2DoApp' component={HomeScreen}/>
      </Stack.Navigator>
   
  )
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <Rootnavigator />
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    color: '#EF4444'
  },
});
