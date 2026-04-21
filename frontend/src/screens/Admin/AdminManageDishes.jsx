import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, Text, TouchableOpacity } from "react-native";

export default function AdminManageDishes({
  adminDishes,
  adminDishesMsg,
  adminDishesBusy,
  loadAdminDishes,
  setAddDishModalVisible,
  toggleAdminDishAvailability,
  toggleAdminDishTrending,
  deleteAdminDish,
  styles,
  isAdminDark
}) {
  return (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Manage Dishes
        </Text>
        <TouchableOpacity
          style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
          onPress={() => setAddDishModalVisible(true)}
        >
          <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
            Add Dish
          </Text>
        </TouchableOpacity>
      </View>
      {adminDishesMsg ? <Text style={styles.error}>{adminDishesMsg}</Text> : null}

      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Dishes List
        </Text>
        <TouchableOpacity
          style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
          onPress={loadAdminDishes}
          disabled={adminDishesBusy}
        >
          <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
            {adminDishesBusy ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
      {adminDishes.map((dish) => (
        <View key={String(dish._id)} style={[styles.adminDishCard, isAdminDark && styles.adminDishCardDark]}>
          <View style={styles.adminDishRow}>
            {dish.imageUrl ? (
              <Image source={{ uri: dish.imageUrl }} style={styles.adminDishThumbLarge} />
            ) : (
              <View style={styles.adminDishThumbPlaceholderLarge}>
                <Text style={styles.cardImageText}>No image</Text>
              </View>
            )}
            <View style={styles.adminDishMetaWrap}>
              <View style={styles.adminDishTitleRow}>
                <View style={[styles.adminDishIconWrap, isAdminDark && styles.adminDishIconWrapDark]}>
                  <Ionicons name="restaurant" size={11} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                </View>
                <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                  {dish.name || "Dish"}
                </Text>
              </View>
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                {dish.category || "General"} • LKR {Number(dish.price || 0).toFixed(2)}
              </Text>
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                {dish.isAvailable ? "Available" : "Unavailable"} •{" "}
                {dish.isTrending ? "Trending" : "Standard"}
              </Text>
            </View>
          </View>
          <View style={styles.adminActionRow}>
            <TouchableOpacity
              style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
              onPress={() => toggleAdminDishAvailability(dish)}
            >
              <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                {dish.isAvailable ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
              onPress={() => toggleAdminDishTrending(dish)}
            >
              <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                {dish.isTrending ? "Untrend" : "Trend"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
              onPress={() => deleteAdminDish(dish._id)}
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



