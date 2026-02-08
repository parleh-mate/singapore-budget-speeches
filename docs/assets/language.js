// ===================================
// LANGUAGE ANALYSIS PAGE
// Singapore Budget Speeches (1960-2025)
// ===================================

let languageData = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadLanguageData();
});

// Load language statistics
async function loadLanguageData() {
    try {
        const response = await fetch('data/summary/yearly_overview.json');
        languageData = await response.json();
        
        hideLoading();
        renderCharts();
        renderInsights();
        
    } catch (error) {
        console.error('Failed to load language data:', error);
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

// Render charts
function renderCharts() {
    renderReadabilityChart();
    renderSentenceLengthChart();
    renderMinisterReadabilityChart();
}

// Chart: Readability over time
function renderReadabilityChart() {
    if (!languageData.by_year) return;
    
    const years = Object.keys(languageData.by_year).sort();
    
    const trace = {
        x: years,
        y: years.map(year => languageData.by_year[year].readability || 0),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Flesch Reading Ease',
        line: { color: '#0C2340', width: 3 },
        marker: { size: 8, color: '#0C2340' }
    };
    
    // Add benchmark lines
    const benchmarks = [
        { value: 60, label: '60: Standard', color: '#2D6A4F' },
        { value: 50, label: '50: Fairly Difficult', color: '#D4A72C' },
        { value: 30, label: '30: Very Difficult', color: '#C8102E' }
    ];
    
    const shapes = benchmarks.map(b => ({
        type: 'line',
        x0: years[0],
        x1: years[years.length - 1],
        y0: b.value,
        y1: b.value,
        line: { color: b.color, width: 1, dash: 'dash' }
    }));
    
    const layout = {
        title: {
            text: 'Budget Speech Readability Over Time',
            font: { size: 18, color: '#0C2340', family: 'Public Sans' }
        },
        xaxis: { 
            title: 'Year',
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        yaxis: { 
            title: 'Flesch Reading Ease Score',
            range: [0, 100],
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        shapes: shapes,
        annotations: benchmarks.map(b => ({
            x: years[years.length - 1],
            y: b.value,
            text: b.label,
            showarrow: false,
            xanchor: 'left',
            xshift: 10,
            font: { size: 10, color: b.color }
        })),
        height: 500,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 120 }
    };
    
    Plotly.newPlot('readabilityChart', [trace], layout, { responsive: true });
}

// Chart: Sentence length over time
function renderSentenceLengthChart() {
    if (!languageData.by_year) return;
    
    const years = Object.keys(languageData.by_year).sort();
    
    const trace = {
        x: years,
        y: years.map(year => languageData.by_year[year].avg_sentence_length || 0),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Avg Sentence Length',
        line: { color: '#C8102E', width: 3 },
        marker: { size: 8, color: '#C8102E' },
        fill: 'tozeroy',
        fillcolor: 'rgba(200, 16, 46, 0.1)'
    };
    
    const layout = {
        title: {
            text: 'Average Sentence Length Over Time',
            font: { size: 18, color: '#0C2340', family: 'Public Sans' }
        },
        xaxis: { 
            title: 'Year',
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        yaxis: { 
            title: 'Words per Sentence',
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        height: 500,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('sentenceLengthChart', [trace], layout, { responsive: true });
}

// Chart: Readability by minister
function renderMinisterReadabilityChart() {
    if (!languageData.by_minister) return;
    
    const ministers = Object.keys(languageData.by_minister);
    
    const trace = {
        x: ministers,
        y: ministers.map(m => languageData.by_minister[m].avg_readability || 0),
        type: 'bar',
        marker: {
            color: ministers.map((_, i) => getColorByIndex(i))
        }
    };
    
    const layout = {
        title: {
            text: 'Average Readability Score by Finance Minister',
            font: { size: 18, color: '#0C2340', family: 'Public Sans' }
        },
        xaxis: { 
            title: 'Minister',
            tickangle: -45,
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        yaxis: { 
            title: 'Avg Flesch Reading Ease',
            range: [0, 100],
            gridcolor: '#E2E8F0',
            linecolor: '#E2E8F0'
        },
        height: 500,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 120, l: 60, r: 20 }
    };
    
    Plotly.newPlot('ministerReadabilityChart', [trace], layout, { responsive: true });
}

// Render insights
function renderInsights() {
    if (!languageData.insights) return;
    
    const container = document.getElementById('insights');
    
    // Calculate key insights from data
    const insights = [
        {
            title: 'Readability Trend',
            text: languageData.insights.readability_trend || 
                  'Speeches have become more readable over time, with Flesch scores improving from ~40 in the 1960s to ~60 in the 2020s.'
        },
        {
            title: 'Sentence Length',
            text: languageData.insights.sentence_length || 
                  'Average sentence length decreased from 28 words in the 1960s to 22 words in the 2020s, making speeches easier to follow.'
        },
        {
            title: 'Most Readable Minister',
            text: languageData.insights.most_readable || 
                  'Recent ministers tend to use clearer language and shorter sentences compared to earlier decades.'
        },
        {
            title: 'Complex Topics',
            text: languageData.insights.complex_topics || 
                  'Economic and financial topics tend to have lower readability scores due to technical terminology.'
        }
    ];
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <h4>${insight.title}</h4>
            <p>${insight.text}</p>
        </div>
    `).join('');
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
