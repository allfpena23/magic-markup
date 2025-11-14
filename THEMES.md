# 🎨 Magic Markup Themes Guide

Magic Markup comes with a powerful theming system that allows you to customize the appearance of your rendered JSON data. Choose from built-in themes or create your own custom theme from a single color!

## Table of Contents

- [Built-in Themes](#built-in-themes)
- [Using Themes](#using-themes)
- [Custom Theme Generator](#custom-theme-generator)
- [Theme API Reference](#theme-api-reference)
- [Advanced Customization](#advanced-customization)

---

## Built-in Themes

### 1. Light Theme (Default)
Clean, professional design with blue accents and white backgrounds.

**Colors:**
- Primary: `#2563eb` (Blue)
- Background: `#ffffff` (White)
- Text: `#0f172a` (Dark Slate)

**Usage:**
```javascript
MagicMarkup.setTheme('light');
```

### 2. Dark Theme
Modern dark mode with vibrant accents, perfect for low-light environments.

**Colors:**
- Primary: `#60a5fa` (Light Blue)
- Background: `#1e293b` (Dark Slate)
- Text: `#f1f5f9` (Light Gray)

**Usage:**
```javascript
MagicMarkup.setTheme('dark');
```

**Include the dark theme CSS:**
```html
<link rel="stylesheet" href="magic-markup.css">
<link rel="stylesheet" href="magic-markup-dark.css">
```

---

## Using Themes

### Basic Theme Switching

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="magic-markup.css">
    <link rel="stylesheet" href="magic-markup-dark.css">
</head>
<body>
    <button onclick="MagicMarkup.setTheme('light')">Light</button>
    <button onclick="MagicMarkup.setTheme('dark')">Dark</button>
    
    <div id="container"></div>
    
    <script src="magic-markup.js"></script>
    <script>
        MagicMarkup.render('#container', yourData);
    </script>
</body>
</html>
```

### Persistent Theme Selection

Save user's theme preference:

```javascript
// Load saved theme on page load
const savedTheme = localStorage.getItem('mm-theme') || 'light';
MagicMarkup.setTheme(savedTheme);

// Save theme when changed
function changeTheme(theme) {
    MagicMarkup.setTheme(theme);
    localStorage.setItem('mm-theme', theme);
}
```

### System Preference Detection

Automatically use dark mode based on system settings:

```javascript
// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
MagicMarkup.setTheme(prefersDark ? 'dark' : 'light');

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    MagicMarkup.setTheme(e.matches ? 'dark' : 'light');
});
```

---

## Custom Theme Generator

The most powerful feature! Generate a complete, cohesive theme from a single primary color.

### How It Works

Magic Markup uses **color theory algorithms** to automatically generate:
- ✅ Complementary colors for success/error/warning states
- ✅ Properly contrasted backgrounds and text colors
- ✅ Hover states and interactive elements
- ✅ Border colors and shadows
- ✅ All semantic color variations

### Basic Usage

```javascript
// Generate and apply a purple theme
MagicMarkup.setCustomTheme('#8b5cf6');

// Generate a green theme
MagicMarkup.setCustomTheme('#10b981');

// Generate an orange theme
MagicMarkup.setCustomTheme('#f59e0b');
```

### Advanced Usage

Generate a theme without applying it:

```javascript
// Generate theme object
const theme = MagicMarkup.generateTheme('#8b5cf6');

console.log(theme);
// {
//   primary: '#8b5cf6',
//   primaryHover: '#7c3aed',
//   secondary: '#a78bfa',
//   success: '#10b981',
//   error: '#ef4444',
//   warning: '#f59e0b',
//   bgPrimary: '#faf5ff',
//   bgSecondary: '#f5f3ff',
//   textPrimary: '#1e1b4b',
//   ... and more
// }

// Apply it later
MagicMarkup.applyTheme(theme);
```

### Modify Generated Theme

```javascript
// Generate base theme
const theme = MagicMarkup.generateTheme('#8b5cf6');

// Customize specific colors
theme.success = '#22c55e';  // Custom success color
theme.error = '#dc2626';    // Custom error color

// Apply modified theme
MagicMarkup.applyTheme(theme);
```

### Brand Color Integration

Perfect for matching your brand:

```javascript
// Use your brand's primary color
const brandColor = '#FF6B6B';  // Your brand color
MagicMarkup.setCustomTheme(brandColor);

// Now all Magic Markup instances match your brand!
```

---

## Theme API Reference

### `MagicMarkup.setTheme(theme)`

Switch between built-in themes.

**Parameters:**
- `theme` (string): `'light'` or `'dark'`

**Example:**
```javascript
MagicMarkup.setTheme('dark');
```

---

### `MagicMarkup.setCustomTheme(color)`

Generate and apply a complete theme from a single color.

**Parameters:**
- `color` (string): Hex color code (e.g., `'#8b5cf6'`)

**Example:**
```javascript
MagicMarkup.setCustomTheme('#8b5cf6');
```

---

### `MagicMarkup.generateTheme(color)`

Generate a theme object without applying it.

**Parameters:**
- `color` (string): Hex color code

**Returns:**
- `Object`: Theme configuration object

**Example:**
```javascript
const theme = MagicMarkup.generateTheme('#8b5cf6');
console.log(theme.primary);  // '#8b5cf6'
console.log(theme.success);  // Auto-generated green
```

---

### `MagicMarkup.applyTheme(theme)`

Apply a theme object to the document.

**Parameters:**
- `theme` (Object): Theme configuration object

**Example:**
```javascript
const customTheme = {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    success: '#10b981',
    error: '#ef4444',
    // ... more colors
};

MagicMarkup.applyTheme(customTheme);
```

---

## Advanced Customization

### CSS Variables Override

You can override specific CSS variables without using the theme API:

```css
:root {
    --mm-primary-color: #your-color;
    --mm-bg-primary: #your-bg;
    --mm-text-primary: #your-text;
}
```

### Available CSS Variables

```css
/* Colors */
--mm-primary-color
--mm-primary-hover
--mm-secondary-color
--mm-success-color
--mm-error-color
--mm-warning-color

/* Backgrounds */
--mm-bg-primary
--mm-bg-secondary
--mm-bg-tertiary
--mm-bg-hover

/* Text */
--mm-text-primary
--mm-text-secondary
--mm-text-muted

/* Borders & Shadows */
--mm-border-color
--mm-shadow-sm
--mm-shadow-md
--mm-shadow-lg

/* Spacing */
--mm-spacing-xs
--mm-spacing-sm
--mm-spacing-md
--mm-spacing-lg
--mm-spacing-xl

/* Border Radius */
--mm-radius-sm
--mm-radius-md
--mm-radius-lg

/* Other */
--mm-transition
--mm-font-family
--mm-font-mono
```

### Creating a Custom Theme CSS File

Create your own theme file:

```css
/* my-custom-theme.css */
:root[data-mm-theme="custom"] {
    --mm-primary-color: #ff6b6b;
    --mm-primary-hover: #ff5252;
    --mm-bg-primary: #fff5f5;
    --mm-bg-secondary: #ffe3e3;
    --mm-text-primary: #2d2d2d;
    /* ... more variables */
}
```

Then apply it:

```javascript
document.documentElement.setAttribute('data-mm-theme', 'custom');
```

---

## Color Theory Behind Custom Themes

The custom theme generator uses these principles:

### 1. **Hue Rotation**
- Success: +120° (green zone)
- Error: -120° (red zone)
- Warning: +60° (yellow/orange zone)
- Secondary: +30° (analogous color)

### 2. **Lightness Adjustment**
- Backgrounds: 92-97% lightness (very light)
- Text: 10-35% lightness (dark for contrast)
- Borders: 85% lightness (subtle)

### 3. **Saturation Control**
- Maintains original saturation for primary colors
- Adjusts for backgrounds to avoid overwhelming colors

### 4. **Accessibility**
- Ensures proper contrast ratios
- WCAG AA compliant color combinations

---

## Examples

### Example 1: Theme Switcher

```html
<select onchange="MagicMarkup.setTheme(this.value)">
    <option value="light">Light Theme</option>
    <option value="dark">Dark Theme</option>
</select>
```

### Example 2: Color Picker

```html
<input type="color" id="themeColor" value="#8b5cf6">
<button onclick="MagicMarkup.setCustomTheme(document.getElementById('themeColor').value)">
    Apply Theme
</button>
```

### Example 3: Preset Colors

```javascript
const presets = {
    purple: '#8b5cf6',
    green: '#10b981',
    orange: '#f59e0b',
    red: '#ef4444',
    cyan: '#06b6d4'
};

function applyPreset(name) {
    MagicMarkup.setCustomTheme(presets[name]);
}
```

---

## Demo

Check out the interactive theme demo:

```bash
# Open the theme demo
open examples/theme-demo.html
```

The demo includes:
- ✅ Light/Dark theme toggle
- ✅ Custom color picker
- ✅ 8 preset color themes
- ✅ Live preview of all components
- ✅ Real-time theme generation

---

## Best Practices

1. **Consistency**: Stick to one theme throughout your application
2. **User Preference**: Remember user's theme choice in localStorage
3. **System Integration**: Respect system dark mode preferences
4. **Brand Alignment**: Use custom themes to match your brand colors
5. **Accessibility**: Test color contrast for readability

---

## Troubleshooting

### Theme not applying?

Make sure you've included the CSS files:
```html
<link rel="stylesheet" href="magic-markup.css">
<link rel="stylesheet" href="magic-markup-dark.css">
```

### Custom theme looks wrong?

Ensure you're passing a valid hex color:
```javascript
// ✅ Correct
MagicMarkup.setCustomTheme('#8b5cf6');

// ❌ Wrong
MagicMarkup.setCustomTheme('purple');
MagicMarkup.setCustomTheme('8b5cf6');  // Missing #
```

### Dark theme not working?

Check that the dark theme CSS is loaded and the data attribute is set:
```javascript
MagicMarkup.setTheme('dark');
// Should set: <html data-mm-theme="dark">
```

---

## Contributing

Have ideas for new themes? Submit a pull request or open an issue!

---

Made with 🎨 by the Magic Markup Team
