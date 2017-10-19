import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';


import {FirebaseRef} from './../../firebase/Firebase';

import Icon from 'react-native-vector-icons/Ionicons';
import {CachedImage} from 'react-native-img-cache';
import renderIf from './../../src/utils/RenderIf';

import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

const  styles = require ('./../../css/global');
const storageRef = FirebaseRef.storage();


const Blob = RNFetchBlob.polyfill.Blob;
const fs   = RNFetchBlob.fs;


window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImage = (uri, imageName, mime = 'image/jpg' ) =>{
  return new Promise ((resolve,reject)=> {
    const uploadUri = Platform.OS ==='ios' ? uri.replace ('file://',''): uri;
    let uploadBlob = null;
    const imageRef = FirebaseRef.storage().ref('talleres').child(imageName);
    fs.readFile(uploadUri,'base64')
        .then((data)=> {
          return Blob.build(data,{type:`${mime};Base64`})
          .then((blob)=>{
            uploadBlob = blob;
            return imageRef.put(blob,{contentType: mime})
          })
            .then((url)=> {
              console.log('Image URl ' + url)
              resolve(url);
            })
            .catch((error)=>{
              reject(error)
            })
        })
     
  })
}




export default class Settings extends Component {


  constructor(props){
    super(props);
    this.state = {
      taller:'',
      NombreNegocio:'',
      Direccion: '',
      Contacto: '',
      Telefono:'',
      ImagePath:'',
      ImageURL:'',
      isUpdate:false,
    }
    this.getImage = this.getImage.bind(this);

  }

   
  getImage (image) {
    let imageRef = storageRef.ref(image);
    imageRef.getDownloadURL()
    .then((url) => {
       this.setState({
         ImageURL:url,
       })
       console.log('Image URL:'+ url);
    })
    .catch ((error)=>{
      console.log('Error in getIamge: ' + error)
    })
  }

  componentDidMount(){
    let taller = '';
    
/*
    if (this.props.navigation.state.params.TallerID != 'new_Taller'){
      let TallerID = this.props.navigation.state.params.TallerID;
      return FirebaseRef.database().ref('/Talleres/' + TallerID).once('value')
      .then((snapshot) =>{
          taller = snapshot.val();
          this.setState({
            taller: taller,
            NombreNegocio: taller.NombreNegocio,
            Direccion: taller.Direccion,
            Contacto: taller.Contacto,
            Telefono: taller.Telefono,
            ImagePath: taller.ImagePath,
            isUpdate: true,
          });
          console.log(taller.NombreNegocio);
          this.getImage('talleres/'+ TallerID + '.jpg');
          
      }); 
    } 
*/
  }



  Update(){
    
    const miRegistro ={
      NombreNegocio:this.state.NombreNegocio,
      Direccion:this.state.Direccion,
      Telefono: this.state.Telefono,
      Contacto:this.state.Contacto,
    }

    FirebaseRef.database().ref('/Talleres/' + this.props.navigation.state.params.TallerID).set(miRegistro);
    console.log(miRegistro);
  }


  Delete(){
   FirebaseRef.database().ref('/Talleres/' + this.props.navigation.state.params.TallerID).remove();
  }

  Add(){
    var newPostKey = FirebaseRef.database().ref().child('Talleres').push().key;
    const miRegistro ={
      NombreNegocio:this.state.NombreNegocio,
      Direccion:this.state.Direccion,
      Telefono: this.state.Telefono,
      Contacto:this.state.Contacto,
    }

    var updates = {};
    
    updates['/Talleres/' + newPostKey] = miRegistro;
    console.log(miRegistro);

    return FirebaseRef.database().ref().update(updates)
    .then(()=>{
      this.props.navigation.goBack();
    });
      
  }



  subeImagen(){
    if (this.state.imagePath){
      uploadImage(this.state.imagePath, `miprimerFoto.jpg`)
      .then ((responseData)=>{
        console.log('imagen Arriba', responseData)
      })
      .done()
    }
  }


  shootImage() {
    const options = {
      title:'Seleccciona Imagen',
      storageOptions:{
        skipBackup:true,
        path:'images',
      }
    };
    ImagePicker.launchCamera(options,(response)=> {
      if (response.didCancel){
        console.log('Usuario cancelo la selección de Imagen');
      } else if (response.error) {
        console.log('Error ' + response.error);
      } else if (response.customButton){
        console.log('Usuario cancelo con el boton');
      } else {
        this.setState({
          imageURL:response.uri,
          imagePath:response.uri,
          imageHeight: response.height,
          imageWidth: response.width,
        })

        if (this.state.imagePath){
          uploadImage(this.state.imagePath, this.props.navigation.state.params.TallerID +`.jpg`)
          .then ((responseData)=>{
            console.log('imagen Arriba', responseData)
          })
          .done()
        }
        console.log('H:' + this.state.imageHeight + '  W: ' + this.state.imageWidth + ' URI:' + this.state.imageURL);
      }
    })
  }



  render(){
    return(
      <ImageBackground 
      source={require('./../../images/background1.jpg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle} >
      <View style={[styles.container,{flexDirection:'column'}]}>
          <View style={[styles.container,{justifyContent:'center', alignItems:'center'}]}>
                  {this.state.ImageURL ? 
                        <CachedImage source={{uri:this.state.ImageURL}} resizeMode='cover' style={{ resizeMode:'cover', width:200, height:200}} mutable/> 
                        :
                        <Icon style={{marginLeft:4, padding:10, fontSize:20}} 
                                name="ios-car" 
                                size={120} 
                                color='black' />
                  }
        </View>
        <View style={{height:40}}>
            <TouchableHighlight onPress={this.shootImage.bind(this)}>
              <View style={{flexDirection:'row', alignItems:'center', alignSelf:'flex-end'}}>
                  <Text>Toma Foto</Text>
                  <Icon style={{marginLeft:4, padding:10, fontSize:20}} 
                        name="md-camera" 
                        size={20} 
                        color='black' />
              </View>
            </TouchableHighlight>
        </View>
     </View>
      <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        placeholder={'Nombre del Taller'}
        onChangeText={(NombreNegocio) => this.setState({NombreNegocio})}
        value={this.state.NombreNegocio}
        />
        <TextInput
          style={styles.input}
          placeholder={'Direccion'}
          onChangeText={(Direccion) => this.setState({Direccion})}
          value={this.state.Direccion}
        />
        <TextInput
          style={styles.input}
          placeholder={'Telefono'}
          onChangeText={(Telefono) => this.setState({Telefono})}
          value={this.state.Telefono}
        />
        <TextInput
          style={styles.input}
          placeholder={'Contacto'}
          onChangeText={(Contacto) => this.setState({Contacto})}
          value={this.state.Contacto}
        />
        <View style={[styles.buttonContainer, {flexDirection:'row', justifyContent:'space-between',}]}>
            {renderIf(this.state.isUpdate, 
              <TouchableHighlight style={styles.button} onPress={this.Update.bind(this)} >
                <View >
                  <Icon style={{marginLeft:4, padding:10, fontSize:40}} 
                          name="ios-checkmark" 
                          size={40} 
                          color='black' />
                </View>
              </TouchableHighlight> 
            )}
            {renderIf(this.state.isUpdate, 
              <TouchableHighlight style={styles.button} onPress={this.Delete.bind(this)} >
                <View >
                    <Icon style={{marginLeft:4, padding:10, fontSize:40}} 
                          name="ios-remove" 
                          size={40} 
                          color='black' />
                </View>
              </TouchableHighlight>
            )} 
            {renderIf(!this.state.isUpdate, 
              <TouchableHighlight style={styles.button} onPress={this.Add.bind(this)} >
                <View >
                  <Icon style={{marginLeft:4, padding:10, fontSize:40}} 
                    name="ios-add" 
                    size={40} 
                    color='black'  />
                  </View>
              </TouchableHighlight> 
            )}
            <TouchableHighlight style={styles.button}  onPress={() => this.props.navigation.goBack()} >
              <View >
                <Icon style={{marginLeft:4, padding:10, fontSize:40}} 
                        name="ios-close" 
                        size={40} 
                        color='black' />
              </View>
            </TouchableHighlight> 
        </View>
      </View>
      </ImageBackground>
    );
  }
}


