const fs = require("fs");
const path = require("path");

// Project setup: output to project assets (submodule-safe - don't write to theme)
const themePath = path.join(__dirname, "../data/theme.json");
const outputPath = path.join(__dirname, "../assets/css/generated-theme.css");

const toKebab = (str) => str.replace(/_/g, "-");
const findFont = (fontStr) =>
  fontStr.replace(/\+/g, " ").replace(/:[^:]+/g, "");

function addColorsToCss(cssLines, colors, prefix = "") {
  Object.entries(colors).forEach(([key, value]) => {
    const colorName = prefix
      ? `--color-${prefix}-${toKebab(key)}`
      : `--color-${toKebab(key)}`;
    cssLines.push(`  ${colorName}: ${value};`);
  });
}

function generateThemeCSS() {
  if (!fs.existsSync(themePath)) {
    throw new Error(`Theme configuration not found: ${themePath}`);
  }

  const themeConfig = JSON.parse(fs.readFileSync(themePath, "utf8"));
  if (!themeConfig.colors || !themeConfig.fonts) {
    throw new Error("Invalid theme.json: missing 'colors' or 'fonts' section");
  }

  const cssLines = [
    "/**",
    ' * Auto-generated from "data/theme.json"',
    " * DO NOT EDIT - Run: node scripts/themeGenerator.js",
    " */",
    "",
    "@theme {",
    "  /* === Colors === */",
  ];

  if (themeConfig.colors.default?.theme_color) {
    addColorsToCss(cssLines, themeConfig.colors.default.theme_color);
  }
  if (themeConfig.colors.default?.text_color) {
    addColorsToCss(cssLines, themeConfig.colors.default.text_color);
    const tc = themeConfig.colors.default.text_color;
    cssLines.push(`  --color-text: ${tc.default};`);
    cssLines.push(`  --color-text-default: ${tc.default};`);
    cssLines.push(`  --color-text-dark: ${tc.dark};`);
    cssLines.push(`  --color-text-light: ${tc.light};`);
  }

  if (themeConfig.colors.darkmode) {
    cssLines.push("", "  /* === Darkmode Colors === */");
    if (themeConfig.colors.darkmode.theme_color) {
      addColorsToCss(cssLines, themeConfig.colors.darkmode.theme_color, "darkmode");
    }
    if (themeConfig.colors.darkmode.text_color) {
      addColorsToCss(cssLines, themeConfig.colors.darkmode.text_color, "darkmode");
      const dtc = themeConfig.colors.darkmode.text_color;
      cssLines.push(`  --color-darkmode-text: ${dtc.default};`);
      cssLines.push(`  --color-darkmode-text-default: ${dtc.default};`);
      cssLines.push(`  --color-darkmode-text-dark: ${dtc.dark};`);
      cssLines.push(`  --color-darkmode-text-light: ${dtc.light};`);
    }
  }

  cssLines.push("", "  /* === Font Families === */");
  const fontFamily = themeConfig.fonts.font_family || {};
  Object.entries(fontFamily)
    .filter(([key]) => !key.includes("type"))
    .forEach(([key, font]) => {
      const fontFallback = fontFamily[`${key}_type`] || "sans-serif";
      cssLines.push(`  --font-${toKebab(key)}: ${findFont(font)}, ${fontFallback};`);
    });

  cssLines.push("", "  /* === Font Sizes === */");
  const baseSize = Number(themeConfig.fonts.font_size?.base || 16);
  const scale = Number(themeConfig.fonts.font_size?.scale || 1.25);
  cssLines.push(`  --text-base: ${baseSize}px;`);
  cssLines.push(`  --text-base-sm: ${baseSize * 0.8}px;`);
  let currentSize = scale;
  for (let i = 6; i >= 1; i--) {
    cssLines.push(`  --text-h${i}: ${currentSize}rem;`);
    cssLines.push(`  --text-h${i}-sm: ${currentSize * 0.9}rem;`);
    currentSize *= scale;
  }
  cssLines.push("}");

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, cssLines.join("\n") + "\n");
  console.log("✅ Theme CSS generated at:", outputPath);
}

try {
  generateThemeCSS();
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}

if (process.argv.includes("--watch")) {
  let debounceTimer;
  fs.watch(themePath, (eventType) => {
    if (eventType === "change") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          generateThemeCSS();
        } catch (e) {
          console.error("❌ Error:", e.message);
        }
      }, 300);
    }
  });
  process.on("SIGINT", () => process.exit(0));
  console.log("👁️  Watching:", themePath);
}
