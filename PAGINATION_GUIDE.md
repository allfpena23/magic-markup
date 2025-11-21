# Magic Markup - Pagination Guide

This guide explains how to implement pagination in your Magic Markup projects.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Pagination](#basic-pagination)
- [Configuration Options](#configuration-options)
- [Multiple Datasets](#multiple-datasets)
- [Common Use Cases](#common-use-cases)
- [Troubleshooting](#troubleshooting)

## Quick Start

The simplest way to add pagination to your Magic Markup project:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        yourArrayKey: {
            pagination: {
                enabled: true,
                itemsPerPage: 10
            }
        }
    }
});
```

## Basic Pagination

### Step 1: Prepare Your Data

Your data should contain an array of objects:

```javascript
const data = {
    products: [
        { id: 1, name: "Product 1", price: 29.99 },
        { id: 2, name: "Product 2", price: 39.99 },
        { id: 3, name: "Product 3", price: 49.99 },
        // ... more products
    ]
};
```

### Step 2: Enable Pagination

```javascript
MagicMarkup.render('#container', data, {
    card: {
        products: {
            pagination: {
                enabled: true,
                itemsPerPage: 5  // Show 5 items per page
            }
        }
    }
});
```

### Step 3: View the Result

The library will automatically:
- Display only the first `itemsPerPage` items
- Show an info message: "Showing 5 of 25 items"
- Render in both table and card views (with toggle)

## Configuration Options

### Pagination Settings

```javascript
pagination: {
    enabled: true,        // Enable/disable pagination
    itemsPerPage: 10      // Number of items per page (default: 10)
}
```

### Per-Key Configuration

You can configure pagination differently for each array in your data:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        users: {
            pagination: {
                enabled: true,
                itemsPerPage: 5
            }
        },
        orders: {
            pagination: {
                enabled: true,
                itemsPerPage: 20
            }
        },
        logs: {
            pagination: {
                enabled: false  // No pagination for logs
            }
        }
    }
});
```

## Multiple Datasets

When working with multiple arrays, configure each independently:

```javascript
const data = {
    users: generateUsers(50),
    products: generateProducts(100),
    orders: generateOrders(200)
};

MagicMarkup.render('#container', data, {
    showStats: true,
    card: {
        users: {
            pagination: { enabled: true, itemsPerPage: 10 },
            header: 'name'
        },
        products: {
            pagination: { enabled: true, itemsPerPage: 25 },
            header: 'name'
        },
        orders: {
            pagination: { enabled: true, itemsPerPage: 50 },
            header: 'orderId'
        }
    }
});
```

## Common Use Cases

### Use Case 1: Product Catalog

```javascript
const productData = {
    products: [
        { id: 1, name: "Laptop", price: 999, category: "Electronics" },
        { id: 2, name: "Mouse", price: 29, category: "Accessories" },
        // ... 100 more products
    ]
};

MagicMarkup.render('#product-catalog', productData, {
    showHeader: false,
    showStats: true,
    card: {
        products: {
            pagination: {
                enabled: true,
                itemsPerPage: 12  // Show 12 products per page
            },
            header: 'name',
            fields: {
                excludes: ['id']  // Hide ID field
            }
        }
    }
});
```

### Use Case 2: User Management Dashboard

```javascript
const userData = {
    users: [
        { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
        // ... more users
    ]
};

MagicMarkup.render('#user-dashboard', userData, {
    card: {
        users: {
            pagination: {
                enabled: true,
                itemsPerPage: 20
            },
            header: 'name',
            buttons: [
                {
                    name: 'Edit',
                    className: 'mm-btn-primary',
                    handler: (user) => {
                        console.log('Edit user:', user);
                        // Your edit logic here
                    }
                },
                {
                    name: 'Delete',
                    className: 'mm-btn-danger',
                    handler: (user) => {
                        console.log('Delete user:', user);
                        // Your delete logic here
                    }
                }
            ]
        }
    }
});
```

### Use Case 3: Order History

```javascript
const orderData = {
    orders: [
        { orderId: "ORD-1001", customer: "John Doe", amount: 299.99, status: "delivered" },
        { orderId: "ORD-1002", customer: "Jane Smith", amount: 149.99, status: "pending" },
        // ... more orders
    ]
};

MagicMarkup.render('#order-history', orderData, {
    card: {
        orders: {
            pagination: {
                enabled: true,
                itemsPerPage: 15
            },
            header: 'orderId',
            transforms: {
                amount: (value) => '$' + value.toFixed(2)
            },
            highlights: {
                enabled: true,
                fields: ['status']  // Highlight status field
            }
        }
    }
});
```

## Complete HTML Example

Here's a complete, working example you can copy and use:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagination Example</title>
    <link rel="stylesheet" href="path/to/magic-markup.css">
</head>
<body>
    <div id="container"></div>
    
    <script src="path/to/magic-markup.js"></script>
    <script>
        // Your data
        const data = {
            products: [
                { id: 1, name: "Laptop", price: 999, stock: 15 },
                { id: 2, name: "Mouse", price: 29, stock: 50 },
                { id: 3, name: "Keyboard", price: 79, stock: 30 },
                { id: 4, name: "Monitor", price: 299, stock: 20 },
                { id: 5, name: "Webcam", price: 89, stock: 25 },
                { id: 6, name: "Headphones", price: 149, stock: 40 },
                { id: 7, name: "Microphone", price: 129, stock: 18 },
                { id: 8, name: "Speakers", price: 199, stock: 12 },
                { id: 9, name: "USB Hub", price: 39, stock: 60 },
                { id: 10, name: "Desk Lamp", price: 49, stock: 35 }
            ]
        };

        // Render with pagination
        MagicMarkup.render('#container', data, {
            showHeader: false,
            showStats: true,
            card: {
                products: {
                    pagination: {
                        enabled: true,
                        itemsPerPage: 5
                    },
                    header: 'name'
                }
            }
        });
    </script>
</body>
</html>
```

## Troubleshooting

### Issue: Pagination not working

**Solution:** Make sure:
1. Your data is an array of objects
2. The key name in `card` configuration matches your data key
3. `enabled` is set to `true`

```javascript
// ✅ Correct
const data = {
    products: [{ id: 1 }, { id: 2 }]  // Array of objects
};

MagicMarkup.render('#container', data, {
    card: {
        products: {  // Key matches data key
            pagination: {
                enabled: true  // Explicitly enabled
            }
        }
    }
});

// ❌ Incorrect
const data = {
    products: { id: 1, name: "Product" }  // Single object, not array
};
```

### Issue: All items still showing

**Solution:** Check that you're using the correct configuration structure:

```javascript
// ✅ Correct structure
MagicMarkup.render('#container', data, {
    card: {
        yourArrayKey: {
            pagination: {
                enabled: true,
                itemsPerPage: 10
            }
        }
    }
});

// ❌ Incorrect - missing 'card' wrapper
MagicMarkup.render('#container', data, {
    yourArrayKey: {
        pagination: {
            enabled: true
        }
    }
});
```

### Issue: Want to show different page sizes for different arrays

**Solution:** Configure each array separately:

```javascript
MagicMarkup.render('#container', data, {
    card: {
        users: {
            pagination: { enabled: true, itemsPerPage: 10 }
        },
        products: {
            pagination: { enabled: true, itemsPerPage: 25 }
        },
        logs: {
            pagination: { enabled: true, itemsPerPage: 50 }
        }
    }
});
```

## Limitations

The built-in pagination feature:
- ✅ Shows the first page of items
- ✅ Displays an info message about total items
- ✅ Works with both table and card views
- ❌ Does not provide navigation controls (prev/next buttons)
- ❌ Does not allow jumping to specific pages
- ❌ Does not have an items-per-page selector

For full pagination controls with navigation, you would need to implement a custom renderer.

## Next Steps

- Check out the [pagination-demo.html](pagination-demo.html) for live examples
- Read the main [GETTING_STARTED.md](../GETTING_STARTED.md) for more features
- Explore [advanced-example.html](advanced-example.html) for complex configurations

## Need Help?

If you're having issues integrating pagination:
1. Check the [pagination-demo.html](pagination-demo.html) example
2. Verify your data structure matches the examples
3. Ensure you're using the correct configuration syntax
4. Open an issue on GitHub with your code sample

---

**Happy coding! 🪄**
