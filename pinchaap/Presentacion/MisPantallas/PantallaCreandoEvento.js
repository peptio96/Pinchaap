import React from 'react'
import {View, TouchableOpacity, TouchableNativeFeedback, Image, Text, StyleSheet, TextInput, ImageBackground} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaCreandoEvento extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    nombreEvento: "",
    dineroPorPersona: "",
    errorMessage: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser
    this.setState({email})
    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
      console.log(documentSnapshot.get('nombre'))
      this.setState({nombre: documentSnapshot.get('nombre')})
    })
  }
  render(){
    const navigation = this.context;
    
    const handleNombreDinero = () => {
      const dinero = this.state.dineroPorPersona
      console.log(dinero)

      if((this.state.nombreEvento != "")&&(this.state.dineroPorPersona != "")){
        if(isNaN(parseInt(dinero))){
          this.setState({errorMessage: 'No es un número'})
        }else{
          firestore().collection('usuarios').doc(this.state.email).update({
            datosEventoNoCreado: {
              nombreEvento: this.state.nombreEvento,
              dinero: this.state.dineroPorPersona
            }
          })
          navigation.navigate('AnadirPersona',{nombreEvento: this.state.nombreEvento,dinero: this.state.dineroPorPersona})
        }
      }else{
        this.setState({errorMessage: 'Nombre evento o dinero están vacíos'})
      }
      
    };
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/background1.png')}>
        <View style={{ flex: 1}}>
          <View style={{flex: 0.4/*, backgroundColor: 'blue'*/}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.navigate('PantallaPrincipal')}
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
            <View style={{flex: 2}}>
              <View style={{flex:1}}>
                {(this.state.errorMessage != "") ? <Text style={styles.error}>{ this.state.errorMessage }</Text> : <View></View>}
              </View>
              <View style={{flex: 1}}>
                <Text style={{textTransform: "uppercase", fontSize: 12}}>Nombre evento</Text>
                <TextInput 
                  style={{borderColor: "#8A8F9E",borderWidth: StyleSheet.hairlineWidth, height:35, marginTop: 20, borderRadius: 5, width: 320}} 
                  autoCapitalize="none" 
                  onChangeText={nombreEvento => this.setState({ nombreEvento })}
                  value={this.state.nombreEvento}
                ></TextInput>
              </View>
              <View style={{flex: 1}}>
                <Text style={{textTransform: "uppercase", fontSize: 12}}>Dinero</Text>
                <TextInput 
                  style={{borderColor: "#8A8F9E",borderWidth: StyleSheet.hairlineWidth, height:35, marginTop: 20, borderRadius: 5, width: 320}} 
                  autoCapitalize="none"  
                  keyboardType= 'numeric'
                  onChangeText={dineroPorPersona => this.setState({ dineroPorPersona })}
                  value={this.state.dineroPorPersona}
                ></TextInput>
              </View>
            </View>
            <View style={{flex: 1, marginTop: 50}}>
              <TouchableOpacity style={{
                alignItems: 'center', 
                backgroundColor: '#535473', 
                width: 320, 
                height: 30,
                justifyContent: 'center', 
                borderRadius: 5, 
                borderColor: 'white', 
                marginTop: 20}} onPress={
                handleNombreDinero}>
                <Text style={{ color: "#FFF", fontWeight: "500" }}>Añadir comensales</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                alignItems: 'center', 
                backgroundColor: '#535473', 
                width: 320, 
                height: 30, 
                justifyContent: 'center', 
                borderRadius: 5, 
                borderColor: 'white',
                marginTop: 20}} onPress={() => navigation.navigate('EventosPrincipal')} >
                <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              
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