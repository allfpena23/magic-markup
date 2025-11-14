# Magic Markup - ES6 Module Integration Example

This directory demonstrates how to use Magic Markup with ES6 modules and classes in a real-world application architecture.

## 📁 File Structure

```
modules/
├── App.js           # Main application class
├── DataService.js   # Data fetching and management
├── UIManager.js     # UI rendering with Magic Markup
└── README.md        # This file
```

## 🎯 Architecture Overview

This example follows a clean separation of concerns:

1. **DataService** - Handles all data operations
   - Fetches data from APIs (simulated)
   - Manages caching
   - Provides data to the application

2. **UIManager** - Manages UI rendering
   - Wraps Magic Markup functionality
   - Provides reusable UI methods
   - Handles notifications and loading states

3. **App** - Main application controller
   - Coordinates between DataService and UIManager
   - Implements business logic
   - Handles user interactions

## 💡 Usage Examples

### Basic Setup

```javascript
import { App } from './modules/App.js';

// Initialize the app
const app = new App('container');

// Load data
app.loadUserData();
```

### Using Individual Modules

```javascript
import { DataService } from './modules/DataService.js';
import { UIManager } from './modules/UIManager.js';

// Create instances
const dataService = new DataService();
const uiManager = new UIManager('container');

// Fetch and render data
const data = await dataService.getUserData();
uiManager.render(data);
```

### Custom Button Handlers

```javascript
const uiManager = new UIManager('container');

uiManager.render(data, {
    buttons: {
        table: [
            {
                name: 'Custom Action',
                className: 'mm-btn-primary',
                handler: (row) => {
                    console.log('Custom action for:', row);
                }
            }
        ]
    }
});
```

## 🔧 Key Features Demonstrated

### 1. Class-Based Architecture

```javascript
export class DataService {
    constructor() {
        this.cache = new Map();
    }
    
    async getUserData() {
        // Implementation
    }
}
```

### 2. Async/Await Patterns

```javascript
async loadUserData() {
    this.uiManager.showLoading('Loading...');
    const data = await this.dataService.getUserData();
    this.uiManager.render(data);
}
```

### 3. Error Handling

```javascript
try {
    const data = await this.dataService.getUserData();
    this.uiManager.render(data);
} catch (error) {
    this.uiManager.showError('Failed to load data');
}
```

### 4. Loading States

```javascript
// Show loading
this.uiManager.showLoading('Loading data...');

// Render data
this.uiManager.render(data);
```

### 5. Notifications

```javascript
this.uiManager.showNotification('Action completed!', 'success');
this.uiManager.showNotification('Warning message', 'warning');
this.uiManager.showNotification('Error occurred', 'error');
```

### 6. Button State Management

```javascript
handler: async (item, button) => {
    button.disabled = true;
    button.textContent = 'Processing...';
    
    await performAction(item);
    
    button.textContent = 'Done!';
    button.disabled = false;
}
```

## 📚 Module Details

### DataService.js

**Purpose**: Centralized data management

**Methods**:
- `getUserData()` - Fetch user data
- `getServerData()` - Fetch server data
- `getAnalytics()` - Fetch analytics data
- `clearCache()` - Clear cached data

**Features**:
- In-memory caching
- Simulated API delays
- Structured data models

### UIManager.js

**Purpose**: UI rendering and user feedback

**Methods**:
- `render(data, options)` - Render data with Magic Markup
- `showLoading(message)` - Display loading state
- `showError(message)` - Display error message
- `showNotification(message, type)` - Show toast notification
- `clear()` - Clear container

**Features**:
- Default button configurations
- Notification system
- Loading states
- Error handling

### App.js

**Purpose**: Application orchestration

**Methods**:
- `loadUserData()` - Load and display users
- `loadServerData()` - Load and display servers
- `loadAnalytics()` - Load and display analytics

**Features**:
- Business logic implementation
- User interaction handling
- Coordinated data flow

## 🚀 Running the Example

### Option 1: Local Server (Recommended)

```bash
cd magic-markup
python3 -m http.server 8765
```

Then open: http://localhost:8765/examples/module-example.html

### Option 2: Direct File Access

Open `module-example.html` directly in your browser.

**Note**: Some browsers may block ES6 modules when opening files directly. Use a local server for best results.

## 🎨 Customization

### Adding New Data Sources

```javascript
// In DataService.js
async getCustomData() {
    const data = await fetch('/api/custom');
    return data.json();
}
```

### Adding New UI Methods

```javascript
// In UIManager.js
showCustomModal(content) {
    // Your modal implementation
}
```

### Adding New App Features

```javascript
// In App.js
async loadCustomData() {
    const data = await this.dataService.getCustomData();
    this.uiManager.render(data);
}
```

## 💡 Best Practices

1. **Separation of Concerns**
   - Keep data logic in DataService
   - Keep UI logic in UIManager
   - Keep business logic in App

2. **Error Handling**
   - Always use try/catch for async operations
   - Provide user-friendly error messages
   - Log errors for debugging

3. **Loading States**
   - Show loading indicators for async operations
   - Disable buttons during processing
   - Provide feedback on completion

4. **Code Organization**
   - One class per file
   - Clear method names
   - Comprehensive comments

5. **Reusability**
   - Create generic, reusable methods
   - Use configuration objects
   - Avoid hardcoding values

## 🔗 Integration with Other Frameworks

This pattern works well with:
- React (use in components)
- Vue (use in composables)
- Angular (use in services)
- Svelte (use in stores)

## 📖 Further Reading

- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Class Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## 🤝 Contributing

Feel free to extend these examples with:
- Additional data sources
- New UI components
- Enhanced error handling
- More sophisticated caching

---

**Happy Coding!** 🎉
