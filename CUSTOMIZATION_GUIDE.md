# Magic Markup - Customization Guide

## Overview

This guide explains how to use `magic-markup-wrapper.css` to customize Magic Markup for better integration with your existing styles.

## Quick Start

### Basic Usage

Load the wrapper **after** the main CSS file:

```html
<!-- Load base styles -->
<link rel="stylesheet" href="magic-markup.css">

<!-- Load wrapper for customizations -->
<link rel="stylesheet" href="magic-markup-wrapper.css">
```

### With Dark Theme

The wrapper works with both light and dark themes:

```html
<!-- Load base styles -->
<link rel="stylesheet" href="magic-markup.css">

<!-- Load dark theme -->
<link rel="stylesheet" href="magic-markup-dark.css">

<!-- Load wrapper (works with both themes!) -->
<link rel="stylesheet" href="magic-markup-wrapper.css">
```

## Font Size Inheritance

### The Problem

If your project has custom font-size settings like:

```css
html {
  font-size: 52%;
}
```

Magic Markup will render with very small fonts because it uses fixed `rem` and `px` values.

### The Solution

1. Open `src/magic-markup-wrapper.css`
2. Find the **FONT SIZE INHERITANCE** section
3. Remove the `/*` at the beginning and `*/` at the end to uncomment it

**Before (commented out):**
```css
/*
.mm-container { font-size: inherit !important; }
.mm-header h1 { font-size: inherit !important; }
...
*/
```

**After (active):**
```css
.mm-container { font-size: inherit !important; }
.mm-header h1 { font-size: inherit !important; }
...
```

That's it! Magic Markup will now inherit font-sizes from your existing CSS.

## Custom Overrides

The wrapper includes examples of common customizations. Simply uncomment and modify them as needed.

### Change Primary Color

```css
:root {
    --mm-primary-color: #8b5cf6 !important;
    --mm-primary-hover: #7c3aed !important;
}
```

### Adjust Container Width

```css
.mm-container {
    max-width: 1600px !important;
}
```

### Increase Padding

```css
.mm-container {
    padding: 2rem 1rem !important;
}
```

### Change Border Radius

```css
:root {
    --mm-radius-sm: 0.125rem !important;
    --mm-radius-md: 0.25rem !important;
    --mm-radius-lg: 0.5rem !important;
}
```

### Adjust Spacing

```css
:root {
    --mm-spacing-xs: 0.25rem !important;
    --mm-spacing-sm: 0.5rem !important;
    --mm-spacing-md: 1rem !important;
    --mm-spacing-lg: 1.5rem !important;
    --mm-spacing-xl: 2rem !important;
}
```

### Use Custom Font

```css
.mm-container {
    font-family: 'Your Custom Font', -apple-system, sans-serif !important;
}
```

### Hide Elements

```css
.mm-stats {
    display: none !important;
}
```

## Why Use a Wrapper?

### Benefits

✅ **Small file size** - Only ~150 lines vs 800+ for a full duplicate  
✅ **Works with themes** - Compatible with both light and dark modes  
✅ **Easy to maintain** - Single source of truth  
✅ **Flexible** - Can be added/removed without replacing files  
✅ **Self-documenting** - Clear examples and instructions  

### Comparison

**Without Wrapper:**
- Need to duplicate entire CSS file
- Hard to maintain when base CSS updates
- Can't easily use with dark theme

**With Wrapper:**
- Small override file
- Easy to update
- Works with all themes
- Clear separation of concerns

## Advanced Usage

### Multiple Customizations

You can combine multiple customizations:

```css
/* Enable font inheritance */
.mm-container { font-size: inherit !important; }
.mm-header h1 { font-size: inherit !important; }
/* ... rest of font inheritance ... */

/* Change colors */
:root {
    --mm-primary-color: #8b5cf6 !important;
}

/* Adjust spacing */
.mm-container {
    padding: 2rem !important;
}
```

### Project-Specific Wrapper

For team projects, you can:

1. Copy `magic-markup-wrapper.css` to your project
2. Uncomment/modify the sections you need
3. Commit it to version control
4. Everyone on the team uses the same customizations

### Conditional Loading

Load the wrapper only when needed:

```html
<!-- Only load wrapper for specific pages -->
<link rel="stylesheet" href="magic-markup.css">
<link rel="stylesheet" href="magic-markup-dark.css">

<!-- Conditionally load wrapper -->
<?php if ($needsCustomization): ?>
    <link rel="stylesheet" href="magic-markup-wrapper.css">
<?php endif; ?>
```

## Troubleshooting

### Customizations Not Applying

1. **Check load order** - Wrapper must come AFTER base CSS
2. **Check !important** - All overrides use `!important` to ensure they apply
3. **Clear cache** - Browser may be caching old CSS
4. **Inspect element** - Use DevTools to see which styles are applied

### Font Inheritance Not Working

1. **Verify uncommented** - Make sure you removed `/*` and `*/`
2. **Check parent styles** - Ensure your project has font-size styles defined
3. **Inspect elements** - Use DevTools to verify inheritance chain

### Dark Theme Issues

1. **Load order matters** - Use this order:
   ```html
   <link rel="stylesheet" href="magic-markup.css">
   <link rel="stylesheet" href="magic-markup-dark.css">
   <link rel="stylesheet" href="magic-markup-wrapper.css">
   ```

## File Structure

```
src/
├── magic-markup.css           # Base styles (required)
├── magic-markup-dark.css      # Dark theme (optional)
└── magic-markup-wrapper.css   # Customizations (optional)
```

## Migration from Old Approach

If you were using the old `magic-markup-inherit.css`:

**Old way:**
```html
<link rel="stylesheet" href="magic-markup-inherit.css">
```

**New way:**
```html
<link rel="stylesheet" href="magic-markup.css">
<link rel="stylesheet" href="magic-markup-wrapper.css">
```

Then uncomment the font inheritance section in the wrapper.

## Need Help?

If you encounter issues:

1. Check this guide for common solutions
2. Inspect elements in browser DevTools
3. Verify load order of CSS files
4. Check that customizations are uncommented
5. Report issues on GitHub

---

**Version:** 1.0.0  
**Last Updated:** November 2025
