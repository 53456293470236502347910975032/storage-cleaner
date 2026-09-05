import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';

export default function HomeScreen({ onStartScan }) {
  const totalStorage = 128; // ГБ
  const usedStorage = 96;   // ГБ
  const freeStorage = totalStorage - usedStorage;
  const usagePercent = Math.round((usedStorage / totalStorage) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NEO_CLEAN</Text>
          <Text style={styles.headerSubtitle}>Локальный хранитель памяти</Text>
        </View>

        <View style={styles.storageCard}>
          <View style={styles.circleContainer}>
            <Text style={styles.usagePercentText}>{usagePercent}%</Text>
            <Text style={styles.usageLabelText}>Занято</Text>
          </View>
          
          <View style={styles.storageInfo}>
            <View style={styles.infoRow}>
              <View style={[styles.dot, { backgroundColor: theme.colors.primaryGlow }]} />
              <Text style={styles.infoText}>Использовано: {usedStorage} ГБ</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              <Text style={styles.infoText}>Свободно: {freeStorage} ГБ</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={onStartScan}>
          <Text style={styles.scanButtonText}>НАЧАТЬ СКАНИРОВАНИЕ</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Категории файлов</Text>
        <View style={styles.categoriesGrid}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Дубликаты</Text>
            <Text style={styles.categorySize}>Поиск...</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Тяжелые файлы</Text>
            <Text style={styles.categorySize}> > 100 МБ</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Скриншоты</Text>
            <Text style={styles.categorySize}>Очистка</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Кэш апп</Text>
            <Text style={styles.categorySize}>Локально</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.medium },
  header: { marginBottom: theme.spacing.large, marginTop: theme.spacing.small },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textPrimary, letterSpacing: 2 },
  headerSubtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  storageCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.large,
    shadowColor: theme.colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  circleContainer: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: theme.colors.primaryGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  usagePercentText: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary },
  usageLabelText: { fontSize: 12, color: theme.colors.textSecondary },
  storageInfo: { justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  infoText: { color: theme.colors.textPrimary, fontSize: 14 },
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
  scanButtonText: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.medium },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  categoryName: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  categorySize: { color: theme.colors.textSecondary, fontSize: 13 },
});
