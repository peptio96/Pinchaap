import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAumentarBote extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    nombreEvento: "",
    dinero: "",
    datosAmigos: {},
    datosComensales: {}
  }
  componentDidMount(){
    this.setState({nombreEvento: this.props.route.params.nombreEvento})
    this.setState({datosAmigos: this.props.route.params.comensales})
    const {email} = auth().currentUser
    this.setState({email})
    firestore().collection('usuarios').doc(email).get()
      .then(documentSnapshot => {
        console.log('nombre del usuario: ' + documentSnapshot.get('nombre'))
        this.setState({nombre: documentSnapshot.get('nombre')})
    }).then(() => {
      console.log('email del usuario:  ' + this.state.email);
    });
  }



  handleEnviarPeticionEvento = (amigo) => {
    console.log("estoy aqui")
    var datosComensales = this.state.datosComensales
    console.log('pedro-------------------------------------------------------- ', Object.values(this.state.datosComensales).length)
    if(Object.values(datosComensales).length == 0){
      datosComensales = {[Math.floor(Math.random() * 10000) + 1]: amigo}
    }else{
      datosComensales = {...datosComensales, [Math.floor(Math.random() * 10000) + 1]: amigo}
    }
    this.setState({datosComensales: datosComensales})
    console.log('dasfdsfswdfasdfas ',datosComensales)
    firestore().collection('usuarios').doc(amigo).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        const datosPeticionesEvento = documentSnapshot.get('peticionEventos')
        if(datosPeticionesEvento==undefined){
          firestore().collection('usuarios').doc(amigo).update({
            peticionEventos: {
              [Math.floor(Math.random() * 10000) + 1]: {
                nombreEvento: (this.state.nombreEvento + "_" + this.state.email),
                dinero: this.state.dinero
              }
            }
          }).then(() => {
            console.log('peticion de envento enviada a: !'+ (this.state.nombreEvento + "_" + this.state.email));
          });
          firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({eventoActivo: false})
        }else{
          var peticionesRepetidas = false
          if(!peticionesRepetidas){
            console.log('  datosPeticionesEvento dato1: ',Object.values(datosPeticionesEvento)[0])
            console.log('  peticiones: ', Object.keys(datosPeticionesEvento).length)
            const nuevaPeticion = {...datosPeticionesEvento, [Math.floor(Math.random() * 10000) + 1]: {
              nombreEvento: (this.state.nombreEvento + "_" + this.state.email),
              dinero: this.state.dinero
            }}
            console.log(nuevaPeticion)
            firestore().collection('usuarios').doc(amigo).update({peticionEventos: nuevaPeticion})
            .then(() => {
              console.log('petición añadida a las peticiones de evento!');
            })
            firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({eventoActivo: false}).then(() => console.log('llegue'))
          }else {
            console.log('ya esta ese usuario')
          }
        }
      }
    })
  }
  eliminarAmigoConPeticion = (amigo) => {
    const datosAmigos = this.state.datosAmigos
    console.log('datosPETICIONES1',this.state.datosAmigos)
    console.log('datosPETICIONES2',datosAmigos)
    let idAmigoEliminar= ""
    for (const [key, value] of Object.entries(this.state.datosAmigos)) {
      if(value == amigo){
        console.log('value'+value)
        console.log('key'+key)
        idAmigoEliminar = key
      }
      console.log(key+':'+value);
    }
    console.log('datosPETICIONES3',idAmigoEliminar)
    delete datosAmigos[idAmigoEliminar]
    firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({confirmados: this.state.datosAmigos})
    if(Object.values(datosAmigos).length == 0){
      firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({confirmados: firestore.FieldValue.delete()})
    }
    console.log('datosPETICIONES4',datosAmigos)
    this.setState({datosAmigos: datosAmigos})
    
  }
  aumentarPagoAdministrador = () => {
    firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).get().then(evento => {
      console.log(evento.get('dinero'))
      firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({dinero: (parseInt(this.state.dinero)+evento.get('dinero'))})
    })
  }
  anadirNoConfirmados = () => {
    firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({noConfirmados: this.state.datosAmigos})
  }
  render(){
    const navigation = this.context;
    const elimarEIrAPantallaPrincipal = () => {
      navigation.navigate('PantallaPrincipal')
    }
    const aumentarBote = () => {
      this.aumentarPagoAdministrador()
      this.anadirNoConfirmados()
      Object.values(this.state.datosAmigos).map((comensal) => {
        this.handleEnviarPeticionEvento(comensal)
        this.eliminarAmigoConPeticion(comensal)
      })
      navigation.navigate('EventosActivos')
    }
    
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/background1.png')}>
        <View style={styles.container}>
          <View style={{flex: 0.4/*, backgroundColor: 'blue'*/}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={elimarEIrAPantallaPrincipal}
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
          <View style={{flex: 4, left: 20}}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>Aumentar bote</Text>
              <TextInput 
                style={{borderBottomColor: "#8A8F9E",borderBottomWidth: StyleSheet.hairlineWidth,
                borderTopColor: "#8A8F9E",borderTopWidth: StyleSheet.hairlineWidth,
                borderLeftColor: "#8A8F9E",borderLeftWidth: StyleSheet.hairlineWidth,
                borderRightColor: "#8A8F9E",borderRightWidth: StyleSheet.hairlineWidth, height:35, marginTop: 20, borderRadius: 5, width: 320}} 
                autoCapitalize="none" 
                keyboardType= 'numeric'
                onChangeText={dinero => this.setState({ dinero })}
                value={this.state.dinero}
              ></TextInput>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start'}}>
              <TouchableOpacity style={{
                alignItems: 'center', 
                backgroundColor: '#535473', 
                width: 320, 
                height: 30,
                justifyContent: 'center', 
                borderRadius: 5, 
                borderColor: 'white', 
                marginTop: 20}} onPress={aumentarBote}>
                <Text style={{ color: "#FFF", fontWeight: "500" }}>Aumentar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                alignItems: 'center', 
                backgroundColor: '#535473', 
                width: 320, 
                height: 30,
                justifyContent: 'center', 
                borderRadius: 5, 
                borderColor: 'white', 
                marginTop: 20}} onPress={() => {navigation.goBack()}
                }>
                <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center"
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D"
  },
  button: {
    width: 325,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  }
})

export default PantallaAumentarBote