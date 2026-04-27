import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal, SafeAreaView, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import AdminDashboard from "./AdminDashboard";
import AdminManageDishes from "./AdminManageDishes";
import AdminManageTables from "./AdminManageTables";
import AdminManageOrders from "./AdminManageOrders";
import AdminManageReviews from "./AdminManageReviews";
import AdminManagePayments from "./AdminManagePayments";

const AdminApp = ({ adminProps, styles, theme }) => {


  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.adminSafeArea, adminProps.isAdminDark && styles.adminSafeAreaDark]}>
        <StatusBar style={adminProps.isAdminDark ? "light" : "dark"} />
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
          }}
          style={styles.background}
          imageStyle={[styles.adminBackgroundImage, adminProps.isAdminDark && styles.adminBackgroundImageDark]}
        >
          <View style={styles.backgroundOverlay} />
          <AdminDashboard
            adminTab={adminProps.adminTab}
            setAdminTab={adminProps.setAdminTab}
            // ... all other props from the original AdminDashboard call
            styles={styles}
            isAdminDark={adminProps.isAdminDark}
            theme={theme}
          />
          {/* Add the modals here */}
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AdminApp;