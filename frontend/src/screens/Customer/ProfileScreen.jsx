import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import PaymentsScreen from "./PaymentsScreen";

export default function ProfileScreen({
  profile,
  profileTab,
  setProfileTab,
  profileForm,
  updateProfileField,
  profileSaveMsg,
  profileSaveBusy,
  handleSaveProfile,
  passwordForm,
  setPasswordForm,
  passwordMsg,
  passwordBusy,
  handleChangePassword,
  appTheme,
  setAppTheme,
  savedCards,
  customerReviews,
  customerReviewsBusy,
  customerReviewsMsg,
  loadCustomerReviews,
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
  formatDateTime,
  renderCustomerHeader,
  styles,
  theme
}) {
  const [paymentPickerOpen, setPaymentPickerOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const safeSavedCards = Array.isArray(savedCards) ? savedCards : [];
  const selectedCard = useMemo(
    () => safeSavedCards.find((card) => card.isDefault) || safeSavedCards[0] || null,
    [safeSavedCards]
  );

  const onSelectProfilePaymentMethod = (cardId) => {
    if (typeof setDefaultSavedCard === "function") {
      setDefaultSavedCard(cardId);
    }
    setPaymentPickerOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={[styles.catalogList, styles.bottomNavSpace]}>
      {renderCustomerHeader("My Profile", "Manage your account details.")}

      <View style={styles.profileHero}>
        <View style={styles.profileIconLarge}>
          <Text style={styles.profileIconTextLarge}>{`${(profile?.firstname || "U")[0]}${(profile?.lastname || "")[0] || ""}`}</Text>
        </View>
        <Text style={styles.profileName}>
          {(profile?.firstname || "") + " " + (profile?.lastname || "")}
        </Text>
        <Text style={styles.profileMeta}>{profile?.email || "Customer"}</Text>
      </View>

      <View style={styles.profileTabs}>
        {[
          { key: "profile", label: "My Profile" },
          { key: "reviews", label: "My Reviews" },
          { key: "payments", label: "My Payments" },
          { key: "theme", label: "Theme" }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.profileTabButton,
              profileTab === tab.key && styles.profileTabButtonActive
            ]}
            onPress={() => setProfileTab(tab.key)}
          >
            <Text
              style={[
                styles.profileTabText,
                profileTab === tab.key && styles.profileTabTextActive
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {profileTab === "profile" ? (
        <>
          <View style={styles.orderCard}>
            <View style={styles.profileSectionHeader}>
              <Text style={styles.sectionTitle}>My Profile</Text>
            </View>
            <Text style={styles.profileLabel}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={profileForm.firstname}
              onChangeText={(value) => updateProfileField("firstname", value)}
            />
            <Text style={styles.profileLabel}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={profileForm.lastname}
              onChangeText={(value) => updateProfileField("lastname", value)}
            />
            <Text style={styles.profileLabel}>Telephone</Text>
            <TextInput
              style={styles.input}
              placeholder="Telephone"
              value={profileForm.telephoneNumber}
              onChangeText={(value) => updateProfileField("telephoneNumber", value)}
              keyboardType="phone-pad"
            />
            <Text style={styles.profileLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
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

          <View style={styles.orderCard}>
            <View style={styles.profileSectionHeader}>
              <Text style={styles.sectionTitle}>Change Password</Text>
            </View>
            <View style={styles.paymentMethodInlineCard}>
              <Text style={styles.profileLabel}>Payment Method</Text>
              {selectedCard ? (
                <Text style={styles.staffOrderMeta}>
                  {selectedCard.brand || "Card"} **** {selectedCard.last4} {selectedCard.isDefault ? "(Default)" : ""}
                </Text>
              ) : (
                <Text style={styles.helperText}>No saved payment method yet.</Text>
              )}
              <TouchableOpacity
                style={styles.actionGhost}
                onPress={() => setPaymentPickerOpen(true)}
              >
                <Text style={styles.actionGhostText}>Change Method</Text>
              </TouchableOpacity>
            </View>
            {passwordMsg ? <Text style={styles.info}>{passwordMsg}</Text> : null}
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={() => setPasswordModalOpen(true)}
            >
              <Text style={styles.primaryText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {profileTab === "reviews" ? (
        <View style={styles.orderCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Reviews</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={loadCustomerReviews} disabled={customerReviewsBusy}>
              <Text style={styles.secondaryText}>{customerReviewsBusy ? "Refreshing..." : "Refresh"}</Text>
            </TouchableOpacity>
          </View>
          {customerReviewsMsg ? <Text style={styles.error}>{customerReviewsMsg}</Text> : null}
          {customerReviewsBusy && customerReviews.length === 0 ? (
            <View style={styles.centeredInline}>
              <ActivityIndicator size="small" color={theme.accent} />
              <Text style={styles.helperText}>Loading reviews...</Text>
            </View>
          ) : null}
          {customerReviews.length ? (
            customerReviews.map((review) => (
                <View
                  key={String(review._id)}
                  style={styles.seatMapCard}
                >
                <Text style={styles.staffOrderTitle}>
                  {review.targetType === "service" ? "Service Review" : review.dishId?.name || "Dish Review"}
                </Text>
                <Text style={styles.staffOrderMeta}>Rating: {review.rating || 0} / 5</Text>
                {review.comment ? <Text style={styles.staffOrderMeta}>{review.comment}</Text> : null}
              </View>
            ))
          ) : (
            <Text style={styles.helperText}>No reviews yet.</Text>
          )}
        </View>
      ) : null}

      {profileTab === "payments" ? (
        <PaymentsScreen
          styles={styles}
          accentColor={theme.accent}
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
          loadCustomerOrders={loadCustomerOrders}
          unpaidOrders={unpaidOrders}
          formatDateTime={formatDateTime}
        />
      ) : null}

      {profileTab === "theme" ? (
        <View style={styles.orderCard}>
          <View style={styles.profileSectionHeader}>
            <Text style={styles.sectionTitle}>Theme</Text>
          </View>
          <Text style={styles.profileLabel}>Appearance</Text>
          <View style={styles.orderTypeRow}>
            <TouchableOpacity
              style={[styles.orderTypeButton, appTheme === "light" && styles.orderTypeActive]}
              onPress={() => setAppTheme("light")}
            >
              <Text style={styles.orderTypeText}>LIGHT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.orderTypeButton, appTheme === "dark" && styles.orderTypeActive]}
              onPress={() => setAppTheme("dark")}
            >
              <Text style={styles.orderTypeText}>DARK</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <Modal
        visible={passwordModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPasswordModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Password</Text>
              <TouchableOpacity onPress={() => setPasswordModalOpen(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Current password"
                value={passwordForm.currentPassword}
                onChangeText={(value) => setPasswordForm((s) => ({ ...s, currentPassword: value }))}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="New password"
                value={passwordForm.newPassword}
                onChangeText={(value) => setPasswordForm((s) => ({ ...s, newPassword: value }))}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChangeText={(value) => setPasswordForm((s) => ({ ...s, confirmPassword: value }))}
                secureTextEntry
              />
              {passwordMsg ? <Text style={styles.info}>{passwordMsg}</Text> : null}
              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={async () => {
                  await handleChangePassword();
                  setPasswordModalOpen(false);
                }}
                disabled={passwordBusy}
              >
                {passwordBusy ? (
                  <ActivityIndicator color="#0A0A0A" />
                ) : (
                  <Text style={styles.primaryText}>Save Password</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={paymentPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setPaymentPickerOpen(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {safeSavedCards.length ? (
                safeSavedCards.map((card) => (
                  <TouchableOpacity
                    key={String(card._id)}
                    style={[
                      styles.savedCardItem,
                      card.isDefault && styles.savedCardItemActive
                    ]}
                    onPress={() => onSelectProfilePaymentMethod(card._id)}
                  >
                    <Text style={styles.staffOrderTitle}>
                      {card.brand || "Card"} **** {card.last4}
                    </Text>
                    <Text style={styles.staffOrderMeta}>
                      Exp {card.expiryMonth}/{card.expiryYear}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.helperText}>No saved cards. Add one from My Payments.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
