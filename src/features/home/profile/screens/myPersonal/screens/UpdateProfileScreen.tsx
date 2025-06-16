import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../stores/store';
import { useUpdateProfileHook } from '../hooks/useUpdateProfileHook';
import FormInput from '../../../../../auth/components/FormInput';
import DatePickerComponent from '../../../../../auth/components/DatePicker';
import ButtonAction from '../../../../../auth/components/ButtonAction';
import LoadingOverlay from '../../../../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../../../../utils/toasts/useToast';
import {
  validateEmail,
  validateRequired,
  formatDateToString
} from '../../../../../../utils/validations/validations';

const UpdateProfileScreen = ({navigation}: any) => {
  // Get user data from Redux store
  const role = useSelector((state: RootState) => state.auth.role);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState<Date | null>(null);

  // Helper hooks
  const { showError } = useToast();
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfileHook();
  
  // Handle navigation after successful update
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigation.goBack();
      }, 1500); // Wait for success toast to be visible
    }
  }, [isSuccess, navigation]);
  
  // Format role for display
  const roleDisplay = role === 'MOTHER' ? 'Mẹ' : role === 'FATHER' ? 'Bố' : 'Chưa xác định';

  // Handle form submission
  const handleSaveProfile = () => {
    // Validation
    let errorMessage = validateRequired(fullName, 'họ và tên');
    if (errorMessage) {
      showError(errorMessage);
      return;
    }
    
    errorMessage = validateRequired(email, 'email');
    if (errorMessage) {
      showError(errorMessage);
      return;
    }
    
    if (!validateEmail(email)) {
      showError('Email không hợp lệ');
      return;
    }
    
    // Compare with current values to check if anything changed
    const hasChanges = 
      fullName !== '' ||
      email !== '' ||
      (dob && (!dob || new Date(dob).toDateString() !== dob.toDateString()));
      
    if (!hasChanges) {
      Alert.alert('Thông báo', 'Bạn chưa thay đổi thông tin nào.');
      return;
    }

    // Create update request
    const updateRequest = {
      fullName: fullName.trim(),
      email: email.trim(),
      dob: dob ? formatDateToString(dob) : undefined,
      role: role
    };
    
    // Call API to update profile
    updateProfile(updateRequest);
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
              value="Bạn không thể thay đổi vai trò sau khi đã đăng ký"
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