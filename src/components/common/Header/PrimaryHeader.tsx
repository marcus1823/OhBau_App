import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import ModalViewMore from '../Modal/ModalViewMore';

interface PrimaryHeaderProps {
  roleTitle?: string;
  title?: string;
  disableBackButton?: boolean;
  onBackButtonPress?: () => void;
  searchButton?: boolean;
  onSearchButtonPress?: () => void;
  filterButton?: boolean;
  onFilterButtonPress?: () => void;
  moreButton?: boolean;
  modalTitle?: string;
  modalButtons?: { text: string; onPress: () => void }[];
  onModalClose?: () => void;
  rightComponent?: React.ReactNode; // Add this prop
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
  rightComponent, // Add this prop
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMoreButtonPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  // Tạo tiêu đề hiển thị
  const displayTitle = roleTitle ? `${roleTitle} ơi, ${title}` : title;

  // Giới hạn chiều dài tiêu đề (ví dụ: 20 ký tự)
  const maxLength = 20;
  const truncatedTitle =
    displayTitle.length > maxLength
      ? `${displayTitle.substring(0, maxLength)}...`
      : displayTitle;

  return (
    <View style={styles.headerContainer}>
      {!disableBackButton && (
        <TouchableOpacity onPress={onBackButtonPress} style={styles.backButton}>
          <Icon name="arrow-left" size={42} color={Colors.primary} />
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {truncatedTitle}
        </Text>
      </View>

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
        {rightComponent}
      </View>

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
  backButton: {},
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 10,
  },
  rightButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
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