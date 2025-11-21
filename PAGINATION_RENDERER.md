# Pagination Renderer

A custom renderer for Magic Markup that provides full pagination controls with navigation.

## Features

- ✅ **Previous/Next Navigation** - Easy page navigation with arrow buttons
- ✅ **Page Number Buttons** - Jump directly to any page
- ✅ **Items Per Page Selector** - Dynamically change the number of items displayed
- ✅ **View Toggle** - Switch between table and card views
- ✅ **Smart Page Numbering** - Shows ellipsis for large page counts
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Accessible** - ARIA labels and keyboard navigation support

## Installation

### 1. Include Required Files

```html
<!-- CSS files -->
<link rel="stylesheet" href="path/to/magic-markup.css">
<link rel="stylesheet" href="path/to/renderers/pagination-renderer.css">

<!-- JavaScript files -->
<script src="path/to/magic-markup.js"></script>
<script src="path/to/renderers/pagination-renderer.js"></script>
```

## Usage

### Basic Example

```javascript
// Create the pagination renderer
const paginationRenderer = createPaginationRenderer({
    itemsPerPage: 10,
    showPageNumbers: true,
    maxPageButtons: 7,
    showItemsPerPageSelector: true,
    itemsPerPageOptions: [5, 10, 25, 50, 100],
    viewMode: null  // null = toggle, 'table' = table only, 'cards' = cards only
});

// Register the renderer for your data key
MagicMarkup.registerRenderer('products', paginationRenderer);

// Render your data
const data = {
    products: [
        { id: 1, name: "Product 1", price: 29.99, stock: 100 },
        { id: 2, name: "Product 2", price: 39.99, stock: 50 },
        // ... more products
    ]
};

MagicMarkup.render('#container', data);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `itemsPerPage` | Number | 10 | Number of items to display per page |
| `showPageNumbers` | Boolean | true | Show page number buttons |
| `maxPageButtons` | Number | 7 | Maximum number of page buttons to display |
| `showItemsPerPageSelector` | Boolean | true | Show the items per page dropdown |
| `itemsPerPageOptions` | Array | [5, 10, 25, 50, 100] | Options for the items per page selector |
| `viewMode` | String | null | View mode: `null` (toggle), `'table'`, or `'cards'` |

## Examples

### Example 1: Table View Only

```javascript
const tableRenderer = createPaginationRenderer({
    itemsPerPage: 20,
    viewMode: 'table'  // Force table view, no toggle
});

MagicMarkup.registerRenderer('users', tableRenderer);
```

### Example 2: Card View Only

```javascript
const cardRenderer = createPaginationRenderer({
    itemsPerPage: 12,
    viewMode: 'cards'  // Force card view, no toggle
});

MagicMarkup.registerRenderer('products', cardRenderer);
```

### Example 3: Custom Page Sizes

```javascript
const customRenderer = createPaginationRenderer({
    itemsPerPage: 50,
    itemsPerPageOptions: [25, 50, 100, 200],
    maxPageButtons: 5
});

MagicMarkup.registerRenderer('logs', customRenderer);
```

### Example 4: Minimal Pagination

```javascript
const minimalRenderer = createPaginationRenderer({
    itemsPerPage: 10,
    showPageNumbers: false,  // Only show prev/next
    showItemsPerPageSelector: false
});

MagicMarkup.registerRenderer('items', minimalRenderer);
```

## Advanced Usage

### Multiple Renderers

You can use different pagination configurations for different data types:

```javascript
// Products with card view
const productRenderer = createPaginationRenderer({
    itemsPerPage: 12,
    viewMode: null
});

// Orders with table view
const orderRenderer = createPaginationRenderer({
    itemsPerPage: 25,
    viewMode: 'table'
});

// Logs with minimal pagination
const logRenderer = createPaginationRenderer({
    itemsPerPage: 50,
    showPageNumbers: false
});

MagicMarkup.registerRenderer('products', productRenderer);
MagicMarkup.registerRenderer('orders', orderRenderer);
MagicMarkup.registerRenderer('logs', logRenderer);

const data = {
    products: [...],
    orders: [...],
    logs: [...]
};

MagicMarkup.render('#container', data);
```

### Programmatic Control

The renderer maintains state internally. Each instance is independent:

```javascript
const renderer = createPaginationRenderer({
    itemsPerPage: 10
});

// The renderer will handle:
// - Current page tracking
// - Items per page changes
// - View mode switching
// - Page navigation
```

## Styling

The pagination renderer comes with pre-built styles, but you can customize them:

```css
/* Customize pagination buttons */
.mm-pagination-btn {
    background: your-color;
    border-color: your-border-color;
}

.mm-pagination-btn.active {
    background: your-active-color;
}

/* Customize view toggle */
.mm-toggle-button.mm-active {
    background: your-active-color;
}

/* Customize table */
.mm-data-table thead {
    background: your-header-color;
}

/* Customize cards */
.mm-card {
    box-shadow: your-shadow;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## API Reference

### createPaginationRenderer(config)

Creates a new pagination renderer instance.

**Parameters:**
- `config` (Object): Configuration options

**Returns:**
- Renderer object compatible with Magic Markup's `registerRenderer()`

**Example:**
```javascript
const renderer = createPaginationRenderer({
    itemsPerPage: 15,
    showPageNumbers: true
});
```

## Troubleshooting

### Pagination not showing

Make sure you've:
1. Included both CSS files
2. Included both JavaScript files
3. Registered the renderer before calling `render()`
4. Your data is an array of objects

### Styles not applying

Check that:
1. `pagination-renderer.css` is loaded after `magic-markup.css`
2. There are no CSS conflicts with your custom styles
3. The CSS file path is correct

### View toggle not working

Ensure:
1. `viewMode` is set to `null` (not `'table'` or `'cards'`)
2. The renderer is properly registered
3. No JavaScript errors in the console

## Demo

See the live demo at: `examples/pagination-renderer-demo.html`

## License

Same as Magic Markup

## Contributing

Contributions are welcome! Please follow the Magic Markup contribution guidelines.

## Changelog

### Version 1.0.0
- Initial release
- Previous/Next navigation
- Page number buttons
- Items per page selector
- View toggle (table/cards)
- Responsive design
- Accessibility features
