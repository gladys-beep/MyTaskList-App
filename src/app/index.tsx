
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Priority = 'Tinggi' | 'Sedang' | 'Rendah';
type Filter = 'Semua' | 'Aktif' | 'Selesai';

type Task = {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  time: string;
};

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priority, setPriority] = useState<Priority>('Sedang');
  const [filter, setFilter] = useState<Filter>('Semua');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Menambahkan task baru
  const addTask = () => {
    if (inputText.trim() === '') {
      Alert.alert('Peringatan', 'Nama tugas tidak boleh kosong!');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: inputText.trim(),
      priority: priority,
      completed: false,
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTasks((previousTasks) => [newTask, ...previousTasks]);
    setInputText('');
    setPriority('Sedang');
  };

  // Menghapus task
  const deleteTask = (id: string) => {
    Alert.alert(
      'Hapus Tugas',
      'Apakah kamu yakin ingin menghapus tugas ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setTasks((previousTasks) =>
              previousTasks.filter((task) => task.id !== id)
            );
          },
        },
      ]
    );
  };

  // Mengubah status task
  const toggleTask = (id: string) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Menghitung task selesai
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  // Filter daftar task
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Aktif') return !task.completed;
    if (filter === 'Selesai') return task.completed;
    return true;
  });

  // Warna prioritas
  const getPriorityColor = (value: Priority) => {
    if (value === 'Tinggi') return '#ff5555';
    if (value === 'Sedang') return '#e3a83b';
    return '#3fb950';
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={[
          styles.checkButton,
          item.completed && styles.checkedButton,
        ]}
        onPress={() => toggleTask(item.id)}
      >
        <Text style={styles.checkText}>
          {item.completed ? '✓' : ''}
        </Text>
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            item.completed && styles.completedTitle,
          ]}
        >
          {item.title}
        </Text>

        <View style={styles.taskInfo}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {item.priority}
            </Text>
          </View>

          <Text style={styles.taskTime}>
            {item.time}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            MyTaskList ✨
          </Text>

          <Text style={styles.subtitle}>
            Atur tugasmu, capai tujuanmu!
          </Text>

          <View style={styles.statsCard}>
            <View>
              <Text style={styles.statsNumber}>
                {completedCount}/{tasks.length}
              </Text>
              <Text style={styles.statsLabel}>
                Tugas selesai
              </Text>
            </View>

            <Text style={styles.statsEmoji}>🎯</Text>
          </View>
        </View>

        {/* FORM INPUT */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>
            Tambahkan Tugas Baru
          </Text>

          <TextInput
            style={[
              styles.input,
              isInputFocused && styles.inputFocused,
            ]}
            placeholder="Apa yang ingin kamu kerjakan?"
            placeholderTextColor="#778397"
            value={inputText}
            onChangeText={setInputText}
            maxLength={100}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          <Text style={styles.charCounter}>
            {inputText.length}/100 karakter
          </Text>

          <Text style={styles.priorityLabel}>
            Pilih Prioritas
          </Text>

          <View style={styles.priorityOptions}>
            {(['Tinggi', 'Sedang', 'Rendah'] as Priority[]).map(
              (value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.priorityOption,
                    priority === value && {
                      backgroundColor: getPriorityColor(value),
                      borderColor: getPriorityColor(value),
                    },
                  ]}
                  onPress={() => setPriority(value)}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      priority === value && styles.selectedPriorityText,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={addTask}
          >
            <Text style={styles.addButtonText}>
              + Tambah Tugas
            </Text>
          </TouchableOpacity>
        </View>

        {/* FILTER */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>
            Daftar Tugas
          </Text>

          <View style={styles.filterOptions}>
            {(['Semua', 'Aktif', 'Selesai'] as Filter[]).map(
              (value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.filterButton,
                    filter === value && styles.activeFilter,
                  ]}
                  onPress={() => setFilter(value)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === value && styles.activeFilterText,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* TASK LIST */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>
                {tasks.length === 0
                  ? 'Belum ada tugas'
                  : 'Tidak ada tugas di sini'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {tasks.length === 0
                  ? 'Yuk, tambahkan tugas pertamamu!'
                  : 'Coba pilih filter yang lain.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// STYLING
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101827',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#61dafb',
  },
  subtitle: {
    color: '#aab5c5',
    fontSize: 14,
    marginTop: 5,
  },
  statsCard: {
    backgroundColor: '#1c2a3d',
    padding: 16,
    borderRadius: 14,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#61dafb',
  },
  statsLabel: {
    color: '#aab5c5',
    marginTop: 3,
  },
  statsEmoji: {
    fontSize: 30,
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#263449',
  },
  sectionTitle: {
    color: '#f1f5f9',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1c2a3d',
    borderWidth: 1,
    borderColor: '#34445a',
    borderRadius: 10,
    padding: 13,
    color: '#ffffff',
    fontSize: 14,
  },
  inputFocused: {
    borderColor: '#61dafb',
  },
  charCounter: {
    color: '#8b9bb0',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 5,
  },
  priorityLabel: {
    color: '#dce5f1',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 8,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#40516a',
    alignItems: 'center',
  },
  priorityOptionText: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 12,
  },
  selectedPriorityText: {
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#238636',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1c2a3d',
  },
  activeFilter: {
    backgroundColor: '#61dafb',
  },
  filterText: {
    color: '#bdc9d9',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#101827',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 25,
    flexGrow: 1,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2a3d',
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    gap: 10,
  },
  checkButton: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#61dafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedButton: {
    backgroundColor: '#238636',
    borderColor: '#238636',
  },
  checkText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#8290a3',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 7,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  taskTime: {
    color: '#8b9bb0',
    fontSize: 11,
  },
  deleteButton: {
    backgroundColor: '#3a2028',
    padding: 8,
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#dce5f1',
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#8290a3',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});
