import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import { useAddToCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/Navigation/navigation';
const { width } = Dimensions.get('window');
const isTablet = width > 768;
interface ProductDetailCardProps {
  product: {
    id: string;
    name?: string;
    description?: string;
    brand?: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    ageRange?: string;
    image?: string;
    status?: string;
    productCategoryId?: string;
    images?: {
      id: string;
      url: string;
    }[];
  };
}

// Define the navigation prop type
type ProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDetailCard = ({ product }: ProductDetailCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { mutate: addToCart, isPending } = useAddToCart();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigation = useNavigation<ProductScreenNavigationProp>();
  
  // Format image URL with base URL prefix if needed
  const getFormattedImageUrl = (url: string) => {
    if (!url) {
      // Return null for the fallback image - we'll handle this separately in the renderItem
      return null;
    }
    return url.startsWith('http') ? url : `https://ohbau.cloud/${url}`;
  };
  
  // Prepare product images array for gallery
  const productImages = React.useMemo(() => {
    // If product has images array, use those
    // console.log("Product Array:", product);
    
    if (product.images && product.images.length > 0) {
      return product.images.map(img => ({
        id: img.id,
        url: getFormattedImageUrl(img.url)
      }));
    }
    
    // Otherwise fallback to single image
    return [{
      id: 'main',
      url: getFormattedImageUrl(product.image || '')
    }];
  }, [product.images, product.image]);
  

  const handleIncreaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!accessToken) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        [
          { text: "Đăng nhập", onPress: () => navigation.navigate('AuthStack') },
          { text: "Hủy", style: "cancel" }
        ]
      );
      return;
    }

    addToCart({ productId: product.id, quantity }, {
      onSuccess: () => {
        Alert.alert(
          "Thành công",
          "Sản phẩm đã được thêm vào giỏ hàng",
          [
            { 
              text: "Xem giỏ hàng", 
              onPress: () => navigation.navigate('TabNavigation', { 
                screen: 'CartScreen',
                // params: { previousTab: 'Trang Chủ' }
              })
            },
            { text: "Tiếp tục mua sắm", style: "cancel" }
          ]
        );
      },
      onError: (error) => {
        Alert.alert(
          "Lỗi",
          error instanceof Error ? error.message : "Không thể thêm sản phẩm vào giỏ hàng"
        );
      }
    });
  };

  // Handle image scroll events
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== currentImageIndex) {
      setCurrentImageIndex(index);
    }
  };

  // Navigate to a specific image
  const scrollToImage = (index: number) => {
    if (flatListRef.current && index >= 0 && index < productImages.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageGalleryContainer}>
        <FlatList
          ref={flatListRef}
          data={productImages}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image
              source={item.url ? { uri: item.url } : require('../../../assets/images/skelector/noProduct.jpg')}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
        />
        
        {/* Navigation arrows */}
        {productImages.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <TouchableOpacity 
                style={[styles.navArrow, styles.navArrowLeft]} 
                onPress={() => scrollToImage(currentImageIndex - 1)}
              >
                <Icon name="chevron-left" size={30} color={Colors.primary} />
              </TouchableOpacity>
            )}
            
            {currentImageIndex < productImages.length - 1 && (
              <TouchableOpacity 
                style={[styles.navArrow, styles.navArrowRight]} 
                onPress={() => scrollToImage(currentImageIndex + 1)}
              >
                <Icon name="chevron-right" size={30} color={Colors.primary} />
              </TouchableOpacity>
            )}
            
            {/* Image indicators */}
            <View style={styles.paginationContainer}>
              {productImages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive
                  ]}
                  onPress={() => scrollToImage(index)}
                />
              ))}
            </View>
          </>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{product.name || 'Không có tên'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>
            {product.price.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
        <Text style={styles.productBrand}>{product.brand || 'Không có thương hiệu'}</Text>
        <Text style={styles.productDescription}>
          {product.description || 'Không có mô tả'}
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="color-lens" size={20} color={Colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Màu sắc:</Text>
            <Text style={styles.infoValue}>{product.color || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="straighten" size={20} color={Colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Kích cỡ:</Text>
            <Text style={styles.infoValue}>{product.size || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="child-care" size={20} color={Colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Độ tuổi:</Text>
            <Text style={styles.infoValue}>{product.ageRange || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="inventory" size={20} color={Colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Kho hàng:</Text>
            <Text style={styles.infoValue}>{product.quantity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="local-shipping" size={20} color={Colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={styles.infoValue}>{product.status || 'N/A'}</Text>
          </View>
        </View>
        
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]} 
              onPress={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Icon name="remove" size={20} color={quantity <= 1 ? Colors.textGray : Colors.textBlack} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
              style={[styles.quantityButton, quantity >= product.quantity && styles.quantityButtonDisabled]} 
              onPress={handleIncreaseQuantity}
              disabled={quantity >= product.quantity}
            >
              <Icon name="add" size={20} color={quantity >= product.quantity ? Colors.textGray : Colors.textBlack} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Add to Cart Button */}
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={isPending || product.quantity <= 0}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={Colors.textWhite} />
          ) : (
            <>
              <Icon name="shopping-cart" size={24} color={Colors.textWhite} />
              <Text style={styles.addToCartText}>
                {product.quantity <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.textWhite,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  imageGalleryContainer: {
    position: 'relative',
    width: '100%',
    height: isTablet ? 500 : 250,
    backgroundColor: Colors.textGray,
  },
  productImage: {
    width: width - 32, // Account for card margins
    height: isTablet ? 500 : 250,
    backgroundColor: Colors.textGray,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: Colors.textGray,
    opacity: 0.8,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 1,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  navArrowLeft: {
    left: 10,
  },
  navArrowRight: {
    right: 10,
  },
  cardContent: {
    padding: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textBlack,
    marginBottom: 12,
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textCardHome1,
  },
  discountBadge: {
    backgroundColor: Colors.cardHome1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  discountText: {
    fontSize: 14,
    color: Colors.textCardHome1,
    fontWeight: '600',
  },
  productBrand: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDarkGray,
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.textBlack,
    marginBottom: 16,
    lineHeight: 22,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textBlack,
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textBlack,
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textBlack,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
    marginLeft: 8,
  },
});