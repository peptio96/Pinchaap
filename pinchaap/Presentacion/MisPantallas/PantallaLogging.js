import * as React from 'react'
import {View, Text, TextInput} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import * as RootNavigation from '../AdministrarPantallas/RootNavigation'

class PantallaLogging extends React.Component {
  render(){
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'teal', backgroundColor: '#fff'}}>
        <TextInput style={{ height: 30, borderColor: 'black', borderWidth: 1, width: 180 }}/>
        <TextInput style={{ height: 30, borderColor: 'black', borderWidth: 1, width: 180 }}/>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Registrarse' accion={() => RootNavigation.navigate('Registro')} />
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Login' accion={() => RootNavigation.navigate('PantallaPrincipal')} />
      </View>
    )
  }
}


export default PantallaLogging