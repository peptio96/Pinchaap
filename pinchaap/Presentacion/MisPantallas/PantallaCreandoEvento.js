import React from 'react'
import {View, TouchableOpacity, TouchableNativeFeedback, Image, Text, StyleSheet, TextInput} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaCreandoEvento extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    nombreEvento: "",
    dineroPorPersona: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser

    this.setState({email})
    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
      console.log(documentSnapshot.get('nombre'))
      this.setState({nombre: documentSnapshot.get('nombre')})
    })
  }
  /* handleNombreDinero = () => {
    
    console.log('Añadir comensales')
    console.log('  nombre Evento:   ' + this.state.nombreEvento)
    console.log('  dinero por persona:   ' + this.state.dineroPorPersona)
    firestore().collection('usuarios').doc(this.state.emailPeticion).update({datosEventoNoCreado: {nombre: this.state.nombreEvento,dinero: this.state.dineroPorPersona}})
    .then(() => {
      console.log('nombre y dinero añadidos al usuario admin!');
    });
  } */
  render(){
    const navigation = this.context;
    const handleNombreDinero = () => {
      console.log('Añadir comensales')
      console.log(' email: ', this.state.email)
      console.log('  nombre Evento:   ' + this.state.nombreEvento)
      console.log('  dinero por persona:   ' + this.state.dineroPorPersona)
      firestore().collection('usuarios').doc(this.state.email).update({datosEventoNoCreado: {nombre: this.state.nombreEvento,dinero: this.state.dineroPorPersona}})
      .then(() => {
        console.log('nombre y dinero añadidos al usuario admin!');
      });
      navigation.navigate('AnadirPersona')
    };
    const elimarEIrAEventosPrincipal = () => {
      firestore().collection('usuarios').doc(this.state.email).update({datosEventoNoCreado: firestore.FieldValue.delete()})
      navigation.navigate('EventosPrincipal')
    }
    const elimarEIrAPantallaPrincipal = () => {
      firestore().collection('usuarios').doc(this.state.email).update({datosEventoNoCreado: firestore.FieldValue.delete()})
      navigation.navigate('PantallaPrincipal')
    }
    return (
      <View style={{ flex: 1}}>
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
              <Text style={{marginHorizontal: 85}}>Pinchapp</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 4, left: 20}}>
          <View>
            <Text style={styles.inputTitle}>Nombre evento</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="none" 
              onChangeText={nombreEvento => this.setState({ nombreEvento })}
              value={this.state.nombreEvento}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Dinero</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="none" 
              keyboardType= 'numeric'
              onChangeText={dineroPorPersona => this.setState({ dineroPorPersona })}
              value={this.state.dineroPorPersona}
            ></TextInput>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={
              handleNombreDinero
              /* navigation.navigate('AnadirPersona') */}>
              <Text style={{ color: "#FFF", fontWeight: "500" }}>Añadir comensales</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={elimarEIrAEventosPrincipal} >
              <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
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
    color: "#161F3D",
    width: 325
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

export default PantallaCreandoEvento