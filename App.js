import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import HomeScreen from './src/screens/HomeScreen';
import { theme } from './src/styles/theme';

export default function App() {
  const [scanResult, setScanResult] = useState({
    totalFiles: 0,
    scanned: false,
  });

  const handleStartScan = async () => {
    try {
      // 1. Запрашиваем разрешение на чтение медиафайлов
      const permission = await MediaLibrary.requestPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Внимание', 'Нужны права на доступ к хранилищу, чтобы найти файлы.');
        return;
      }

      Alert.alert('Сканирование', 'Поиск файлов на устройстве запущен...');

      // 2. Получаем список всех файлов/ассетов с телефона
      const media = await MediaLibrary.getAssetsAsync({
        first: 1000,
        mediaType: ['photo', 'video', 'audio'],
      });

      setScanResult({
        totalFiles: media.totalCount,
        scanned: true,
      });

      Alert.alert('Успех!', `Найдено файлов: ${media.totalCount}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось просканировать файлы: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <HomeScreen onStartScan={handleStartScan} scanResult={scanResult} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
