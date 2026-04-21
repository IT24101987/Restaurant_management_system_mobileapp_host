import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AdminManageReviews({
  adminReviews,
  adminReviewsMsg,
  adminReviewsBusy,
  loadAdminReviews,
  deleteAdminReview,
  styles,
  isAdminDark
}) {
  const totalReviews = Array.isArray(adminReviews) ? adminReviews.length : 0;
  const avgRating =
    totalReviews > 0
      ? adminReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews
      : 0;

  const statPalette = [
    { light: styles.adminStatOrange, dark: styles.adminStatOrangeDark },
    { light: styles.adminStatBlue, dark: styles.adminStatBlueDark },
    { light: styles.adminStatGreen, dark: styles.adminStatGreenDark }
  ];

  return (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Manage Reviews
        </Text>
        <TouchableOpacity
          style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
          onPress={loadAdminReviews}
          disabled={adminReviewsBusy}
        >
          <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
            {adminReviewsBusy ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
      {adminReviewsMsg ? <Text style={styles.error}>{adminReviewsMsg}</Text> : null}
      <View style={styles.adminStatsRow}>
        {[
          { label: "Total Reviews", value: totalReviews },
          { label: "Average Rating", value: `${avgRating.toFixed(1)}/5` },
          { label: "Rating Scale", value: "5" }
        ].map((item, index) => {
          const palette = statPalette[index % statPalette.length];
          return (
            <View
              key={item.label}
              style={[
                styles.adminStatCard,
                palette?.light,
                isAdminDark && styles.adminStatCardDark,
                isAdminDark && palette?.dark
              ]}
            >
              <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>
                {item.label}
              </Text>
              <Text style={[styles.adminStatValue, isAdminDark && styles.adminStatValueDark]}>
                {item.value}
              </Text>
            </View>
          );
        })}
      </View>
      {adminReviews.map((review) => (
        <View key={String(review._id)} style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
          <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
            {review.dishId?.name || "Service Review"} • {review.rating}/5
          </Text>
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            {review.reviewerName || "Anonymous"} • {review.targetType}
          </Text>
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            {review.comment || "No comment"}
          </Text>
          <View style={styles.adminActionRow}>
            <TouchableOpacity
              style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
              onPress={() => deleteAdminReview(review._id)}
            >
              <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
