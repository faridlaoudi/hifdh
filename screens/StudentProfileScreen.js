import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, TextInput, Platform,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const mapAmountToArabic = (amount) => {
  let result = '';
  const num = parseInt(amount, 10);

  if (num % 8 === 0) {
    result += `${num / 8} حزب`;
  } else if (num % 4 === 0) {
    result += `${num / 4} نصف`;
  } else if (num % 2 === 0) {
    result += `${num / 2} ربع`;
  } else {
    result += num + ' ثمن ';
  }
  return result;
};

const StudentProfileScreen = ({ route }) => {
  const { student } = route.params;
  const [records, setRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);

  useEffect(() => {
    loadRecords(); // Load records from AsyncStorage when screen loads
  }, []);

  const loadRecords = async () => {
    try {
      const savedRecords = await AsyncStorage.getItem(`records_${student.id}`);
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }
    } catch (error) {
      console.log('Error loading records', error);
    }
  };

  const saveRecords = async (newRecords) => {
    try {
      await AsyncStorage.setItem(`records_${student.id}`, JSON.stringify(newRecords));
    } catch (error) {
      console.log('Error saving records', error);
    }
  };

  const addRecord = () => {
    if (newAmount.trim().length === 0) return;
  
    const mappedAmount = mapAmountToArabic(newAmount);  // Map the amount to Arabic
  
    const newRecord = { id: Math.random().toString(), date: date.toLocaleDateString(), amount: mappedAmount };
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    saveRecords(updatedRecords);  // Save the updated records to AsyncStorage
    setNewAmount('');
    setModalVisible(false);
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Edit Record
  const editRecord = (record) => {
    setNewAmount(record.amount);
    setDate(new Date(record.date));
    setEditRecordId(record.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const updateRecord = () => {
    const updatedRecords = records.map(record =>
      record.id === editRecordId ? { ...record, amount: newAmount, date: date.toLocaleDateString() } : record
    );
    setRecords(updatedRecords);
    saveRecords(updatedRecords);
    setModalVisible(false);
    setNewAmount('');
    setIsEditing(false);
    setEditRecordId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{student.name}</Text>

      <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}></Text>
        <Text style={styles.tableHeaderText}>المقدار</Text>
        <Text style={styles.tableHeaderText}>التاريخ</Text>
      </View>

      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Pressable style={styles.editButton} onPress={() => editRecord(item)}>
              <Text style={styles.editButtonText}>تعديل</Text>
            </Pressable>
            <Text style={styles.recordAmount}>{item.amount}</Text>
            <Text style={styles.recordDate}>{item.date}</Text>

          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Record' : 'إضافة سجل جديد'}</Text>
          <Pressable onPress={showDatepicker}>
            <Text style={styles.textInput}>تاريخ: {date.toLocaleDateString()}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TextInput
            placeholder="أدخل مقدار الحفظ"
            value={newAmount}
            onChangeText={setNewAmount}
            keyboardType="numeric"  // Add this to ensure only numbers
            style={styles.textInput}
          />
          <Button title={isEditing ? 'تعديل' : 'إضافة'} onPress={isEditing ? updateRecord : addRecord} />
          <Button title="إلغاء" onPress={() => { setModalVisible(false); setIsEditing(false); setNewAmount(''); }} />
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#6A2E2E',
  },
  tableHeaderText: {
    fontSize: 18,
    color: '#F2DB94',
    fontWeight: 'bold',
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#6A2E2E',
    marginVertical: 5,
    borderRadius: 5,
  },
  recordAmount: {
    color: '#F2DB94',
    fontSize: 18,
  },
  recordDate: {
    color: '#F2DB94',
    fontSize: 18,
  },
  editButton: {
    backgroundColor: '#F2DB94',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#430C11',
    fontSize: 14,
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
    textAlign: 'right',
  },
});

export default StudentProfileScreen;
