/**
 * Magic Markup - JSON to HTML Converter Library
 * Version: 1.0.0
 * A powerful, flexible library for converting JSON data into beautiful HTML markup
 * 
 * @author Magic Markup Team
 * @license MIT
 */

(function(global) {
    'use strict';

    /**
     * Main MagicMarkup class
     */
    class MagicMarkup {
        constructor(container, options = {}) {
            this.container = typeof container === 'string' 
                ? document.querySelector(container) 
                : container;
            
            if (!this.container) {
                throw new Error('MagicMarkup: Container element not found');
            }

            this.options = this._mergeOptions(options);
            this.data = null;
        }

        /**
         * Merge user options with defaults
         */
        _mergeOptions(userOptions) {
            const defaults = {
                showStats: true,
                showHeader: true,
                autoExpand: false,
                defaultView: 'table',
                theme: 'default',
                compactMode: false,
                apiEndpoint: '/api/submit',
                buttons: {
                    primitive: [],
                    table: [],
                    card: [],
                    object: []
                },
                onError: (error) => console.error('MagicMarkup Error:', error),
                onRender: () => {}
            };

            return {
                ...defaults,
                ...userOptions,
                buttons: {
                    ...defaults.buttons,
                    ...(userOptions.buttons || {})
                }
            };
        }

        /**
         * Render JSON data
         * @param {Object|string} data - JSON object or URL to fetch
         */
        async render(data) {
            try {
                // If data is a string, treat it as a URL
                if (typeof data === 'string') {
                    const response = await fetch(data);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    this.data = await response.json();
                } else {
                    this.data = data;
                }

                this._renderContent();
                this.options.onRender();
            } catch (error) {
                this.options.onError(error);
                this._renderError(error);
            }
        }

        /**
         * Render the content
         */
        _renderContent() {
            this.container.innerHTML = '';
            this.container.className = 'mm-container';

            if (this.options.showHeader) {
                this._renderHeader();
            }

            if (this.options.showStats) {
                this._renderStats();
            }

            const dataContainer = document.createElement('div');
            dataContainer.className = 'mm-data-container';

            const dataList = document.createElement('div');
            dataList.className = 'mm-data-list';
            dataList.id = 'mm-data-list';

            this._processData(this.data, dataList);

            dataContainer.appendChild(dataList);
            this.container.appendChild(dataContainer);
        }

        /**
         * Render header
         */
        _renderHeader() {
            const header = document.createElement('div');
            header.className = 'mm-header';
            header.innerHTML = `
                <h1>Magic Markup</h1>
                <p class="mm-subtitle">JSON to HTML Converter</p>
            `;
            this.container.appendChild(header);
        }

        /**
         * Render statistics
         */
        _renderStats() {
            const groups = this._groupByType(this.data);
            const totalItems = groups.strings.length + groups.objects.length + 
                              groups.arrayStrings.length + groups.arrayObjects.length;

            const stats = document.createElement('div');
            stats.className = 'mm-stats';
            stats.innerHTML = `
                <div class="mm-stat-item">
                    <span class="mm-stat-label">Total Items:</span>
                    <span class="mm-stat-value">${totalItems}</span>
                </div>
                <div class="mm-stat-item">
                    <span class="mm-stat-label">Primitives:</span>
                    <span class="mm-stat-value mm-success">${groups.strings.length}</span>
                </div>
                <div class="mm-stat-item">
                    <span class="mm-stat-label">Objects:</span>
                    <span class="mm-stat-value">${groups.objects.length}</span>
                </div>
                <div class="mm-stat-item">
                    <span class="mm-stat-label">Arrays:</span>
                    <span class="mm-stat-value">${groups.arrayStrings.length + groups.arrayObjects.length}</span>
                </div>
            `;
            this.container.appendChild(stats);
        }

        /**
         * Render error message
         */
        _renderError(error) {
            this.container.innerHTML = `
                <div class="mm-error">
                    <h3>Error Loading Data</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }

        /**
         * Process and render data
         */
        _processData(data, container) {
            const groups = this._groupByType(data);

            // Render primitive strings
            groups.strings.forEach(({ key, value, label }) => {
                const element = this._createPrimitiveElement(key, value, label);
                container.appendChild(element);
            });

            // Add button group for primitives if configured
            if (groups.strings.length > 0 && this.options.buttons.primitive.length > 0) {
                const buttonGroup = this._createButtonGroup('primitive');
                container.appendChild(buttonGroup);
            }

            // Render objects
            groups.objects.forEach(({ key, value, label }) => {
                const content = this._createObjectElement(key, value, label);
                const accordion = this._createAccordion(label, content);
                container.appendChild(accordion);
            });

            // Render array of strings
            groups.arrayStrings.forEach(({ key, value, label }) => {
                const content = this._createArrayStringElement(key, value, label);
                const accordion = this._createAccordion(label, content);
                container.appendChild(accordion);
            });

            // Render array of objects
            groups.arrayObjects.forEach(({ key, value, label }) => {
                const content = this._createArrayObjectElement(key, value, label);
                const accordion = this._createAccordion(label, content);
                container.appendChild(accordion);
            });
        }

        /**
         * Group data by type
         */
        _groupByType(data) {
            const groups = {
                strings: [],
                objects: [],
                arrayStrings: [],
                arrayObjects: []
            };

            for (const [key, value] of Object.entries(data)) {
                const type = this._detectValueType(value);
                const label = this._formatLabel(key);

                switch (type) {
                    case 'string':
                        groups.strings.push({ key, value, label });
                        break;
                    case 'object':
                        groups.objects.push({ key, value, label });
                        break;
                    case 'array-string':
                        groups.arrayStrings.push({ key, value, label });
                        break;
                    case 'array-object':
                        groups.arrayObjects.push({ key, value, label });
                        break;
                }
            }

            return groups;
        }

        /**
         * Detect value type
         */
        _detectValueType(value) {
            if (value === null || value === undefined) {
                return 'null';
            }

            if (Array.isArray(value)) {
                if (value.length === 0) return 'array-string';

                const allStrings = value.every(item =>
                    typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
                );

                return allStrings ? 'array-string' : 'array-object';
            }

            if (typeof value === 'object') {
                return 'object';
            }

            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                return 'string';
            }

            return 'other';
        }

        /**
         * Format label from key
         */
        _formatLabel(key) {
            return key
                .replace(/([A-Z])/g, ' $1')
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .trim();
        }

        /**
         * Create primitive element
         */
        _createPrimitiveElement(key, value, label) {
            const div = document.createElement('div');
            div.className = 'mm-key-value-pair';
            div.dataset.key = key;
            div.dataset.value = value;
            div.dataset.label = label;

            const keySpan = document.createElement('span');
            keySpan.className = 'mm-key';
            keySpan.textContent = label + ':';

            const valueSpan = document.createElement('span');
            valueSpan.className = 'mm-value';
            valueSpan.textContent = value;

            this._applyValueHighlighting(valueSpan, value);

            div.appendChild(keySpan);
            div.appendChild(valueSpan);

            div.addEventListener('click', () => {
                document.querySelectorAll('.mm-key-value-pair').forEach(el => {
                    el.classList.remove('mm-selected');
                });
                div.classList.add('mm-selected');
            });

            return div;
        }

        /**
         * Apply value highlighting
         */
        _applyValueHighlighting(element, value) {
            if (value === null || value === undefined) return;

            const valueStr = String(value).toLowerCase().trim();

            if (valueStr === 'true') {
                element.classList.add('mm-value-boolean-true');
            } else if (valueStr === 'false') {
                element.classList.add('mm-value-boolean-false');
            } else if (valueStr === 'critical' || valueStr === 'error') {
                element.classList.add('mm-value-severity-critical');
            } else if (valueStr === 'warning' || valueStr === 'warn') {
                element.classList.add('mm-value-severity-warning');
            } else if (valueStr === 'info' || valueStr === 'information') {
                element.classList.add('mm-value-severity-info');
            } else if (valueStr === 'success' || valueStr === 'ok') {
                element.classList.add('mm-value-severity-success');
            }
        }

        /**
         * Create button group for primitives
         */
        _createButtonGroup(context) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mm-button-group';

            const buttons = this.options.buttons[context] || [];

            buttons.forEach(buttonConfig => {
                const button = this._createButton(buttonConfig, context);
                buttonContainer.appendChild(button);
            });

            return buttonContainer;
        }

        /**
         * Create a button
         */
        _createButton(config, context) {
            const button = document.createElement('button');
            
            // Handle both object and shorthand syntax
            if (typeof config === 'function') {
                button.className = 'mm-action-btn mm-btn-primary';
                button.textContent = 'Action';
                button.addEventListener('click', () => {
                    const selected = document.querySelector('.mm-key-value-pair.mm-selected');
                    if (selected) {
                        config({
                            key: selected.dataset.key,
                            value: selected.dataset.value,
                            label: selected.dataset.label
                        });
                    }
                });
            } else {
                button.className = `mm-action-btn ${config.className || 'mm-btn-primary'}`;
                button.textContent = config.icon ? `${config.icon} ${config.name}` : config.name;
                
                if (config.handler) {
                    button.addEventListener('click', () => {
                        if (context === 'primitive') {
                            const selected = document.querySelector('.mm-key-value-pair.mm-selected');
                            if (selected) {
                                config.handler({
                                    key: selected.dataset.key,
                                    value: selected.dataset.value,
                                    label: selected.dataset.label
                                }, button);
                            } else {
                                alert('Please select an item first');
                            }
                        }
                    });
                }
            }

            return button;
        }

        /**
         * Create action buttons for table/card rows
         */
        _createActionButtons(data, context) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mm-action-buttons';

            const buttons = this.options.buttons[context] || [];

            buttons.forEach(config => {
                const button = document.createElement('button');
                button.className = `mm-action-btn-small ${config.className || 'mm-btn-primary'}`;
                button.textContent = config.icon ? `${config.icon} ${config.name}` : config.name;

                if (config.handler) {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        config.handler(data, button);
                    });
                }

                buttonContainer.appendChild(button);
            });

            return buttonContainer;
        }

        /**
         * Create object element
         */
        _createObjectElement(key, value, label) {
            const card = document.createElement('div');
            card.className = 'mm-card';

            const cardBody = document.createElement('div');
            cardBody.className = 'mm-card-body';

            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                const nestedType = this._detectValueType(nestedValue);
                const nestedLabel = this._formatLabel(nestedKey);

                if (nestedType === 'string' || nestedType === 'null') {
                    const row = document.createElement('div');
                    row.className = 'mm-card-row';

                    const rowKey = document.createElement('span');
                    rowKey.className = 'mm-key';
                    rowKey.textContent = nestedLabel + ':';

                    const rowValue = document.createElement('span');
                    rowValue.className = 'mm-value';
                    rowValue.textContent = nestedValue === null ? 'null' : nestedValue;

                    this._applyValueHighlighting(rowValue, nestedValue);

                    row.appendChild(rowKey);
                    row.appendChild(rowValue);
                    cardBody.appendChild(row);
                }
            }

            card.appendChild(cardBody);

            // Add action buttons if configured
            if (this.options.buttons.object.length > 0) {
                const cardFooter = document.createElement('div');
                cardFooter.className = 'mm-card-footer';
                const actionButtons = this._createActionButtons(value, 'object');
                cardFooter.appendChild(actionButtons);
                card.appendChild(cardFooter);
            }

            return card;
        }

        /**
         * Create array of strings element
         */
        _createArrayStringElement(key, value, label) {
            const container = document.createElement('div');

            if (this._isShortAndFew(value)) {
                container.className = 'mm-badge-list';
                value.forEach(item => {
                    const badge = document.createElement('span');
                    badge.className = 'mm-badge-item';
                    badge.textContent = item;
                    this._applyValueHighlighting(badge, item);
                    container.appendChild(badge);
                });
            } else {
                container.className = 'mm-label-list';
                value.forEach(item => {
                    const label = document.createElement('div');
                    label.className = 'mm-label-item';
                    label.textContent = item;
                    this._applyValueHighlighting(label, item);
                    container.appendChild(label);
                });
            }

            return container;
        }

        /**
         * Check if array is short and few
         */
        _isShortAndFew(strings) {
            if (!Array.isArray(strings) || strings.length === 0) return false;
            if (strings.length > 10) return false;
            const maxLength = Math.max(...strings.map(s => String(s).length));
            return maxLength < 20;
        }

        /**
         * Create array of objects element
         */
        _createArrayObjectElement(key, value, label) {
            const container = document.createElement('div');

            // Create toggle buttons
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'mm-view-toggle';

            const tableBtn = document.createElement('button');
            tableBtn.className = 'mm-toggle-button mm-active';
            tableBtn.textContent = 'Table View';

            const cardBtn = document.createElement('button');
            cardBtn.className = 'mm-toggle-button';
            cardBtn.textContent = 'Card View';

            toggleDiv.appendChild(tableBtn);
            toggleDiv.appendChild(cardBtn);

            // Create views
            const tableView = this._createTableView(value);
            tableView.style.display = 'block';

            const cardView = this._createCardGridView(value);
            cardView.style.display = 'none';

            // Toggle functionality
            tableBtn.addEventListener('click', () => {
                tableBtn.classList.add('mm-active');
                cardBtn.classList.remove('mm-active');
                tableView.style.display = 'block';
                cardView.style.display = 'none';
            });

            cardBtn.addEventListener('click', () => {
                cardBtn.classList.add('mm-active');
                tableBtn.classList.remove('mm-active');
                tableView.style.display = 'none';
                cardView.style.display = 'block';
            });

            container.appendChild(toggleDiv);
            container.appendChild(tableView);
            container.appendChild(cardView);

            return container;
        }

        /**
         * Create table view
         */
        _createTableView(data) {
            const container = document.createElement('div');
            container.className = 'mm-table-container';

            if (!data || data.length === 0) {
                container.textContent = 'No data available';
                return container;
            }

            const table = document.createElement('table');
            table.className = 'mm-data-table';

            // Get all unique keys
            const allKeys = new Set();
            data.forEach(obj => {
                Object.keys(obj).forEach(key => allKeys.add(key));
            });
            const keys = Array.from(allKeys);

            // Create header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            keys.forEach(key => {
                const th = document.createElement('th');
                th.textContent = this._formatLabel(key);
                headerRow.appendChild(th);
            });

            // Add actions column if buttons configured
            if (this.options.buttons.table.length > 0) {
                const actionsHeader = document.createElement('th');
                actionsHeader.textContent = 'Actions';
                actionsHeader.className = 'mm-actions-column';
                headerRow.appendChild(actionsHeader);
            }

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create body
            const tbody = document.createElement('tbody');
            data.forEach(obj => {
                const row = document.createElement('tr');
                keys.forEach(key => {
                    const td = document.createElement('td');
                    const value = obj[key];

                    if (Array.isArray(value)) {
                        td.textContent = `[${value.length} items]`;
                    } else if (typeof value === 'object' && value !== null) {
                        td.textContent = JSON.stringify(value);
                    } else {
                        td.textContent = value === null || value === undefined ? '' : value;
                        this._applyValueHighlighting(td, value);
                    }

                    row.appendChild(td);
                });

                // Add actions column
                if (this.options.buttons.table.length > 0) {
                    const actionsCell = document.createElement('td');
                    actionsCell.className = 'mm-actions-column';
                    const actionButtons = this._createActionButtons(obj, 'table');
                    actionsCell.appendChild(actionButtons);
                    row.appendChild(actionsCell);
                }

                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            container.appendChild(table);
            return container;
        }

        /**
         * Create card grid view
         */
        _createCardGridView(data) {
            const container = document.createElement('div');
            container.className = 'mm-card-grid';

            if (!data || data.length === 0) {
                container.textContent = 'No data available';
                return container;
            }

            data.forEach((obj, index) => {
                const card = document.createElement('div');
                card.className = 'mm-card';

                const cardHeader = document.createElement('div');
                cardHeader.className = 'mm-card-header';
                cardHeader.textContent = `Item ${index + 1}`;
                card.appendChild(cardHeader);

                const cardBody = document.createElement('div');
                cardBody.className = 'mm-card-body';

                for (const [key, value] of Object.entries(obj)) {
                    const row = document.createElement('div');
                    row.className = 'mm-card-row';

                    const keySpan = document.createElement('span');
                    keySpan.className = 'mm-key';
                    keySpan.textContent = this._formatLabel(key) + ':';

                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'mm-value';

                    if (Array.isArray(value)) {
                        valueSpan.textContent = `[${value.length} items]`;
                    } else if (typeof value === 'object' && value !== null) {
                        valueSpan.textContent = JSON.stringify(value);
                    } else {
                        valueSpan.textContent = value === null || value === undefined ? '' : value;
                        this._applyValueHighlighting(valueSpan, value);
                    }

                    row.appendChild(keySpan);
                    row.appendChild(valueSpan);
                    cardBody.appendChild(row);
                }

                card.appendChild(cardBody);

                // Add action buttons
                if (this.options.buttons.card.length > 0) {
                    const cardFooter = document.createElement('div');
                    cardFooter.className = 'mm-card-footer';
                    const actionButtons = this._createActionButtons(obj, 'card');
                    cardFooter.appendChild(actionButtons);
                    card.appendChild(cardFooter);
                }

                container.appendChild(card);
            });

            return container;
        }

        /**
         * Create accordion section
         */
        _createAccordion(title, content) {
            const section = document.createElement('div');
            section.className = 'mm-accordion-section';

            const header = document.createElement('div');
            header.className = 'mm-accordion-header';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'mm-accordion-title';
            titleSpan.textContent = title;

            const icon = document.createElement('span');
            icon.className = 'mm-accordion-icon';
            icon.textContent = '▼';

            header.appendChild(titleSpan);
            header.appendChild(icon);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'mm-accordion-content';

            const body = document.createElement('div');
            body.className = 'mm-accordion-body';
            body.appendChild(content);

            contentDiv.appendChild(body);

            // Toggle functionality
            header.addEventListener('click', () => {
                // Close all other accordions
                document.querySelectorAll('.mm-accordion-section.mm-active').forEach(otherSection => {
                    if (otherSection !== section) {
                        otherSection.classList.remove('mm-active');
                    }
                });

                // Toggle current section
                section.classList.toggle('mm-active');
            });

            section.appendChild(header);
            section.appendChild(contentDiv);

            return section;
        }

        /**
         * Static render method for convenience
         */
        static render(container, data, options = {}) {
            const instance = new MagicMarkup(container, options);
            instance.render(data);
            return instance;
        }

        /**
         * Set theme (light or dark)
         */
        static setTheme(theme) {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.setAttribute('data-mm-theme', 'dark');
            } else {
                root.removeAttribute('data-mm-theme');
            }
        }

        /**
         * Generate and apply custom theme from a primary color
         */
        static setCustomTheme(primaryColor) {
            const theme = MagicMarkup.generateTheme(primaryColor);
            MagicMarkup.applyTheme(theme);
        }

        /**
         * Generate a complete theme from a primary color
         */
        static generateTheme(primaryColor) {
            const hsl = MagicMarkup._hexToHSL(primaryColor);
            
            // Generate color palette
            const theme = {
                primary: primaryColor,
                primaryHover: MagicMarkup._adjustLightness(hsl, -10),
                secondary: MagicMarkup._rotateHue(hsl, 30, -20),
                success: MagicMarkup._rotateHue(hsl, 120, 0),
                error: MagicMarkup._rotateHue(hsl, -120, 0),
                warning: MagicMarkup._rotateHue(hsl, 60, 0),
                
                // Backgrounds (very light versions)
                bgPrimary: MagicMarkup._adjustLightness(hsl, 95, 5),
                bgSecondary: MagicMarkup._adjustLightness(hsl, 97, 3),
                bgTertiary: MagicMarkup._adjustLightness(hsl, 92, 8),
                bgHover: MagicMarkup._adjustLightness(hsl, 88, 10),
                
                // Text colors
                textPrimary: MagicMarkup._adjustLightness(hsl, 10, 90),
                textSecondary: MagicMarkup._adjustLightness(hsl, 35, 60),
                textMuted: MagicMarkup._adjustLightness(hsl, 55, 40),
                
                // Border
                borderColor: MagicMarkup._adjustLightness(hsl, 85, 15)
            };
            
            return theme;
        }

        /**
         * Apply theme to document
         */
        static applyTheme(theme) {
            const root = document.documentElement;
            root.style.setProperty('--mm-primary-color', theme.primary);
            root.style.setProperty('--mm-primary-hover', theme.primaryHover);
            root.style.setProperty('--mm-secondary-color', theme.secondary);
            root.style.setProperty('--mm-success-color', theme.success);
            root.style.setProperty('--mm-error-color', theme.error);
            root.style.setProperty('--mm-warning-color', theme.warning);
            
            root.style.setProperty('--mm-bg-primary', theme.bgPrimary);
            root.style.setProperty('--mm-bg-secondary', theme.bgSecondary);
            root.style.setProperty('--mm-bg-tertiary', theme.bgTertiary);
            root.style.setProperty('--mm-bg-hover', theme.bgHover);
            
            root.style.setProperty('--mm-text-primary', theme.textPrimary);
            root.style.setProperty('--mm-text-secondary', theme.textSecondary);
            root.style.setProperty('--mm-text-muted', theme.textMuted);
            
            root.style.setProperty('--mm-border-color', theme.borderColor);
        }

        /**
         * Convert hex color to HSL
         */
        static _hexToHSL(hex) {
            // Remove # if present
            hex = hex.replace('#', '');
            
            // Convert to RGB
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }
            
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        }

        /**
         * Convert HSL to hex
         */
        static _hslToHex(h, s, l) {
            s /= 100;
            l /= 100;
            
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l - c / 2;
            let r = 0, g = 0, b = 0;
            
            if (0 <= h && h < 60) {
                r = c; g = x; b = 0;
            } else if (60 <= h && h < 120) {
                r = x; g = c; b = 0;
            } else if (120 <= h && h < 180) {
                r = 0; g = c; b = x;
            } else if (180 <= h && h < 240) {
                r = 0; g = x; b = c;
            } else if (240 <= h && h < 300) {
                r = x; g = 0; b = c;
            } else if (300 <= h && h < 360) {
                r = c; g = 0; b = x;
            }
            
            const toHex = (n) => {
                const hex = Math.round((n + m) * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }

        /**
         * Adjust lightness of HSL color
         */
        static _adjustLightness(hsl, newLightness, saturationAdjust = 0) {
            return MagicMarkup._hslToHex(
                hsl.h,
                Math.max(0, Math.min(100, hsl.s + saturationAdjust)),
                Math.max(0, Math.min(100, newLightness))
            );
        }

        /**
         * Rotate hue and optionally adjust lightness
         */
        static _rotateHue(hsl, degrees, lightnessAdjust = 0) {
            const newHue = (hsl.h + degrees + 360) % 360;
            const newLightness = Math.max(0, Math.min(100, hsl.l + lightnessAdjust));
            return MagicMarkup._hslToHex(newHue, hsl.s, newLightness);
        }
    }

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MagicMarkup;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() {
            return MagicMarkup;
        });
    } else {
        global.MagicMarkup = MagicMarkup;
    }

})(typeof window !== 'undefined' ? window : this);
