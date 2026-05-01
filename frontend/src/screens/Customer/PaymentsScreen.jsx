import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function PaymentsScreen({
  styles,
  accentColor,
  savedCards,
  setDefaultSavedCard,
  deleteSavedCard,
  addCardOpen,
  setAddCardOpen,
  savedCardForm,
  setSavedCardForm,
  addSavedCard,
  customerPaymentsFilter,
  setCustomerPaymentsFilter,
  customerPaymentsMsg,
  customerPaymentsBusy,
  filteredPayments,
  loadCustomerPayments,
  loadCustomerOrders,
  unpaidOrders,
  formatDateTime
}) {
  const [brandOpen, setBrandOpen] = useState(false);
  const brandOptions = ["Visa", "Mastercard", "Amex", "Discover", "UnionPay", "Other"];
  const isUnpaidFilter = customerPaymentsFilter === "unpaid";
  const visibleUnpaidOrders = Array.isArray(unpaidOrders) ? unpaidOrders : [];
  const isLoadingResults = customerPaymentsBusy && (isUnpaidFilter ? visibleUnpaidOrders.length === 0 : filteredPayments.length === 0);

  const formatCardNumber = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(" ");
  };
  const renderMetaRow = (iconName, text, key) => (
    <View key={key} style={styles.staffOrderInfoRow}>
      <View style={styles.staffOrderInfoIconWrap}>
        <Ionicons name={iconName} size={12} color={accentColor || "#F58A3B"} />
      </View>
      <Text style={styles.staffOrderInfoText}>{text}</Text>
    </View>
  );
  const renderStatusBubble = (status) => {
    const normalized = String(status || "").toLowerCase();
    const isPaid = normalized === "paid";
    return (
      <View
        style={[
          styles.paymentStatusBubble,
          isPaid ? styles.paymentStatusBubblePaid : styles.paymentStatusBubbleUnpaid
        ]}
      >
        <Text
          style={[
            styles.paymentStatusBubbleText,
            isPaid ? styles.paymentStatusBubbleTextPaid : styles.paymentStatusBubbleTextUnpaid
          ]}
        >
          {isPaid ? "PAID" : "UNPAID"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Payments</Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            loadCustomerPayments();
            if (typeof loadCustomerOrders === "function") {
              loadCustomerOrders();
            }
          }}
          disabled={customerPaymentsBusy}
        >
          <Text style={styles.secondaryText}>
            {customerPaymentsBusy ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {[
          { key: "unpaid", label: "UNPAID" },
          { key: "paid", label: "PAID" },
          { key: "refunds", label: "REFUNDS" }
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterChip,
              customerPaymentsFilter === option.key && styles.filterChipActive
            ]}
            onPress={() => setCustomerPaymentsFilter(option.key)}
          >
            <Text style={styles.filterChipText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {customerPaymentsMsg ? <Text style={styles.error}>{customerPaymentsMsg}</Text> : null}
      {isLoadingResults ? (
        <View style={styles.centeredInline}>
          <ActivityIndicator size="small" color={accentColor || "#F58A3B"} />
          <Text style={styles.helperText}>Loading payments...</Text>
        </View>
      ) : null}
      {isUnpaidFilter ? (
        visibleUnpaidOrders.length ? (
          visibleUnpaidOrders.map((order) => {
            const totalAmountValue =
              typeof order.totalAmount === "number"
                ? order.totalAmount
                : (Array.isArray(order.items) ? order.items : []).reduce(
                    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
                    0
                  );
            const totalAmount = Number(totalAmountValue || 0).toFixed(2);
            return (
              <View
                key={String(order._id || order.orderNumber)}
                style={styles.seatMapCard}
              >
                <View style={styles.seatMapHeader}>
                  <Text style={styles.staffOrderTitle}>{order.orderNumber || "Order"}</Text>
                  {renderStatusBubble("unpaid")}
                </View>
                {renderMetaRow("cash-outline", `Amount: ${totalAmount}`, `unpaid-amount-${order._id}`)}
                {renderMetaRow(
                  "card-outline",
                  `Method: ${String(order.paymentMethod || "cash").toUpperCase()}`,
                  `unpaid-method-${order._id}`
                )}
                {renderMetaRow(
                  "time-outline",
                  `Created: ${formatDateTime(order.createdAt)}`,
                  `unpaid-created-${order._id}`
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.helperText}>No unpaid orders.</Text>
        )
      ) : (
        filteredPayments.length ? (
          filteredPayments.map((payment) => {
            const totalAmount =
              typeof payment.totalAmount === "number"
                ? payment.totalAmount.toFixed(2)
                : payment.totalAmount || "-";
            const refundStatus = payment.refundStatus || "none";
            return (
              <View
                key={String(payment._id || payment.paymentId || payment.orderId?._id)}
                style={styles.seatMapCard}
              >
                <View style={styles.seatMapHeader}>
                  <Text style={styles.staffOrderTitle}>
                    {payment.orderNumber || payment.orderId?.orderNumber || "Payment"}
                  </Text>
                  {renderStatusBubble("paid")}
                </View>
                <Text style={styles.staffOrderMeta}>{payment.paymentId || "ID pending"}</Text>
                {renderMetaRow(
                  "cash-outline",
                  `Amount: ${totalAmount}`,
                  `payment-amount-${payment._id || payment.paymentId}`
                )}
                {renderMetaRow(
                  "card-outline",
                  `Method: ${String(payment.paymentMethod || "cash").toUpperCase()}`,
                  `payment-method-${payment._id || payment.paymentId}`
                )}
                {renderMetaRow(
                  "checkmark-done-outline",
                  `Paid: ${formatDateTime(payment.createdAt)}`,
                  `payment-paid-${payment._id || payment.paymentId}`
                )}
                {renderMetaRow(
                  "arrow-undo-outline",
                  `Refund: ${refundStatus}`,
                  `payment-refund-${payment._id || payment.paymentId}`
                )}
                {payment.refundRequestedAt ? (
                  renderMetaRow(
                    "help-circle-outline",
                    `Requested: ${formatDateTime(payment.refundRequestedAt)}`,
                    `payment-requested-${payment._id || payment.paymentId}`
                  )
                ) : null}
                {payment.refundedAt ? (
                  renderMetaRow(
                    "checkmark-circle-outline",
                    `Refunded: ${formatDateTime(payment.refundedAt)}`,
                    `payment-refunded-${payment._id || payment.paymentId}`
                  )
                ) : null}
              </View>
            );
          })
        ) : (
          <Text style={styles.helperText}>
            {customerPaymentsFilter === "refunds" ? "No refunds yet." : "No paid payments yet."}
          </Text>
        )
      )}

      <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
      </View>
      <TouchableOpacity
        style={styles.actionPrimary}
        onPress={() => setAddCardOpen(true)}
      >
        <Text style={styles.actionPrimaryText}>Add Card</Text>
      </TouchableOpacity>

      <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitle}>Saved Cards</Text>
      </View>
      {savedCards.length ? (
        savedCards.map((card) => (
          <View
            key={String(card._id)}
            style={styles.savedCardItem}
          >
            <View style={styles.seatMapHeader}>
              <Text style={styles.staffOrderTitle}>
                {card.brand || "Card"} **** {card.last4}
              </Text>
              {card.isDefault ? <Text style={styles.helperText}>Default</Text> : null}
            </View>
            <Text style={styles.staffOrderMeta}>
              Exp {card.expiryMonth}/{card.expiryYear}
            </Text>
            <View style={styles.orderActionRow}>
              {!card.isDefault ? (
                <TouchableOpacity
                  style={styles.actionGhost}
                  onPress={() => setDefaultSavedCard(card._id)}
                >
                  <Text style={styles.actionGhostText}>Set Default</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.actionGhost}
                onPress={() => deleteSavedCard(card._id)}
              >
                <Text style={styles.actionGhostText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.helperText}>No saved cards yet.</Text>
      )}

      <Modal
        visible={addCardOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAddCardOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Card</Text>
              <TouchableOpacity onPress={() => setAddCardOpen(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.cardBlock}>
                <TextInput
                  style={styles.input}
                  placeholder="Cardholder name"
                  placeholderTextColor="#8F98A8"
                  value={savedCardForm.cardHolderName}
                  onChangeText={(value) => setSavedCardForm((s) => ({ ...s, cardHolderName: value }))}
                />
                <TouchableOpacity
                  style={[styles.orderDropdown, brandOpen && styles.orderDropdownOpen]}
                  onPress={() => setBrandOpen((current) => !current)}
                >
                  <Text style={styles.orderDropdownText}>
                    {savedCardForm.brand || "Select card brand"}
                  </Text>
                </TouchableOpacity>
                {brandOpen ? (
                  <View style={styles.orderDropdownList}>
                    {brandOptions.map((brand) => {
                      const isActive = String(savedCardForm.brand) === String(brand);
                      return (
                        <TouchableOpacity
                          key={brand}
                          style={[
                            styles.orderDropdownOption,
                            isActive && styles.orderDropdownOptionActive
                          ]}
                          onPress={() => {
                            setSavedCardForm((s) => ({ ...s, brand }));
                            setBrandOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.orderDropdownOptionText,
                              isActive && styles.orderDropdownOptionTextActive
                            ]}
                          >
                            {brand}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
                <TextInput
                  style={styles.input}
                  placeholder="Card number"
                  placeholderTextColor="#8F98A8"
                  value={formatCardNumber(savedCardForm.cardNumber)}
                  onChangeText={(value) =>
                    setSavedCardForm((s) => ({
                      ...s,
                      cardNumber: String(value || "").replace(/\D/g, "").slice(0, 16)
                    }))
                  }
                  keyboardType="number-pad"
                />
                <View style={styles.expiryRow}>
                  <TextInput
                    style={[styles.input, styles.expiryInput]}
                    placeholder="MM"
                    placeholderTextColor="#8F98A8"
                    value={savedCardForm.expiryMonth}
                    onChangeText={(value) => setSavedCardForm((s) => ({ ...s, expiryMonth: value }))}
                    keyboardType="number-pad"
                  />
                  <TextInput
                    style={[styles.input, styles.expiryInput]}
                    placeholder="YYYY"
                    placeholderTextColor="#8F98A8"
                    value={savedCardForm.expiryYear}
                    onChangeText={(value) => setSavedCardForm((s) => ({ ...s, expiryYear: value }))}
                    keyboardType="number-pad"
                  />
                </View>
                <TouchableOpacity
                  style={styles.placeOrderButton}
                  onPress={() => {
                    addSavedCard(savedCardForm);
                    setAddCardOpen(false);
                  }}
                >
                  <Text style={styles.primaryText}>Save Card</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}


