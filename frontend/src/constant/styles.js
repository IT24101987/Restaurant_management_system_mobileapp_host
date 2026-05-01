import { StyleSheet } from "react-native";

const darkTheme = {
  bg: "#121212",
  overlay: "rgba(18, 18, 18, 0.85)",
  text: "#FFFFFF",
  textMuted: "#BFBFBF",
  accent: "#F58A3B",
  accentStrong: "#F26A1B",
  accentSoft: "rgba(245, 138, 59, 0.2)",
  accentTint: "rgba(245, 138, 59, 0.12)",
  accentFade: "rgba(245, 138, 59, 0.08)",
  border: "rgba(255, 255, 255, 0.12)",
  borderStrong: "rgba(255, 255, 255, 0.25)",
  borderAccent: "rgba(245, 138, 59, 0.4)",
  inputBg: "rgba(255, 255, 255, 0.05)",
  helperBg: "rgba(10, 10, 10, 0.7)",
  panelBg: "#121212",
  panelItemBg: "rgba(255, 255, 255, 0.02)",
  chipBg: "rgba(0, 0, 0, 0.2)",
  cardBg: "#0E0E0E",
  tabsBg: "rgba(0, 0, 0, 0.7)",
  navBg: "#0B0D11",
  navActive: "#F58A3B",
  navBubbleBorder: "#2A2E35",
  modalOverlay: "rgba(0, 0, 0, 0.6)",
  primaryText: "#FFFFFF"
};

const lightTheme = {
  bg: "#e4e4e4",
  overlay: "rgba(255, 254, 254, 0.9)",
  text: "#2D201A",
  textMuted: "#7D5B4A",
  accent: "#f38a40",
  accentStrong: "#F26A1B",
  accentSoft: "rgba(245, 138, 59, 0.2)",
  accentTint: "rgba(245, 138, 59, 0.12)",
  accentFade: "rgba(245, 138, 59, 0.08)",
  border: "#F3DDCD",
  borderStrong: "#ab9999",
  borderAccent: "rgba(245, 138, 59, 0.35)",
  inputBg: "#ffffff",
  helperBg: "#dcd9d7",
  panelBg: "#ffffff",
  panelItemBg: "#FFFFFF",
  chipBg: "#FFFFFF",
  cardBg: "#ffffff",
  tabsBg: "#FFE8D8",
  navBg: "#f8f6f4",
  navActive: "#F58A3B",
  navBubbleBorder: "#F3DDCD",
  modalOverlay: "rgba(45, 32, 26, 0.2)",
  primaryText: "#FFFFFF"
};

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bg
  },
  background: {
    flex: 1
  },
  backgroundImage: {
    opacity: 0.55
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.overlay
  },
  authBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 18, 18, 0.12)"
  },
  authContainer: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 40,
    gap: 12
  },
  selectedDishCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 12
  },
  selectedDishImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover"
  },
  selectedDishBody: {
    padding: 12,
    gap: 6
  },
  adminDishList: {
    marginTop: 6,
    marginBottom: 12,
    gap: 10
  },
  adminDishRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 0,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent"
  },
  adminDishCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1D9C8",
    padding: 12,
    shadowColor: "#F97316",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 8
  },
  adminDishCardDark: {
    backgroundColor: "rgba(24, 14, 9, 0.92)",
    borderColor: "rgba(249, 115, 22, 0.25)"
  },
  adminDishRowDark: {
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(20, 20, 20, 0.85)"
  },
  adminDishThumb: {
    width: 40,
    height: 40,
    borderRadius: 10
  },
  adminDishThumbLarge: {
    width: 52,
    height: 52,
    borderRadius: 12
  },
  adminDishThumbPlaceholderLarge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE8D6",
    borderWidth: 1,
    borderColor: "#FFD7BA"
  },
  adminDishInfo: {
    flex: 1
  },
  adminDishTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  adminDishHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  adminDishStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2
  },
  adminDishStatText: {
    color: "#7C4A2E",
    fontSize: 12,
    fontWeight: "600"
  },
  adminDishStatTextDark: {
    color: "#EAC9AD"
  },
  adminTrendingTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#FDBA74",
    backgroundColor: "#FFF1E6"
  },
  adminTrendingTagDark: {
    borderColor: "rgba(251, 146, 60, 0.65)",
    backgroundColor: "rgba(251, 146, 60, 0.24)"
  },
  adminTrendingTagText: {
    color: "#9A3412",
    fontSize: 10,
    fontWeight: "800"
  },
  adminTrendingTagTextDark: {
    color: "#FED7AA"
  },
  adminDishIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1E6",
    borderWidth: 1,
    borderColor: "#FECBA8"
  },
  adminDishIconWrapDark: {
    backgroundColor: "rgba(249, 115, 22, 0.18)",
    borderColor: "rgba(249, 115, 22, 0.45)"
  },
  adminDishName: {
    fontWeight: "700",
    color: "#2D201A"
  },
  adminDishNameDark: {
    color: "#FFFFFF"
  },
  adminDishPrice: {
    color: "#7D5B4A",
    fontSize: 12
  },
  adminDishPriceDark: {
    color: "#BFBFBF"
  },
  adminDishActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  adminAddButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F58A3B"
  },
  adminAddButtonDark: {
    backgroundColor: "#F58A3B"
  },
  adminAddText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12
  },
  adminAddTextDark: {
    color: "#FFFFFF"
  },
  authCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    gap: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  brand: {
    fontSize: 20,
    letterSpacing: 1,
    color: theme.accent,
    fontWeight: "700"
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.text
  },
  heroSubtitle: {
    fontSize: 25,
    color: theme.accentStrong,
    marginBottom: 7
  },
  authBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    backgroundColor: theme.accentTint,
    color: theme.accent,
    fontWeight: "700",
    fontSize: 11,
    marginBottom: 8
  },
  sectionLabel: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 6
  },
  switchRow: {
    flexDirection: "row",
    backgroundColor: theme.cardBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 10
  },
  switchButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10
  },
  switchActive: {
    backgroundColor: theme.accentSoft
  },
  switchText: {
    fontWeight: "600",
    color: theme.text
  },
  row: {
    flexDirection: "row",
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderColor: theme.borderStrong,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: theme.inputBg,
    color: theme.text
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top"
  },
  half: {
    flex: 1
  },
  fieldLabel: {
    color: theme.textMuted,
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 6
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.borderStrong,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: theme.inputBg
  },
  genderButtonActive: {
    borderColor: theme.borderAccent,
    backgroundColor: theme.accentSoft
  },
  genderText: {
    color: theme.textMuted,
    fontWeight: "600"
  },
  genderTextActive: {
    color: theme.accent
  },
  primaryButton: {
    backgroundColor: theme.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6
  },
  primaryText: {
    color: theme.primaryText,
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.borderAccent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  secondaryText: {
    color: theme.accent,
    fontWeight: "600"
  },
  error: {
    color: "#FCA5A5",
    marginBottom: 8
  },
  info: {
    color: "#86EFAC",
    marginBottom: 8
  },
  helperBlock: {
    marginTop: 18,
    padding: 12,
    backgroundColor: theme.helperBg,
    borderRadius: 12
  },
  helperLabel: {
    fontWeight: "700",
    color: theme.accent,
    marginBottom: 4
  },
  helperText: {
    color: theme.textMuted,
    fontSize: 12
  },
  authLinkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  authLinkLabel: {
    color: theme.textMuted,
    fontSize: 12
  },
  centeredInline: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12
  },
  adminSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  adminSafeAreaDark: {
    backgroundColor: "#0F0A07"
  },
  adminBackgroundImage: {
    opacity: 0
  },
  adminBackgroundImageDark: {
    opacity: 0.2
  },
  adminBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF"
  },
  adminBackgroundOverlayDark: {
    backgroundColor: "rgba(12, 8, 6, 0.92)"
  },
  adminLayout: {
    flex: 1,
    flexDirection: "row"
  },
  adminWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#FFFFFF"
  },
  adminSidebar: {
    width: 120,
    backgroundColor: "rgba(20, 12, 8, 0.94)",
    borderRightWidth: 1,
    borderRightColor: "rgba(249, 115, 22, 0.18)",
    paddingHorizontal: 12,
    paddingVertical: 20
  },
  adminBrand: {
    color: "#F97316",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 16
  },
  adminNav: {
    gap: 8
  },
  adminNavItem: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 2
  },
  adminNavPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#FFF1E6",
    borderWidth: 1,
    borderColor: "#FFD2B3"
  },
  adminNavPillActive: {
    backgroundColor: "#FFE2C7",
    borderColor: "#F97316"
  },
  adminNavText: {
    color: "#7C2D12",
    fontWeight: "700",
    fontSize: 11
  },
  adminNavDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "transparent"
  },
  adminNavDotActive: {
    backgroundColor: "#F97316"
  },
  adminScroll: {
    flex: 1
  },
  adminContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 110,
    gap: 12,
    flexGrow: 1
  },
  adminTopbarLight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#F8EFE7",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFE2C7",
    borderTopColor: "#FFF1E6",
    borderBottomColor: "#FECBA8",
    borderTopColor: "#FFF1E6",
    borderBottomColor: "#FECBA8",
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
    shadowColor: "#F97316",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4
  },
  adminTopbarDark: {
    backgroundColor: "rgba(18, 12, 8, 0.94)",
    borderColor: "rgba(249, 115, 22, 0.22)"
  },
  adminTitle: {
    fontSize: 20,
    color: "#2B1A0E",
    fontWeight: "700"
  },
  adminTitleDark: {
    color: "#FCEFE3"
  },
  adminSubtitle: {
    color: "#9A3412",
    fontWeight: "600",
    fontSize: 12
  },
  adminSubtitleDark: {
    color: "#F3B37C"
  },
  adminLink: {
    color: "#9A3412",
    fontWeight: "700"
  },
  adminLinkDark: {
    color: "#FDBA74"
  },
  adminTopbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  adminTopbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  adminTopbarAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(108, 92, 231, 0.35)",
    alignItems: "center",
    justifyContent: "center"
  },
  adminIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.3)",
    backgroundColor: "rgba(108, 92, 231, 0.08)",
    alignItems: "center",
    justifyContent: "center"
  },
  adminIconButtonDark: {
    borderColor: "rgba(253, 203, 110, 0.35)",
    backgroundColor: "rgba(253, 203, 110, 0.08)"
  },
  adminIconButtonDanger: {
    borderColor: "rgba(214, 48, 49, 0.3)",
    backgroundColor: "rgba(214, 48, 49, 0.08)"
  },
  adminStatIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  },
  adminDashQuickGrid: {
    gap: 10,
    marginTop: 4
  },
  adminDashQuickItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255, 247, 240, 0.92)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFE2C7",
    borderLeftWidth: 3,
    borderLeftColor: "#F97316",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#F97316",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3
  },
  adminDashQuickItemDark: {
    backgroundColor: "rgba(24, 14, 9, 0.9)",
    borderColor: "rgba(249, 115, 22, 0.25)"
  },
  adminDashQuickIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center"
  },
  adminDashQuickLabel: {
    flex: 1,
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1A14"
  },
  adminDashQuickLabelDark: {
    color: "#F5EFE6"
  },
  adminSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 8,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#F97316"
  },
  adminSectionActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center"
  },
  adminSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C2D12"
  },
  adminSectionTitleDark: {
    color: "#FFE6CF"
  },
  adminStatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6
  },
  adminFilterRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
    marginBottom: 12
  },
  adminStatCard: {
    flexGrow: 1,
    flexBasis: "48%",
    minWidth: 140,
    backgroundColor: "#fdfafa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#325f99",
    borderTopColor: "#3a6aa8",
    borderBottomColor: "#405f87",
    padding: 12,
    gap: 6,
    shadowColor: "#20345d",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4
  },
  adminStatCardDark: {
    backgroundColor: "rgba(24, 14, 9, 0.92)",
    borderColor: "rgba(249, 115, 22, 0.2)"
  },
  adminStatGreen: {
    backgroundColor: "#E9F5EE",
    borderColor: "#B7DFC6"
  },
  adminStatBlue: {
    backgroundColor: "#E8F1FB",
    borderColor: "#BFD3F0"
  },
  adminStatRed: {
    backgroundColor: "#FDEEEE",
    borderColor: "#F2C7C7"
  },
  adminStatOrange: {
    backgroundColor: "#FFF3E6",
    borderColor: "#F0D3B7"
  },
  adminStatGreenDark: {
    backgroundColor: "rgba(16, 58, 37, 0.6)",
    borderColor: "rgba(34, 197, 94, 0.35)"
  },
  adminStatBlueDark: {
    backgroundColor: "rgba(15, 42, 74, 0.6)",
    borderColor: "rgba(59, 130, 246, 0.35)"
  },
  adminStatRedDark: {
    backgroundColor: "rgba(82, 20, 20, 0.6)",
    borderColor: "rgba(239, 68, 68, 0.35)"
  },
  adminStatOrangeDark: {
    backgroundColor: "rgba(86, 46, 12, 0.6)",
    borderColor: "rgba(249, 115, 22, 0.35)"
  },
  adminStatLabel: {
    color: "#8A5B3C",
    fontSize: 12
  },
  adminStatLabelDark: {
    color: "#E9C9AE"
  },
  adminStatValue: {
    color: "#2B1A0E",
    fontWeight: "700",
    fontSize: 18
  },
  adminStatValueDark: {
    color: "#FFF6ED"
  },
  adminMutedText: {
    color: "#9A6B4F",
    fontSize: 12
  },
  adminMutedTextDark: {
    color: "#D6B79F"
  },
  adminPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E4EAF2",
    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    gap: 20
  },
  adminPanelDark: {
    backgroundColor: "rgba(24, 14, 9, 0.92)",
    borderColor: "rgba(249, 115, 22, 0.2)"
  },
  adminOrderSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD7BA",
    borderTopColor: "#FFF1E6",
    borderBottomColor: "#FECBA8",
    backgroundColor: "#FFF3E8"
  },
  adminOrderSummaryDark: {
    backgroundColor: "rgba(249, 115, 22, 0.12)",
    borderColor: "rgba(249, 115, 22, 0.28)"
  },
  adminOrderSummaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 4
  },
  adminOrderSummaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(0, 0, 0, 0.08)"
  },
  adminOrderSummaryDividerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.12)"
  },
  adminOrderSummaryLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
    color: "#9A6B4F"
  },
  adminOrderSummaryLabelDark: {
    color: "#E7C7AD"
  },
  adminOrderSummaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B1A0E"
  },
  adminOrderSummaryValueDark: {
    color: "#FFE6CF"
  },
  adminProfileHero: {
    alignItems: "center",
    marginBottom: 16,
    gap: 6
  },
  adminProfileIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1E6"
  },
  adminProfileIconDark: {
    borderColor: "rgba(249, 115, 22, 0.7)",
    backgroundColor: "rgba(249, 115, 22, 0.16)"
  },
  adminProfileIconText: {
    color: "#C2410C",
    fontWeight: "700",
    fontSize: 20
  },
  adminProfileIconTextDark: {
    color: "#FDBA74"
  },
  adminProfileName: {
    color: "#2B1A0E",
    fontWeight: "700",
    fontSize: 16
  },
  adminProfileNameDark: {
    color: "#FFE6CF"
  },
  adminProfileMeta: {
    color: "#9A6B4F",
    fontSize: 12
  },
  adminProfileMetaDark: {
    color: "#E1C2A8"
  },
  adminProfileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6
  },
  adminProfileKey: {
    color: "#9A6B4F",
    fontSize: 12,
    fontWeight: "700"
  },
  adminProfileKeyDark: {
    color: "#E7C7AD"
  },
  adminProfileValue: {
    color: "#2B1A0E",
    fontSize: 12,
    fontWeight: "600"
  },
  adminProfileValueDark: {
    color: "#FFE6CF"
  },
  adminCard: {
    backgroundColor: "#fffefd",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E4EAF2",
    borderLeftWidth: 4,
    borderLeftColor: "#e6731aaa",
    borderTopColor: "#EA7A22",
    borderBottomColor: "#E4EAF2",
    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 8
  },
  adminCardDark: {
    backgroundColor: "rgba(24, 14, 9, 0.92)",
    borderColor: "rgba(249, 115, 22, 0.2)",
    borderLeftColor: "#34D399"
  },
  adminCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  adminCardTitle: {
    color: "#2B1A0E",
    fontWeight: "700"
  },
  adminCardTitleDark: {
    color: "#FFE6CF"
  },
  adminCardMeta: {
    color: "#5a3720",
    fontSize: 13
  },
  adminCardMetaDark: {
    color: "#D8B99E"
  },
  adminOptionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 6
  },
  adminOptionChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 247, 240, 0.9)",
    borderWidth: 1,
    borderColor: "#FFD7BA"
  },
  adminOptionChipActive: {
    backgroundColor: "#FFE2C7",
    borderColor: "#F97316"
  },
  adminOptionChipDark: {
    backgroundColor: "rgba(249, 115, 22, 0.12)",
    borderColor: "rgba(249, 115, 22, 0.3)"
  },
  adminOptionChipActiveDark: {
    backgroundColor: "rgba(249, 115, 22, 0.3)",
    borderColor: "rgba(249, 115, 22, 0.85)"
  },
  adminOptionText: {
    color: "#9A3412",
    fontWeight: "700",
    fontSize: 12
  },
  adminOptionTextActive: {
    color: "#2B1A0E"
  },
  adminOptionTextDark: {
    color: "#FADFC6"
  },
  adminOptionTextActiveDark: {
    color: "#FFE6CF"
  },
  adminStatusText: {
    color: "#047857",
    fontWeight: "700",
    fontSize: 11,
    textTransform: "uppercase"
  },
  adminStatusTextDark: {
    color: "#6EE7B7"
  },
  adminStatusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)"
  },
  adminStatusPillDark: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "rgba(52, 211, 153, 0.45)"
  },
  adminStatusPillNew: {
    backgroundColor: "rgba(59, 130, 246, 0.14)",
    borderColor: "rgba(59, 130, 246, 0.42)"
  },
  adminStatusPillPreparing: {
    backgroundColor: "rgba(249, 115, 22, 0.16)",
    borderColor: "rgba(249, 115, 22, 0.45)"
  },
  adminStatusPillReady: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    borderColor: "rgba(168, 85, 247, 0.44)"
  },
  adminStatusPillServed: {
    backgroundColor: "rgba(22, 163, 74, 0.14)",
    borderColor: "rgba(22, 163, 74, 0.44)"
  },
  adminStatusPillDelivered: {
    backgroundColor: "rgba(20, 184, 166, 0.14)",
    borderColor: "rgba(20, 184, 166, 0.44)"
  },
  adminStatusPillFinished: {
    backgroundColor: "rgba(200, 16, 35, 0.54)",
    borderColor: "rgba(137, 43, 43, 0.42)"
  },
  adminStatusTextNew: {
    color: "#1D4ED8"
  },
  adminStatusTextPreparing: {
    color: "#C2410C"
  },
  adminStatusTextReady: {
    color: "#7E22CE"
  },
  adminStatusTextServed: {
    color: "#15803D"
  },
  adminStatusTextDelivered: {
    color: "#0F766E"
  },
  adminStatusTextFinished: {
    color: "#334155"
  },
  adminActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 6
  },
  adminActionIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  adminActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EA7A22"
  },
  adminActionButtonDark: {
    backgroundColor: "rgba(249, 115, 22, 0.16)",
    borderColor: "rgba(249, 115, 22, 0.45)"
  },
  adminActionText: {
    color: "#EA7A22",
    fontWeight: "700",
    fontSize: 12
  },
  adminActionTextDark: {
    color: "#FDBA74"
  },
  adminPrimaryButton: {
    backgroundColor: "#EA7A22",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  adminPrimaryButtonDark: {
    backgroundColor: "#FB923C"
  },
  adminPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12
  },
  adminPrimaryTextDark: {
    color: "#1B0F07"
  },
  adminGhostButton: {
    borderWidth: 1,
    borderColor: "#EA7A22",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF"
  },
  adminGhostButtonDark: {
    borderColor: "rgba(249, 115, 22, 0.45)",
    backgroundColor: "rgba(249, 115, 22, 0.16)"
  },
  adminGhostText: {
    color: "#EA7A22",
    fontWeight: "700",
    fontSize: 12
  },
  adminGhostTextDark: {
    color: "#FDBA74"
  },
  adminDangerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#DC2626"
  },
  adminDangerButtonDark: {
    backgroundColor: "#991B1B"
  },
  adminDangerText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12
  },
  adminDangerTextDark: {
    color: "#FEE2E2"
  },
  adminFieldLabel: {
    color: "#9A6B4F",
    fontWeight: "600",
    fontSize: 12,
    marginTop: 4
  },
  adminFieldLabelDark: {
    color: "#E1C2A8"
  },
  adminInput: {
    borderWidth: 1,
    borderColor: "#FFD7BA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    color: "#2B1A0E"
  },
  adminInputDark: {
    borderColor: "rgba(249, 115, 22, 0.28)",
    backgroundColor: "rgba(24, 14, 9, 0.9)",
    color: "#FFE6CF"
  },
  adminImagePreviewWrap: {
    width: "100%",
    height: 170,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD7BA",
    overflow: "hidden",
    marginBottom: 10
  },
  adminImagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  adminImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8EE"
  },
  adminImageActionRow: {
    gap: 10,
    marginBottom: 10
  },
  adminDropdown: {
    borderWidth: 1,
    borderColor: "#FFD7BA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF"
  },
  adminDropdownDark: {
    borderColor: "rgba(249, 115, 22, 0.28)",
    backgroundColor: "rgba(24, 14, 9, 0.9)"
  },
  adminDropdownText: {
    color: "#2B1A0E",
    fontWeight: "600"
  },
  adminDropdownTextDark: {
    color: "#FFE6CF"
  },
  adminDropdownMenu: {
    borderWidth: 1,
    borderColor: "#FFD7BA",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF"
  },
  adminDropdownMenuDark: {
    borderColor: "rgba(249, 115, 22, 0.28)",
    backgroundColor: "rgba(24, 14, 9, 0.95)"
  },
  adminDropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.06)"
  },
  adminDropdownItemText: {
    color: "#2B1A0E",
    fontWeight: "600"
  },
  adminDropdownItemTextDark: {
    color: "#FFE6CF"
  },
  adminPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EA7A22",
    backgroundColor: "#FFFFFF",
    flexGrow: 0,
    minWidth: 0,
    alignItems: "center"
  },
  adminPillDark: {
    borderColor: "rgba(249, 115, 22, 0.45)",
    backgroundColor: "rgba(249, 115, 22, 0.16)"
  },
  adminPillActive: {
    borderColor: "#EA7A22",
    backgroundColor: "#FFE7D1"
  },
  adminPillActiveDark: {
    borderColor: "rgba(249, 115, 22, 0.9)",
    backgroundColor: "rgba(249, 115, 22, 0.32)"
  },
  adminPillText: {
    color: "#EA7A22",
    fontWeight: "700",
    fontSize: 10
  },
  adminPillTextDark: {
    color: "#FDBA74"
  },
  adminModalSheet: {
    backgroundColor: "#FFF7F0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "92%",
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "#FFE2C7"
  },
  adminModalSheetDark: {
    backgroundColor: "#130B07",
    borderColor: "rgba(249, 115, 22, 0.28)"
  },
  adminModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE2C7"
  },
  adminModalHeaderDark: {
    borderBottomColor: "rgba(249, 115, 22, 0.2)"
  },
  adminModalTitle: {
    color: "#2B1A0E",
    fontWeight: "700",
    fontSize: 16
  },
  adminModalTitleDark: {
    color: "#FFE6CF"
  },
  adminModalClose: {
    color: "#9A3412",
    fontWeight: "700"
  },
  adminModalCloseDark: {
    color: "#FDBA74"
  },
  adminModalContent: {
    padding: 20
  },
  adminModalContentDark: {
    padding: 18
  },
  adminSeatCard: {
    backgroundColor: "#FFF7F0",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFD7BA",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#F97316",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 6
  },
  adminSeatCardDark: {
    backgroundColor: "rgba(24, 14, 9, 0.92)",
    borderColor: "rgba(249, 115, 22, 0.2)"
  },
  adminSeatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  adminSeatTitle: {
    color: "#2B1A0E",
    fontWeight: "700"
  },
  adminSeatTitleDark: {
    color: "#FFE6CF"
  },
  adminSeatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  adminSeatBadgeOpen: {
    backgroundColor: "#DFF4E4"
  },
  adminSeatBadgeFull: {
    backgroundColor: "#F8D7D7"
  },
  adminSeatBadgeText: {
    color: "#2F2A24",
    fontWeight: "700",
    fontSize: 11
  },
  adminSeatBadgeTextDark: {
    color: "#0A0A0A"
  },
  adminSeatMeta: {
    color: "#8A5B3C",
    fontSize: 12
  },
  adminSeatMetaDark: {
    color: "#D8B99E"
  },
  adminBottomNav: {
    backgroundColor: "#f0efef",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f5f3f2",
    borderTopColor: "#eeebe8",
    borderBottomColor: "#fafafa",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  adminBottomNavDark: {
    backgroundColor: "#1B120B",
    borderColor: "rgba(249, 115, 22, 0.3)"
  },
  adminNavScroll: {
    gap: 6,
    paddingVertical: 0,
    paddingHorizontal: 4
  },
  adminNavItemDark: {
    backgroundColor: "transparent"
  },
  adminNavItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 10,
    minWidth: 40
  },
  adminNavItemActive: {
    backgroundColor: "rgba(249, 115, 22, 0.12)"
  },
  adminNavItemActiveDark: {
    backgroundColor: "rgba(249, 115, 22, 0.2)"
  },
  adminNavIconWrap: {
    width: 36,
    height: 26,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  adminNavIconWrapActive: {
    backgroundColor: "#F97316",
    shadowColor: "#F97316",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4
  },
  adminNavActiveDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#F97316",
    marginTop: 0
  },
  adminNavText: {
    color: "#7C2D12",
    fontWeight: "600",
    fontSize: 9,
    textAlign: "center"
  },
  adminNavTextActive: {
    color: "#F97316"
  },
  adminNavTextDark: {
    color: "#FADFC6"
  },
  adminNavTextActiveDark: {
    color: "#FDBA74"
  },
  compactBottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    backgroundColor: "rgba(10, 10, 10, 0.92)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5
  },
  compactNavScroll: {
    gap: 8,
    paddingVertical: 2
  },
  compactNavItem: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 2
  },
  compactNavPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)"
  },
  compactNavPillActive: {
    backgroundColor: "rgba(245, 138, 59, 0.24)",
    borderColor: "rgba(245, 138, 59, 0.65)"
  },
  compactNavText: {
    color: "#F5F5F5",
    fontWeight: "600",
    fontSize: 11
  },
  compactNavDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "transparent"
  },
  compactNavDotActive: {
    backgroundColor: "#F58A3B"
  },
  adminContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16
  },
  adminTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  adminTabButton: {
    width: 140,
    height: 88,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(12, 12, 12, 0.55)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between"
  },
  adminTabActive: {
    borderColor: "#F58A3B",
    backgroundColor: "rgba(245, 138, 59, 0.18)",
    shadowColor: "#F58A3B",
    shadowOpacity: 0.15,
    shadowRadius: 8
  },
  adminTabText: {
    color: "#F5F5F5",
    fontWeight: "700",
    fontSize: 12
  },
  adminTopNav: {
    gap: 10,
    paddingTop: 0,
    paddingBottom: 0
  },
  adminContentTight: {
    marginTop: -6
  },
  adminSection: {
    gap: 12
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6
  },
  statsCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 12,
    gap: 6
  },
  statsLabel: {
    color: "#BFBFBF",
    fontSize: 12
  },
  statsValue: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18
  },
  adminChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8
  },
  adminChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCCBB1",
    backgroundColor: "#FFF8EE"
  },
  adminChipDark: {
    borderColor: "rgba(245, 138, 59, 0.35)",
    backgroundColor: "rgba(245, 138, 59, 0.12)"
  },
  adminChipActive: {
    borderColor: "#F26A1B",
    backgroundColor: "#E7CFA7"
  },
  adminChipActiveDark: {
    borderColor: "rgba(245, 138, 59, 0.8)",
    backgroundColor: "rgba(245, 138, 59, 0.28)"
  },
  adminChipText: {
    color: "#6B4B1E",
    fontWeight: "600",
    fontSize: 12
  },
  adminChipTextDark: {
    color: "#E2C28B"
  },
  staffContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16
  },
  staffHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  staffBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  staffTitle: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "700"
  },
  staffBadge: {
    backgroundColor: "rgba(245, 138, 59, 0.25)",
    color: "#a86637",
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden"
  },
  staffCard: {
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 8
  },
  staffCardTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16
  },
  staffCardText: {
    color: theme.textMuted,
    fontSize: 12
  },
  staffOrderCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: theme.border,
    borderLeftWidth: 4,
    borderLeftColor: "#679e8c",
    borderRightWidth: 4,
    borderRightColor: "#679e8c",
    marginBottom: 12,
    gap: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  staffOrderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  staffOrderTitle: {
    color: theme.text,
    fontWeight: "700",
    flex: 1
  },
  staffOrderStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.accentTint,
    borderWidth: 1,
    borderColor: theme.borderAccent
  },
  staffOrderStatusBadgeNew: {
    backgroundColor: "rgba(59, 130, 246, 0.14)",
    borderColor: "rgba(59, 130, 246, 0.4)"
  },
  staffOrderStatusBadgePreparing: {
    backgroundColor: "rgba(249, 115, 22, 0.16)",
    borderColor: "rgba(249, 115, 22, 0.45)"
  },
  staffOrderStatusBadgeReady: {
    backgroundColor: "rgba(168, 85, 247, 0.14)",
    borderColor: "rgba(168, 85, 247, 0.4)"
  },
  staffOrderStatusBadgeServed: {
    backgroundColor: "rgba(22, 163, 74, 0.14)",
    borderColor: "rgba(22, 163, 74, 0.4)"
  },
  staffOrderStatusBadgeDelivered: {
    backgroundColor: "rgba(20, 184, 166, 0.14)",
    borderColor: "rgba(20, 184, 166, 0.4)"
  },
  staffOrderStatusBadgeFinished: {
    backgroundColor: "rgba(100, 116, 139, 0.16)",
    borderColor: "rgba(100, 116, 139, 0.42)"
  },
  staffOrderStatus: {
    color: theme.accentStrong,
    fontWeight: "700",
    fontSize: 11,
    textTransform: "capitalize"
  },
  staffOrderStatusTextNew: {
    color: "#1D4ED8"
  },
  staffOrderStatusTextPreparing: {
    color: "#C2410C"
  },
  staffOrderStatusTextReady: {
    color: "#7E22CE"
  },
  staffOrderStatusTextServed: {
    color: "#15803D"
  },
  staffOrderStatusTextDelivered: {
    color: "#0F766E"
  },
  staffOrderStatusTextFinished: {
    color: "#334155"
  },
  staffOrderInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  staffOrderInfoIconWrap: {
    width: 16,
    alignItems: "center",
    marginTop: 1
  },
  staffOrderInfoText: {
    flex: 1,
    color: theme.textMuted,
    fontSize: 12,
    lineHeight: 17
  },
  staffOrderMeta: {
    color: theme.textMuted,
    fontSize: 12,
    backgroundColor: theme.accentTint,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  staffActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    alignItems: "center"
  },
  staffActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.accent
  },
  staffActionText: {
    color: theme.primaryText,
    fontWeight: "700",
    fontSize: 12
  },
  dangerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#7F1D1D"
  },
  dangerButtonText: {
    color: "#FEE2E2",
    fontWeight: "700",
    fontSize: 12
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8
  },
  topbarFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "rgba(236, 226, 217, 0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.93)",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  topbarFixedDark: {
    backgroundColor: "rgba(18, 18, 18, 0.96)",
    borderBottomColor: "rgba(245, 138, 59, 0.25)"
  },
  topbarSpacer: {
    height: 62
  },
  topbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1
  },
  topbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  cartIconButton: {
    borderWidth: 1,
    borderColor: "rgba(245, 138, 59, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(245, 138, 59, 0.12)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  cartIconText: {
    color: "#F58A3B",
    fontWeight: "700",
    fontSize: 12
  },
  cartBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 10
  },
  menuButton: {
    borderWidth: 1,
    borderColor: "rgba(245, 138, 59, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(245, 138, 59, 0.12)"
  },
  menuButtonText: {
    color: "#F58A3B",
    fontWeight: "700",
    fontSize: 12
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    alignItems: "center",
    justifyContent: "center"
  },
  profileIconText: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 12
  },
  profileHero: {
    alignItems: "center",
    marginBottom: 16,
    gap: 6
  },
  paymentNotice: {
    marginBottom: 10
  },
  paymentMethodInlineCard: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.inputBg,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    gap: 6
  },
  cardBlock: {
    marginBottom: 12
  },
  savedCardItem: {
    backgroundColor: theme.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
    marginBottom: 10
  },
  savedCardItemActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentTint
  },
  expiryRow: {
    flexDirection: "row",
    gap: 10
  },
  expiryInput: {
    flex: 1
  },
  profileTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    backgroundColor: "#fffcfc",
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: theme.border
  },
  profileTabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center"
  },
  profileTabButtonActive: {
    backgroundColor: "#F97316"
  },
  profileTabText: {
    color: theme.textMuted,
    fontWeight: "700",
    fontSize: 11
  },
  profileTabTextActive: {
    color: "#ffffff"
  },
  profileIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.accentTint
  },
  profileIconTextLarge: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 20
  },
  profileName: {
    color: theme.text,
    fontWeight: "700",
    fontSize: 16
  },
  profileMeta: {
    color: theme.textMuted,
    fontSize: 12
  },
  profileSectionHeader: {
    marginBottom: 8
  },
  link: {
    color: "#F58A3B",
    fontWeight: "600"
  },
  catalogList: {
    paddingHorizontal: 24,
    paddingBottom: 30
  },
  heroBlock: {
    marginTop: 30,
    marginBottom: 18
  },
  bottomNavSpace: {
    paddingBottom: 110
  },
  bottomNavWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    alignItems: "center"
  },
  bottomNav: {
    width: "100%",
    backgroundColor: theme.navBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    gap: 4
  },
  bottomNavItemCenter: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    marginTop: -24
  },
  bottomNavCenterBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.navActive,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: theme.navBubbleBorder
  },
  bottomNavCenterBubbleActive: {
    backgroundColor: "#6C5CE7"
  },
  bottomNavText: {
    color: theme.textMuted,
    fontWeight: "600",
    fontSize: 10,
    textAlign: "center"
  },
  bottomNavTextActive: {
    color: theme.navActive
  },
  heroSidebarToggle: {
    alignSelf: "center",
    marginTop: 0,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: theme.accentTint
  },
  heroSidebarToggleText: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1
  },
  profileCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border
    
  },
  profileLabel: {
    color: theme.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 8
  },
  profileValue: {
    color: theme.text,
    fontWeight: "700"
  },
  orderSummary: {
    backgroundColor: theme.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border
  },
  openOrderButton: {
    backgroundColor: theme.accent,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.modalOverlay,
    justifyContent: "flex-end"
  },
  modalSheet: {
    backgroundColor: theme.panelBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border
  },
  modalTitle: {
    color: theme.text,
    fontWeight: "700",
    fontSize: 16
  },
  modalClose: {
    color: theme.accent,
    fontWeight: "700"
  },
  modalContent: {
    padding: 20
  },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    zIndex: 20
  },
  drawerBackdrop: {
    flex: 1
  },
  drawerPanel: {
    width: 220,
    backgroundColor: theme.panelBg,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 10,
    borderRightWidth: 1,
    borderRightColor: theme.border,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6
  },
  drawerTitle: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 1
  },
  drawerItem: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.panelItemBg
  },
  drawerItemActive: {
    borderColor: "#F58A3B",
    backgroundColor: "rgba(245, 138, 59, 0.2)"
  },
  drawerItemDanger: {
    borderColor: "rgba(239, 68, 68, 0.5)"
  },
  drawerItemText: {
    color: theme.text,
    fontWeight: "700",
    fontSize: 13
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  sectionActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  orderFiltersPanel: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.cardBg,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12
  },
  orderFiltersLabel: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 6
  },
  menuSearchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.inputBg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    gap: 8
  },
  menuSearchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.text,
    paddingVertical: 0
  },
  menuSearchFilterBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.accentTint
  },
  menuCategoryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    paddingRight: 8
  },
  menuCategoryCard: {
    width: 74,
    minHeight: 70,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.chipBg,
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  menuCategoryCardActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentSoft
  },
  menuCategoryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.accentTint,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    alignItems: "center",
    justifyContent: "center"
  },
  menuCategoryText: {
    color: theme.textMuted,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center"
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.chipBg
  },
  filterChipActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentSoft
  },
  filterChipText: {
    color: theme.textMuted,
    fontWeight: "700",
    fontSize: 11
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.accent
  },
  trendingRow: {
    gap: 14,
    paddingBottom: 12
  },
  trendingCard: {
    width: 270,
    backgroundColor: theme.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.accent,
     borderRightWidth: 4,
    borderRightColor: theme.accent,
     borderBottomWidth: 4,
    borderBottomColor: theme.accent,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  trendingTopGlow: {
    height: 5,
    backgroundColor: theme.accent
  },
  trendingBody: {
    padding: 14,
    gap: 8
  },
  trendingHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  trendingTitle: {
    color: theme.text,
    fontWeight: "700",
    fontSize: 16,
    flex: 1
  },
  trendingMeta: {
    color: theme.textMuted,
    fontSize: 12
  },
  trendingMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  trendingChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.accentFade
  },
  trendingChipText: {
    color: theme.textMuted,
    fontSize: 11,
    fontWeight: "700"
  },
  trendingChipPrice: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    backgroundColor: theme.accentSoft
  },
  trendingChipPriceText: {
    color: theme.accentStrong,
    fontSize: 11,
    fontWeight: "800"
  },
  trendingHotBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.5)",
    backgroundColor: "rgba(220, 38, 38, 0.14)"
  },
  trendingHotBadgeText: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4
  },
  orderMiniButton: {
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    backgroundColor: theme.accentTint,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  orderMiniText: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3
  },
  seatMapLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10
  },
  seatMapChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  seatMapChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  seatMapChipText: {
    color: "#7B6D61",
    fontSize: 11,
    fontWeight: "600"
  },
  seatMapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  seatMapTile: {
    flexGrow: 1,
    flexBasis: "48%",
    minWidth: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7D9C2",
    padding: 12,
    gap: 6
  },
  seatMapTileFree: {
    backgroundColor: "#F2FBF6",
    borderColor: "#34D399"
  },
  seatMapTilePending: {
    backgroundColor: "#FFF6E5",
    borderColor: "#FCD34D"
  },
  seatMapTileBooked: {
    backgroundColor: "#FFF1F1",
    borderColor: "#F87171"
  },
  seatMapTitleFree: {
    color: "#15803D"
  },
  seatMapTitlePending: {
    color: "#B45309"
  },
  seatMapTitleBooked: {
    color: "#B91C1C"
  },
  seatMapMetaFree: {
    color: "#2F855A"
  },
  seatMapMetaPending: {
    color: "#B7791F"
  },
  seatMapMetaBooked: {
    color: "#C53030"
  },
  seatMapCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.border,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
    padding: 14,
    marginBottom: 12,
    gap: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  seatMapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  seatMapTitle: {
    color: "#2D201A",
    fontWeight: "700"
  },
  seatMapMeta: {
    color: "#7D5B4A",
    fontSize: 12
  },
  seatMapBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  seatMapBadgeOpen: {
    backgroundColor: "rgba(34, 197, 94, 0.2)"
  },
  seatMapBadgeFull: {
    backgroundColor: "rgba(239, 68, 68, 0.2)"
  },
  seatMapBadgeText: {
    color: "#2B1A0E",
    fontWeight: "700",
    fontSize: 11
  },
  menuCard: {
    backgroundColor: theme.cardBg,
    borderWidth: 1,
    borderColor: theme.border,
  
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  cardImage: {
    width: "100%",
    height: 160
  },
  cardImagePlaceholder: {
    height: 160,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center"
  },
  cardImageText: {
    color: "#9CA3AF",
    fontSize: 12
  },
  menuMetaStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.accentFade,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  menuMetaText: {
    color: theme.accent,
    fontSize: 10,
    fontWeight: "700"
  },
  menuContent: {
    padding: 14,
    gap: 8
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.text
  },
  menuDescription: {
    fontSize: 12,
    color: theme.textMuted
  },
  menuRating: {
    fontSize: 12,
    color: theme.textMuted
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1
  },
  statusOk: {
    backgroundColor: "rgba(22, 163, 74, 0.14)",
    borderColor: "rgba(22, 163, 74, 0.4)"
  },
  statusNo: {
    backgroundColor: "rgba(220, 38, 38, 0.14)",
    borderColor: "rgba(220, 38, 38, 0.4)"
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.text
  },
  orderCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: theme.border,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  orderTypeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  orderTypeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.borderAccent
  },
  orderTypeActive: {
    backgroundColor: theme.accentSoft
  },
  orderTypeText: {
    color: theme.text,
    fontWeight: "600",
    fontSize: 12
  },
  orderDropdown: {
    borderWidth: 1,
    borderColor: theme.borderAccent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.inputBg,
    marginBottom: 11
  },
  orderDropdownOpen: {
    borderColor: theme.accent
  },
  orderDropdownText: {
    color: theme.text,
    fontWeight: "600"
  },
  orderDropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 8,
    gap: 6
  },
  orderDropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.inputBg
  },
  orderDropdownOptionActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentFade
  },
  orderDropdownOptionText: {
    color: theme.text,
    fontWeight: "600"
  },
  orderDropdownOptionTextActive: {
    color: theme.accent
  },
  tableRow: {
    gap: 10,
    paddingBottom: 10
  },
  tableChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.chipBg,
    minWidth: 120
  },
  tableChipActive: {
    borderColor: theme.accent
  },
  tableChipTitle: {
    color: theme.text,
    fontWeight: "700"
  },
  tableChipMeta: {
    color: theme.textMuted,
    fontSize: 11
  },
  cartBox: {
    marginTop: 8,
    gap: 10
  },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.cardBg,
    padding: 10,
    borderRadius: 10
  },
  cartInfo: {
    flex: 1
  },
  cartName: {
    color: theme.text,
    fontWeight: "600"
  },
  cartMeta: {
    color: theme.textMuted,
    fontSize: 11
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  qtyButton: {
    backgroundColor: theme.accent,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 32,
    alignItems: "center"
  },
  qtyText: {
    color: theme.primaryText,
    fontWeight: "700"
  },
  qtyValue: {
    color: theme.text,
    fontWeight: "700"
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6
  },
  totalLabel: {
    color: theme.text,
    fontWeight: "700"
  },
  totalValue: {
    color: theme.accent,
    fontWeight: "700"
  },
  placeOrderButton: {
    backgroundColor: theme.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    alignItems: "center"
  },
  orderActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  actionGhost: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.borderAccent,
    backgroundColor: theme.accentTint,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center"
  },
  actionGhostActive: {
    backgroundColor: theme.accent,
    borderColor: theme.accent
  },
  actionGhostText: {
    color: theme.accent,
    fontWeight: "700",
    fontSize: 12
  },
  actionGhostActiveText: {
    color: "#FFFFFF"
  },
  actionPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.accent,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center"
  },
  actionPrimaryText: {
    color: theme.primaryText,
    fontWeight: "700",
    fontSize: 12
  },
  addButton: {
    marginTop: 8,
    backgroundColor: theme.accent,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center"
  },
  addButtonText: {
    color: "#0A0A0A",
    fontWeight: "700",
    fontSize: 12
  },
  paymentStatusBubble: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1
  },
  paymentStatusBubblePaid: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.45)"
  },
  paymentStatusBubbleUnpaid: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.45)"
  },
  paymentStatusBubbleText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3
  },
  paymentStatusBubbleTextPaid: {
    color: "#16A34A"
  },
  paymentStatusBubbleTextUnpaid: {
    color: "#DC2626"
  }
});

export { lightTheme, darkTheme, createStyles };

