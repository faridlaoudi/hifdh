import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, TextInput, I18nManager } from 'react-native';

const StudentProfileScreen = ({ route }) => {
  const { student } = route.params;
  const [records, setRecords] = useState([
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // Enable RTL for Arabic layout
  useEffect(() => {
    I18nManager.forceRTL(true);
  }, []);

  const addRecord = () => {
    if (newDate.trim().length === 0 || newAmount.trim().length === 0) return;
    const newRecord = { id: Math.random().toString(), date: newDate, amount: newAmount };
    setRecords([...records, newRecord]);
    setNewDate('');
    setNewAmount('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{student.name}</Text>
      
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>المقدار</Text>
        <Text style={styles.tableHeaderText}>التاريخ</Text>

      </View>

      {/* Table Body */}
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordRow}>
            <Text style={styles.recordText}>{item.amount}</Text>
            <Text style={styles.recordText}>{item.date}</Text>
          </View>
        )}
      />

      {/* Modal for Adding Record */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>إضافة سجل جديد</Text>
          <TextInput
            placeholder="أدخل التاريخ"
            value={newDate}
            onChangeText={setNewDate}
            style={styles.textInput}
          />
          <TextInput
            placeholder="أدخل المقدار"
            value={newAmount}
            onChangeText={setNewAmount}
            style={styles.textInput}
          />
          <Button title="إضافة السجل" onPress={addRecord} />
          <Button title="إلغاء" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Add Record Button */}
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F2DB94',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 18,
    color: '#F2DB94',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#6A2E2E',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  recordText: {
    fontSize: 16,
    color: '#F2DB94',
    textAlign: 'right',
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
    textAlign: 'right', // Align input text to right for Arabic
  },
});

export default StudentProfileScreen;
