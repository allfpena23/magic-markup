# 🪄 Magic Markup

**Transform JSON data into beautiful, interactive HTML with zero configuration.**

Magic Markup is a lightweight, powerful JavaScript library that converts JSON objects into clean, responsive HTML markup with built-in support for tables, cards, accordions, and custom button actions.

## ✨ Features

- 🚀 **Zero Dependencies** - Pure vanilla JavaScript
- 🎨 **Beautiful UI** - Modern, responsive design out of the box
- 🔧 **Highly Customizable** - Custom buttons, handlers, and styling
- 📱 **Mobile Friendly** - Fully responsive design
- ⚡ **Lightweight** - ~50KB total (unminified)
- 🎯 **Type Detection** - Automatically handles primitives, objects, and arrays
- 🔄 **Multiple Views** - Toggle between table and card layouts
- 🎭 **Value Highlighting** - Automatic highlighting for booleans, severity levels
- 📦 **Easy Integration** - Works with any framework or vanilla JS

## 📦 Installation

### Option 1: Direct Download (Simplest)

1. Download `magic-markup.js` and `magic-markup.css` from the `dist/` folder
2. Include them in your HTML:

```html
<link rel="stylesheet" href="path/to/magic-markup.css">
<script src="path/to/magic-markup.js"></script>
```

### Option 2: Copy from Source

Copy the files from the `src/` directory to your project.

### Option 3: CDN (Coming Soon)

```html
<link rel="stylesheet" href="https://cdn.example.com/magic-markup@1.0.0/magic-markup.min.css">
<script src="https://cdn.example.com/magic-markup@1.0.0/magic-markup.min.js"></script>
```

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="magic-markup.css">
</head>
<body>
    <div id="container"></div>
    
    <script src="magic-markup.js"></script>
    <script>
        // Simple data
        const data = {
            name: "John Doe",
            email: "john@example.com",
            status: "active",
            age: 30
        };
        
        // Render it!
        MagicMarkup.render('#container', data);
    </script>
</body>
</html>
```

### Load from JSON File

```javascript
MagicMarkup.render('#container', 'data.json');
```

### With Custom Buttons

```javascript
MagicMarkup.render('#container', data, {
    buttons: {
        table: [
            {
                name: 'Edit',
                className: 'mm-btn-primary',
                icon: '✏️',
                handler: (rowData) => {
                    console.log('Edit:', rowData);
                    // Your edit logic here
                }
            },
            {
                name: 'Delete',
                className: 'mm-btn-danger',
                icon: '🗑️',
                handler: (rowData) => {
                    if (confirm('Delete this item?')) {
                        // Your delete logic here
                    }
                }
            }
        ]
    }
});
```

## 📖 API Reference

### MagicMarkup.render(container, data, options)

Main method to render JSON data.

**Parameters:**

- `container` (string|Element) - CSS selector or DOM element
- `data` (Object|string) - JSON object or URL to fetch JSON from
- `options` (Object) - Configuration options (optional)

**Returns:** MagicMarkup instance

### Configuration Options

```javascript
{
    // Display options
    showStats: true,          // Show statistics header
    showHeader: true,         // Show "Magic Markup" header
    autoExpand: false,        // Auto-expand accordions
    defaultView: 'table',     // 'table' or 'card' for arrays
    
    // Button configuration
    buttons: {
        primitive: [],        // Buttons for key-value pairs
        table: [],           // Buttons for table rows
        card: [],            // Buttons for card items
        object: []           // Buttons for single objects
    },
    
    // Callbacks
    onError: (error) => {},  // Error handler
    onRender: () => {}       // Called after render completes
}
```

### Button Configuration

Each button can have the following properties:

```javascript
{
    name: 'Button Name',           // Required: Button text
    className: 'mm-btn-primary',   // Optional: CSS class
    icon: '🔥',                    // Optional: Emoji or icon
    handler: (data, button) => {   // Required: Click handler
        // data = row/card/item data
        // button = button element (for loading states)
    }
}
```

### Available Button Classes

- `mm-btn-primary` - Blue button
- `mm-btn-secondary` - Gray button
- `mm-btn-success` - Green button
- `mm-btn-danger` - Red button
- `mm-btn-warning` - Orange button

## 💡 Examples

### Example 1: Simple Key-Value Pairs

```javascript
const userData = {
    username: "alice",
    email: "alice@example.com",
    role: "admin",
    active: true
};

MagicMarkup.render('#container', userData);
```

### Example 2: Array of Objects with Custom Buttons

```javascript
const users = {
    users: [
        { id: 1, name: "Alice", email: "alice@example.com", status: "active" },
        { id: 2, name: "Bob", email: "bob@example.com", status: "inactive" },
        { id: 3, name: "Charlie", email: "charlie@example.com", status: "active" }
    ]
};

MagicMarkup.render('#container', users, {
    buttons: {
        table: [
            {
                name: 'View Profile',
                className: 'mm-btn-primary',
                handler: (user) => {
                    window.location.href = `/profile/${user.id}`;
                }
            },
            {
                name: 'Send Email',
                className: 'mm-btn-secondary',
                handler: (user) => {
                    window.location.href = `mailto:${user.email}`;
                }
            },
            {
                name: 'Toggle Status',
                className: 'mm-btn-warning',
                handler: async (user, button) => {
                    button.textContent = 'Processing...';
                    button.disabled = true;
                    
                    // API call
                    await fetch(`/api/users/${user.id}/toggle`, {
                        method: 'POST'
                    });
                    
                    button.textContent = '✓ Done';
                    setTimeout(() => {
                        button.textContent = 'Toggle Status';
                        button.disabled = false;
                    }, 2000);
                }
            }
        ],
        card: [
            {
                name: 'Details',
                className: 'mm-btn-primary',
                handler: (user) => {
                    alert(JSON.stringify(user, null, 2));
                }
            }
        ]
    }
});
```

### Example 3: Nested Objects

```javascript
const config = {
    server: {
        host: "localhost",
        port: 8080,
        ssl: true
    },
    database: {
        host: "db.example.com",
        port: 5432,
        name: "myapp"
    }
};

MagicMarkup.render('#container', config);
```

### Example 4: With Loading State

```javascript
const container = document.getElementById('container');
container.innerHTML = '<div class="mm-loading">Loading...</div>';

fetch('https://api.example.com/data')
    .then(r => r.json())
    .then(data => {
        MagicMarkup.render(container, data, {
            onRender: () => {
                console.log('Render complete!');
            },
            onError: (error) => {
                console.error('Failed to render:', error);
            }
        });
    });
```

### Example 5: Primitive Values with Custom Actions

```javascript
const settings = {
    apiKey: "sk-1234567890",
    endpoint: "https://api.example.com",
    timeout: 30000,
    retries: 3
};

MagicMarkup.render('#container', settings, {
    buttons: {
        primitive: [
            {
                name: 'Copy',
                className: 'mm-btn-primary',
                icon: '📋',
                handler: (data) => {
                    navigator.clipboard.writeText(data.value);
                    alert('Copied to clipboard!');
                }
            },
            {
                name: 'Edit',
                className: 'mm-btn-secondary',
                icon: '✏️',
                handler: (data) => {
                    const newValue = prompt(`Edit ${data.label}:`, data.value);
                    if (newValue !== null) {
                        // Update logic here
                        console.log(`Updated ${data.key} to ${newValue}`);
                    }
                }
            }
        ]
    }
});
```

## 🎨 Customization

### Custom Styling

Override CSS variables to customize the theme:

```css
:root {
    --mm-primary-color: #your-color;
    --mm-bg-primary: #your-bg;
    --mm-text-primary: #your-text;
    /* ... more variables */
}
```

### Hide Header/Stats

```javascript
MagicMarkup.render('#container', data, {
    showHeader: false,
    showStats: false
});
```

### Custom Error Handling

```javascript
MagicMarkup.render('#container', 'data.json', {
    onError: (error) => {
        console.error('Custom error handler:', error);
        document.getElementById('container').innerHTML = 
            `<div class="custom-error">${error.message}</div>`;
    }
});
```

## 🔧 Advanced Usage

### Instance Methods

```javascript
// Create instance
const mm = new MagicMarkup('#container', options);

// Render data
await mm.render(data);

// Re-render with new data
await mm.render(newData);
```

### Multiple Instances

```javascript
// Render different data in different containers
MagicMarkup.render('#users', usersData);
MagicMarkup.render('#settings', settingsData);
MagicMarkup.render('#logs', logsData);
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For questions and support, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] TypeScript definitions
- [ ] npm package
- [ ] CDN hosting
- [ ] More themes
- [ ] Export to CSV/Excel
- [ ] Search/filter functionality
- [ ] Pagination for large datasets
- [ ] Dark mode
- [ ] Custom renderers

## 📝 Changelog

### Version 1.0.0 (2025-01-14)

- Initial release
- Core rendering functionality
- Custom button support
- Responsive design
- Value highlighting
- Table/Card toggle views

---

Made with 🪄 by the Magic Markup Team
