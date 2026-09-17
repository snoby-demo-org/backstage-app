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

/**
 * Palette tokens — single source of truth for surfaces, text and accent.
 * Mirrored 1:1 as --bui-* / --app-* variables in ../styles.css.
 *
 * Surfaces are a cool slate scale tinted toward the navy sidebar, so the
 * canvas, cards and panels read as one family: navy = navigation/brand,
 * blue = accents/links/selection, slate = everything the content sits on.
 */
export const tokens = {
  light: {
    accent: '#0b6bcb',
    accentHover: '#0a5cae',
    accentPressed: '#0a4f96',
    accentLight: '#4a90e2',
    canvas: '#f3f6fa', // page background (was default grey #f8f8f8/#f5f5f5)
    surface: '#ffffff', // cards, Paper, tables
    panel: '#e9eff6', // recessed panels: catalog filters, list pickers
    border: '#dde4ee',
    borderStrong: '#c3cedc',
    text: '#0f1b2d', // = sidebar navy, so body text ties to the nav
    textSubtle: '#4a5a70',
    textVerySubtle: '#c3cedc',
    nav: '#0f1b2d',
    navSubmenu: '#15243a',
    navText: '#a9b4c4',
    navIndicator: '#4a9af5',
  },
  dark: {
    accent: '#5aa2f0',
    accentHover: '#8cc0f7',
    accentPressed: '#3f86d6',
    accentLight: '#8cc0f7',
    canvas: '#0f1724',
    surface: '#172233',
    panel: '#131d2c',
    border: '#243247',
    borderStrong: '#34465f',
    text: '#e6ecf4',
    textSubtle: '#9aa8ba',
    textVerySubtle: '#4a5a70',
    nav: '#0a101a',
    navSubmenu: '#111a28',
    navText: '#98a2b3',
    navIndicator: '#5aa2f0',
  },
};

type Tokens = typeof tokens.light;

/**
 * Avenir Next: a humanist-geometric sans that ships with every macOS, with
 * true 400/500/600/700 weights. No font loading. Windows falls back to Segoe
 * UI Variable, Linux to its system UI font. Mirror of --bui-font-regular.
 */
const fontFamily =
  '"Avenir Next", "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';

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

const makeComponents = (t: Tokens): UnifiedThemeOptions['components'] => ({
  MuiTypography: {
    styleOverrides: {
      root: { letterSpacing: '0' },
      h1: { lineHeight: 1.2, letterSpacing: '-0.01em' },
      h2: { lineHeight: 1.25, letterSpacing: '-0.01em' },
      h3: { lineHeight: 1.3, letterSpacing: '-0.005em' },
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
      root: {
        borderRadius: 8,
        boxShadow: 'none',
        border: `1px solid ${t.border}`,
        backgroundColor: t.surface,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      outlined: { borderColor: t.border },
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
  MuiListItem: {
    styleOverrides: {
      root: { paddingTop: 6, paddingBottom: 6 },
      dense: { paddingTop: 4, paddingBottom: 4 },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: { minWidth: 32, color: 'inherit' },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: { minHeight: 0, fontSize: 13.5 },
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: { fontSize: 13, fontWeight: 600, lineHeight: 1.6, color: 'inherit' },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: { fontSize: 13.5 },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: 6 },
      input: { paddingTop: 7, paddingBottom: 7 },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: { fontSize: 13, fontWeight: 500 },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        border: `1px solid ${t.border}`,
        '&:before': { display: 'none' },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: { minHeight: 40, '&.Mui-expanded': { minHeight: 40 } },
      content: { margin: '8px 0', '&.Mui-expanded': { margin: '8px 0' } },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: { padding: '8px 16px 12px' },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { padding: '8px 12px', fontSize: 13, borderBottomColor: t.border },
      head: { color: t.textSubtle, fontWeight: 600 },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: { backgroundColor: t.border },
    },
  },
  BackstageHeader: {
    styleOverrides: {
      header: {
        padding: '16px 24px',
        backgroundImage: 'none',
        boxShadow: 'none',
        borderBottom: `1px solid ${t.border}`,
      },
      title: { fontSize: 24, letterSpacing: '-0.01em' },
    },
  },
  BackstageContent: {
    styleOverrides: {
      root: { padding: 20, backgroundColor: t.canvas },
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
});

// MUI page headers (entity pages, catalog graph…) sit flat on the canvas like
// the BUI headers do, so their text uses the palette's text colour rather than
// the default white-on-burst.
const makePageTheme = (t: Tokens) => ({
  colors: [t.nav, t.accent],
  shape: 'none',
  backgroundImage: 'none',
  fontColor: t.text,
});

const makePalette = (
  base: typeof palettes.light | typeof palettes.dark,
  t: Tokens,
  fg: { secondary: string },
) => ({
  ...base,
  background: { default: t.canvas, paper: t.surface },
  text: { primary: t.text, secondary: t.textSubtle },
  divider: t.border,
  border: t.border,
  textSubtle: t.textSubtle,
  textVerySubtle: t.textVerySubtle,
  primary: { main: t.accent, light: t.accentLight, dark: t.accentPressed },
  secondary: { main: fg.secondary },
  link: t.accent,
  linkHover: t.accentHover,
  navigation: {
    background: t.nav,
    indicator: t.navIndicator,
    color: t.navText,
    selectedColor: '#ffffff',
    navItem: { hoverBackground: 'rgba(255, 255, 255, 0.06)' },
    submenu: { background: t.navSubmenu },
  },
  tabbar: { indicator: t.accent },
});

export const blueLightTheme = createUnifiedTheme({
  palette: makePalette(palettes.light, tokens.light, { secondary: '#4a5a70' }),
  fontFamily,
  typography,
  defaultPageTheme: 'home',
  pageTheme: { home: makePageTheme(tokens.light) },
  components: makeComponents(tokens.light),
});

export const blueDarkTheme = createUnifiedTheme({
  palette: makePalette(palettes.dark, tokens.dark, { secondary: '#9aa8ba' }),
  fontFamily,
  typography,
  defaultPageTheme: 'home',
  pageTheme: { home: makePageTheme(tokens.dark) },
  components: makeComponents(tokens.dark),
});
