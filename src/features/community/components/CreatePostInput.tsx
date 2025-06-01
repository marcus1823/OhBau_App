import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';

interface CreatePostInputProps {
  onPress: () => void;
}

const CreatePostInput: React.FC<CreatePostInputProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Bạn đang nghĩ gì?</Text>
      <Icon name="edit" size={20} color={Colors.primary} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'LeagueSpartan-Regular',
  },
  icon: {
    marginLeft: 10,
  },
});

export default CreatePostInput;