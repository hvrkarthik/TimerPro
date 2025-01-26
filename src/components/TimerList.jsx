import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { useTimerStore } from '../store/timerStore';

const TimerItem = ({ timer }) => {
  const { startTimer, pauseTimer, resetTimer, updateTimer } = useTimerStore();
  const progress = new Animated.Value(
    ((timer.duration - timer.remainingTime) / timer.duration) * 100
  );

  useEffect(() => {
    let interval;
    if (timer.status === 'running') {
      interval = setInterval(() => {
        updateTimer(timer.id);
      }, 1000);
    }

    Animated.timing(progress, {
      toValue: ((timer.duration - timer.remainingTime) / timer.duration) * 100,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, [timer.status, timer.remainingTime]);

  return (
    <View style={styles.timerItem}>
      <View style={styles.header}>
        <Text style={styles.timerName}>{timer.name}</Text>
        <Text style={styles.category}>{timer.category}</Text>
      </View>

      <View style={styles.progressBar}>
        <Animated.View style={[styles.progress, { width: `${progress._value}%` }]} />
      </View>

      <View style={styles.controls}>
        <Text style={styles.remainingTime}>{timer.remainingTime}s</Text>
        <View style={styles.buttonGroup}>
          {timer.status === 'running' ? (
            <TouchableOpacity
              onPress={() => pauseTimer(timer.id)}
              style={styles.pauseButton}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => startTimer(timer.id)}
              style={styles.startButton}
              disabled={timer.status === 'completed'}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => resetTimer(timer.id)}
            style={styles.resetButton}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const TimerList = () => {
  const timers = useTimerStore((state) => state.timers);
  const { startCategoryTimers, pauseCategoryTimers, resetCategoryTimers } = useTimerStore();
  const categories = [...new Set(timers.map((timer) => timer.category))];
  const [expandedCategories, setExpandedCategories] = useState(categories);
  const { width } = useWindowDimensions();

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {categories.map((category) => (
        <View key={category} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <TouchableOpacity onPress={() => toggleCategory(category)}>
              <Text style={styles.categoryTitle}>
                {category} {expandedCategories.includes(category) ? '▼' : '▶(click to expand)'}
              </Text>
            </TouchableOpacity>
            <View style={styles.categoryButtons}>
              <TouchableOpacity
                onPress={() => startCategoryTimers(category)}
                style={styles.startAllButton}
              >
                <Text style={styles.buttonText}>Start All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pauseCategoryTimers(category)}
                style={styles.pauseAllButton}
              >
                <Text style={styles.buttonText}>Pause All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => resetCategoryTimers(category)}
                style={styles.resetAllButton}
              >
                <Text style={styles.buttonText}>Reset All</Text>
              </TouchableOpacity>
            </View>
          </View>

          {expandedCategories.includes(category) && (
            <Animated.View
              style={[
                styles.timersList,
                {
                  width: width > 600 ? '60%' : '100%',
                },
              ]}
            >
              {timers
                .filter((timer) => timer.category === category)
                .map((timer) => (
                  <TimerItem key={timer.id} timer={timer} />
                ))}
            </Animated.View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 27,
    paddingTop: 5,
    backgroundColor: '#f3f4f6',
  },
  categoryContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  categoryHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
    color: '#374151',
  },
  categoryButtons: {
    flexDirection: 'row',
  },
  startAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#10b981',
    borderRadius: 8,
    marginRight: 8,
  },
  pauseAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    marginRight: 8,
  },
  resetAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#6b7280',
    borderRadius: 8,
  },
  timersList: {
    marginTop: 8,
  },
  timerItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timerName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    marginBottom: 12,
  },
  progress: {
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingTime: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#10b981',
    borderRadius: 8,
    marginRight: 8,
  },
  pauseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    marginRight: 8,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6b7280',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TimerList;