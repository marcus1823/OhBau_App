import React, { useState } from 'react'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'
import { WebView } from 'react-native-webview'
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader'
import { Colors } from '../../../../../../assets/styles/colorStyle'
import { privacyPolicyHtml } from '../utils/htmlContent'

const PolicyScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <View style={styles.container}>
      <PrimaryHeader 
        title="Chính sách bảo mật" 
        onBackButtonPress={() => navigation.goBack()} 
      />
      <WebView
        originWhitelist={['*']}
        source={{ html: privacyPolicyHtml }}
        style={styles.webView}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Không thể tải nội dung. Vui lòng thử lại sau.
          </Text>
        </View>
      )}
    </View>
  )
}

export default PolicyScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textWhite,
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
})