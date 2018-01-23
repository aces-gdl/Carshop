import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ListView,
  TouchableHighlight,
  Alert,
  Image,
} from 'react-native';
import ApiUtils     from './../utils/ApiUtils';
import Icon         from 'react-native-vector-icons/Ionicons';
const  styles = require ('./../../css/global');


class MakerSelector extends Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          Marca:'',
          ds: ds,
        }
       // this.loadData = this.loadData.bind(this);
        this.loadMakers = this.loadMakers.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }
    
    
    componentDidMount(){
        this.loadMakers();
    }
    
    loadMakers(){
        const myPickerOptions=[
            {id:2,key:'acura', label:'Acura'},
            {id:13,key:'audi', label:'Audi'},
            {id:12,key:'bmw', label:'BMW'},
            {id:14,key:'buick', label:'Buick'},
            {id:1,key:'chevrolet', label:'Chevrolet'},
            {id:15,key:'dodge', label:'Dodge'},
            {id:9,key:'fiat', label:'Fiat'},
            {id:0,key:'ford', label:'Ford'},
            {id:8,key:'gm', label:'GM'},
            {id:16,key:'gmc', label:'GMC'},
            {id:17,key:'honda', label:'Honda'},
            {id:18,key:'hyundai', label:'Hyundai'},
            {id:19,key:'jagu', label:'Jaguar'},
            {id:3,key:'kia', label:'KIA'},
            {id:11,key:'marchedrs', label:'Mercedez'},
            {id:10,key:'mazda', label:'Mazda'},
            {id:7,key:'mini', label:'Mini'},
            {id:20,key:'nissan', label:'Nissan'},
            {id:26,key:'peug', label:'Peugeot'},
            {id:21,key:'porsche', label:'Porsche'},
            {id:6,key:'renault', label:'renault'},
            {id:25,key:'seat', label:'Seat'},
            {id:22,key:'subaru', label:'Subaru'},
            {id:5,key:'suzuki', label:'Suzuki'},
            {id:4,key:'toyota', label:'Toyota'},
            {id:23,key:'volkswagen', label:'Volkswagen'},
            {id:24,key:'volvo', label:'Volvo'},
        ];
      //  {id:,key:'', label:''},
        
          this.setState({
            ds: this.state.ds.cloneWithRows(myPickerOptions),
            });
            
    }
    loadData(){  
    
        console.log('en loadData: ');
    
        let full_url = 'https://www.carqueryapi.com/api/0.3/?cmd=getMakes';
        console.log ('URL =' + full_url);
        fetch(full_url, {
                method: 'GET',
                
            }).then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .then((responseData) => {
                    if (responseData.Makes.length){
                    this.setState({
                        ds: this.state.ds.cloneWithRows(responseData.Makes),
                        });
                        console.log ('Con Datos : '+ responseData.Makes);
                    }
                    else
                    {
                    console.log ('Sin Datos : Vacio');
                    }
                    console.log ('resultados : ');
                    console.log( responseData.Makes);
                }).catch((e) => {
                    console.log (e);
                    let rJson = JSON.stringify(e.response);
                    Alert.alert('Error',rJson);
                });
    }
    
    renderRow(rowData){
        return(
        <View  style={{flex:1, paddingBottom:2, margin:2, }}>
            <TouchableHighlight style={{flex:1,}} onPress = {()=> this.props.onPress(rowData.key)}>
                <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                    <Image 
                                    source={{uri:rowData.key}}
                                    onError={()=> console.log('Error al cargar')}
                                    style={{ resizeMode:'cover', width:50, height:50,marginRight:4, padding:10}}/>

                    <Text style={{color:'rgba(52,109,241,1)',
                                    fontSize:30,
                                    fontWeight:'bold',
                                    textAlign:'center',
                                    paddingLeft:10}}
                    >{rowData.label}</Text>
                </View>
            </TouchableHighlight>
        </View>
        )
    }
    
   render() {
      if(this.props.visible){
      return (
             <Modal
                animationType={'none'}
                transparent={false}
                style={{backgroundColor:'black', flex:1 }} 
                onRequestClose={()=> null}>
                <View style={{flex:1,flexDirection:'column' ,alignItems:'center', justifyContent:'center', alignSelf:'stretch', backgroundColor:'rgba(83, 137, 187,0.7)'}}>
                    <View style={{
                                height:40,
                                alignSelf:'stretch', 
                                backgroundColor:'rgba(28, 59, 136,1)',
                                
                                alignItems:'center', 
                                }} >
                        <Text style={{color:'white', fontSize:30, padding:2}} >Seleccione Marca</Text>
                    </View>
                    <ListView
                        style={{alignSelf:'stretch', padding:10}}
                        dataSource={this.state.ds}
                        renderRow={this.renderRow}
                    />    
                    <TouchableOpacity
                      style = {{backgroundColor:'#851219', alignSelf:'center',width:'50%',borderRadius:5, margin:10, marginLeft:30, marginRight:30}}
                      onPress = {() => this.props.onPress('Cancelando')}>
                                     
                      <View style={{flexDirection:'row', justifyContent:'center', padding:5 }}>
                        <Text style={{color:'white', fontSize:20, fontWeight:'bold', alignSelf:'center'}} >Cancelar</Text>
                        <Icon style={{marginLeft:4, padding:10, fontSize:30}} name="ios-close" size={20} color='white' />
  
                      </View>
                    </TouchableOpacity>

                  </View>
             </Modal>
      )}else{
         return null;
      }
   }
}
export default MakerSelector

