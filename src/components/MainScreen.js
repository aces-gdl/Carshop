import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ImageBackground,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
  
import {FirebaseRef} from './../../firebase/Firebase';
import {GoogleSignin} from 'react-native-google-signin';
import {CachedImage}  from 'react-native-img-cache';
import renderIf       from './../../src/utils/RenderIf';


export default class MainScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      displayName:'Vacio',
      photoURL:'',
      Telefono:'',
      Contacto:'',
    };
    this.GoogleSignOut = this.GoogleSignOut.bind(this);
  }

  componentDidMount(){
    let user = FirebaseRef.auth().currentUser;
    this.setState({
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
    console.log('User Logged in ' + user.displayName);
  }
  

  GoogleSignOut() {
    console.log('loggin out');
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      console.log('Signed out from Google !!!');
      FirebaseRef.auth().signOut()
      .then (()=>{
        console.log('logged out of firebase')
        this.props.navigation.navigate('Login')
      })
      .catch((error) => {
        console.log('Error login out of firebase ' + error.code)
      })
    })
    .done();
  }

  //TODO:
  // Menu: Autos, Talleres, Perfil
  // Autos --> Servicios
  // Talleres --> Promociones
  render(){
    return(
      <ImageBackground source={require('./../../images/background1.jpg')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle} >
        <View>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text>Bienvenido: {this.state.displayName}</Text>
            {renderIf(this.state.photoURL,
            <CachedImage source={{uri:this.state.photoURL}} resizeMode='cover' style={{ resizeMode:'cover', width:50, height:50, borderRadius:25}} mutable/> 
            )}
          </View>
          <TouchableHighlight 
                onPress={() => this.props.navigation.navigate('CarCenterListing')} 
                style={styles.buttonContainer}>
            <View style={styles.buttonContent}>
              <Text  style={styles.buttonText}>Talleres</Text>
              <Icon style={styles.icon} name="ios-build-outline" color='black' />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
              style={styles.buttonContainer} 
              onPress={() => this.props.navigation.navigate('CarListing')} >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Autos</Text>
                <Icon style={styles.icon} name="ios-car-outline"  color='black' />
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              style={styles.buttonContainer} 
              onPress={() => this.props.navigation.navigate('Settings')} >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Perfil</Text>
                <Icon style={styles.icon} name="ios-man-outline" color='black' />
              </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.buttonContainer} 
            onPress={() => this.GoogleSignOut()} >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Ajustes</Text>
              <Icon style={styles.icon} name="ios-settings-outline" color='black' />
            </View>
          </TouchableHighlight>
      </View>
      </ImageBackground>
    );
  }
}



MainScreen.navigationOptions = {
  title: "Menú Principal"
};

const styles = StyleSheet.create({
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
  buttonContainer:{
    alignSelf:'stretch',
    margin: 20,
    padding: 20,
    backgroundColor:'blue',
    borderWidth:1,
    borderColor:'#fff',
    backgroundColor:'rgba(255,255,255,0.6)'
  },
  buttonText:{
    fontSize:16,
    fontWeight:'bold',
    alignSelf:'center',
  },
  buttonContent:{
    flexDirection:'row', 
    justifyContent:'space-between', 
    padding:1, 
    alignContent:'center'
     },
  icon:{
    marginLeft:4, 
    padding:5,
    alignSelf:'center', 
    fontSize:30}

});