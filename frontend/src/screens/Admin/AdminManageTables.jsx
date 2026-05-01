import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function BookingStatusBadge({ status, styles }) {
  const s = String(status || "").toLowerCase();
  const color =
    s === "new" ? "#6C5CE7" :
    s === "preparing" ? "#FDCB6E" :
    s === "ready" ? "#00B894" :
    s === "served" || s === "delivered" ? "#74B9FF" :
    s === "cancelled" ? "#D63031" : "#636E72";
  return (
    <View style={{ backgroundColor: color, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
        {String(status || "").toUpperCase()}
      </Text>
    </View>
  );
}

export default function AdminManageTables({
  adminOrders,
  adminTableReservations,
  adminTables,
  adminTableFilter,
  setAdminTableFilter,
  adminTablesBusy,
  loadAdminTables,
  loadAdminTableReservations,
  setAddTableModalVisible,
  setOrderType,
  setOrderModalVisible,
  resolveTableLocation,
  formatDateTime,
  formatReservationRange,
  isReservationActiveNow,
  cancelAdminOrder,
  toggleAdminTableAvailability,
  deleteAdminTable,
  styles,
  isAdminDark
}) {
  const [tablesTab, setTablesTab] = useState("bookings");
  const [bookingFilter, setBookingFilter] = useState("active");
  const statPalette = [
    { light: styles.adminStatOrange, dark: styles.adminStatOrangeDark },
    { light: styles.adminStatRed, dark: styles.adminStatRedDark },
    { light: styles.adminStatGreen, dark: styles.adminStatGreenDark },
    { light: styles.adminStatBlue, dark: styles.adminStatBlueDark }
  ];

  // All orders that are table-type from the regular orders endpoint
  const regularTableOrders = Array.isArray(adminOrders)
    ? adminOrders.filter((o) => String(o.orderType || "").toLowerCase() === "table")
    : [];

  // Manual reservations from the dedicated endpoint
  const manualReservations = Array.isArray(adminTableReservations) ? adminTableReservations : [];

  // Merge - deduplicate by _id (manual reservations are also Order docs so may appear in both)
  const regularIds = new Set(regularTableOrders.map((o) => String(o._id)));
  const extraManual = manualReservations.filter((r) => !regularIds.has(String(r._id)));
  const allTableBookings = [...regularTableOrders, ...extraManual];

  // Seat-usage for the seat map: only truly active right now
  const activeNowBookings = allTableBookings.filter(
    (order) =>
      !["Cancelled", "Delivered", "Served"].includes(order.status) &&
      (isReservationActiveNow ? isReservationActiveNow(order) : true)
  );

  const seatUsageByTable = activeNowBookings.reduce((acc, order) => {
    const tableId = String(order.tableId?._id || order.tableId || order.tableNumber || "");
    if (!tableId) return acc;
    acc[tableId] = Number(acc[tableId] || 0) + Number(order.seatCount || 1);
    return acc;
  }, {});

  const tableNumberById = adminTables.reduce((acc, table) => {
    const key = String(table._id || "");
    if (!key) return acc;
    acc[key] = table.tableNo || table.name || "";
    return acc;
  }, {});

  const resolveTableNumber = (order) =>
    order.tableNumber ||
    order.tableId?.tableNo ||
    order.tableId?.name ||
    tableNumberById[String(order.tableId?._id || order.tableId || "")] ||
    "-";

  const handleRefresh = () => {
    loadAdminTables();
    if (typeof loadAdminTableReservations === "function") {
      loadAdminTableReservations();
    }
  };

  // Booking filter logic - "active" = not cancelled/served/delivered, "all" = everything, "cancelled" = cancelled ones
  const filteredBookings = allTableBookings.filter((order) => {
    const status = String(order.status || "").toLowerCase();
    if (bookingFilter === "active") return !["cancelled", "delivered", "served"].includes(status);
    if (bookingFilter === "cancelled") return ["cancelled", "delivered", "served"].includes(status);
    return true; // "all"
  }).sort((a, b) => {
    // Sort by reservationStart desc, then createdAt desc
    const aTime = a.reservationStart ? new Date(a.reservationStart).getTime() : new Date(a.createdAt).getTime();
    const bTime = b.reservationStart ? new Date(b.reservationStart).getTime() : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  const activeCount = allTableBookings.filter(
    (o) => !["cancelled", "delivered", "served"].includes(String(o.status || "").toLowerCase())
  ).length;

  const manualCount = manualReservations.length + extraManual.length - (manualReservations.length - extraManual.length);

  // Stats counts
  const bookedTableIds = new Set(
    activeNowBookings
      .map((o) => String(o.tableId?._id || o.tableId || ""))
      .filter(Boolean)
  );
  const totalTables = adminTables.length;
  const bookedTables = bookedTableIds.size;
  const freeTables = Math.max(totalTables - bookedTables, 0);


  const renderSeatMap = () => (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Live Seat Map
        </Text>
      </View>
      <View style={styles.seatMapLegend}>
        <View style={styles.seatMapChip}>
          <View style={[styles.seatMapChipDot, { backgroundColor: "#34D399" }]} />
          <Text style={styles.seatMapChipText}>Available</Text>
        </View>
        <View style={styles.seatMapChip}>
          <View style={[styles.seatMapChipDot, { backgroundColor: "#FCD34D" }]} />
          <Text style={styles.seatMapChipText}>Pending</Text>
        </View>
        <View style={styles.seatMapChip}>
          <View style={[styles.seatMapChipDot, { backgroundColor: "#F87171" }]} />
          <Text style={styles.seatMapChipText}>Booked</Text>
        </View>
      </View>
      <View style={styles.seatMapGrid}>
        {adminTables
          .filter((table) => {
            if (adminTableFilter === "all") return true;
            const tableIdKey = String(table._id || "");
            const isBooked = Boolean(seatUsageByTable[tableIdKey]);
            if (adminTableFilter === "booked") return isBooked;
            if (adminTableFilter === "free") return !isBooked && table.isAvailable;
            return true;
          })
          .map((table) => {
            const tableId = String(table._id || "");
            const capacity = Number(table.seats || 0);
            const bookedSeats = Number(seatUsageByTable[tableId] || 0);
            const remainingSeats = Math.max(capacity - bookedSeats, 0);
            const isOpen = table.isAvailable && remainingSeats > 0;
            const status = !table.isAvailable
              ? "booked"
              : remainingSeats <= 0
                ? "booked"
                : remainingSeats < capacity
                  ? "pending"
                  : "free";
            const tileStyle = [
              styles.seatMapTile,
              status === "free" && styles.seatMapTileFree,
              status === "pending" && styles.seatMapTilePending,
              status === "booked" && styles.seatMapTileBooked
            ];
            const titleStyle = [
              styles.seatMapTitle,
              status === "free" && styles.seatMapTitleFree,
              status === "pending" && styles.seatMapTitlePending,
              status === "booked" && styles.seatMapTitleBooked
            ];
            const metaStyle = [
              styles.seatMapMeta,
              status === "free" && styles.seatMapMetaFree,
              status === "pending" && styles.seatMapMetaPending,
              status === "booked" && styles.seatMapMetaBooked
            ];
            const badgeColor =
              status === "free"
                ? "rgba(52, 211, 153, 0.2)"
                : status === "pending"
                  ? "rgba(252, 211, 77, 0.2)"
                  : "rgba(248, 113, 113, 0.2)";
            return (
              <View key={String(table._id)} style={tileStyle}>
                <View style={styles.seatMapHeader}>
                  <Text style={titleStyle}>{table.tableNo || table.name || "Table"}</Text>
                  <View style={[styles.seatMapBadge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.seatMapBadgeText}>
                      {status === "free" ? "AVAILABLE" : status === "pending" ? "PENDING" : "BOOKED"}
                    </Text>
                  </View>
                </View>
                <Text style={metaStyle}>Seats: {remainingSeats}/{capacity}</Text>
                <Text style={metaStyle}>Booked: {Math.min(bookedSeats, capacity)}</Text>
                <Text style={metaStyle}>Location: {table.location || "N/A"}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
  const renderAddedTables = () => (
    <>
      {adminTables
        .filter((table) => {
          if (adminTableFilter === "all") return true;
          const tableIdKey = String(table._id || "");
          const isBooked = Boolean(seatUsageByTable[tableIdKey]);
          if (adminTableFilter === "booked") return isBooked;
          if (adminTableFilter === "free") return !isBooked && table.isAvailable;
          return true;
        })
        .map((table) => (
          <View
            key={String(table._id)}
            style={[
              styles.adminCard,
              isAdminDark && styles.adminCardDark,
              {
                borderLeftWidth: 3,
                borderLeftColor: table.isAvailable ? "#10B981" : "#EF4444"
              }
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                <Ionicons name="grid-outline" size={16} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark, { flex: 1 }]}>
                  Table {table.tableNo || table.name} • {table.seats} seats
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  backgroundColor: table.isAvailable ? "rgba(16,185,129,0.16)" : "rgba(239,68,68,0.16)"
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: table.isAvailable ? "#10B981" : "#EF4444"
                  }}
                >
                  {table.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 8, gap: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="location-outline" size={13} color={isAdminDark ? "#94A3B8" : "#64748B"} />
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  Location: {table.location || "-"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="people-outline" size={13} color={isAdminDark ? "#94A3B8" : "#64748B"} />
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  Purpose: {table.purpose || "-"}
                </Text>
              </View>
            </View>
            <View style={[styles.adminActionRow, { marginTop: 8 }]}>
              <TouchableOpacity
                style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                onPress={() => toggleAdminTableAvailability(table)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons
                    name={table.isAvailable ? "pause-circle-outline" : "checkmark-circle-outline"}
                    size={13}
                    color={isAdminDark ? "#E2E8F0" : "#0F172A"}
                  />
                  <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                    {table.isAvailable ? "Set Unavailable" : "Set Available"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                onPress={() => deleteAdminTable(table._id)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="trash-outline" size={13} color={isAdminDark ? "#FEE2E2" : "#FFFFFF"} />
                  <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </>
  );
  return (
    <View style={styles.adminSection}>

      {/* -- STATS -- */}
      <View style={styles.adminStatsRow}>
        {[
          { label: "Total Tables", value: totalTables },
          { label: "Currently Booked", value: bookedTables },
          { label: "Free Now", value: freeTables },
          { label: "Active Bookings", value: activeCount },
        ].map((item, index) => {
          const palette = statPalette[index % statPalette.length];
          return (
          <View
            key={item.label}
            style={[
              styles.adminStatCard,
              palette?.light,
              isAdminDark && styles.adminStatCardDark,
              isAdminDark && palette?.dark
            ]}
          >
            <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>
              {item.label}
            </Text>
            <Text style={[styles.adminStatValue, isAdminDark && styles.adminStatValueDark]}>
              {item.value}
            </Text>
          </View>
        );
        })}
      </View>

      {/* -- SEAT MAP FILTER -- */}
      <View style={styles.adminFilterRow}>
        {["all", "free", "booked"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.adminPill,
              adminTableFilter === status && styles.adminPillActive,
              isAdminDark && styles.adminPillDark,
              isAdminDark && adminTableFilter === status && styles.adminPillActiveDark
            ]}
            onPress={() => setAdminTableFilter(status)}
          >
            <Text style={[styles.adminPillText, isAdminDark && styles.adminPillTextDark]}>
              {status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* -- MANAGE TABLES HEADER -- */}
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Manage Tables
        </Text>
        <View style={styles.adminSectionActions}>
          <TouchableOpacity
            style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
            onPress={() => setAddTableModalVisible(true)}
          >
            <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
              + Add Table
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
            onPress={handleRefresh}
            disabled={adminTablesBusy}
          >
            <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
              {adminTablesBusy ? "Refreshing..." : "Refresh"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
            onPress={() => {
              setOrderType("table");
              setOrderModalVisible(true);
            }}
          >
            <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
              Manual Book
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileTabs}>
        {[
          { key: "bookings", label: "Bookings" },
          { key: "tables", label: "Added Tables" },
          { key: "seatmap", label: "Seat Map" }
        ].map((tab) => {
          const active = tablesTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.profileTabButton, active && styles.profileTabButtonActive]}
              onPress={() => setTablesTab(tab.key)}
            >
              <Text style={[styles.profileTabText, active && styles.profileTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tablesTab === "bookings" ? (
      <>
      {/* -- TABLE BOOKINGS SECTION -- */}
      <View style={[styles.adminSectionHeader, { marginTop: 16 }]}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Table Bookings
        </Text>
        <TouchableOpacity
          style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
          onPress={() => {
            setOrderType("table");
            setOrderModalVisible(true);
          }}
        >
          <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
            + Manual Book
          </Text>
        </TouchableOpacity>
      </View>

      {/* Booking filter tabs */}
      <View style={[styles.adminFilterRow, { marginBottom: 8 }]}>
        {[
          { key: "active", label: "ACTIVE" },
          { key: "all", label: "ALL" },
          { key: "cancelled", label: "DONE / CANCELLED" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.adminPill,
              bookingFilter === tab.key && styles.adminPillActive,
              isAdminDark && styles.adminPillDark,
              isAdminDark && bookingFilter === tab.key && styles.adminPillActiveDark
            ]}
            onPress={() => setBookingFilter(tab.key)}
          >
            <Text style={[styles.adminPillText, isAdminDark && styles.adminPillTextDark]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBookings.length === 0 ? (
        <View style={[styles.adminCard, isAdminDark && styles.adminCardDark, { alignItems: "center", paddingVertical: 24 }]}>
          <Text style={[styles.adminMutedText, isAdminDark && styles.adminMutedTextDark]}>
            No {bookingFilter === "active" ? "active " : bookingFilter === "cancelled" ? "done/cancelled " : ""}table bookings found.
          </Text>
        </View>
      ) : (
        filteredBookings.map((order) => {
          const canCancel = !["Cancelled", "Delivered", "Served"].includes(order.status);
          const isManual = Boolean(order.isManualBooking);
          const isActiveNow = isReservationActiveNow ? isReservationActiveNow(order) : false;
          const tableNum = resolveTableNumber(order);
          const reservationDisplay = formatReservationRange
            ? formatReservationRange(order)
            : order.timeSlotLabel || "-";
          const location = resolveTableLocation ? resolveTableLocation(order) : "-";

          // Determine booking type label
          const bookingType = isManual ? "MANUAL" : "CUSTOMER";
          const bookingTypeColor = isManual ? "#6C5CE7" : "#00B894";

          return (
            <View
              key={String(order._id)}
              style={[
                styles.adminCard,
                isAdminDark && styles.adminCardDark,
                isActiveNow && {
                  borderLeftWidth: 3,
                  borderLeftColor: "#00B894"
                }
              ]}
            >
              {/* Header row */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}>
                  <Ionicons name="calendar-outline" size={15} color={isAdminDark ? "#FDBA74" : "#F97316"} />
                  <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark, { flex: 1 }]}>
                    {order.orderNumber || "Booking"} • Table {tableNum}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <View style={{ backgroundColor: bookingTypeColor, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>{bookingType}</Text>
                  </View>
                  {isActiveNow && (
                    <View style={{ backgroundColor: "#00B894", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>● LIVE</Text>
                    </View>
                  )}
                  <BookingStatusBadge status={order.status} styles={styles} />
                </View>
              </View>

              {/* Customer info */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Ionicons name="person-circle-outline" size={15} color="#6C5CE7" />
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                  {order.customerName || order.createdBy || "Customer"}
                  {order.phone ? ` • ${order.phone}` : ""}
                </Text>
              </View>

              {/* Reservation time period */}
              <View style={{
                backgroundColor: isAdminDark ? "#1F2B3E" : "#F0F4FF",
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: "#6C5CE7"
              }}>
                <Text style={{ color: isAdminDark ? "#A8B2C8" : "#636E72", fontSize: 10, fontWeight: "600", marginBottom: 2 }}>
                  RESERVATION PERIOD
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="time-outline" size={14} color={isAdminDark ? "#E0E6F8" : "#2D3436"} />
                  <Text style={{ color: isAdminDark ? "#E0E6F8" : "#2D3436", fontSize: 13, fontWeight: "700" }}>
                    {reservationDisplay}
                  </Text>
                </View>
                <Text style={{ color: isAdminDark ? "#A8B2C8" : "#636E72", fontSize: 11, marginTop: 2 }}>
                  Seats: {order.seatCount || "-"} • Location: {location}
                </Text>
              </View>

              {/* Created time */}
              <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                Booked on: {formatDateTime ? formatDateTime(order.createdAt) : "-"}
              </Text>

              {/* Action */}
              {canCancel ? (
                <View style={[styles.adminActionRow, { marginTop: 8 }]}>
                  <TouchableOpacity
                    style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                    onPress={() => cancelAdminOrder(order._id)}
                  >
                    <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>
                      Cancel Booking
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        })
      )}
      </>
      ) : null}

      {tablesTab === "tables" ? (
      <>
      {/* Added tables come after bookings */}
      <View style={[styles.adminSectionHeader, { marginTop: 16 }]}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
          Added Tables
        </Text>
      </View>
      {renderAddedTables()}
      </>
      ) : null}

      {/* -- LIVE SEAT MAP -- */}
      {tablesTab === "seatmap" ? renderSeatMap() : null}
    </View>
  );
}






