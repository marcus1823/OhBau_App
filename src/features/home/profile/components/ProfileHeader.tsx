import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '../../../../assets/styles/colorStyle';

interface ProfileHeaderProps {
  avatarUrl?: string;
  name?: string;
  email?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatarUrl, name, email }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Text style={styles.initials}>{name?.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center', 
    padding: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.primary,
  },
  avatarContainer: {
    width: 120, 
    height: 120,
    borderRadius: 60, 
    overflow: 'hidden',
    marginBottom: 20, 
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontSize: 40, 
    color: '#fff',
    textAlign: 'center',
    lineHeight: 120, 
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: 6, 
  },
  email: {
    fontSize: 16,
    color: Colors.textBlack,
  },
});