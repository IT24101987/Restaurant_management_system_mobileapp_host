import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function StaffDashboard({
  profile,
  roleLabel,
  staffOrders,
  staffOrdersBusy,
  staffOrdersMsg,
  loadStaffOrders,
  updateStaffOrderStatus,
  getOrderActions,
  formatOrderType,
  handleLogout,
  styles,
  theme,
  isDark
}) {
  return (
    <ScrollView contentContainerStyle={[styles.staffContainer, styles.bottomNavSpace]}>
      <View style={styles.staffHeader}>
        <Text style={styles.brand}>THE GOLDEN FORK</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.link}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.staffBadgeRow}>
        <Text style={styles.staffTitle}>Staff Dashboard</Text>
        <Text style={styles.staffBadge}>{roleLabel}</Text>
      </View>

      <View style={styles.staffCard}>
        <Text style={styles.staffCardTitle}>
          Welcome {profile?.firstname ? profile.firstname : roleLabel}
        </Text>
        <Text style={styles.staffCardText}>Track and update live orders.</Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={loadStaffOrders}
          disabled={staffOrdersBusy}
        >
          <Text style={styles.secondaryText}>
            {staffOrdersBusy ? "Refreshing..." : "Refresh Orders"}
          </Text>
        </TouchableOpacity>
      </View>

      {staffOrdersMsg ? <Text style={styles.error}>{staffOrdersMsg}</Text> : null}

      <Text style={styles.sectionTitle}>Orders</Text>

      {staffOrdersBusy && staffOrders.length === 0 ? (
        <View style={styles.centeredInline}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={styles.helperText}>Loading orders...</Text>
        </View>
      ) : null}

      {staffOrders.length ? (
        staffOrders.map((order) => {
          const actions = getOrderActions(order);
          const itemsText = (order.items || [])
            .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
            .join(", ");
          return (
            <View key={String(order._id || order.orderNumber)} style={styles.staffOrderCard}>
              <View style={styles.staffOrderHeader}>
                <Text style={styles.staffOrderTitle}>{order.orderNumber || "Order"}</Text>
                <Text style={styles.staffOrderStatus}>{order.status || "Unknown"}</Text>
              </View>
              <Text style={styles.staffOrderMeta}>
                Type: {formatOrderType(order.orderType)} - Payment: {order.paymentStatus || "Unpaid"}
              </Text>
              <Text style={styles.staffOrderMeta}>
                Customer: {order.customerName || order.createdBy || "-"}
              </Text>
              <Text style={styles.staffOrderMeta}>
                Items: {itemsText || "-"}
              </Text>
              <View style={styles.staffActionRow}>
                {actions.length ? (
                  actions.map((action) => (
                    <TouchableOpacity
                      key={`${order._id}-${action.status}`}
                      style={styles.staffActionButton}
                      onPress={() => updateStaffOrderStatus(order._id, action.status)}
                    >
                      <Text style={styles.staffActionText}>{action.label}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.helperText}>No actions</Text>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.helperText}>No orders found.</Text>
      )}
    </ScrollView>
  );
}
