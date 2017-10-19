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
  ScrollView,
} from 'react-native';


import {FirebaseRef}  from './../../firebase/Firebase';

import Icon           from 'react-native-vector-icons/Ionicons';
import {CachedImage}  from 'react-native-img-cache';
import renderIf       from './../../src/utils/RenderIf';

import ImagePicker    from 'react-native-image-picker';
import RNFetchBlob    from 'react-native-fetch-blob';
import UploadImage    from './../../src/utils/UploadImage';

const  styles = require ('./../../css/global');
const storageRef = FirebaseRef.storage();






export default class CarCenterDetails extends Component {


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
      UploadImage(this.state.imagePath, 'talleres', `miprimerFoto.jpg`)
      .then ((responseData)=>{
        console.log('imagen Arriba', responseData)
      //  this.getImage('talleres/'+ TallerID + '.jpg');
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
          UploadImage(this.state.imagePath, 'talleres', this.props.navigation.state.params.TallerID +`.jpg`)
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
      <ScrollView style={{flex:1}}
              directionalLockEnabled={false}
              horizontal={false} >
      
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
                <View style={{flexDirection:'column', alignItems:'center', alignSelf:'flex-end'}}>
                  <Text>Actualizar</Text>
                  <Icon style={{fontSize:40}} 
                          name="ios-checkmark" 
                          size={40} 
                          color='black' />
                </View>
              </TouchableHighlight> 
            )}
            {renderIf(this.state.isUpdate, 
              <TouchableHighlight style={styles.button} onPress={this.Delete.bind(this)} >
                <View style={{flexDirection:'column', alignItems:'center', alignSelf:'flex-end'}}>
                  <Text>Eliminar</Text>
                    <Icon style={{fontSize:40}} 
                          name="ios-remove" 
                          size={40} 
                          color='black' />
                </View>
              </TouchableHighlight>
            )} 
            {renderIf(!this.state.isUpdate, 
              <TouchableHighlight style={styles.button} onPress={this.Add.bind(this)} >
                <View style={{flexDirection:'column', alignItems:'center', alignSelf:'flex-end'}}>
                  <Text>Agregar</Text>
                  <Icon style={{fontSize:40}} 
                    name="ios-add" 
                    size={40} 
                    color='black'  />
                </View>
              </TouchableHighlight> 
            )}
            <TouchableHighlight style={styles.button}  onPress={() => this.props.navigation.goBack()} >
              <View style={{flexDirection:'column', alignItems:'center', alignSelf:'flex-end'}}>
                <Text>Cancelar</Text>
                <Icon style={{fontSize:40}} 
                        name="ios-close" 
                        size={40} 
                        color='black' />
              </View>
            </TouchableHighlight> 
        </View>
      </View>
      </ScrollView>
      </ImageBackground>
    );
  }
}


