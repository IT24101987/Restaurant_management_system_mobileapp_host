import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({
  dishes,
  filteredMenuDishes,
  cartCount,
  trendingDishes,
  menuCategories,
  menuCategoryFilter,
  setMenuCategoryFilter,
  catalogBusy,
  loadCatalog,
  openOrderModal,
  addToCart,
  setOrderModalVisible,
  renderDishImage,
  renderTrendingCard,
  renderCustomerHeader,
  styles,
  theme,
  isDark
}) {
  if (catalogBusy && dishes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={styles.helperText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredMenuDishes}
      keyExtractor={(item) => String(item._id || item.name)}
      contentContainerStyle={[styles.catalogList, styles.bottomNavSpace]}
      ListHeaderComponent={
        <View>
          {renderCustomerHeader("Our Dishes", "Fresh, crafted, and served with care.")}

          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Your Order</Text>
            <Text style={styles.helperText}>Cart items: {cartCount}</Text>
            <TouchableOpacity
              style={styles.openOrderButton}
              onPress={() => setOrderModalVisible(true)}
            >
              <Text style={styles.primaryText}>Open Order</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Trending</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={loadCatalog} disabled={catalogBusy}>
              <Text style={styles.secondaryText}>{catalogBusy ? "Refreshing..." : "Refresh"}</Text>
            </TouchableOpacity>
          </View>

          {trendingDishes.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
              {trendingDishes.map((dish) => renderTrendingCard(dish))}
            </ScrollView>
          ) : (
            <Text style={styles.helperText}>No trending dishes yet.</Text>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={loadCatalog} disabled={catalogBusy}>
              <Text style={styles.secondaryText}>{catalogBusy ? "Refreshing..." : "Refresh"}</Text>
            </TouchableOpacity>
          </View>
          {menuCategories.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  menuCategoryFilter === "all" && styles.filterChipActive
                ]}
                onPress={() => setMenuCategoryFilter("all")}
              >
                <Text style={styles.filterChipText}>ALL</Text>
              </TouchableOpacity>
              {menuCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    menuCategoryFilter === cat && styles.filterChipActive
                  ]}
                  onPress={() => setMenuCategoryFilter(cat)}
                >
                  <Text style={styles.filterChipText}>{String(cat).toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.menuCard}>
          {renderDishImage(item)}
          <View style={styles.menuMetaStrip}>
            <Text style={styles.menuMetaText}>{item.category || "General"}</Text>
            <Text style={styles.menuMetaText}>Prep {item.prepTimeMin || 0}m</Text>
            <Text style={styles.menuMetaText}>LKR {Number(item.price || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{item.name || "Unnamed dish"}</Text>
            <Text style={styles.menuDescription}>{item.description || "No details added by admin."}</Text>
            <Text style={styles.menuRating}>
              Rating {Number(item.averageRating || 0).toFixed(1)} / 5
            </Text>
            <View style={[styles.statusBadge, item.isAvailable ? styles.statusOk : styles.statusNo]}>
              <Text style={styles.statusText}>{item.isAvailable ? "Available" : "Not Available"}</Text>
            </View>
            {item.isAvailable ? (
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionGhost} onPress={() => addToCart(item)}>
                  <Text style={styles.actionGhostText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionGhost} onPress={() => openOrderModal(item, "table")}>
                  <Text style={styles.actionGhostText}>Dine In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionGhost} onPress={() => openOrderModal(item, "delivery")}>
                  <Text style={styles.actionGhostText}>Delivery</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      )}
    />
  );
}
