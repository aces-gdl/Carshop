import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';


import {FirebaseRef} from './../../firebase/Firebase';

import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

const  styles = require ('./../../css/global');
const storageRef = FirebaseRef.storage();


const Blob = RNFetchBlob.polyfill.Blob;
const fs   = RNFetchBlob.fs;


window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default uploadImage = (uri, folder, imageName, mime = 'image/jpg' ) =>{
  return new Promise ((resolve,reject)=> {
    const uploadUri = Platform.OS ==='ios' ? uri.replace ('file://',''): uri;
    let uploadBlob = null;
    const imageRef = FirebaseRef.storage().ref(folder).child(imageName);
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


