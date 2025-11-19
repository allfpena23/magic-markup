// ============================================
// Thread Dump Renderer for Magic Markup
// Custom renderer for analyzing thread dumps
// ============================================

/**
 * Thread Dump Analysis Functions
 */

/**
 * Parse thread dump into individual threads
 * @param {string} dumpText - The thread dump text
 * @returns {Array} Array of thread objects
 */
function parseThreads(dumpText) {
    const threads = [];
    const lines = dumpText.split('\n');
    let currentThread = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Thread header pattern: "ThreadName" #ID prio=X tid=X nid=X STATE
        if (line.startsWith('"') && line.includes('prio=')) {
            if (currentThread) {
                threads.push(currentThread);
            }
            
            const nameMatch = line.match(/"([^"]+)"/);
            const stateMatch = line.match(/(runnable|waiting|blocked|timed_waiting)/i);
            
            currentThread = {
                name: nameMatch ? nameMatch[1] : 'Unknown',
                state: stateMatch ? stateMatch[1].toUpperCase() : 'UNKNOWN',
                stackTrace: [],
                locks: []
            };
        } else if (currentThread && line.startsWith('at ')) {
            currentThread.stackTrace.push(line);
        } else if (currentThread && (line.includes('locked') || line.includes('waiting'))) {
            currentThread.locks.push(line);
        }
    }
    
    if (currentThread) {
        threads.push(currentThread);
    }
    
    return threads;
}

/**
 * Analyze thread states distribution
 * @param {Array} threads - Array of thread objects
 * @returns {Object} State distribution
 */
function analyzeThreadStates(threads) {
    const states = {
        RUNNABLE: 0,
        WAITING: 0,
        TIMED_WAITING: 0,
        BLOCKED: 0,
        UNKNOWN: 0
    };
    
    threads.forEach(thread => {
        const state = thread.state.toUpperCase().replace(/\s+/g, '_');
        if (states.hasOwnProperty(state)) {
            states[state]++;
        } else {
            states.UNKNOWN++;
        }
    });
    
    return states;
}

/**
 * Detect stuck threads
 * @param {Array} threads - Array of thread objects
 * @returns {Array} Stuck threads
 */
function detectStuckThreads(threads) {
    const stuckThreads = [];
    const stackTraceMap = new Map();
    
    threads.forEach(thread => {
        const stackKey = thread.stackTrace.slice(0, 5).join('|');
        if (!stackTraceMap.has(stackKey)) {
            stackTraceMap.set(stackKey, []);
        }
        stackTraceMap.get(stackKey).push(thread);
    });
    
    // If multiple threads have same stack trace, they might be stuck
    stackTraceMap.forEach((threadList, stackKey) => {
        if (threadList.length > 2 && stackKey.length > 0) {
            stuckThreads.push({
                count: threadList.length,
                stackTrace: threadList[0].stackTrace.slice(0, 3),
                threads: threadList.map(t => t.name)
            });
        }
    });
    
    return stuckThreads;
}

/**
 * Analyze lock contention
 * @param {Array} threads - Array of thread objects
 * @returns {Object} Lock analysis
 */
function analyzeLocks(threads) {
    const lockMap = new Map();
    
    threads.forEach(thread => {
        thread.locks.forEach(lock => {
            const lockMatch = lock.match(/0x[0-9a-f]+/i);
            if (lockMatch) {
                const lockId = lockMatch[0];
                if (!lockMap.has(lockId)) {
                    lockMap.set(lockId, []);
                }
                lockMap.get(lockId).push(thread.name);
            }
        });
    });
    
    const contendedLocks = [];
    lockMap.forEach((threads, lockId) => {
        if (threads.length > 1) {
            contendedLocks.push({
                lockId,
                threadCount: threads.length,
                threads: threads.slice(0, 5)
            });
        }
    });
    
    return {
        totalLocks: lockMap.size,
        contendedLocks: contendedLocks.sort((a, b) => b.threadCount - a.threadCount)
    };
}

/**
 * Categorize threads by type
 * @param {Array} threads - Array of thread objects
 * @returns {Object} Thread categories
 */
function categorizeThreads(threads) {
    const categories = {
        weblogic: 0,
        application: 0,
        system: 0,
        idle: 0,
        active: 0
    };
    
    threads.forEach(thread => {
        const name = thread.name.toLowerCase();
        
        if (name.includes('executethread') || name.includes('weblogic')) {
            categories.weblogic++;
        } else if (name.includes('gc') || name.includes('finalizer') || name.includes('reference')) {
            categories.system++;
        } else {
            categories.application++;
        }
        
        if (thread.state === 'RUNNABLE' || thread.state === 'BLOCKED') {
            categories.active++;
        } else {
            categories.idle++;
        }
    });
    
    return categories;
}

/**
 * Main analysis function
 * @param {string} dumpText - The thread dump text
 * @returns {Object} Analysis results
 */
function analyzeThreadDump(dumpText) {
    const threads = parseThreads(dumpText);
    const states = analyzeThreadStates(threads);
    const stuck = detectStuckThreads(threads);
    const locks = analyzeLocks(threads);
    const categories = categorizeThreads(threads);
    
    return {
        totalThreads: threads.length,
        threads,
        states,
        stuckThreads: stuck,
        locks,
        categories,
        recommendations: generateRecommendations(threads, states, stuck, locks)
    };
}

/**
 * Generate recommendations based on analysis
 * @param {Array} threads - Array of thread objects
 * @param {Object} states - Thread states
 * @param {Array} stuck - Stuck threads
 * @param {Object} locks - Lock analysis
 * @returns {Array} Recommendations
 */
function generateRecommendations(threads, states, stuck, locks) {
    const recommendations = [];
    
    if (stuck.length > 0) {
        recommendations.push('Investigate stuck thread patterns - multiple threads with identical stack traces detected');
    }
    
    if (locks.contendedLocks.length > 0) {
        recommendations.push('Review lock contention - multiple threads competing for same locks');
    }
    
    const blockedPercent = (states.BLOCKED / threads.length) * 100;
    if (blockedPercent > 10) {
        recommendations.push('High percentage of blocked threads - review synchronization strategy');
    }
    
    const waitingPercent = ((states.WAITING + states.TIMED_WAITING) / threads.length) * 100;
    if (waitingPercent > 70) {
        recommendations.push('Many threads waiting - consider thread pool optimization');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('Thread dump appears healthy - no major issues detected');
    }
    
    return recommendations;
}

/**
 * Detailed Analysis Functions
 */

/**
 * Generate detailed analysis with root cause and hot spots
 * @param {Object} basicAnalysis - Basic analysis results
 * @returns {Object} Detailed analysis results
 */
function generateDetailedAnalysis(basicAnalysis) {
    const threads = basicAnalysis.threads;
    
    return {
        ...basicAnalysis,
        rootCause: analyzeRootCause(threads, basicAnalysis.stuckThreads),
        hotSpots: analyzeHotSpots(threads),
        lockChains: analyzeLockChains(threads, basicAnalysis.locks),
        topIssues: generateTopIssues(basicAnalysis, threads)
    };
}

/**
 * Analyze root cause of stuck threads
 * @param {Array} threads - Array of thread objects
 * @param {Array} stuckPatterns - Stuck thread patterns
 * @returns {Array} Root cause analysis
 */
function analyzeRootCause(threads, stuckPatterns) {
    const rootCauses = [];
    
    stuckPatterns.forEach((pattern, index) => {
        const firstThread = threads.find(t => pattern.threads.includes(t.name));
        if (!firstThread || firstThread.stackTrace.length === 0) return;
        
        const topStack = firstThread.stackTrace[0];
        const methodMatch = topStack.match(/at\s+([^\(]+)/);
        const method = methodMatch ? methodMatch[1].trim() : 'Unknown';
        
        let category = 'Unknown';
        let severity = 'MEDIUM';
        
        if (method.includes('jdbc') || method.includes('sql') || method.includes('database')) {
            category = 'Database Connection';
            severity = 'HIGH';
        } else if (method.includes('http') || method.includes('socket') || method.includes('network')) {
            category = 'Network I/O';
            severity = 'HIGH';
        } else if (method.includes('file') || method.includes('io.')) {
            category = 'File I/O';
            severity = 'MEDIUM';
        } else if (method.includes('synchronized') || method.includes('lock')) {
            category = 'Synchronization';
            severity = 'HIGH';
        } else if (method.includes('wait') || method.includes('sleep')) {
            category = 'Thread Wait';
            severity = 'LOW';
        }
        
        rootCauses.push({
            id: index + 1,
            category,
            severity,
            threadCount: pattern.count,
            method,
            stackTrace: pattern.stackTrace,
            affectedThreads: pattern.threads.slice(0, 5)
        });
    });
    
    return rootCauses.sort((a, b) => {
        const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity] || b.threadCount - a.threadCount;
    });
}

/**
 * Analyze hot spots (most common methods in stack traces)
 * @param {Array} threads - Array of thread objects
 * @returns {Array} Hot spot analysis
 */
function analyzeHotSpots(threads) {
    const methodCounts = new Map();
    
    threads.forEach(thread => {
        thread.stackTrace.forEach(line => {
            const methodMatch = line.match(/at\s+([^\(]+)/);
            if (methodMatch) {
                const method = methodMatch[1].trim();
                methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
            }
        });
    });
    
    const hotSpots = Array.from(methodCounts.entries())
        .map(([method, count]) => {
            let type = 'Application';
            if (method.includes('jdbc') || method.includes('sql')) type = 'Database';
            else if (method.includes('http') || method.includes('socket')) type = 'Network';
            else if (method.includes('file') || method.includes('io.')) type = 'File I/O';
            else if (method.includes('java.lang') || method.includes('java.util')) type = 'System';
            
            return { method, count, type };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    return hotSpots;
}

/**
 * Analyze lock chains and dependencies
 * @param {Array} threads - Array of thread objects
 * @param {Object} lockAnalysis - Basic lock analysis
 * @returns {Array} Lock chain analysis
 */
function analyzeLockChains(threads, lockAnalysis) {
    const chains = [];
    
    lockAnalysis.contendedLocks.forEach(lock => {
        const chain = {
            lockId: lock.lockId,
            threadCount: lock.threadCount,
            threads: []
        };
        
        lock.threads.forEach(threadName => {
            const thread = threads.find(t => t.name === threadName);
            if (thread) {
                chain.threads.push({
                    name: threadName,
                    state: thread.state,
                    topMethod: thread.stackTrace[0] || 'No stack trace'
                });
            }
        });
        
        chains.push(chain);
    });
    
    return chains.slice(0, 5);
}

/**
 * Generate top issues summary
 * @param {Object} analysis - Basic analysis
 * @param {Array} threads - Array of thread objects
 * @returns {Array} Top issues
 */
function generateTopIssues(analysis, threads) {
    const issues = [];
    
    if (analysis.stuckThreads.length > 0) {
        const totalStuck = analysis.stuckThreads.reduce((sum, p) => sum + p.count, 0);
        issues.push({
            severity: 'CRITICAL',
            title: `${totalStuck} threads stuck in ${analysis.stuckThreads.length} pattern(s)`,
            description: 'Multiple threads are stuck with identical stack traces',
            recommendation: 'Investigate the root cause of stuck threads and resolve blocking operations'
        });
    }
    
    if (analysis.locks.contendedLocks.length > 0) {
        const topLock = analysis.locks.contendedLocks[0];
        issues.push({
            severity: 'HIGH',
            title: `${analysis.locks.contendedLocks.length} contended lock(s) detected`,
            description: `Lock ${topLock.lockId} is contended by ${topLock.threadCount} threads`,
            recommendation: 'Review synchronization strategy and consider lock-free alternatives'
        });
    }
    
    const blockedPercent = (analysis.states.BLOCKED / analysis.totalThreads) * 100;
    if (blockedPercent > 5) {
        issues.push({
            severity: 'HIGH',
            title: `${blockedPercent.toFixed(1)}% of threads are blocked`,
            description: 'High percentage of blocked threads indicates contention issues',
            recommendation: 'Identify and resolve lock contention points'
        });
    }
    
    const activePercent = (analysis.categories.active / analysis.totalThreads) * 100;
    if (activePercent > 85) {
        issues.push({
            severity: 'MEDIUM',
            title: `Thread pool ${activePercent.toFixed(1)}% utilized`,
            description: 'Thread pool is nearing exhaustion',
            recommendation: 'Monitor for potential thread pool exhaustion and consider increasing pool size'
        });
    }
    
    if (issues.length === 0) {
        issues.push({
            severity: 'INFO',
            title: 'No major issues detected',
            description: 'Thread dump appears healthy',
            recommendation: 'Continue monitoring for any changes'
        });
    }
    
    return issues.slice(0, 5);
}

/**
 * HTML Formatting Functions
 */

/**
 * Format basic analysis results as HTML
 * @param {Object} analysis - Analysis results
 * @returns {string} HTML string
 */
function formatBasicAnalysisDisplay(analysis) {
    const total = analysis.totalThreads;
    const states = analysis.states;
    
    let html = `
        <div class="analysis-header">
            <div class="analysis-title">📊 THREAD DUMP ANALYSIS</div>
        </div>
        
        <div class="analysis-section">
            <div class="analysis-section-title">
                <span class="analysis-section-icon">📈</span>
                Summary
            </div>
            <div class="analysis-grid">
                <div class="analysis-card">
                    <div class="analysis-card-value">${total}</div>
                    <div class="analysis-card-label">Total Threads</div>
                </div>
                <div class="analysis-card">
                    <div class="analysis-card-value">${analysis.categories.active}</div>
                    <div class="analysis-card-label">Active</div>
                </div>
                <div class="analysis-card">
                    <div class="analysis-card-value">${analysis.categories.idle}</div>
                    <div class="analysis-card-label">Idle</div>
                </div>
            </div>
        </div>
        
        <hr class="analysis-divider">
        
        <div class="analysis-section">
            <div class="analysis-section-title">
                <span class="analysis-section-icon">🔄</span>
                Thread States
            </div>
    `;
    
    Object.entries(states).forEach(([state, count]) => {
        if (count > 0) {
            const percent = (count / total * 100).toFixed(1);
            const barClass = state === 'BLOCKED' ? 'error' : 
                           state === 'RUNNABLE' ? 'success' : 
                           state === 'TIMED_WAITING' ? 'warning' : '';
            
            html += `
                <div class="analysis-progress-bar">
                    <div class="analysis-progress-label">${state}:</div>
                    <div class="analysis-progress-track">
                        <div class="analysis-progress-fill ${barClass}" style="width: ${percent}%"></div>
                    </div>
                    <div class="analysis-progress-text">${count} (${percent}%)</div>
                </div>
            `;
        }
    });
    
    html += `</div><hr class="analysis-divider">`;
    
    html += `
        <div class="analysis-section">
            <div class="analysis-section-title">
                <span class="analysis-section-icon">🧵</span>
                Thread Categories
            </div>
            <div class="analysis-metric">
                <span class="analysis-metric-label">WebLogic Threads:</span>
                <span class="analysis-metric-value">${analysis.categories.weblogic}</span>
            </div>
            <div class="analysis-metric">
                <span class="analysis-metric-label">Application Threads:</span>
                <span class="analysis-metric-value">${analysis.categories.application}</span>
            </div>
            <div class="analysis-metric">
                <span class="analysis-metric-label">System Threads:</span>
                <span class="analysis-metric-value">${analysis.categories.system}</span>
            </div>
        </div>
    `;
    
    if (analysis.stuckThreads.length > 0 || analysis.locks.contendedLocks.length > 0) {
        html += `
            <hr class="analysis-divider">
            <div class="analysis-section">
                <div class="analysis-section-title">
                    <span class="analysis-section-icon">⚠️</span>
                    Issues Detected
                </div>
                <div class="analysis-issues">
        `;
        
        if (analysis.stuckThreads.length > 0) {
            html += `
                <div class="analysis-issue-item">
                    <span class="analysis-issue-icon">⚠️</span>
                    <span class="analysis-issue-text">${analysis.stuckThreads.length} stuck thread pattern(s) detected</span>
                </div>
            `;
        }
        
        if (analysis.locks.contendedLocks.length > 0) {
            html += `
                <div class="analysis-issue-item">
                    <span class="analysis-issue-icon">⚠️</span>
                    <span class="analysis-issue-text">${analysis.locks.contendedLocks.length} contended lock(s) detected</span>
                </div>
            `;
        }
        
        html += `</div></div>`;
    }
    
    html += `
        <hr class="analysis-divider">
        <div class="analysis-section">
            <div class="analysis-section-title">
                <span class="analysis-section-icon">💡</span>
                Recommendations
            </div>
            <div class="analysis-recommendations">
    `;
    
    analysis.recommendations.forEach(rec => {
        html += `
            <div class="analysis-recommendation-item">
                <span class="analysis-recommendation-bullet">•</span>
                <span class="analysis-recommendation-text">${rec}</span>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    return html;
}

/**
 * Create large text display with Raw/Basic/Advanced views
 * @param {Array} lines - Array of text lines
 * @param {string} filename - Filename for download
 * @returns {HTMLElement} Text display container
 */
function createLargeTextDisplay(lines, filename = 'data.txt') {
    const container = document.createElement('div');
    container.className = 'text-display';
    
    const content = document.createElement('div');
    content.className = 'text-content';
    
    const allText = Array.isArray(lines) ? lines.join('\n') : String(lines);
    const allLines = allText.split('\n');
    
    let isTruncated = allLines.length > 100;
    
    if (isTruncated) {
        content.classList.add('truncated');
        content.textContent = allLines.slice(0, 100).join('\n');
    } else {
        content.textContent = allText;
    }
    
    container.appendChild(content);
    
    // Create basic analysis view (hidden by default)
    const basicAnalysisView = document.createElement('div');
    basicAnalysisView.className = 'analysis-view';
    basicAnalysisView.style.display = 'none';
    container.appendChild(basicAnalysisView);
    
    // Create detailed analysis view (hidden by default)
    const detailedAnalysisView = document.createElement('div');
    detailedAnalysisView.className = 'analysis-view';
    detailedAnalysisView.style.display = 'none';
    container.appendChild(detailedAnalysisView);
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'text-actions';
    
    if (isTruncated) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'text-button';
        showMoreBtn.textContent = 'Show More';
        
        showMoreBtn.addEventListener('click', () => {
            if (content.classList.contains('truncated')) {
                content.classList.remove('truncated');
                content.textContent = allText;
                showMoreBtn.textContent = 'Show Less';
            } else {
                content.classList.add('truncated');
                content.textContent = allLines.slice(0, 100).join('\n');
                showMoreBtn.textContent = 'Show More';
            }
        });
        
        actions.appendChild(showMoreBtn);
    }
    
    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'text-button secondary';
    downloadBtn.textContent = 'Download';
    
    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([allText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });
    
    actions.appendChild(downloadBtn);
    
    // View mode separator
    const separator = document.createElement('span');
    separator.textContent = ' | View: ';
    separator.style.margin = '0 0.5rem';
    separator.style.color = 'var(--text-secondary)';
    actions.appendChild(separator);
    
    // Raw view button
    const rawBtn = document.createElement('button');
    rawBtn.className = 'text-button active';
    rawBtn.textContent = 'Raw';
    rawBtn.dataset.view = 'raw';
    
    // Basic analysis button
    const basicBtn = document.createElement('button');
    basicBtn.className = 'text-button';
    basicBtn.textContent = 'Basic';
    basicBtn.dataset.view = 'basic';
    
    // Advanced analysis button
    const advancedBtn = document.createElement('button');
    advancedBtn.className = 'text-button';
    advancedBtn.textContent = 'Advanced';
    advancedBtn.dataset.view = 'advanced';
    
    // View switching function
    const switchView = (viewType) => {
        [rawBtn, basicBtn, advancedBtn].forEach(btn => btn.classList.remove('active'));
        
        content.style.display = 'none';
        basicAnalysisView.style.display = 'none';
        detailedAnalysisView.style.display = 'none';
        
        if (viewType === 'raw') {
            content.style.display = 'block';
            rawBtn.classList.add('active');
        } else if (viewType === 'basic') {
            if (basicAnalysisView.innerHTML === '') {
                const analysis = analyzeThreadDump(allText);
                basicAnalysisView.innerHTML = formatBasicAnalysisDisplay(analysis);
            }
            basicAnalysisView.style.display = 'block';
            basicBtn.classList.add('active');
        } else if (viewType === 'advanced') {
            if (detailedAnalysisView.innerHTML === '') {
                const analysis = analyzeThreadDump(allText);
                const detailedAnalysis = generateDetailedAnalysis(analysis);
                detailedAnalysisView.innerHTML = formatDetailedAnalysisDisplay(detailedAnalysis);
            }
            detailedAnalysisView.style.display = 'block';
            advancedBtn.classList.add('active');
        }
    };
    
    rawBtn.addEventListener('click', () => switchView('raw'));
    basicBtn.addEventListener('click', () => switchView('basic'));
    advancedBtn.addEventListener('click', () => switchView('advanced'));
    
    actions.appendChild(rawBtn);
    actions.appendChild(basicBtn);
    actions.appendChild(advancedBtn);
    
    container.appendChild(actions);
    
    return container;
}

/**
 * Magic Markup Custom Renderer
 * Detects stackDumps arrays and renders them with thread dump analysis
 */
const ThreadDumpRenderer = {
    name: 'thread-dump-renderer',
    version: '1.0.0',
    
    /**
     * Check if this renderer should handle the value
     * @param {string} key - The property key
     * @param {*} value - The property value
     * @returns {boolean} True if this renderer should handle it
     */
    canRender(key, value) {
        // Auto-detect stackDumps arrays
        return key === 'stackDumps' && Array.isArray(value);
    },
    
    /**
     * Render the stackDumps array
     * @param {string} key - The property key
     * @param {Array} value - The stackDumps array
     * @param {string} label - Formatted label
     * @param {Object} utils - Utility functions from Magic Markup
     * @returns {HTMLElement} The rendered element
     */
    render(key, value, label, utils) {
        const container = document.createElement('div');
        container.className = 'thread-dump-container';
        
        value.forEach((dump, index) => {
            const dumpCard = document.createElement('div');
            dumpCard.className = 'card';
            dumpCard.style.marginBottom = '0.5rem';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.textContent = `Stack Dump ${index + 1}: ${dump.serverName || 'Unknown Server'}`;
            dumpCard.appendChild(cardHeader);
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            // Display metadata (all properties except 'dump')
            for (const [dumpKey, dumpValue] of Object.entries(dump)) {
                if (dumpKey === 'dump') continue;
                
                const row = document.createElement('div');
                row.className = 'card-row';
                
                const keySpan = document.createElement('span');
                keySpan.className = 'key';
                keySpan.textContent = utils.formatLabel(dumpKey) + ':';
                
                const valueSpan = document.createElement('span');
                valueSpan.className = 'value';
                valueSpan.textContent = dumpValue === null ? 'null' : dumpValue;
                
                utils.applyValueHighlighting(valueSpan, dumpValue);
                
                row.appendChild(keySpan);
                row.appendChild(valueSpan);
                cardBody.appendChild(row);
            }
            
            // Display thread dump with analysis
            if (dump.dump) {
                const dumpDisplay = createLargeTextDisplay(
                    dump.dump,
                    `stackdump_${dump.serverName || index}.txt`
                );
                cardBody.appendChild(dumpDisplay);
            }
            
            dumpCard.appendChild(cardBody);
            container.appendChild(dumpCard);
        });
        
        return container;
    },
    
    /**
     * Optional: Inject custom CSS
     * @returns {string} CSS string
     */
    getStyles() {
        // CSS will be in separate file: thread-dump-renderer.css
        return '';
    }
};

// Export for use with Magic Markup
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreadDumpRenderer;
}

/**
 * Format detailed analysis results as HTML
 * @param {Object} analysis - Detailed analysis results
 * @returns {string} HTML string
 */
function formatDetailedAnalysisDisplay(analysis) {
    let html = `
        <div class="analysis-header">
            <div class="analysis-title">🔍 DETAILED THREAD DUMP ANALYSIS</div>
        </div>
    `;
    
    html += `
        <div class="analysis-section">
            <div class="analysis-section-title">
                <span class="analysis-section-icon">🎯</span>
                Top Issues
            </div>
    `;
    
    analysis.topIssues.forEach((issue) => {
        const severityClass = issue.severity.toLowerCase();
        const severityIcon = issue.severity === 'CRITICAL' ? '🔴' :
                            issue.severity === 'HIGH' ? '🟠' :
                            issue.severity === 'MEDIUM' ? '🟡' : '🟢';
        
        html += `
            <div class="issue-card ${severityClass}">
                <div class="issue-header">
                    <span class="issue-icon">${severityIcon}</span>
                    <span class="issue-severity">${issue.severity}</span>
                    <span class="issue-title">${issue.title}</span>
                </div>
                <div class="issue-description">${issue.description}</div>
                <div class="issue-recommendation">
                    <strong>💡 Recommendation:</strong> ${issue.recommendation}
                </div>
            </div>
        `;
    });
    
    html += `</div><hr class="analysis-divider">`;
    
    if (analysis.rootCause && analysis.rootCause.length > 0) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-title">
                    <span class="analysis-section-icon">🔍</span>
                    Root Cause Analysis
                </div>
        `;
        
        analysis.rootCause.forEach(cause => {
            const severityClass = cause.severity.toLowerCase();
            html += `
                <div class="root-cause-card ${severityClass}">
                    <div class="root-cause-header">
                        <span class="root-cause-id">Pattern #${cause.id}</span>
                        <span class="root-cause-category">${cause.category}</span>
                        <span class="root-cause-severity">${cause.severity}</span>
                    </div>
                    <div class="root-cause-details">
                        <div class="root-cause-metric">
                            <strong>Affected Threads:</strong> ${cause.threadCount}
                        </div>
                        <div class="root-cause-metric">
                            <strong>Root Method:</strong> <code>${cause.method}</code>
                        </div>
                        <div class="root-cause-stack">
                            <strong>Stack Trace:</strong>
                            <pre>${cause.stackTrace.join('\n')}</pre>
                        </div>
                        <div class="root-cause-threads">
                            <strong>Sample Threads:</strong> ${cause.affectedThreads.slice(0, 3).join(', ')}
                            ${cause.affectedThreads.length > 3 ? ` +${cause.affectedThreads.length - 3} more` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div><hr class="analysis-divider">`;
    }
    
    if (analysis.hotSpots && analysis.hotSpots.length > 0) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-title">
                    <span class="analysis-section-icon">🔥</span>
                    Hot Spots (Top Methods)
                </div>
                <div class="hotspots-table">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Method</th>
                                <th>Type</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        analysis.hotSpots.forEach((spot, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td><code>${spot.method}</code></td>
                    <td><span class="badge-item">${spot.type}</span></td>
                    <td>${spot.count}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
            <hr class="analysis-divider">
        `;
    }
    
    if (analysis.lockChains && analysis.lockChains.length > 0) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-title">
                    <span class="analysis-section-icon">🔗</span>
                    Lock Chains
                </div>
        `;
        
        analysis.lockChains.forEach((chain) => {
            html += `
                <div class="lock-chain-card">
                    <div class="lock-chain-header">
                        Lock ${chain.lockId} (${chain.threadCount} threads contending)
                    </div>
                    <div class="lock-chain-threads">
        `;
            
            chain.threads.forEach((thread, idx) => {
                const arrow = idx < chain.threads.length - 1 ? '↓' : '';
                html += `
                    <div class="lock-chain-thread">
                        <span class="thread-name">${thread.name}</span>
                        <span class="thread-state ${thread.state.toLowerCase()}">${thread.state}</span>
                        <div class="thread-method"><code>${thread.topMethod}</code></div>
                        ${arrow ? `<div class="chain-arrow">${arrow}</div>` : ''}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `</div><hr class="analysis-divider">`;
    }
    
    html += `
        <div class="analysis-section">
            <div class="analysis-section-title">
                <span class="analysis-section-icon">📊</span>
                Summary Statistics
            </div>
            <div class="analysis-grid">
                <div class="analysis-card">
                    <div class="analysis-card-value">${analysis.totalThreads}</div>
                    <div class="analysis-card-label">Total Threads</div>
                </div>
                <div class="analysis-card">
                    <div class="analysis-card-value">${analysis.categories.active}</div>
                    <div class="analysis-card-label">Active</div>
                </div>
                <div class="analysis-card">
                    <div class="analysis-card-value">${analysis.categories.idle}</div>
                    <div class="analysis-card-label">Idle</div>
                </div>
            </div>
        </div>
    `;
    
    return html;
}
