// @/constants/fonts.ts

export const Fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

export const Typography = {
  heading: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
  },
  subHeading: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
  },
  caption: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
  },
  icons: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.lg,
  },
};
