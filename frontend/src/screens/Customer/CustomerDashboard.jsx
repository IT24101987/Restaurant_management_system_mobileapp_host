import React from "react";
import {
  View,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import HomeScreen from "./HomeScreen";
import OrdersScreen from "./OrdersScreen";
import SeatMappingScreen from "./SeatMappingScreen";
import ProfileScreen from "./ProfileScreen";

export default function CustomerDashboard({
  customerTab,
  renderCustomerTopbar,
  // HomeScreen Props
  dishes,
  filteredMenuDishes,
  cartCount,
  trendingDishes,
  menuCategories,
  menuCategoryFilter,
  setMenuCategoryFilter,
  catalogBusy,
  loadCatalog,
  openOrderModal,
  addToCart,
  setOrderModalVisible,
  renderDishImage,
  renderTrendingCard,
  renderCustomerHeader,
  // OrdersScreen Props
  loadCustomerOrders,
  customerOrdersBusy,
  orderStatusFilter,
  setOrderStatusFilter,
  customerOrdersMsg,
  filteredCustomerOrders,
  formatOrderType,
  formatReservationRange,
  formatDateTime,
  normalizeOrderType,
  cancelCustomerOrder,
  // SeatMappingScreen Props
  activeCustomerTableBookings,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  bookingSuffix,
  setBookingSuffix,
  buildReservationLabel,
  normalizeTimeSlotLabel,
  setTimeSlotLabel,
  setSeatSearchActive,
  formatTimeInput,
  applySeatSearch,
  seatSearchActive,
  seatSearchError,
  tables,
  getLiveRemainingSeats,
  setOrderType,
  setSelectedTableId,
  setReservationOnly,
  setCustomerName,
  setPhone,
  setOrderMessage,
  customerDisplayName,
  profile,
  getGroupSummary,
  // ProfileScreen Props
  profileTab,
  setProfileTab,
  profileForm,
  updateProfileField,
  profileSaveMsg,
  profileSaveBusy,
  handleSaveProfile,
  passwordForm,
  setPasswordForm,
  handleChangePassword,
  passwordBusy,
  passwordMsg,
  appTheme,
  setAppTheme,
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
  customerReviews,
  customerReviewsBusy,
  customerReviewsMsg,
  loadCustomerReviews,
  handleLogout,

  // Modal Specific Props
  orderModalVisible,
  closeOrderModal,
  reservationOnly,
  orderSubtotal,
  orderFee,
  orderTotal,
  customerName,
  phone,
  deliveryFee,
  selectedDish,
  getDishImageUri,
  orderType,
  availableTables,
  renderTableSelectionRows,
  seatDropdownOpen,
  setSeatDropdownOpen,
  seatCount,
  setSeatCount,
  seatCountOptions,
  deliveryAddress,
  setDeliveryAddress,
  paymentMethod,
  setPaymentMethod,
  useSavedCard,
  setUseSavedCard,
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
  cart,
  updateCartQuantity,
  cartTotal,
  orderMessage,
  error,
  handlePlaceOrder,
  orderBusy,
  profileModalVisible,
  setProfileModalVisible,
  reviewModalVisible,
  setReviewModalVisible,
  reviewForm,
  setReviewForm,
  reviewMsg,
  handleSubmitReview,
  reviewBusy,

  // Common
  styles,
  theme,
  isDark
}) {
  return (
    <View style={{ flex: 1 }}>
      {renderCustomerTopbar()}
      
      {customerTab === "menu" && (
        <HomeScreen
          dishes={dishes}
          filteredMenuDishes={filteredMenuDishes}
          cartCount={cartCount}
          trendingDishes={trendingDishes}
          menuCategories={menuCategories}
          menuCategoryFilter={menuCategoryFilter}
          setMenuCategoryFilter={setMenuCategoryFilter}
          catalogBusy={catalogBusy}
          loadCatalog={loadCatalog}
          openOrderModal={openOrderModal}
          addToCart={addToCart}
          setOrderModalVisible={setOrderModalVisible}
          renderDishImage={renderDishImage}
          renderTrendingCard={renderTrendingCard}
          renderCustomerHeader={renderCustomerHeader}
          styles={styles}
          theme={theme}
          isDark={isDark}
        />
      )}

      {customerTab === "orders" && (
        <OrdersScreen
          loadCustomerOrders={loadCustomerOrders}
          customerOrdersBusy={customerOrdersBusy}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          customerOrdersMsg={customerOrdersMsg}
          filteredCustomerOrders={filteredCustomerOrders}
          formatOrderType={formatOrderType}
          formatReservationRange={formatReservationRange}
          formatDateTime={formatDateTime}
          normalizeOrderType={normalizeOrderType}
          cancelCustomerOrder={cancelCustomerOrder}
          renderCustomerHeader={renderCustomerHeader}
          styles={styles}
          theme={theme}
        />
      )}

      {customerTab === "tables" && (
        <SeatMappingScreen
          loadCustomerOrders={loadCustomerOrders}
          customerOrdersBusy={customerOrdersBusy}
          customerOrdersMsg={customerOrdersMsg}
          activeCustomerTableBookings={activeCustomerTableBookings}
          formatReservationRange={formatReservationRange}
          formatDateTime={formatDateTime}
          cancelCustomerOrder={cancelCustomerOrder}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          bookingTime={bookingTime}
          setBookingTime={setBookingTime}
          bookingSuffix={bookingSuffix}
          setBookingSuffix={setBookingSuffix}
          buildReservationLabel={buildReservationLabel}
          normalizeTimeSlotLabel={normalizeTimeSlotLabel}
          setTimeSlotLabel={setTimeSlotLabel}
          setSeatSearchActive={setSeatSearchActive}
          formatTimeInput={formatTimeInput}
          applySeatSearch={applySeatSearch}
          seatSearchActive={seatSearchActive}
          seatSearchError={seatSearchError}
          loadCatalog={loadCatalog}
          catalogBusy={catalogBusy}
          tables={tables}
          getLiveRemainingSeats={getLiveRemainingSeats}
          setOrderType={setOrderType}
          setSelectedTableId={setSelectedTableId}
          setReservationOnly={setReservationOnly}
          setCustomerName={setCustomerName}
          setPhone={setPhone}
          setOrderMessage={setOrderMessage}
          setOrderModalVisible={setOrderModalVisible}
          customerDisplayName={customerDisplayName}
          profile={profile}
          getGroupSummary={getGroupSummary}
          renderCustomerHeader={renderCustomerHeader}
          styles={styles}
          theme={theme}
        />
      )}

      {customerTab === "profile" && (
        <ProfileScreen
          profile={profile}
          profileTab={profileTab}
          setProfileTab={setProfileTab}
          profileForm={profileForm}
          updateProfileField={updateProfileField}
          profileSaveMsg={profileSaveMsg}
          profileSaveBusy={profileSaveBusy}
          handleSaveProfile={handleSaveProfile}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          handleChangePassword={handleChangePassword}
          passwordBusy={passwordBusy}
          passwordMsg={passwordMsg}
          appTheme={appTheme}
          setAppTheme={setAppTheme}
          savedCards={savedCards}
          setDefaultSavedCard={setDefaultSavedCard}
          deleteSavedCard={deleteSavedCard}
          addCardOpen={addCardOpen}
          setAddCardOpen={setAddCardOpen}
          savedCardForm={savedCardForm}
          setSavedCardForm={setSavedCardForm}
          addSavedCard={addSavedCard}
          customerPaymentsFilter={customerPaymentsFilter}
          setCustomerPaymentsFilter={setCustomerPaymentsFilter}
          customerPaymentsMsg={customerPaymentsMsg}
          customerPaymentsBusy={customerPaymentsBusy}
          filteredPayments={filteredPayments}
          loadCustomerPayments={loadCustomerPayments}
          customerReviews={customerReviews}
          customerReviewsBusy={customerReviewsBusy}
          customerReviewsMsg={customerReviewsMsg}
          loadCustomerReviews={loadCustomerReviews}
          handleLogout={handleLogout}
          formatDateTime={formatDateTime}
          renderCustomerHeader={renderCustomerHeader}
          styles={styles}
          theme={theme}
        />
      )}

      {/* Customer Modals */}
      <Modal
        visible={orderModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {reservationOnly ? "Table Booking" : "Place Order"}
              </Text>
              <TouchableOpacity onPress={closeOrderModal}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.orderCard}>
                {!reservationOnly ? (
                  <>
                    <View style={styles.adminOrderSummary}>
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={styles.adminOrderSummaryLabel}>Cart Items</Text>
                        <Text style={styles.adminOrderSummaryValue}>{cartCount}</Text>
                      </View>
                      <View style={styles.adminOrderSummaryDivider} />
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={styles.adminOrderSummaryLabel}>Subtotal</Text>
                        <Text style={styles.adminOrderSummaryValue}>LKR {orderSubtotal.toFixed(2)}</Text>
                      </View>
                      <View style={styles.adminOrderSummaryDivider} />
                      <View style={styles.adminOrderSummaryItem}>
                        <Text style={styles.adminOrderSummaryLabel}>Total to Pay</Text>
                        <Text style={styles.adminOrderSummaryValue}>LKR {orderTotal.toFixed(2)}</Text>
                      </View>
                    </View>
                    {orderType === "delivery" ? (
                      <Text style={styles.helperText}>Delivery Fee: LKR {deliveryFee.toFixed(2)}</Text>
                    ) : null}

                    {selectedDish ? (
                      <View style={styles.selectedDishCard}>
                        {getDishImageUri(selectedDish) ? (
                          <Image
                            source={{ uri: getDishImageUri(selectedDish) }}
                            style={styles.selectedDishImage}
                          />
                        ) : (
                          <View style={[styles.selectedDishImage, styles.cardImagePlaceholder]}>
                            <Text style={styles.cardImageText}>No image</Text>
                          </View>
                        )}
                        <View style={styles.selectedDishBody}>
                          <Text style={styles.menuTitle}>{selectedDish.name || "Dish"}</Text>
                          <Text style={styles.menuDescription}>
                            {selectedDish.description || "No details available."}
                          </Text>
                          <Text style={styles.menuRating}>
                            LKR {Number(selectedDish.price || 0).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <Text style={styles.profileLabel}>Order Type</Text>
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
                  </>
                ) : null}

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
                  }}
                />
                <Text style={styles.profileLabel}>Booking Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  placeholderTextColor="#8F98A8"
                  value={bookingTime}
                  onChangeText={(value) => {
                    const formatted = formatTimeInput(value);
                    setBookingTime(formatted);
                    const nextLabel = buildReservationLabel(bookingDate, formatted, bookingSuffix);
                    setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                  }}
                />
                <View style={styles.orderActionRow}>
                  {["AM", "PM"].map((suffix) => {
                    const isActive = bookingSuffix === suffix;
                    return (
                      <TouchableOpacity
                        key={suffix}
                        style={[styles.actionGhost, isActive && styles.actionGhostActive]}
                        onPress={() => {
                          setBookingSuffix(suffix);
                          const nextLabel = buildReservationLabel(bookingDate, bookingTime, suffix);
                          setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                        }}
                      >
                        <Text style={[styles.actionGhostText, isActive && styles.actionGhostActiveText]}>{suffix}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {orderType === "table" || reservationOnly ? (
                  <>
                    <Text style={styles.profileLabel}>Select Table</Text>
                    {renderTableSelectionRows(availableTables, styles.profileLabel)}
                    <Text style={styles.profileLabel}>Seat Count</Text>
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

                {!reservationOnly ? (
                  <>
                    {orderType === "delivery" ? (
                      <>
                        <Text style={styles.profileLabel}>Delivery Address</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Delivery address"
                          placeholderTextColor="#8F98A8"
                          value={deliveryAddress}
                          onChangeText={setDeliveryAddress}
                        />
                      </>
                    ) : null}

                    {orderType === "delivery" ? (
                      <View style={styles.paymentNotice}>
                        <Text style={styles.profileLabel}>Payment Method</Text>
                        <Text style={styles.staffOrderMeta}>Card payment required for delivery.</Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.profileLabel}>Payment Method</Text>
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
                      </View>
                    )}

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
                                  String(selectedCardId) === String(card._id) && styles.savedCardItemActive
                                ]}
                                onPress={() => setSelectedCardId(String(card._id))}
                              >
                                <Text style={styles.staffOrderTitle}>
                                  {card.brand || "Card"} ---- {card.last4}
                                </Text>
                                <Text style={styles.staffOrderMeta}>
                                  Exp {card.expiryMonth}/{card.expiryYear}
                                </Text>
                                {card.isDefault ? (
                                  <Text style={styles.helperText}>Default</Text>
                                ) : null}
                              </TouchableOpacity>
                            ))
                          ) : (
                            <Text style={styles.helperText}>No saved cards. Add one in Profile {'>'} Payments.</Text>
                          )
                        ) : (
                          <View>
                            <TextInput
                              style={styles.input}
                              placeholder="Cardholder name"
                              placeholderTextColor="#8F98A8"
                              value={cardForm.cardHolderName}
                              onChangeText={(value) => setCardForm((s) => ({ ...s, cardHolderName: value }))}
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
                              style={styles.input}
                              placeholder="Card number"
                              placeholderTextColor="#8F98A8"
                              value={formatCardNumber(cardForm.cardNumber)}
                              onChangeText={(value) =>
                                setCardForm((s) => ({
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
                                value={cardForm.expiryMonth}
                                onChangeText={(value) => setCardForm((s) => ({ ...s, expiryMonth: value }))}
                                keyboardType="number-pad"
                              />
                              <TextInput
                                style={[styles.input, styles.expiryInput]}
                                placeholder="YYYY"
                                placeholderTextColor="#8F98A8"
                                value={cardForm.expiryYear}
                                onChangeText={(value) => setCardForm((s) => ({ ...s, expiryYear: value }))}
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

                    <Text style={styles.profileLabel}>Customer Details</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Customer name (optional)"
                      placeholderTextColor="#8F98A8"
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone (optional)"
                      placeholderTextColor="#8F98A8"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />

                    {cart.length ? (
                      <View style={styles.cartBox}>
                        {cart.map((item) => (
                          <View key={String(item.dishId)} style={styles.cartRow}>
                            <View style={styles.cartInfo}>
                              <Text style={styles.cartName}>{item.name}</Text>
                              <Text style={styles.cartMeta}>LKR {Number(item.price || 0).toFixed(2)}</Text>
                            </View>
                            <View style={styles.qtyRow}>
                              <TouchableOpacity
                                style={styles.qtyButton}
                                onPress={() => updateCartQuantity(item.dishId, -1)}
                              >
                                <Text style={styles.qtyText}>-</Text>
                              </TouchableOpacity>
                              <Text style={styles.qtyValue}>{item.quantity}</Text>
                              <TouchableOpacity
                                style={styles.qtyButton}
                                onPress={() => updateCartQuantity(item.dishId, 1)}
                              >
                                <Text style={styles.qtyText}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                        <View style={styles.totalRow}>
                          <Text style={styles.totalLabel}>Total</Text>
                          <Text style={styles.totalValue}>LKR {cartTotal.toFixed(2)}</Text>
                        </View>
                      </View>
                    ) : orderType === "table" ? null : (
                      <Text style={styles.helperText}>Add dishes from the menu below.</Text>
                    )}
                  </>
                ) : null}

                {orderMessage ? <Text style={styles.info}>{orderMessage}</Text> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                  style={styles.placeOrderButton}
                  onPress={handlePlaceOrder}
                  disabled={orderBusy}
                >
                  {orderBusy ? (
                    <ActivityIndicator color="#0A0A0A" />
                  ) : (
                    <Text style={styles.primaryText}>
                      {reservationOnly ? "Reserve Table" : "Place Order"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>My Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.orderCard}>
                <Text style={styles.profileLabel}>First name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#8F98A8"
                  value={profileForm.firstname}
                  onChangeText={(value) => updateProfileField("firstname", value)}
                />
                <Text style={styles.profileLabel}>Last name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#8F98A8"
                  value={profileForm.lastname}
                  onChangeText={(value) => updateProfileField("lastname", value)}
                />
                <Text style={styles.profileLabel}>Telephone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Telephone"
                  placeholderTextColor="#8F98A8"
                  value={profileForm.telephoneNumber}
                  onChangeText={(value) => updateProfileField("telephoneNumber", value)}
                  keyboardType="phone-pad"
                />
                <Text style={styles.profileLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#8F98A8"
                  value={profileForm.address}
                  onChangeText={(value) => updateProfileField("address", value)}
                  multiline
                />
                {profileSaveMsg ? <Text style={styles.info}>{profileSaveMsg}</Text> : null}
                <TouchableOpacity style={styles.placeOrderButton} onPress={handleSaveProfile} disabled={profileSaveBusy}>
                  {profileSaveBusy ? (
                    <ActivityIndicator color="#0A0A0A" />
                  ) : (
                    <Text style={styles.primaryText}>Save Profile</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Review</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.orderCard}>
                <Text style={styles.profileLabel}>Dish</Text>
                <Text style={styles.profileValue}>{reviewForm.dishName || "Selected dish"}</Text>
                <Text style={styles.profileLabel}>Your name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor="#8F98A8"
                  value={reviewForm.reviewerName}
                  onChangeText={(value) => setReviewForm((s) => ({ ...s, reviewerName: value }))}
                />
                <Text style={styles.profileLabel}>Rating (1-5)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rating"
                  placeholderTextColor="#8F98A8"
                  value={reviewForm.rating}
                  onChangeText={(value) => setReviewForm((s) => ({ ...s, rating: value }))}
                  keyboardType="number-pad"
                />
                <Text style={styles.profileLabel}>Comment</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Write a short comment"
                  placeholderTextColor="#8F98A8"
                  value={reviewForm.comment}
                  onChangeText={(value) => setReviewForm((s) => ({ ...s, comment: value }))}
                  multiline
                />
                {reviewMsg ? <Text style={styles.info}>{reviewMsg}</Text> : null}
                <TouchableOpacity style={styles.placeOrderButton} onPress={handleSubmitReview} disabled={reviewBusy}>
                  {reviewBusy ? (
                    <ActivityIndicator color="#0A0A0A" />
                  ) : (
                    <Text style={styles.primaryText}>Save Review</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
