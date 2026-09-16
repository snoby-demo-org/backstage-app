import {
  BackstageTypography,
  createUnifiedTheme,
  palettes,
  UnifiedThemeOptions,
} from '@backstage/theme';

/**
 * "Tighter blue" theme — the MUI half of the reskin.
 *
 * Backstage is mid-migration from MUI to BUI, so this only covers components
 * still rendered with MUI (core-components, most plugins). BUI components are
 * styled via the --bui-* variables in ../styles.css; keep the two in sync.
 */

const blue = {
  main: '#0b6bcb',
  light: '#4a90e2',
  dark: '#0a4f96',
  mainDark: '#5aa2f0',
};

const fontFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const typography: BackstageTypography = {
  htmlFontSize: 16,
  fontFamily,
  h1: { fontSize: 28, fontWeight: 600, marginBottom: 8 },
  h2: { fontSize: 22, fontWeight: 600, marginBottom: 6 },
  h3: { fontSize: 18, fontWeight: 600, marginBottom: 6 },
  h4: { fontSize: 16, fontWeight: 600, marginBottom: 4 },
  h5: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  h6: { fontSize: 13, fontWeight: 600, marginBottom: 2 },
};

const components: UnifiedThemeOptions['components'] = {
  MuiTypography: {
    styleOverrides: {
      root: { letterSpacing: '-0.005em' },
      h1: { lineHeight: 1.2, letterSpacing: '-0.02em' },
      h2: { lineHeight: 1.25, letterSpacing: '-0.015em' },
      h3: { lineHeight: 1.3, letterSpacing: '-0.01em' },
      h4: { lineHeight: 1.3 },
      h5: { lineHeight: 1.35 },
      h6: { lineHeight: 1.35 },
      body1: { fontSize: 14, lineHeight: 1.45 },
      body2: { fontSize: 13, lineHeight: 1.43 },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true, size: 'small' },
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: 13,
        borderRadius: 6,
        padding: '4px 12px',
        minWidth: 0,
        lineHeight: 1.5,
      },
      sizeLarge: { padding: '6px 16px', fontSize: 14 },
      sizeSmall: { padding: '3px 10px', fontSize: 12.5 },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: { padding: 6 },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: { padding: '12px 16px' },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: { padding: '12px 16px', '&:last-child': { paddingBottom: 16 } },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: { padding: '8px 12px' },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { height: 24, fontSize: 12, borderRadius: 6 },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', minHeight: 40, fontWeight: 500 },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { padding: '8px 12px', fontSize: 13 },
    },
  },
  BackstageHeader: {
    styleOverrides: {
      header: { padding: '16px 24px', backgroundImage: 'none', boxShadow: 'none' },
      title: { fontSize: 24, letterSpacing: '-0.02em' },
    },
  },
  BackstageContent: {
    styleOverrides: {
      root: { padding: 20 },
    },
  },
  BackstageSidebarItem: {
    styleOverrides: {
      root: { height: 38, borderRadius: 6 },
      label: { fontWeight: 500, fontSize: 13.5 },
      highlightable: { transition: 'background-color 120ms ease' },
      expandButton: { height: 38 },
    },
  },
  BackstageSidebarDivider: {
    styleOverrides: {
      root: { margin: '8px 12px', opacity: 0.5 },
    },
  },
};

// Flat blue page headers instead of the default multicolored bursts.
const flatBluePageTheme = {
  colors: [blue.dark, blue.main],
  shape: 'none',
  backgroundImage: `linear-gradient(90deg, ${blue.dark}, ${blue.main})`,
  fontColor: '#ffffff',
};

export const blueLightTheme = createUnifiedTheme({
  palette: {
    ...palettes.light,
    primary: { main: blue.main, light: blue.light, dark: blue.dark },
    secondary: { main: '#475467' },
    link: blue.main,
    linkHover: blue.dark,
    navigation: {
      background: '#0f1b2d',
      indicator: '#4a9af5',
      color: '#a9b4c4',
      selectedColor: '#ffffff',
      navItem: { hoverBackground: 'rgba(255, 255, 255, 0.06)' },
      submenu: { background: '#15243a' },
    },
    tabbar: { indicator: blue.main },
  },
  fontFamily,
  typography,
  defaultPageTheme: 'home',
  pageTheme: { home: flatBluePageTheme },
  components,
});

export const blueDarkTheme = createUnifiedTheme({
  palette: {
    ...palettes.dark,
    primary: { main: blue.mainDark, light: '#8cc0f7', dark: blue.main },
    secondary: { main: '#98a2b3' },
    link: blue.mainDark,
    linkHover: '#8cc0f7',
    navigation: {
      background: '#0b111b',
      indicator: '#5aa2f0',
      color: '#98a2b3',
      selectedColor: '#ffffff',
      navItem: { hoverBackground: 'rgba(255, 255, 255, 0.06)' },
      submenu: { background: '#121a27' },
    },
    tabbar: { indicator: blue.mainDark },
  },
  fontFamily,
  typography,
  defaultPageTheme: 'home',
  pageTheme: { home: flatBluePageTheme },
  components,
});
