// ===================================
// MINISTERS PAGE
// Singapore Budget Speeches (1960-2025)
// ===================================

let ministerData = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadMinisterData();
});

// Load minister statistics
async function loadMinisterData() {
    try {
        const response = await fetch('data/summary/ministers_overview.json');
        ministerData = await response.json();
        
        hideLoading();
        renderTimeline();
        renderCharts();
        renderMinisterProfiles();
        
    } catch (error) {
        console.error('Failed to load minister data:', error);
        document.getElementById('loading').innerHTML = `
            <p style="color: var(--color-error);">Failed to load data. Please refresh the page.</p>
        `;
    }
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

// Render timeline
function renderTimeline() {
    if (!ministerData.ministers) return;
    
    const timeline = document.getElementById('timeline');
    
    timeline.innerHTML = ministerData.ministers.map(minister => `
        <div style="display: flex; align-items: center; padding: var(--space-md); background: white; 
                    margin-bottom: var(--space-sm); border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
            <div style="flex: 1;">
                <strong>${minister.name}</strong><br>
                <span style="color: var(--color-text-light); font-size: 0.875rem;">
                    ${minister.years_served} (${minister.num_speeches} speeches)
                </span>
            </div>
            <div style="color: var(--color-primary); font-weight: 600;">
                ${minister.total_sentences} sentences
            </div>
        </div>
    `).join('');
}

// Render charts
function renderCharts() {
    renderMinisterStyleChart();
    renderMinisterTopicsChart();
}

// Chart: Minister speaking style comparison
function renderMinisterStyleChart() {
    if (!ministerData.ministers) return;
    
    const ministers = ministerData.ministers;
    
    const traces = [
        {
            x: ministers.map(m => m.name),
            y: ministers.map(m => m.avg_sentence_length),
            name: 'Avg Sentence Length',
            type: 'bar',
            marker: { color: '#0C2340' }  // Deep Navy
        },
        {
            x: ministers.map(m => m.name),
            y: ministers.map(m => m.readability_score),
            name: 'Readability Score',
            type: 'bar',
            yaxis: 'y2',
            marker: { color: '#C8102E' }  // Vibrant Red
        }
    ];
    
    const layout = {
        title: {
            text: 'Speaking Style: Sentence Length vs Readability',
            font: { size: 18, color: '#0C2340', family: 'Public Sans' }
        },
        xaxis: { 
            tickangle: -45,
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        yaxis: { 
            title: 'Avg Sentence Length (words)',
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        yaxis2: {
            title: 'Readability Score (0-100)',
            overlaying: 'y',
            side: 'right',
            gridcolor: '#E2E8F0'
        },
        height: 500,
        showlegend: true,
        legend: { orientation: 'h', y: -0.3 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 100, l: 60, r: 60 }
    };
    
    Plotly.newPlot('ministerStyleChart', traces, layout, { responsive: true });
}

// Chart: Minister policy focus
function renderMinisterTopicsChart() {
    if (!ministerData.minister_topics) return;
    
    // Create stacked bar chart
    const ministers = Object.keys(ministerData.minister_topics);
    const topics = new Set();
    
    // Collect all topics
    ministers.forEach(minister => {
        Object.keys(ministerData.minister_topics[minister]).forEach(topic => {
            topics.add(topic);
        });
    });
    
    // Get top 8 topics across all ministers
    const topicTotals = {};
    Array.from(topics).forEach(topic => {
        topicTotals[topic] = ministers.reduce((sum, minister) => 
            sum + (ministerData.minister_topics[minister][topic] || 0), 0);
    });
    
    const top8Topics = Object.entries(topicTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(t => t[0]);
    
    // Create traces
    const traces = top8Topics.map((topic, i) => ({
        x: ministers,
        y: ministers.map(minister => ministerData.minister_topics[minister][topic] || 0),
        name: topic,
        type: 'bar',
        marker: { color: getColorByIndex(i) }
    }));
    
    const layout = {
        title: {
            text: 'Top 8 Policy Topics by Minister',
            font: { size: 18, color: '#0C2340', family: 'Public Sans' }
        },
        xaxis: { 
            tickangle: -45,
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        yaxis: { 
            title: 'Number of Sentences',
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        barmode: 'stack',
        height: 500,
        showlegend: true,
        legend: { orientation: 'h', y: -0.3 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 100, l: 60, r: 20 }
    };
    
    Plotly.newPlot('ministerTopicsChart', traces, layout, { responsive: true });
}

// Render minister profile cards
function renderMinisterProfiles() {
    if (!ministerData.ministers) return;
    
    const container = document.getElementById('ministerProfiles');
    
    container.innerHTML = `
        <h3 style="grid-column: 1 / -1;">Minister Profiles</h3>
        ${ministerData.ministers.map(minister => `
            <div class="minister-card">
                <h4>${minister.name}</h4>
                <div class="minister-years">${minister.years_served}</div>
                
                <p>${minister.description || 'Finance Minister of Singapore'}</p>
                
                <div class="minister-stats">
                    <div class="minister-stat">
                        <div class="minister-stat-value">${minister.num_speeches}</div>
                        <div class="minister-stat-label">Speeches</div>
                    </div>
                    <div class="minister-stat">
                        <div class="minister-stat-value">${minister.total_sentences}</div>
                        <div class="minister-stat-label">Sentences</div>
                    </div>
                    <div class="minister-stat">
                        <div class="minister-stat-value">${minister.avg_sentence_length}</div>
                        <div class="minister-stat-label">Avg Words/Sentence</div>
                    </div>
                    <div class="minister-stat">
                        <div class="minister-stat-value">${minister.readability_score}</div>
                        <div class="minister-stat-label">Readability</div>
                    </div>
                </div>
                
                ${minister.top_topics ? `
                    <div style="margin-top: var(--space-md); font-size: 0.875rem;">
                        <strong>Top Focus:</strong> ${minister.top_topics.slice(0, 3).join(', ')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    `;
}

// Utility: Get color by index (civic strength palette)
function getColorByIndex(index) {
    const colors = [
        '#0C2340',  // Deep Navy
        '#C8102E',  // Vibrant Red
        '#2D6A4F',  // Forest Green
        '#D4A72C',  // Civic Gold
        '#1A3A5C',  // Steel Blue
        '#9EA2A2',  // Slate Gray
        '#6B4E71',  // Muted Purple
        '#B45A3C',  // Terracotta
        '#3D7C8C',  // Teal
        '#5C5C5C'   // Charcoal
    ];
    return colors[index % colors.length];
}
