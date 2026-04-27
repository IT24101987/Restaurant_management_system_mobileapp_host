import React from "react";
import {
  ActivityIndicator,
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
          { key: "payments", label: "My Payments" }
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
            <TouchableOpacity style={styles.placeOrderButton} onPress={handleChangePassword} disabled={passwordBusy}>
              {passwordBusy ? (
                <ActivityIndicator color="#0A0A0A" />
              ) : (
                <Text style={styles.primaryText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.orderCard}>
            <View style={styles.profileSectionHeader}>
              <Text style={styles.sectionTitle}>Appearance</Text>
            </View>
            <Text style={styles.profileLabel}>Theme</Text>
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
    </ScrollView>
  );
}
