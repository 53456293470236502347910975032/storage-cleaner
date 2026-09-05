import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { theme } from './src/styles/theme';

export default function App() {
  const handleStartScan = () => {
    alert('Сканирование памяти устройства запущено!');
    // Здесь позже добавим вызов логики сканирования файлов
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <HomeScreen onStartScan={handleStartScan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
