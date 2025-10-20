import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

const { width } = Dimensions.get('window');
const isTablet = width > 768;
interface ProductListProps {
  navigation: any;
  products: any[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

const ProductList = ({ navigation, products, fetchNextPage, hasNextPage, isFetchingNextPage }: ProductListProps) => {
  // Format image URL with base URL prefix if needed
  const getFormattedImageUrl = (url: string) => {
    if (!url) {
      // Return null for the fallback image - we'll handle this separately
      return null;
    }
    return url.startsWith('http') ? url : `https://ohbau.cloud/${url}`;
  };
  
  const handleProductPress = (id: string) => {
    console.log('Product ID:', id);
    navigation.navigate('ProductDetailScreen', { productId: id });
  };

  const renderProduct = ({ item }: { item: any }) => {
    // Get image URL from either images array or single image property
    let imageUrl = null;
    if (item.images && item.images.length > 0) {
      // Use the first image from the images array
      imageUrl = getFormattedImageUrl(item.images[0].url);
    } else if (item.image) {
      // Use the single image property
      imageUrl = getFormattedImageUrl(item.image);
    }
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleProductPress(item.id)}
      >
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../../../assets/images/skelector/noProduct.jpg')}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productBrand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString('vi-VN')} VNĐ
        </Text>
      </View>
    </TouchableOpacity>
  );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) {return null;}
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item, index) => `${item.id}-${index}`} 
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

export default ProductList;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: isTablet ? 250 : 120,
  },
  cardContent: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textBlack,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});