
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import {FirebaseRef} from './../../firebase/Firebase';

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

 export default  class TomaFoto extends Component {

  constructor (props){
    super(props)
    
    this.state={
      imagePath:'',
      imageHeight:'',
      imageWidth:'',
    };
  }

  selectImage() {
    const options = {
      title:'Seleccciona Imagen',
      storageOptions:{
        skipBackup:true,
        path:'images',
      }
    };
    ImagePicker.showImagePicker(options,(response)=> {
      if (response.didCancel){
        console.log('Usuario cance la selección de Imagen');
      } else if (response.error) {
        console.log('Error ' + response.error);
      } else if (response.customButton){
        console.log('Usuario cancelo con el boton');
      } else {
        this.setState({
          imagePath:response.uri,
          imageHeight: response.height,
          imageWidth: response.width,
        })
        console.log('H:' + this.state.imageHeight + '  W: ' + this.state.imageWidth);
      }
    })
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
          imagePath:response.uri,
          imageHeight: response.height,
          imageWidth: response.width,
        })
        console.log('H:' + this.state.imageHeight + '  W: ' + this.state.imageWidth);
      }
    })
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



  render() {
    return (
      <View style={styles.container}>
        {this.state.imagePath ? <Image source={{uri:this.state.imagePath}} style={{ height:300, width:300}}/> : null}
        <TouchableHighlight onPress={this.selectImage.bind(this)}>
        <Text>Selecciona Foto</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={this.shootImage.bind(this)}>
      <Text>Toma Foto</Text>
    </TouchableHighlight>
  
    <TouchableHighlight onPress={this.subeImagen.bind(this)}>
          <Text>Sube Foto</Text>
        </TouchableHighlight>
      
  </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});



