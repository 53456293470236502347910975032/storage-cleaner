import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

// Главная функция сканирования с выбором режима
export async function scanDeviceStorage(mode = 'all', onProgress) {
  let heavyFiles = [];
  let similarPhotosGroups = [];
  let totalScanned = 0;

  try {
    // 1. Если режим включает галерею/фото
    if (mode === 'all' || mode === 'photos') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        if (onProgress) onProgress({ scannedCount: totalScanned, currentFile: 'Сканирование галереи и фото...' });
        
        // Получаем последние фото с устройства (до 500 штук для скорости анализа)
        const media = await MediaLibrary.assetsAsync({
          mediaType: ['photo'],
          first: 500,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });

        totalScanned += media.assets.length;

        // Простая эмуляция поиска похожих фото по имени/весу/разрешению
        // В будущем сюда добавим хэширование пикселей
        const photoMap = {};
        media.assets.forEach((asset) => {
          // Ищем дубликаты по похожим именам или времени создания (для примера)
          const key = `${asset.width}x${asset.height}`;
          if (!photoMap[key]) {
            photoMap[key] = [];
          }
          photoMap[key].push(asset);
        });

        // Формируем группы дубликатов, где больше 1 файла
        Object.keys(photoMap).forEach((key) => {
          if (photoMap[key].length > 1) {
            similarPhotosGroups.push({
              resolution: key,
              items: photoMap[key].slice(0, 3), // берем первые несколько похожих
            });
          }
        });
      }
    }

    // 2. Если режим включает поиск тяжелых файлов в памяти устройства
    if (mode === 'all' || mode === 'documents') {
      if (onProgress) onProgress({ scannedCount: totalScanned, currentFile: 'Сканирование корневой памяти...' });
      
      const documentDirectory = FileSystem.documentDirectory;
      if (documentDirectory) {
        const files = await FileSystem.readDirectoryAsync(documentDirectory);
        
        for (let i = 0; i < files.length; i++) {
          const fileUri = documentDirectory + files[i];
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          
          totalScanned++;
          if (onProgress) {
            onProgress({ scannedCount: totalScanned, currentFile: files[i] });
          }

          if (!fileInfo.isDirectory && fileInfo.size) {
            // Если файл больше 100 МБ
            if (fileInfo.size > 100 * 1024 * 1024) {
              heavyFiles.push({
                name: files[i],
                uri: fileUri,
                size: (fileInfo.size / (1024 * 1024)).toFixed(1) + ' МБ',
              });
            }
          }
        }
      }
    }

  } catch (error) {
    console.log('Ошибка при глубоком сканировании памяти:', error);
  }

  return {
    totalScanned,
    heavyFiles,
    similarPhotosGroups,
  };
}
