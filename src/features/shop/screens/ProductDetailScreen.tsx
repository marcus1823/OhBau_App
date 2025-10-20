import { StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { useProductDetailQuery } from '../hooks/useProductDetailQuery';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import ProductDetailCard from '../components/ProductDetailCard';

const ProductDetailScreen = ({ navigation, route }: any) => {
  const { productId } = route.params;
  const { data: productData, isLoading } = useProductDetailQuery(productId);

  if (isLoading) {
    return <LoadingOverlay visible={isLoading} />;
  }

  // Transform data to match expected format
  const formattedProduct = productData?.data ? {
    id: productId,
    name: productData.data.name || '',
    description: productData.data.description || '',
    brand: productData.data.brand || '',
    price: productData.data.price || 0,
    quantity: productData.data.quantity || 0,
    color: productData.data.color || '',
    size: productData.data.size || '',
    ageRange: productData.data.ageRange || '',
    image: productData.data.image || '',
    status: productData.data.status || '',
    productCategoryId: productData.data.productCategoryId || '',
    images: productData.data.images || [{ id: 'default', url: productData.data.image || '' }]
  } : null;

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Chi tiết sản phẩm"
        onBackButtonPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {formattedProduct && <ProductDetailCard product={formattedProduct} />}
      </ScrollView>
    </LinearGradient>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    marginBottom: 60,
  },
});