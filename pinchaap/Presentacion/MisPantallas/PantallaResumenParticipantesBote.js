import React from 'react'
import {View, FlatList, StyleSheet, Text} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';

class PantallaResumenParticipantes extends React.Component {
  static contextType = NavigationContext;
  render(){
    const navigation = this.context;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'teal', backgroundColor: '#fff'}}>
        <Text style={{fontSize: 100}}>47.5$</Text>
        <Text style={{fontSize: 55}}>Componentes</Text>
        <FlatList
          data={[
            {key: 'Devin     654879478'},
            {key: 'Dan       635795425'},
            {key: 'Dominic   689451325'},
            {key: 'Jackson   657231889'},
            {key: 'James     641258489'},
            {key: 'Joel      635842123'},
            {key: 'John      634895712'},
            {key: 'Jillian   613218415'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
        <BotonPersonal colorFondoBoton='#fff' colorTextoBoton='orange' nombre='Go back' accion={() => navigation.navigate('PantallaPrincipal')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 6,
    fontSize: 18,
    height: 40,
  },
})

export default PantallaResumenParticipantes