# Magic Markup - Configuration Schema Reference

> Quick reference guide for all configuration options and their possible values

---

## Table of Contents
- [Basic Display Options](#basic-display-options)
- [Date Formatting](#date-formatting)
- [Links Configuration](#links-configuration)
- [Field Filtering](#field-filtering)
- [Buttons Configuration](#buttons-configuration)
- [Card Configuration](#card-configuration)
- [Custom Renderers](#custom-renderers)
- [Callbacks](#callbacks)
- [Constants & Enums](#constants--enums)

---

## Basic Display Options

### `showHeader`
**Type:** `boolean`  
**Default:** `true`  
**Values:** `true | false`

Controls whether the "Magic Markup" header is displayed.

```javascript
{
    showHeader: false  // Hides the header
}
```

---

### `showStats`
**Type:** `boolean`  
**Default:** `true`  
**Values:** `true | false`

Controls whether statistics (Total Items, Primitives, Objects, Arrays) are displayed.

```javascript
{
    showStats: false  // Hides statistics
}
```

---

### `autoExpand`
**Type:** `boolean`  
**Default:** `false`  
**Values:** `true | false`

Controls whether accordion sections are automatically expanded on load.

```javascript
{
    autoExpand: true  // All sections expanded by default
}
```

---

### `defaultView`
**Type:** `string`  
**Default:** `'table'`  
**Values:** `'table' | 'cards'`

Sets the default view for array of objects.

```javascript
{
    defaultView: 'cards'  // Shows card view by default
}
```

---

### `theme`
**Type:** `string`  
**Default:** `'default'`  
**Values:** `'default' | 'dark' | any custom theme name`

Sets the theme for the UI.

```javascript
{
    theme: 'dark'  // Uses dark theme
}
```

---

### `compactMode`
**Type:** `boolean`  
**Default:** `false`  
**Values:** `true | false`

Enables compact display mode with reduced spacing.

```javascript
{
    compactMode: true  // Reduces spacing
}
```

---

### `apiEndpoint`
**Type:** `string`  
**Default:** `'/api/submit'`  
**Values:** Any valid URL string

Default API endpoint for form submissions or data operations.

```javascript
{
    apiEndpoint: 'https://api.example.com/data'
}
```

---

## Date Formatting

### `dateFormat`
**Type:** `DateFormat constant`  
**Default:** `DateFormat.LOCALE`  
**Values:** `DateFormat.UTC | DateFormat.LOCALE`

Controls how dates are formatted when using the `date` transform.

```javascript
{
    dateFormat: DateFormat.UTC  // Uses UTC format
}
```

**Note:** Must use the `DateFormat` constant from MagicMarkup:
- `DateFormat.UTC` → `'utc'` → Displays as UTC string
- `DateFormat.LOCALE` → `'locale'` → Displays as locale string

---

## Links Configuration

### `links`
**Type:** `object`  
**Default:** `{ enabled: false }`

Controls automatic URL detection and link creation.

#### `links.enabled`
**Type:** `boolean`  
**Default:** `false`  
**Values:** `true | false`

```javascript
{
    links: {
        enabled: true  // Auto-converts URLs to clickable links
    }
}
```

When enabled, any string value that looks like a URL (starts with `http://`, `https://`, or `www.`) will be automatically converted to a clickable link.

---

## Field Filtering

### `fields`
**Type:** `object`  
**Default:** `{ includes: [], excludes: [] }`

Controls which fields are displayed globally.

#### `fields.includes`
**Type:** `array of strings`  
**Default:** `[]`  
**Values:** Array of field names to include

```javascript
{
    fields: {
        includes: ['name', 'email', 'status']  // Only show these fields
    }
}
```

#### `fields.excludes`
**Type:** `array of strings`  
**Default:** `[]`  
**Values:** Array of field names to exclude

```javascript
{
    fields: {
        excludes: ['password', 'internalId']  // Hide these fields
    }
}
```

**Note:** If `includes` is specified and not empty, only those fields are shown. Otherwise, all fields except those in `excludes` are shown.

---

## Buttons Configuration

### `buttons`
**Type:** `object`  
**Default:** `{}`

Defines action buttons for different contexts.

#### Button Contexts
- `primitive` - Buttons for primitive key-value pairs
- `object` - Buttons for single objects
- `[key]` - Buttons for specific array keys

#### Button Object Properties
- `name` or `label` - Button text
- `icon` - Optional icon/emoji
- `className` - CSS class (e.g., `'mm-btn-primary'`, `'mm-btn-danger'`)
- `handler` or `onClick` - Click handler function

#### Available Button Classes
- `mm-btn-primary` - Blue button
- `mm-btn-secondary` - Gray button
- `mm-btn-success` - Green button
- `mm-btn-danger` - Red button
- `mm-btn-warning` - Orange button

### Button Examples

#### Example 1: Simple Click Button
```javascript
{
    buttons: {
        primitive: [
            {
                name: 'Copy',
                icon: '📋',
                className: 'mm-btn-primary',
                handler: (data, button) => {
                    // Copy value to clipboard
                    navigator.clipboard.writeText(data.value);
                    
                    // Update button text temporarily
                    button.textContent = '✓ Copied!';
                    setTimeout(() => {
                        button.textContent = '📋 Copy';
                    }, 2000);
                }
            }
        ]
    }
}
```

#### Example 2: Popup/Alert Button
```javascript
{
    buttons: {
        primitive: [
            {
                name: 'Show Details',
                icon: 'ℹ️',
                className: 'mm-btn-secondary',
                handler: (data, button) => {
                    // Show alert with data details
                    alert(`Key: ${data.key}\nValue: ${data.value}\nLabel: ${data.label}`);
                }
            }
        ]
    }
}
```

#### Example 3: API Submit Button (Async/Await)
```javascript
{
    buttons: {
        primitive: [
            {
                name: 'Submit',
                icon: '📤',
                className: 'mm-btn-success',
                handler: async (data, button) => {
                    // Disable button and show loading state
                    button.disabled = true;
                    button.textContent = '⏳ Submitting...';
                    
                    try {
                        const response = await fetch('https://api.example.com/submit', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                key: data.key,
                                value: data.value
                            })
                        });
                        
                        if (response.ok) {
                            button.textContent = '✓ Success!';
                            button.className = 'mm-action-btn mm-btn-success';
                        } else {
                            throw new Error('Submission failed');
                        }
                    } catch (error) {
                        button.textContent = '✗ Failed';
                        button.className = 'mm-action-btn mm-btn-danger';
                        console.error('Submission error:', error);
                    } finally {
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            button.disabled = false;
                            button.textContent = '📤 Submit';
                            button.className = 'mm-action-btn mm-btn-success';
                        }, 3000);
                    }
                }
            }
        ]
    }
}
```

---

## Card Configuration

### `card`
**Type:** `object`  
**Default:** `{}`

Per-key configuration for array of objects display.

#### Global Card Properties
- `header` - Field name to use as card header

#### Per-Key Card Configuration
Each key can have its own configuration object:

```javascript
{
    card: {
        users: {
            header: 'name',
            fields: { includes: ['name', 'email', 'role'] },
            buttons: [...],
            highlights: { enabled: true, fields: ['status'] },
            transforms: { createdAt: 'date' },
            arrayDisplay: 'cards',
            pagination: { enabled: true, itemsPerPage: 10 }
        }
    }
}
```

#### `card[key].header`
**Type:** `string`  
**Default:** `null`  
**Values:** Field name to use as header

```javascript
{
    card: {
        users: {
            header: 'username'  // Use 'username' field as card header
        }
    }
}
```

---

#### `card[key].fields`
**Type:** `object`  
**Default:** `{ includes: [], excludes: [] }`

Same as global `fields` but applies only to this specific key.

```javascript
{
    card: {
        users: {
            fields: {
                includes: ['name', 'email', 'status']
            }
        }
    }
}
```

---

#### `card[key].buttons`
**Type:** `array`  
**Default:** `[]`

Buttons specific to this key's items.

```javascript
{
    card: {
        users: {
            buttons: [
                {
                    name: 'Edit',
                    className: 'mm-btn-primary',
                    handler: (user) => console.log('Edit', user)
                },
                {
                    name: 'Delete',
                    className: 'mm-btn-danger',
                    handler: (user) => console.log('Delete', user)
                }
            ]
        }
    }
}
```

---

#### `card[key].highlights`
**Type:** `object`  
**Default:** `{ enabled: true, fields: [] }`

Controls value highlighting (colors for true/false, error, warning, etc.).

```javascript
{
    card: {
        users: {
            highlights: {
                enabled: true,
                fields: ['status', 'active']  // Only highlight these fields
            }
        }
    }
}
```

**Note:** If `fields` is empty, all fields are highlighted. Set `enabled: false` to disable highlighting entirely.

---

#### `card[key].transforms`
**Type:** `object`  
**Default:** `{}`

Applies transformations to specific fields.

**Built-in Transforms:**
- `'date'` - Formats dates (uses `dateFormat` option)
- `'bytes'` - Converts bytes to KB/MB/GB
- `'boolean'` - Converts true/false to ✓/✗
- `'uppercase'` - Converts to uppercase
- `'lowercase'` - Converts to lowercase

```javascript
{
    card: {
        users: {
            transforms: {
                createdAt: 'date',
                fileSize: 'bytes',
                isActive: 'boolean',
                email: 'lowercase'
            }
        }
    }
}
```

**Custom Transform Function:**
```javascript
{
    card: {
        users: {
            transforms: {
                price: (value) => `$${value.toFixed(2)}`
            }
        }
    }
}
```

---

#### `card[key].arrayDisplay`
**Type:** `string`  
**Default:** `null`  
**Values:** `null | 'table' | 'cards'`

Forces a specific display mode for this array.

```javascript
{
    card: {
        users: {
            arrayDisplay: 'cards'  // Only show cards view (no toggle)
        }
    }
}
```

**Note:** If `null`, both table and card views are available with a toggle button.

---

#### `card[key].pagination`
**Type:** `object`  
**Default:** `{ enabled: false, itemsPerPage: 10 }`

Enables pagination for large arrays.

```javascript
{
    card: {
        users: {
            pagination: {
                enabled: true,
                itemsPerPage: 25
            }
        }
    }
}
```

---

## Custom Renderers

### `customRenderers`
**Type:** `object`  
**Default:** `{}`

Registers custom rendering functions for specific keys.

```javascript
{
    customRenderers: {
        myCustomKey: {
            render: (key, data, label, utils) => {
                const div = document.createElement('div');
                div.textContent = 'Custom rendering!';
                return div;
            },
            styles: `
                .my-custom-class {
                    color: red;
                }
            `,
            onMount: (element, data) => {
                console.log('Renderer mounted');
            }
        }
    }
}
```

See [CUSTOM_RENDERERS.md](./CUSTOM_RENDERERS.md) for detailed documentation.

---

## Callbacks

### `onError`
**Type:** `function`  
**Default:** `(error) => console.error('MagicMarkup Error:', error)`

Called when an error occurs during rendering.

```javascript
{
    onError: (error) => {
        alert('Failed to load data: ' + error.message);
    }
}
```

---

### `onRender`
**Type:** `function`  
**Default:** `() => {}`

Called after successful rendering.

```javascript
{
    onRender: () => {
        console.log('Rendering complete!');
    }
}
```

---

## Constants & Enums

### DateFormat
```javascript
MagicMarkup.DateFormat.UTC      // 'utc'
MagicMarkup.DateFormat.LOCALE   // 'locale'
```

### Transforms
```javascript
MagicMarkup.Transforms.date      // Date formatter
MagicMarkup.Transforms.bytes     // Bytes formatter
MagicMarkup.Transforms.boolean   // Boolean formatter
MagicMarkup.Transforms.uppercase // Uppercase converter
MagicMarkup.Transforms.lowercase // Lowercase converter
```

---

## Complete Example

```javascript
const mm = new MagicMarkup('#container', {
    // Basic display
    showHeader: false,
    showStats: true,
    autoExpand: false,
    defaultView: 'table',
    
    // Date formatting
    dateFormat: DateFormat.LOCALE,
    
    // Links
    links: {
        enabled: true
    },
    
    // Global field filtering
    fields: {
        excludes: ['password', 'internalId']
    },
    
    // Buttons
    buttons: {
        primitive: [
            {
                name: 'Copy',
                className: 'mm-btn-primary',
                handler: (data) => navigator.clipboard.writeText(data.value)
            }
        ]
    },
    
    // Per-key card configuration
    card: {
        users: {
            header: 'username',
            fields: {
                includes: ['username', 'email', 'role', 'status']
            },
            transforms: {
                createdAt: 'date',
                email: 'lowercase'
            },
            highlights: {
                enabled: true,
                fields: ['status', 'role']
            },
            buttons: [
                {
                    name: 'Edit',
                    className: 'mm-btn-primary',
                    handler: (user) => console.log('Edit', user)
                }
            ],
            arrayDisplay: 'cards',
            pagination: {
                enabled: true,
                itemsPerPage: 20
            }
        }
    },
    
    // Callbacks
    onRender: () => console.log('Rendered!'),
    onError: (error) => console.error(error)
});

mm.render(data);
```

---

## See Also

- [GETTING_STARTED.md](./GETTING_STARTED.md) - Complete tutorial and examples
- [CUSTOM_RENDERERS.md](./CUSTOM_RENDERERS.md) - Custom renderer documentation
- [THEMES.md](./THEMES.md) - Theme customization guide
