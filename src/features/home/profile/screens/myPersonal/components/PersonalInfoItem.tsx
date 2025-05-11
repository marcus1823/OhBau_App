import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '../../../../../../assets/styles/colorStyle';

interface PersonalInfoItemProps {
  title: string;
  value: string;
}

const PersonalInfoItem: React.FC<PersonalInfoItemProps> = ({ title, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default PersonalInfoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    color: Colors.primaryDark, 
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: Colors.textBlack,
    fontWeight: '400',
  },
});