import React, { useState } from 'react';
import { View, Button } from 'react-native';
import OrderWebView from './src/OrderWebView';

/**
 * Demo-App für die OrderWebView Komponente
 * 
 * Zeigt die Verwendung der wiederverwendbaren WebView-Komponente
 * mit der Roemerhof Bestellseite als Beispiel.
 */
export default function App() {
  const [open, setOpen] = useState(true);
  
  return (
    <View style={{ flex: 1 }}>
      <OrderWebView
        visible={open}
        onClose={() => setOpen(false)}
        startUrl="https://roemerhof.kuriersoft.ch/"
        allowedHosts={['roemerhof.kuriersoft.ch','www.roemerhof.kuriersoft.ch']}
        onEvent={(e) => console.log('WebView event:', e)}
      />
      <Button title="Web öffnen" onPress={() => setOpen(true)} />
    </View>
  );
}
