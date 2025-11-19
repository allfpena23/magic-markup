# 🚀 Getting Started with Magic Markup

Welcome to Magic Markup! This guide will help you get up and running in minutes.

## 📋 Quick Setup

### Step 1: Include the Files

Add Magic Markup to your HTML page:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/magic-markup.css">
</head>
<body>
    <div id="container"></div>
    
    <script src="path/to/magic-markup.js"></script>
</body>
</html>
```

### Step 2: Prepare Your Data

Magic Markup works with any JSON object:

```javascript
const myData = {
    name: "John Doe",
    email: "john@example.com",
    status: "active"
};
```

### Step 3: Render!

```javascript
MagicMarkup.render('#container', myData);
```

That's it! Your data is now beautifully rendered.

## 🎯 Common Use Cases

### 1. Display API Response

```javascript
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
        MagicMarkup.render('#container', data);
    });
```

### 2. Load from JSON File

```javascript
MagicMarkup.render('#container', 'data.json');
```

### 3. Add Custom Buttons

```javascript
MagicMarkup.render('#container', data, {
    buttons: [
        {
            name: 'Edit',
            className: 'mm-btn-primary',
            handler: (row) => {
                console.log('Edit:', row);
            }
        }
    ]
});
```

## 📁 Project Structure

```
magic-markup/
├── dist/                    # Production-ready files
│   ├── magic-markup.js
│   └── magic-markup.css
├── src/                     # Source files
│   ├── magic-markup.js
│   └── magic-markup.css
├── examples/                # Example implementations
│   ├── basic-example.html
│   ├── advanced-example.html
│   └── sample-data.json
├── README.md               # Full documentation
├── GETTING_STARTED.md      # This file
└── package.json            # Package configuration
```

## 🎨 Customization Examples

### Hide Header and Stats

```javascript
MagicMarkup.render('#container', data, {
    showHeader: false,
    showStats: false
});
```

### Date Formatting

Use built-in date format constants:

```javascript
MagicMarkup.render('#container', data, {
    dateFormat: MagicMarkup.DateFormat.UTC,  // or DateFormat.LOCALE (default)
    card: {
        users: {
            transforms: {
                createdAt: 'date',  // Apply date transformation
                updatedAt: 'date'
            }
        }
    }
});
```

### Field Filtering

Control which fields are displayed globally or per-key:

```javascript
MagicMarkup.render('#container', data, {
    // Global field filtering (applies to top-level)
    fields: {
        includes: ['name', 'email', 'status'],  // Only show these fields (takes precedence)
        excludes: ['password', 'ssn']           // Or hide these fields
    },
    
    // Per-key field filtering
    card: {
        users: {
            fields: {
                includes: ['name', 'email'],  // Only show name and email for users
                excludes: []
            }
        },
        products: {
            fields: {
                excludes: ['internalId', 'cost']  // Hide sensitive fields for products
            }
        }
    }
});
```

**Note:** `includes` takes precedence over `excludes`. If `includes` is specified, only those fields are shown.

### Field Transformations

Transform field values using built-in or custom transformers:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        files: {
            transforms: {
                size: 'bytes',           // Convert bytes to KB/MB/GB
                createdAt: 'date',       // Format date strings
                isActive: 'boolean',     // Convert to ✓/✗
                name: 'uppercase',       // Convert to uppercase
                // Custom transformer
                status: (value) => value === 1 ? 'Active' : 'Inactive'
            }
        }
    }
});
```

**Built-in Transforms:**
- `date` - Format dates (respects global `dateFormat` setting)
- `bytes` - Convert numbers to human-readable sizes (e.g., "1.5 MB")
- `boolean` - Convert booleans to ✓/✗ symbols
- `uppercase` - Convert text to uppercase
- `lowercase` - Convert text to lowercase

### Customize Card Headers

By default, cards in card view show "Item 1", "Item 2", etc. You can customize this globally or per-key:

```javascript
MagicMarkup.render('#container', data, {
    // Global card header (applies to all arrays)
    card: {
        header: "name",  // Use the 'name' field as card header
        
        // Per-key card headers
        users: {
            header: "email"  // Use email for users
        },
        products: {
            header: "title"  // Use title for products
        }
    }
});
```

**Example:**

```javascript
// Your data
const data = {
    users: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user" }
    ]
};

// Render with custom card headers
MagicMarkup.render('#container', data, {
    card: {
        users: {
            header: "name"  // Cards will show "Alice Johnson", "Bob Smith"
        }
    }
});
```

**Note:** If the specified field doesn't exist or is null/empty, it falls back to "Item X".

### Conditional Highlighting

Control which fields get value highlighting:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        logs: {
            highlights: {
                enabled: true,              // Enable highlighting (default)
                fields: ['status', 'level'] // Only highlight these fields
            }
        },
        settings: {
            highlights: {
                enabled: false  // Disable all highlighting for this key
            }
        }
    }
});
```

### Array Display Modes

Control how arrays of objects are displayed:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        users: {
            arrayDisplay: 'table'  // Show only table view
        },
        products: {
            arrayDisplay: 'cards'  // Show only card view
        },
        logs: {
            arrayDisplay: null  // Show both with toggle (default)
        }
    }
});
```

### Pagination

Enable pagination for large arrays:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        transactions: {
            pagination: {
                enabled: true,
                itemsPerPage: 10  // Show 10 items (default)
            }
        }
    }
});
```

### Custom Buttons

Add buttons globally or per-key:

```javascript
MagicMarkup.render('#container', data, {
    // Global buttons (apply to all arrays)
    buttons: [
        {
            name: 'View',
            icon: '👁️',
            className: 'mm-btn-primary',
            handler: (data, button) => {
                console.log('View:', data);
            }
        }
    ],
    
    // Per-key buttons (override global buttons)
    card: {
        users: {
            buttons: [
                {
                    name: 'Edit',
                    handler: (user) => console.log('Edit user:', user)
                },
                {
                    name: 'Delete',
                    className: 'mm-btn-danger',
                    handler: (user) => console.log('Delete user:', user)
                }
            ]
        },
        products: {
            buttons: [
                {
                    name: 'Add to Cart',
                    handler: (product) => console.log('Add:', product)
                }
            ]
        }
    }
});
```

### Complete Configuration Example

Here's a comprehensive example combining multiple features:

```javascript
MagicMarkup.render('#container', data, {
    showHeader: false,
    showStats: false,
    dateFormat: MagicMarkup.DateFormat.UTC,
    
    // Global field filtering
    fields: {
        excludes: ['password', 'ssn', 'apiKey']
    },
    
    // Global buttons
    buttons: [
        {
            name: 'Export',
            handler: (data) => console.log('Export:', data)
        }
    ],
    
    // Per-key configurations
    card: {
        users: {
            header: "name",
            fields: {
                includes: ['name', 'email', 'role', 'createdAt']
            },
            transforms: {
                createdAt: 'date',
                role: 'uppercase'
            },
            highlights: {
                enabled: true,
                fields: ['role', 'status']
            },
            buttons: [
                { name: 'Edit', handler: (user) => editUser(user) },
                { name: 'Delete', className: 'mm-btn-danger', handler: (user) => deleteUser(user) }
            ],
            arrayDisplay: 'table',
            pagination: {
                enabled: true,
                itemsPerPage: 20
            }
        },
        files: {
            header: "filename",
            transforms: {
                size: 'bytes',
                uploadedAt: 'date'
            },
            buttons: [
                { name: 'Download', handler: (file) => downloadFile(file) }
            ]
        }
    }
});
```

### Custom Theme Colors

```css
:root {
    --mm-primary-color: #your-brand-color;
    --mm-bg-primary: #your-background;
}
```

## 🔧 Running Examples Locally

### Option 1: Using Python (Recommended)

```bash
cd magic-markup
python3 -m http.server 8765
```

Then open: http://localhost:8765/examples/basic-example.html

### Option 2: Using npm script

```bash
cd magic-markup
npm run serve
```

### Option 3: Direct File Access

Simply open the HTML files directly in your browser:
- `examples/basic-example.html`
- `examples/advanced-example.html`

## 💡 Tips & Best Practices

### 1. Data Structure

Magic Markup automatically detects and renders:
- **Primitives**: strings, numbers, booleans
- **Objects**: nested key-value pairs
- **Arrays of primitives**: rendered as badges or labels
- **Arrays of objects**: rendered as tables with card view toggle

### 2. Button Handlers

Button handlers receive the data and button element:

```javascript
handler: (data, button) => {
    // Disable button during async operation
    button.disabled = true;
    button.textContent = 'Processing...';
    
    // Your async operation
    await doSomething(data);
    
    // Re-enable button
    button.disabled = false;
    button.textContent = 'Done';
}
```

### 3. Error Handling

Always provide error handlers for production:

```javascript
MagicMarkup.render('#container', 'api/data', {
    onError: (error) => {
        console.error('Failed to load:', error);
        // Show user-friendly error message
    }
});
```

### 4. Value Highlighting

Magic Markup automatically highlights special values:
- `true`/`false` - Boolean badges
- `critical`/`error` - Red badges
- `warning`/`warn` - Orange badges
- `info`/`information` - Blue badges
- `success`/`ok` - Green badges

### 5. Field Filtering Best Practices

- Use `includes` when you want to show only specific fields
- Use `excludes` when you want to hide sensitive data (passwords, API keys, etc.)
- Per-key filtering overrides global filtering
- `includes` takes precedence over `excludes`

### 6. Transformations

- Apply transformations to format data without modifying the original
- Use built-in transforms for common cases (dates, file sizes, booleans)
- Create custom transformers for domain-specific formatting
- Transformations are applied before rendering in both table and card views

## 🎓 Learning Path

1. **Start Simple**: Try the basic example
2. **Add Buttons**: Implement custom button handlers
3. **Field Filtering**: Hide sensitive data or show only relevant fields
4. **Transformations**: Format dates, file sizes, and other values
5. **Per-Key Config**: Customize rendering for different data types
6. **Customize Styling**: Override CSS variables
7. **Advanced Features**: Explore pagination, array display modes, and conditional highlighting
8. **Build Your App**: Integrate into your project

## 📚 Next Steps

- Read the full [README.md](README.md) for complete API documentation
- Explore [basic-example.html](examples/basic-example.html) for simple usage
- Check [advanced-example.html](examples/advanced-example.html) for complex scenarios
- Customize the CSS to match your brand

## 🆘 Need Help?

- Check the examples in the `examples/` folder
- Review the full documentation in `README.md`
- Open an issue on GitHub for bugs or questions

## 🎉 You're Ready!

You now have everything you need to start using Magic Markup. Happy coding! 🪄

---

**Pro Tip**: Start with the basic example, then gradually add features as you need them. Magic Markup is designed to be simple by default and powerful when you need it.
