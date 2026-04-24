import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AdminManageOrders({
  adminOrders,
  adminOrdersMsg,
  adminOrdersBusy,
  loadAdminOrders,
  adminOrderCounts,
  adminOrderTypeFilter,
  setAdminOrderTypeFilter,
  adminOrderStatusFilter,
  setAdminOrderStatusFilter,
  adminActiveStatuses,
  getOrderActions,
  updateAdminOrderStatus,
  markAdminOrderPaid,
  cancelAdminOrder,
  setOrderModalVisible,
  formatOrderType,
  formatReservationRange,
  resolveTableLocation,
  formatDateTime,
  styles,
  isAdminDark
}) {
  const DELIVERY_FEE = 250;
  const resolveSubtotal = (order) => {
    if (!order) return 0;
    if (Array.isArray(order.items) && order.items.length) {
      return order.items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
    }
    if (typeof order.totalAmount === "number") return order.totalAmount;
    return 0;
  };

  return (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Manage Orders
        </Text>
        <TouchableOpacity
          style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
          onPress={() => setOrderModalVisible(true)}
        >
          <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
            Add Order
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Orders List
        </Text>
        <TouchableOpacity
          style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
          onPress={loadAdminOrders}
          disabled={adminOrdersBusy}
        >
          <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
            {adminOrdersBusy ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
      {adminOrdersMsg ? <Text style={styles.error}>{adminOrdersMsg}</Text> : null}
      <View style={styles.adminStatsRow}>
        {[
          { label: "Total Orders", value: adminOrderCounts.total },
          { label: "Dine In", value: adminOrderCounts.dineIn },
          { label: "Delivery", value: adminOrderCounts.delivery },
          { label: "Pickup", value: adminOrderCounts.pickup }
        ].map((item) => (
          <View key={item.label} style={[styles.adminStatCard, isAdminDark && styles.adminStatCardDark]}>
            <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>{item.label}</Text>
            <Text style={[styles.adminStatValue, isAdminDark && styles.adminStatValueDark]}>{item.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.adminFilterRow}>
        {["all", "table", "delivery", "pickup"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.adminPill,
              adminOrderTypeFilter === type && styles.adminPillActive,
              isAdminDark && styles.adminPillDark,
              isAdminDark && adminOrderTypeFilter === type && styles.adminPillActiveDark
            ]}
            onPress={() => setAdminOrderTypeFilter(type)}
          >
            <Text style={[styles.adminPillText, isAdminDark && styles.adminPillTextDark]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
        {["all", "active"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.adminPill,
              adminOrderStatusFilter === status && styles.adminPillActive,
              isAdminDark && styles.adminPillDark,
              isAdminDark && adminOrderStatusFilter === status && styles.adminPillActiveDark
            ]}
            onPress={() => setAdminOrderStatusFilter(status)}
          >
            <Text style={[styles.adminPillText, isAdminDark && styles.adminPillTextDark]}>
              {status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {adminOrders
        .filter((order) =>
          adminOrderTypeFilter === "all" ? true : String(order.orderType) === adminOrderTypeFilter
        )
        .filter((order) =>
          adminOrderStatusFilter === "active" ? adminActiveStatuses.includes(order.status) : true
        )
        .map((order) => {
          const actions = getOrderActions(order);
          const itemsText = (order.items || [])
            .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
            .join(", ");
          const isTable = String(order.orderType || "").toLowerCase() === "table";
          const isDelivery = String(order.orderType || "").toLowerCase() === "delivery";
          const subtotal = resolveSubtotal(order);
          const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
          const totalToPay = subtotal + deliveryFee;
          const bookingType = order.isManualBooking ? "MANUAL" : "CUSTOMER";
          const reservationDisplay = formatReservationRange ? formatReservationRange(order) : "";
          const tableLabel = order.tableNumber || order.tableId?.tableNo || order.tableId?.name || "-";
          const locationLabel = resolveTableLocation ? resolveTableLocation(order) : "";
          return (
            <View key={String(order._id)} style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
              <View style={styles.adminCardHeader}>
                <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                  {order.orderNumber || "Order"}
                </Text>
                <Text style={[styles.adminStatusText, isAdminDark && styles.adminStatusTextDark]}>
                  {order.status || "Unknown"}
                </Text>
              </View>
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                Type: {formatOrderType(order.orderType)} • Payment: {order.paymentStatus || "Unpaid"}
              </Text>
              {isTable ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <View style={{ backgroundColor: order.isManualBooking ? "#6C5CE7" : "#00B894", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>{bookingType}</Text>
                  </View>
                  <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                    Table: {tableLabel} • Seats: {order.seatCount || "-"}
                  </Text>
                </View>
              ) : null}
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                Customer: {order.customerName || order.createdBy || "-"}
              </Text>
              {isTable ? (
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  Booking: {reservationDisplay || order.timeSlotLabel || "-"}
                </Text>
              ) : null}
              {isTable && locationLabel ? (
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  Location: {locationLabel}
                </Text>
              ) : null}
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                Items: {itemsText || "-"}
              </Text>
              {isDelivery ? (
                <>
                  <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                    Subtotal: LKR {subtotal.toFixed(2)}
                  </Text>
                  <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                    Delivery Fee: LKR {deliveryFee.toFixed(2)}
                  </Text>
                  <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                    Total to Pay: LKR {totalToPay.toFixed(2)}
                  </Text>
                </>
              ) : null}
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                Created: {formatDateTime(order.createdAt)}
              </Text>
              <View style={styles.adminActionRow}>
                {actions.map((action) => (
                  <TouchableOpacity
                    key={`${order._id}-${action.status}`}
                    style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                    onPress={() => updateAdminOrderStatus(order._id, action.status)}
                  >
                    <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                  onPress={() => markAdminOrderPaid(order._id)}
                >
                  <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                    Mark Paid
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                  onPress={() => cancelAdminOrder(order._id)}
                >
                  <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
    </View>
  );
}
