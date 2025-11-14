/**
 * DataService - Handles data fetching and management
 * Example of using Magic Markup from an ES6 module
 */

export class DataService {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Get user data
     */
    async getUserData() {
        if (this.cache.has('users')) {
            return this.cache.get('users');
        }

        // Simulate API call
        await this.delay(500);

        const data = {
            totalUsers: 1247,
            activeUsers: 892,
            newToday: 23,
            
            recentUsers: [
                {
                    id: 1,
                    name: "Alice Johnson",
                    email: "alice@example.com",
                    role: "admin",
                    status: "active",
                    lastLogin: "2024-01-14T10:30:00Z"
                },
                {
                    id: 2,
                    name: "Bob Smith",
                    email: "bob@example.com",
                    role: "user",
                    status: "active",
                    lastLogin: "2024-01-14T09:15:00Z"
                },
                {
                    id: 3,
                    name: "Charlie Brown",
                    email: "charlie@example.com",
                    role: "moderator",
                    status: "inactive",
                    lastLogin: "2024-01-13T18:45:00Z"
                },
                {
                    id: 4,
                    name: "Diana Prince",
                    email: "diana@example.com",
                    role: "admin",
                    status: "active",
                    lastLogin: "2024-01-14T11:00:00Z"
                }
            ],

            permissions: ["read", "write", "delete", "admin"]
        };

        this.cache.set('users', data);
        return data;
    }

    /**
     * Get server data
     */
    async getServerData() {
        if (this.cache.has('servers')) {
            return this.cache.get('servers');
        }

        await this.delay(500);

        const data = {
            environment: "production",
            region: "us-east-1",
            uptime: "99.98%",
            
            infrastructure: {
                totalServers: 24,
                activeServers: 22,
                maintenanceMode: 2,
                avgCPU: "45%",
                avgMemory: "62%"
            },

            servers: [
                {
                    id: "srv-001",
                    name: "web-server-1",
                    type: "web",
                    status: "active",
                    cpu: "42%",
                    memory: "58%",
                    uptime: "45 days"
                },
                {
                    id: "srv-002",
                    name: "api-server-1",
                    type: "api",
                    status: "active",
                    cpu: "67%",
                    memory: "71%",
                    uptime: "30 days"
                },
                {
                    id: "srv-003",
                    name: "db-primary",
                    type: "database",
                    status: "warning",
                    cpu: "89%",
                    memory: "85%",
                    uptime: "120 days"
                },
                {
                    id: "srv-004",
                    name: "cache-server",
                    type: "cache",
                    status: "active",
                    cpu: "23%",
                    memory: "45%",
                    uptime: "15 days"
                }
            ],

            alerts: ["High CPU on db-primary", "Memory warning on api-server-1"]
        };

        this.cache.set('servers', data);
        return data;
    }

    /**
     * Get analytics data
     */
    async getAnalytics() {
        if (this.cache.has('analytics')) {
            return this.cache.get('analytics');
        }

        await this.delay(500);

        const data = {
            period: "Last 24 Hours",
            timestamp: new Date().toISOString(),
            
            metrics: {
                totalRequests: 1234567,
                successfulRequests: 1230145,
                failedRequests: 4422,
                avgResponseTime: "145ms",
                peakResponseTime: "892ms"
            },

            topEndpoints: [
                {
                    endpoint: "/api/users",
                    requests: 345678,
                    avgTime: "120ms",
                    errorRate: "0.2%",
                    status: "success"
                },
                {
                    endpoint: "/api/products",
                    requests: 289456,
                    avgTime: "156ms",
                    errorRate: "0.5%",
                    status: "success"
                },
                {
                    endpoint: "/api/orders",
                    requests: 198234,
                    avgTime: "234ms",
                    errorRate: "1.2%",
                    status: "warning"
                },
                {
                    endpoint: "/api/analytics",
                    requests: 156789,
                    avgTime: "89ms",
                    errorRate: "0.1%",
                    status: "success"
                }
            ],

            errors: [
                {
                    code: 500,
                    count: 2341,
                    message: "Internal Server Error",
                    severity: "critical"
                },
                {
                    code: 404,
                    count: 1567,
                    message: "Not Found",
                    severity: "warning"
                },
                {
                    code: 429,
                    count: 514,
                    message: "Too Many Requests",
                    severity: "info"
                }
            ]
        };

        this.cache.set('analytics', data);
        return data;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
