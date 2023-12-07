import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ButtonAdd = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}style={styles.btn}>
        <Text style={styles.txt}> + New todo</Text>
    </TouchableOpacity>
  )
}

export default ButtonAdd

const styles = StyleSheet.create({
    btn:{
        postion: "absolute",
        height: 25,
        bottom: 50,
        left: 300,
        backgroundColor: "#C2DAFF",
        padingVertical: 45,
        paddingHorizontal: 20,
        borderRadius: 7,
    },
    txt:{
        color:"#2F76E5",
        fontWeight: "bold",
    },
})