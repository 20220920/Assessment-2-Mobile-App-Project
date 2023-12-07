import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { auth, db, userRef } from '../../firebase/config'
import { signOut } from 'firebase/auth'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {ref,getStorage, uploadBytes,getDownloadURL} from 'firebase/storage'
const userAvatar = require("../../assets/icon.png")

const ProfileScreen = () => {
  const navigation = useNavigation()
  const storage = getStorage()
  const{user, setUser,setUserAvatarUrl,} =useContext(AuthenticatedUserContext)
  const[username, setUsername] = useState('')
  const[userEmail, setUserEmail] = useState('')
  const [userImageUrl, setUserImageUrl]= useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useLayoutEffect(()=> {
    navigation.setOptions({
     headerRight: () =>(
       <TouchableOpacity onPress={()=>navigation.navigate('2DoApp')}>
        <Image source={userAvatar} style={styles.avater}/>
       </TouchableOpacity>
     ),
    });
   },[]);


  const queryResult = query(userRef, where('email', '==', user.email));

  async function DocFinder(queryResult){
    const querySnapshot = await getDocs(queryResult);
    querySnapshot.forEach((doc) => {
     if(username === ''){
      const{username, email, profilepic} = doc.data()
      setUsername(username);
      setUserEmail(email);
      setUserAvatarUrl(profilepic);
      setUserImageUrl(profilepic);
     }
      
    });
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

 

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

   const uploadImage = async (image)=> {
    try {
      setIsLoading(true);
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = image.substring(image.lastIndexOf("/"));
      const imageRef = ref(storage, `ProfilePictures/${filename}`);
      uploadBytes(imageRef,blob).then(async()=>{
        const downloadUrl = await getDownloadURL(imageRef)
        const querySnapshot = await getDocs(queryResult);
        querySnapshot.forEach(async(document)=>{
          await updateDoc(doc(db,'Users',document.id),{
            profilepic:downloadUrl
          }).then(()=>{
            setUserImageUrl(downloadUrl);
            setUserAvatarUrl(downloadUrl);
            setIsLoading(false);


          })
        })
      })
    } catch (error) {
    Alert.alert(error.message)
    setIsLoading(false)
    }
   };

  useEffect(() => {
    if(!user)return
 
    DocFinder(queryResult);
  },[userImageUrl]);

  const handleSignOut = () =>{
    signOut(auth).then(()=>{
      setUser(null)
      navigation.navigate('Login')
    }).catch((error)=>{
      Alert.alert(error.message)
    })
  }
     return (
    <View>
    <View style={styles.user}>
     <Text style={styles.text}>
      Welcom ,<Text style={styles.text2}>{username}</Text>
     </Text>
    </View>

     <TouchableOpacity 
     onPress={pickImage} 
     style={styles.camera}
     >
     {userImageUrl === undefined?(<Ionicons name="ios-camera" size={50} color="white"/>):isLoading?(<ActivityIndicator size={'large'} color="white"/>):<Image source={{uri:userImageUrl}} style={styles.picture} />}
     </TouchableOpacity>

     <View >
      <Text style={styles.utext}>{username}</Text>
      </View>

     <View >
      <Text style={styles.utext}>{userEmail}</Text>
      </View>

      <View style={styles.signOut2} >
      <TouchableOpacity onPress={()=>navigation.navigate('2DoApp')}>
      <Text style={styles.text3}>Go to ToDo App</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.signOut}>

        <TouchableOpacity onPress={handleSignOut}>
           <Text style={styles.text3}>Sign Out{" "}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default ProfileScreen

const styles = StyleSheet.create({
  user:{
    justifyContent: 'center',
    alignItems: 'center', 
    marginVertical: 5, 
  },
  text:{
    fontSize: 20, 
    fontWeight: '500', 
    letterSpacing: 1, 
  },
  text2:{
    color:'#d60e45',
  },
  camera:{
    borderRadius: 8, 
    backgroundColor: '#ccc', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 10, 
  },
  userName:{
   
  },
  utext:{
    fontSize: 20, 
    color: 'blue',
    letterSpacing: 2, 
    backgroundColor: '#eee', 
    borderRadius: 10, 
    width: 500, 
    paddingVertical: 2, 
    paddingHorizontal: 1, 
    marginLeft: -3, 
    marginRight: -3, 
    marginTop: 40,
  },
  signOut:{
    backgroundColor:'#fac25a',
    marginRight: 20,
    marginLeft: 20,  
    marginTop: 25,
    marginBottom: 3, 
    paddingTop:2,
    borderRadius: 8,
    height: 35,
  },
  text3:{
    color:'white',
    textAlign: 'center', 
    fontWeight: '600', 
    fontSize: 18, 
    
  },
  picture:{
    height: 200,
    width: '100%',
    borderRadius: 8, 
  },
  avater:{
    height:50,
    width:50,
    borderRadius: 9999
  },
  signOut2:{
    backgroundColor:'red',
    marginRight: 20,
    marginLeft: 20,  
    marginTop: 25,
    marginBottom: 3, 
    paddingTop:2,
    borderRadius: 8,
    height: 35,
  },
})