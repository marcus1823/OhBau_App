import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/store';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation/navigation';
import AuthModal from './components/AuthModal';


const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const navigation = useNavigation<RootStackNavigationProp>();
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);

    const isLoggedIn = !!accessToken;

    useEffect(() => {
      console.log('Screen focused, isLoggedIn:', isLoggedIn, 'isFocused:', isFocused);
      if (!isLoggedIn && isFocused) {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    }, [isLoggedIn, isFocused]);

    const handleCloseModal = () => {
      setModalVisible(false);
      // navigation.replace('TabNavigation', { screen: 'Trang Chủ' });
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigation' }],
      });
    };

    const handleLogin = () => {
      setModalVisible(false);
      // navigation.replace('AuthStack');
      navigation.replace('SplashScreen');
    };

    if (!isLoggedIn && modalVisible && isFocused) {
      return <AuthModal visible={modalVisible} onClose={handleCloseModal} onLogin={handleLogin} />;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

