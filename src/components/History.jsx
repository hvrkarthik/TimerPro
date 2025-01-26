import React from 'react';
import { useTimerStore } from '../store/timerStore';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const Export = () => {
  const history = useTimerStore((state) => state.history);

  const exportHistory = async () => {
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const filePath = `${RNFS.DocumentDirectoryPath}/timer-history.json`;

      await RNFS.writeFile(filePath, dataStr, 'utf8');

      const shareOptions = {
        title: 'Export Timer History',
        url: `file://${filePath}`,
        type: 'application/json',
      };

      await Share.open(shareOptions);
    } catch (error) {
      Alert.alert('Error', 'Failed to export history');
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyItemContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <View style={styles.historyItemMeta}>
        <Text style={styles.completedAt}>
          {new Date(item.completedAt).toLocaleString()}
        </Text>
        <Text style={styles.duration}>{item.duration}s</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer History</Text>
        <TouchableOpacity onPress={exportHistory} style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export History</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${item.completedAt}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exportButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  historyItemContent: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyItemMeta: {
    alignItems: 'flex-end',
  },
  completedAt: {
    fontSize: 12,
    color: '#6b7280',
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Export;