/**
 * App - Main application class
 * Example of integrating Magic Markup with ES6 modules
 */

import { DataService } from './DataService.js';
import { UIManager } from './UIManager.js';

export class App {
    constructor(containerId) {
        this.dataService = new DataService();
        this.uiManager = new UIManager(containerId);
        
        console.log('App initialized with Magic Markup integration');
        
        // Add CSS animations
        this.addAnimations();
    }

    /**
     * Load and display user data
     */
    async loadUserData() {
        try {
            this.uiManager.showLoading('Loading user data...');
            
            const data = await this.dataService.getUserData();
            
            this.uiManager.render(data, {
                buttons: {
                    table: [
                        {
                            name: 'View Profile',
                            className: 'mm-btn-primary',
                            icon: '👤',
                            handler: (user) => {
                                this.viewUserProfile(user);
                            }
                        },
                        {
                            name: 'Send Email',
                            className: 'mm-btn-secondary',
                            icon: '📧',
                            handler: (user) => {
                                this.sendEmail(user);
                            }
                        },
                        {
                            name: 'Toggle Status',
                            className: 'mm-btn-warning',
                            icon: '🔄',
                            handler: async (user, button) => {
                                await this.toggleUserStatus(user, button);
                            }
                        },
                        {
                            name: 'Delete',
                            className: 'mm-btn-danger',
                            icon: '🗑️',
                            handler: async (user, button) => {
                                await this.deleteUser(user, button);
                            }
                        }
                    ]
                }
            });
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.uiManager.showError('Failed to load user data');
        }
    }

    /**
     * Load and display server data
     */
    async loadServerData() {
        try {
            this.uiManager.showLoading('Loading server data...');
            
            const data = await this.dataService.getServerData();
            
            this.uiManager.render(data, {
                buttons: {
                    table: [
                        {
                            name: 'Monitor',
                            className: 'mm-btn-primary',
                            icon: '📊',
                            handler: (server) => {
                                this.monitorServer(server);
                            }
                        },
                        {
                            name: 'Restart',
                            className: 'mm-btn-warning',
                            icon: '🔄',
                            handler: async (server, button) => {
                                await this.restartServer(server, button);
                            }
                        },
                        {
                            name: 'Stop',
                            className: 'mm-btn-danger',
                            icon: '⏹️',
                            handler: async (server, button) => {
                                await this.stopServer(server, button);
                            }
                        },
                        {
                            name: 'Logs',
                            className: 'mm-btn-secondary',
                            icon: '📄',
                            handler: (server) => {
                                this.viewServerLogs(server);
                            }
                        }
                    ]
                }
            });
        } catch (error) {
            console.error('Failed to load server data:', error);
            this.uiManager.showError('Failed to load server data');
        }
    }

    /**
     * Load and display analytics data
     */
    async loadAnalytics() {
        try {
            this.uiManager.showLoading('Loading analytics...');
            
            const data = await this.dataService.getAnalytics();
            
            this.uiManager.render(data, {
                buttons: {
                    table: [
                        {
                            name: 'Details',
                            className: 'mm-btn-primary',
                            icon: '🔍',
                            handler: (endpoint) => {
                                this.viewEndpointDetails(endpoint);
                            }
                        },
                        {
                            name: 'Optimize',
                            className: 'mm-btn-success',
                            icon: '⚡',
                            handler: async (endpoint, button) => {
                                await this.optimizeEndpoint(endpoint, button);
                            }
                        },
                        {
                            name: 'Alert',
                            className: 'mm-btn-warning',
                            icon: '🔔',
                            handler: (endpoint) => {
                                this.setAlert(endpoint);
                            }
                        }
                    ]
                }
            });
        } catch (error) {
            console.error('Failed to load analytics:', error);
            this.uiManager.showError('Failed to load analytics');
        }
    }

    // ========================================
    // User Actions
    // ========================================

    viewUserProfile(user) {
        console.log('Viewing profile for:', user.name);
        this.uiManager.showNotification(`Opening profile for ${user.name}`, 'info');
    }

    sendEmail(user) {
        console.log('Sending email to:', user.email);
        window.location.href = `mailto:${user.email}`;
    }

    async toggleUserStatus(user, button) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        
        button.disabled = true;
        button.textContent = '⏳ Updating...';
        
        try {
            await this.delay(1000);
            
            button.textContent = '✓ Updated';
            this.uiManager.showNotification(
                `${user.name} status changed to ${newStatus}`,
                'success'
            );
            
            setTimeout(() => {
                button.textContent = '🔄 Toggle Status';
                button.disabled = false;
            }, 1500);
        } catch (error) {
            button.textContent = '❌ Failed';
            this.uiManager.showNotification('Failed to update status', 'error');
            
            setTimeout(() => {
                button.textContent = '🔄 Toggle Status';
                button.disabled = false;
            }, 1500);
        }
    }

    async deleteUser(user, button) {
        if (!confirm(`Delete user ${user.name}? This action cannot be undone.`)) {
            return;
        }

        button.disabled = true;
        button.textContent = '⏳ Deleting...';
        
        try {
            await this.delay(1500);
            
            button.textContent = '✓ Deleted';
            this.uiManager.showNotification(`${user.name} deleted`, 'success');
            
            setTimeout(() => {
                button.textContent = '🗑️ Delete';
                button.disabled = false;
            }, 2000);
        } catch (error) {
            button.textContent = '❌ Failed';
            this.uiManager.showNotification('Failed to delete user', 'error');
            
            setTimeout(() => {
                button.textContent = '🗑️ Delete';
                button.disabled = false;
            }, 2000);
        }
    }

    // ========================================
    // Server Actions
    // ========================================

    monitorServer(server) {
        console.log('Monitoring server:', server.name);
        this.uiManager.showNotification(`Monitoring ${server.name}...`, 'info');
    }

    async restartServer(server, button) {
        if (!confirm(`Restart ${server.name}? This may cause brief downtime.`)) {
            return;
        }

        button.disabled = true;
        button.textContent = '⏳ Restarting...';
        
        try {
            await this.delay(2000);
            
            button.textContent = '✓ Restarted';
            this.uiManager.showNotification(`${server.name} restarted successfully`, 'success');
            
            setTimeout(() => {
                button.textContent = '🔄 Restart';
                button.disabled = false;
            }, 1500);
        } catch (error) {
            button.textContent = '❌ Failed';
            this.uiManager.showNotification('Failed to restart server', 'error');
            
            setTimeout(() => {
                button.textContent = '🔄 Restart';
                button.disabled = false;
            }, 1500);
        }
    }

    async stopServer(server, button) {
        if (!confirm(`Stop ${server.name}? This will affect service availability.`)) {
            return;
        }

        button.disabled = true;
        button.textContent = '⏳ Stopping...';
        
        try {
            await this.delay(1500);
            
            button.textContent = '✓ Stopped';
            this.uiManager.showNotification(`${server.name} stopped`, 'warning');
            
            setTimeout(() => {
                button.textContent = '⏹️ Stop';
                button.disabled = false;
            }, 1500);
        } catch (error) {
            button.textContent = '❌ Failed';
            this.uiManager.showNotification('Failed to stop server', 'error');
            
            setTimeout(() => {
                button.textContent = '⏹️ Stop';
                button.disabled = false;
            }, 1500);
        }
    }

    viewServerLogs(server) {
        console.log('Viewing logs for:', server.name);
        this.uiManager.showNotification(`Opening logs for ${server.name}...`, 'info');
    }

    // ========================================
    // Analytics Actions
    // ========================================

    viewEndpointDetails(endpoint) {
        console.log('Viewing details for:', endpoint.endpoint);
        this.uiManager.showNotification(`Analyzing ${endpoint.endpoint}...`, 'info');
    }

    async optimizeEndpoint(endpoint, button) {
        button.disabled = true;
        button.textContent = '⏳ Optimizing...';
        
        try {
            await this.delay(2000);
            
            button.textContent = '✓ Optimized';
            this.uiManager.showNotification(
                `${endpoint.endpoint} optimized successfully`,
                'success'
            );
            
            setTimeout(() => {
                button.textContent = '⚡ Optimize';
                button.disabled = false;
            }, 1500);
        } catch (error) {
            button.textContent = '❌ Failed';
            this.uiManager.showNotification('Optimization failed', 'error');
            
            setTimeout(() => {
                button.textContent = '⚡ Optimize';
                button.disabled = false;
            }, 1500);
        }
    }

    setAlert(endpoint) {
        console.log('Setting alert for:', endpoint.endpoint);
        this.uiManager.showNotification(`Alert configured for ${endpoint.endpoint}`, 'success');
    }

    // ========================================
    // Utilities
    // ========================================

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addAnimations() {
        if (document.getElementById('app-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'app-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}
