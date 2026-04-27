import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";

export default function AdminManagePayments({
  styles,
  isAdminDark,
  adminPaymentStats,
  adminRevenue,
  adminPaymentDefaults,
  saveAdminPaymentDefaults,
  adminOrders,
  adminActiveOrders,
  adminPayments,
  adminPaymentsBusy,
  adminPaymentsMsg,
  loadAdminPayments,
  reviewRefundRequest,
  directRefundPayment,
  markAdminOrderPaid,
  createAdminPayment,
  formatOrderType,
  formatDateTime
}) {
  const MANUAL_BOOKING_FEE = 250;
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [taxPercent, setTaxPercent] = useState("0");
  const [offerType, setOfferType] = useState("fixed");
  const [offerValue, setOfferValue] = useState("0");
  const [paymentError, setPaymentError] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [refundBusyId, setRefundBusyId] = useState("");
  const [refundMsg, setRefundMsg] = useState("");

  const selectedOrder = useMemo(
    () => adminOrders.find((order) => String(order._id) === String(selectedOrderId)),
    [adminOrders, selectedOrderId]
  );

  const paidOrders = useMemo(
    () =>
      adminOrders.filter(
        (order) => String(order.paymentStatus || "").toLowerCase() === "paid"
      ),
    [adminOrders]
  );
  const unpaidOrders = useMemo(
    () =>
      adminOrders.filter((order) => {
        const paymentStatus = String(order?.paymentStatus || "unpaid").toLowerCase();
        const orderStatus = String(order?.status || "").toLowerCase();
        return paymentStatus !== "paid" && orderStatus !== "cancelled";
      }),
    [adminOrders]
  );

  const refundRequests = useMemo(() => {
    return (adminPayments || []).filter(
      (payment) => String(payment?.refundStatus || "").toLowerCase() === "requested"
    );
  }, [adminPayments]);

  const paymentByOrderId = useMemo(() => {
    const map = new Map();
    (adminPayments || []).forEach((payment) => {
      const orderId = payment?.orderId?._id || payment?.orderId || "";
      if (orderId) map.set(String(orderId), payment);
    });
    return map;
  }, [adminPayments]);

  const resolveOrderPaymentMethod = (order) => {
    const method = String(order?.paymentMethod || "").toLowerCase();
    return method === "card" ? "card" : "cash";
  };

  useEffect(() => {
    if (!selectedOrder) return;
    setSelectedMethod(resolveOrderPaymentMethod(selectedOrder));
    setTaxPercent(String(adminPaymentDefaults?.taxPercent ?? "0"));
    setOfferType(
      String(adminPaymentDefaults?.offerType || "fixed").toLowerCase() === "percent"
        ? "percent"
        : "fixed"
    );
    setOfferValue(String(adminPaymentDefaults?.offerValue ?? "0"));
    setPaymentError("");
    setSettingsMsg("");
  }, [selectedOrder, adminPaymentDefaults]);

  const resolveOrderTotal = (order) => {
    if (!order) return 0;
    if (typeof order.totalAmount === "number") {
      if (order.isManualBooking && Number(order.totalAmount) <= 0) {
        return MANUAL_BOOKING_FEE;
      }
      return order.totalAmount;
    }
    const itemsTotal = (order.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    if (order.isManualBooking && itemsTotal <= 0) return MANUAL_BOOKING_FEE;
    return itemsTotal;
  };

  const getBreakdown = () => {
    if (!selectedOrder) return { subtotal: 0, discount: 0, tax: 0, total: 0 };
    const subtotal = resolveOrderTotal(selectedOrder);
    const taxValue = Math.max(Number(taxPercent || 0), 0);
    const offerValueNum = Math.max(Number(offerValue || 0), 0);
    const discount =
      offerType === "percent"
        ? Math.min(subtotal * (offerValueNum / 100), subtotal)
        : Math.min(offerValueNum, subtotal);
    const taxable = Math.max(subtotal - discount, 0);
    const tax = taxable * (taxValue / 100);
    const total = taxable + tax;
    return { subtotal, discount, tax, total };
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const renderInvoiceHtml = (order, payment) => {
    const items = Array.isArray(order?.items) ? order.items : [];
    const itemRows = items.length
      ? items
          .map((item) => {
            const name = escapeHtml(item?.name || "Item");
            const qty = Number(item?.quantity || 0);
            const price = Number(item?.price || 0);
            const lineTotal = qty * price;
            return `
              <tr>
                <td>${name}</td>
                <td style="text-align:center">${qty}</td>
                <td style="text-align:right">Rs ${price.toFixed(2)}</td>
                <td style="text-align:right">Rs ${lineTotal.toFixed(2)}</td>
              </tr>
            `;
          })
          .join("")
      : `<tr><td colspan="4">No items</td></tr>`;

    const subtotal = Number(payment?.subtotal ?? resolveOrderTotal(order));
    const discount = Number(payment?.discountAmount || 0);
    const tax = Number(payment?.taxAmount || 0);
    const total = Number(payment?.totalAmount ?? subtotal - discount + tax);
    const paidAt = payment?.createdAt || order?.updatedAt || order?.createdAt;

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(payment?.paymentId || payment?._id || order?.orderNumber || "INV")}</title>
    <style>
      body { font-family: Arial, sans-serif; background:#f7f3ee; color:#2b1a0e; margin:0; padding:20px; }
      .invoice { border:1px solid #d7a463; border-radius:10px; max-width:900px; margin:0 auto; background:#f9f5ee; padding:24px; }
      .brand { text-align:center; color:#b96f12; letter-spacing:3px; margin:0; }
      .subtitle { text-align:center; margin:4px 0 14px; color:#9a6a32; font-size:12px; }
      .meta { display:grid; grid-template-columns:1fr 1fr; gap:8px 20px; border:1px solid #e8c79a; border-radius:8px; padding:12px; background:#f7ecd9; }
      .meta p { margin:0; font-size:14px; }
      h3 { margin:14px 0 8px; letter-spacing:1px; color:#8d4f0c; font-size:16px; }
      table { width:100%; border-collapse:collapse; background:#fff9ef; }
      th, td { border:1px solid #e8c79a; padding:8px; font-size:14px; }
      th { background:#f4e0bd; text-align:left; color:#7b4a10; }
      .totals { margin-top:12px; border:1px solid #e8c79a; border-radius:8px; padding:12px; background:#f7ecd9; }
      .totals p { margin:4px 0; text-align:right; font-size:16px; }
      .total-strong { color:#b96f12; font-weight:700; }
      @media print { body { background:#fff; padding:0; } .invoice { border:none; } }
    </style>
  </head>
  <body>
    <div class="invoice">
      <h1 class="brand">GOLDENFORK</h1>
      <p class="subtitle">PAYMENT INVOICE</p>
      <div class="meta">
        <p><strong>Payment ID:</strong> ${escapeHtml(payment?.paymentId || payment?._id || "-")}</p>
        <p><strong>Order No:</strong> ${escapeHtml(order?.orderNumber || "-")}</p>
        <p><strong>Order Type:</strong> ${escapeHtml(order?.orderType || "-")}</p>
        <p><strong>Method:</strong> ${escapeHtml(payment?.paymentMethod || order?.paymentMethod || "-")}</p>
        <p><strong>Customer:</strong> ${escapeHtml(order?.customerName || order?.createdBy || "-")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(order?.phone || "-")}</p>
        <p><strong>Date:</strong> ${escapeHtml(formatDateTime(paidAt))}</p>
      </div>
      <h3>DISHES BOUGHT</h3>
      <table>
        <thead>
          <tr>
            <th>Dish</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Price</th>
            <th style="text-align:right">Line Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div class="totals">
        <p>Subtotal: Rs ${subtotal.toFixed(2)}</p>
        <p>Discount: -Rs ${discount.toFixed(2)}</p>
        <p>Tax: Rs ${tax.toFixed(2)}</p>
        <p class="total-strong">Total: Rs ${total.toFixed(2)}</p>
      </div>
    </div>
  </body>
</html>`;
  };

  const downloadInvoicePdf = async (order, payment) => {
    if (!order || !payment) return;
    const html = renderInvoiceHtml(order, payment);

    if (Platform.OS === "web") {
      const popup = window.open("", "_blank", "width=1000,height=800");
      if (!popup) {
        setRefundMsg("Please allow popups to download invoice PDF.");
        return;
      }
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
      setTimeout(() => {
        popup.focus();
        popup.print();
      }, 250);
      return;
    }

    try {
      const fileName = `invoice-${String(order?.orderNumber || payment?.paymentId || Date.now()).replace(/[^a-zA-Z0-9-_]/g, "-")}.pdf`;
      const result = await Print.printToFileAsync({
        html,
        base64: false
      });

      if (
        Platform.OS === "android" &&
        FileSystem?.StorageAccessFramework?.requestDirectoryPermissionsAsync
      ) {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          setRefundMsg("Folder permission is required to save invoice PDF.");
          return;
        }

        const pdfBase64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "application/pdf"
        );
        await FileSystem.writeAsStringAsync(targetUri, pdfBase64, {
          encoding: FileSystem.EncodingType.Base64
        });
        Alert.alert("Invoice saved", `Saved as ${fileName}`);
        return;
      }

      const fallbackPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: result.uri, to: fallbackPath });
      Alert.alert("Invoice saved", `Saved to app storage:\n${fallbackPath}`);
    } catch (err) {
      setRefundMsg(err?.message || "Failed to create invoice PDF.");
    }
  };

  const renderMetaRow = (iconName, text, key) => (
    <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 2 }}>
      <Ionicons name={iconName} size={13} color={isAdminDark ? "#94A3B8" : "#64748B"} />
      <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark, { flex: 1 }]}>
        {text}
      </Text>
    </View>
  );

  const handleRefundReview = async (paymentId, action) => {
    if (!reviewRefundRequest) return;
    setRefundMsg("");
    setRefundBusyId(paymentId);
    try {
      await reviewRefundRequest(paymentId, action);
      if (loadAdminPayments) await loadAdminPayments();
    } catch (err) {
      setRefundMsg(err.message || "Failed to review refund request.");
    } finally {
      setRefundBusyId("");
    }
  };

  const handleDirectRefund = async (paymentId) => {
    if (!directRefundPayment) return;
    setRefundMsg("");
    setRefundBusyId(paymentId);
    try {
      await directRefundPayment(paymentId);
      if (loadAdminPayments) await loadAdminPayments();
    } catch (err) {
      setRefundMsg(err.message || "Failed to refund payment.");
    } finally {
      setRefundBusyId("");
    }
  };

  return (
    <View style={styles.adminSection}>
      <View style={styles.adminStatsRow}>
        {[
          { label: "Paid Orders", value: adminPaymentStats.paid },
          { label: "Unpaid Orders", value: adminPaymentStats.unpaid },
          { label: "Refunded", value: adminPaymentStats.refunded },
          { label: "Revenue", value: `LKR ${adminRevenue.toFixed(2)}` }
        ].map((item) => (
          <View key={item.label} style={[styles.adminStatCard, isAdminDark && styles.adminStatCardDark]}>
            <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>{item.label}</Text>
            <Text style={[styles.adminStatValue, isAdminDark && styles.adminStatValueDark]}>{item.value}</Text>
          </View>
        ))}
      </View>

      <Modal
        visible={paymentModalVisible && Boolean(selectedOrder)}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              <TouchableOpacity
                onPress={() => {
                  setPaymentModalVisible(false);
                  setSelectedOrderId("");
                }}
              >
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            {selectedOrder ? (
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.adminCard}>
                  <Text style={styles.adminCardTitle}>
                    {selectedOrder.orderNumber || "Order"} • {formatOrderType(selectedOrder.orderType)}
                  </Text>
                  <Text style={styles.adminCardMeta}>
                    Customer: {selectedOrder.customerName || selectedOrder.createdBy || "-"}
                  </Text>
                  <Text style={styles.adminCardMeta}>
                    Phone: {selectedOrder.phone || "-"}
                  </Text>
                  <Text style={styles.adminCardMeta}>
                    Created: {formatDateTime(selectedOrder.createdAt)}
                  </Text>
                  <Text style={styles.adminCardMeta}>
                    Payment Method: {resolveOrderPaymentMethod(selectedOrder).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.adminCard}>
                  <Text style={styles.adminCardTitle}>Order Items</Text>
                  {(selectedOrder.items || []).length ? (
                    (selectedOrder.items || []).map((item, index) => (
                      <View key={`${selectedOrder._id}-${index}`} style={styles.adminActionRow}>
                        <Text style={styles.adminCardMeta}>
                          {item.name || "Item"} x{item.quantity || 0}
                        </Text>
                        <Text style={styles.adminCardMeta}>
                          LKR {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.adminCardMeta}>No items</Text>
                  )}
                </View>

                <Text style={styles.profileLabel}>Tax Percentage</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Tax %"
                  placeholderTextColor="#8F98A8"
                  value={taxPercent}
                  onChangeText={setTaxPercent}
                />

                <Text style={styles.profileLabel}>Discount Type</Text>
                <View style={styles.adminOptionRow}>
                  {[
                    { key: "fixed", label: "Fixed (LKR)" },
                    { key: "percent", label: "Percent (%)" }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.adminOptionChip,
                        offerType === option.key && styles.adminOptionChipActive,
                        isAdminDark && styles.adminOptionChipDark,
                        isAdminDark && offerType === option.key && styles.adminOptionChipActiveDark
                      ]}
                      onPress={() => setOfferType(option.key)}
                    >
                      <Text
                        style={[
                          styles.adminOptionText,
                          offerType === option.key && styles.adminOptionTextActive,
                          isAdminDark && styles.adminOptionTextDark,
                          isAdminDark && offerType === option.key && styles.adminOptionTextActiveDark
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.profileLabel}>Discount Value</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={offerType === "percent" ? "0 - 100" : "LKR"}
                  placeholderTextColor="#8F98A8"
                  value={offerValue}
                  onChangeText={setOfferValue}
                />
                <View style={styles.adminOptionRow}>
                  <TouchableOpacity
                    style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                    onPress={async () => {
                      if (!saveAdminPaymentDefaults) return;
                      try {
                        setSettingsMsg("");
                        await saveAdminPaymentDefaults({
                          taxPercent,
                          offerType,
                          offerValue
                        });
                        setSettingsMsg("Tax and discount defaults saved.");
                      } catch (err) {
                        setSettingsMsg(err.message || "Failed to save defaults.");
                      }
                    }}
                  >
                    <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                      Save As Default
                    </Text>
                  </TouchableOpacity>
                </View>
                {settingsMsg ? <Text style={styles.helperText}>{settingsMsg}</Text> : null}

                <Text style={styles.profileLabel}>Payment Method</Text>
                <View style={styles.adminOptionRow}>
                  {[
                    { key: "cash", label: "Cash" },
                    { key: "card", label: "Card" }
                  ].map((option) => {
                    const active = selectedMethod === option.key;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        style={[
                          styles.adminOptionChip,
                          active && styles.adminOptionChipActive,
                          isAdminDark && styles.adminOptionChipDark,
                          isAdminDark && active && styles.adminOptionChipActiveDark,
                          !active && { opacity: 0.5 }
                        ]}
                        disabled
                      >
                        <Text
                          style={[
                            styles.adminOptionText,
                            active && styles.adminOptionTextActive,
                            isAdminDark && styles.adminOptionTextDark,
                            isAdminDark && active && styles.adminOptionTextActiveDark
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.helperText}>Payment method is fixed from the selected order.</Text>

                <View style={styles.adminCard}>
                  <Text style={styles.adminCardTitle}>Payment Summary</Text>
                  {(() => {
                    const breakdown = getBreakdown();
                    return (
                      <>
                        <Text style={styles.adminCardMeta}>
                          Subtotal: LKR {breakdown.subtotal.toFixed(2)}
                        </Text>
                        <Text style={styles.adminCardMeta}>
                          Discount: - LKR {breakdown.discount.toFixed(2)}
                        </Text>
                        <Text style={styles.adminCardMeta}>
                          Tax: LKR {breakdown.tax.toFixed(2)}
                        </Text>
                        <Text style={[styles.adminCardTitle, { marginTop: 6 }]}>
                          Total: LKR {breakdown.total.toFixed(2)}
                        </Text>
                      </>
                    );
                  })()}
                </View>

                {paymentError ? (
                  <Text style={styles.error}>{paymentError}</Text>
                ) : null}

                <TouchableOpacity
                  style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                  onPress={async () => {
                    if (!selectedOrder) return;
                    try {
                      setPaymentError("");
                      await createAdminPayment({
                        orderId: selectedOrder._id,
                        paymentMethod: selectedMethod,
                        taxPercent,
                        offerType,
                        offerValue
                      });
                      setPaymentModalVisible(false);
                      setSelectedOrderId("");
                    } catch (err) {
                      setPaymentError(err.message || "Failed to create payment.");
                    }
                  }}
                >
                  <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
                    Make Payment
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
      <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
        <View style={styles.adminCardHeader}>
          <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
            Active Orders
          </Text>
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            {adminActiveOrders.length} open orders
          </Text>
        </View>
        {adminActiveOrders.length ? (
          adminActiveOrders.map((order) => {
            const total =
              typeof order.totalAmount === "number"
                ? order.totalAmount
                : resolveOrderTotal(order);
            const isPaid = String(order.paymentStatus || "").toLowerCase() === "paid";
            return (
              <View key={String(order._id)} style={[styles.adminActionRow, { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isAdminDark ? "rgba(148,163,184,0.2)" : "#E2E8F0" }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                    <Ionicons name="receipt-outline" size={15} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                    <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                      {order.orderNumber || "Order"} • {formatOrderType(order.orderType)}
                    </Text>
                  </View>
                  {renderMetaRow(
                    "alert-circle-outline",
                    `Status: ${order.status || "New"} • Customer: ${order.customerName || order.createdBy || "-"}`,
                    `active-status-${order._id}`
                  )}
                  {renderMetaRow(
                    "card-outline",
                    `Method: ${resolveOrderPaymentMethod(order).toUpperCase()}`,
                    `active-method-${order._id}`
                  )}
                  {renderMetaRow(
                    "cash-outline",
                    `Total: LKR ${Number(total || 0).toFixed(2)} • ${formatDateTime(order.createdAt)}`,
                    `active-total-${order._id}`
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.adminActionButton,
                    isAdminDark && styles.adminActionButtonDark,
                    isPaid && { opacity: 0.5 }
                  ]}
                  onPress={() => {
                    if (!isPaid) {
                      setSelectedOrderId(order._id);
                      setPaymentModalVisible(true);
                    }
                  }}
                  disabled={isPaid}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name={isPaid ? "checkmark-circle-outline" : "wallet-outline"} size={13} color={isAdminDark ? "#E2E8F0" : "#0F172A"} />
                    <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                      {isPaid ? "Paid" : "Pay"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            No active orders right now.
          </Text>
        )}
      </View>

      <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
        <View style={styles.adminCardHeader}>
          <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
            Unpaid Orders
          </Text>
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            {unpaidOrders.length} unpaid orders
          </Text>
        </View>
        {unpaidOrders.length ? (
          unpaidOrders.map((order) => {
            const total =
              typeof order.totalAmount === "number"
                ? order.totalAmount
                : resolveOrderTotal(order);
            const isPaid = String(order.paymentStatus || "").toLowerCase() === "paid";
            return (
              <View key={String(order._id)} style={[styles.adminActionRow, { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isAdminDark ? "rgba(148,163,184,0.2)" : "#E2E8F0" }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                    <Ionicons name="document-text-outline" size={15} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                    <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                      {order.orderNumber || "Order"} • {formatOrderType(order.orderType)}
                    </Text>
                  </View>
                  {renderMetaRow(
                    "person-outline",
                    `Customer: ${order.customerName || order.createdBy || "-"}`,
                    `unpaid-customer-${order._id}`
                  )}
                  {renderMetaRow(
                    "card-outline",
                    `Method: ${resolveOrderPaymentMethod(order).toUpperCase()}`,
                    `unpaid-method-${order._id}`
                  )}
                  {renderMetaRow(
                    "cash-outline",
                    `Total: LKR ${Number(total || 0).toFixed(2)} • ${formatDateTime(order.createdAt)}`,
                    `unpaid-total-${order._id}`
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.adminActionButton,
                    isAdminDark && styles.adminActionButtonDark,
                    isPaid && { opacity: 0.5 }
                  ]}
                  onPress={() => {
                    if (!isPaid) {
                      setSelectedOrderId(order._id);
                      setPaymentModalVisible(true);
                    }
                  }}
                  disabled={isPaid}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name={isPaid ? "checkmark-circle-outline" : "wallet-outline"} size={13} color={isAdminDark ? "#E2E8F0" : "#0F172A"} />
                    <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                      {isPaid ? "Paid" : "Pay"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            No unpaid orders right now.
          </Text>
        )}
      </View>

      <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
        <View style={styles.adminCardHeader}>
          <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
            Refund Requests
          </Text>
          <TouchableOpacity
            style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
            onPress={loadAdminPayments}
            disabled={adminPaymentsBusy}
          >
            <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
              {adminPaymentsBusy ? "Refreshing..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </View>
        {adminPaymentsMsg ? (
          <Text style={styles.error}>{adminPaymentsMsg}</Text>
        ) : null}
        {adminPaymentsBusy && refundRequests.length === 0 ? (
          <View style={styles.centeredInline}>
            <ActivityIndicator size="small" color={isAdminDark ? "#F5F7FB" : "#0A0A0A"} />
            <Text style={styles.helperText}>Loading refunds...</Text>
          </View>
        ) : null}
        {refundMsg ? <Text style={styles.error}>{refundMsg}</Text> : null}
        {refundRequests.length ? (
          refundRequests.map((payment) => (
            <View key={String(payment._id)} style={[styles.adminActionRow, { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isAdminDark ? "rgba(148,163,184,0.2)" : "#E2E8F0" }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <Ionicons name="arrow-undo-outline" size={15} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                  <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                    {payment.orderNumber || payment.orderId?.orderNumber || "Order"} •{" "}
                    {formatOrderType(payment.orderId?.orderType)}
                  </Text>
                </View>
                {renderMetaRow(
                  "person-outline",
                  `Customer: ${payment.customerName || payment.orderId?.customerName || "-"}`,
                  `refund-customer-${payment._id}`
                )}
                {renderMetaRow(
                  "cash-outline",
                  `Total: LKR ${Number(payment.totalAmount || 0).toFixed(2)} • ${formatDateTime(payment.refundRequestedAt || payment.createdAt)}`,
                  `refund-total-${payment._id}`
                )}
              </View>
                <TouchableOpacity
                  style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                  onPress={() => handleRefundReview(payment._id, "approve")}
                  disabled={refundBusyId === String(payment._id)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name="checkmark-outline" size={13} color={isAdminDark ? "#E2E8F0" : "#0F172A"} />
                    <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                      {refundBusyId === String(payment._id) ? "..." : "Approve"}
                    </Text>
                  </View>
                </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                onPress={() => handleRefundReview(payment._id, "reject")}
                disabled={refundBusyId === String(payment._id)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="close-outline" size={13} color={isAdminDark ? "#FEE2E2" : "#FFFFFF"} />
                  <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>
                    Reject
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            No refund requests right now.
          </Text>
        )}
      </View>

            <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
        <View style={styles.adminCardHeader}>
          <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
            Paid Orders
          </Text>
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            {paidOrders.length} paid
          </Text>
        </View>
        {paidOrders.length ? (
          paidOrders.map((order) => {
            const payment = paymentByOrderId.get(String(order._id));
            const refundStatus = String(payment?.refundStatus || "").toLowerCase();
            const isRefunded = refundStatus === "approved";
            const canRefund = Boolean(payment) && !isRefunded;
            return (
              <View key={String(order._id)} style={[styles.adminActionRow, { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isAdminDark ? "rgba(148,163,184,0.2)" : "#E2E8F0" }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                    <Ionicons name="checkmark-done-outline" size={15} color={isAdminDark ? "#34D399" : "#059669"} />
                    <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                      {order.orderNumber || "Order"} • {formatOrderType(order.orderType)}
                    </Text>
                  </View>
                  {renderMetaRow(
                    "person-outline",
                    `Customer: ${order.customerName || order.createdBy || "-"}`,
                    `paid-customer-${order._id}`
                  )}
                  {renderMetaRow(
                    "cash-outline",
                    `Total: LKR ${resolveOrderTotal(order).toFixed(2)} • ${formatDateTime(order.createdAt)}`,
                    `paid-total-${order._id}`
                  )}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {isRefunded ? (
                    <Text style={[styles.adminStatusText, isAdminDark && styles.adminStatusTextDark]}>
                      REFUNDED
                    </Text>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.adminActionButton,
                        isAdminDark && styles.adminActionButtonDark,
                        !canRefund && { opacity: 0.5 }
                      ]}
                      onPress={() => {
                        if (payment?._id) handleDirectRefund(payment._id);
                      }}
                      disabled={!canRefund || refundBusyId === String(payment?._id)}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Ionicons name="arrow-undo-outline" size={13} color={isAdminDark ? "#E2E8F0" : "#0F172A"} />
                        <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                          {refundBusyId === String(payment?._id) ? "..." : "Refund"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.adminActionButton,
                      isAdminDark && styles.adminActionButtonDark,
                      !payment && { opacity: 0.5 }
                    ]}
                    onPress={() => downloadInvoicePdf(order, payment)}
                    disabled={!payment}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Ionicons name="download-outline" size={13} color={isAdminDark ? "#E2E8F0" : "#0F172A"} />
                      <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                        Invoice PDF
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            No paid orders yet.
          </Text>
        )}
      </View>
      <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
        <View style={styles.adminCardHeader}>
          <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
            Method Breakdown
          </Text>
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            Orders by method
          </Text>
        </View>
        {Object.keys(adminPaymentStats.methods).length ? (
          Object.entries(adminPaymentStats.methods).map(([method, count]) => (
            <View key={method} style={styles.adminOptionRow}>
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                {method.toUpperCase()}
              </Text>
              <Text style={[styles.adminStatusText, isAdminDark && styles.adminStatusTextDark]}>
                {count}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
            No payment data yet.
          </Text>
        )}
      </View>
    </View>
  );
}




















