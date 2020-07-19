import * as React from 'react'
import { View, Text, TouchableNativeFeedback, Image, Platform } from 'react-native'
//import * as RootNavigation from './RootNavigation'

export default function MyButton({colorFondoBoton, colorTextoBoton, nombre, accion }){
  return (
    <TouchableNativeFeedback 
      background={ Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : '' }
      onPress={accion}
    >
      <View style={{ marginBottom: 30, width: 260, alignItems: 'center', backgroundColor: colorFondoBoton }} >
        <Text style={{textAlign: 'center', padding: 20, color: colorTextoBoton }} >
          {nombre}
        </Text>
      </View>
    </TouchableNativeFeedback>
  )
}