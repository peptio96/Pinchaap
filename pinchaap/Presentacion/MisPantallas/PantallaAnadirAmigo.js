import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAnadirAmigo extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    emailPeticion: "",
    numeroPeticion: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser
    this.setState({email})
    firestore()
      .collection('usuarios')
      .doc(email)
      .get()
      .then(documentSnapshot => {
        console.log('nombre del usuario: ' + documentSnapshot.get('nombre'))
        this.setState({nombre: documentSnapshot.get('nombre')})
    }).then(() => {
      console.log('email del usuario:  ' + this.state.email);
    });
  }
  /* componentWillUnmount(){
    auth().signOut().then(() => console.log('User signed out!'));
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
    })
  } */
  handleEnviarInvitacion = () => {
    console.log('clicadoEnviarInvitación')
    console.log('  emailPeticion:   ' + this.state.emailPeticion)
    firestore().collection('usuarios').doc(this.state.emailPeticion).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosPeticiones = documentSnapshot.get('peticiones')
        if(datosPeticiones==undefined){
          console.log('  datosPeticiones:', false)
          //añadir peticiones y añadir el primer email
          firestore().collection('usuarios').doc(this.state.emailPeticion).update({peticiones: {[Math.floor(Math.random() * 10000) + 1]: this.state.email}})
          .then(() => {
            console.log('usuario añadido a las peticiones de amistad!');
          });
        }else{
          console.log('  datosPeticiones:', true)
          //añadir un email a peticiones que ya está creado y comprobar si ya está incluido
          var peticionesRepetidas = false
          Object.values(datosPeticiones).map((peticion) => {
            if(peticion == this.state.email){
              peticionesRepetidas = true
            }
          })
          if(!peticionesRepetidas){
            console.log('  datosPeticiones dato1: ',Object.values(datosPeticiones)[0])
            console.log('  peticiones: ', Object.keys(datosPeticiones).length)
            this.setState({numeroPeticion: Object.keys(datosPeticiones).length+1})
            const nuevaPeticion = {...datosPeticiones, [Math.floor(Math.random() * 10000) + 1]: this.state.email}
            console.log(nuevaPeticion)
            firestore().collection('usuarios').doc(this.state.emailPeticion).update({peticiones: nuevaPeticion})
            .then(() => {
              console.log('usuario añadido a las peticiones de amistad!');
            })
          }else {
            console.log('ya esta ese usuario')
          }
          
        }
      }
    })
  }
  render(){
    const navigation = this.context;
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/background1.png')}>
        <View style={styles.container}>
          <View style={{flex: 0.4/*, backgroundColor: 'blue'*/}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.goBack()}
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
            <View style={{flexDirection: 'row',flex: 1, position: 'relative', justifyContent: 'center',/* backgroundColor: 'red',*/ width: '100%', height: '100%'}} >
              <View style={{flexDirection: 'row'}}>

                <View style={{height: '100%',justifyContent: 'center', width: '10%', alignItems: 'center', /*backgroundColor: 'red'*/}}>
                  <TouchableOpacity
                    style={{alignItems: "center",justifyContent: "center"}}
                    onPress={() => navigation.navigate('AmigosPendientes')}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                  >
                    <Image style={{width: 50, height: 350}} source={require('../imagenes/logo_flechaizda.png')} />
                  </TouchableOpacity>
                </View>

                <View style={{height: '100%',justifyContent: 'center', width: '80%', alignItems: 'center', /*backgroundColor: 'green'*/}}>
                  <Text style={{textTransform: "uppercase", fontSize: 12}}>Buscar amigos</Text>
                  <TextInput 
                    style={{borderBottomColor: "#8A8F9E",borderBottomWidth: StyleSheet.hairlineWidth,
                    borderTopColor: "#8A8F9E",borderTopWidth: StyleSheet.hairlineWidth,
                    borderLeftColor: "#8A8F9E",borderLeftWidth: StyleSheet.hairlineWidth,
                    borderRightColor: "#8A8F9E",borderRightWidth: StyleSheet.hairlineWidth, height:35, marginTop: 20, borderRadius: 5, width: 320}} 
                    autoCapitalize="none" 
                    onChangeText={emailPeticion => this.setState({ emailPeticion })}
                  ></TextInput>
                  <TouchableOpacity style={{alignItems: 'center', backgroundColor: '#535473', width: 320, height: 30, justifyContent: 'center', borderRadius: 5, borderColor: 'white', marginTop: 20}} onPress={this.handleEnviarInvitacion/*() => RootNavigation.navigate('PantallaPrincipal')*/}>
                    <Text style={{ color: "#FFF" , fontWeight: "500" }}>Enviar peticion</Text>
                  </TouchableOpacity>
                </View>

                <View style={{height: '100%',justifyContent: 'center', width: '10%', alignItems: 'center', /*backgroundColor: 'red'*/}}>
                  <TouchableOpacity
                    style={{alignItems: "center",justifyContent: "center"}}
                    onPress={() => navigation.navigate('PeticionesEventos')}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                  >
                    <Image style={{width: 50, height: 350}} source={require('../imagenes/logo_flechadcha.png')} />
                  </TouchableOpacity>
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
    color: "#161F3D",
    width: 200
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  }
})

export default PantallaAnadirAmigo