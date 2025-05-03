import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onLogin }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            {/* add icon lock-person  */}
            <Icon name="lock-person" size={isTablet ? 48 : 38} color={Colors.primary} />
          </View>
          <Text style={styles.modalTitle}>Đăng nhập để tiếp tục</Text>
          <Text style={styles.modalText}>
            Bạn cần đăng nhập để truy cập tính năng này. Đăng nhập ngay để có trải nghiệm đầy đủ.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onLogin}>
              <Text style={styles.primaryButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: isTablet ? '60%' : '85%',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    padding: isTablet ? 30 : 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 144, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: isTablet ? 18 : 16,
    color: Colors.textBlack,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: isTablet ? 18 : 16,
  },
  secondaryButton: {
    backgroundColor: Colors.textGray,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: isTablet ? 18 : 16,
  },
});

export default AuthModal;