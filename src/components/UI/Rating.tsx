import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingProps {
  rating: number | null;
  maxRating?: number;
}

export const Rating: React.FC<RatingProps> = ({ rating, maxRating = 5 }) => {
  if (!rating) {
    return <Text style={styles.noRating}>Нет рейтинга</Text>;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      {Array.from({ length: fullStars }, (_, i) => (
        <Text key={`full-${i}`} style={styles.star}>★</Text>
      ))}
      {hasHalfStar && <Text style={styles.halfStar}>☆</Text>}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Text key={`empty-${i}`} style={styles.emptyStar}>☆</Text>
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#ffa500',
    fontSize: 16,
  },
  halfStar: {
    color: '#ffa500',
    fontSize: 16,
    opacity: 0.5,
  },
  emptyStar: {
    color: '#ccc',
    fontSize: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  noRating: {
    fontSize: 14,
    color: '#666',
  },
});
