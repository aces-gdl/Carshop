/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

import {FirebaseRef} from './../../firebase/Firebase';
import * as firebase from 'firebase';
import RenderIf from './../utils/RenderIf';

const  styles = require ('./../../css/global');

export default class Login extends Component {

  constructor(props){
    super(props);
    this.state={
      email:'juan.navarro68@gmail.com',
      password:'jjna100268',
      loginInProgress:false,
    };
    this.GoogleSignIn = this.GoogleSignIn.bind(this);

    this.setupGoogleSignin();
  }


  async setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: '674158416989-o4mu45k5rumpf16ugbbpt74u04andr96.apps.googleusercontent.com',
        // webClientId: '674158416989-o4mu45k5rumpf16ugbbpt74u04andr96.apps.googleusercontent.com',
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log('Logged user : ' + user.email);
      this.setState({user});
      this.FirebaseSignin();
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  GoogleSignIn() {
    if (this.state.loginInProgress){
      return;
    }

    this.setState({
      loginInProgress: true,
    });
    GoogleSignin.signIn()
    .then((user) => {
      console.log('Google Login: ' +user.email);
      this.setState({user: user});
      this.FirebaseSignin();
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  FirebaseSignin(){
    const credential = firebase.auth.GoogleAuthProvider
                          .credential(this.state.user.idToken, this.state.user.accessToken);
    FirebaseRef.auth().signInWithCredential(credential)
    .then((data) => {
      try{
        console.log('Firebase Login : ' + data.email)
        this.setState({
          loginInProgress: false,
        });
        this.props.navigation.navigate('MainScreen')
      }catch(error){
          console.log('Error during navigate : ' + error)
      }
    })
    .catch((error)=>{
     console.log('Error' + error);
      alert('Login Failed');
    })  

  }

      

  static navigationOptions = {
    headerMode: 'screen'
  }

  render() {
    return (
      <View style={styles.container}>
          <ImageBackground source={require('./../../images/mecanicoportada1.jpg')}
                style={styles.backgroundImage}
                imageStyle={styles.imageStyle}>
              <View style={styles.content}>
                  <Text style={styles.logo}>Car Shop Buddy</Text>
                  <GoogleSigninButton
                  style={{width: 48, height: 48}}
                  size={GoogleSigninButton.Size.Icon}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={this.GoogleSignIn}/>
                  {RenderIf(this.state.loginInProgress,
                    <Text>Loggin ...</Text>
                  )}
            </View>  
          </ImageBackground>
       

      </View>
    );
  }
}

