import * as React from 'react'
import {View, Text, TextInput,StyleSheet,TouchableOpacity, ImageBackground} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import * as RootNavigation from '../AdministrarPantallas/RootNavigation'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaLogin extends React.Component {
  state = {
    email: "",
    contrasena: "",
    errorMessage: null
  }
  
  
  handleLogin = () => {
    const {email, contrasena} = this.state
    auth()
      .signInWithEmailAndPassword(email, contrasena)
      .then(() => {
        firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
          if (documentSnapshot.get('contrasena') === contrasena){
            firestore().collection('usuarios').doc(this.state.email).update({conectado: true}).then(console.log('User updated!'))
          }
        })
        RootNavigation.navigate('PantallaPrincipal')
        console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        errorMessage = 'That email address is already in use!'
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        errorMessage = 'That email address is invalid!'
      }

      console.error(error);
      }
    );
  }
  render(){
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/backgroundinicio.png')}>
        <View style={{flex: 7}}>
          <View style={{color: '#000',flex:1, textTransform: "uppercase"/* , backgroundColor: 'green' */,justifyContent: 'flex-end'}}>
            <Text  style={{textAlign: 'center', fontSize: 18}}>{'Bienvenido. \n¡¡Vámonos de pinchos!!'}</Text>
          </View>
          <View style={{flex: 1,height: 60,alignItems: "center",justifyContent: "center",marginHorizontal: 30/* ,backgroundColor: 'yellow' */}}>
            {this.state.errorMessage && <Text style={styles.error}>{ this.state.errorMessage }</Text>}
          </View>
          <View style={{flex: 3/* , backgroundColor: 'red' */}}>
            <View style={{marginLeft: 30, marginRight: 30}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>cuenta gmail</Text>
              <TextInput 
                style={{borderBottomColor: "#8A8F9E",borderBottomWidth: StyleSheet.hairlineWidth,
                borderTopColor: "#8A8F9E",borderTopWidth: StyleSheet.hairlineWidth,
                borderLeftColor: "#8A8F9E",borderLeftWidth: StyleSheet.hairlineWidth,
                borderRightColor: "#8A8F9E",borderRightWidth: StyleSheet.hairlineWidth, height:35, marginTop: 20, borderRadius: 5}} 
                autoCapitalize="none" 
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>
            <View style={{marginLeft: 30, marginRight: 30, marginTop: 32}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>contraseña</Text>
              <TextInput 
                style={{borderBottomColor: "#8A8F9E",borderBottomWidth: StyleSheet.hairlineWidth,
                borderTopColor: "#8A8F9E",borderTopWidth: StyleSheet.hairlineWidth,
                borderLeftColor: "#8A8F9E",borderLeftWidth: StyleSheet.hairlineWidth,
                borderRightColor: "#8A8F9E",borderRightWidth: StyleSheet.hairlineWidth, height:35, marginTop: 20, borderRadius: 5}} 
                secureTextEntry 
                autoCapitalize="none"
                onChangeText={contrasena => this.setState({ contrasena })}  
                value={this.state.contrasena}
              ></TextInput>
            </View>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <TouchableOpacity style={{alignItems: 'center', backgroundColor: '#535473', width: 320, height: 30, justifyContent: 'center', borderRadius: 5, borderColor: 'white'}} onPress={this.handleLogin/*() => RootNavigation.navigate('PantallaPrincipal')*/}>
              <Text style={{ color: "#FFF" , fontWeight: "500" }}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: "center", marginTop: 32}} onPress={/*this.logoff*/() => RootNavigation.navigate('Registro')}>
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
  container: {
    flex: 1
  },
  greeting: {
    color: '#000',
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center"
  },
  errorMessage: {
    
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
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default PantallaLogin