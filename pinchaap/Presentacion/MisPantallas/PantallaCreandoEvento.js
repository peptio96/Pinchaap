import React from 'react'
import {View} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';

class PantallaCreandoEvento extends React.Component {
  static contextType = NavigationContext;
  render(){
    const navigation = this.context;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'teal', backgroundColor: '#fff'}}>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Añadir persona' accion={() => navigation.navigate('AnadirPersona')}/>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Aceptar' accion={() => navigation.navigate('ResumenParticipantesBote')}/>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Cancelar' accion={() => navigation.goBack()}/>
      </View>
    )
  }
}

export default PantallaCreandoEvento