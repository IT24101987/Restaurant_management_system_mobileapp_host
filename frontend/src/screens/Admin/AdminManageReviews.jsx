import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AdminManageReviews({
  adminReviews,
  adminReviewsMsg,
  adminReviewsBusy,
  loadAdminReviews,
  deleteAdminReview,
  styles,
  isAdminDark
}) {
  const reviews = Array.isArray(adminReviews) ? adminReviews : [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews
      : 0;

  const statPalette = [
    { light: styles.adminStatOrange, dark: styles.adminStatOrangeDark },
    { light: styles.adminStatBlue, dark: styles.adminStatBlueDark },
    { light: styles.adminStatGreen, dark: styles.adminStatGreenDark }
  ];

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));
    const filledCount = Math.round(safeRating);
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < filledCount;
          return (
            <Ionicons
              key={`star-${index}`}
              name={filled ? "star" : "star-outline"}
              size={13}
              color={filled ? "#F59E0B" : isAdminDark ? "#94A3B8" : "#94A3B8"}
            />
          );
        })}
      </View>
    );
  };

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

      {reviews.map((review) => {
        const dish = review?.dishId || {};
        const dishImage =
          dish?.imageUrl || dish?.image || dish?.photo || dish?.thumbnail || dish?.imageUri || "";
        const dishName = dish?.name || "Service Review";
        const reviewerName = review?.reviewerName || "Anonymous";
        const reviewType = review?.targetType || "dish";
        const comment = review?.comment || "No comment";
        const rating = Number(review?.rating || 0);

        return (
          <View key={String(review?._id)} style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              {dishImage ? (
                <Image source={{ uri: dishImage }} style={styles.adminDishThumb} />
              ) : (
                <View style={[styles.adminDishThumbPlaceholderLarge, { width: 40, height: 40, borderRadius: 10 }]}>
                  <Ionicons name="image-outline" size={15} color={isAdminDark ? "#FDBA74" : "#9A3412"} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="restaurant-outline" size={14} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                  <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>{dishName}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                  {renderStars(rating)}
                  <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                    {rating.toFixed(1)}/5
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Ionicons name="person-outline" size={13} color={isAdminDark ? "#94A3B8" : "#64748B"} />
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                {reviewerName}
              </Text>
              <Ionicons name="pricetag-outline" size={13} color={isAdminDark ? "#94A3B8" : "#64748B"} />
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                {reviewType}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 6, marginTop: 2 }}>
              <Ionicons name="chatbubble-ellipses-outline" size={13} color={isAdminDark ? "#94A3B8" : "#64748B"} />
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark, { flex: 1 }]}>
                {comment}
              </Text>
            </View>

            <View style={styles.adminActionRow}>
              <TouchableOpacity
                style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                onPress={() => deleteAdminReview(review._id)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="trash-outline" size={13} color={isAdminDark ? "#FEE2E2" : "#FFFFFF"} />
                  <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}
