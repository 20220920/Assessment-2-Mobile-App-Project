import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { auth, userRef } from '../../firebase/config'
import { signOut } from 'firebase/auth'
const userAvatar = require("../../assets/icon.png")

import { useNavigation } from '@react-navigation/native'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { getDocs, query, where } from 'firebase/firestore';
import Header from '../Components/Head'
import TabBottomMenu from '../Components/TabBottomMenu/TabBottomMenu'
import ButtonAdd from '../Components/ButtonAdd/ButtonAdd'
import CardTodo from '../Components/CardTodo'
import { v4 as uuid } from 'uuid';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';

let isFirstRender = true;
let isLoadUpdate = false;


const HomeScreen = () => {
  const navigation = useNavigation();
  const {user, userAvatarUrl,setUserAvatarUrl} = useContext(AuthenticatedUserContext)
  console.log('user avatar url =',userAvatarUrl);
  const [todoList, setTodoList] = useState([]);
  const [selectedTabName, setSelectedTabName] = useState("all");
  const [isAddDialogDisplayed, setIsAddDialogDisplayed] = useState(false);
  const [inputValue, setInputValue] = useState('')
  const scrollViewRef = useRef()

  useLayoutEffect(()=> {
   navigation.setOptions({
    headerRight: () =>(
      <TouchableOpacity onPress={()=>navigation.navigate('profile')}>
       {!userAvatarUrl ? (<Image source={userAvatar} style={styles.avater}/>):(
        <Image source={{uri:userAvatarUrl}} style={styles.avater}/>
       )}
      </TouchableOpacity>
    ),
   });
  },[userAvatarUrl]);

  async function loadTodoList(){
    console.log('LOAD')
    try{
      const todoListString=await AsyncStorage.getItem("@todolist");
      const parsedTodoList = JSON.parse(todoListString)
      isLoadUpdate =true;
      setTodoList(parsedTodoList || []);
     }catch(err){
       alert(err);
     }
  }
  async function saveTodoList(){
    console.log('SAVE')
    try{
     await AsyncStorage.setItem("@todolist", JSON.stringify(todoList))
    }catch(err){
      alert(err);
    }
  }

  useEffect(()=>{
   if(!user) return;
   const queryResult = query(userRef, where('email', '==', user.email))
   async function DocFinder(queryResult) {
    const querySnapshot = await getDocs(queryResult)
    querySnapshot.forEach((doc)=>{
      const {profilepic} = doc.data()
      setUserAvatarUrl(profilepic)
    })
   }
   DocFinder(queryResult)
  },[]);



  useEffect(()=>{
    loadTodoList();
  },[])

  useEffect(()=>{
    if (!isLoadUpdate){
    if(!isFirstRender){
      saveTodoList();
    }else{
    
    isFirstRender = false;
    }
  } else {
    isLoadUpdate = false;
  }
  },[todoList]);

  function getFilteredList(){
    switch (selectedTabName) {
      case "all":
        return todoList;
      case "inProgress":
        return todoList.filter((todo) => !todo.isCompleted);
      case "done":
        return todoList.filter((todo)=> todo.isCompleted);
    }
  }

  function deleteTodo(todoToDelete){
    Alert.alert("Delete todo","Are you sure you want to delete this todo ?",
    [
    {
      text:"Delete",
      style:"destructive",
      onPress:()=> {
     
        setTodoList(todoList.filter(t => t.id !== todoToDelete.id));
      },
    },
    {
      text: "Cancel", style: "cancel"
    },
    ]);
  }

  function renderTodoList() {
    return getFilteredList().map((todo)=>(
      <View key={todo.id}>
       <CardTodo onLongPress={deleteTodo} onPress={updateTodo}todo={todo}/>
      </View>
    ));
  }

  function updateTodo(todo) {
    const updatedTodo = {
     ...todo,
     isCompleted: !todo.isCompleted,
    };
    const upadatedTodoList = [...todoList];
    const indexToUpdate = upadatedTodoList.findIndex(
     (t)=> t.id ==updatedTodo.id
     );
     upadatedTodoList[indexToUpdate] = updatedTodo;
     setTodoList(upadatedTodoList);
 }

 function addTodo() {
  const newTodo = {
    id: uuid.v4(),
    title: inputValue,
    isCompleted: false,
  };
  setTodoList([...todoList, newTodo]);
  setIsAddDialogDisplayed(false);
  setInputValue("");
  setTimeout(()=>{
    scrollViewRef.current.scrollToEnd()
  },300)
}

 function renderAddDialog(){
  return <Dialog.Container visible={isAddDialogDisplayed} 
  onBackdropPress={()=>setIsAddDialogDisplayed(false)} >
  <Dialog.Title>Add todo</Dialog.Title>
  <Dialog.Description>
    Choose a name for your todo
  </Dialog.Description>
  <Dialog.Input onChangeText={setInputValue} placeholder="Ex : Go to the dentist"/>
  <Dialog.Button label="Cancel" color="grey" onPress={()=> setIsAddDialogDisplayed(false)}/>
  <Dialog.Button disabled={inputValue.length===0} label="Save" onPress={addTodo} />
</Dialog.Container>
}
  
  return (
    <>
   <View style={styles.header}>
      <Header />
      </View>
    <View style={styles.body}>
         <ScrollView ref={scrollViewRef}>{renderTodoList()}</ScrollView>
      </View>
      <ButtonAdd onPress={()=>setIsAddDialogDisplayed(true)}/>
    <View style={styles.header}>
      <TabBottomMenu 
      todoList = {todoList}
      onPress = {setSelectedTabName} 
      selectedTabName={selectedTabName}/>
      </View>

      {renderAddDialog()}
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  avater:{
    height:50,
    width:50,
    borderRadius: 9999
  },
  header:{flex:1,},
  body:{flex: 5},
  footer:{flex:1,},
  cardItem:{
    marginBottom: 15,
  }

})