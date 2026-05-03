import React, { useEffect, useState } from "react";
import { Image, Modal, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  addDishToAdminOrder,
  adminDishes,
  setOrderModalVisible,
  formatOrderType,
  formatReservationRange,
  resolveTableLocation,
  formatDateTime,
  styles,
  isAdminDark
}) {
  const [ordersTab, setOrdersTab] = useState("all");
  const [dishModalVisible, setDishModalVisible] = useState(false);
  const [dishModalOrder, setDishModalOrder] = useState(null);
  const [dishQuantities, setDishQuantities] = useState({});
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
  const renderMetaRow = (iconName, text, key) => (
    <View key={key} style={styles.staffOrderInfoRow}>
      <View style={styles.staffOrderInfoIconWrap}>
        <Ionicons name={iconName} size={12} color={isAdminDark ? "#FDBA74" : "#F97316"} />
      </View>
      <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark, { flex: 1 }]}>
        {text}
      </Text>
    </View>
  );

  useEffect(() => {
    setAdminOrderStatusFilter(ordersTab === "active" ? "active" : "all");
  }, [ordersTab, setAdminOrderStatusFilter]);


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
      <View style={styles.profileTabs}>
        {[
          { key: "all", label: "All Orders" },
          { key: "active", label: "Active Orders" }
        ].map((tab) => {
          const active = ordersTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.profileTabButton, active && styles.profileTabButtonActive]}
              onPress={() => setOrdersTab(tab.key)}
            >
              <Text style={[styles.profileTabText, active && styles.profileTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
      </View>
      {adminOrders
        .filter((order) =>
          adminOrderTypeFilter === "all" ? true : String(order.orderType) === adminOrderTypeFilter
        )
        .filter((order) => {
          if (adminOrderStatusFilter !== "active") return true;
          const normalizedStatus = String(order?.status || "").trim().toLowerCase();
          const normalizedActive = Array.isArray(adminActiveStatuses)
            ? adminActiveStatuses.map((status) => String(status || "").trim().toLowerCase())
            : [];
          if (normalizedActive.length) {
            return normalizedActive.includes(normalizedStatus);
          }
          return ["new", "preparing", "ready", "pending", "confirmed", "processing"].includes(
            normalizedStatus
          );
        })
        .map((order) => {
          const actions = getOrderActions(order);
          const itemsText = (order.items || [])
            .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
            .join(", ");
          const rawStatus = String(order.status || "").toLowerCase();
          const statusLabel = ["cancelled", "served", "delivered"].includes(rawStatus)
            ? "Finished"
            : (order.status || "Unknown");
          const statusPillStyle = [
            styles.adminStatusPill,
            isAdminDark && styles.adminStatusPillDark,
            rawStatus === "new" && styles.adminStatusPillNew,
            rawStatus === "preparing" && styles.adminStatusPillPreparing,
            rawStatus === "ready" && styles.adminStatusPillReady,
            rawStatus === "served" && styles.adminStatusPillServed,
            rawStatus === "delivered" && styles.adminStatusPillDelivered,
            rawStatus === "cancelled" && styles.adminStatusPillFinished
          ];
          const statusTextStyle = [
            styles.adminStatusText,
            isAdminDark && styles.adminStatusTextDark,
            rawStatus === "new" && styles.adminStatusTextNew,
            rawStatus === "preparing" && styles.adminStatusTextPreparing,
            rawStatus === "ready" && styles.adminStatusTextReady,
            rawStatus === "served" && styles.adminStatusTextServed,
            rawStatus === "delivered" && styles.adminStatusTextDelivered,
            rawStatus === "cancelled" && styles.adminStatusTextFinished
          ];
          const isTable = String(order.orderType || "").toLowerCase() === "table";
          const isDelivery = String(order.orderType || "").toLowerCase() === "delivery";
          const subtotal = resolveSubtotal(order);
          const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
          const totalToPay =
            typeof order.totalAmount === "number"
              ? Number(order.totalAmount)
              : subtotal + deliveryFee;
          const paymentType = String(order.paymentMethod || "cash").toUpperCase();
          const isPaid = String(order.paymentStatus || "").toLowerCase() === "paid";
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
                <View style={statusPillStyle}>
                  <Text style={statusTextStyle}>
                    {statusLabel}
                  </Text>
                </View>
              </View>
              {renderMetaRow(
                "receipt-outline",
                `Type: ${formatOrderType(order.orderType)} • Payment: ${order.paymentStatus || "Unpaid"}`,
                `admin-type-${order._id}`
              )}
              {isTable ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <View style={{ backgroundColor: order.isManualBooking ? "#6C5CE7" : "#00B894", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>{bookingType}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    {renderMetaRow(
                      "grid-outline",
                      `Table: ${tableLabel} • Seats: ${order.seatCount || "-"}`,
                      `admin-table-${order._id}`
                    )}
                  </View>
                </View>
              ) : null}
              {renderMetaRow(
                "person-outline",
                `Customer: ${order.customerName || order.createdBy || "-"}`,
                `admin-customer-${order._id}`
              )}
              {isTable ? (
                renderMetaRow(
                  "calendar-outline",
                  `Booking: ${reservationDisplay || order.timeSlotLabel || "-"}`,
                  `admin-booking-${order._id}`
                )
              ) : null}
              {isTable && locationLabel ? (
                renderMetaRow("location-outline", `Location: ${locationLabel}`, `admin-location-${order._id}`)
              ) : null}
              {renderMetaRow("list-outline", `Items: ${itemsText || "-"}`, `admin-items-${order._id}`)}
              {renderMetaRow(
                "card-outline",
                `Payment Type: ${paymentType}`,
                `admin-payment-type-${order._id}`
              )}
              {renderMetaRow(
                "cash-outline",
                `Subtotal: LKR ${subtotal.toFixed(2)}`,
                `admin-subtotal-${order._id}`
              )}
              {isDelivery ? (
                renderMetaRow(
                  "car-outline",
                  `Delivery Fee: LKR ${deliveryFee.toFixed(2)}`,
                  `admin-delivery-${order._id}`
                )
              ) : null}
              {renderMetaRow(
                "wallet-outline",
                `Have to Pay: LKR ${Number(totalToPay || 0).toFixed(2)}`,
                `admin-total-${order._id}`
              )}
              {renderMetaRow(
                "time-outline",
                `Created: ${formatDateTime(order.createdAt)}`,
                `admin-created-${order._id}`
              )}
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
                  style={[
                    styles.adminActionButton,
                    isAdminDark && styles.adminActionButtonDark,
                    isPaid && { opacity: 0.5 }
                  ]}
                  onPress={() => {
                    if (!isPaid) {
                      setDishModalOrder(order);
                      setDishQuantities({});
                      setDishModalVisible(true);
                    }
                  }}
                  disabled={isPaid}
                >
                  <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                    {isPaid ? "Paid Order" : "Add Dish"}
                  </Text>
                </TouchableOpacity>
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
      <Modal
        visible={dishModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setDishModalVisible(false);
          setDishModalOrder(null);
          setDishQuantities({});
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Dish To Order</Text>
              <TouchableOpacity
                onPress={() => {
                  setDishModalVisible(false);
                  setDishModalOrder(null);
                  setDishQuantities({});
                }}
              >
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
                <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                  {dishModalOrder?.orderNumber || "Order"}
                </Text>
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  Payment: {dishModalOrder?.paymentStatus || "unpaid"}
                </Text>
              </View>
              {(adminDishes || []).length ? (
                (adminDishes || []).map((dish) => (
                  <View
                    key={`modal-dish-${dish._id}`}
                    style={[
                      styles.adminCard,
                      isAdminDark && styles.adminCardDark,
                      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }
                    ]}
                  >
                    {dish.imageUrl ? (
                      <Image
                        source={{ uri: dish.imageUrl }}
                        style={{ width: 44, height: 44, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isAdminDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.15)"
                        }}
                      >
                        <Ionicons
                          name="image-outline"
                          size={18}
                          color={isAdminDark ? "#94A3B8" : "#64748B"}
                        />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                        {dish.name || "Dish"}
                      </Text>
                      <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                        LKR {Number(dish.price || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <TouchableOpacity
                        style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                        onPress={() => {
                          const currentQty = Number(dishQuantities[dish._id] || 0);
                          setDishQuantities((current) => ({
                            ...current,
                            [dish._id]: Math.max(currentQty - 1, 0)
                          }));
                        }}
                      >
                        <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>-</Text>
                      </TouchableOpacity>
                      <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark, { minWidth: 18, textAlign: "center" }]}>
                        {Number(dishQuantities[dish._id] || 0)}
                      </Text>
                      <TouchableOpacity
                        style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                        onPress={() => {
                          const currentQty = Number(dishQuantities[dish._id] || 0);
                          setDishQuantities((current) => ({
                            ...current,
                            [dish._id]: currentQty + 1
                          }));
                        }}
                      >
                        <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.adminActionButton,
                          isAdminDark && styles.adminActionButtonDark,
                          Number(dishQuantities[dish._id] || 0) < 1 && { opacity: 0.5 }
                        ]}
                        disabled={Number(dishQuantities[dish._id] || 0) < 1}
                        onPress={async () => {
                          if (!dishModalOrder) return;
                          const qty = Number(dishQuantities[dish._id] || 0);
                          if (qty < 1) return;
                          await addDishToAdminOrder(dishModalOrder, dish, qty);
                          setDishQuantities((current) => ({ ...current, [dish._id]: 0 }));
                        }}
                      >
                        <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  No dishes available.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}




