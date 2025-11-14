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
    buttons: {
        table: [
            {
                name: 'Edit',
                className: 'mm-btn-primary',
                handler: (row) => {
                    console.log('Edit:', row);
                }
            }
        ]
    }
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

### Custom Theme Colors

```css
:root {
    --mm-primary-color: #your-brand-color;
    --mm-bg-primary: #your-background;
}
```

### Multiple Button Types

```javascript
MagicMarkup.render('#container', data, {
    buttons: {
        primitive: [/* buttons for key-value pairs */],
        table: [/* buttons for table rows */],
        card: [/* buttons for card items */],
        object: [/* buttons for single objects */]
    }
});
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

## 🎓 Learning Path

1. **Start Simple**: Try the basic example
2. **Add Buttons**: Implement custom button handlers
3. **Customize Styling**: Override CSS variables
4. **Advanced Features**: Explore the advanced example
5. **Build Your App**: Integrate into your project

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
