import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AuthScreen from "./src/screens/Auth/AuthScreen";
import PaymentsScreen from "./src/screens/Customer/PaymentsScreen";
import AdminManageDishes from "./src/screens/Admin/AdminManageDishes";
import AdminManageTables from "./src/screens/Admin/AdminManageTables";
import AdminManageOrders from "./src/screens/Admin/AdminManageOrders";
import AdminManageReviews from "./src/screens/Admin/AdminManageReviews";
import AdminManagePayments from "./src/screens/Admin/AdminManagePayments";

import { apiFetch } from "./src/script/api/client";
import { API_BASE_URL } from "./src/constant/config";
import { clearToken, loadToken, saveToken } from "./src/script/storage/token";
import {
  loadAdminPaymentDefaults as loadAdminPaymentDefaultsStorage,
  saveAdminPaymentDefaults as saveAdminPaymentDefaultsStorage
} from "./src/script/storage/adminPaymentDefaults";
import { lightTheme, darkTheme, createStyles } from "./src/constant/styles";

const EMPTY_ADMIN_DISH_FORM = {
  name: "",
  category: "",
  price: "",
  prepTimeMin: "",
  description: "",
  imageUrl: "",
  isAvailable: true,
  isTrending: false
};

const DEFAULT_DISH_CATEGORIES = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Salad",
  "Soup",
  "Snack"
];
const DEFAULT_ADMIN_PAYMENT_DEFAULTS = {
  taxPercent: "0",
  offerType: "fixed",
  offerValue: "0"
};
const DISHES_PER_PAGE = 9;

export default function App() {
  const menuListRef = useRef(null);
  const menuCategoryRowRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("customer");
  const [roleReady, setRoleReady] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [loginScope, setLoginScope] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [hometown, setHometown] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [catalogBusy, setCatalogBusy] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [trendingPool, setTrendingPool] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableSeatUsage, setTableSeatUsage] = useState({});
  const [tableSeatUsageBySlot, setTableSeatUsageBySlot] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("table");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("all");
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [allMenuCategories, setAllMenuCategories] = useState([]);
  const [dishPage, setDishPage] = useState(1);
  const [dishTotalPages, setDishTotalPages] = useState(1);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [seatCount, setSeatCount] = useState("2");
  const [seatDropdownOpen, setSeatDropdownOpen] = useState(false);
  const [timeSlotLabel, setTimeSlotLabel] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSuffix, setBookingSuffix] = useState("PM");
  const [seatSearchActive, setSeatSearchActive] = useState(false);
  const [seatSearchError, setSeatSearchError] = useState("");
  const [adminBookingDate, setAdminBookingDate] = useState("");
  const [adminBookingTime, setAdminBookingTime] = useState("");
  const [adminBookingSuffix, setAdminBookingSuffix] = useState("PM");
  const [adminBookingLocation, setAdminBookingLocation] = useState("");
  const [adminBookingPurpose, setAdminBookingPurpose] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderBusy, setOrderBusy] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [reservationOnly, setReservationOnly] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [useSavedCard, setUseSavedCard] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardHolderName: "",
    brand: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: ""
  });
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [cardBrandOpen, setCardBrandOpen] = useState(false);
  const [savedCardForm, setSavedCardForm] = useState({
    cardHolderName: "",
    brand: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: ""
  });
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    telephoneNumber: "",
    address: ""
  });
  const [profileSaveBusy, setProfileSaveBusy] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState("");
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    dishId: "",
    dishName: "",
    reviewerName: "",
    rating: "0",
    comment: ""
  });
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [profile, setProfile] = useState(null);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [staffOrders, setStaffOrders] = useState([]);
  const [staffOrdersBusy, setStaffOrdersBusy] = useState(false);
  const [staffOrdersMsg, setStaffOrdersMsg] = useState("");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [adminTables, setAdminTables] = useState([]);
  const [adminTablesBusy, setAdminTablesBusy] = useState(false);
  const [adminTablesMsg, setAdminTablesMsg] = useState("");
  const [addTableModalVisible, setAddTableModalVisible] = useState(false);
  const [adminTableDropdown, setAdminTableDropdown] = useState({
    seats: false,
    location: false,
    purpose: false
  });
  const [adminBookingDropdown, setAdminBookingDropdown] = useState({
    location: false,
    purpose: false
  });
  const [adminTableFilter, setAdminTableFilter] = useState("all");
  const [adminTableForm, setAdminTableForm] = useState({
    tableNo: "",
    seats: "2",
    location: "indoor",
    purpose: "family",
    isAvailable: true
  });
  const [adminDishes, setAdminDishes] = useState([]);
  const [adminDishesBusy, setAdminDishesBusy] = useState(false);
  const [adminDishesMsg, setAdminDishesMsg] = useState("");
  const [addDishModalVisible, setAddDishModalVisible] = useState(false);
  const [editingAdminDishId, setEditingAdminDishId] = useState("");
  const [adminDishCategoryDropdownOpen, setAdminDishCategoryDropdownOpen] = useState(false);
  const [adminOrderTypeFilter, setAdminOrderTypeFilter] = useState("all");
  const [adminOrderStatusFilter, setAdminOrderStatusFilter] = useState("all");
  const [adminDishForm, setAdminDishForm] = useState(EMPTY_ADMIN_DISH_FORM);
  const [adminReviews, setAdminReviews] = useState([]);
  const [adminReviewsBusy, setAdminReviewsBusy] = useState(false);
  const [adminReviewsMsg, setAdminReviewsMsg] = useState("");
  const [adminPayments, setAdminPayments] = useState([]);
  const [adminPaymentsBusy, setAdminPaymentsBusy] = useState(false);
  const [adminPaymentsMsg, setAdminPaymentsMsg] = useState("");
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersBusy, setAdminUsersBusy] = useState(false);
  const [adminUsersMsg, setAdminUsersMsg] = useState("");
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminOrdersBusy, setAdminOrdersBusy] = useState(false);
  const [adminOrdersMsg, setAdminOrdersMsg] = useState("");
  const [adminTableReservations, setAdminTableReservations] = useState([]);
  const [adminTableReservationsBusy, setAdminTableReservationsBusy] = useState(false);
  const [appTheme, setAppTheme] = useState("light");
  const [adminPaymentDefaults, setAdminPaymentDefaults] = useState(DEFAULT_ADMIN_PAYMENT_DEFAULTS);
  const adminRevenue = useMemo(() => {
    if (adminPayments.length) {
      return adminPayments
        .filter((payment) => String(payment?.refundStatus || "").toLowerCase() !== "approved")
        .reduce((sum, payment) => sum + Number(payment.totalAmount || 0), 0);
    }
    return adminOrders
      .filter((order) => String(order.paymentStatus || "").toLowerCase() === "paid")
      .reduce((sum, order) => {
        const total =
          typeof order.totalAmount === "number"
            ? order.totalAmount
            : (Array.isArray(order.items) ? order.items : []).reduce(
                (itemSum, item) => itemSum + Number(item.price || 0) * Number(item.quantity || 0),
                0
              );
        return sum + total;
      }, 0);
  }, [adminOrders, adminPayments]);
  const saveAdminPaymentDefaults = async (defaults) => {
    const normalizedOfferType = String(defaults?.offerType || "fixed").toLowerCase() === "percent"
      ? "percent"
      : "fixed";
    const nextDefaults = {
      taxPercent: String(defaults?.taxPercent ?? "0"),
      offerType: normalizedOfferType,
      offerValue: String(defaults?.offerValue ?? "0")
    };
    setAdminPaymentDefaults(nextDefaults);
    try {
      await saveAdminPaymentDefaultsStorage(nextDefaults);
    } catch (_) {
      // Keep in-memory defaults even if persistence fails.
    }
    return nextDefaults;
  };

  const adminPaymentStats = useMemo(() => {
    const stats = {
      paid: 0,
      unpaid: 0,
      refunded: 0,
      methods: {}
    };
    adminOrders.forEach((order) => {
      const status = String(order?.paymentStatus || "unpaid").toLowerCase();
      if (status === "paid") {
        stats.paid += 1;
      } else {
        stats.unpaid += 1;
      }

      const method = String(order?.paymentMethod || "cash").toLowerCase();
      stats.methods[method] = (stats.methods[method] || 0) + 1;
    });

    if (adminPayments.length) {
      stats.refunded = adminPayments.filter(
        (payment) => String(payment?.refundStatus || "").toLowerCase() === "approved"
      ).length;
    }

    return stats;
  }, [adminOrders, adminPayments]);

  const adminActiveStatuses = ["new", "preparing", "ready"];
  const adminActiveOrders = useMemo(
    () =>
      adminOrders.filter((order) =>
        adminActiveStatuses.includes(String(order?.status || "").toLowerCase())
      ),
    [adminOrders]
  );
  const adminPendingCount = useMemo(
    () =>
      adminOrders.filter((order) =>
        adminActiveStatuses.includes(String(order?.status || "").toLowerCase())
      ).length,
    [adminOrders]
  );
  const adminBookedTableOrders = useMemo(
    () =>
      adminOrders.filter(
        (order) =>
          String(order?.orderType || "").toLowerCase() === "table" &&
          adminActiveStatuses.includes(String(order?.status || "").toLowerCase())
      ),
    [adminOrders]
  );
  const adminBookedTableIds = useMemo(() => {
    const ids = new Set();
    adminBookedTableOrders.forEach((order) => {
      const tableId = order.tableId?._id || order.tableId || "";
      if (tableId) ids.add(String(tableId));
    });
    return ids;
  }, [adminBookedTableOrders]);
  const adminAvailableTablesCount = useMemo(
    () =>
      adminTables.filter(
        (table) => table.isAvailable && !adminBookedTableIds.has(String(table._id))
      ).length,
    [adminTables, adminBookedTableIds]
  );
  const adminSeatUsageByTable = useMemo(() => {
    const usage = {};
    adminBookedTableOrders.forEach((order) => {
      const tableId = String(order.tableId?._id || order.tableId || "");
      if (!tableId) return;
      const seats = Number(order.seatCount || 1);
      usage[tableId] = (usage[tableId] || 0) + seats;
    });
    return usage;
  }, [adminBookedTableOrders]);
  const adminOrderCounts = useMemo(() => {
    const dineIn = adminOrders.filter((o) => o.orderType === "table").length;
    const delivery = adminOrders.filter((o) => o.orderType === "delivery").length;
    const pickup = adminOrders.filter((o) => o.orderType === "pickup").length;
    return { total: adminOrders.length, dineIn, delivery, pickup };
  }, [adminOrders]);
  const [customerTab, setCustomerTab] = useState("menu");
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerOrdersBusy, setCustomerOrdersBusy] = useState(false);
  const [customerOrdersMsg, setCustomerOrdersMsg] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [tableFreeFilter, setTableFreeFilter] = useState("all");
  const [tableLocationFilter, setTableLocationFilter] = useState("all");
  const [tablePurposeFilter, setTablePurposeFilter] = useState("all");
  const [tableSeatsFilter, setTableSeatsFilter] = useState("all");
  const [customerReviews, setCustomerReviews] = useState([]);
  const [customerReviewsBusy, setCustomerReviewsBusy] = useState(false);
  const [customerReviewsMsg, setCustomerReviewsMsg] = useState("");
  const [customerPayments, setCustomerPayments] = useState([]);
  const [customerPaymentsBusy, setCustomerPaymentsBusy] = useState(false);
  const [customerPaymentsMsg, setCustomerPaymentsMsg] = useState("");
  const [customerPaymentsFilter, setCustomerPaymentsFilter] = useState("paid");
  const [customerPayingOrderId, setCustomerPayingOrderId] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [profileTab, setProfileTab] = useState("profile");

  const trendingDishes = useMemo(() => {
    const source = Array.isArray(trendingPool) && trendingPool.length ? trendingPool : dishes;
    const available = source.filter((dish) => dish?.isAvailable !== false);
    const trending = available.filter((dish) => dish?.isTrending);
    return trending.slice(0, 3);
  }, [trendingPool, dishes]);
  const menuCategories = useMemo(() => {
    const normalized = new Map();
    [...DEFAULT_DISH_CATEGORIES, ...(allMenuCategories || []), ...dishes.map((d) => d?.category)]
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .forEach((cat) => {
        const key = cat.toLowerCase();
        if (!normalized.has(key)) normalized.set(key, cat);
      });
    return Array.from(normalized.values()).sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, [allMenuCategories, dishes]);
  const filteredMenuDishes = useMemo(() => {
    const available = dishes.filter((dish) => dish?.isAvailable !== false);
    const query = String(menuSearchQuery || "").trim().toLowerCase();
    return available.filter((dish) => {
      const categoryMatch =
        menuCategoryFilter === "all" ||
        String(dish?.category || "").trim() === menuCategoryFilter;
      if (!categoryMatch) return false;
      if (!query) return true;
      const name = String(dish?.name || "").toLowerCase();
      const description = String(dish?.description || "").toLowerCase();
      const category = String(dish?.category || "").toLowerCase();
      return (
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [dishes, menuCategoryFilter, menuSearchQuery]);
  const categoryIconMap = {
    all: "apps-outline",
    pizza: "pizza-outline",
    burger: "fast-food-outline",
    "chicken fry": "drumstick-outline",
    noodles: "restaurant-outline",
    appetizer: "restaurant-outline",
    "main course": "restaurant-outline",
    dessert: "ice-cream-outline",
    beverage: "wine-outline",
    salad: "leaf-outline",
    soup: "water-outline",
    snack: "cafe-outline"
  };
  const getCategoryIcon = (category) => {
    const key = String(category || "").trim().toLowerCase();
    return categoryIconMap[key] || "restaurant-outline";
  };
  const adminDishCategoryOptions = useMemo(() => {
    const normalizedCategories = new Map();
    adminDishes.forEach((dish) => {
      const category = String(dish?.category || "").trim();
      if (!category) return;
      const normalized = category.toLowerCase();
      if (!normalizedCategories.has(normalized)) normalizedCategories.set(normalized, category);
    });
    DEFAULT_DISH_CATEGORIES.forEach((category) => {
      const normalized = category.toLowerCase();
      if (!normalizedCategories.has(normalized)) normalizedCategories.set(normalized, category);
    });
    return Array.from(normalizedCategories.values()).sort((a, b) => a.localeCompare(b));
  }, [adminDishes]);

  const customerPaymentEmail = useMemo(
    () => String(profile?.email || "").trim().toLowerCase(),
    [profile]
  );
  const savedCards = useMemo(
    () => (Array.isArray(profile?.savedCards) ? profile.savedCards : []),
    [profile]
  );
  const customerPaymentName = useMemo(() => {
    const name = `${profile?.firstname || ""} ${profile?.lastname || ""}`.trim();
    return name.toLowerCase();
  }, [profile]);
  const normalizeOrderType = (type) => String(type || "").toLowerCase().trim();
  const myPayments = useMemo(() => {
    if (!customerPayments.length) return [];
    return customerPayments.filter((payment) => {
      const paidBy = String(payment?.paidBy || "").toLowerCase();
      const customerName = String(
        payment?.customerName || payment?.orderId?.customerName || ""
      ).toLowerCase();
      if (customerPaymentEmail && paidBy === customerPaymentEmail) return true;
      if (customerPaymentName && customerName === customerPaymentName) return true;
      return false;
    });
  }, [customerPayments, customerPaymentEmail, customerPaymentName]);

  const filteredPayments = useMemo(() => {
    if (!myPayments.length) return [];
    return myPayments.filter((payment) => {
      const status = String(payment?.refundStatus || "none").toLowerCase();
      const isRefundFlow = status !== "none";
      if (customerPaymentsFilter === "refunds") return isRefundFlow;
      return !isRefundFlow;
    });
  }, [myPayments, customerPaymentsFilter]);
  const customerUnpaidOrders = useMemo(() => {
    if (!customerOrders.length) return [];
    return customerOrders.filter((order) => {
      const paymentStatus = String(order?.paymentStatus || "unpaid").toLowerCase();
      const orderStatus = String(order?.status || "").toLowerCase();
      return paymentStatus !== "paid" && orderStatus !== "cancelled";
    });
  }, [customerOrders]);
  const filteredCustomerOrders = useMemo(() => {
    if (!customerOrders.length) return [];
    if (orderStatusFilter === "all") return customerOrders;
    return customerOrders.filter(
      (order) => String(order?.status || "").toLowerCase() === orderStatusFilter
    );
  }, [customerOrders, orderStatusFilter]);
  const customerTableBookings = useMemo(() => {
    const emailValue = String(profile?.email || "").trim().toLowerCase();
    if (!emailValue) return [];
    return customerOrders.filter((order) => {
      if (normalizeOrderType(order?.orderType) !== "table") return false;
      return String(order?.createdBy || "").toLowerCase() === emailValue;
    });
  }, [customerOrders, profile]);

  const isAdminRole = role === "admin";
  const isStaffRole = ["manager", "cashier", "staff"].includes(role);
  const roleLabel = isAdminRole ? "Admin" : isStaffRole ? "Staff" : "Customer";
  const isDark = appTheme === "dark";
  const isAdminDark = false;
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const authTitle =
    loginScope === "admin"
      ? "Admin Login"
      : authMode === "login"
        ? "Welcome Back"
        : "Create Account";

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cart]
  );
  const customerDisplayName = useMemo(() => {
    const name = `${profile?.firstname || ""} ${profile?.lastname || ""}`.trim();
    return name || profile?.email || "Customer";
  }, [profile]);

  const RESERVATION_WINDOW_MINUTES = 60;

  const formatTimeInput = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
    if (!digits) return "";
    if (digits.length <= 2) return digits.length === 2 ? `${digits}:` : digits;
    if (digits.length === 3) return `${digits.slice(0, 1)}:${digits.slice(1)}`;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };

  const getDefaultDateTimeParts = () => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
    const hours24 = now.getHours();
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const time = `${String(hours12).padStart(2, "0")}:${minutes}`;
    return { date, time, suffix };
  };

  const buildReservationLabel = (dateValue, timeValue, suffixValue) => {
    const datePart = String(dateValue || "").trim();
    const timePartRaw = String(timeValue || "").trim().replace(/:$/, "");
    if (!datePart && !timePartRaw) return "";
    const suffix = String(suffixValue || "").trim();
    const timePart = timePartRaw
      ? `${timePartRaw}${suffix ? ` ${suffix}` : ""}`.trim()
      : "";
    if (datePart && timePart) return `${datePart} ${timePart}`;
    return datePart || timePart;
  };

  const parseTimeLabel = (value) => {
    const match = String(value || "").trim().match(/(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])/);
    if (!match) return null;
    const hourRaw = Number.parseInt(match[1], 10);
    const minuteRaw = Number.parseInt(match[2] || "0", 10);
    if (!Number.isFinite(hourRaw) || hourRaw < 1 || hourRaw > 12) return null;
    if (!Number.isFinite(minuteRaw) || minuteRaw < 0 || minuteRaw > 59) return null;
    const suffix = String(match[3] || "").toUpperCase();
    const hours24 =
      suffix === "PM"
        ? (hourRaw % 12) + 12
        : hourRaw % 12;
    return { hours24, minutes: minuteRaw };
  };

  const getReservationWindowFromParts = (dateValue, timeValue) => {
    const datePart = String(dateValue || "").trim();
    const timePart = String(timeValue || "").trim();
    if (!datePart || !timePart) return null;
    const baseDate = new Date(`${datePart}T00:00:00`);
    if (Number.isNaN(baseDate.getTime())) return null;
    const timeParts = parseTimeLabel(timePart);
    if (!timeParts) return null;
    const start = new Date(baseDate);
    start.setHours(timeParts.hours24, timeParts.minutes, 0, 0);
    const end = new Date(start.getTime() + RESERVATION_WINDOW_MINUTES * 60 * 1000);
    return { start, end, datePart };
  };

  const getReservationWindowFromLabel = (label) => {
    const raw = String(label || "");
    const dateMatch = raw.match(/(\d{4}-\d{2}-\d{2})/);
    const timeMatch = raw.match(/(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])/);
    if (!timeMatch) return null;
    const datePart = dateMatch ? dateMatch[1] : "";
    if (!datePart) return null;
    const timePart = `${timeMatch[1]}:${String(timeMatch[2] || "0").padStart(2, "0")} ${timeMatch[3]}`;
    return getReservationWindowFromParts(datePart, timePart);
  };

  const getReservationWindowFromOrder = (order) => {
    if (!order) return null;
    const fromParts = getReservationWindowFromParts(order.reservationDate, order.reservationTime);
    if (fromParts) return fromParts;
    return getReservationWindowFromLabel(order.timeSlotLabel || "");
  };

  const isWindowOverlap = (a, b) => {
    if (!a || !b) return false;
    return a.start < b.end && b.start < a.end;
  };

  const formatTimeLabel = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${suffix}`;
  };

  const formatReservationRange = (order) => {
    const window = getReservationWindowFromOrder(order);
    if (!window) return order?.timeSlotLabel || "-";
    const dateText = window.start.toLocaleDateString();
    return `${dateText} ${formatTimeLabel(window.start)} - ${formatTimeLabel(window.end)}`;
  };

  const isReservationActiveNow = (order) => {
    const window = getReservationWindowFromOrder(order);
    if (!window) return true;
    const now = new Date();
    return now >= window.start && now < window.end;
  };

  const getUsedSeats = (table, slotLabel) => {
    const tableId = String(table?._id || table?.tableNo || "");
    const overallUsage = Number(tableSeatUsage?.[tableId] || 0);
    const rawSlot = String(slotLabel || "").trim();
    const normalizedSlot = rawSlot.toUpperCase();
    if (normalizedSlot) {
      const selectedWindow = getReservationWindowFromLabel(rawSlot);
      const slotEntries = tableSeatUsageBySlot?.[tableId] || {};
      if (selectedWindow) {
        return Object.entries(slotEntries).reduce((sum, [label, count]) => {
          const window = getReservationWindowFromLabel(label);
          if (window && isWindowOverlap(selectedWindow, window)) {
            return sum + Number(count || 0);
          }
          if (!window && String(label || "").trim().toUpperCase() === normalizedSlot) {
            return sum + Number(count || 0);
          }
          return sum;
        }, 0);
      }
      return Number(slotEntries?.[normalizedSlot] || 0);
    }
    return overallUsage;
  };
  const availableTables = useMemo(() => {
    const hasSlot = Boolean(String(timeSlotLabel || "").trim());
    return tables
      .map((table) => {
        const usedSeats = hasSlot ? getUsedSeats(table, timeSlotLabel) : 0;
        const totalSeats = Number(table?.seats || 0);
        const remainingSeats = Math.max(totalSeats - usedSeats, 0);
        return { ...table, remainingSeats };
      })
      .filter((table) => table.isAvailable && table.remainingSeats > 0);
  }, [tables, tableSeatUsage, tableSeatUsageBySlot, timeSlotLabel]);
  const selectedTable = useMemo(() => {
    if (!selectedTableId) return null;
    return tables.find((table) => String(table?._id || table?.tableNo || "") === String(selectedTableId));
  }, [tables, selectedTableId]);
  const selectedTableRemainingSeats = useMemo(() => {
    if (!selectedTable) return null;
    const usedSeats = getUsedSeats(selectedTable, timeSlotLabel);
    const totalSeats = Number(selectedTable?.seats || 0);
    return Math.max(totalSeats - usedSeats, 0);
  }, [selectedTable, tableSeatUsage, tableSeatUsageBySlot, timeSlotLabel]);
  const seatCountOptions = useMemo(() => {
    const allowed = [1, 2, 3, 4, 6, 8];
    const cap = Number.isFinite(Number(selectedTableRemainingSeats))
      ? Number(selectedTableRemainingSeats)
      : Number.POSITIVE_INFINITY;
    return allowed.filter((value) => value <= cap);
  }, [selectedTableRemainingSeats]);

  const filteredManualTables = useMemo(() => {
    if (!adminBookingLocation && !adminBookingPurpose) return availableTables;
    const locationNeedle = String(adminBookingLocation || "").trim().toLowerCase();
    const purposeNeedle = String(adminBookingPurpose || "").trim().toLowerCase();
    return availableTables.filter((table) => {
      const location = String(table.location || "").toLowerCase();
      const purpose = String(table.purpose || "").toLowerCase();
      if (locationNeedle && !location.includes(locationNeedle)) return false;
      if (purposeNeedle && !purpose.includes(purposeNeedle)) return false;
      return true;
    });
  }, [availableTables, adminBookingLocation, adminBookingPurpose]);

  const tableLocations = useMemo(() => {
    const locations = tables.map((table) => String(table.location || "").trim()).filter(Boolean);
    return [...new Set(locations)];
  }, [tables]);

  const tablePurposes = useMemo(() => {
    const purposes = tables.map((table) => String(table.purpose || "").trim()).filter(Boolean);
    return [...new Set(purposes)];
  }, [tables]);
  const tableSeatsOptions = useMemo(() => {
    const seats = tables
      .map((table) => Number(table?.seats || 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    return [...new Set(seats)].sort((a, b) => a - b);
  }, [tables]);
  const getRemainingSeats = (table) => {
    const usedSeats =
      seatSearchActive && String(timeSlotLabel || "").trim()
        ? getUsedSeats(table, timeSlotLabel)
        : getUsedSeats(table);
    const totalSeats = Number(table?.seats || 0);
    return Math.max(totalSeats - usedSeats, 0);
  };
  const liveSeatDefaults = getDefaultDateTimeParts();
  const liveSeatSlotLabel = String(
    buildReservationLabel(liveSeatDefaults.date, liveSeatDefaults.time, liveSeatDefaults.suffix)
  )
    .trim()
    .toUpperCase();
  const getLiveRemainingSeats = (table) => {
    const totalSeats = Number(table?.seats || 0);
    const usedSeats = liveSeatSlotLabel ? getUsedSeats(table, liveSeatSlotLabel) : getUsedSeats(table);
    return Math.max(totalSeats - usedSeats, 0);
  };
  const getTableStatus = (remainingSeats, totalSeats) => {
    if (remainingSeats <= 0) return "booked";
    if (remainingSeats >= totalSeats) return "free";
    return "pending";
  };
  const resolveStatusColor = (status) => {
    if (status === "free") return "#00B894";
    if (status === "pending") return "#FDCB6E";
    return "#D63031";
  };
  const getGroupSummary = (purpose, location) => {
    const group = (tables || []).filter((table) => {
      const purposeMatch = String(table.purpose || "").toLowerCase() === String(purpose).toLowerCase();
      const locationMatch = String(table.location || "").toLowerCase() === String(location).toLowerCase();
      return purposeMatch && locationMatch;
    });
    const counts = { free: 0, pending: 0, booked: 0 };
    group.forEach((table) => {
      const totalSeats = Number(table?.seats || 0);
      const remaining = table?.isAvailable ? getLiveRemainingSeats(table) : 0;
      const status = getTableStatus(remaining, totalSeats);
      counts[status] += 1;
    });
    const status = counts.free > 0 ? "free" : counts.pending > 0 ? "pending" : "booked";
    return { count: group.length, ...counts, status };
  };
  const filteredTables = useMemo(() => {
    if (!tables.length) return [];
    return tables.filter((table) => {
      const remaining = getRemainingSeats(table);
      const isOpen = table.isAvailable && remaining > 0;
      if (tableFreeFilter === "free" && !isOpen) return false;
      if (tableFreeFilter === "full" && isOpen) return false;
      if (tableLocationFilter !== "all" && table.location !== tableLocationFilter) return false;
      if (tablePurposeFilter !== "all" && table.purpose !== tablePurposeFilter) return false;
      if (tableSeatsFilter !== "all" && Number(table.seats) !== Number(tableSeatsFilter)) return false;
      return true;
    });
  }, [
    tables,
    tableSeatUsage,
    tableSeatUsageBySlot,
    seatSearchActive,
    timeSlotLabel,
    tableFreeFilter,
    tableLocationFilter,
    tablePurposeFilter,
    tableSeatsFilter
  ]);

  const keepLetters = (value) => String(value || "").replace(/[^A-Za-z\s]/g, "");
  const normalizeNic = (value) => String(value || "").replace(/[^0-9VvXx]/g, "").toUpperCase();

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  };

  const formatOrderType = (type) => {
    const normalized = String(type || "").toLowerCase();
    if (normalized === "table") return "Dine In";
    if (normalized === "delivery") return "Delivery";
    if (normalized === "pickup") return "Pickup";
    return normalized || "-";
  };
  const manualBookingMode = isAdminRole && adminTab === "tables" && orderType === "table";
  const isSeatMapManualBooking = reservationOnly && !isAdminRole && orderType === "table";
  const DELIVERY_FEE = 250;
  const orderSubtotal = manualBookingMode || isSeatMapManualBooking ? DELIVERY_FEE : cartTotal;
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const orderFee = deliveryFee;
  const orderTotal = orderSubtotal + orderFee;
  const manualBookingTotal = DELIVERY_FEE;
  const cardBrandOptions = ["Visa", "Mastercard", "Amex", "Discover", "UnionPay", "Other"];

  const formatCardNumber = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(" ");
  };

  const isCardFormComplete =
    String(cardForm.cardHolderName || "").trim() &&
    String(cardForm.brand || "").trim() &&
    String(cardForm.cardNumber || "").trim() &&
    String(cardForm.expiryMonth || "").trim() &&
    String(cardForm.expiryYear || "").trim();

  useEffect(() => {
    const requiresCard =
      orderType === "delivery" || isSeatMapManualBooking;
    if (!requiresCard) return;
    if (paymentMethod !== "card") {
      setPaymentMethod("card");
    }
  }, [orderType, paymentMethod, isAdminRole, isSeatMapManualBooking]);

  useEffect(() => {
    if (!isAdminRole) return;
    if (orderType === "delivery") {
      setOrderType("pickup");
    }
  }, [isAdminRole, orderType]);

  function normalizeTimeSlotLabel(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const match = raw.match(/^(.*?)(\d{1,2})(?::(\d{1,2}))?\s*([AaPp][Mm])$/);
    if (!match) return raw;
    const prefix = String(match[1] || "").trim();
    const hour = Number.parseInt(match[2], 10);
    const minute = match[3] ? Number.parseInt(match[3], 10) : 0;
    if (!Number.isFinite(hour) || hour < 1 || hour > 12) return raw;
    if (!Number.isFinite(minute) || minute < 0 || minute > 59) return raw;
    const minuteLabel = String(minute).padStart(2, "0");
    const suffix = String(match[4] || "").toUpperCase();
    const timeLabel = `${hour}:${minuteLabel} ${suffix}`;
    return prefix ? `${prefix} ${timeLabel}` : timeLabel;
  }

  const applySeatSearch = () => {
    if (!bookingDate || !bookingTime) {
      setSeatSearchError("Select booking date and time to search availability.");
      return;
    }
    const nextLabel = buildReservationLabel(bookingDate, bookingTime, bookingSuffix);
    setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
    setSeatSearchActive(true);
    setSeatSearchError("");
    setTableFreeFilter("free");
  };



  const activeCustomerTableBookings = useMemo(() => {
    const now = new Date();
    return customerTableBookings.filter((order) => {
      const status = String(order?.status || "").toLowerCase();
      if (["cancelled", "delivered", "served"].includes(status)) return false;
      const window = getReservationWindowFromOrder(order);
      if (!window) return true;
      return now < window.end;
    });
  }, [customerTableBookings]);

  const updateCartQuantity = (dishId, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.dishId === dishId
            ? { ...item, quantity: Math.max(0, Number(item.quantity || 0) + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addToCart = (dish, options = {}) => {
    const isTemp = options.temporary === true;
    const isPersistent = options.persistent === true;
    setCart((current) => {
      const existing = current.find((item) => item.dishId === dish._id);
      if (existing) {
        return current.map((item) => {
          if (item.dishId !== dish._id) return item;
          const nextQuantity = Number(item.quantity || 0) + 1;
          if (isPersistent && item.temp) {
            return { ...item, quantity: nextQuantity, temp: false };
          }
          return { ...item, quantity: nextQuantity };
        });
      }
      return [
        ...current,
        {
          dishId: dish._id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          temp: isTemp && !isPersistent
        }
      ];
    });
  };
  const getCartQuantity = (dishId) =>
    Number(cart.find((item) => item.dishId === dishId)?.quantity || 0);
  const getDishImageUri = (dish) =>
    dish?.imageUrl || dish?.image || dish?.photo || dish?.thumbnail || dish?.imageUri || "";
  const openOrderModal = (dish, type) => {
    setSelectedDish(dish || null);
    if (dish) {
      addToCart(dish, { temporary: true });
    }
    if (type) setOrderType(type);
    setReservationOnly(false);
    setOrderMessage("");
    setOrderModalVisible(true);
  };
  const closeOrderModal = () => {
    setOrderModalVisible(false);
    setSelectedDish(null);
    setCart((current) => current.filter((item) => !item.temp));
    setReservationOnly(false);
    setCustomerName("");
    setPhone("");
    setDeliveryAddress("");
  };
  const persistCartItem = (dish) => {
    if (!dish?._id) return;
    setCart((current) => {
      const existing = current.find((item) => item.dishId === dish._id);
      if (!existing) {
        return [
          ...current,
          {
            dishId: dish._id,
            name: dish.name,
            price: dish.price,
            quantity: 1,
            temp: false
          }
        ];
      }
      return current.map((item) =>
        item.dishId === dish._id ? { ...item, temp: false } : item
      );
    });
  };
  const openReviewModal = (dish) => {
    setReviewMsg("");
    setReviewForm({
      dishId: String(dish?._id || ""),
      dishName: dish?.name || "",
      reviewerName: "",
      rating: "0",
      comment: ""
    });
    setReviewModalVisible(true);
  };

  const getOrderActions = (order) => {
    const status = String(order?.status || "New");
    const orderTypeValue = String(order?.orderType || "").toLowerCase();
    if (status === "New") return [{ label: "Prepare", status: "Preparing" }];
    if (status === "Preparing") return [{ label: "Ready", status: "Ready" }];
    if (status === "Ready") {
      return [
        {
          label: orderTypeValue === "delivery" ? "Deliver" : "Serve",
          status: orderTypeValue === "delivery" ? "Delivered" : "Served"
        }
      ];
    }
    return [];
  };

  const resolveTableLocation = (order) => {
    const tableId = String(order?.tableId?._id || order?.tableId || "");
    const table = adminTables.find((row) => String(row._id) === tableId);
    if (!table) return "Unknown";
    return `${table.location || "-"} - ${table.purpose || "-"}`;
  };

  const resolveRole = (user) => {
    const roleValue = String(user?.role || "").toLowerCase();
    if (roleValue) return roleValue;
    if (user?.isAdmin) return "admin";
    if (user?.isStaff) return "staff";
    return "customer";
  };
  const toggleAdminTableDropdown = (key) => {
    setAdminTableDropdown((current) => ({
      seats: key === "seats" ? !current.seats : false,
      location: key === "location" ? !current.location : false,
      purpose: key === "purpose" ? !current.purpose : false
    }));
  };
  const toggleAdminBookingDropdown = (key) => {
    setAdminBookingDropdown((current) => ({
      location: key === "location" ? !current.location : false,
      purpose: key === "purpose" ? !current.purpose : false
    }));
  };

  const renderCustomerHeader = (title, subtitle) => (
    <View style={styles.heroBlock}>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </View>
  );
  const renderOrderInfoRow = (iconName, text, key) => (
    <View key={key} style={styles.staffOrderInfoRow}>
      <View style={styles.staffOrderInfoIconWrap}>
        <Ionicons name={iconName} size={12} color={theme.accent} />
      </View>
      <Text style={styles.staffOrderInfoText}>{text}</Text>
    </View>
  );
  const getTableChipDetails = (table) => {
    const remainingSeats = Number.isFinite(Number(table?.remainingSeats))
      ? Number(table.remainingSeats)
      : getRemainingSeats(table);
    const totalSeats = Number(table?.seats || 0);
    const location = String(table?.location || "-").toUpperCase();
    const purpose = String(table?.purpose || "-").toUpperCase();
    return { remainingSeats, totalSeats, location, purpose };
  };

  const renderTableSelectionRows = (tables, labelStyle) => {
    const rows = [
      { key: "family", label: "Family Tables" },
      { key: "vip", label: "VIP Tables" }
    ];
    return rows.map((row) => {
      const rowTables = (tables || []).filter(
        (table) => String(table?.purpose || "").toLowerCase() === row.key
      );
      return (
        <View key={row.key}>
          <Text style={labelStyle}>{row.label}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tableRow}
          >
            {rowTables.length ? (
              rowTables.map((table) => {
                const details = getTableChipDetails(table);
                return (
                  <TouchableOpacity
                    key={String(table._id)}
                    style={[
                      styles.tableChip,
                      String(selectedTableId) === String(table._id) && styles.tableChipActive
                    ]}
                    onPress={() => setSelectedTableId(String(table._id))}
                  >
                    <Text style={styles.tableChipTitle}>
                      {table.tableNo || table.name || "Table"}
                    </Text>
                    <Text style={styles.tableChipMeta}>
                      Free {details.remainingSeats}/{details.totalSeats} seats
                    </Text>
                    <Text style={styles.tableChipMeta}>
                      {details.location} • {details.purpose}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.helperText}>No {row.label.toLowerCase()} available.</Text>
            )}
          </ScrollView>
        </View>
      );
    });
  };

  const renderCustomerTopbar = () => (
    <>
      <View style={[styles.topbarFixed, isDark && styles.topbarFixedDark]}>
        <View style={styles.topbar}>
          <View style={styles.topbarLeft}>
            <TouchableOpacity
              style={styles.heroSidebarToggle}
              onPress={() => setCustomerDrawerOpen(true)}
            >
              <Ionicons name="menu" size={18} color={theme.accent} />
            </TouchableOpacity>
            <View>
              <Text style={styles.heroTitle}>{customerDisplayName}</Text>
              <Text style={styles.helperText}>Welcome back</Text>
            </View>
          </View>
          <View style={styles.topbarRight}>
            <TouchableOpacity
              style={styles.cartIconButton}
              onPress={() => setOrderModalVisible(true)}
            >
              <Text style={styles.cartIconText}>Cart</Text>
              {cartCount ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
              <Text style={styles.dangerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.topbarSpacer} />
    </>
  );
  const renderDishImage = (dish) => {
    const uri =
      dish?.imageUrl ||
      dish?.image ||
      dish?.photo ||
      dish?.thumbnail ||
      dish?.imageUri;
    if (!uri) {
      return (
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.cardImageText}>No image</Text>
        </View>
      );
    }
    return <Image source={{ uri }} style={styles.cardImage} />;
  };

  const renderTrendingCard = (dish) => (
    <View key={String(dish?._id || dish?.name || Math.random())} style={styles.trendingCard}>
      <View style={styles.trendingTopGlow} />
      {renderDishImage(dish)}
      <View style={styles.trendingBody}>
        <View style={styles.trendingHeaderRow}>
          <Text style={styles.trendingTitle}>{dish?.name || "Dish"}</Text>
          <View style={styles.trendingHotBadge}>
            <Text style={styles.trendingHotBadgeText}>HOT</Text>
          </View>
        </View>
        <View style={styles.trendingMetaRow}>
          <View style={styles.trendingChip}>
            <Text style={styles.trendingChipText}>{dish?.category || "General"}</Text>
          </View>
          <View style={styles.trendingChip}>
            <Text style={styles.trendingChipText}>Prep {dish?.prepTimeMin || 0}m</Text>
          </View>
          <View style={styles.trendingChipPrice}>
            <Text style={styles.trendingChipPriceText}>LKR {Number(dish?.price || 0).toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.orderMiniButton} onPress={() => openOrderModal(dish, "table")}>
          <Text style={styles.orderMiniText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCustomerBottomNav = () => (
    <View style={styles.bottomNavWrap}>
      <View style={styles.bottomNav}>
        {[
          { key: "menu", label: "Home", icon: "home-outline", activeIcon: "home" },
          { key: "orders", label: "My Orders", icon: "receipt-outline", activeIcon: "receipt" },
          { key: "tables", label: "Seat Map", icon: "grid-outline", activeIcon: "grid", isCenter: true },
          { key: "profile", label: "My Profile", icon: "person-outline", activeIcon: "person" }
        ].map((item) => {
          const isActive = customerTab === item.key;
          const iconName = isActive ? item.activeIcon : item.icon;
          const itemStyle = item.isCenter ? styles.bottomNavItemCenter : styles.bottomNavItem;
          return (
            <TouchableOpacity
              key={item.key}
              style={itemStyle}
              onPress={() => setCustomerTab(item.key)}
            >
              <Ionicons name={iconName} size={18} color={isActive ? "#6C5CE7" : "#A7B0BE"} />
              <Text style={[styles.bottomNavText, isActive && styles.bottomNavTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setAuthBusy(true);
    setError("");
    setInfo("");
    try {
      const path = loginScope === "admin" ? "/login/admin" : "/login";
      const response = await apiFetch(path, {
        method: "POST",
        body: { email, password }
      });
      const newToken = response?.token;
      if (!newToken) throw new Error("Login failed. Token missing.");
      await saveToken(newToken);
      setToken(newToken);
      setPassword("");
      setConfirmPassword("");
      setAuthMode("login");
      setLoginScope("customer");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }
    setAuthBusy(true);
    setError("");
    setInfo("");
    try {
      await apiFetch("/register", {
        method: "POST",
        body: {
          email,
          password,
          confirmPassword,
          firstname: firstName,
          lastname: lastName,
          dateOfBirth,
          hometown,
          telephoneNumber,
          nicNumber,
          gender,
          address
        }
      });
      setInfo("Registration successful. Please log in.");
      setAuthMode("login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    await clearToken();
    setToken(null);
    setRole("customer");
    setRoleReady(false);
    setProfile(null);
    setCart([]);
    setCustomerOrders([]);
    setCustomerReviews([]);
    setCustomerPayments([]);
  };

  const loadCatalog = async (options = {}) => {
    if (!token) return;
    const requestedPage = Math.max(
      1,
      Number.parseInt(String(options?.page ?? dishPage), 10) || 1
    );
    const activeCategory = String(options?.category ?? menuCategoryFilter).trim();
    const categoryParam = activeCategory && activeCategory !== "all"
      ? `&category=${encodeURIComponent(activeCategory)}`
      : "";
    setCatalogBusy(true);
    try {
      const [catalogResponse, publicDishesResponse] = await Promise.all([
        apiFetch(
          `/catalog?scope=user&includeSeatUsage=true&includeDishTotal=true&dishLimit=${DISHES_PER_PAGE}&dishPage=${requestedPage}${categoryParam}`,
          { token }
        ),
        apiFetch("/dishes/public")
      ]);
      setDishes(catalogResponse?.dishes || []);
      setAllMenuCategories(catalogResponse?.dishCategories || []);
      setDishPage(Number(catalogResponse?.dishPagination?.page || requestedPage));
      setDishTotalPages(Math.max(1, Number(catalogResponse?.dishPagination?.totalPages || 1)));
      setTables(catalogResponse?.tables || []);
      setTableSeatUsage(catalogResponse?.tableSeatUsage || {});
      setTableSeatUsageBySlot(catalogResponse?.tableSeatUsageBySlot || {});
      setTrendingPool(publicDishesResponse?.dishes || []);
    } catch (err) {
      setError(err.message || "Failed to load catalog.");
    } finally {
      setCatalogBusy(false);
    }
  };

  const loadCustomerOrders = async () => {
    if (!token) return;
    setCustomerOrdersBusy(true);
    setCustomerOrdersMsg("");
    try {
      const response = await apiFetch("/orders", { token });
      const orders = response?.orders || [];
      let emailValue = String(profile?.email || "").toLowerCase();
      if (!emailValue) {
        try {
          const meResponse = await apiFetch("/me", { token });
          emailValue = String(meResponse?.user?.email || meResponse?.email || "").toLowerCase();
        } catch {
          emailValue = "";
        }
      }
      const filtered = emailValue
        ? orders.filter((order) => String(order.createdBy || "").toLowerCase() === emailValue)
        : [];
      setCustomerOrders(filtered);
    } catch (err) {
      setCustomerOrdersMsg(err.message || "Failed to load orders.");
    } finally {
      setCustomerOrdersBusy(false);
    }
  };

  const loadCustomerReviews = async () => {
    if (!token) return;
    setCustomerReviewsBusy(true);
    setCustomerReviewsMsg("");
    try {
      const response = await apiFetch("/reviews", { token });
      setCustomerReviews(response?.reviews || []);
    } catch (err) {
      setCustomerReviewsMsg(err.message || "Failed to load reviews.");
    } finally {
      setCustomerReviewsBusy(false);
    }
  };

  const loadCustomerPayments = async () => {
    if (!token) return;
    setCustomerPaymentsBusy(true);
    setCustomerPaymentsMsg("");
    try {
      const response = await apiFetch("/payments/list", { token });
      setCustomerPayments(response?.payments || []);
    } catch (err) {
      setCustomerPaymentsMsg(err.message || "Failed to load payments.");
    } finally {
      setCustomerPaymentsBusy(false);
    }
  };

  const loadStaffOrders = async () => {
    if (!token) return;
    setStaffOrdersBusy(true);
    setStaffOrdersMsg("");
    try {
      const response = await apiFetch("/orders", { token });
      setStaffOrders(response?.orders || []);
    } catch (err) {
      setStaffOrdersMsg(err.message || "Failed to load orders.");
    } finally {
      setStaffOrdersBusy(false);
    }
  };

  const loadAdminOrders = async () => {
    if (!token) return;
    setAdminOrdersBusy(true);
    setAdminOrdersMsg("");
    try {
      const response = await apiFetch("/orders", { token });
      setAdminOrders(response?.orders || []);
    } catch (err) {
      setAdminOrdersMsg(err.message || "Failed to load orders.");
    } finally {
      setAdminOrdersBusy(false);
    }
  };

  const loadAdminTableReservations = async () => {
    if (!token) return;
    setAdminTableReservationsBusy(true);
    try {
      const response = await apiFetch("/admin/table-reservations", { token });
      setAdminTableReservations(response?.reservations || []);
    } catch (err) {
      // silently fail � not critical
    } finally {
      setAdminTableReservationsBusy(false);
    }
  };

  const loadAdminPayments = async () => {
    if (!token) return;
    setAdminPaymentsBusy(true);
    setAdminPaymentsMsg("");
    try {
      const response = await apiFetch("/payments/list", { token });
      setAdminPayments(response?.payments || []);
    } catch (err) {
      setAdminPaymentsMsg(err.message || "Failed to load payments.");
    } finally {
      setAdminPaymentsBusy(false);
    }
  };

  const reviewRefundRequest = async (paymentId, action) => {
    if (!token) return;
    await apiFetch(`/payments/${paymentId}/refund-review`, {
      method: "PATCH",
      token,
      body: { action }
    });
    loadAdminPayments();
  };

  const directRefundPayment = async (paymentId) => {
    if (!token) return;
    await apiFetch(`/payments/${paymentId}/refund-direct`, {
      method: "PATCH",
      token
    });
    loadAdminPayments();
  };

  const updateAdminOrderStatus = async (orderId, status) => {
    if (!token) return;
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status },
        token
      });
      loadAdminOrders();
    } catch (err) {
      setAdminOrdersMsg(err.message || "Failed to update order.");
    }
  };

  const markAdminOrderPaid = async (orderId) => {
    if (!token) return;
    try {
      await apiFetch(`/orders/${orderId}/pay`, { method: "PATCH", token });
      loadAdminOrders();
    } catch (err) {
      setAdminOrdersMsg(err.message || "Failed to mark paid.");
    }
  };

  const changeDishPage = async (nextPage) => {
    menuListRef.current?.scrollToOffset({ offset: 0, animated: true });
    await loadCatalog({ page: nextPage });
  };

  const handleMenuCategorySelect = async (category, index = 0) => {
    const nextCategory = String(category || "all");
    setMenuCategoryFilter(nextCategory);
    menuCategoryRowRef.current?.scrollTo({
      x: Math.max(0, index * 120 - 80),
      animated: true
    });
    menuListRef.current?.scrollToOffset({ offset: 0, animated: true });
    await loadCatalog({ page: 1, category: nextCategory });
  };

  const payCustomerOrder = async (orderId) => {
    if (!token || !orderId) return;
    setCustomerPayingOrderId(String(orderId));
    setCustomerPaymentsMsg("");
    try {
      await apiFetch(`/orders/${orderId}/pay`, { method: "PATCH", token });
      await Promise.all([loadCustomerOrders(), loadCustomerPayments()]);
      setCustomerPaymentsMsg("Payment completed.");
    } catch (err) {
      setCustomerPaymentsMsg(err.message || "Failed to process payment.");
    } finally {
      setCustomerPayingOrderId("");
    }
  };

  const createAdminPayment = async ({
    orderId,
    paymentMethod,
    taxPercent,
    offerType,
    offerValue
  }) => {
    if (!token) return;
    try {
      await apiFetch("/payments", {
        method: "POST",
        token,
        body: {
          orderId,
          paymentMethod,
          taxPercent,
          offerType,
          offerValue
        }
      });
      loadAdminOrders();
      loadAdminPayments();
      loadCustomerPayments();
    } catch (err) {
      setAdminOrdersMsg(err.message || "Failed to create payment.");
      throw err;
    }
  };

  const cancelAdminOrder = async (orderId) => {
    if (!token) return;
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: "PATCH", token });
      loadAdminOrders();
      loadAdminTableReservations();
    } catch (err) {
      setAdminOrdersMsg(err.message || "Failed to cancel order.");
    }
  };

  const cancelCustomerOrder = async (orderId) => {
    if (!token) return;
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: "PATCH", token });
      loadCustomerOrders();
      loadCatalog();
    } catch (err) {
      setCustomerOrdersMsg(err.message || "Failed to cancel order.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!token || orderBusy) return;
    const normalizedCustomerName = String(customerName || "").trim();
    const normalizedPhone = String(phone || "").replace(/\D/g, "");
    if (!normalizedCustomerName) {
      setError("Customer name is required.");
      return;
    }
    if (!/^\d{10}$/.test(normalizedPhone)) {
      setError("Customer phone must be exactly 10 digits.");
      return;
    }
    if (manualBookingMode) {
      if (!selectedTableId) {
        setError("Select a table for booking.");
        return;
      }
      if (!seatCount) {
        setError("Select seat count.");
        return;
      }
      if (!adminBookingDate || !adminBookingTime) {
        setError("Booking date and time are required.");
        return;
      }
    } else if (!bookingDate || !bookingTime) {
      setError("Booking date and time are required.");
      return;
    }
    if (orderType === "delivery" || isSeatMapManualBooking) {
      if (paymentMethod !== "card") {
        setError(
          orderType === "delivery"
            ? "Card payment is required for delivery."
            : "Card payment is required for table booking."
        );
        return;
      }
      if (useSavedCard) {
        if (!selectedCardId) {
          setError(
            orderType === "delivery"
              ? "Select a saved card for delivery."
              : "Select a saved card for table booking."
          );
          return;
        }
      } else if (!isCardFormComplete) {
        setError(
          orderType === "delivery"
            ? "Enter card details for delivery."
            : "Enter card details for table booking."
        );
        return;
      }
    }
    if (!cart.length) {
      if (
        !(isAdminRole && adminTab === "tables" && orderType === "table") &&
        !(reservationOnly && orderType === "table") &&
        !(orderType === "table")
      ) {
        setError("Add at least one item.");
        return;
      }
    }
    setOrderBusy(true);
    setError("");
    setOrderMessage("");
      try {
        const manualTimeSlot = buildReservationLabel(
          adminBookingDate,
          adminBookingTime,
          adminBookingSuffix
        );
        const customerTimeSlot = buildReservationLabel(
          bookingDate,
          bookingTime,
          bookingSuffix
        );
        const rawTimeSlot = manualBookingMode ? manualTimeSlot : customerTimeSlot;
        const normalizedTimeSlot = normalizeTimeSlotLabel(rawTimeSlot);
        if (normalizedTimeSlot !== timeSlotLabel) {
          setTimeSlotLabel(normalizedTimeSlot);
        }
        const reservationDateValue = manualBookingMode ? adminBookingDate : bookingDate;
        const cleanAdminTime = String(adminBookingTime || "").trim().replace(/:$/, "");
        const cleanBookingTime = String(bookingTime || "").trim().replace(/:$/, "");
        const reservationTimeValue = manualBookingMode
          ? `${cleanAdminTime} ${adminBookingSuffix}`.trim()
          : `${cleanBookingTime} ${bookingSuffix}`.trim();
        const reservationWindow = getReservationWindowFromParts(
          reservationDateValue,
          reservationTimeValue
        );
        const reservationStartDate = reservationWindow?.start || null;
        const reservationStart = reservationStartDate
          ? reservationStartDate.toISOString()
          : undefined;
        const reservationDatePayload = reservationStartDate
          ? reservationStartDate.toISOString().split("T")[0]
          : reservationDateValue || undefined;
        const reservationTimePayload = reservationStartDate
          ? `${String(reservationStartDate.getHours()).padStart(2, "0")}:${String(reservationStartDate.getMinutes()).padStart(2, "0")}`
          : undefined;
        if (isAdminRole && adminTab === "tables" && orderType === "table") {
          const manualResponse = await apiFetch("/admin/table-reservations", {
            method: "POST",
            token,
            body: {
              tableId: selectedTableId,
              tableNumber: selectedTable?.tableNo || selectedTable?.name || "",
              seatCount,
              customerName: normalizedCustomerName,
              phone: normalizedPhone,
              timeSlotLabel: normalizedTimeSlot,
              bookingDate: adminBookingDate || undefined,
              bookingTime: `${cleanAdminTime} ${adminBookingSuffix}`.trim() || undefined,
              reservationDate: reservationDatePayload,
              reservationTime: reservationTimePayload,
              reservationStart
            }
          });
          const createdReservation = manualResponse?.reservation || manualResponse?.order;
          if (createdReservation) {
            setAdminTableReservations((current) => {
              const safe = Array.isArray(current) ? current : [];
              return [
                createdReservation,
                ...safe.filter((item) => String(item?._id) !== String(createdReservation?._id))
              ];
            });
            setAdminOrders((current) => {
              const safe = Array.isArray(current) ? current : [];
              return [
                createdReservation,
                ...safe.filter((item) => String(item?._id) !== String(createdReservation?._id))
              ];
            });
          }
        } else {
          const orderResponse = await apiFetch("/orders", {
            method: "POST",
            token,
            body: {
              orderType,
              timeSlotLabel: normalizedTimeSlot,
              reservationDate: reservationDatePayload,
              reservationTime: reservationTimePayload,
              reservationStart,
              tableId: orderType === "table" ? selectedTableId : undefined,
              seatCount,
              customerName: normalizedCustomerName,
              phone: normalizedPhone,
              deliveryAddress,
              paymentMethod,
              isManualBooking: isSeatMapManualBooking,
          paymentStatus:
            paymentMethod === "card" &&
            (orderType === "delivery" || isSeatMapManualBooking)
              ? "paid"
              : "unpaid",
              items: cart.map((item) => ({
                dishId: item.dishId,
                quantity: item.quantity
              }))
            }
          });
          const createdOrder = orderResponse?.order || orderResponse;
          if (createdOrder && isAdminRole) {
            setAdminOrders((current) => {
              const safe = Array.isArray(current) ? current : [];
              return [
                createdOrder,
                ...safe.filter((item) => String(item?._id) !== String(createdOrder?._id))
              ];
            });
          }
        }
        if (
          !isAdminRole &&
          (orderType === "delivery" || isSeatMapManualBooking) &&
          paymentMethod === "card" &&
          !useSavedCard &&
          saveCard
        ) {
          if (isCardFormComplete) {
            addSavedCard(cardForm);
          }
        }
        if (orderType === "table" && selectedTableId) {
          const seatValue = Math.max(Number(seatCount || 0), 0);
          const normalizedSlot = String(normalizedTimeSlot || "").trim().toUpperCase();
          setTableSeatUsage((current) => ({
            ...current,
            [selectedTableId]: Number(current?.[selectedTableId] || 0) + seatValue
          }));
          if (normalizedSlot) {
            setTableSeatUsageBySlot((current) => ({
              ...current,
              [selectedTableId]: {
                ...(current?.[selectedTableId] || {}),
                [normalizedSlot]:
                  Number(current?.[selectedTableId]?.[normalizedSlot] || 0) + seatValue
              }
            }));
          }
        }
          setOrderMessage("Order created successfully.");
          setCart([]);
          closeOrderModal();
          setAdminBookingLocation("");
          setAdminBookingPurpose("");
          loadCatalog();
          loadAdminOrders();
          loadAdminTableReservations();
          loadCustomerOrders();
    } catch (err) {
      setError(err.message || "Failed to create order.");
    } finally {
      setOrderBusy(false);
    }
  };

  const loadAdminTables = async () => {
    if (!token) return;
    setAdminTablesBusy(true);
    setAdminTablesMsg("");
    try {
      const response = await apiFetch("/admin/tables", { token });
      setAdminTables(response?.tables || []);
    } catch (err) {
      setAdminTablesMsg(err.message || "Failed to load tables.");
    } finally {
      setAdminTablesBusy(false);
    }
  };

  const addAdminTable = async () => {
    if (!token) return;
    setAdminTablesMsg("");
    try {
      await apiFetch("/admin/tables", {
        method: "POST",
        token,
        body: {
          tableNo: adminTableForm.tableNo,
          seats: Number(adminTableForm.seats || 0),
          location: adminTableForm.location,
          purpose: adminTableForm.purpose,
          isAvailable: adminTableForm.isAvailable
        }
      });
      setAdminTableForm({
        tableNo: "",
        seats: "2",
        location: "indoor",
        purpose: "family",
        isAvailable: true
      });
      loadAdminTables();
    } catch (err) {
      setAdminTablesMsg(err.message || "Failed to add table.");
    }
  };

  const toggleAdminTableAvailability = async (table) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/tables/${table._id}`, {
        method: "PATCH",
        token,
        body: { isAvailable: !table.isAvailable }
      });
      loadAdminTables();
    } catch (err) {
      setAdminTablesMsg(err.message || "Failed to update table.");
    }
  };

  const deleteAdminTable = async (tableId) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/tables/${tableId}`, { method: "DELETE", token });
      loadAdminTables();
    } catch (err) {
      setAdminTablesMsg(err.message || "Failed to delete table.");
    }
  };

  const loadAdminDishes = async () => {
    if (!token) return;
    setAdminDishesBusy(true);
    setAdminDishesMsg("");
    try {
      const response = await apiFetch("/admin/dishes", { token });
      setAdminDishes(response?.dishes || []);
    } catch (err) {
      setAdminDishesMsg(err.message || "Failed to load dishes.");
    } finally {
      setAdminDishesBusy(false);
    }
  };

  const addDishToAdminOrder = async (order, dish, quantityToAdd = 1) => {
    if (!token || !order?._id || !dish?._id) return;
    const safeQty = Math.max(Number(quantityToAdd || 0), 0);
    if (!Number.isFinite(safeQty) || safeQty < 1) return;
    const paymentStatus = String(order?.paymentStatus || "").toLowerCase();
    if (paymentStatus === "paid") {
      setAdminOrdersMsg("Cannot add dishes to paid orders.");
      return;
    }

    const currentItems = Array.isArray(order.items) ? order.items : [];
    const updatedItems = [...currentItems];
    const existingIndex = updatedItems.findIndex(
      (item) =>
        String(item?.dishId || "") === String(dish._id) ||
        String(item?.name || "").trim().toLowerCase() === String(dish.name || "").trim().toLowerCase()
    );

    if (existingIndex >= 0) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: Number(updatedItems[existingIndex].quantity || 0) + safeQty
      };
    } else {
      updatedItems.push({
        dishId: dish._id,
        name: dish.name,
        quantity: safeQty,
        price: Number(dish.price || 0)
      });
    }

    try {
      await apiFetch(`/orders/${order._id}`, {
        method: "PUT",
        token,
        body: { items: updatedItems }
      });
      await loadAdminOrders();
      setAdminOrdersMsg("");
    } catch (err) {
      setAdminOrdersMsg(err.message || "Failed to add dish to order.");
    }
  };

  const openAddDishModal = () => {
    setEditingAdminDishId("");
    setAdminDishCategoryDropdownOpen(false);
    setAdminDishForm({ ...EMPTY_ADMIN_DISH_FORM });
    setAdminDishesMsg("");
    setAddDishModalVisible(true);
  };

  const closeDishModal = () => {
    setAddDishModalVisible(false);
    setEditingAdminDishId("");
    setAdminDishCategoryDropdownOpen(false);
  };

  const editAdminDish = (dish) => {
    setEditingAdminDishId(String(dish?._id || ""));
    setAdminDishCategoryDropdownOpen(false);
    setAdminDishForm({
      name: String(dish?.name || ""),
      category: String(dish?.category || ""),
      price: String(dish?.price ?? ""),
      prepTimeMin: String(dish?.prepTimeMin ?? ""),
      description: String(dish?.description || ""),
      imageUrl: String(dish?.imageUrl || ""),
      isAvailable: dish?.isAvailable !== false,
      isTrending: Boolean(dish?.isTrending)
    });
    setAdminDishesMsg("");
    setAddDishModalVisible(true);
  };

  const pickAdminDishImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        setAdminDishesMsg("Media library permission is required to select images.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
        base64: true
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset || !asset.base64) {
        setAdminDishesMsg("Unable to read image. Please try a different image.");
        return;
      }
      const mimeType = asset.mimeType || "image/jpeg";
      const dataUri = `data:${mimeType};base64,${asset.base64}`;
      setAdminDishForm((s) => ({ ...s, imageUrl: dataUri }));
      setAdminDishesMsg("");
    } catch (err) {
      setAdminDishesMsg(err.message || "Failed to pick image.");
    }
  };

  const saveAdminDish = async () => {
    if (!token) return false;
    setAdminDishesMsg("");
    try {
      const parsedPrice = Number(adminDishForm.price || 0);
      const parsedPrepTime = Number(adminDishForm.prepTimeMin || 15);
      const body = {
        name: String(adminDishForm.name || "").trim(),
        category: String(adminDishForm.category || "").trim(),
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        prepTimeMin: Number.isFinite(parsedPrepTime) && parsedPrepTime > 0 ? parsedPrepTime : 15,
        description: String(adminDishForm.description || "").trim(),
        imageUrl: String(adminDishForm.imageUrl || "").trim(),
        isAvailable: adminDishForm.isAvailable !== false,
        isTrending: Boolean(adminDishForm.isTrending)
      };

      const endpoint = editingAdminDishId
        ? `/admin/dishes/${editingAdminDishId}`
        : "/admin/dishes";
      const method = editingAdminDishId ? "PATCH" : "POST";

      await apiFetch(endpoint, {
        method,
        token,
        body
      });
      setAdminDishForm({ ...EMPTY_ADMIN_DISH_FORM });
      setEditingAdminDishId("");
      setAdminDishCategoryDropdownOpen(false);
      await loadAdminDishes();
      return true;
    } catch (err) {
      setAdminDishesMsg(
        err.message ||
          (editingAdminDishId ? "Failed to update dish." : "Failed to add dish.")
      );
      return false;
    }
  };

  const toggleAdminDishAvailability = async (dish) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/dishes/${dish._id}`, {
        method: "PATCH",
        token,
        body: { isAvailable: !dish.isAvailable }
      });
      loadAdminDishes();
    } catch (err) {
      setAdminDishesMsg(err.message || "Failed to update dish.");
    }
  };

  const toggleAdminDishTrending = async (dish) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/dishes/${dish._id}`, {
        method: "PATCH",
        token,
        body: { isTrending: !dish.isTrending }
      });
      loadAdminDishes();
    } catch (err) {
      setAdminDishesMsg(err.message || "Failed to update dish.");
    }
  };

  const deleteAdminDish = async (dishId) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/dishes/${dishId}`, { method: "DELETE", token });
      loadAdminDishes();
    } catch (err) {
      setAdminDishesMsg(err.message || "Failed to delete dish.");
    }
  };

  const loadAdminReviews = async () => {
    if (!token) return;
    setAdminReviewsBusy(true);
    setAdminReviewsMsg("");
    try {
      const response = await apiFetch("/admin/reviews", { token });
      setAdminReviews(response?.reviews || []);
    } catch (err) {
      setAdminReviewsMsg(err.message || "Failed to load reviews.");
    } finally {
      setAdminReviewsBusy(false);
    }
  };

  const deleteAdminReview = async (reviewId) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/reviews/${reviewId}`, { method: "DELETE", token });
      loadAdminReviews();
    } catch (err) {
      setAdminReviewsMsg(err.message || "Failed to delete review.");
    }
  };

  const loadAdminUsers = async () => {
    if (!token) return;
    setAdminUsersBusy(true);
    setAdminUsersMsg("");
    try {
      const response = await apiFetch("/admin/users", { token });
      setAdminUsers(response?.users || []);
    } catch (err) {
      setAdminUsersMsg(err.message || "Failed to load users.");
    } finally {
      setAdminUsersBusy(false);
    }
  };

  const updateAdminUserRole = async (userId, roleValue) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/users/${userId}`, {
        method: "PATCH",
        token,
        body: { role: roleValue }
      });
      loadAdminUsers();
    } catch (err) {
      setAdminUsersMsg(err.message || "Failed to update user.");
    }
  };

  const toggleAdminUserBlocked = async (user) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/users/${user._id}`, {
        method: "PATCH",
        token,
        body: { isBlocked: !user.isBlocked }
      });
      loadAdminUsers();
    } catch (err) {
      setAdminUsersMsg(err.message || "Failed to update user.");
    }
  };

  const deleteAdminUser = async (userId) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/users/${userId}`, { method: "DELETE", token });
      loadAdminUsers();
    } catch (err) {
      setAdminUsersMsg(err.message || "Failed to delete user.");
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setProfileSaveBusy(true);
    setProfileSaveMsg("");
    try {
      const response = await apiFetch("/me", {
        method: "PATCH",
        token,
        body: profileForm
      });
      const user = response?.user || response;
      setProfile(user);
      setProfileSaveMsg("Profile updated.");
    } catch (err) {
      setProfileSaveMsg(err.message || "Failed to update profile.");
    } finally {
      setProfileSaveBusy(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;
    setPasswordBusy(true);
    setPasswordMsg("");
    try {
      await apiFetch("/me/change-password", {
        method: "POST",
        token,
        body: passwordForm
      });
      setPasswordMsg("Password updated.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg(err.message || "Failed to update password.");
    } finally {
      setPasswordBusy(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!token) return;
    const rating = Math.max(1, Math.min(5, Number(reviewForm.rating || 0)));
    if (!rating) {
      setReviewMsg("Please select a star rating.");
      return;
    }
    setReviewBusy(true);
    setReviewMsg("");
    try {
      await apiFetch("/reviews", {
        method: "POST",
        token,
        body: { ...reviewForm, rating }
      });
      setReviewMsg("Review submitted.");
      setReviewForm({ dishId: "", dishName: "", reviewerName: "", rating: "0", comment: "" });
      loadCustomerReviews();
    } catch (err) {
      setReviewMsg(err.message || "Failed to submit review.");
    } finally {
      setReviewBusy(false);
    }
  };
  useEffect(() => {
    if (orderType !== "table") return;
    if (!seatCountOptions.length) return;
    const current = Number(seatCount || 0);
    if (!seatCountOptions.includes(current)) {
      setSeatCount(String(seatCountOptions[0]));
    }
  }, [orderType, seatCountOptions, seatCount]);

  useEffect(() => {
    if (orderType !== "table" && reservationOnly) {
      setReservationOnly(false);
    }
  }, [orderType, reservationOnly]);

  const updateProfileField = (key, value) => {
    setProfileForm((current) => ({ ...current, [key]: value }));
  };

  const addSavedCard = (form) => {
    const last4 = String(form.cardNumber || "").slice(-4);
    const newCard = {
      _id: `${Date.now()}`,
      brand: form.brand,
      last4,
      expiryMonth: form.expiryMonth,
      expiryYear: form.expiryYear,
      isDefault: savedCards.length === 0
    };
    setProfile((current) => ({
      ...current,
      savedCards: [...(current?.savedCards || []), newCard]
    }));
    setSavedCardForm({
      cardHolderName: "",
      brand: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: ""
    });
  };

  const deleteSavedCard = (cardId) => {
    setProfile((current) => ({
      ...current,
      savedCards: (current?.savedCards || []).filter((card) => card._id !== cardId)
    }));
  };

  const setDefaultSavedCard = (cardId) => {
    setProfile((current) => ({
      ...current,
      savedCards: (current?.savedCards || []).map((card) => ({
        ...card,
        isDefault: card._id === cardId
      }))
    }));
  };

  useEffect(() => {
    let isMounted = true;
    loadToken()
      .then((saved) => {
        if (isMounted) {
          setToken(saved);
          setInitializing(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setInitializing(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setRole("customer");
      setRoleReady(true);
      setProfile(null);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        setRoleReady(false);
        const response = await apiFetch("/me", { token });
        const user = response?.user || response;
        if (!isMounted) return;
        setProfile(user);
        setProfileForm({
          firstname: user?.firstname || "",
          lastname: user?.lastname || "",
          telephoneNumber: user?.telephoneNumber || "",
          address: user?.address || ""
        });
        setRole(resolveRole(user));
        setRoleReady(true);
      } catch {
        if (isMounted) {
          setRole("customer");
          setRoleReady(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (isAdminRole) {
      loadAdminOrders();
      loadAdminPayments();
      loadAdminTableReservations();
      loadAdminTables();
      loadAdminDishes();
      loadAdminReviews();
      loadAdminUsers();
    } else if (isStaffRole) {
      loadStaffOrders();
    } else {
      loadCatalog();
      loadCustomerOrders();
      loadCustomerReviews();
      loadCustomerPayments();
    }
  }, [token, role]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const loadedDefaults = await loadAdminPaymentDefaultsStorage();
        if (isMounted && loadedDefaults) {
          setAdminPaymentDefaults({
            taxPercent: String(loadedDefaults.taxPercent ?? "0"),
            offerType: String(loadedDefaults.offerType || "fixed").toLowerCase() === "percent" ? "percent" : "fixed",
            offerValue: String(loadedDefaults.offerValue ?? "0")
          });
        }
      } catch (_) {
        if (isMounted) setAdminPaymentDefaults(DEFAULT_ADMIN_PAYMENT_DEFAULTS);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!(isAdminRole && adminTab === "tables")) return;
    if (!orderModalVisible) return;
    const defaults = getDefaultDateTimeParts();
    const nextDate = adminBookingDate || defaults.date;
    const nextTime = adminBookingTime || defaults.time;
    const nextSuffix = adminBookingSuffix || defaults.suffix;
    if (!adminBookingDate) setAdminBookingDate(nextDate);
    if (!adminBookingTime) setAdminBookingTime(nextTime);
    if (!adminBookingSuffix) setAdminBookingSuffix(nextSuffix);
    if (manualBookingMode && !String(timeSlotLabel || "").trim()) {
      setTimeSlotLabel(normalizeTimeSlotLabel(buildReservationLabel(nextDate, nextTime, nextSuffix)));
    }
    if (orderType === "table") {
      setAdminBookingDropdown({ location: true, purpose: true });
    }
    loadCatalog();
  }, [
    orderModalVisible,
    isAdminRole,
    adminTab,
    adminBookingDate,
    adminBookingTime,
    adminBookingSuffix,
    orderType,
    manualBookingMode,
    timeSlotLabel
  ]);

  useEffect(() => {
    if (orderModalVisible) return;
    setAdminBookingDropdown({ location: false, purpose: false });
  }, [orderModalVisible]);

  useEffect(() => {
    if (isAdminRole && adminTab === "tables") return;
    if (bookingDate && bookingTime && bookingSuffix) return;
    const defaults = getDefaultDateTimeParts();
    if (!bookingDate) setBookingDate(defaults.date);
    if (!bookingTime) setBookingTime(defaults.time);
    if (!bookingSuffix) setBookingSuffix(defaults.suffix);
    if (!String(timeSlotLabel || "").trim()) {
      setTimeSlotLabel(normalizeTimeSlotLabel(buildReservationLabel(defaults.date, defaults.time, defaults.suffix)));
    }
  }, [
    bookingDate,
    bookingTime,
    bookingSuffix,
    isAdminRole,
    adminTab,
    timeSlotLabel
  ]);

  useEffect(() => {
    if (!token || isAdminRole || isStaffRole || customerTab !== "tables") return;
    const refreshSeatMap = () => {
      loadCatalog();
      loadCustomerOrders();
    };
    refreshSeatMap();
    const intervalId = setInterval(refreshSeatMap, 15000);
    return () => clearInterval(intervalId);
  }, [token, isAdminRole, isStaffRole, customerTab]);

  if (initializing || (token && !roleReady)) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={styles.helperText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!token) {
    return (
        <AuthScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          loginScope={loginScope}
          setLoginScope={setLoginScope}
          authTitle={authTitle}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
        hometown={hometown}
        setHometown={setHometown}
        telephoneNumber={telephoneNumber}
        setTelephoneNumber={setTelephoneNumber}
        nicNumber={nicNumber}
        setNicNumber={setNicNumber}
        gender={gender}
        setGender={setGender}
        address={address}
        setAddress={setAddress}
        keepLetters={keepLetters}
        normalizeNic={normalizeNic}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        authBusy={authBusy}
        error={error}
        info={info}
        API_BASE_URL={API_BASE_URL}
          styles={styles}
          accentColor={theme.accent}
          primaryTextColor={theme.primaryText}
        />
    );
  }

  if (token && isStaffRole) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
          }}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.backgroundOverlay} />
          {customerDrawerOpen ? (
            <View style={styles.drawerOverlay}>
              <TouchableOpacity
                style={styles.drawerBackdrop}
                onPress={() => setCustomerDrawerOpen(false)}
              />
              <View style={styles.drawerPanel}>
                <Text style={styles.drawerTitle}>Menu</Text>
                {[
                  { key: "menu", label: "Home" },
                  { key: "orders", label: "My Orders" },
                  { key: "tables", label: "Seat Map" },
                  { key: "profile", label: "My Profile" }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.drawerItem,
                      customerTab === item.key && styles.drawerItemActive
                    ]}
                    onPress={() => {
                      setCustomerTab(item.key);
                      setCustomerDrawerOpen(false);
                    }}
                  >
                    <Text style={styles.drawerItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.drawerItem, styles.drawerItemDanger]}
                  onPress={handleLogout}
                >
                  <Text style={styles.drawerItemText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <ScrollView contentContainerStyle={[styles.staffContainer, styles.bottomNavSpace]}>
            <View style={styles.staffHeader}>
              <Text style={styles.brand}>THE GOLDEN FORK</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.link}>Logout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.staffBadgeRow}>
              <Text style={styles.staffTitle}>Staff Dashboard</Text>
              <Text style={styles.staffBadge}>{roleLabel}</Text>
            </View>

            <View style={styles.staffCard}>
              <Text style={styles.staffCardTitle}>
                Welcome {profile?.firstname ? profile.firstname : roleLabel}
              </Text>
              <Text style={styles.staffCardText}>Track and update live orders.</Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={loadStaffOrders}
                disabled={staffOrdersBusy}
              >
                <Text style={styles.secondaryText}>
                  {staffOrdersBusy ? "Refreshing..." : "Refresh Orders"}
                </Text>
              </TouchableOpacity>
            </View>

            {staffOrdersMsg ? <Text style={styles.error}>{staffOrdersMsg}</Text> : null}

            <Text style={styles.sectionTitle}>Orders</Text>

            {staffOrdersBusy && staffOrders.length === 0 ? (
              <View style={styles.centeredInline}>
                <ActivityIndicator size="small" color={theme.accent} />
                <Text style={styles.helperText}>Loading orders...</Text>
              </View>
            ) : null}

            {staffOrders.length ? (
              staffOrders.map((order) => {
                const actions = getOrderActions(order);
                const itemsText = (order.items || [])
                  .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
                  .join(", ");
                return (
                  <View key={String(order._id || order.orderNumber)} style={styles.staffOrderCard}>
                    <View style={styles.staffOrderHeader}>
                      <Text style={styles.staffOrderTitle}>{order.orderNumber || "Order"}</Text>
                      <View style={styles.staffOrderStatusBadge}>
                        <Text style={styles.staffOrderStatus}>{order.status || "Unknown"}</Text>
                      </View>
                    </View>
                    {renderOrderInfoRow(
                      "receipt-outline",
                      `Type: ${formatOrderType(order.orderType)} - Payment: ${order.paymentStatus || "Unpaid"}`,
                      `staff-type-${order._id}`
                    )}
                    {renderOrderInfoRow(
                      "person-outline",
                      `Customer: ${order.customerName || order.createdBy || "-"}`,
                      `staff-customer-${order._id}`
                    )}
                    {renderOrderInfoRow(
                      "list-outline",
                      `Items: ${itemsText || "-"}`,
                      `staff-items-${order._id}`
                    )}
                    <View style={styles.staffActionRow}>
                      {actions.length ? (
                        actions.map((action) => (
                          <TouchableOpacity
                            key={`${order._id}-${action.status}`}
                            style={styles.staffActionButton}
                            onPress={() => updateStaffOrderStatus(order._id, action.status)}
                          >
                            <Text style={styles.staffActionText}>{action.label}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.helperText}>No actions</Text>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.helperText}>No orders found.</Text>
            )}
          </ScrollView>
          <View style={styles.compactBottomNav}>
            {[
              { key: "dashboard", label: "Dashboard" },
              { key: "logout", label: "Logout" }
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.compactNavItem}
                onPress={() => {
                  if (item.key === "logout") handleLogout();
                }}
              >
                <View
                  style={[
                    styles.compactNavPill,
                    item.key === "dashboard" && styles.compactNavPillActive
                  ]}
                >
                  <Text style={styles.compactNavText}>{item.label}</Text>
                </View>
                <View
                  style={[
                    styles.compactNavDot,
                    item.key === "dashboard" && styles.compactNavDotActive
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ImageBackground>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (token && isAdminRole) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.adminSafeArea, isAdminDark && styles.adminSafeAreaDark]}>
        <StatusBar style={isAdminDark ? "light" : "dark"} />
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
          }}
          style={styles.background}
          imageStyle={[styles.adminBackgroundImage, isAdminDark && styles.adminBackgroundImageDark]}
        >
          <View
            style={[
              styles.adminBackgroundOverlay,
              isAdminDark && styles.adminBackgroundOverlayDark
            ]}
          />
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
                              LKR 0.00
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
                              LKR {manualBookingTotal.toFixed(2)}
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
                            onChangeText={(value) =>
                              setPhone(String(value || "").replace(/\D/g, "").slice(0, 10))
                            }
                            maxLength={10}
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
                                          setAdminBookingDropdown((current) => ({
                                            ...current,
                                            location: false
                                          }));
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
                                          setAdminBookingDropdown((current) => ({
                                            ...current,
                                            purpose: false
                                          }));
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
                          {["table", "pickup"].map((type) => (
                            <TouchableOpacity
                              key={type}
                              style={[styles.orderTypeButton, orderType === type && styles.orderTypeActive]}
                              onPress={() => setOrderType(type)}
                            >
                              <Text style={styles.orderTypeText}>{type.toUpperCase()}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Booking Date
                        </Text>
                        <TextInput
                          style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor="#8B8B8B"
                          value={bookingDate}
                          onChangeText={(value) => {
                            setBookingDate(value);
                            const nextLabel = buildReservationLabel(value, bookingTime, bookingSuffix);
                            setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                          }}
                        />
                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Booking Time
                        </Text>
                        <TextInput
                          style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                          placeholder="HH:MM"
                          placeholderTextColor="#8B8B8B"
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
                      </>
                    )}

                    {!manualBookingMode && orderType === "delivery" ? (
                      <>
                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Delivery Address
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Delivery address"
                          placeholderTextColor="#8F98A8"
                          value={deliveryAddress}
                          onChangeText={setDeliveryAddress}
                        />
                      </>
                    ) : null}

                    {!manualBookingMode ? (
                      orderType === "delivery" || isSeatMapManualBooking ? (
                        <View style={styles.paymentNotice}>
                          <Text style={styles.profileLabel}>Payment Method</Text>
                          <Text style={styles.staffOrderMeta}>
                            {orderType === "delivery"
                              ? "Card payment required for delivery."
                              : "Card payment required for table booking (LKR 250.00)."}
                          </Text>
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
                      )
                    ) : null}

                    {paymentMethod === "card" && !isAdminRole ? (
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

                    {!manualBookingMode ? (
                      <View style={styles.adminDishList}>
                        <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                          Add Dishes
                        </Text>
                        {adminDishes.length ? (
                          adminDishes.map((dish) => {
                            const qty = getCartQuantity(dish._id);
                            const dishImage = getDishImageUri(dish);
                            return (
                              <View
                                key={String(dish._id)}
                                style={[
                                  styles.adminDishRow,
                                  isAdminDark && styles.adminDishRowDark
                                ]}
                              >
                                {dishImage ? (
                                  <Image source={{ uri: dishImage }} style={styles.adminDishThumb} />
                                ) : (
                                  <View style={[styles.adminDishThumb, styles.cardImagePlaceholder]}>
                                    <Text style={styles.cardImageText}>No image</Text>
                                  </View>
                                )}
                                <View style={styles.adminDishInfo}>
                                  <Text style={[styles.adminDishName, isAdminDark && styles.adminDishNameDark]}>
                                    {dish.name || "Dish"}
                                  </Text>
                                  <Text style={[styles.adminDishPrice, isAdminDark && styles.adminDishPriceDark]}>
                                    LKR {Number(dish.price || 0).toFixed(2)}
                                  </Text>
                                </View>
                                <View style={styles.adminDishActions}>
                                  <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => updateCartQuantity(dish._id, -1)}
                                  >
                                    <Text style={styles.qtyText}>-</Text>
                                  </TouchableOpacity>
                                  <Text style={styles.qtyValue}>{qty}</Text>
                                  <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => updateCartQuantity(dish._id, 1)}
                                  >
                                    <Text style={styles.qtyText}>+</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.adminAddButton, isAdminDark && styles.adminAddButtonDark]}
                                    onPress={() => addToCart(dish)}
                                  >
                                    <Text style={[styles.adminAddText, isAdminDark && styles.adminAddTextDark]}>
                                      Add
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          })
                        ) : (
                          <Text style={[styles.adminMutedText, isAdminDark && styles.adminMutedTextDark]}>
                            No dishes available.
                          </Text>
                        )}
                      </View>
                    ) : null}

                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Customer Details
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Customer name"
                      placeholderTextColor="#8F98A8"
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone (10 digits)"
                      placeholderTextColor="#8F98A8"
                      value={phone}
                      onChangeText={(value) =>
                        setPhone(String(value || "").replace(/\D/g, "").slice(0, 10))
                      }
                      keyboardType="phone-pad"
                      maxLength={10}
                    />

                    {reservationOnly ? (
                      <Text style={styles.helperText}>Reservation only (no dishes added).</Text>
                    ) : cart.length ? (
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
                    ) : (
                      <Text style={[styles.adminMutedText, isAdminDark && styles.adminMutedTextDark]}>Add dishes from the menu below.</Text>
                    )}

                    {orderMessage ? <Text style={styles.info}>{orderMessage}</Text> : null}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                      style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                      onPress={handlePlaceOrder}
                      disabled={orderBusy}
                    >
                      {orderBusy ? (
                        <ActivityIndicator color="#0A0A0A" />
                      ) : (
                        <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>Create Order</Text>
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
                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Seats
                    </Text>
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
                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Location
                    </Text>
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
                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Purpose
                    </Text>
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
                    >
                      <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
                        Save Table
                      </Text>
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
            onRequestClose={closeDishModal}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.adminModalSheet, isAdminDark && styles.adminModalSheetDark]}>
                <View style={[styles.adminModalHeader, isAdminDark && styles.adminModalHeaderDark]}>
                  <Text style={[styles.adminModalTitle, isAdminDark && styles.adminModalTitleDark]}>
                    {editingAdminDishId ? "Edit Dish" : "Add Dish"}
                  </Text>
                  <TouchableOpacity onPress={closeDishModal}>
                    <Text style={[styles.adminModalClose, isAdminDark && styles.adminModalCloseDark]}>
                      Close
                    </Text>
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
                    <Text style={[styles.adminFieldLabel, isAdminDark && styles.adminFieldLabelDark]}>
                      Category
                    </Text>
                    <TouchableOpacity
                      style={[styles.adminDropdown, isAdminDark && styles.adminDropdownDark]}
                      onPress={() => setAdminDishCategoryDropdownOpen((current) => !current)}
                    >
                      <Text style={[styles.adminDropdownText, isAdminDark && styles.adminDropdownTextDark]}>
                        {adminDishForm.category || "Select category"}
                      </Text>
                    </TouchableOpacity>
                    {adminDishCategoryDropdownOpen ? (
                      <View style={[styles.adminDropdownMenu, isAdminDark && styles.adminDropdownMenuDark]}>
                        {adminDishCategoryOptions.map((value) => (
                          <TouchableOpacity
                            key={value}
                            style={styles.adminDropdownItem}
                            onPress={() => {
                              setAdminDishForm((current) => ({ ...current, category: value }));
                              setAdminDishCategoryDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.adminDropdownItemText, isAdminDark && styles.adminDropdownItemTextDark]}>
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}
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
                        <Image
                          source={{ uri: adminDishForm.imageUrl }}
                          style={styles.adminImagePreview}
                        />
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
                        <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
                          Select Image
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
                        onPress={() => setAdminDishForm((s) => ({ ...s, imageUrl: "" }))}
                      >
                        <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
                          Clear
                        </Text>
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
                        const saved = await saveAdminDish();
                        if (saved) closeDishModal();
                      }}
                    >
                      <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
                        {editingAdminDishId ? "Update Dish" : "Save Dish"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          <View style={[styles.adminTopbarLight, isAdminDark && styles.adminTopbarDark]}>
            <View style={styles.adminTopbarLeft}>
              <View style={styles.adminTopbarAvatar}>
                <Ionicons name="shield-checkmark" size={22} color="#F97316" />
              </View>
              <View>
                <Text style={[styles.adminTitle, isAdminDark && styles.adminTitleDark]}>Golden Fork</Text>
                <Text style={[styles.adminSubtitle, isAdminDark && styles.adminSubtitleDark]}>
                  {profile?.firstname ? `Hi, ${profile.firstname}` : profile?.email || "Admin"}
                </Text>
              </View>
            </View>
            <View style={styles.adminTopbarActions}>
              <TouchableOpacity
                style={[styles.adminIconButton, isAdminDark && styles.adminIconButtonDark]}
                onPress={() => setAppTheme(isDark ? "light" : "dark")}
              >
                <Ionicons name={isAdminDark ? "sunny" : "moon"} size={18} color={isAdminDark ? "#FDCB6E" : "#F97316"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                onPress={handleLogout}
              >
                <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.adminScroll}
            contentContainerStyle={styles.adminContent}
            showsVerticalScrollIndicator={false}
          >
            {adminTab === "dashboard" ? (
              <View style={[styles.adminSection, styles.adminContentTight]}>
                <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
                  Overview
                </Text>
                <View style={styles.adminStatsRow}>
                  {[
                    { label: "Revenue", value: `LKR ${adminRevenue.toFixed(2)}`, icon: "cash-outline", color: "#00B894" },
                    { label: "Active Orders", value: adminPendingCount, icon: "flame-outline", color: "#FDCB6E" },
                    { label: "Free Tables", value: adminAvailableTablesCount, icon: "checkmark-circle-outline", color: "#F97316" },
                    { label: "Total Orders", value: adminOrders.length, icon: "receipt-outline", color: "#74B9FF" }
                  ].map((item, index) => {
                    const palette = [
                      { light: styles.adminStatGreen, dark: styles.adminStatGreenDark },
                      { light: styles.adminStatOrange, dark: styles.adminStatOrangeDark },
                      { light: styles.adminStatBlue, dark: styles.adminStatBlueDark },
                      { light: styles.adminStatRed, dark: styles.adminStatRedDark }
                    ][index % 4];
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
                      <View style={[styles.adminStatIconWrap, { backgroundColor: item.color + "22" }]}>
                        <Ionicons name={item.icon} size={18} color={item.color} />
                      </View>
                      <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>{item.label}</Text>
                      <Text style={[styles.adminStatValue, { color: item.color }]}>{item.value}</Text>
                    </View>
                    );
                  })}
                </View>

                <View style={[styles.adminDashQuickGrid]}>
                  {[
                    { label: "Tables", icon: "grid", tab: "tables", color: "#F97316" },
                    { label: "Orders", icon: "receipt", tab: "orders", color: "#FDCB6E" },
                    { label: "Payments", icon: "card", tab: "payments", color: "#00B894" },
                    { label: "Dishes", icon: "restaurant", tab: "dishes", color: "#E17055" },
                    { label: "Users", icon: "people", tab: "users", color: "#74B9FF" },
                    { label: "Reviews", icon: "chatbubbles", tab: "reviews", color: "#FDBA74" }
                  ].map((q) => (
                    <TouchableOpacity
                      key={q.tab}
                      style={[styles.adminDashQuickItem, isAdminDark && styles.adminDashQuickItemDark, { borderColor: q.color + "44" }]}
                      onPress={() => setAdminTab(q.tab)}
                    >
                      <View style={[styles.adminDashQuickIcon, { backgroundColor: q.color + "22" }]}>
                        <Ionicons name={q.icon} size={22} color={q.color} />
                      </View>
                      <Text style={[styles.adminDashQuickLabel, isAdminDark && styles.adminDashQuickLabelDark]}>{q.label}</Text>
                      <Ionicons name="chevron-forward" size={12} color={isAdminDark ? "#6B7A8D" : "#A0ADB8"} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

            {adminTab === "tables" ? (
              <AdminManageTables
                adminOrders={adminOrders}
                adminTableReservations={adminTableReservations}
                adminTables={adminTables}
                adminTableFilter={adminTableFilter}
                setAdminTableFilter={setAdminTableFilter}
                adminTablesBusy={adminTablesBusy}
                loadAdminTables={loadAdminTables}
                loadAdminTableReservations={loadAdminTableReservations}
                setAddTableModalVisible={setAddTableModalVisible}
                setOrderType={setOrderType}
                setOrderModalVisible={setOrderModalVisible}
                resolveTableLocation={resolveTableLocation}
                formatDateTime={formatDateTime}
                formatReservationRange={formatReservationRange}
                isReservationActiveNow={isReservationActiveNow}
                cancelAdminOrder={cancelAdminOrder}
                toggleAdminTableAvailability={toggleAdminTableAvailability}
                deleteAdminTable={deleteAdminTable}
                styles={styles}
                isAdminDark={isAdminDark}
              />
            ) : null}

            {adminTab === "profile" ? (
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
                  <View style={styles.adminProfileRow}>
                    <Text style={[styles.adminProfileKey, isAdminDark && styles.adminProfileKeyDark]}>First name</Text>
                    <Text style={[styles.adminProfileValue, isAdminDark && styles.adminProfileValueDark]}>
                      {profile?.firstname || "-"}
                    </Text>
                  </View>
                  <View style={styles.adminProfileRow}>
                    <Text style={[styles.adminProfileKey, isAdminDark && styles.adminProfileKeyDark]}>Last name</Text>
                    <Text style={[styles.adminProfileValue, isAdminDark && styles.adminProfileValueDark]}>
                      {profile?.lastname || "-"}
                    </Text>
                  </View>
                  <View style={styles.adminProfileRow}>
                    <Text style={[styles.adminProfileKey, isAdminDark && styles.adminProfileKeyDark]}>Telephone</Text>
                    <Text style={[styles.adminProfileValue, isAdminDark && styles.adminProfileValueDark]}>
                      {profile?.telephoneNumber || "-"}
                    </Text>
                  </View>
                  <View style={styles.adminProfileRow}>
                    <Text style={[styles.adminProfileKey, isAdminDark && styles.adminProfileKeyDark]}>Address</Text>
                    <Text style={[styles.adminProfileValue, isAdminDark && styles.adminProfileValueDark]}>
                      {profile?.address || "-"}
                    </Text>
                  </View>
                  <View style={styles.adminProfileRow}>
                    <Text style={[styles.adminProfileKey, isAdminDark && styles.adminProfileKeyDark]}>Role</Text>
                    <Text style={[styles.adminProfileValue, isAdminDark && styles.adminProfileValueDark]}>
                      {roleLabel}
                    </Text>
                  </View>
                </View>
                <View style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
                  <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>
                    Edit Profile
                  </Text>
                  <TextInput
                    style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                    placeholder="First name"
                    placeholderTextColor={isAdminDark ? "#8B8B8B" : "#8F98A8"}
                    value={profileForm.firstname}
                    onChangeText={(value) => updateProfileField("firstname", value)}
                  />
                  <TextInput
                    style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                    placeholder="Last name"
                    placeholderTextColor={isAdminDark ? "#8B8B8B" : "#8F98A8"}
                    value={profileForm.lastname}
                    onChangeText={(value) => updateProfileField("lastname", value)}
                  />
                  <TextInput
                    style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                    placeholder="Telephone"
                    placeholderTextColor={isAdminDark ? "#8B8B8B" : "#8F98A8"}
                    value={profileForm.telephoneNumber}
                    onChangeText={(value) => updateProfileField("telephoneNumber", value)}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={[styles.adminInput, isAdminDark && styles.adminInputDark]}
                    placeholder="Address"
                    placeholderTextColor={isAdminDark ? "#8B8B8B" : "#8F98A8"}
                    value={profileForm.address}
                    onChangeText={(value) => updateProfileField("address", value)}
                    multiline
                  />
                  {profileSaveMsg ? <Text style={styles.info}>{profileSaveMsg}</Text> : null}
                  <TouchableOpacity
                    style={[styles.adminPrimaryButton, isAdminDark && styles.adminPrimaryButtonDark]}
                    onPress={handleSaveProfile}
                    disabled={profileSaveBusy}
                  >
                    {profileSaveBusy ? (
                      <ActivityIndicator color={isAdminDark ? "#F5F7FB" : "#0A0A0A"} />
                    ) : (
                      <Text style={[styles.adminPrimaryText, isAdminDark && styles.adminPrimaryTextDark]}>
                        Save Profile
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {adminTab === "dishes" ? (
              <AdminManageDishes
                adminDishes={adminDishes}
                adminDishesMsg={adminDishesMsg}
                adminDishesBusy={adminDishesBusy}
                loadAdminDishes={loadAdminDishes}
                openAddDishModal={openAddDishModal}
                editAdminDish={editAdminDish}
                toggleAdminDishAvailability={toggleAdminDishAvailability}
                toggleAdminDishTrending={toggleAdminDishTrending}
                deleteAdminDish={deleteAdminDish}
                styles={styles}
                isAdminDark={isAdminDark}
              />
            ) : null}

            {adminTab === "reviews" ? (
              <AdminManageReviews
                adminReviews={adminReviews}
                adminReviewsMsg={adminReviewsMsg}
                adminReviewsBusy={adminReviewsBusy}
                loadAdminReviews={loadAdminReviews}
                deleteAdminReview={deleteAdminReview}
                styles={styles}
                isAdminDark={isAdminDark}
              />
            ) : null}

            {adminTab === "users" ? (
              <View style={styles.adminSection}>
                <View style={styles.adminSectionHeader}>
                  <Text style={[styles.adminSectionTitle, isAdminDark && styles.adminSectionTitleDark]}>Manage Users</Text>
                  <TouchableOpacity
                    style={[styles.adminGhostButton, isAdminDark && styles.adminGhostButtonDark]}
                    onPress={loadAdminUsers}
                    disabled={adminUsersBusy}
                  >
                    <Text style={[styles.adminGhostText, isAdminDark && styles.adminGhostTextDark]}>
                      {adminUsersBusy ? "Refreshing..." : "Refresh"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.adminStatsRow}>
                  {[
                    { label: "Total Users", value: adminUsers.length },
                    {
                      label: "Staff Count",
                      value: adminUsers.filter((user) => {
                        const role = String(user?.role || "").toLowerCase();
                        return user?.isStaff || ["manager", "cashier", "staff"].includes(role);
                      }).length
                    }
                  ].map((item, index) => {
                    const palette = [
                      { light: styles.adminStatOrange, dark: styles.adminStatOrangeDark },
                      { light: styles.adminStatBlue, dark: styles.adminStatBlueDark }
                    ][index % 2];
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
                      <Text style={[styles.adminStatLabel, isAdminDark && styles.adminStatLabelDark]}>{item.label}</Text>
                      <Text style={[styles.adminStatValue, isAdminDark && styles.adminStatValueDark]}>{item.value}</Text>
                    </View>
                    );
                  })}
                </View>
                {adminUsersMsg ? <Text style={styles.error}>{adminUsersMsg}</Text> : null}
                {adminUsers.map((user) => (
                  <View key={String(user._id)} style={[styles.adminCard, isAdminDark && styles.adminCardDark]}>
                    <Text style={[styles.adminCardTitle, isAdminDark && styles.adminCardTitleDark]}>{user.email}</Text>
                      <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                      {user.firstname || ""} {user.lastname || ""} - {user.role || "customer"}
                    </Text>
                      <Text style={[styles.adminCardMeta, isAdminDark && styles.adminCardMetaDark]}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Text>
                    <View style={styles.adminActionRow}>
                      {["admin", "manager", "cashier", "staff", "customer"].map((roleValue) => (
                        <TouchableOpacity
                          key={`${user._id}-${roleValue}`}
                          style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                          onPress={() => updateAdminUserRole(user._id, roleValue)}
                        >
                          <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>{roleValue}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={[styles.adminActionButton, isAdminDark && styles.adminActionButtonDark]}
                        onPress={() => toggleAdminUserBlocked(user)}
                      >
                        <Text style={[styles.adminActionText, isAdminDark && styles.adminActionTextDark]}>
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.adminDangerButton, isAdminDark && styles.adminDangerButtonDark]}
                        onPress={() => deleteAdminUser(user._id)}
                      >
                        <Text style={[styles.adminDangerText, isAdminDark && styles.adminDangerTextDark]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            {adminTab === "payments" ? (
              <AdminManagePayments
                styles={styles}
                isAdminDark={isAdminDark}
                adminPaymentStats={adminPaymentStats}
                adminRevenue={adminRevenue}
                adminPaymentDefaults={adminPaymentDefaults}
                saveAdminPaymentDefaults={saveAdminPaymentDefaults}
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
            ) : null}

            {adminTab === "orders" ? (
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
                addDishToAdminOrder={addDishToAdminOrder}
                adminDishes={adminDishes}
                setOrderModalVisible={setOrderModalVisible}
                formatOrderType={formatOrderType}
                formatReservationRange={formatReservationRange}
                resolveTableLocation={resolveTableLocation}
                formatDateTime={formatDateTime}
                styles={styles}
                isAdminDark={isAdminDark}
              />
            ) : null}
            </ScrollView>
            <View style={[styles.adminBottomNav, isAdminDark && styles.adminBottomNavDark]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adminNavScroll}>
                {[
                  { key: "dashboard", label: "Home", icon: "speedometer-outline", activeIcon: "speedometer" },
                  { key: "tables", label: "Tables", icon: "grid-outline", activeIcon: "grid" },
                  { key: "orders", label: "Orders", icon: "receipt-outline", activeIcon: "receipt" },
                  { key: "payments", label: "Pay", icon: "card-outline", activeIcon: "card" },
                  { key: "dishes", label: "Dishes", icon: "restaurant-outline", activeIcon: "restaurant" },
                  { key: "users", label: "Users", icon: "people-outline", activeIcon: "people" },
                  { key: "reviews", label: "Reviews", icon: "chatbubbles-outline", activeIcon: "chatbubbles" },
                  { key: "profile", label: "Me", icon: "person-outline", activeIcon: "person" }
                ].map((item) => {
                  const isActive = adminTab === item.key;
                  return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.adminNavItem,
                      isActive && styles.adminNavItemActive,
                      isAdminDark && styles.adminNavItemDark,
                      isAdminDark && isActive && styles.adminNavItemActiveDark
                    ]}
                    onPress={() => setAdminTab(item.key)}
                  >
                    <View style={[styles.adminNavIconWrap, isActive && styles.adminNavIconWrapActive]}>
                      <Ionicons
                        name={isActive ? item.activeIcon : item.icon}
                        size={18}
                        color={isActive ? "#FFFFFF" : (isAdminDark ? "#8A9AB0" : "#8A9AB0")}
                      />
                    </View>
                    <Text style={[
                      styles.adminNavText,
                      isActive && styles.adminNavTextActive,
                      isAdminDark && styles.adminNavTextDark,
                      isAdminDark && isActive && styles.adminNavTextActiveDark
                    ]}>
                      {item.label}
                    </Text>
                    {isActive ? <View style={styles.adminNavActiveDot} /> : null}
                  </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
        </ImageBackground>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
          }}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.backgroundOverlay} />
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
                    {reservationOnly ? "Manual Table Booking" : "Book Table & Order"}
                  </Text>
                  <TouchableOpacity onPress={closeOrderModal}>
                    <Text style={styles.modalClose}>Close</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <View style={styles.orderCard}>
                    {reservationOnly ? (
                      <>
                        <View style={styles.adminOrderSummary}>
                          <View style={styles.adminOrderSummaryItem}>
                            <Text style={styles.adminOrderSummaryLabel}>Subtotal</Text>
                            <Text style={styles.adminOrderSummaryValue}>LKR 0.00</Text>
                          </View>
                          <View style={styles.adminOrderSummaryDivider} />
                          <View style={styles.adminOrderSummaryItem}>
                            <Text style={styles.adminOrderSummaryLabel}>Booking Fee</Text>
                            <Text style={styles.adminOrderSummaryValue}>LKR {manualBookingTotal.toFixed(2)}</Text>
                          </View>
                          <View style={styles.adminOrderSummaryDivider} />
                          <View style={styles.adminOrderSummaryItem}>
                            <Text style={styles.adminOrderSummaryLabel}>Total to Pay</Text>
                            <Text style={styles.adminOrderSummaryValue}>LKR {manualBookingTotal.toFixed(2)}</Text>
                          </View>
                        </View>
                        <Text style={styles.profileLabel}>Customer Details</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Customer name"
                          placeholderTextColor="#8F98A8"
                          value={customerName}
                          onChangeText={setCustomerName}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Phone (10 digits)"
                          placeholderTextColor="#8F98A8"
                          value={phone}
                          onChangeText={(value) =>
                            setPhone(String(value || "").replace(/\D/g, "").slice(0, 10))
                          }
                          keyboardType="phone-pad"
                          maxLength={10}
                        />

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
                    ) : (
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

                        {orderType === "table" ? (
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
                      </>
                    )}

                  {!reservationOnly || isSeatMapManualBooking ? (
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

                  {orderType === "delivery" || isSeatMapManualBooking ? (
                    <View style={styles.paymentNotice}>
                      <Text style={styles.profileLabel}>Payment Method</Text>
                      <Text style={styles.staffOrderMeta}>
                        {orderType === "delivery"
                          ? "Card payment required for delivery."
                          : "Card payment required for table booking (LKR 250.00)."}
                      </Text>
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
                    placeholder="Customer name"
                    placeholderTextColor="#8F98A8"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone (10 digits)"
                    placeholderTextColor="#8F98A8"
                    value={phone}
                    onChangeText={(value) =>
                      setPhone(String(value || "").replace(/\D/g, "").slice(0, 10))
                    }
                    keyboardType="phone-pad"
                    maxLength={10}
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
                  <Text style={styles.profileLabel}>Rating</Text>
                  <View style={[styles.orderActionRow, { justifyContent: "flex-start", marginBottom: 6 }]}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = Number(reviewForm.rating || 0) >= star;
                      return (
                        <TouchableOpacity
                          key={`review-star-${star}`}
                          onPress={() => setReviewForm((s) => ({ ...s, rating: String(star) }))}
                          style={{ marginRight: 8 }}
                        >
                          <Ionicons
                            name={active ? "star" : "star-outline"}
                            size={24}
                            color={active ? "#F59E0B" : "#9CA3AF"}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
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
        {renderCustomerTopbar()}
        {customerTab === "menu" ? (
          catalogBusy && dishes.length === 0 ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text style={styles.helperText}>Loading menu...</Text>
            </View>
          ) : (
            <FlatList
              ref={menuListRef}
              data={filteredMenuDishes}
              keyExtractor={(item) => String(item._id || item.name)}
              contentContainerStyle={[styles.catalogList, styles.bottomNavSpace]}
              ListHeaderComponent={
                <View>
                  {renderCustomerHeader("Our Dishes", "Fresh, crafted, and served with care.")}

                  <View style={styles.orderSummary}>
                    <Text style={styles.sectionTitle}>Your Order</Text>
                    <Text style={styles.helperText}>Cart items: {cartCount}</Text>
                    <TouchableOpacity
                      style={styles.openOrderButton}
                      onPress={() => setOrderModalVisible(true)}
                    >
                      <Text style={styles.primaryText}>Open Order</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Most Trending</Text>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => loadCatalog({ page: dishPage })} disabled={catalogBusy}>
                      <Text style={styles.secondaryText}>{catalogBusy ? "Refreshing..." : "Refresh"}</Text>
                    </TouchableOpacity>
                  </View>

                  {trendingDishes.length ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
                      {trendingDishes.map((dish) => renderTrendingCard(dish))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.helperText}>No trending dishes yet.</Text>
                  )}

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Menu</Text>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => loadCatalog({ page: dishPage })} disabled={catalogBusy}>
                      <Text style={styles.secondaryText}>{catalogBusy ? "Refreshing..." : "Refresh"}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuSearchWrap}>
                    <Ionicons name="search-outline" size={18} color={theme.accent} />
                    <TextInput
                      style={styles.menuSearchInput}
                      placeholder="Search food"
                      placeholderTextColor="#B6A08F"
                      value={menuSearchQuery}
                      onChangeText={setMenuSearchQuery}
                    />
                    <TouchableOpacity style={styles.menuSearchFilterBtn} onPress={() => loadCatalog({ page: dishPage })} disabled={catalogBusy}>
                      <Ionicons name="options-outline" size={15} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                  {menuCategories.length ? (
                    <ScrollView
                      ref={menuCategoryRowRef}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.menuCategoryRow}
                    >
                      <TouchableOpacity
                        style={[
                          styles.menuCategoryCard,
                          menuCategoryFilter === "all" && styles.menuCategoryCardActive
                        ]}
                        onPress={() => handleMenuCategorySelect("all", 0)}
                      >
                        <View style={styles.menuCategoryIconWrap}>
                          <Ionicons name={getCategoryIcon("all")} size={18} color={theme.accent} />
                        </View>
                        <Text style={styles.menuCategoryText}>All</Text>
                      </TouchableOpacity>
                      {menuCategories.map((cat, index) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.menuCategoryCard,
                            menuCategoryFilter === cat && styles.menuCategoryCardActive
                          ]}
                          onPress={() => handleMenuCategorySelect(cat, index + 1)}
                        >
                          <View style={styles.menuCategoryIconWrap}>
                            <Ionicons name={getCategoryIcon(cat)} size={18} color={theme.accent} />
                          </View>
                          <Text style={styles.menuCategoryText}>{String(cat)}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null}
                  {error ? <Text style={styles.error}>{error}</Text> : null}
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.menuCard}>
                  {renderDishImage(item)}
                  <View style={styles.menuMetaStrip}>
                    <Text style={styles.menuMetaText}>{item.category || "General"}</Text>
                    <Text style={styles.menuMetaText}>Prep {item.prepTimeMin || 0}m</Text>
                    <Text style={styles.menuMetaText}>LKR {Number(item.price || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.menuContent}>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: "rgba(0,0,0,0.08)",
                        marginBottom: 6
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: theme.text }}>
                        {item.category || "General"}
                      </Text>
                    </View>
                    <Text style={styles.menuTitle}>{item.name || "Unnamed dish"}</Text>
                    <Text style={styles.menuDescription}>{item.description || "No details added by admin."}</Text>
                    <Text style={styles.menuRating}>
                      Rating {Number(item.averageRating || 0).toFixed(1)} / 5
                    </Text>
                    <View style={[styles.statusBadge, item.isAvailable ? styles.statusOk : styles.statusNo]}>
                      <Text style={styles.statusText}>{item.isAvailable ? "Available" : "Not Available"}</Text>
                    </View>
                    {item.isAvailable ? (
                      <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.actionGhost} onPress={() => addToCart(item)}>
                          <Text style={styles.actionGhostText}>Add to Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionGhost} onPress={() => openOrderModal(item, "table")}>
                          <Text style={styles.actionGhostText}>Dine In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionGhost} onPress={() => openOrderModal(item, "delivery")}>
                          <Text style={styles.actionGhostText}>Delivery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionPrimary} onPress={() => openReviewModal(item)}>
                          <Text style={styles.actionPrimaryText}>Add Review</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              )}
            ListEmptyComponent={<Text style={styles.helperText}>No dishes found.</Text>}
            ListFooterComponent={
              dishTotalPages > 1 ? (
                <View style={{ paddingTop: 12, gap: 10 }}>
                  <Text style={[styles.helperText, { textAlign: "center" }]}>
                    Page {dishPage} of {dishTotalPages}
                  </Text>
                  <View style={styles.orderActionRow}>
                    <TouchableOpacity
                      style={[styles.actionGhost, dishPage <= 1 && { opacity: 0.5 }]}
                      disabled={dishPage <= 1 || catalogBusy}
                      onPress={() => changeDishPage(dishPage - 1)}
                    >
                      <Text style={styles.actionGhostText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionGhost, dishPage >= dishTotalPages && { opacity: 0.5 }]}
                      disabled={dishPage >= dishTotalPages || catalogBusy}
                      onPress={() => changeDishPage(dishPage + 1)}
                    >
                      <Text style={styles.actionGhostText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            }
          />
          )
        ) : customerTab === "orders" ? (
          <ScrollView contentContainerStyle={[styles.catalogList, styles.bottomNavSpace]}>
            {renderCustomerHeader("My Orders", "Track your recent bookings.")}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Orders</Text>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {["all", "new", "preparing", "ready", "served", "delivered", "cancelled"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    orderStatusFilter === status && styles.filterChipActive
                  ]}
                  onPress={() => setOrderStatusFilter(status)}
                >
                  <Text style={styles.filterChipText}>{status.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {customerOrdersMsg ? <Text style={styles.error}>{customerOrdersMsg}</Text> : null}
            {customerOrdersBusy && filteredCustomerOrders.length === 0 ? (
              <View style={styles.centeredInline}>
                <ActivityIndicator size="small" color={theme.accent} />
                <Text style={styles.helperText}>Loading orders...</Text>
              </View>
            ) : null}
            {filteredCustomerOrders.length ? (
              filteredCustomerOrders.map((order) => {
                const itemsText = (order.items || [])
                  .map((item) => `${item.name || "Item"} x${item.quantity || 0}`)
                  .join(", ");
                const orderStatus = String(order.status || "").toLowerCase();
                const canCancel = !["cancelled", "delivered", "served"].includes(orderStatus);
                return (
                  <View key={String(order._id || order.orderNumber)} style={styles.staffOrderCard}>
                    <View style={styles.staffOrderHeader}>
                      <Text style={styles.staffOrderTitle}>{order.orderNumber || "Order"}</Text>
                      <View style={styles.staffOrderStatusBadge}>
                        <Text style={styles.staffOrderStatus}>{order.status || "Unknown"}</Text>
                      </View>
                    </View>
                    {renderOrderInfoRow(
                      "receipt-outline",
                      `Type: ${formatOrderType(order.orderType)} - Payment: ${order.paymentStatus || "Unpaid"}`,
                      `customer-type-${order._id}`
                    )}
                    {normalizeOrderType(order.orderType) === "table" ? (
                      renderOrderInfoRow(
                        "grid-outline",
                        `Table: ${order.tableNumber || order.tableId?.tableNo || "-"} - Seats: ${order.seatCount || "-"}`,
                        `customer-table-${order._id}`
                      )
                    ) : null}
                    {renderOrderInfoRow(
                      "calendar-outline",
                      `Booking: ${formatReservationRange(order)}`,
                      `customer-booking-${order._id}`
                    )}
                    {renderOrderInfoRow(
                      "time-outline",
                      `Created: ${formatDateTime(order.createdAt)}`,
                      `customer-created-${order._id}`
                    )}
                    {renderOrderInfoRow(
                      "list-outline",
                      `Items: ${itemsText || "-"}`,
                      `customer-items-${order._id}`
                    )}
                    {canCancel ? (
                      <View style={styles.orderActionRow}>
                        <TouchableOpacity
                          style={styles.actionGhost}
                          onPress={() => cancelCustomerOrder(order._id)}
                        >
                          <Text style={styles.actionGhostText}>Cancel Order</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                );
              })
            ) : (
              <Text style={styles.helperText}>No orders for selected status.</Text>
            )}
          </ScrollView>
        ) : customerTab === "profile" ? (
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
                  <TouchableOpacity
                    style={styles.placeOrderButton}
                    onPress={handleSaveProfile}
                    disabled={profileSaveBusy}
                  >
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
                    placeholderTextColor="#8F98A8"
                    value={passwordForm.currentPassword}
                    onChangeText={(value) => setPasswordForm((s) => ({ ...s, currentPassword: value }))}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="New password"
                    placeholderTextColor="#8F98A8"
                    value={passwordForm.newPassword}
                    onChangeText={(value) => setPasswordForm((s) => ({ ...s, newPassword: value }))}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor="#8F98A8"
                    value={passwordForm.confirmPassword}
                    onChangeText={(value) => setPasswordForm((s) => ({ ...s, confirmPassword: value }))}
                    secureTextEntry
                  />
                  {passwordMsg ? <Text style={styles.info}>{passwordMsg}</Text> : null}
                  <TouchableOpacity
                    style={styles.placeOrderButton}
                    onPress={handleChangePassword}
                    disabled={passwordBusy}
                  >
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
                      style={[
                        styles.orderTypeButton,
                        appTheme === "light" && styles.orderTypeActive
                      ]}
                      onPress={() => setAppTheme("light")}
                    >
                      <Text style={styles.orderTypeText}>LIGHT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.orderTypeButton,
                        appTheme === "dark" && styles.orderTypeActive
                      ]}
                      onPress={() => setAppTheme("dark")}
                    >
                      <Text style={styles.orderTypeText}>DARK</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.helperText}>Switch between light and dark mode.</Text>
                </View>

                <View style={styles.orderCard}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Payment Methods</Text>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => {
                        setProfileTab("payments");
                        setAddCardOpen(true);
                      }}
                    >
                      <Text style={styles.secondaryText}>Add Card</Text>
                    </TouchableOpacity>
                  </View>
                  {savedCards.length ? (
                    savedCards.slice(0, 2).map((card) => (
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
                      </View>
                    ))
                  ) : (
                    <Text style={styles.helperText}>No saved cards yet.</Text>
                  )}
                </View>
              </>
            ) : null}

            {profileTab === "reviews" ? (
              <View style={styles.orderCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My Reviews</Text>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={loadCustomerReviews}
                    disabled={customerReviewsBusy}
                  >
                    <Text style={styles.secondaryText}>
                      {customerReviewsBusy ? "Refreshing..." : "Refresh"}
                    </Text>
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
                        {review.targetType === "service"
                          ? "Service Review"
                          : review.dishId?.name || "Dish Review"}
                      </Text>
                      <Text style={styles.staffOrderMeta}>
                        Rating: {review.rating || 0} / 5
                      </Text>
                      {review.comment ? (
                        <Text style={styles.staffOrderMeta}>{review.comment}</Text>
                      ) : null}
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
                unpaidOrders={customerUnpaidOrders}
                formatDateTime={formatDateTime}
              />
            ) : null}
          </ScrollView>
        ) : (
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
                      <View style={styles.staffOrderStatusBadge}>
                        <Text style={styles.staffOrderStatus}>{order.status || "Unknown"}</Text>
                      </View>
                    </View>
                    {renderOrderInfoRow(
                      "grid-outline",
                      `Table: ${order.tableNumber || order.tableId?.tableNo || "-"} - Seats: ${order.seatCount || "-"}`,
                      `booking-table-${order._id}`
                    )}
                    {renderOrderInfoRow(
                      "calendar-outline",
                      `Booking: ${formatReservationRange(order)}`,
                      `booking-slot-${order._id}`
                    )}
                    {renderOrderInfoRow(
                      "time-outline",
                      `Created: ${formatDateTime(order.createdAt)}`,
                      `booking-created-${order._id}`
                    )}
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
                  const formatted = formatTimeInput(value);
                  setBookingTime(formatted);
                  const nextLabel = buildReservationLabel(bookingDate, formatted, bookingSuffix);
                  setTimeSlotLabel(normalizeTimeSlotLabel(nextLabel));
                  setSeatSearchActive(false);
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
                        setSeatSearchActive(false);
                      }}
                    >
                      <Text style={[styles.actionGhostText, isActive && styles.actionGhostActiveText]}>{suffix}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.orderActionRow}>
                <TouchableOpacity style={styles.actionPrimary} onPress={applySeatSearch}>
                  <Text style={styles.actionPrimaryText}>Search Availability</Text>
                </TouchableOpacity>
                {seatSearchActive ? (
                  <Text style={styles.helperText}>Showing free tables for selected time.</Text>
                ) : null}
              </View>
              {seatSearchError ? <Text style={styles.error}>{seatSearchError}</Text> : null}
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Seat Map</Text>
              <TouchableOpacity style={styles.secondaryButton} onPress={loadCatalog} disabled={catalogBusy}>
                <Text style={styles.secondaryText}>{catalogBusy ? "Refreshing..." : "Refresh"}</Text>
              </TouchableOpacity>
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
            {tables.length ? (
              <View style={styles.seatMapGrid}>
                {tables.map((table) => {
                  const remaining = getLiveRemainingSeats(table);
                  const totalSeats = Number(table?.seats || 0);
                  const status = !table.isAvailable
                    ? "booked"
                    : remaining <= 0
                      ? "booked"
                      : remaining < totalSeats
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
                  const isOpen = table.isAvailable && remaining > 0;
                  const badgeColor =
                    status === "free"
                      ? "rgba(52, 211, 153, 0.2)"
                      : status === "pending"
                        ? "rgba(252, 211, 77, 0.2)"
                        : "rgba(248, 113, 113, 0.2)";
                  return (
                    <TouchableOpacity
                      key={String(table._id)}
                      style={tileStyle}
                      activeOpacity={isOpen ? 0.7 : 1}
                      onPress={() => {
                        if (!isOpen) return;
                        setOrderType("table");
                        setSelectedTableId(String(table._id));
                        setReservationOnly(true);
                        setCustomerName((prev) => prev || customerDisplayName || "Customer");
                        setPhone((prev) => prev || profile?.telephoneNumber || "");
                        setOrderMessage("");
                        setOrderModalVisible(true);
                      }}
                    >
                      <View style={styles.seatMapHeader}>
                        <Text style={titleStyle}>{table.tableNo || table.name || "Table"}</Text>
                        <View style={[styles.seatMapBadge, { backgroundColor: badgeColor }]}>
                          <Text style={styles.seatMapBadgeText}>
                            {status === "free" ? "AVAILABLE" : status === "pending" ? "PENDING" : "BOOKED"}
                          </Text>
                        </View>
                      </View>
                      <Text style={metaStyle}>Seats: {remaining}/{totalSeats}</Text>
                      <Text style={metaStyle}>Location: {String(table.location || "N/A").toUpperCase()}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.helperText}>No tables available yet.</Text>
            )}
          </ScrollView>
        )}
        {renderCustomerBottomNav()}
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}















