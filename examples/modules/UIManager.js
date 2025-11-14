/**
 * UIManager - Manages UI rendering with Magic Markup
 * Example of wrapping Magic Markup in a custom class
 */

export class UIManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.magicMarkupInstance = null;
        
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
    }

    /**
     * Render data with Magic Markup
     */
    render(data, options = {}) {
        const defaultOptions = {
            showStats: true,
            showHeader: true,
            buttons: this.getDefaultButtons(),
            onRender: () => {
                console.log('UIManager: Data rendered successfully');
            },
            onError: (error) => {
                console.error('UIManager: Render error', error);
                this.showError(error.message);
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            buttons: {
                ...defaultOptions.buttons,
                ...(options.buttons || {})
            }
        };

        this.magicMarkupInstance = MagicMarkup.render(
            `#${this.containerId}`,
            data,
            mergedOptions
        );

        return this.magicMarkupInstance;
    }

    /**
     * Get default button configurations
     */
    getDefaultButtons() {
        return {
            primitive: [
                {
                    name: 'Copy',
                    className: 'mm-btn-primary',
                    icon: '📋',
                    handler: (data) => {
                        this.copyToClipboard(data.value);
                    }
                }
            ],
            table: [
                {
                    name: 'View',
                    className: 'mm-btn-primary',
                    icon: '👁️',
                    handler: (row) => {
                        this.showDetails(row);
                    }
                },
                {
                    name: 'Edit',
                    className: 'mm-btn-secondary',
                    icon: '✏️',
                    handler: (row) => {
                        this.editItem(row);
                    }
                },
                {
                    name: 'Delete',
                    className: 'mm-btn-danger',
                    icon: '🗑️',
                    handler: async (row, button) => {
                        await this.deleteItem(row, button);
                    }
                }
            ],
            card: [
                {
                    name: 'Details',
                    className: 'mm-btn-primary',
                    icon: '📄',
                    handler: (item) => {
                        this.showDetails(item);
                    }
                }
            ],
            object: [
                {
                    name: 'Expand',
                    className: 'mm-btn-secondary',
                    icon: '🔍',
                    handler: (obj) => {
                        console.log('Object details:', obj);
                    }
                }
            ]
        };
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(`Copied: ${text}`, 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Show item details
     */
    showDetails(item) {
        const details = JSON.stringify(item, null, 2);
        alert(`Item Details:\n\n${details}`);
    }

    /**
     * Edit item
     */
    editItem(item) {
        console.log('Edit item:', item);
        this.showNotification(`Editing item: ${item.name || item.id || 'Unknown'}`, 'info');
        
        // In a real application, you would open an edit modal or form here
        // For this example, we'll just log it
    }

    /**
     * Delete item
     */
    async deleteItem(item, button) {
        const itemName = item.name || item.id || 'this item';
        
        if (!confirm(`Are you sure you want to delete ${itemName}?`)) {
            return;
        }

        // Disable button and show loading state
        button.disabled = true;
        button.textContent = '⏳ Deleting...';

        try {
            // Simulate API call
            await this.delay(1500);
            
            button.textContent = '✓ Deleted';
            this.showNotification(`${itemName} deleted successfully`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = '🗑️ Delete';
                button.disabled = false;
            }, 2000);
        } catch (error) {
            button.textContent = '❌ Failed';
            this.showNotification(`Failed to delete ${itemName}`, 'error');
            
            setTimeout(() => {
                button.textContent = '🗑️ Delete';
                button.disabled = false;
            }, 2000);
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const colors = {
            info: '#2563eb',
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-weight: 600;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Show error message
     */
    showError(message) {
        this.container.innerHTML = `
            <div style="
                background: #fef2f2;
                border: 1px solid #ef4444;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            ">
                <h3 style="color: #ef4444; margin: 0 0 10px 0;">Error</h3>
                <p style="color: #991b1b; margin: 0;">${message}</p>
            </div>
        `;
    }

    /**
     * Show loading state
     */
    showLoading(message = 'Loading...') {
        this.container.innerHTML = `
            <div style="
                text-align: center;
                padding: 40px;
                color: #64748b;
            ">
                <div style="
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e2e8f0;
                    border-top-color: #2563eb;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="margin-top: 15px; font-weight: 600;">${message}</p>
            </div>
        `;
    }

    /**
     * Clear container
     */
    clear() {
        this.container.innerHTML = '';
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get current Magic Markup instance
     */
    getInstance() {
        return this.magicMarkupInstance;
    }
}
