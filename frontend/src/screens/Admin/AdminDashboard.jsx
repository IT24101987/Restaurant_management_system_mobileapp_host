import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AdminManageDishes from "./AdminManageDishes";
import AdminManageTables from "./AdminManageTables";
import AdminManageOrders from "./AdminManageOrders";
import AdminManageReviews from "./AdminManageReviews";
import AdminManagePayments from "./AdminManagePayments";

export default function AdminDashboard({
  adminTab,
  setAdminTab,
  profile,
  roleLabel,
  profileForm,
  updateProfileField,
  profileSaveMsg,
  profileSaveBusy,
  handleSaveProfile,
  adminDishes,
  adminDishesMsg,
  adminDishesBusy,
  loadAdminDishes,
  setAddDishModalVisible,
  toggleAdminDishAvailability,
  toggleAdminDishTrending,
  deleteAdminDish,
  adminReviews,
  adminReviewsMsg,
  adminReviewsBusy,
  loadAdminReviews,
  deleteAdminReview,
  adminUsers,
  adminUsersBusy,
  adminUsersMsg,
  loadAdminUsers,
  updateAdminUserRole,
  toggleAdminUserBlocked,
  deleteAdminUser,
  adminPaymentStats,
  adminRevenue,
  adminPaymentOptions,
  toggleAdminPaymentOption,
  adminActiveOrders,
  adminPayments,
  adminPaymentsBusy,
  adminPaymentsMsg,
  loadAdminPayments,
  reviewRefundRequest,
  directRefundPayment,
  markAdminOrderPaid,
  createAdminPayment,
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
  cancelAdminOrder,
  setOrderModalVisible,
  formatOrderType,
  formatReservationRange,
  resolveTableLocation,
  formatDateTime,
  adminTables,
  adminTablesBusy,
  adminTablesMsg,
  loadAdminTables,
  addTableModalVisible,
  setAddTableModalVisible,
  adminTableDropdown,
  toggleAdminTableDropdown,
  adminTableFilter,
  setAdminTableFilter,
  adminTableForm,
  setAdminTableForm,
  saveAdminTable,
  adminTableReservations,
  adminTableReservationsBusy,
  loadAdminTableReservations,
  deleteAdminTable,
  toggleAdminTableAvailability,
  adminPendingCount,
  adminAvailableTablesCount,
  handleLogout,

  // Modal Props
  orderModalVisible,
  closeOrderModal,
  manualBookingMode,
  orderSubtotal,
  orderFee,
  orderTotal,
  customerName,
  setCustomerName,
  phone,
  setPhone,
  adminBookingDropdown,
  toggleAdminBookingDropdown,
  adminBookingLocation,
  setAdminBookingLocation,
  tableLocations,
  adminBookingPurpose,
  setAdminBookingPurpose,
  tablePurposes,
  filteredManualTables,
  renderTableSelectionRows,
  seatCount,
  setSeatCount,
  seatDropdownOpen,
  setSeatDropdownOpen,
  seatCountOptions,
  adminBookingDate,
  setAdminBookingDate,
  adminBookingTime,
  setAdminBookingTime,
  adminBookingSuffix,
  setAdminBookingSuffix,
  buildReservationLabel,
  setTimeSlotLabel,
  normalizeTimeSlotLabel,
  formatTimeInput,
  cartCount,
  deliveryFee,
  orderType,
  setOrderType,
  availableTables,
  deliveryAddress,
  setDeliveryAddress,
  paymentMethod,
  setPaymentMethod,
  useSavedCard,
  setUseSavedCard,
  savedCards,
  selectedCardId,
  setSelectedCardId,
  cardForm,
  setCardForm,
  cardBrandOpen,
  setCardBrandOpen,
  cardBrandOptions,
  formatCardNumber,
  saveCard,
  setSaveCard,
  getCartQuantity,
  updateCartQuantity,
  addToCart,
  getDishImageUri,
  handlePlaceOrder,
  orderBusy,
  orderMessage,
  error,
  addTableBusy,
  addAdminTable,
  addDishModalVisible,
  adminDishForm,
  setAdminDishForm,
  pickAdminDishImage,
  addAdminDish,

  styles,
  isAdminDark,
  theme
}) {
  const renderDashboard = () => (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>Dashboard Overview</Text>
        <TouchableOpacity
          style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
          onPress={() => {
            loadAdminOrders();
            loadAdminPayments();
          }}
        >
          <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>Sync All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.adminStatsGrid}>
        {[
          { label: "Today's Revenue", value: `LKR ${adminRevenue.toFixed(2)}`, color: styles.adminStatGreen },
          { label: "Pending Orders", value: adminPendingCount, color: styles.adminStatOrange },
          { label: "Available Tables", value: adminAvailableTablesCount, color: styles.adminStatBlue },
          { label: "Active Admins", value: adminUsers.filter(u => u.role === "admin").length, color: styles.adminStatPurple }
        ].map((item) => (
          <View key={item.label} style={[styles.adminStatCard, item.color, isAdminDark && styles.adminStatCardDark]}>
            <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>{item.label}</Text>
            <Text style={[styles.adminStatValue, isAdminDark && styles.adminStatValueDark]}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.adminTopbar, isAdminDark && styles.adminTopbarDark]}>
        <View style={styles.adminTopbarContent}>
          <Text style={[styles.adminTopbarTitle, isAdminDark && styles.adminTopbarTitleDark]}>{roleLabel} Panel</Text>
          <TouchableOpacity style={styles.adminLogoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={isAdminDark ? "#F87171" : "#EF4444"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.adminScrollView, { paddingBottom: 100 }]}>
        {adminTab === "dashboard" && renderDashboard()}

        {adminTab === "profile" && (
          <View style={styles.adminSection}>
            <View style={styles.adminProfileHero}>
              <View style={[styles.adminProfileIcon, isAdminDark && styles.adminProfileIconDark]}>
                <Text style={[styles.adminProfileIconText, isAdminDark && styles.adminProfileIconTextDark]}>
                  {String(profile?.firstname || profile?.email || "A").charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.adminProfileName, isAdminDark && styles.adminProfileNameDark]}>
                {profile?.firstname || profile?.email || "Admin"}
              </Text>
              <Text style={[styles.adminProfileMeta, isAdminDark && styles.adminProfileMetaDark]}>
                {profile?.email || "admin"}
              </Text>
            </View>
            <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
              <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>Edit Profile</Text>
              <TextInput
                style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                placeholder="First name"
                value={profileForm.firstname}
                onChangeText={(value) => updateProfileField("firstname", value)}
              />
              <TextInput
                style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                placeholder="Last name"
                value={profileForm.lastname}
                onChangeText={(value) => updateProfileField("lastname", value)}
              />
              <TextInput
                style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                placeholder="Telephone"
                value={profileForm.telephoneNumber}
                onChangeText={(value) => updateProfileField("telephoneNumber", value)}
                keyboardType="phone-pad"
              />
              <TextInput
                style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                placeholder="Address"
                value={profileForm.address}
                onChangeText={(value) => updateProfileField("address", value)}
                multiline
              />
              {profileSaveMsg ? <Text style={styles.info}>{profileSaveMsg}</Text> : null}
              <TouchableOpacity style={styles.adminPrimaryButton} onPress={handleSaveProfile} disabled={profileSaveBusy}>
                <Text style={styles.adminPrimaryText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {adminTab === "tables" && (
          <AdminManageTables
            adminTables={adminTables}
            adminTablesBusy={adminTablesBusy}
            adminTablesMsg={adminTablesMsg}
            loadAdminTables={loadAdminTables}
            addTableModalVisible={addTableModalVisible}
            setAddTableModalVisible={setAddTableModalVisible}
            adminTableDropdown={adminTableDropdown}
            toggleAdminTableDropdown={toggleAdminTableDropdown}
            adminTableFilter={adminTableFilter}
            setAdminTableFilter={setAdminTableFilter}
            adminTableForm={adminTableForm}
            setAdminTableForm={setAdminTableForm}
            saveAdminTable={saveAdminTable}
            adminTableReservations={adminTableReservations}
            adminTableReservationsBusy={adminTableReservationsBusy}
            loadAdminTableReservations={loadAdminTableReservations}
            deleteAdminTable={deleteAdminTable}
            cancelAdminOrder={cancelAdminOrder}
            toggleAdminTableAvailability={toggleAdminTableAvailability}
            styles={styles}
            isAdminDark={isAdminDark}
          />
        )}

        {adminTab === "dishes" && (
          <AdminManageDishes
            adminDishes={adminDishes}
            adminDishesMsg={adminDishesMsg}
            adminDishesBusy={adminDishesBusy}
            loadAdminDishes={loadAdminDishes}
            setAddDishModalVisible={setAddDishModalVisible}
            toggleAdminDishAvailability={toggleAdminDishAvailability}
            toggleAdminDishTrending={toggleAdminDishTrending}
            deleteAdminDish={deleteAdminDish}
            styles={styles}
            isAdminDark={isAdminDark}
          />
        )}

        {adminTab === "orders" && (
          <AdminManageOrders
            adminOrders={adminOrders}
            adminOrdersMsg={adminOrdersMsg}
            adminOrdersBusy={adminOrdersBusy}
            loadAdminOrders={loadAdminOrders}
            adminOrderCounts={adminOrderCounts}
            adminOrderTypeFilter={adminOrderTypeFilter}
            setAdminOrderTypeFilter={setAdminOrderTypeFilter}
            adminOrderStatusFilter={adminOrderStatusFilter}
            setAdminOrderStatusFilter={setAdminOrderStatusFilter}
            adminActiveStatuses={adminActiveStatuses}
            getOrderActions={getOrderActions}
            updateAdminOrderStatus={updateAdminOrderStatus}
            markAdminOrderPaid={markAdminOrderPaid}
            cancelAdminOrder={cancelAdminOrder}
            setOrderModalVisible={setOrderModalVisible}
            formatOrderType={formatOrderType}
            formatReservationRange={formatReservationRange}
            resolveTableLocation={resolveTableLocation}
            formatDateTime={formatDateTime}
            styles={styles}
            isAdminDark={isAdminDark}
          />
        )}

        {adminTab === "payments" && (
          <AdminManagePayments
            styles={styles}
            isAdminDark={isAdminDark}
            adminPaymentStats={adminPaymentStats}
            adminRevenue={adminRevenue}
            adminPaymentOptions={adminPaymentOptions}
            toggleAdminPaymentOption={toggleAdminPaymentOption}
            adminOrders={adminOrders}
            adminActiveOrders={adminActiveOrders}
            adminPayments={adminPayments}
            adminPaymentsBusy={adminPaymentsBusy}
            adminPaymentsMsg={adminPaymentsMsg}
            loadAdminPayments={loadAdminPayments}
            reviewRefundRequest={reviewRefundRequest}
            directRefundPayment={directRefundPayment}
            markAdminOrderPaid={markAdminOrderPaid}
            createAdminPayment={createAdminPayment}
            formatOrderType={formatOrderType}
            formatDateTime={formatDateTime}
          />
        )}

        {adminTab === "users" && (
          <View style={styles.adminSection}>
            <View style={styles.adminSectionHeader}>
              <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>Manage Users</Text>
              <TouchableOpacity style={styles.adminGhostButton} onPress={loadAdminUsers} disabled={adminUsersBusy}>
                <Text style={styles.adminGhostText}>{adminUsersBusy ? "Refreshing..." : "Refresh"}</Text>
              </TouchableOpacity>
            </View>
            {adminUsers.map((user) => (
              <View key={String(user._id)} style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
                <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>{user.email}</Text>
                <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>{user.firstname} {user.lastname} - {user.role}</Text>
                <View style={styles.adminActionRow}>
                  {["admin", "manager", "staff", "customer"].map(role => (
                    <TouchableOpacity key={role} style={[styles.adminActionButton, user.role === role && styles.adminActionButtonActive]} onPress={() => updateAdminUserRole(user._id, role)}>
                      <Text style={styles.adminActionText}>{role}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.adminDangerButton} onPress={() => deleteAdminUser(user._id)}>
                    <Text style={styles.adminDangerText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {adminTab === "reviews" && (
          <AdminManageReviews
            adminReviews={adminReviews}
            adminReviewsMsg={adminReviewsMsg}
            adminReviewsBusy={adminReviewsBusy}
            loadAdminReviews={loadAdminReviews}
            deleteAdminReview={deleteAdminReview}
            styles={styles}
            isAdminDark={isAdminDark}
          />
        )}
      </ScrollView>

      {/* Admin Modals */}
      <Modal
        visible={orderModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.adminModalSheet, isAdminDark && styles.adminModalSheetDark]}>
            <View style={[styles.adminModalHeader, isAdminDark && styles.adminModalHeaderDark]}>
              <Text style={[styles.adminModalTitle, isAdminDark && styles.adminModalTitleDark]}>
                {manualBookingMode ? "Manual Table Booking" : "Add Order"}
              </Text>
              <TouchableOpacity onPress={closeOrderModal}>
                <Text style={[styles.adminModalClose, isAdminDark && styles.adminModalCloseDark]}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={[styles.adminModalContent, isAdminDark && styles.adminModalContentDark]}>
              <View style={[styles.adminPanel, isAdminDark && styles.adminPanelDark]}>
                {manualBookingMode ? (
                  <>
                    <View style={[styles.adminOrderSummary, isAdminDark && styles.adminOrderSummaryDark]}>
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={[styles.adminOrderSummaryLabel, isAdminDark && styles.adminOrderSummaryLabelDark]}>
                          Subtotal
                        </Text>
                        <Text style={[styles.adminOrderSummaryValue, isAdminDark && styles.adminOrderSummaryValueDark]}>
                          LKR {orderSubtotal.toFixed(2)}
                        </Text>
                      </View>
                      <View style={[styles.adminOrderSummaryDivider, isAdminDark && styles.adminOrderSummaryDividerDark]} />
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={[styles.adminOrderSummaryLabel, isAdminDark && styles.adminOrderSummaryLabelDark]}>
                          Booking Fee
                        </Text>
                        <Text style={[styles.adminOrderSummaryValue, isAdminDark && styles.adminOrderSummaryValueDark]}>
                          LKR {orderFee.toFixed(2)}
                        </Text>
                      </View>
                      <View style={[styles.adminOrderSummaryDivider, isAdminDark && styles.adminOrderSummaryDividerDark]} />
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={[styles.adminOrderSummaryLabel, isAdminDark && styles.adminOrderSummaryLabelDark]}>
                          Total to Pay
                        </Text>
                        <Text style={[styles.adminOrderSummaryValue, isAdminDark && styles.adminOrderSummaryValueDark]}>
                          LKR {orderTotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.formRow}>
                      <TextInput
                        style={[styles.adminInput, isAdminDark && styles.adminInputDark, { flex: 1, minWidth: 140 }]}
                        placeholder="Customer Name"
                        placeholderTextColor="#8B8B8B"
                        value={customerName}
                        onChangeText={setCustomerName}
                      />
                      <TextInput
                        style={[styles.adminInput, isAdminDark && styles.adminInputDark, { flex: 1, minWidth: 140 }]}
                        placeholder="Customer Phone"
                        placeholderTextColor="#8B8B8B"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                      />
                    </View>
                    <View style={styles.formRow}>
                      <View style={{ flex: 1, minWidth: 140 }}>
                        <TouchableOpacity
                          style={[
                            styles.orderDropdown,
                            adminBookingDropdown.location && styles.orderDropdownOpen
                          ]}
                          onPress={() => toggleAdminBookingDropdown("location")}
                        >
                          <Text style={styles.orderDropdownText}>
                            {adminBookingLocation || "Select location"}
                          </Text>
                        </TouchableOpacity>
                        {adminBookingDropdown.location ? (
                          <View style={styles.orderDropdownList}>
                            {tableLocations.length ? (
                              tableLocations.map((location) => {
                                const isActive = String(adminBookingLocation) === String(location);
                                return (
                                  <TouchableOpacity
                                    key={String(location)}
                                    style={[
                                      styles.orderDropdownOption,
                                      isActive && styles.orderDropdownOptionActive
                                    ]}
                                    onPress={() => {
                                      setAdminBookingLocation(String(location));
                                      toggleAdminBookingDropdown("location");
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.orderDropdownOptionText,
                                        isActive && styles.orderDropdownOptionTextActive
                                      ]}
                                    >
                                      {String(location)}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })
                            ) : (
                              <Text style={styles.helperText}>No locations available.</Text>
                            )}
                          </View>
                        ) : null}
                      </View>
                      <View style={{ flex: 1, minWidth: 140 }}>
                        <TouchableOpacity
                          style={[
                            styles.orderDropdown,
                            adminBookingDropdown.purpose && styles.orderDropdownOpen
                          ]}
                          onPress={() => toggleAdminBookingDropdown("purpose")}
                        >
                          <Text style={styles.orderDropdownText}>
                            {adminBookingPurpose || "Select purpose"}
                          </Text>
                        </TouchableOpacity>
                        {adminBookingDropdown.purpose ? (
                          <View style={styles.orderDropdownList}>
                            {tablePurposes.length ? (
                              tablePurposes.map((purpose) => {
                                const isActive = String(adminBookingPurpose) === String(purpose);
                                return (
                                  <TouchableOpacity
                                    key={String(purpose)}
                                    style={[
                                      styles.orderDropdownOption,
                                      isActive && styles.orderDropdownOptionActive
                                    ]}
                                    onPress={() => {
                                      setAdminBookingPurpose(String(purpose));
                                      toggleAdminBookingDropdown("purpose");
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.orderDropdownOptionText,
                                        isActive && styles.orderDropdownOptionTextActive
                                      ]}
                                    >
                                      {String(purpose)}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })
                            ) : (
                              <Text style={styles.helperText}>No purposes available.</Text>
                            )}
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Select Table
                    </Text>
                    {renderTableSelectionRows(
                      filteredManualTables,
                      [styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]
                    )}
                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Seat Count
                    </Text>
                    <TouchableOpacity
                      style={[styles.orderDropdown, seatDropdownOpen && styles.orderDropdownOpen]}
                      onPress={() => setSeatDropdownOpen((current) => !current)}
                    >
                      <Text style={styles.orderDropdownText}>
                        {seatCount ? `${seatCount} seats` : "Select seats"}
                      </Text>
                    </TouchableOpacity>
                    {seatDropdownOpen ? (
                      <View style={styles.orderDropdownList}>
                        {seatCountOptions.length ? (
                          seatCountOptions.map((value) => {
                            const isActive = String(seatCount) === String(value);
                            return (
                              <TouchableOpacity
                                key={String(value)}
                                style={[
                                  styles.orderDropdownOption,
                                  isActive && styles.orderDropdownOptionActive
                                ]}
                                onPress={() => {
                                  setSeatCount(String(value));
                                  setSeatDropdownOpen(false);
                                }}
                              >
                                <Text
                                  style={[
                                    styles.orderDropdownOptionText,
                                    isActive && styles.orderDropdownOptionTextActive
                                  ]}
                                >
                                  {value} seats
                                </Text>
                              </TouchableOpacity>
                            );
                          })
                        ) : (
                          <Text style={styles.helperText}>No seats available for selected time.</Text>
                        )}
                      </View>
                    ) : null}
                    <View style={styles.formRow}>
                      <TextInput
                        style={[styles.adminInput, isAdminDark && styles.adminInputDark, { flex: 1, minWidth: 140 }]}
                        placeholder="Booking Date (YYYY-MM-DD)"
                        placeholderTextColor="#8B8B8B"
                        value={adminBookingDate}
                        onChangeText={(value) => {
                          setAdminBookingDate(value);
                          const nextLabel = buildReservationLabel(value, adminBookingTime, adminBookingSuffix);
                          setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                        }}
                      />
                      <TextInput
                        style={[styles.adminInput, isAdminDark && styles.adminInputDark, { flex: 1, minWidth: 140 }]}
                        placeholder="Booking Time (HH:MM)"
                        placeholderTextColor="#8B8B8B"
                        value={adminBookingTime}
                        onChangeText={(value) => {
                          const formatted = formatTimeInput(value);
                          setAdminBookingTime(formatted);
                          const nextLabel = buildReservationLabel(adminBookingDate, formatted, adminBookingSuffix);
                          setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                        }}
                      />
                    </View>
                    <View style={styles.orderActionRow}>
                      {["AM", "PM"].map((suffix) => {
                        const isActive = adminBookingSuffix === suffix;
                        return (
                          <TouchableOpacity
                            key={suffix}
                            style={[styles.actionGhost, isActive && styles.actionGhostActive]}
                            onPress={() => {
                              setAdminBookingSuffix(suffix);
                              const nextLabel = buildReservationLabel(
                                adminBookingDate,
                                adminBookingTime,
                                suffix
                              );
                              setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                            }}
                          >
                            <Text style={[styles.actionGhostText, isActive && styles.actionGhostActiveText]}>{suffix}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.adminOrderSummary, isAdminDark && styles.adminOrderSummaryDark]}>
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={[styles.adminOrderSummaryLabel, isAdminDark && styles.adminOrderSummaryLabelDark]}>
                          Cart Items
                        </Text>
                        <Text style={[styles.adminOrderSummaryValue, isAdminDark && styles.adminOrderSummaryValueDark]}>
                          {cartCount}
                        </Text>
                      </View>
                      <View style={[styles.adminOrderSummaryDivider, isAdminDark && styles.adminOrderSummaryDividerDark]} />
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={[styles.adminOrderSummaryLabel, isAdminDark && styles.adminOrderSummaryLabelDark]}>
                          Subtotal
                        </Text>
                        <Text style={[styles.adminOrderSummaryValue, isAdminDark && styles.adminOrderSummaryValueDark]}>
                          LKR {orderSubtotal.toFixed(2)}
                        </Text>
                      </View>
                      <View style={[styles.adminOrderSummaryDivider, isAdminDark && styles.adminOrderSummaryDividerDark]} />
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={[styles.adminOrderSummaryLabel, isAdminDark && styles.adminOrderSummaryLabelDark]}>
                          Total to Pay
                        </Text>
                        <Text style={[styles.adminOrderSummaryValue, isAdminDark && styles.adminOrderSummaryValueDark]}>
                          LKR {orderTotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    {orderType === "delivery" ? (
                      <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                        Delivery Fee: LKR {deliveryFee.toFixed(2)}
                      </Text>
                    ) : null}

                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Order Type
                    </Text>
                    <View style={styles.orderTypeRow}>
                      {["table", "delivery", "pickup"].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[styles.orderTypeButton, orderType === type && styles.orderTypeActive]}
                          onPress={() => setOrderType(type)}
                        >
                          <Text style={styles.orderTypeText}>{type.toUpperCase()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {orderType === "table" ? (
                      <>
                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Select Table
                        </Text>
                        {renderTableSelectionRows(
                          availableTables,
                          [styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]
                        )}
                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Seat Count
                        </Text>
                        <TouchableOpacity
                          style={[styles.orderDropdown, seatDropdownOpen && styles.orderDropdownOpen]}
                          onPress={() => setSeatDropdownOpen((current) => !current)}
                        >
                          <Text style={styles.orderDropdownText}>
                            {seatCount ? `${seatCount} seats` : "Select seats"}
                          </Text>
                        </TouchableOpacity>
                        {seatDropdownOpen ? (
                          <View style={styles.orderDropdownList}>
                            {seatCountOptions.length ? (
                              seatCountOptions.map((value) => {
                                const isActive = String(seatCount) === String(value);
                                return (
                                  <TouchableOpacity
                                    key={String(value)}
                                    style={[
                                      styles.orderDropdownOption,
                                      isActive && styles.orderDropdownOptionActive
                                    ]}
                                    onPress={() => {
                                      setSeatCount(String(value));
                                      setSeatDropdownOpen(false);
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.orderDropdownOptionText,
                                        isActive && styles.orderDropdownOptionTextActive
                                      ]}
                                    >
                                      {value} seats
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })
                            ) : (
                              <Text style={styles.helperText}>No seats available for selected time.</Text>
                            )}
                          </View>
                        ) : null}
                      </>
                    ) : null}

                    {orderType === "delivery" ? (
                      <>
                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Delivery Address
                        </Text>
                        <TextInput
                          style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                          placeholder="Delivery address"
                          placeholderTextColor="#8B8B8B"
                          value={deliveryAddress}
                          onChangeText={setDeliveryAddress}
                        />
                      </>
                    ) : null}

                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Payment Method
                    </Text>
                    <View style={styles.filterRow}>
                      {["cash", "card"].map((method) => (
                        <TouchableOpacity
                          key={method}
                          style={[
                            styles.filterChip,
                            paymentMethod === method && styles.filterChipActive
                          ]}
                          onPress={() => setPaymentMethod(method)}
                        >
                          <Text style={styles.filterChipText}>{method.toUpperCase()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {paymentMethod === "card" ? (
                      <View style={styles.cardBlock}>
                        <View style={styles.filterRow}>
                          <TouchableOpacity
                            style={[
                              styles.filterChip,
                              useSavedCard && styles.filterChipActive
                            ]}
                            onPress={() => setUseSavedCard(true)}
                          >
                            <Text style={styles.filterChipText}>SAVED CARD</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.filterChip,
                              !useSavedCard && styles.filterChipActive
                            ]}
                            onPress={() => setUseSavedCard(false)}
                          >
                            <Text style={styles.filterChipText}>NEW CARD</Text>
                          </TouchableOpacity>
                        </View>

                        {useSavedCard ? (
                          savedCards.length ? (
                            savedCards.map((card) => (
                              <TouchableOpacity
                                key={String(card._id)}
                                style={[
                                  styles.savedCardItem,
                                  String(selectedCardId) === String(card._id) &&
                                    styles.savedCardItemActive
                                ]}
                                onPress={() => setSelectedCardId(String(card._id))}
                              >
                                <Text style={styles.staffOrderTitle}>
                                  {card.brand || "Card"} ---- {card.last4}
                                </Text>
                                <Text style={styles.staffOrderMeta}>
                                  Exp {card.expiryMonth}/{card.expiryYear}
                                </Text>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <Text style={styles.helperText}>No saved cards found.</Text>
                          )
                        ) : (
                          <View>
                            <TextInput
                              style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                              placeholder="Cardholder name"
                              placeholderTextColor="#8B8B8B"
                              value={cardForm.cardHolderName}
                              onChangeText={(value) =>
                                setCardForm((s) => ({ ...s, cardHolderName: value }))
                              }
                            />
                            <TouchableOpacity
                              style={[styles.orderDropdown, cardBrandOpen && styles.orderDropdownOpen]}
                              onPress={() => setCardBrandOpen((current) => !current)}
                            >
                              <Text style={styles.orderDropdownText}>
                                {cardForm.brand || "Select card brand"}
                              </Text>
                            </TouchableOpacity>
                            {cardBrandOpen ? (
                              <View style={styles.orderDropdownList}>
                                {cardBrandOptions.map((brand) => {
                                  const isActive = String(cardForm.brand) === String(brand);
                                  return (
                                    <TouchableOpacity
                                      key={brand}
                                      style={[
                                        styles.orderDropdownOption,
                                        isActive && styles.orderDropdownOptionActive
                                      ]}
                                      onPress={() => {
                                        setCardForm((s) => ({ ...s, brand }));
                                        setCardBrandOpen(false);
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
                              style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                              placeholder="Card number"
                              placeholderTextColor="#8B8B8B"
                              value={formatCardNumber(cardForm.cardNumber)}
                              onChangeText={(value) =>
                                setCardForm((s) => ({
                                  ...s,
                                  cardNumber: String(value || "")
                                    .replace(/\D/g, "")
                                    .slice(0, 16)
                                }))
                              }
                              keyboardType="number-pad"
                            />
                            <View style={styles.expiryRow}>
                              <TextInput
                                style={[
                                  styles.adminInput,
                                  isAdminDark && styles.adminInputDark,
                                  styles.expiryInput
                                ]}
                                placeholder="MM"
                                placeholderTextColor="#8B8B8B"
                                value={cardForm.expiryMonth}
                                onChangeText={(value) =>
                                  setCardForm((s) => ({ ...s, expiryMonth: value }))
                                }
                                keyboardType="number-pad"
                              />
                              <TextInput
                                style={[
                                  styles.adminInput,
                                  isAdminDark && styles.adminInputDark,
                                  styles.expiryInput
                                ]}
                                placeholder="YYYY"
                                placeholderTextColor="#8B8B8B"
                                value={cardForm.expiryYear}
                                onChangeText={(value) =>
                                  setCardForm((s) => ({ ...s, expiryYear: value }))
                                }
                                keyboardType="number-pad"
                              />
                            </View>
                            <TouchableOpacity
                              style={[styles.filterChip, saveCard && styles.filterChipActive]}
                              onPress={() => setSaveCard((current) => !current)}
                            >
                              <Text style={styles.filterChipText}>
                                {saveCard ? "SAVE CARD: ON" : "SAVE CARD: OFF"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ) : null}

                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Customer Details
                    </Text>
                    <TextInput
                      style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                      placeholder="Customer name (optional)"
                      placeholderTextColor="#8B8B8B"
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                    <TextInput
                      style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                      placeholder="Phone (optional)"
                      placeholderTextColor="#8B8B8B"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />

                    {adminActiveOrders.length ? (
                      <View style={styles.cartBox}>
                        <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>
                          Quick Add Dishes
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adminActionRow}>
                          {adminDishes.slice(0, 10).map((dish) => (
                            <TouchableOpacity
                              key={String(dish._id)}
                              style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                              onPress={() => addToCart(dish)}
                            >
                              <Text style={styles.adminActionText}>{dish.name} (+1)</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        {adminDishes.map((dish) => {
                          const qty = getCartQuantity(dish._id);
                          if (qty <= 0) return null;
                          return (
                            <View key={String(dish._id)} style={styles.cartRow}>
                              <View style={styles.cartInfo}>
                                <Text style={[styles.cartName, isAdminDark && styles.cartNameDark]}>
                                  {dish.name}
                                </Text>
                                <Text style={styles.cartMeta}>LKR {Number(dish.price || 0).toFixed(2)}</Text>
                              </View>
                              <View style={styles.qtyRow}>
                                <TouchableOpacity
                                  style={styles.qtyButton}
                                  onPress={() => updateCartQuantity(dish._id, -1)}
                                >
                                  <Text style={styles.qtyText}>-</Text>
                                </TouchableOpacity>
                                <Text style={[styles.qtyValue, isAdminDark && styles.qtyValueDark]}>
                                  {qty}
                                </Text>
                                <TouchableOpacity
                                  style={styles.qtyButton}
                                  onPress={() => updateCartQuantity(dish._id, 1)}
                                >
                                  <Text style={styles.qtyText}>+</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ) : null}
                  </>
                )}

                {orderMessage ? <Text style={styles.info}>{orderMessage}</Text> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                  style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                  onPress={handlePlaceOrder}
                  disabled={orderBusy}
                >
                  {orderBusy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
                      {manualBookingMode ? "Confirm Booking" : "Place Admin Order"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addTableModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddTableModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.adminModalSheet, isAdminDark && styles.adminModalSheetDark]}>
            <View style={[styles.adminModalHeader, isAdminDark && styles.adminModalHeaderDark]}>
              <Text style={[styles.adminModalTitle, isAdminDark && styles.adminModalTitleDark]}>Add Table</Text>
              <TouchableOpacity onPress={() => setAddTableModalVisible(false)}>
                <Text style={[styles.adminModalClose, isAdminDark && styles.adminModalCloseDark]}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={[styles.adminModalContent, isAdminDark && styles.adminModalContentDark]}>
              <View style={[styles.adminPanel, isAdminDark && styles.adminPanelDark]}>
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Table number"
                  placeholderTextColor="#8B8B8B"
                  value={adminTableForm.tableNo}
                  onChangeText={(value) =>
                    setAdminTableForm((current) => ({ ...current, tableNo: value }))
                  }
                />
                <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>Seats</Text>
                <TouchableOpacity
                  style={[styles.adminDropdown, isAdminDark && styles.adminDropdownDark]}
                  onPress={() => toggleAdminTableDropdown("seats")}
                >
                  <Text style={[styles.adminDropdownText, isAdminDark && styles.adminDropdownTextDark]}>
                    {adminTableForm.seats} seats
                  </Text>
                </TouchableOpacity>
                {adminTableDropdown.seats ? (
                  <View style={[styles.adminDropdownMenu, isAdminDark && styles.adminDropdownMenuDark]}>
                    {["2", "4", "6", "8"].map((seatValue) => (
                      <TouchableOpacity
                        key={seatValue}
                        style={styles.adminDropdownItem}
                        onPress={() => {
                          setAdminTableForm((current) => ({ ...current, seats: seatValue }));
                          toggleAdminTableDropdown("seats");
                        }}
                      >
                        <Text style={[styles.adminDropdownItemText, isAdminDark && styles.adminDropdownItemTextDark]}>
                          {seatValue} seats
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
                <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>Location</Text>
                <TouchableOpacity
                  style={[styles.adminDropdown, isAdminDark && styles.adminDropdownDark]}
                  onPress={() => toggleAdminTableDropdown("location")}
                >
                  <Text style={[styles.adminDropdownText, isAdminDark && styles.adminDropdownTextDark]}>
                    {adminTableForm.location}
                  </Text>
                </TouchableOpacity>
                {adminTableDropdown.location ? (
                  <View style={[styles.adminDropdownMenu, isAdminDark && styles.adminDropdownMenuDark]}>
                    {["indoor", "outdoor", "window", "vip"].map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={styles.adminDropdownItem}
                        onPress={() => {
                          setAdminTableForm((current) => ({ ...current, location: value }));
                          toggleAdminTableDropdown("location");
                        }}
                      >
                        <Text style={[styles.adminDropdownItemText, isAdminDark && styles.adminDropdownItemTextDark]}>
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
                <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>Purpose</Text>
                <TouchableOpacity
                  style={[styles.adminDropdown, isAdminDark && styles.adminDropdownDark]}
                  onPress={() => toggleAdminTableDropdown("purpose")}
                >
                  <Text style={[styles.adminDropdownText, isAdminDark && styles.adminDropdownTextDark]}>
                    {adminTableForm.purpose}
                  </Text>
                </TouchableOpacity>
                {adminTableDropdown.purpose ? (
                  <View style={[styles.adminDropdownMenu, isAdminDark && styles.adminDropdownMenuDark]}>
                    {["family", "couple", "business", "vip"].map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={styles.adminDropdownItem}
                        onPress={() => {
                          setAdminTableForm((current) => ({ ...current, purpose: value }));
                          toggleAdminTableDropdown("purpose");
                        }}
                      >
                        <Text style={[styles.adminDropdownItemText, isAdminDark && styles.adminDropdownItemTextDark]}>
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
                <TouchableOpacity
                  style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                  onPress={async () => {
                    await addAdminTable();
                    setAddTableModalVisible(false);
                  }}
                  disabled={addTableBusy}
                >
                  {addTableBusy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>Save Table</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addDishModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddDishModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.adminModalSheet, isAdminDark && styles.adminModalSheetDark]}>
            <View style={[styles.adminModalHeader, isAdminDark && styles.adminModalHeaderDark]}>
              <Text style={[styles.adminModalTitle, isAdminDark && styles.adminModalTitleDark]}>Add Dish</Text>
              <TouchableOpacity onPress={() => setAddDishModalVisible(false)}>
                <Text style={[styles.adminModalClose, isAdminDark && styles.adminModalCloseDark]}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={[styles.adminModalContent, isAdminDark && styles.adminModalContentDark]}>
              <View style={[styles.adminPanel, isAdminDark && styles.adminPanelDark]}>
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Dish name"
                  placeholderTextColor="#8B8B8B"
                  value={adminDishForm.name}
                  onChangeText={(value) => setAdminDishForm((s) => ({ ...s, name: value }))}
                />
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Category"
                  placeholderTextColor="#8B8B8B"
                  value={adminDishForm.category}
                  onChangeText={(value) => setAdminDishForm((s) => ({ ...s, category: value }))}
                />
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Price"
                  placeholderTextColor="#8B8B8B"
                  value={adminDishForm.price}
                  onChangeText={(value) => setAdminDishForm((s) => ({ ...s, price: value }))}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Prep time (mins)"
                  placeholderTextColor="#8B8B8B"
                  value={adminDishForm.prepTimeMin}
                  onChangeText={(value) => setAdminDishForm((s) => ({ ...s, prepTimeMin: value }))}
                  keyboardType="number-pad"
                />
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Description"
                  placeholderTextColor="#8B8B8B"
                  value={adminDishForm.description}
                  onChangeText={(value) => setAdminDishForm((s) => ({ ...s, description: value }))}
                />
                {adminDishForm.imageUrl ? (
                  <View style={styles.adminImagePreviewWrap}>
                    <Image source={{ uri: adminDishForm.imageUrl }} style={styles.adminImagePreview} />
                  </View>
                ) : (
                  <View style={[styles.adminImagePreviewWrap, styles.adminImagePlaceholder]}>
                    <Text style={styles.cardImageText}>No image selected</Text>
                  </View>
                )}
                <View style={styles.adminImageActionRow}>
                  <TouchableOpacity
                    style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                    onPress={pickAdminDishImage}
                  >
                    <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>Select Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
                    onPress={() => setAdminDishForm((s) => ({ ...s, imageUrl: "" }))}
                  >
                    <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                  placeholder="Image URL (optional)"
                  placeholderTextColor="#8B8B8B"
                  value={adminDishForm.imageUrl}
                  onChangeText={(value) => setAdminDishForm((s) => ({ ...s, imageUrl: value }))}
                />
                <TouchableOpacity
                  style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                  onPress={async () => {
                    await addAdminDish();
                    setAddDishModalVisible(false);
                  }}
                >
                  <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>Save Dish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

