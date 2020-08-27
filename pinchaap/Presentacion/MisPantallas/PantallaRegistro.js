import React from 'react'
import {View,StyleSheet,Text,TextInput,TouchableOpacity, ImageBackground, Alert} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaRegistro extends React.Component {
  state = {
    nombre: "",
    email: "",
    contrasena: "",
    errorMessage: ""
  }
  createUser = () => {
    if((this.state.nombre != "")&&(this.state.email != "")&&(this.state.contrasena != "")){
      auth().createUserWithEmailAndPassword(this.state.email, this.state.contrasena).then(() => {
        firestore().collection('usuarios').doc(this.state.email).set({
          nombre: this.state.nombre, 
          email: this.state.email, 
          contrasena: this.state.contrasena, 
          conectado: false
        }).then(() => {
          Alert.alert('Pinchapp','Usuario ya creado',[{text: "Aceptar"}])
        })
      }).catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          this.setState({errorMessage: '!Ese correo electrónico ya está en uso!'})
        }
        if (error.code === 'auth/invalid-email') {
          this.setState({errorMessage: '!Ese correo electrónico es inválido!'})
          console.log('That email address is invalid!');
        }
      })
    }else{
      this.setState({errorMessage: 'Alguna de las tres opciones está vacía'})
    }
    
  }
  static contextType = NavigationContext;
  render(){
    const navigation = this.context;
    return (
      <ImageBackground style={styles.imageBackground} source={require('../imagenes/backgroundinicio.png')}>
        <View style={{ flex: 7}}>
          <View style={{flex: 1,height: 72,alignItems: "center",justifyContent: "center",marginHorizontal: 30}}>
            {(this.state.errorMessage != "") ? <Text style={styles.error}>{ this.state.errorMessage }</Text> : <View></View>}
          </View>
          <View style={{flex: 4}}>
            <View style={{marginLeft: 30, marginRight: 30}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>Nombre</Text>
              <TextInput 
                style={styles.input}
                autoCapitalize="none"
                onChangeText={nombre => this.setState({ nombre })}  
                value={this.state.nombre}
              ></TextInput>
            </View>
            <View style={{marginLeft: 30, marginRight: 30, marginTop: 32}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>Dirección email</Text>
              <TextInput 
                style={styles.input} 
                autoCapitalize="none" 
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>
            <View style={{marginLeft: 30, marginRight: 30, marginTop: 32}}>
              <Text style={{textTransform: "uppercase", fontSize: 12}}>Contraseña</Text>
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
            <TouchableOpacity style={styles.botonRegistrarse} onPress={this.createUser/*() => navigation.navigate('PantallaPrincipal')*/}>
              <Text style={{ color: "#FFF", fontWeight: "500" }}>Registrarse</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonAtras} onPress={/*this.handleLogin*/() => navigation.goBack()}>
              <Text style={{ color: "#FFF", fontWeight: "500" }}>Atras</Text>
            </TouchableOpacity>
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
    borderRadius: 5
  },
  imageBackground: {
    width: '100%', 
    height: '100%'
  },
  botonRegistrarse: {
    alignItems: 'center', 
    backgroundColor: '#535473', 
    width: 320, 
    height: 30, 
    justifyContent: 'center', 
    borderRadius: 5, 
    borderColor: 'white'
  },
  botonAtras: {
    alignItems: 'center', backgroundColor: '#979BD6', width: 320, height: 30, justifyContent: 'center', borderRadius: 5, borderColor: 'white', marginTop: 20
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  }
})

export default PantallaRegistro