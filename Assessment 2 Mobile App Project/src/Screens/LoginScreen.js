import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from "@react-navigation/native";
const backImage = require('../../assets/picture2.png');
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase/config";

const LoginScreen = () => {
    const navigation = useNavigation();
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    const onHandleLogin = () => {
      if ( email !== "" && password !==''){
        signInWithEmailAndPassword(auth, email, password).then(()=>console.log("Login success")
        );
      }
    }
  
  return (

    <View style={styles.container}>
    <View >
        <Image source={backImage} style={styles.backgroundImage}/>    
    </View>
    <View>
      <Text style={styles.text}>Sign in{""}</Text>
    </View>
    <View>
      <TextInput 
        style={styles.textInput}
        placeholder='Enter Email'
        keyboardType='email-address'
        textContentType='emailAddress'
        value={email}
        onChangeText={(text)=> setEmail(text)}
      />
      <TextInput 
        style={styles.textInput}
        placeholder='Enter Password'
        secureTextEntry={true}
        autoCorrect={false}
        autoCapitalize="none"
        textContentType='password'
        value={password}
        onChangeText={(text)=> setPassword(text)}
      />
    </View>
    <TouchableOpacity onPress={onHandleLogin} style={styles.touchbleopacity}>
      <Text style={styles.text2}>Login</Text>
    </TouchableOpacity>
    <View style={styles.signup}>
      <Text>Don't have an account ?</Text>
      <TouchableOpacity onPress={()=> navigation.navigate("Register")}>
        <Text style={styles.text3}>Sign up</Text>
        </TouchableOpacity>
    </View>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:-100,
    },
    backgroundImage: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      color:"red",
      fontSize: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text2:{
      textAlign: 'center', 
    fontWeight: 'bold', 
    color: 'white', 
    fontSize: 18, 
    },
    text3:{
      color:'red',
      fontWeight:'500',
    },
    textInput:{
      backgroundColor: '#F3F4F6', 
      borderRadius: 8, 
      width: 290, 
      paddingVertical: 2, 
      paddingHorizontal: 1, 
      marginHorizontal: 1,
      marginBottom: 5, 
    },
    touchbleopacity:{
      backgroundColor: '#fac25a', 
      paddingVertical: 8, 
      borderRadius: 8, 
      marginHorizontal: 10, 
      marginTop: 16, 
      marginBottom: 3,
      width:400,
    },
    signup:{
      flexDirection: 'row',
      marginLeft: 8,
      justifyContent: 'center',
    },
})