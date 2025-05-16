import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import ModalViewMore from '../Modal/ModalViewMore';

interface PrimaryHeaderProps {
  roleTitle?: string; // Chức danh hoặc lời xưng hô (ví dụ: "Bác sĩ", "Anh", "Chị", ...)
  title?: string; // Tiêu đề chính của header
  disableBackButton?: boolean; // Có ẩn nút quay lại hay không
  onBackButtonPress?: () => void; // Xử lý khi bấm nút quay lại
  searchButton?: boolean; // Có hiển thị nút tìm kiếm hay không
  onSearchButtonPress?: () => void; // Xử lý khi bấm nút tìm kiếm
  filterButton?: boolean; // Có hiển thị nút lọc hay không
  onFilterButtonPress?: () => void; // Xử lý khi bấm nút lọc
  moreButton?: boolean; // Có hiển thị nút "thêm" (3 chấm) hay không
  modalTitle?: string; // Tiêu đề modal khi bấm nút "more"
  modalButtons?: { text: string; onPress: () => void }[]; // Các button bên trong modal
  onModalClose?: () => void; // Callback khi đóng modal
}

const PrimaryHeader: React.FC<PrimaryHeaderProps> = ({
  roleTitle,
  title = '',
  disableBackButton = false,
  onBackButtonPress,
  searchButton = false,
  onSearchButtonPress,
  filterButton = false,
  onFilterButtonPress,
  moreButton = false,
  modalTitle,
  modalButtons,
  onModalClose,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái hiển thị của Modal

  // Khi nhấn vào nút "more" (3 chấm), mở modal
  const handleMoreButtonPress = () => {
    setIsModalVisible(true);
  };

  // Khi đóng modal, cập nhật trạng thái và gọi callback nếu có
  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  // Tạo tiêu đề hiển thị: nếu có `roleTitle` thì hiển thị theo kiểu: "roleTitle ơi, title"
  const displayTitle = roleTitle ? `${roleTitle} ơi, ${title}` : title;

  return (
    <View style={styles.headerContainer}>
      {/* Nút quay lại nếu không bị disable */}
      {!disableBackButton && (
        <TouchableOpacity onPress={onBackButtonPress} style={styles.backButton}>
          <Icon name="arrow-left" size={42} color={Colors.primary} />
        </TouchableOpacity>
      )}

      {/* Tiêu đề được đặt chính giữa header, có padding để không bị che bởi các nút hai bên */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{displayTitle}</Text>
      </View>

      {/* Nhóm nút bên phải: Search, Filter, More */}
      <View style={styles.rightButtons}>
        {searchButton && (
          <TouchableOpacity onPress={onSearchButtonPress} style={styles.iconButton}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        {filterButton && (
          <TouchableOpacity onPress={onFilterButtonPress} style={styles.iconButton}>
            <Icon name="filter-list" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        {moreButton && (
          <TouchableOpacity onPress={handleMoreButtonPress} style={styles.iconButton}>
            <Icon name="more-vert" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal hiển thị khi bấm nút "more", chỉ hiển thị nếu có đủ dữ liệu truyền vào */}
      {moreButton && modalTitle && modalButtons && (
        <ModalViewMore
          visible={isModalVisible}
          title={modalTitle}
          onClose={handleCloseModal}
          buttons={modalButtons}
        />
      )}
    </View>
  );
};


export default PrimaryHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    backgroundColor: 'rgba(252, 251, 251, 1)',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    // Positioned on the left, no flex impact
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60, // Reserve space for icons on both sides
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    // Allow wrapping to next line
    flexWrap: 'wrap',
  },
  rightButtons: {
    flexDirection: 'row',
    marginLeft: 'auto', // Push to the right
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});