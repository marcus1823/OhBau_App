import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';

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
  };
}

const ProductDetailCard = ({ product }: ProductDetailCardProps) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.image || 'https://i.pinimg.com/736x/5a/61/94/5a61948bd8ca718255b2115800a9c1a9.jpg' }}
        style={styles.productImage}
        resizeMode="contain"
      />
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
            <Text style={styles.infoLabel}>Số lượng:</Text>
            <Text style={styles.infoValue}>{product.quantity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="local-shipping" size={20} color={Colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={styles.infoValue}>{product.status || 'N/A'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Icon name="shopping-cart" size={24} color={Colors.textWhite} />
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
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
  productImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.textGray,
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