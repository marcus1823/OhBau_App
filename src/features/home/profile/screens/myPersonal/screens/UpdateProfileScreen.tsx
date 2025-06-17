import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import { useUpdateProfileHook } from '../hooks/useUpdateProfileHook';
import FormInput from '../../../../../auth/components/FormInput';
import DatePickerComponent from '../../../../../auth/components/DatePicker';
import ButtonAction from '../../../../../auth/components/ButtonAction';
import LoadingOverlay from '../../../../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../../../../utils/toasts/useToast';
import {
  validateEmail,
  formatDateToString
} from '../../../../../../utils/validations/validations';

const UpdateProfileScreen = ({navigation, route}: any) => {
  // Get user data from Redux store
  const { profileData, role } = route.params;
  console.log('UpdateProfileScreen profileData:', profileData);
  
  // Form state initialized with existing profileData
  const [fullName, setFullName] = useState(profileData?.fullName || '');
  const [email, setEmail] = useState(profileData?.email || '');
  const [dob, setDob] = useState<Date | null>(
    profileData?.dob ? new Date(profileData.dob) : null
  );

  // Keep track of original values to detect changes
  const originalValues = {
    fullName: profileData?.fullName || '',
    email: profileData?.email || '',
    dob: profileData?.dob ? new Date(profileData.dob) : null
  };

  // Helper hooks
  const { showError, showSuccess } = useToast();
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfileHook();
  
  // Handle navigation after successful update
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        // Create an updated profile object with the new values
        const updatedProfile = {
          ...profileData,
          fullName: fullName.trim() || profileData?.fullName,
          email: email.trim() || profileData?.email,
          dob: dob ? formatDateToString(dob) : profileData?.dob,
        };
        // Use replace instead of navigate to remove UpdateProfileScreen from the stack
        navigation.replace('PersonalScreen', { 
          profileData: updatedProfile, 
          role, 
          refresh: true 
        });
      }, 1500); // Wait for success toast to be visible
    }
  }, [dob, email, fullName, isSuccess, navigation, profileData, role]);
  
  // Format role for display
  const roleDisplay = role === 'MOTHER' ? 'Mẹ' : role === 'FATHER' ? 'Bố' : 'Chưa xác định';

  // Check if a value has changed from its original
  const hasValueChanged = (field: string, value: any, originalValue: any): boolean => {
    if (field === 'dob') {
      // For dates, compare the formatted string values
      if (!value && !originalValue) {return false;}
      if (!value || !originalValue) {return true;}
      return formatDateToString(value) !== formatDateToString(originalValue);
    }
    return value !== originalValue;
  };

  // Handle form submission
  const handleSaveProfile = () => {
    // Email validation only if changed
    if (email && email !== originalValues.email) {
      if (!validateEmail(email)) {
        showError('Email không hợp lệ');
        return;
      }
    }
    
    // Check if anything has changed
    const hasChanges = 
      hasValueChanged('fullName', fullName, originalValues.fullName) ||
      hasValueChanged('email', email, originalValues.email) ||
      hasValueChanged('dob', dob, originalValues.dob);
      
    if (!hasChanges) {
      Alert.alert('Thông báo', 'Bạn chưa thay đổi thông tin nào.');
      return;
    }

    // Create update request with only changed fields
    const updateRequest: any = { role };
    
    if (hasValueChanged('fullName', fullName, originalValues.fullName)) {
      updateRequest.fullName = fullName.trim();
    }
    
    if (hasValueChanged('email', email, originalValues.email)) {
      updateRequest.email = email.trim();
    }
    
    if (hasValueChanged('dob', dob, originalValues.dob)) {
      updateRequest.dob = dob ? formatDateToString(dob) : null;
    }
    
    // Call API to update profile
    updateProfile(updateRequest);
    showSuccess('Đang cập nhật thông tin...');
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader 
        title="Cập nhật thông tin" 
        onBackButtonPress={() => navigation.goBack()}
      />
      
      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <FormInput
            title="Họ và tên"
            placeholder="Nhập họ và tên của bạn"
            value={fullName}
            onChangeText={setFullName}
            titleFontSize={16}
          />
          
          <FormInput
            title="Email"
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            titleFontSize={16}
          />
          
          <DatePickerComponent
            title="Ngày sinh"
            placeholder="Chọn ngày sinh của bạn"
            selectedDate={dob || new Date()}
            onDateChange={(date) => setDob(date)}
          />
          
          <FormInput
            title="Vai trò"
            value={roleDisplay}
            disabled={true}
            titleFontSize={16}
          />
          
          <View style={styles.noteContainer}>
            <FormInput
              title="Lưu ý"
              value="Tất cả thông tin đều không bắt buộc. Bạn không thể thay đổi vai trò sau khi đã đăng ký."
              disabled={true}
              titleFontSize={14}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <ButtonAction
              title="Lưu thông tin"
              backgroundColor={Colors.primary}
              color={Colors.textWhite}
              onPress={handleSaveProfile}
              disabled={isPending}
            />
          </View>
        </View>
      </ScrollView>
      
      <LoadingOverlay visible={isPending} fullScreen={false} />
    </LinearGradient>
  );
}

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: Colors.textWhite,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  noteContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.textLightGray,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
  }
});