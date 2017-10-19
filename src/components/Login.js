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
    const credential = firebase.auth.GoogleAuthProvider.credential(this.state.user.idToken, this.state.user.accessToken);
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
            </View>  
          </ImageBackground>
       

      </View>
    );
  }
}



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
    padding: 10,
    marginBottom: 10,
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
    textAlign:'center',
  },
  
});

