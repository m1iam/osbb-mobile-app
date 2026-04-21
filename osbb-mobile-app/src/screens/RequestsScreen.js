import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RequestsScreen({
  goBack,
  requests,
  addRequest,
  deleteRequest,
  changeRequestStatus,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddRequest = () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    addRequest(title, description);
    setTitle('');
    setDescription('');
  };

  const getStatusStyle = (status) => {
    if (status === 'Нова') {
      return styles.statusNew;
    }
    if (status === 'В роботі') {
      return styles.statusInProgress;
    }
    if (status === 'Виконано') {
      return styles.statusDone;
    }
    return styles.statusNew;
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.requestTitle}>{item.title}</Text>
      <Text style={styles.requestDescription}>{item.description}</Text>

      <Text style={[styles.requestStatus, getStatusStyle(item.status)]}>
        Статус: {item.status}
      </Text>

      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => changeRequestStatus(item.id)}
      >
        <Text style={styles.statusButtonText}>Змінити статус</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteRequest(item.id)}
      >
        <Text style={styles.deleteButtonText}>Видалити</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Назад</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Мої заявки</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Введіть тему заявки"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Введіть опис проблеми"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddRequest}>
          <Text style={styles.addButtonText}>Додати заявку</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listTitle}>Список заявок</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Поки що заявок немає.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B2A41',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B2A41',
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  requestDescription: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 8,
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusNew: {
    color: '#2563EB',
  },
  statusInProgress: {
    color: '#D97706',
  },
  statusDone: {
    color: '#059669',
  },
  statusButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 15,
  },
});