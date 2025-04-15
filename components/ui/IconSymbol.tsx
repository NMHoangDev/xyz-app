// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  'tv.fill': 'live-tv',
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'money.fill': 'account-balance-wallet',
  'dollarsign.circle.fill': 'payments',
  'cart.fill': 'shopping-cart',
  'chart.bar.fill': 'bar-chart',
  'person.2.fill': 'group',
  'person.fill': 'person',
  'plus': 'add',
  'bolt.fill': 'flash-on',
  'car.fill': 'directions-car',
  'bag.fill': 'shopping-bag',
  'movie.fill': 'theaters',
  'heart.fill': 'favorite',
  'book.fill': 'book',
  'ellipsis.circle': 'more-horiz',
  'fork.knife': 'restaurant',
  // Thêm các biểu tượng mới
  'star.fill': 'star',
  'shopping_cart': 'shopping-cart',
  'attach_money': 'attach-money',
  'restaurant': 'restaurant',
  'work': 'work',
  'favorite': 'favorite',
  'star': 'star',
  'group': 'group',
  'briefcase.fill': 'work',
  // Thêm các icon mới cần thiết
  'airplane.circle.fill': 'flight',
  'square.and.arrow.up.fill': 'share',
  'square.and.arrow.up': 'share',
  'airplane': 'flight',
} as const;

// Định nghĩa type cho tên các icon
export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Thêm detailed logging
  console.log('IconSymbol Debug:', {
    inputName: name,
    mappedName: MAPPING[name],
    availableIcons: Object.keys(MAPPING),
    color,
    size
  });

  // Kiểm tra xem name có trong MAPPING không
  if (!MAPPING[name]) {
    console.warn(`Icon mapping not found for: ${name}`);
    return null;
  }

  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

// Kiểm tra xem các icon name bạn đang sử dụng có trong MAPPING không
console.log('Available icons:', Object.keys(MAPPING));
