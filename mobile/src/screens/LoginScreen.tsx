import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Call api.auth.login({ username, password })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Login</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#0F172A' },
  title: { fontSize: 24, color: '#F8FAFC', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1E293B', color: '#FFF', padding: 12, marginBottom: 15, borderRadius: 8 },
});
