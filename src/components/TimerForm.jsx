import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useTimerStore } from '../store/timerStore';

const TimerForm = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [errors, setErrors] = useState({});
  const { width } = useWindowDimensions();

  const addTimer = useTimerStore((state) => state.addTimer);

  const validateInputs = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Timer name is required.';
    if (!duration.trim() || isNaN(duration)) newErrors.duration = 'Enter a valid duration.';
    if (!category.trim()) newErrors.category = 'Category is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    addTimer({
      name,
      duration: parseInt(duration, 10),
      category,
      halfwayAlert,
    });

    setName('');
    setDuration('');
    setCategory('');
    setHalfwayAlert(false);

    Alert.alert('Success', 'Timer added successfully.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { width: width > 600 ? '60%' : '90%' }]}>
          <Text style={styles.header}>Create New Timer</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Timer Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[styles.input, errors.name && styles.errorInput]}
              placeholder="Enter timer name"
              placeholderTextColor="#9ca3af"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              style={[styles.input, errors.duration && styles.errorInput]}
              placeholder="Enter duration"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
            {errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              style={[styles.input, errors.category && styles.errorInput]}
              placeholder="Enter category"
              placeholderTextColor="#9ca3af"
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <View style={styles.switchGroup}>
            <Switch
              value={halfwayAlert}
              onValueChange={setHalfwayAlert}
              trackColor={{ true: '#3b82f6', false: '#d1d5db' }}
              thumbColor={halfwayAlert ? '#fff' : '#f4f3f4'}
            />
            <Text style={styles.switchLabel}>Enable halfway alert</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Timer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    height: 48,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimerForm;
