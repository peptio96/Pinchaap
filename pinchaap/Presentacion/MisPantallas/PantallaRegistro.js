import React from 'react'
import {View,StyleSheet,Text,TextInput,TouchableOpacity} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaRegistro extends React.Component {
  state = {
    nombre: "",
    email: "",
    contrasena: "",
    errorMessage: null
  }
  createUser = () => {
    auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.contrasena)
      .then(() => {
        firestore().collection('usuarios').doc(this.state.email).set({nombre: this.state.nombre, email: this.state.email, contrasena: this.state.contrasena, conectado: false})
        .then(() => {
          console.log('User added!');
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          //errorMessage = 'That email address is already in use!'
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          //errorMessage = 'That email address is invalid!'
        }

        console.error(error);
        this.setState({errorMessage: error.message})
        }
      )
  }
  static contextType = NavigationContext;
  render(){
    const navigation = this.context;
    return (
      <View style={{ flex: 1}}>
        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{ this.state.errorMessage }</Text>}
        </View>
        <View style={styles.form}>
          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Nombre</Text>
            <TextInput 
              style={styles.input}
              autoCapitalize="none"
              onChangeText={nombre => this.setState({ nombre })}  
              value={this.state.nombre}
            ></TextInput>
          </View>
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
        <TouchableOpacity style={styles.button} onPress={this.createUser/*() => navigation.navigate('PantallaPrincipal')*/}>
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={/*this.handleLogin*/() => navigation.goBack()}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>atras</Text>
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

export default PantallaRegistro