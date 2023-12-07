import { Image, StyleSheet, Text, View } from 'react-native'
const icon = require("../../assets/p.png")
import React from 'react'

const Header = () => {
  return (
    <>
    <View>
      <Image source={icon} style={styles.img}  resizeMode="contain" />
      <Text style={styles.subtitle}>You probably have something to do</Text>
    </View>
    <View>
        
    </View>
    </>

  )
}

export default Header

const styles = StyleSheet.create({
   img: {
    width: 300,
   },
   subtitle:{
    fontSize: 20,
    color:"#ABABAB"
   },
})