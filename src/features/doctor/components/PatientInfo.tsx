import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import ToggleButtonGroup from './ToggleButtonGroup';
import DescriptionInput from './DescriptionInput';
import FormInput from '../../auth/components/FormInput';
import HorizontalLine from './HorizontalLine';

interface PatientInfoProps {
  onInfoChange?: (info: {
    patientType: string;
    name: string;
    age: string;
    gender: string;
    description: string;
    phoneNumber?: string; // Thêm trường số điện thoại, tùy chọn
  }) => void;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ onInfoChange }) => {
  const [patientType, setPatientType] = useState<string>('Tôi');
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('Nam');
  const [description, setDescription] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Thêm state cho số điện thoại

  const handleInfoChange = () => {
    if (onInfoChange) {
      onInfoChange({
        patientType,
        name,
        age,
        gender,
        description,
        ...(patientType === 'Người khác' && { phoneNumber }), // Chỉ thêm phoneNumber nếu là "Người khác"
      });
    }
  };

  return (
    <View style={styles.container}>
      <HorizontalLine />
      <Text style={styles.title}>Thông Tin Bệnh Nhân</Text>

      {/* Phần "Tôi" hay "Người khác" */}
      <ToggleButtonGroup
        options={['Tôi', 'Người khác']}
        onValueChange={(value) => {
          setPatientType(value);
          handleInfoChange();
        }}
        defaultValue="Tôi"
      />

      {/* Họ và Tên */}
      <FormInput
        title="Họ và Tên"
        titleFontSize={12}
        placeholder="Nhập họ và tên"
        keyboardType="default"
        onChangeText={(text) => {
          setName(text);
          handleInfoChange();
        }}
        value={name}
      />

      {/* Tuổi */}
      <FormInput
        title="Tuổi"
        titleFontSize={12}
        placeholder="Nhập tuổi"
        keyboardType="phone-pad"
        onChangeText={(text) => {
          setAge(text);
          handleInfoChange();
        }}
        value={age}
      />
       {/* Số điện thoại (chỉ hiển thị khi chọn "Người khác") */}
      {patientType === 'Người khác' && (
        <FormInput
          title="Số Điện Thoại"
          titleFontSize={12}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          onChangeText={(text) => {
            setPhoneNumber(text);
            handleInfoChange();
          }}
          value={phoneNumber}
        />
      )}

      {/* Giới tính */}
      <ToggleButtonGroup
        options={['Nam', 'Nữ', 'Khác']}
        onValueChange={(value) => {
          setGender(value);
          handleInfoChange();
        }}
        defaultValue="Nam"
      />
      <HorizontalLine />

     

      {/* Mô tả triệu chứng */}
      <DescriptionInput
        title="Mô tả Triệu chứng"
        titleFontSize={12}
        placeholder="Nhập mô tả triệu chứng..."
        onChangeText={(text) => {
          setDescription(text);
          handleInfoChange();
        }}
        value={description}
      />
    </View>
  );
};

export default PatientInfo;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
});