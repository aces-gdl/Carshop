import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
  
import {FirebaseRef} from './../../firebase/Firebase';
import {GoogleSignin} from 'react-native-google-signin';
import {CachedImage}  from 'react-native-img-cache';
import renderIf       from './../../src/utils/RenderIf';

const  styles = require ('./../../css/global');

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
          <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('CarCenterListing')} 
                style={styles.buttonContainer}>
            <View style={styles.buttonContent}>
              <Text  style={styles.buttonText}>Talleres</Text>
              <Icon style={styles.icon} name="ios-build-outline" color='black' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.buttonContainer} 
              onPress={() => this.props.navigation.navigate('CarListing')} >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Autos</Text>
                <Icon style={styles.icon} name="ios-car-outline"  color='black' />
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.buttonContainer} 
              onPress={() => this.props.navigation.navigate('Settings')} >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Perfil</Text>
                <Icon style={styles.icon} name="ios-man-outline" color='black' />
              </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer} 
            onPress={() => this.GoogleSignOut()} >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Ajustes</Text>
              <Icon style={styles.icon} name="ios-settings-outline" color='black' />
            </View>
          </TouchableOpacity>
      </View>
      </ImageBackground>
    );
  }
}



MainScreen.navigationOptions = {
  title: "Menú Principal"
};
