import React from 'react'
import {View, Text, TouchableNativeFeedback, Image, Platform, StyleSheet, TouchableOpacity, ImageBackground,Alert} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaPantallaPrincipal extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    /* datosPeticionesAmigos: [],
    datosPeticionesEventos: [] */
  }
  componentDidMount(){
    /* this.timerID = setInterval(
      () => this.tick(),
      1000
    ) */
    const {email} = auth().currentUser
    this.setState({email})
    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
      this.setState({nombre: documentSnapshot.get('nombre')})
    })
  }
  /* componentWillUnmount() {
    clearInterval(this.timerID)
  }
  tick() {
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      if(this.state.datosPeticiones!=documentSnapshot.get('peticiones')){
        Alert.alert('Pinchapp','Tiene nuevas peticiones de amistad',[{text: "Aceptar"},{text:"Ir a peticiones de amigos",onPress: () => navigation.navigate('AmigosPendientes')}])
      }
      if(this.state.datosPeticionesEventos!=documentSnapshot.get('peticionEventos')){
        Alert.alert('Pinchapp','Tiene nuevas peticiones de eventos',[{text: "Aceptar"},{text:"Ir a peticiones de eventos",onPress: () => navigation.navigate('PeticionesEventos')}])
      }
      this.setState({datosPeticiones: documentSnapshot.get('peticiones')})
      this.setState({datosPeticionesEventos: documentSnapshot.get('peticionEventos')})
    })
  } */
  render(){
    const navigation = this.context;
    const signOutUser = () => {
      firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
        firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
      })
      navigation.navigate('Logging')
    };
    return (
      <ImageBackground style={styles.imageBackground} source={require('../imagenes/background.png')}>
        <View style={{flex: 1}}>
          <View style={{flex: 0.4}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={signOutUser}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                  <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_exit.png')} />
                </TouchableOpacity>
              </View>
              <View style={{width: '80%'}}>
                <Image style={{width: 120, height: 50, marginHorizontal: 52, marginTop: 10}}  source={require('../imagenes/fuente.png')} />
              </View>
            </View>
          </View>
          <View style={{flex: 4}}>
            <View style={styles.viewBotonesArriba} >
              <View style={{flexDirection: 'column',width:"50%"}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.navigate('EventosPrincipal',{email: this.state.email})}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                  <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_eventos.png')} />
                </TouchableOpacity>
                <Text style={{textAlign: 'center'}}>Evento</Text>
              </View>
              <View style={{flexDirection: 'column',width:"50%"}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.navigate('Amigos')}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                  <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_amigos.png')} />
                </TouchableOpacity>
                <Text style={{textAlign: 'center'}}>Amigos</Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative',width: '100%', height: '70%'}}>
                <View style={{flexDirection: 'column',width:"50%"}}>
                    <TouchableOpacity
                      style={{alignItems: "center",justifyContent: "center"}}
                      onPress={() => navigation.navigate('VerMapa')}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                      <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_mapa.png')} />
                    </TouchableOpacity>
                  <Text style={{textAlign: 'center'}}>Mapa</Text>
                </View>
                <View style={{flexDirection: 'column',width:"50%"}}>
                    <TouchableOpacity
                      style={{alignItems: "center",justifyContent: "center"}}
                      onPress={() => navigation.navigate('AnadirAmigo')}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                      <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_puntos.png')} />
                    </TouchableOpacity>
                  <Text style={{textAlign: 'center'}}>Peticiones</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%', 
    height: '100%'
  },
  viewBotonesArriba: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'relative', 
    width: '100%', 
    height: '120%'
  }
})

export default PantallaPantallaPrincipal