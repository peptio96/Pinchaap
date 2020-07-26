import React from 'react'
import {View,Text, Button} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import stripe from 'tipsi-stripe'


stripe.setOptions({
  publishableKey: 'PUBLISHABLE_KEY',
  androidPayMode: 'test', // Android only
})
//const compatible = await stripe.deviceSupportsAndroidPay()
class PantallaCreandoEvento extends React.Component {
  static contextType = NavigationContext;
  state = {
    compatible: false
  }
  
  async UNSAFE_componentWillMount(){
    const compatible = await stripe.deviceSupportsAndroidPay()
    this.setState({compatible})
  }
  render(){
    const navigation = this.context;
    const {compatible} = this.state
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'teal', backgroundColor: '#fff'}}>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Añadir persona' accion={() => navigation.navigate('AnadirPersona')}/>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Aceptar' accion={() => navigation.navigate('ResumenParticipantesBote')}/>
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Cancelar' accion={() => navigation.goBack()}/>
        <Button disabled={!compatible} text="Pay with android pay" title="Pay with android pay" disabledText="Not supported"></Button>
      </View>
    )
  }
}

export default PantallaCreandoEvento