import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../../assets/styles/colorStyle';
import { useToast } from '../../../utils/toasts/useToast';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { createOrderApi, createPaymentApi, paymentReturnApi } from '../../shop/api/shopApi';

const PaymentScreen = ({ route, navigation }: any) => {
  // Support both direct URL and itemIds approaches
  const { url: directUrl, itemIds, address } = route.params || {};
  const [paymentUrl, setPaymentUrl] = useState<string | null>(directUrl || null);
  const [loading, setLoading] = useState(true);
  const [orderInitiated, setOrderInitiated] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>(
    directUrl ? 'Đang tải cổng thanh toán...' : 'Đang khởi tạo đơn hàng...'
  );
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);
  const [hasProcessedReturn, setHasProcessedReturn] = useState(false);

  // Define our redirect URL constant
  const NETLIFY_REDIRECT_URL = 'https://warm-cascaron-29c431.netlify.app/';

  const webViewRef = useRef<WebView>(null);
  const { showSuccess, showError, showInfo } = useToast();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  console.log('Access Token:', accessToken);
  
  // Process VNPAY payment result with the query string
  const processPaymentResult = useCallback(async (queryString: string) => {
    console.log('Đang xử lý kết quả thanh toán với chuỗi truy vấn:', queryString);
    
    // Prevent repeated processing
    if (hasProcessedReturn) {
      console.log('Đã xử lý thanh toán trước đó, bỏ qua.');
      return;
    }
    setHasProcessedReturn(true);
    
    if (!queryString) {
      showError('Không nhận được thông tin thanh toán');
      navigation.reset({ index: 0, routes: [{ name: 'CartScreen' }] });
      return;
    }

    if (!accessToken) {
      showError('Vui lòng đăng nhập để xử lý thanh toán.');
      navigation.reset({ index: 0, routes: [{ name: 'CartScreen' }] });
      return;
    }

    try {
      setIsProcessingReturn(true);
      setLoading(true);
      console.log('Đang gọi API trả về thanh toán với chuỗi truy vấn:', queryString);

      // Parse query parameters directly
      const queryParams = queryString.split('&').reduce((params: any, param) => {
        const [key, value] = param.split('=');
        params[key] = value || '';
        return params;
      }, {});
      
      console.log('Tham số truy vấn:', queryParams);
      
      // Extract needed parameters
      const returnPaymentRequest = {
        code: queryParams.code || '',
        id: queryParams.orderCode || '', 
        cancel: queryParams.cancel === 'true',
        status: queryParams.status || '',
      };
      
      console.log('Dữ liệu gửi đến paymentReturnApi:', returnPaymentRequest);
      
      const response = await paymentReturnApi(returnPaymentRequest, accessToken);
      console.log("Đã gọi API trả về thanh toán:", response);

      // Display the exact message from the response
      if (response.status === "200") {
        if (response.message === "Payment Canceled" || returnPaymentRequest.cancel) {
          // Handle cancelled payment
          showInfo(response.message || 'Thanh toán đã bị hủy');
        } else {
          // Handle successful payment
          showSuccess(response.message || 'Thanh toán thành công!');
        }
      } else {
        // Handle error responses
        showError(response.message || 'Lỗi xử lý thanh toán');
      }
      
      // Redirect after displaying message
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'CartScreen' }] });
      }, 3000);
      
    } catch (error: any) {
      console.error('API trả về thanh toán thất bại:', error);
      showError(error?.message || 'Thanh toán thất bại hoặc đã bị hủy');
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'CartScreen' }] });
      }, 3000);
    } finally {
      setIsProcessingReturn(false);
      setLoading(false);
    }
  }, [navigation, showError, showSuccess, showInfo, accessToken, hasProcessedReturn]);

  // Initialize order creation process
  const initiateOrderProcess = useCallback(async () => {
    if (!itemIds?.length || !accessToken) {
      showError(!itemIds?.length ? "Không tìm thấy thông tin sản phẩm" : "Vui lòng đăng nhập để thanh toán");
      navigation.goBack();
      return;
    }

    if (!address) {
      showError("Vui lòng cung cấp địa chỉ giao hàng");
      navigation.goBack();
      return;
    }

    try {
      setIsCreatingOrder(true);
      setProcessingStep('Đang khởi tạo đơn hàng...');
      const orderData = await createOrderApi(address, itemIds, accessToken);
      
      if (!orderData?.data?.orderCode) {
        showError("Không nhận được mã đơn hàng");
        navigation.goBack();
        return;
      }

      const orderCode = orderData.data.orderCode;
      console.log('Đã tạo đơn hàng thành công:', orderCode);
      
      setIsCreatingOrder(false);
      setIsCreatingPayment(true);
      setProcessingStep('Đang khởi tạo thanh toán...');

      const paymentData = await createPaymentApi(orderCode, accessToken);
      
      if (!paymentData?.data?.checkoutUrl) {
        showError("Không nhận được URL thanh toán");
        navigation.goBack();
        return;
      }

      console.log('Đã nhận URL thanh toán:', paymentData.data.checkoutUrl);
      setPaymentUrl(paymentData.data.checkoutUrl);
      
      setProcessingStep('Đang chuyển đến cổng thanh toán...');
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng hoặc thanh toán:', error);
      showError('Lỗi khi tạo đơn hàng hoặc thanh toán');
      navigation.goBack();
    } finally {
      setIsCreatingOrder(false);
      setIsCreatingPayment(false);
    }
  }, [itemIds, address, accessToken, showError, navigation]);

  // Start the order-payment process when component mounts
  useEffect(() => {
    if (!directUrl && !orderInitiated && itemIds?.length > 0) {
      setOrderInitiated(true);
      initiateOrderProcess();
    }
  }, [directUrl, orderInitiated, initiateOrderProcess, itemIds]);

  // WebView handlers
  const handleNavigationStateChange = (navState: any) => {
    console.log('WebView đang điều hướng đến:', navState.url);
    
    // Detect VNPAY confirmation page
    if (navState.url.includes('Confirm.html') || navState.url.includes('/transaction/result.html')) {
      console.log('Đã phát hiện trang xác nhận VNPAY:', navState.url);
    }
  };

  // Handle WebView errors
  const handleWebViewError = (syntheticEvent: any) => {
    console.log('WebView error:', syntheticEvent.nativeEvent);
  };

  // This is key for intercepting URLs before they're loaded
  const handleShouldStartLoad = (request: any) => {
    console.log('Should start load with request:', request.url);
    
    // Intercept the Netlify redirect URL
    if (request.url.startsWith(NETLIFY_REDIRECT_URL)) {
      console.log('Đã chặn URL Netlify:', request.url);
      
      // Extract query parameters
      const queryString = request.url.split('?')[1];
      if (queryString) {
        console.log('Trích xuất chuỗi truy vấn từ URL chuyển hướng:', queryString);
        processPaymentResult(queryString);
      }
      
      // We still want to load this URL to show the success page
      return true;
    }
    
    return true; // Allow other URLs to load
  };

  // JavaScript to inject to monitor for redirects
  const injectedJavaScript = `
    (function() {
      console.log("Đang thiết lập giám sát chuyển hướng thanh toán...");
      
      // Monitor URL changes
      function checkCurrentUrl() {
        const currentUrl = window.location.href;
        console.log("URL hiện tại:", currentUrl);
        
        if (currentUrl.startsWith("${NETLIFY_REDIRECT_URL}")) {
          console.log("Đã phát hiện URL Netlify trong JavaScript được inject!");
          window.ReactNativeWebView.postMessage("PAYMENT_RETURN:" + window.location.search.substring(1));
        }
      }
      
      // Check immediately and set up timer
      checkCurrentUrl();
      setInterval(checkCurrentUrl, 1000);
      
      // Override history methods to detect changes
      const originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        checkCurrentUrl();
      };
      
      const originalReplaceState = history.replaceState;
      history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        checkCurrentUrl();
      };
      
      // Listen for URL changes
      window.addEventListener('popstate', checkCurrentUrl);
      
      console.log("Giám sát chuyển hướng thanh toán đã được thiết lập!");
    })();
  `;

  // Handle messages from injected JavaScript
  const handleMessage = (event: any) => {
    const { data } = event.nativeEvent;
    console.log('Nhận được thông báo từ WebView:', data);
    
    if (data.startsWith('PAYMENT_RETURN:')) {
      const queryString = data.replace('PAYMENT_RETURN:', '');
      console.log('Trích xuất chuỗi truy vấn từ thông báo:', queryString);
      if (queryString) {
        processPaymentResult(queryString);
      }
    }
  };

  // Render loading state during order/payment creation
  if ((isCreatingOrder || isCreatingPayment || !paymentUrl) && !directUrl) {
    return (
      <View style={styles.container}>
        <PrimaryHeader
          title="Thanh Toán"
          onBackButtonPress={() => {
            if (isCreatingOrder || isCreatingPayment) {
              showInfo('Đang xử lý, vui lòng đợi...');
              return;
            }
            navigation.goBack();
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.processingText}>{processingStep}</Text>
          <Text style={styles.waitingText}>Vui lòng không tắt ứng dụng</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrimaryHeader
        title="Thanh Toán"
        onBackButtonPress={() => {
          Alert.alert(
            'Hủy thanh toán',
            'Bạn có chắc muốn hủy quá trình thanh toán này?',
            [
              { text: 'Không', style: 'cancel' },
              { text: 'Có', onPress: () => navigation.goBack() }
            ]
          );
        }}
      />
      {(loading || isProcessingReturn) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang xử lý thanh toán...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl || directUrl || '' }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleWebViewError}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        mixedContentMode="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  processingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textBlack,
  },
  waitingText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textGray,
    fontStyle: 'italic',
  },
  webview: {
    flex: 1,
    paddingTop: 60,
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
    fontWeight: '500',
    color: Colors.textBlack,
  },
});

export default PaymentScreen;