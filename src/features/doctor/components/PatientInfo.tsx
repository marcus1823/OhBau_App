import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import ToggleButtonGroup from './ToggleButtonGroup';
import CheckboxGroup from './CheckboxGroup';
import DescriptionInput from './DescriptionInput';
import FormInput from '../../auth/components/FormInput';
import HorizontalLine from './HorizontalLine';

interface PatientInfoProps {
  onInfoChange?: (info: {
    patientType: string;
    name: string;
    age: string;
    address: string;
    gender: string;
    visitPurpose: string[];
    description: string;
    phoneNumber?: string;
  }) => void;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ onInfoChange }) => {
  const [patientType, setPatientType] = useState<string>('Tôi');
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [gender, setGender] = useState<string>('Nam');
  const [visitPurpose, setVisitPurpose] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleInfoChange = () => {
    if (onInfoChange) {
      onInfoChange({
        patientType,
        name,
        age,
        address,
        gender,
        visitPurpose,
        description,
        ...(patientType === 'Người khác' && { phoneNumber }),
      });
    }
  };

  return (
    <View style={styles.container}>
      <HorizontalLine />
      <Text style={styles.title}>Thông Tin Bệnh Nhân</Text>

      <ToggleButtonGroup
        options={['Tôi', 'Người khác']}
        onValueChange={(value) => {
          setPatientType(value);
          handleInfoChange();
        }}
        defaultValue="Tôi"
      />

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

      <FormInput
        title="Địa Chỉ"
        titleFontSize={12}
        placeholder="Nhập địa chỉ"
        keyboardType="default"
        onChangeText={(text) => {
          setAddress(text);
          handleInfoChange();
        }}
        value={address}
      />

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

      <ToggleButtonGroup
        options={['Nam', 'Nữ', 'Khác']}
        onValueChange={(value) => {
          setGender(value);
          handleInfoChange();
        }}
        defaultValue="Nam"
      />
      <HorizontalLine />

      <Text style={styles.sectionTitle}>Bạn muốn khám gì?</Text>
      <CheckboxGroup
        options={['Khám Thai', 'Khám Phụ Khoa', 'Tái khám', 'Khác']}
        onValueChange={(selected) => {
          setVisitPurpose(selected);
          handleInfoChange();
        }}
      />

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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textBlack,
    marginBottom: 10,
  },
});