import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Pressable } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDeleteCartItem, useUpdateCartItemQuantity } from '../../shop/hooks/useCart';
import { useToast } from '../../../utils/toasts/useToast';

interface CartItemCardProps {
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  color?: string;
  size?: string;
  onUpdate?: () => void; // Callback for updates
  isSelected?: boolean; // New prop to show selection state
  onSelect?: (itemId: string) => void; // New callback for selection
  selectionMode: boolean; // Whether selection mode is active
  onLongPress?: () => void; // Callback for long press to enter selection mode
}

const CartItemCard: React.FC<CartItemCardProps> = ({ 
  itemId, 
  name, 
  unitPrice, 
  quantity: initialQuantity = 1,
  imageUrl,
  color,
  size,
  onUpdate,
  isSelected = false,
  onSelect,
  selectionMode,
  onLongPress
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: deleteItem, isPending: isDeletePending } = useDeleteCartItem();
  const { mutate: updateQuantity, isPending: isUpdatePending } = useUpdateCartItemQuantity();
  const { showError } = useToast();

  // Update local quantity if prop changes (e.g. due to refresh from parent)
  useEffect(() => {
    if (initialQuantity !== quantity) {
      setQuantity(initialQuantity);
    }
  }, [initialQuantity, quantity]);
  
  // Format image URL with base URL prefix if needed
  const getFormattedImageUrl = (url?: string) => {
    if (!url) {
      return null;
    }
    return url.startsWith('http') ? url : `https://ohbau.cloud/${url}`;
  };

  const DefaultImage = require('../../../assets/images/skelector/noProduct.jpg'); // Default image if none provided
  
  const isProcessing = isDeletePending || isUpdatePending;

  const handleDelete = () => {
    try {
      setIsDeleting(true);
      deleteItem(itemId, {
        onSuccess: () => {
          if (onUpdate) {
            // Delay the update callback to ensure smooth UI transition
            setTimeout(() => {
              onUpdate();
            }, 300);
          }
        },
        onSettled: () => {
          // Ensure we always unset the loading state, even on error
          setIsDeleting(false);
        },
        onError: (error) => {
          console.error("Error deleting item:", error);
          // Show error through toast
          showError(error instanceof Error ? error.message : 'Lỗi xóa sản phẩm');
          
          // Try to refresh the cart anyway after a delay
          setTimeout(() => {
            if (onUpdate) {
              onUpdate();
            }
          }, 500);
        }
      });
    } catch (e) {
      // Extra safety catch in case the mutation throws synchronously
      console.error("Unexpected error in delete handler:", e);
      setIsDeleting(false);
      showError('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity > 99) {
      showError('Số lượng tối đa là 99');
      return;
    }
    setQuantity(newQuantity);
    updateQuantity({ itemId, quantity: newQuantity }, {
      onSuccess: () => {
        if (onUpdate) {onUpdate();}
      }
    });
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    }
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    updateQuantity({ itemId, quantity: newQuantity }, {
      onSuccess: () => {
        if (onUpdate) {onUpdate();}
      }
    });
  };

  const handleSelectItem = () => {
    if (onSelect && selectionMode) {
      onSelect(itemId);
    }
  };

  if (isDeleting) {
    return (
      <View style={[styles.card, styles.deletingCard]}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.deletingText}>Đang xóa...</Text>
      </View>
    );
  }

  return (
    <Pressable 
      onLongPress={onLongPress}
      onPress={handleSelectItem}
      style={({pressed}) => [
        styles.card,
        isSelected && selectionMode && styles.selectedCard,
        pressed && selectionMode && styles.pressedCard
      ]}
      delayLongPress={400}
      android_ripple={selectionMode ? { color: 'rgba(0,0,0,0.1)' } : undefined}
    >
      {selectionMode && (
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Icon name="check" size={16} color={Colors.textWhite} />}
          </View>
        </View>
      )}
      
      <View style={[styles.imageContainer, selectionMode && styles.imageContainerWithSelection]}>
        <Image 
          source={imageUrl ? { uri: getFormattedImageUrl(imageUrl) || imageUrl } : DefaultImage} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          {(color || size) && (
            <Text style={styles.variant}>
              {color && `Màu: ${color}`}{color && size ? ' | ' : ''}{size && `Size: ${size}`}
            </Text>
          )}
          <Text style={styles.price}>{unitPrice.toLocaleString('vi-VN')} VNĐ</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          {!selectionMode && (
            <>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  onPress={handleDecreaseQuantity}
                  disabled={isProcessing || quantity <= 1}
                  style={[styles.quantityButton, (isProcessing || quantity <= 1) && styles.disabledButton]}
                >
                  <Icon name="remove" size={16} color={Colors.textBlack} />
                </TouchableOpacity>
                
                {isUpdatePending ? (
                  <ActivityIndicator size="small" color={Colors.primary} style={styles.quantityLoading} />
                ) : (
                  <Text style={styles.quantity}>{quantity}</Text>
                )}
                
                <TouchableOpacity 
                  onPress={handleIncreaseQuantity}
                  disabled={isProcessing}
                  style={[styles.quantityButton, isProcessing && styles.disabledButton]}
                >
                  <Icon name="add" size={16} color={Colors.textBlack} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                onPress={handleDelete} 
                disabled={isProcessing} 
                style={styles.deleteButton}
              >
                <Icon name="delete-outline" size={22} color={'red'} />
              </TouchableOpacity>
            </>
          )}
          
          {selectionMode && (
            <Text style={styles.quantityText}>Số lượng: {quantity}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deletingCard: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: 80,
  },
  deletingText: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: '500',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textBlack,
    marginBottom: 4,
  },
  variant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantity: {
    paddingHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textBlack,
  },
  quantityLoading: {
    paddingHorizontal: 8,
    minWidth: 30,
  },
  deleteButton: {
    padding: 6,
  },
  selectedCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pressedCard: {
    opacity: 0.7,
  },
  checkboxContainer: {
    padding: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
  },
  imageContainerWithSelection: {
    marginLeft: 24, // Make room for the checkbox
  },
  quantityText: {
    fontSize: 14,
    color: Colors.textBlack,
    fontWeight: '500',
  },
});

export default CartItemCard;