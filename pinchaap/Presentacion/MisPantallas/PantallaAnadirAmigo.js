import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground, Alert} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAnadirAmigo extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    emailPeticion: "",
    errorMessage: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser
    this.setState({email})
    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
      this.setState({nombre: documentSnapshot.get('nombre')})
    })
  }
  validate = (text) => {
    console.log(text); 
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 
    if(reg.test(text) === false) { 
      console.log("Email is Not Correct");
      return false; 
    } else { 
      console.log("Email is Correct");
      return true
    } 
  } 

  handleEnviarInvitacion = () => {
    if(this.state.emailPeticion==""){
      this.setState({errorMessage: 'El campo buscar amigos está vacío'})
    }else{
      if(this.validate(this.state.emailPeticion)){
        if(this.state.emailPeticion == this.state.email){
          this.setState({errorMessage: 'No te puedes añadir como amigo'})
        }else{
          firestore().collection('usuarios').doc(this.state.emailPeticion).get().then(documentSnapshot => {
            if(documentSnapshot.exists){
              const datosPeticiones = documentSnapshot.get('peticiones')
              if(datosPeticiones==undefined){
                firestore().collection('usuarios').doc(this.state.emailPeticion).update({
                  peticiones: {
                    [Math.floor(Math.random() * 10000) + 1]: this.state.emailPeticion}
                  }
                ).then(() => {
                  console.log('usuario añadido a las peticiones de amistad!');
                  Alert.alert('Pinchapp','Petición Enviada',[{text: "Aceptar"}])
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
                  const nuevaPeticion = {...datosPeticiones, [Math.floor(Math.random() * 10000) + 1]: this.state.emailPeticion}
                  firestore().collection('usuarios').doc(this.state.emailPeticion).update({peticiones: nuevaPeticion})
                  .then(() => {
                    console.log('usuario añadido a las peticiones de amistad!');
                    Alert.alert('Pinchapp','Petición Enviada',[{text: "Aceptar"}])
                  })
                }else {
                  console.log('ya esta ese usuario')
                  this.setState({errorMessage: 'ya le has enviado una petición a ese usuario'})
                }
              }
            }else{
              this.setState({errorMessage: 'No existe ese usuario, prueba otro'})
            }
          })
        }
      }else{
        this.setState({errorMessage: 'El campo buscar amigos no tiene formato de correo electrónico'})
      }
    }
    
  }
  render(){
    const navigation = this.context;
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/background1.png')}>
        <View style={{flex: 1}}>
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
                  <View>
                    {(this.state.errorMessage != "") ? <Text style={styles.error}>{ this.state.errorMessage }</Text> : <View></View>}
                  </View>
                  <Text style={{textTransform: "uppercase", fontSize: 12}}>Buscar amigos</Text>
                  <TextInput 
                    style={styles.input} 
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
  input: {
    borderColor: "#8A8F9E",
    borderWidth: StyleSheet.hairlineWidth,
    height:35, 
    marginTop: 20, 
    borderRadius: 5, 
    width: 320
  },
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