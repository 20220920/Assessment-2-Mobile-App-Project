import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import checkImg from '../../assets/check.png'

const CardTodo = ({todo,onPress, onLongPress}) => {
  return (
    <TouchableOpacity onLongPress={()=>onLongPress(todo)} 
    style={styles.card} 
    onPress={()=>onPress(todo)}>
     <Text style={[styles.title, todo.isCompleted &&{textDecorationLine: "line-through"}]}>{todo.title}</Text>
     {todo.isCompleted && <Image style={styles.img} source={checkImg}/>}
    </TouchableOpacity>
  )
}

export default CardTodo

const styles = StyleSheet.create({
  card:{
    marginTop:20,
    backgroundColor:'white',
    height: 115,

  shadowColor: "#000",
   shadowOffset: {
	width: 0,
	height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
   borderRadius: 13,
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
   paddingHorizontal: 20,
   },

  title:{
    fontSize: 25,
  },
  img:{
    height: 25,
    width: 25
  },
})