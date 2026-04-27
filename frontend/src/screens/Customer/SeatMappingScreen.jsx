import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function SeatMappingScreen({
  activeCustomerTableBookings,
  customerOrdersBusy,
  customerOrdersMsg,
  loadCustomerOrders,
  getGroupSummary,
  formatReservationRange,
  formatDateTime,
  cancelCustomerOrder,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  bookingSuffix,
  setBookingSuffix,
  timeSlotLabel,
  setTimeSlotLabel,
  setSeatSearchActive,
  seatSearchActive,
  seatSearchError,
  applySeatSearch,
  tableFreeFilter,
  setTableFreeFilter,
  tableLocationFilter,
  setTableLocationFilter,
  tablePurposeFilter,
  setTablePurposeFilter,
  tableSeatsFilter,
  setTableSeatsFilter,
  filteredTables,
  getRemainingSeats,
  getTableStatus,
  resolveStatusColor,
  tableLocations,
  tablePurposes,
  tableSeatsOptions,
  buildReservationLabel,
  normalizeTimeSlotLabel,
  renderCustomerHeader,
  styles,
  theme
}) {
  return (
    <ScrollView contentContainerStyle={[styles.catalogList, styles.bottomNavSpace]}>
      {renderCustomerHeader("Seat Map", "Check table availability.")}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick View</Text>
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
      <View style={{ gap: 8 }}>
        {[
          [
            { purpose: "family", location: "indoor" },
            { purpose: "family", location: "outdoor" }
          ],
          [
            { purpose: "vip", location: "indoor" },
            { purpose: "vip", location: "outdoor" }
          ]
        ].map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={{ flexDirection: "row", gap: 8 }}>
            {row.map((cell) => {
              const summary = getGroupSummary(cell.purpose, cell.location);
              const status = summary.status;
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
              return (
                <View
                  key={`${cell.purpose}-${cell.location}`}
                  style={[{ flex: 1 }, tileStyle]}
                >
                  <Text style={titleStyle}>
                    {cell.purpose.toUpperCase()} - {cell.location.toUpperCase()}
                  </Text>
                  <Text style={metaStyle}>
                    Free {summary.free} - Pending {summary.pending} - Booked {summary.booked}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Table Bookings</Text>
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
      {customerOrdersMsg ? <Text style={styles.error}>{customerOrdersMsg}</Text> : null}
      {customerOrdersBusy && activeCustomerTableBookings.length === 0 ? (
        <View style={styles.centeredInline}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={styles.helperText}>Loading bookings...</Text>
        </View>
      ) : null}
      {activeCustomerTableBookings.length ? (
        activeCustomerTableBookings.map((order) => {
          const orderStatus = String(order.status || "").toLowerCase();
          const canCancel = !["cancelled", "delivered", "served"].includes(orderStatus);
          return (
            <View key={String(order._id || order.orderNumber)} style={styles.staffOrderCard}>
              <View style={styles.staffOrderHeader}>
                <Text style={styles.staffOrderTitle}>{order.orderNumber || "Booking"}</Text>
                <Text style={styles.staffOrderStatus}>{order.status || "Unknown"}</Text>
              </View>
              <Text style={styles.staffOrderMeta}>
                Table: {order.tableNumber || order.tableId?.tableNo || "-"} - Seats: {order.seatCount || "-"}
              </Text>
              <Text style={styles.staffOrderMeta}>
                Booking: {formatReservationRange(order)}
              </Text>
              <Text style={styles.staffOrderMeta}>
                Created: {formatDateTime(order.createdAt)}
              </Text>
              {canCancel ? (
                <View style={styles.orderActionRow}>
                  <TouchableOpacity
                    style={styles.actionGhost}
                    onPress={() => cancelCustomerOrder(order._id)}
                  >
                    <Text style={styles.actionGhostText}>Cancel Booking</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        })
      ) : (
        <Text style={styles.helperText}>No active table bookings yet.</Text>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Check Table Availability</Text>
      </View>
      <View style={styles.orderCard}>
        <Text style={styles.profileLabel}>Booking Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#8F98A8"
          value={bookingDate}
          onChangeText={(value) => {
            setBookingDate(value);
            const nextLabel = buildReservationLabel(value, bookingTime, bookingSuffix);
            setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
            setSeatSearchActive(false);
          }}
        />
        <Text style={styles.profileLabel}>Booking Time</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM"
          placeholderTextColor="#8F98A8"
          value={bookingTime}
          onChangeText={(value) => {
            setBookingTime(value);
            const nextLabel = buildReservationLabel(bookingDate, value, bookingSuffix);
            setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
            setSeatSearchActive(false);
          }}
          keyboardType="number-pad"
        />
        <View style={styles.filterRow}>
          {["AM", "PM"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.filterChip,
                bookingSuffix === s && styles.filterChipActive
              ]}
              onPress={() => {
                setBookingSuffix(s);
                const nextLabel = buildReservationLabel(bookingDate, bookingTime, s);
                setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                setSeatSearchActive(false);
              }}
            >
              <Text style={styles.filterChipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.helperText}>Calculated slot: {timeSlotLabel || "-"}</Text>
        {seatSearchError ? <Text style={styles.error}>{seatSearchError}</Text> : null}
        <TouchableOpacity style={styles.placeOrderButton} onPress={applySeatSearch}>
          <Text style={styles.primaryText}>Search Available Seats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tables List</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, tableFreeFilter === "all" && styles.filterChipActive]}
          onPress={() => setTableFreeFilter("all")}
        >
          <Text style={styles.filterChipText}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, tableFreeFilter === "free" && styles.filterChipActive]}
          onPress={() => setTableFreeFilter("free")}
        >
          <Text style={styles.filterChipText}>FREE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, tableFreeFilter === "full" && styles.filterChipActive]}
          onPress={() => setTableFreeFilter("full")}
        >
          <Text style={styles.filterChipText}>OCCUPIED</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={{ gap: 12 }}>
        {filteredTables.length ? (
          filteredTables.map((table) => {
            const totalSeats = Number(table.seats || 0);
            const remaining = getRemainingSeats(table);
            const status = getTableStatus(remaining, totalSeats);
            const statusColor = resolveStatusColor(status);
            return (
              <View key={String(table._id)} style={styles.seatMapCard}>
                <View style={[styles.seatMapStatus, { backgroundColor: statusColor }]}>
                  <Text style={styles.seatMapStatusText}>{status.toUpperCase()}</Text>
                </View>
                <Text style={styles.staffOrderTitle}>{table.tableNo || table.name || "Table"}</Text>
                <Text style={styles.staffOrderMeta}>
                  {String(table.location || "-").toUpperCase()} • {String(table.purpose || "-").toUpperCase()}
                </Text>
                <Text style={styles.staffOrderMeta}>
                  Seats: {remaining} / {totalSeats} free
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.helperText}>No tables matching filters.</Text>
        )}
      </View>
    </ScrollView>
  );
}
