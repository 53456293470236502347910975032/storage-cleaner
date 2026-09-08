import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { theme } from '../styles/theme';
import { scanDeviceStorage } from '../utils/fileScanner';

export default function HomeScreen() {
  const [storageInfo, setStorageInfo] = useState({ total: 128, free: 32, used: 96, percentage: 75 });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanProgress, setScanProgress] = useState(null);

  // Получаем реальную информацию о памяти устройства
  useEffect(() => {
    async function getDeviceInfo() {
      try {
        const freeCapacity = await FileSystem.getFreeDiskStorageAsync();
        const totalCapacity = await FileSystem.getTotalDiskCapacityAsync();
        
        const freeGB = (freeCapacity / (1024 * 1024 * 1024)).toFixed(1);
        const totalGB = (totalCapacity / (1024 * 1024 * 1024)).toFixed(1);
        const usedGB = (totalGB - freeGB).toFixed(1);
        const percent = Math.round((usedGB / totalGB) * 100);

        setStorageInfo({
          total: totalGB,
          free: freeGB,
          used: usedGB,
          percentage: percent,
        });
      } catch (error) {
        console.log('Ошибка получения памяти:', error);
      }
    }
    getDeviceInfo();
  }, []);

  // Функция запуска реального сканирования
  const handleStartScan = async () => {
    setScanning(true);
    setScanResult(null);

    try {
      const result = await scanDeviceStorage((progress) => {
        setScanProgress(progress);
      });
      setScanResult(result);
    } catch (error) {
      console.log('Ошибка сканирования:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Шапка */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NEO_CLEAN</Text>
          <Text style={styles.headerSubtitle}>Локальный хранитель памяти</Text>
        </View>

        {/* Дашборд памяти устройства */}
        <View style={styles.dashboardCard}>
          <View style={styles.circleContainer}>
            <Text style={styles.circlePercent}>{storageInfo.percentage}%</Text>
            <Text style={styles.circleLabel}>Занято</Text>
          </View>
          <View style={styles.storageDetails}>
            <View style={styles.infoRow}>
              <View style={[styles.dot, { backgroundColor: theme.colors.primaryGlow }]} />
              <Text style={styles.infoText}>Использовано: {storageInfo.used} ГБ</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              <Text style={styles.infoText}>Свободно: {storageInfo.free} ГБ из {storageInfo.total} ГБ</Text>
            </View>
          </View>
        </View>

        {/* Кнопка сканирования */}
        <TouchableOpacity 
          style={[styles.scanButton, scanning && styles.buttonDisabled]} 
          onPress={handleStartScan}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator color={theme.colors.textPrimary} />
          ) : (
            <Text style={styles.scanButtonText}>НАЧАТЬ СКАНИРОВАНИЕ</Text>
          )}
        </TouchableOpacity>

        {/* Прогресс в реальном времени во время сканирования */}
        {scanning && scanProgress && (
          <View style={styles.progressBox}>
            <Text style={styles.progressText}>Сканирование файлов: {scanProgress.scannedCount}</Text>
            <Text style={styles.progressSubText} numberOfLines={1}>Файл: {scanProgress.currentFile}</Text>
          </View>
        )}

        {/* Результаты после завершения сканирования */}
        {scanResult && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>СКАНИРОВАНИЕ ЗАВЕРШЕНО</Text>
            <Text style={styles.resultText}>Проверено файлов: {scanResult.totalScanned}</Text>
            <Text style={styles.resultText}>Тяжелых файлов {'>'} 100МБ: {scanResult.heavyFiles.length}</Text>
            <Text style={styles.resultText}>Групп похожих фото: {scanResult.similarPhotosGroups.length}</Text>
          </View>
        )}

        {/* Категории */}
        <Text style={styles.sectionTitle}>Категории файлов</Text>
        <View style={styles.categoriesGrid}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Дубликаты</Text>
            <Text style={styles.categoryDesc}>
              {scanResult ? `${scanResult.similarPhotosGroups.length} групп` : 'Поиск...'}
            </Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Тяжелые файлы</Text>
            <Text style={styles.categoryDesc}>
              {scanResult ? `${scanResult.heavyFiles.length} найдено` : '> 100 МБ'}
            </Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Скриншоты</Text>
            <Text style={styles.categoryDesc}>Очистка</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Кэш апп</Text>
            <Text style={styles.categoryDesc}>Локально</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.medium },
  header: { marginBottom: theme.spacing.medium, marginTop: theme.spacing.small },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textPrimary, letterSpacing: 2 },
  headerSubtitle: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  dashboardCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.large,
  },
  circleContainer: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 3,
    borderColor: theme.colors.primaryGlow, alignItems: 'center', justifyContent: 'center',
  },
  circlePercent: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary },
  circleLabel: { fontSize: 11, color: theme.colors.textSecondary },
  storageDetails: { flex: 1, marginLeft: theme.spacing.medium },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  infoText: { color: theme.colors.textPrimary, fontSize: 13 },
  scanButton: {
    backgroundColor: theme.colors.primaryGlow,
    paddingVertical: 16,
    borderRadius: theme.borderRadius,
    alignItems: 'center',
    marginBottom: theme.spacing.large,
    shadowColor: theme.colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: { backgroundColor: '#3a2a32' },
  scanButtonText: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  progressBox: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.primaryGlow,
    marginBottom: theme.spacing.large,
    alignItems: 'center',
  },
  progressText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  progressSubText: { color: theme.colors.textSecondary, fontSize: 12 },
  resultBox: {
    backgroundColor: '#0a1a10',
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.success,
    marginBottom: theme.spacing.large,
  },
  resultTitle: { color: theme.colors.success, fontSize: 14, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  resultText: { color: theme.colors.textPrimary, fontSize: 13, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.medium },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: '48%', backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius, borderWidth: 1, borderColor: theme.colors.border,
    padding: theme.spacing.medium, marginBottom: theme.spacing.medium,
  },
  categoryTitle: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  categoryDesc: { color: theme.colors.textSecondary, fontSize: 12 },
});
