import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function OrdersScreen({
  customerOrders,
  filteredCustomerOrders,
  customerOrdersBusy,
  customerOrdersMsg,
  loadCustomerOrders,
  orderStatusFilter,
  setOrderStatusFilter,
  cancelCustomerOrder,
  formatOrderType,
  formatReservationRange,
  formatDateTime,
  normalizeOrderType,
  renderCustomerHeader,
  styles,
  theme
}) {
  return (
    <ScrollView contentContainerStyle={[styles.catalogList, styles.bottomNavSpace]}>
      {renderCustomerHeader("My Orders", "Track your recent bookings.")}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Orders</Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={loadCustomerOrders}
          disabled={customerOrdersBusy}
        >
          <Text style={styles.secondaryText}>
            {customerOrdersBusy ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {["all", "new", "preparing", "ready", "served", "delivered", "cancelled"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              orderStatusFilter === status && styles.filterChipActive
            ]}
            onPress={() => setOrderStatusFilter(status)}
          >
            <Text style={styles.filterChipText}>{status.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {customerOrdersMsg ? <Text style={styles.error}>{customerOrdersMsg}</Text> : null}
      {customerOrdersBusy && filteredCustomerOrders.length === 0 ? (
        <View style={styles.centeredInline}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={styles.helperText}>Loading orders...</Text>
        </View>
      ) : null}
      {filteredCustomerOrders.length ? (
        filteredCustomerOrders.map((order) => {
          const itemsText = (order.items || [])
            .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
            .join(", ");
          const orderStatus = String(order.status || "").toLowerCase();
          const canCancel = !["cancelled", "delivered", "served"].includes(orderStatus);
          return (
            <View key={String(order._id || order.orderNumber)} style={styles.staffOrderCard}>
              <View style={styles.staffOrderHeader}>
                <Text style={styles.staffOrderTitle}>{order.orderNumber || "Order"}</Text>
                <Text style={styles.staffOrderStatus}>{order.status || "Unknown"}</Text>
              </View>
              <Text style={styles.staffOrderMeta}>
                Type: {formatOrderType(order.orderType)} - Payment: {order.paymentStatus || "Unpaid"}
              </Text>
              {normalizeOrderType(order.orderType) === "table" ? (
                <Text style={styles.staffOrderMeta}>
                  Table: {order.tableNumber || order.tableId?.tableNo || "-"} - Seats: {order.seatCount || "-"}
                </Text>
              ) : null}
              <Text style={styles.staffOrderMeta}>
                Booking: {formatReservationRange(order)}
              </Text>
              <Text style={styles.staffOrderMeta}>
                Created: {formatDateTime(order.createdAt)}
              </Text>
              <Text style={styles.staffOrderMeta}>
                Items: {itemsText || "-"}
              </Text>
              {canCancel ? (
                <View style={styles.orderActionRow}>
                  <TouchableOpacity
                    style={styles.actionGhost}
                    onPress={() => cancelCustomerOrder(order._id)}
                  >
                    <Text style={styles.actionGhostText}>Cancel Order</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        })
      ) : (
        <Text style={styles.helperText}>No orders for selected status.</Text>
      )}
    </ScrollView>
  );
}
