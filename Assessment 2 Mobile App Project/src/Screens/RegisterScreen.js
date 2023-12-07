import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
const backImage = require('../../assets/picture3.png');
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from "../../firebase/config";
import { addDoc, collection } from 'firebase/firestore';


const  RegisterScreen = () => {
    const navigation = useNavigation();
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[confirmPassword, setconfirmPassword] = useState('')

    const onHandleRegister = () => {
      if(email !==""&&password !==""&& confirmPassword !==""){
        if (password !== confirmPassword){
          Alert.alert("Password does not match");
        }else{
            createUserWithEmailAndPassword(auth,email,password).then(async(res)=>{
              console.log("Result = ",res);
              await addDoc(collection(db,'Users'),{
                userId:res.user.uid,
                email:res.user.email,
                username:res.user.email.split('@')[0],
              });
            });
          }
        }
      }
  
  return (
    <KeyboardAwareScrollView>
    <View style={styles.container}>
    <View >
        <Image source={backImage} style={styles.backgroundImage}/>    
    </View>
    <View>
      <Text style={styles.text}>Sign up{""}</Text>
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
      <TextInput 
        style={styles.textInput}
        placeholder='Confirm Password'
        secureTextEntry={true}
        autoCorrect={false}
        autoCapitalize="none"
        textContentType='password'
        value={confirmPassword}
        onChangeText={(text)=> setconfirmPassword(text)}
      />
    </View>
    <TouchableOpacity onPress={onHandleRegister} style={styles.touchbleopacity}>
      <Text style={styles.text2}>Login</Text>
    </TouchableOpacity>
    <View style={styles.signup}>
      <Text>If you have already acount ?</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
        <Text style={styles.text3} >Login</Text>
        </TouchableOpacity>
    </View>
    </View>
    </KeyboardAwareScrollView>
  )
}

export default RegisterScreen

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