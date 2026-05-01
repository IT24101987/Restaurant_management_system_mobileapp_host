import React, { useMemo, useState } from "react";
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
  const [orderCategoryFilter, setOrderCategoryFilter] = useState("all");

  const categorizedOrders = useMemo(() => {
    const source = Array.isArray(filteredCustomerOrders) ? filteredCustomerOrders : [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

    return source.filter((order) => {
      const status = String(order?.status || "").toLowerCase();
      const createdAt = order?.createdAt ? new Date(order.createdAt) : null;
      const validCreatedAt = createdAt && !Number.isNaN(createdAt.getTime());
      const isActive = !["cancelled", "delivered", "served"].includes(status);
      const isToday = validCreatedAt && createdAt >= startOfToday && createdAt < startOfTomorrow;
      const isThisWeek = validCreatedAt && createdAt >= startOfWeek;

      if (orderCategoryFilter === "active") return isActive;
      if (orderCategoryFilter === "today") return isToday;
      if (orderCategoryFilter === "week") return isThisWeek;
      return true;
    });
  }, [filteredCustomerOrders, orderCategoryFilter]);

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
      <View style={styles.orderFiltersPanel}>
        <Text style={styles.orderFiltersLabel}>Status</Text>
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
        <Text style={styles.orderFiltersLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {[
            { key: "all", label: "ALL ORDERS" },
            { key: "active", label: "ACTIVE ORDERS" },
            { key: "today", label: "TODAY" },
            { key: "week", label: "THIS WEEK" }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterChip,
                orderCategoryFilter === option.key && styles.filterChipActive
              ]}
              onPress={() => setOrderCategoryFilter(option.key)}
            >
              <Text style={styles.filterChipText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {customerOrdersMsg ? <Text style={styles.error}>{customerOrdersMsg}</Text> : null}
      {customerOrdersBusy && categorizedOrders.length === 0 ? (
        <View style={styles.centeredInline}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={styles.helperText}>Loading orders...</Text>
        </View>
      ) : null}
      {categorizedOrders.length ? (
        categorizedOrders.map((order) => {
          const itemsText = (order.items || [])
            .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
            .join(", ");
          const orderStatus = String(order.status || "").toLowerCase();
          const canCancel = !["cancelled", "delivered", "served"].includes(orderStatus);
          const statusLabel = orderStatus === "cancelled" ? "Finished" : (order.status || "Unknown");
          const statusBadgeStyle = [
            styles.staffOrderStatusBadge,
            orderStatus === "new" && styles.staffOrderStatusBadgeNew,
            orderStatus === "preparing" && styles.staffOrderStatusBadgePreparing,
            orderStatus === "ready" && styles.staffOrderStatusBadgeReady,
            orderStatus === "served" && styles.staffOrderStatusBadgeServed,
            orderStatus === "delivered" && styles.staffOrderStatusBadgeDelivered,
            orderStatus === "cancelled" && styles.staffOrderStatusBadgeFinished
          ];
          const statusTextStyle = [
            styles.staffOrderStatus,
            orderStatus === "new" && styles.staffOrderStatusTextNew,
            orderStatus === "preparing" && styles.staffOrderStatusTextPreparing,
            orderStatus === "ready" && styles.staffOrderStatusTextReady,
            orderStatus === "served" && styles.staffOrderStatusTextServed,
            orderStatus === "delivered" && styles.staffOrderStatusTextDelivered,
            orderStatus === "cancelled" && styles.staffOrderStatusTextFinished
          ];
          return (
            <View key={String(order._id || order.orderNumber)} style={styles.staffOrderCard}>
              <View style={styles.staffOrderHeader}>
                <Text style={styles.staffOrderTitle}>{order.orderNumber || "Order"}</Text>
                <View style={statusBadgeStyle}>
                  <Text style={statusTextStyle}>{statusLabel}</Text>
                </View>
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
                    style={styles.dangerButton}
                    onPress={() => cancelCustomerOrder(order._id)}
                  >
                    <Text style={styles.dangerButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        })
      ) : (
        <Text style={styles.helperText}>No orders for selected filters.</Text>
      )}
    </ScrollView>
  );
}
