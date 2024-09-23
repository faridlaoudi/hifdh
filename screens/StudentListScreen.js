import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, TextInput, I18nManager } from 'react-native';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([{ id: '1', name: 'فريد' }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  // Enable RTL for Arabic layout
  useEffect(() => {
    I18nManager.forceRTL(true);
  }, []);

  const addStudent = () => {
    if (newStudentName.trim().length === 0) return;
    const newStudent = { id: Math.random().toString(), name: newStudentName };
    setStudents([...students, newStudent]);
    setNewStudentName('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تتبع الطلاب</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentItem}
            onPress={() => navigation.navigate('StudentProfile', { student: item })}
          >
            <Text style={styles.studentName}>{item.name}</Text>

          </TouchableOpacity>
        )}
      />

      {/* Modal for Adding Student */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>إضافة طالب جديد</Text>
          <TextInput
            placeholder="أدخل اسم الطالب"
            value={newStudentName}
            onChangeText={setNewStudentName}
            style={styles.textInput}
          />
          <Button title="إضافة الطالب" onPress={addStudent} />
          <Button title="إلغاء" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Add Student Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#430C11',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#F2DB94',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  studentItem: {
    backgroundColor: '#6A2E2E',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  studentName: {
    fontSize: 20,
    color: '#F2DB94',
    fontWeight: 'bold',
    textAlign: 'right', // Align text to the right
  },
  lastTime: {
    fontSize: 14,
    color: '#F2DB94',
    marginTop: 5,
    textAlign: 'right', // Align text to the right
  },
  addButton: {
    position: 'absolute',
    left: 20, // Moved to the left in RTL layout
    bottom: 20,
    backgroundColor: '#6A2E2E',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    color: '#F2DB94',
    fontSize: 30,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 6,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'right', // Text input aligned to the right
  },
});

export default StudentListScreen;
