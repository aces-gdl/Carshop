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
  Alert,
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






export default class CarDetails extends Component {

  constructor(props){
    super(props);

    let user = FirebaseRef.auth().currentUser;
    
    this.state = {
      Alias:'',
      Maker:'',
      Model:'',
      Year:'',
      Color:'',
      Mileage:'',
      ImagePath:'',
      ImageURL:'',
      isUpdate:false,
      user:user,
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
    let Auto = '';
    

    if (this.props.navigation.state.params.AutoID != 'new_Auto'){
      let AutoID = this.props.navigation.state.params.AutoID;
      return FirebaseRef.database().ref('/Autos/' + AutoID).once('value')
      .then((snapshot) =>{
          Auto = snapshot.val();
          this.setState({
            Auto:   Auto,
            Alias:  Auto.Alias,
            Maker:  Auto.Maker,
            Model:  Auto.Model,
            Year:   Auto.Year,
            Color:  Auto.Color,
            Mileage: Auto.Mileage,
            ImageURL: Auto.ImageURL,
            isUpdate: true,
          });
          console.log(Auto.Alias);
          this.getImage('autos/'+AutoID + '.jpg');
          
      }); 
    } 
  }



  Update(){
    const miRegistro ={
      Alias:    this.state.Alias,
      Maker:    this.state.Maker,
      Model:    this.state.Model,
      Year:     this.state.Year,
      Color:    this.state.Color,
      Mileage:  this.state.Mileage,
      useruid:  this.state.user.uid,
      ImageURL: this.state.ImageURL,
    }

    FirebaseRef.database().ref('/Autos/' + this.props.navigation.state.params.AutoID).set(miRegistro)
    .then(()=>{
      console.log(miRegistro);
      this.props.navigation.navigate('CarListing');
  
    });
  }


  Delete(){
   FirebaseRef.database().ref('/Autos/' + this.props.navigation.state.params.AutoID).remove();
  }

  Add(){
    var newPostKey = FirebaseRef.database().ref().child('Autos').push().key;
    const miRegistro ={
      Alias:    this.state.Alias,
      Maker:    this.state.Maker,
      Model:    this.state.Model,
      Year:     this.state.Year,
      Color:    this.state.Color,
      Mileage:  this.state.Mileage,
      useruid:  this.state.user.uid,
      ImageURL: this.state.ImageURL,
    }

    var updates = {};
    
    updates['/Autos/' + newPostKey] = miRegistro;
    console.log(miRegistro);

    return FirebaseRef.database().ref().update(updates)
    .then(()=>{
      this.props.navigation.navigate('CarListing');
    });
      
  }



  subeImagen(){
    if (this.state.imagePath){
      UploadImage(this.state.imagePath, 'autos', `miprimerFoto.jpg`)
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
          UploadImage(this.state.imagePath, 'autos', this.props.navigation.state.params.AutoID +`.jpg`)
          .then ((responseData)=>{
            console.log('imagen Arriba', responseData)
            this.setState({
                ImageURL: responseData.downloadURL,
            })
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
      <View style={[styles.container,{flexDirection:'column',borderWidth:2}]}>
      <View style={[styles.container,{flexDirection:'column'}]}>
          <View style={[styles.container,{justifyContent:'center', alignItems:'center', }]}>
                  {this.state.ImageURL ? 
                        <CachedImage source={{uri:this.state.ImageURL}} resizeMode='cover' style={{ resizeMode:'cover', width:200, height:200}} mutable/> 
                        :
                        <Icon style={{marginLeft:4, padding:10, fontSize:120}} 
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
        placeholder={'Alias del Auto'}
        onChangeText={(Alias) => this.setState({Alias})}
        value={this.state.Alias}
        />
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <TextInput
              style={[styles.input, {width:150}]}
              placeholder={'Fabricante'}
              onChangeText={(Maker) => this.setState({Maker})}
              value={this.state.Maker}
            />
            <TextInput
            style={[styles.input, {width:150}]}
            placeholder={'Modelo'}
              onChangeText={(Model) => this.setState({Model})}
              value={this.state.Model}
              />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TextInput
              style={[styles.input, {width:150}]}
              placeholder={'Año'}
              onChangeText={(Year) => this.setState({Year})}
              value={this.state.Year}
              />
              <TextInput
              style={[styles.input, {width:150}]}
              placeholder={'Color'}
              onChangeText={(Color) => this.setState({Color})}
              value={this.state.Color}
              />
          </View>
          <TextInput
            style={styles.input}
            placeholder={'Kilometraje'}
            onChangeText={(Mileage) => this.setState({Mileage})}
            value={this.state.Mileage}
          />
          {renderIf(this.state.isUpdate,
          <View style={[styles.buttonContainer, {flexDirection:'row', justifyContent:'space-between',}]}>
            <TouchableHighlight style={styles.button} onPress={()=> Alert.alert('Servicios')} >
              <View style={{alignItems:'center'}}>
                <Text>Servicios</Text>
                <Icon style={{fontSize:40}} 
                        name="ios-folder-open-outline" 
                        size={40} 
                        color='black' />
              </View>
            </TouchableHighlight> 
            <TouchableHighlight style={styles.button} onPress={() => Alert.alert('Notificaciones')} >
              <View style={{alignItems:'center'}}>
                <Text>Notificaciones</Text>
                <Icon style={{fontSize:40}} 
                        name="ios-pulse-outline" 
                        size={40} 
                        color='black' />
              </View>
            </TouchableHighlight> 
          </View>
          )}
          <View style={[styles.buttonContainer, {flexDirection:'row', justifyContent:'space-between',}]}>
              {renderIf(this.state.isUpdate, 
                <TouchableHighlight style={styles.button} onPress={this.Update.bind(this)} >
                  <View style={{alignItems:'center'}}>
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
                  <View style={{alignItems:'center'}}>
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
                  <View style={{alignItems:'center'}}>
                    <Text>Agregar</Text>
                    <Icon style={{fontSize:40}} 
                      name="ios-add" 
                      size={40} 
                      color='black'  />
                    </View>
                </TouchableHighlight> 
              )}
              <TouchableHighlight style={styles.button}  onPress={() => this.props.navigation.navigate('CarListing')} >
                <View style={{alignItems:'center'}}>
                  <Text>Cancelar</Text>
                  <Icon style={{fontSize:40}} 
                          name="ios-close" 
                          size={40} 
                          color='black' />
                </View>
              </TouchableHighlight> 
          </View>
          </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}


CarDetails.navigationOptions = {
  title: "Detalles del Auto", 
};
