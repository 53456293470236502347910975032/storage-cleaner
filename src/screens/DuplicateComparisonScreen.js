import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';

export default function DuplicateComparisonScreen({ duplicateGroup, onResolveGroup }) {
  // duplicateGroup — это массив похожих фото, например:
  // [{ name: 'photo_original.jpg', size: '12 МБ', resolution: '4000x3000' }, { name: 'photo_copy.jpg', size: '11.8 МБ', resolution: '4000x3000' }]
  
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  const handleAction = (actionType) => {
    if (onResolveGroup) {
      onResolveGroup(actionType, selectedToDelete);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>СРАВНЕНИЕ ДУБЛИКАТОВ</Text>
          <Text style={styles.headerSubtitle}>Найдена разница в структуре (почти идентичны)</Text>
        </View>

        {/* Карточки сравнения двух файлов */}
        <View style={styles.comparisonContainer}>
          
          {/* Файл 1 (Оригинал / Основной) */}
          <TouchableOpacity 
            style={[
              styles.fileCard, 
              selectedToDelete === 0 && styles.cardSelectedForDelete
            ]}
            onPress={() => setSelectedToDelete(0)}
          >
            <View style={styles.previewBox}>
              <Text style={styles.previewPlaceholder}>ФОТО 1</Text>
            </View>
            <Text style={styles.fileName} numberOfLines={1}>photo_original.jpg</Text>
            <Text style={styles.fileMeta}>12.0 МБ • 4000x3000</Text>
            <Text style={styles.badgeKeep}>ОРИГИНАЛ</Text>
          </TouchableOpacity>

          {/* Файл 2 (Дубликат с разницей в пару пикселей) */}
          <TouchableOpacity 
            style={[
              styles.fileCard, 
              selectedToDelete === 1 && styles.cardSelectedForDelete
            ]}
            onPress={() => setSelectedToDelete(1)}
          >
            <View style={styles.previewBox}>
              <Text style={styles.previewPlaceholder}>ФОТО 2</Text>
            </View>
            <Text style={styles.fileName} numberOfLines={1}>photo_copy_few_pixels.jpg</Text>
            <Text style={styles.fileMeta}>11.8 МБ • 4000x3000</Text>
            <Text style={styles.badgeDelete}>ДУБЛИКАТ (-0.2 МБ)</Text>
          </TouchableOpacity>

        </View>

        {/* Инструкция */}
        <Text style={styles.hintText}>
          {selectedToDelete !== null 
            ? `Выбран файл ${selectedToDelete + 1} для отправки в утиль.` 
            : 'Нажмите на файл, который хотите отметить для удаления.'}
        </Text>

        {/* Кнопки действий в неоновом стиле */}
        <TouchableOpacity 
          style={[styles.actionButton, selectedToDelete === null && styles.buttonDisabled]} 
          disabled={selectedToDelete === null}
          onPress={() => handleAction('delete_selected')}
        >
          <Text style={styles.actionButtonText}>УДАЛИТЬ ОТМЕЧЕННЫЙ</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => handleAction('keep_both')}
        >
          <Text style={styles.secondaryButtonText}>ОСТАВИТЬ ОБА</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.medium,
  },
  header: {
    marginBottom: theme.spacing.large,
    marginTop: theme.spacing.small,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.large,
  },
  fileCard: {
    width: '48%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: theme.spacing.small,
    alignItems: 'center',
  },
  cardSelectedForDelete: {
    borderColor: theme.colors.primaryGlow, // Неоновая подсветка при выборе на удаление
    backgroundColor: '#1a0d14',
  },
  previewBox: {
    width: '100%',
    height: 120,
    backgroundColor: '#050507',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  previewPlaceholder: {
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fileName: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  fileMeta: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeKeep: {
    color: theme.colors.success,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#002611',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeDelete: {
    color: theme.colors.primaryGlow,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#26000d',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hintText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  actionButton: {
    backgroundColor: theme.colors.primaryGlow,
    paddingVertical: 14,
    borderRadius: theme.borderRadius,
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    shadowColor: theme.colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#2a2a36',
    shadowOpacity: 0,
  },
  actionButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    borderRadius: theme.borderRadius,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
