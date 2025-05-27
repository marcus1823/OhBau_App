import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../../assets/styles/colorStyle';
import { useToast } from '../../../utils/toasts/useToast';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';

const PaymentScreen = ({ route, navigation }: any) => {
  const { url } = route.params;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    const { url: currentUrl } = navState;
    console.log('WebView URL:', currentUrl);

    // Check for VNPay transaction status in the URL
    if (currentUrl.includes('vnp_ResponseCode')) {
      setLoading(false);
      const queryString = currentUrl.split('?')[1];
      if (queryString) {
        const params = queryString.split('&').reduce((acc: any, param: string) => {
          const [key, value] = param.split('=');
          acc[key] = value;
          return acc;
        }, {});

        const transactionStatus = params.vnp_TransactionStatus;
        const responseCode = params.vnp_ResponseCode;

        if (transactionStatus === '00' && responseCode === '00') {
          // Transaction success
          showSuccess('Thanh toán thành công!');
          setTimeout(() => {
            navigation.navigate('CartScreen'); // Or a confirmation screen
          }, 2000);
        } else {
          // Transaction failed or cancelled
          showError('Thanh toán thất bại hoặc đã bị hủy.');
          setTimeout(() => {
            navigation.navigate('CartScreen');
          }, 2000);
        }
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