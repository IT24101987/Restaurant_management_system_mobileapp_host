import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, Text, TouchableOpacity } from "react-native";

export default function AdminManageDishes({
  adminDishes,
  adminDishesMsg,
  adminDishesBusy,
  loadAdminDishes,
  openAddDishModal,
  setAddDishModalVisible,
  editAdminDish,
  toggleAdminDishAvailability,
  toggleAdminDishTrending,
  deleteAdminDish,
  styles,
  isAdminDark
}) {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const handleAddDishPress = () => {
    if (typeof openAddDishModal === "function") {
      openAddDishModal();
      return;
    }
    if (typeof setAddDishModalVisible === "function") {
      setAddDishModalVisible(true);
    }
  };

  const categoryOptions = useMemo(() => {
    const categories = new Map();
    adminDishes.forEach((dish) => {
      const rawCategory = String(dish?.category || "").trim();
      if (!rawCategory) return;
      const normalizedCategory = rawCategory.toLowerCase();
      if (!categories.has(normalizedCategory)) categories.set(normalizedCategory, rawCategory);
    });
    return Array.from(categories.values()).sort((a, b) => a.localeCompare(b));
  }, [adminDishes]);

  const visibleDishes = useMemo(() => {
    const filteredDishes =
      categoryFilter === "all"
        ? adminDishes
        : adminDishes.filter(
            (dish) =>
              String(dish?.category || "").trim().toLowerCase() ===
              categoryFilter.toLowerCase()
          );

    return [...filteredDishes].sort((a, b) => {
      const trendingDifference =
        Number(Boolean(b?.isTrending)) - Number(Boolean(a?.isTrending));
      if (trendingDifference !== 0) return trendingDifference;
      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });
  }, [adminDishes, categoryFilter]);

  return (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Manage Dishes
        </Text>
        <TouchableOpacity
          style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
          onPress={handleAddDishPress}
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

      <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
        Category Filter
      </Text>
      <TouchableOpacity
        style={[styles.adminDropdown, isAdminDark && styles.adminDropdownDark]}
        onPress={() => setCategoryDropdownOpen((current) => !current)}
      >
        <Text style={[styles.adminDropdownText, isAdminDark && styles.adminDropdownTextDark]}>
          {categoryFilter === "all" ? "All categories" : categoryFilter}
        </Text>
      </TouchableOpacity>
      {categoryDropdownOpen ? (
        <View style={[styles.adminDropdownMenu, isAdminDark && styles.adminDropdownMenuDark]}>
          {["all", ...categoryOptions].map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.adminDropdownItem}
              onPress={() => {
                setCategoryFilter(value);
                setCategoryDropdownOpen(false);
              }}
            >
              <Text style={[styles.adminDropdownItemText, isAdminDark && styles.adminDropdownItemTextDark]}>
                {value === "all" ? "All categories" : value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {visibleDishes.map((dish) => (
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
              <View style={styles.adminDishHeaderRow}>
                <View style={styles.adminDishTitleRow}>
                  <View style={[styles.adminDishIconWrap, isAdminDark && styles.adminDishIconWrapDark]}>
                    <Ionicons name="restaurant" size={11} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                  </View>
                  <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                    {dish.name || "Dish"}
                  </Text>
                </View>
                {dish.isTrending ? (
                  <View style={[styles.adminTrendingTag, isAdminDark && styles.adminTrendingTagDark]}>
                    <Ionicons name="flame" size={11} color={isAdminDark ? "#FED7AA" : "#C2410C"} />
                    <Text style={[styles.adminTrendingTagText, isAdminDark && styles.adminTrendingTagTextDark]}>
                      Most Trending
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.adminDishStatRow}>
                <Ionicons name="pricetags-outline" size={13} color={isAdminDark ? "#FDBA74" : "#EA580C"} />
                <Text style={[styles.adminDishStatText, isAdminDark && styles.adminDishStatTextDark]}>
                  {dish.category || "General"}
                </Text>
              </View>
              <View style={styles.adminDishStatRow}>
                <Ionicons name="cash-outline" size={13} color={isAdminDark ? "#FDBA74" : "#EA580C"} />
                <Text style={[styles.adminDishStatText, isAdminDark && styles.adminDishStatTextDark]}>
                  LKR {Number(dish.price || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.adminDishStatRow}>
                <Ionicons
                  name={dish.isAvailable ? "checkmark-circle-outline" : "close-circle-outline"}
                  size={13}
                  color={dish.isAvailable ? (isAdminDark ? "#86EFAC" : "#16A34A") : (isAdminDark ? "#FDA4AF" : "#DC2626")}
                />
                <Text style={[styles.adminDishStatText, isAdminDark && styles.adminDishStatTextDark]}>
                  {dish.isAvailable ? "Available now" : "Currently hidden"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.adminActionRow}>
            {typeof editAdminDish === "function" ? (
              <TouchableOpacity
                style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                onPress={() => editAdminDish(dish)}
              >
                <View style={styles.adminActionIconRow}>
                  <Ionicons name="create-outline" size={12} color={isAdminDark ? "#FDBA74" : "#9A3412"} />
                  <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>Edit</Text>
                </View>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
              onPress={() => toggleAdminDishAvailability(dish)}
            >
              <View style={styles.adminActionIconRow}>
                <Ionicons
                  name={dish.isAvailable ? "eye-off-outline" : "eye-outline"}
                  size={12}
                  color={isAdminDark ? "#FDBA74" : "#9A3412"}
                />
                <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                  {dish.isAvailable ? "Hide" : "Show"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
              onPress={() => toggleAdminDishTrending(dish)}
            >
              <View style={styles.adminActionIconRow}>
                <Ionicons
                  name={dish.isTrending ? "flame" : "flame-outline"}
                  size={12}
                  color={isAdminDark ? "#FDBA74" : "#9A3412"}
                />
                <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                  {dish.isTrending ? "Untrend" : "Trend"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
              onPress={() => deleteAdminDish(dish._id)}
            >
              <View style={styles.adminActionIconRow}>
                <Ionicons name="trash-outline" size={12} color={isAdminDark ? "#FCA5A5" : "#FFFFFF"} />
                <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {!visibleDishes.length ? (
        <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
          No dishes found for this category.
        </Text>
      ) : null}
    </View>
  );
}

