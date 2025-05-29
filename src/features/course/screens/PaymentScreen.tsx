/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../../assets/styles/colorStyle';
import { useToast } from '../../../utils/toasts/useToast';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { getPaymentReturnApi } from '../api/courseApi';

const PaymentScreen = ({ route, navigation }: any) => {
  const { url } = route.params;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Xử lý deep link
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      console.log('Deep link received:', event.url);
      if (event.url.includes('ohbau://payment-result')) {
        setLoading(false);
        const queryString = event.url.split('?')[1];
        console.log('Extracted query string:', queryString); // Log query string

        if (!queryString) {
          showError('Không nhận được thông tin thanh toán từ deep link.');
          setTimeout(() => navigation.reset({
            index: 0,
            routes: [{ name: 'CartScreen' }],
          }), 2000);
          return;
        }

        if (!accessToken) {
          showError('Vui lòng đăng nhập để xử lý thanh toán.');
          setTimeout(() => navigation.reset({
            index: 0,
            routes: [{ name: 'CartScreen' }],
          }), 3000);
          return;
        }

        try {
          const response = await getPaymentReturnApi(queryString, accessToken);
          showSuccess('Thanh toán thành công!');
          setTimeout(() => navigation.reset({
            index: 0,
            routes: [{ name: 'CartScreen' }],
          }), 3000);
        } catch (error) {
          showError('Thanh toán thất bại hoặc đã bị hủy.');
          setTimeout(() => navigation.reset({
            index: 0,
            routes: [{ name: 'CartScreen' }],
          }), 3000);
        }
      }
    };

    // Lắng nghe sự kiện deep link
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Kiểm tra deep link ban đầu khi ứng dụng mở
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    });

    // Dọn dẹp subscription
    return () => {
      subscription.remove();
    };
  }, [navigation, showSuccess, showError, accessToken]);

  const handleNavigationStateChange = async (navState: any) => {
    const { url: currentUrl } = navState;
    console.log('WebView URL:', currentUrl);

    if (currentUrl.includes('ohbau://payment-result')) {
      setLoading(false);
      const queryString = currentUrl.split('?')[1];
      console.log('Extracted query string from WebView:', queryString); // Log query string

      if (!queryString) {
        showError('Không nhận được thông tin thanh toán từ deep link.');
        setTimeout(() => navigation.navigate('CartScreen'), 3000);
        return;
      }

      if (!accessToken) {
        showError('Vui lòng đăng nhập để xử lý thanh toán.');
        setTimeout(() => navigation.navigate('CartScreen'), 3000);
        return;
      }

      try {
        const response = await getPaymentReturnApi(queryString, accessToken);
        showSuccess('Thanh toán thành công!');
        setTimeout(() => navigation.navigate('CartScreen'), 3000);
      } catch (error) {
        showError('Thanh toán thất bại hoặc đã bị hủy.');
        setTimeout(() => navigation.navigate('CartScreen'), 3000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader
        title="Thanh Toán"
        onBackButtonPress={() => navigation.goBack()}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang xử lý thanh toán...</Text>
        </View>
      )}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          showError('Lỗi tải trang thanh toán');
          setLoading(false);
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          if (loading) {setLoading(false);}
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textBlack,
  },
});

export default PaymentScreen;