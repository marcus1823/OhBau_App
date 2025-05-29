import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDeleteCartItem } from '../hooks/useCourse.hook';
import { useToast } from '../../../utils/toasts/useToast';
import { useQueryClient } from '@tanstack/react-query';
import { GetCartItemsByAccountResponse, GetCartItemsDetailsResponse } from '../types/course.types';

interface CartItemCardProps {
  itemId: string; // This is the detailId from get-cart-items-details
  name: string;
  unitPrice: number;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ itemId, name, unitPrice }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteItem, isPending } = useDeleteCartItem();
  const { showError, showSuccess } = useToast();

  const handleDelete = () => {
    // Lưu trữ dữ liệu trước đó để rollback nếu cần
    const queryKeyByAccount = ['cartItemsByAccountInfinite'];
    const queryKeyDetails = ['cartItemsDetailsInfinite'];
    const previousDataByAccount = queryClient.getQueryData<GetCartItemsByAccountResponse[]>(queryKeyByAccount);
    const previousDataDetails = queryClient.getQueryData<GetCartItemsDetailsResponse[]>(queryKeyDetails);

    // Optimistic update
    queryClient.setQueryData(queryKeyByAccount, (old: any) => {
      if (!old || !old.pages) {return old;}
      const updatedPages = old.pages.map((page: GetCartItemsByAccountResponse) => {
        if (!page.items[0]) {return page;}
        const updatedCart = { ...page.items[0] };
        updatedCart.cartItem = updatedCart.cartItem.filter((item: any) => item.itemId !== itemId);
        return { ...page, items: [updatedCart] };
      });
      return { ...old, pages: updatedPages };
    });

    queryClient.setQueryData(queryKeyDetails, (old: any) => {
      if (!old || !old.pages) {return old;}
      const updatedPages = old.pages.map((page: GetCartItemsDetailsResponse) => {
        if (!page.items[0]) {return page;}
        const updatedDetails = { ...page.items[0] };
        updatedDetails.cartItems = updatedDetails.cartItems.filter((item: any) => item.detailId !== itemId);
        return { ...page, items: [updatedDetails] };
      });
      return { ...old, pages: updatedPages };
    });

    deleteItem(
      { itemId },
      {
        onSuccess: () => {
          showSuccess('Xóa sản phẩm khỏi giỏ hàng thành công!');
          // Invalidate queries để đồng bộ với server
          queryClient.invalidateQueries({ queryKey: queryKeyByAccount });
          queryClient.invalidateQueries({ queryKey: queryKeyDetails });
        },
        onError: (error) => {
          // Rollback nếu có lỗi
          queryClient.setQueryData(queryKeyByAccount, previousDataByAccount);
          queryClient.setQueryData(queryKeyDetails, previousDataDetails);
          showError(error.message || 'Đã xảy ra lỗi khi xóa sản phẩm');
        },
      }
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.price}>{unitPrice.toLocaleString()} VNĐ</Text>
      </View>
      <TouchableOpacity onPress={handleDelete} disabled={isPending} style={styles.deleteButton}>
        <Icon name="delete" size={24} color={'red'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
});

export default CartItemCard;