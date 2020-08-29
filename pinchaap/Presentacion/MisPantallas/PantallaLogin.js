import * as React from 'react'
import {View, Text, TextInput,StyleSheet,TouchableOpacity, ImageBackground} from 'react-native'
import * as RootNavigation from '../AdministrarPantallas/RootNavigation'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaLogin extends React.Component {
  state = {
    email: "",
    contrasena: "",
    errorMessage: ""
  }
  
  
  handleLogin = () => {
    if((this.state.email != "") && (this.state.contrasena != "")){
      const {email, contrasena} = this.state
      auth().signInWithEmailAndPassword(email, contrasena)
        .then(() => {
          firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
            if (documentSnapshot.get('contrasena') === contrasena){
              firestore().collection('usuarios').doc(email).update({conectado: true}).then(console.log('User updated!'))
            }
          })
          RootNavigation.navigate('PantallaPrincipal')
        }
      ).catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            this.setState({errorMessage: '!Ese correo electrónico ya está en uso!'})
          }
          if (error.code === 'auth/invalid-email') {
            this.setState({errorMessage: '!Ese correo electrónico es inválido!'})
          }
          if(error.code === 'auth/wrong-password'){
            this.setState({errorMessage: 'Contraseña incorrecta'})
          }
          if(error.code === 'auth/too-many-requests'){
            this.setState({errorMessage: 'Demasiados intentos.\nIntentelo en dos minutos'})
          }
          console.log(error)
        }
      );
    }else{
      this.setState({errorMessage: 'CUENTA GMAIL o CONTRASEÑA están vacíos'})
    }
    
  }
  render(){
    return (
      <ImageBackground style={styles.imageBackground} source={require('../imagenes/backgroundinicio.png')}>
        <View style={{flex: 7}}>
          <View style={styles.mensajeBienvenida}>
            <Text  style={{textAlign: 'center', fontSize: 18}}>{'Bienvenido. \n¡¡Vámonos de pinchos!!'}</Text>
          </View>
          <View style={{flex: 1,height: 60,alignItems: "center",justifyContent: "center",marginHorizontal: 30}}>
          {(this.state.errorMessage != "") ? <Text style={styles.error}>{ this.state.errorMessage }</Text> : <View></View>}
          </View>
          <View style={{flex: 3}}>
            <View style={{marginLeft: 30, marginRight: 30}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>cuenta gmail</Text>
              <TextInput 
                style={styles.input} 
                autoCapitalize="none" 
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>
            <View style={{marginLeft: 30, marginRight: 30, marginTop: 32}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>contraseña</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                autoCapitalize="none"
                onChangeText={contrasena => this.setState({ contrasena })}  
                value={this.state.contrasena}
              ></TextInput>
            </View>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <TouchableOpacity style={styles.botonInicio} onPress={this.handleLogin}>
              <Text style={{ color: "#FFF" , fontWeight: "500" }}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: "center", marginTop: 32}} onPress={() => RootNavigation.navigate('Registro')}>
              <Text style={{color: "#414959", fontSize: 13}}>
                ¿Nuevo en Pinchaap? <Text style={{ fontWeight: "500", color:"#8D82D6"}}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
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
  input: {
    borderColor: "#8A8F9E",
    borderWidth: StyleSheet.hairlineWidth,
    height:35, 
    marginTop: 20, 
    borderRadius: 5
  },
  botonInicio: {
    alignItems: 'center', 
    backgroundColor: '#535473', 
    width: 320, 
    height: 30, 
    justifyContent: 'center', 
    borderRadius: 5, 
    borderColor: 'white'
  },
  mensajeBienvenida:{
    color: '#000',
    flex:1, 
    textTransform: "uppercase",
    justifyContent: 'flex-end'
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  }
})

export default PantallaLogin