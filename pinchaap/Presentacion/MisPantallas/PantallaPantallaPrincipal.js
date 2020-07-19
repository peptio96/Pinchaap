import React from 'react'
import {View, TouchableNativeFeedback, Image, Platform} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';

class PantallaPantallaPrincipal extends React.Component {
  static contextType = NavigationContext;
  render(){
    const navigation = this.context;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'teal', backgroundColor: '#fff'}}>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Nuevo evento' accion={() => navigation.navigate('CreandoEvento')}/>
        <TouchableNativeFeedback
          onPress={() => navigation.navigate('VerMapa')}
          background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
        >
          <View style={{ marginBottom: 30, width: 260, alignItems:'center', backgroundColor:'#fff'}}>
            <Image 
              style={{width: 100, height: 100}} 
              source={require('../imagenes/googlemaps.png')} />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

export default PantallaPantallaPrincipal