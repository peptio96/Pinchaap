import * as React from 'react'
import {View, Text, TextInput,StyleSheet,TouchableOpacity} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import * as RootNavigation from '../AdministrarPantallas/RootNavigation'
import auth from '@react-native-firebase/auth';

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
  logoff = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.greeting}>{'Hola de nuevo. \nBienvenido.'}</Text>
        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{ this.state.errorMessage }</Text>}
        </View>
        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Dirección email</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="none" 
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            ></TextInput>
          </View>
          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Contraseña</Text>
            <TextInput 
              style={styles.input} 
              secureTextEntry 
              autoCapitalize="none"
              onChangeText={contrasena => this.setState({ contrasena })}  
              value={this.state.contrasena}
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.handleLogin/*() => RootNavigation.navigate('PantallaPrincipal')*/}>
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={/*this.logoff*/() => RootNavigation.navigate('Registro')}>
          <Text style={{color: "#414959", fontSize: 13}}>
            ¿Nuevo en Pinchaap? <Text style={{ fontWeight: "500", color:"#E9446A"}}>registrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default PantallaLogin