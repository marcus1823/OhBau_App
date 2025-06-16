import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useEditFetusMutation } from '../../../hooks/useEditFetusMutation';
import { useEditFetusDetailMutation } from '../../../hooks/useEditFetusMutation';
import { EditFetusDetailRequest, EditFetusRequest } from '../../../../types/family.type';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';

const EditFetusScreen = ({ route, navigation }: any) => {
  const { fetusData, fetusDetail, accessToken } = route.params;

  const [fetusRequest, setFetusRequest] = useState<EditFetusRequest>({
    startDate: fetusData.startDate,
    endDate: fetusData.endDate,
    name: fetusData.name,
  });

  const [detailRequest, setDetailRequest] = useState<EditFetusDetailRequest>({
    weekly: fetusDetail?.weekly ?? 0,
    weight: fetusDetail?.weight ?? 0,
    height: fetusDetail?.height ?? 0,
    bpm: fetusDetail?.bpm ?? 0,
    movement: fetusDetail?.movement ?? 0,
    gsd: fetusDetail?.gsd ?? 0,
    crl: fetusDetail?.crl ?? 0,
    bpd: fetusDetail?.bpd ?? 0,
    fl: fetusDetail?.fl ?? 0,
    hc: fetusDetail?.hc ?? 0,
    ac: fetusDetail?.ac ?? 0,
  });

  const editFetusMutation = useEditFetusMutation();
  const editFetusDetailMutation = useEditFetusDetailMutation();

  // Helper function to handle numeric input with decimal values
  const handleNumericInput = (text: string, field: keyof EditFetusDetailRequest) => {
    // Replace commas with periods to standardize decimal separator
    const sanitizedText = text.replace(',', '.');
    
    // Allow empty string to clear the field
    if (sanitizedText === '') {
      setDetailRequest({ ...detailRequest, [field]: 0 });
      return;
    }

    // Check if the input is a valid number (integer or float)
    if (/^-?\d*\.?\d*$/.test(sanitizedText)) {
      const value = parseFloat(sanitizedText);
      
      // Only update if it's a valid number or empty
      if (!isNaN(value) || sanitizedText === '' || sanitizedText === '.') {
        setDetailRequest({ ...detailRequest, [field]: sanitizedText === '.' ? 0 : value });
      }
    }
  };

  const handleSaveBasicInfo = () => {
    if (!fetusData.id) {
      Alert.alert('Lỗi', 'Không tìm thấy ID thai nhi.');
      return;
    }

    editFetusMutation.mutate(
      { id: fetusData.id, request: fetusRequest, accessToken },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Cập nhật thông tin cơ bản thai nhi thành công.');
          console.log('Fetus info updated successfully');
        },
        onError: (error) => {
          Alert.alert('Lỗi', `Không thể cập nhật thông tin cơ bản thai nhi: ${error.message}`);
        },
      }
    );
  };

  const handleSaveDetails = () => {
    if (!fetusData.id) {
      Alert.alert('Lỗi', 'Không tìm thấy ID thai nhi.');
      return;
    }

    editFetusDetailMutation.mutate(
      { id: fetusData.id, request: detailRequest, accessToken },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Cập nhật chi tiết thai nhi thành công.');
          console.log('Fetus detail updated successfully');
          navigation.goBack();
        },
        onError: (error) => {
          Alert.alert('Lỗi', `Không thể cập nhật chi tiết thai nhi: ${error.message}`);
        },
      }
    );
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Chỉnh sửa thai nhi"
        onBackButtonPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Basic Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày bắt đầu:</Text>
            <TextInput
              style={styles.input}
              value={fetusRequest.startDate || ''}
              onChangeText={(text) => setFetusRequest({ ...fetusRequest, startDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày kết thúc:</Text>
            <TextInput
              style={styles.input}
              value={fetusRequest.endDate || ''}
              onChangeText={(text) => setFetusRequest({ ...fetusRequest, endDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên:</Text>
            <TextInput
              style={styles.input}
              value={fetusRequest.name || ''}
              onChangeText={(text) => setFetusRequest({ ...fetusRequest, name: text })}
              placeholder="Nhập tên thai nhi"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity
            style={[styles.saveButton, editFetusMutation.isPending && styles.disabledButton]}
            onPress={handleSaveBasicInfo}
            disabled={editFetusMutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {editFetusMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin cơ bản'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fetus Details Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chi tiết thai nhi</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tuần thai:</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.weekly?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'weekly')}
              keyboardType="numeric"
              placeholder="Nhập số tuần (ví dụ: 12.5)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cân nặng (kg):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.weight?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'weight')}
              keyboardType="numeric"
              placeholder="Nhập cân nặng (ví dụ: 1.5)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chiều dài (cm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.height?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'height')}
              keyboardType="numeric"
              placeholder="Nhập chiều dài (ví dụ: 50.2)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nhịp tim (bpm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.bpm?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'bpm')}
              keyboardType="numeric"
              placeholder="Nhập nhịp tim (ví dụ: 120.5)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chuyển động (lần):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.movement?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'movement')}
              keyboardType="numeric"
              placeholder="Nhập số lần chuyển động"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>GSD (mm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.gsd?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'gsd')}
              keyboardType="numeric"
              placeholder="Nhập GSD (ví dụ: 10.5)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CRL (mm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.crl?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'crl')}
              keyboardType="numeric"
              placeholder="Nhập CRL (ví dụ: 20.3)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>BPD (mm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.bpd?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'bpd')}
              keyboardType="numeric"
              placeholder="Nhập BPD (ví dụ: 30.7)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FL (mm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.fl?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'fl')}
              keyboardType="numeric"
              placeholder="Nhập FL (ví dụ: 15.2)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>HC (mm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.hc?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'hc')}
              keyboardType="numeric"
              placeholder="Nhập HC (ví dụ: 100.4)"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>AC (mm):</Text>
            <TextInput
              style={styles.input}
              value={detailRequest.ac?.toString() || '0'}
              onChangeText={(text) => handleNumericInput(text, 'ac')}
              keyboardType="numeric"
              placeholder="Nhập AC (ví dụ: 90.8)"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity
            style={[styles.saveButton, editFetusDetailMutation.isPending && styles.disabledButton]}
            onPress={handleSaveDetails}
            disabled={editFetusDetailMutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {editFetusDetailMutation.isPending ? 'Đang lưu...' : 'Lưu chi tiết thai nhi'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditFetusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1e90ff',
    paddingBottom: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#2c3e50',
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
});