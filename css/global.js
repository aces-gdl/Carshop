'use strict'

import {
  StyleSheet,
 } from 'react-native';



module.exports = StyleSheet.create({
    container: {
      flex: 1,
    },
    content:{
      flex:1,
      alignContent:'center',
      justifyContent:'center',
      alignItems:'center',
    },
    backgroundImage:{
      flex:1,
      width: null,
      height: null,
    
    },
    imageStyle:{
      width:750,
      height:750,
    },
    inputContainer:{
      margin:20,
      marginBottom:0,
      padding:20,
      paddingBottom: 10,
      borderWidth:1,
      alignSelf:'stretch',
      borderColor:'#fff',
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    input:{
      fontSize: 16,
      height: 40,
      padding: 5,
      marginBottom: 5,
      backgroundColor:'rgba(255,255,255,1)'
    },
    logo:{
      color:'white',
      fontSize:40,
      fontStyle:'italic',
      fontWeight:'bold',
      textShadowColor:'#252525',
      textShadowOffset:{width:5, height: 5},
      textShadowRadius: 15,
      marginBottom:20,
      backgroundColor: 'rgba(255,255,255,0.1)'
    },
    buttonContainer:{
      alignSelf:'stretch',
      margin: 5,
      padding: 5,
      borderWidth:1,
      borderColor:'#fff',
      backgroundColor:'rgba(255,255,255,0.6)'
    },
    button:{
      alignSelf:'stretch',
      margin: 5,
      padding: 5,
      borderWidth:1,
      borderColor:'#fff',
      backgroundColor:'rgba(255,255,255,0.6)'
    },
    buttonText:{
      color:'black',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center',
    },
});