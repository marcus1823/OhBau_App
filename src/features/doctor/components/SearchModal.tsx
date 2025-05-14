import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import DoctorCard from './DoctorCard';
import { GetDoctorResponse } from '../types/doctor.type';
import { getDoctorApi } from '../api/doctorApi';
import { useSearch } from '../../../utils/search/useSearch';

// =========================
// Hàm gọi API để tìm kiếm bác sĩ
// =========================
const searchDoctors = async (query: string) => {
  const request = {
    pageSize: 10,
    pageNumber: 1,
    doctorName: query,
  };
  const response = await getDoctorApi(request);
  return { items: response.items || [] };
};

// =========================
// Props cho SearchModal
// =========================
interface SearchModalProps {
  visible: boolean;                  // Có hiển thị modal hay không
  onClose: () => void;              // Hàm đóng modal
  onInfoPress: (id: string) => void; // Khi nhấn vào bác sĩ
}

// =========================
// Component: SearchModal
// =========================
const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose, onInfoPress }) => {
  // Hook tìm kiếm bác sĩ sử dụng custom hook useSearch
  const { searchQuery, setSearchQuery, results, isLoading } = useSearch<GetDoctorResponse>(
    searchDoctors,
    visible // chỉ tìm khi modal được mở
  );
  
  // State dùng cho input tìm kiếm (khác với searchQuery để debounce)
  const [inputValue, setInputValue] = useState('');

  // Khi modal đóng, reset inputValue để clear text search
  useEffect(() => {
    if (!visible) {
      setInputValue('');
    }
  }, [visible]);

  // Debounce: chỉ cập nhật searchQuery sau 300ms người dùng ngừng gõ
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue); // cập nhật giá trị vào hook useSearch
    }, 300);

    return () => {
      clearTimeout(handler); // Clear timeout nếu người dùng gõ tiếp
    };
  }, [inputValue, setSearchQuery]);

  // Render mỗi item kết quả
  const renderItem = ({ item }: { item: GetDoctorResponse }) => (
    <DoctorCard
      id={item.id}
      fullName={item.fullName}
      avatar={item.avatar}
      major={item.major}
      address={item.address}
      onInfoPress={onInfoPress}
    />
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Thanh tìm kiếm với nút quay lại */}
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <TextInput
              style={styles.searchInput}
              placeholder="Nhập tên bác sĩ..."
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
              placeholderTextColor={Colors.textDarkGray}
            />
          </View>

          {/* Danh sách kết quả */}
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              isLoading ? (
                <Text style={styles.noDataText}>Đang tìm kiếm...</Text>
              ) : (
                <Text style={styles.noDataText}>
                  {searchQuery
                    ? 'Không tìm thấy bác sĩ nào.'
                    : 'Vui lòng nhập tên bác sĩ để tìm kiếm.'}
                </Text>
              )
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchModal;

// =========================
// Styles
// =========================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.textWhite,
  },
  backButton: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.textLightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.textBlack,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textDarkGray,
    textAlign: 'center',
    marginTop: 20,
  },
});
