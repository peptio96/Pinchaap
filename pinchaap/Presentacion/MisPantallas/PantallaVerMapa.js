import React from 'react'
import {View, StyleSheet, TouchableNativeFeedback, TouchableOpacity, Image} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

class PantallaVerMapa extends React.Component {
  static contextType = NavigationContext;
  /* componentWillUnmount(){
    auth().signOut().then(() => console.log('User signed out!'));
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
    })
  } */
  render(){
    const navigation = this.context;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.4}}>
          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
            <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
              <TouchableOpacity
                style={{alignItems: "center",justifyContent: "center"}}
                onPress={() => navigation.navigate('PantallaPrincipal')}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
              >
                  <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_grande.png')} />
              </TouchableOpacity>
            </View>
            <View style={{width: '80%'/*, backgroundColor: 'green'*/}}>
              <Image style={{width: 120, height: 50, marginHorizontal: 52, marginTop: 10}}  source={require('../imagenes/fuente.png')} />
            </View>
          </View>
        </View>
        <View style={{flex: 4}}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: 42.465475,
              longitude: -2.448541,
              latitudeDelta: 0.0001,
              longitudeDelta: 0.0018,
            }}
          />
        </View>
      </View>
    )
  }
}

export default PantallaVerMapa