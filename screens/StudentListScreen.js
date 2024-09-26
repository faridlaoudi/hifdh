import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal, Button, TextInput, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    I18nManager.forceRTL(true);
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const savedStudents = await AsyncStorage.getItem('students');
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }
    } catch (error) {
      console.log('Error loading students', error);
    }
  };

  const saveStudents = async (students) => {
    try {
      await AsyncStorage.setItem('students', JSON.stringify(students));
    } catch (error) {
      console.log('Error saving students', error);
    }
  };

  const addStudent = () => {
    if (newStudentName.trim().length === 0) return;
    const newStudent = { id: Math.random().toString(), name: newStudentName };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    setNewStudentName('');
    setModalVisible(false);
  };

  const deleteStudent = (studentId) => {
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تتبع الطلاب</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.studentItem}
            onPress={() => navigation.navigate('StudentProfile', { student: item })}
          >
            <Text style={styles.studentName}>{item.name}</Text>
            <Pressable style={styles.deleteButton} onPress={() => deleteStudent(item.id)}>
              <Text style={styles.deleteButtonText}>حذف</Text>
            </Pressable>
          </Pressable>
        )}
      />

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

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentName: {
    fontSize: 20,
    color: '#F2DB94',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#6A2E2E',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
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
    textAlign: 'right',
  },
});

export default StudentListScreen;
