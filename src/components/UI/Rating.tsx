import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../app/providers/AppProviders';

interface RatingProps {
  rating: number | null;
  maxRating?: number;
}

export const Rating: React.FC<RatingProps> = observer(({ rating, maxRating = 5 }) => {
  const { themeStore } = useStores();
  const { colors } = themeStore.currentTheme;

  if (!rating) {
    return <Text style={[styles.noRating, { color: colors.textMuted }]}>Нет рейтинга</Text>;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      {Array.from({ length: fullStars }, (_, i) => (
        <Text key={`full-${i}`} style={[styles.star, { color: colors.warning }]}>★</Text>
      ))}
      {hasHalfStar && <Text style={[styles.halfStar, { color: colors.warning }]}>☆</Text>}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Text key={`empty-${i}`} style={[styles.emptyStar, { color: colors.border }]}>☆</Text>
      ))}
      <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{rating.toFixed(1)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
  },
  halfStar: {
    fontSize: 16,
    opacity: 0.5,
  },
  emptyStar: {
    fontSize: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  noRating: {
    fontSize: 14,
  },
});
