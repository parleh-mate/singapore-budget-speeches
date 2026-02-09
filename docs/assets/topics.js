// ===================================
// TOPICS PAGE
// Singapore Budget Speeches (1960-2025)
// ===================================

let topicData = null;
let currentView = "decade"; // 'decade' or 'year'

// Crisis years for annotations
const CRISIS_YEARS = [
  { year: 1985, label: "1985 Recession" },
  { year: 1997, label: "Asian Financial Crisis" },
  { year: 2003, label: "SARS" },
  { year: 2008, label: "Global Financial Crisis" },
  { year: 2020, label: "COVID-19" },
];

// Decades
const DECADES = [
  { name: "1960s", start: 1960, end: 1969 },
  { name: "1970s", start: 1970, end: 1979 },
  { name: "1980s", start: 1980, end: 1989 },
  { name: "1990s", start: 1990, end: 1999 },
  { name: "2000s", start: 2000, end: 2009 },
  { name: "2010s", start: 2010, end: 2019 },
  { name: "2020s", start: 2020, end: 2029 },
];

// Topic colors - consistent across all charts
const TOPIC_COLORS = {
  General: "#9EA2A2",
  Defence: "#C8102E",
  Finance: "#6B4E71",
  "Trade Industry": "#1A3A5C",
  Manpower: "#B45A3C",
  Education: "#0C2340",
  Transport: "#3D7C8C",
  "National Development": "#D4A72C",
  Health: "#2D6A4F",
  "Sustainability Environment": "#4A7C59",
  "Social Family Development": "#E07B53",
  "Home Affairs": "#5C5C5C",
  "Foreign Affairs": "#7B9EA8",
  "Communications Information": "#8B7355",
  "Culture Community Youth": "#A0522D",
  Law: "#CCCCCC",
};

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadTopicData();
});

// Load topic statistics
async function loadTopicData() {
  try {
    const response = await fetch("data/summary/ministries_overview.json");
    topicData = await response.json();

    hideLoading();
    setupHeatmapControls();
    renderHeatmap();
    setupTopicSelectors();
    renderTopicTrends();
    renderEntropyChart();
    renderDecadeComparison();
    renderInsights();
    renderDataTable();
  } catch (error) {
    console.error("Failed to load topic data:", error);
    document.getElementById("loading").innerHTML =
      '<p style="color: var(--color-error);">Failed to load data. Please refresh the page.</p>';
  }
}

// Hide loading state
function hideLoading() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("content").style.display = "block";
}

// ===================================
// CHART 1: HEATMAP WITH DRILL-DOWN
// ===================================
function setupHeatmapControls() {
  const viewToggle = document.getElementById("heatmapViewToggle");
  const decadeSelect = document.getElementById("decadeSelect");

  if (viewToggle) {
    viewToggle.addEventListener("change", (e) => {
      currentView = e.target.value;
      decadeSelect.style.display =
        currentView === "year" ? "inline-block" : "none";
      renderHeatmap();
    });
  }

  if (decadeSelect) {
    DECADES.forEach((decade) => {
      const option = document.createElement("option");
      option.value = decade.name;
      option.textContent = decade.name;
      decadeSelect.appendChild(option);
    });
    decadeSelect.addEventListener("change", renderHeatmap);
  }
}

function renderHeatmap() {
  if (!topicData.by_year) return;

  const years = Object.keys(topicData.by_year).sort();

  // Get topics sorted by total coverage (descending), excluding "General"
  const topicTotals = {};
  years.forEach((year) => {
    Object.entries(topicData.by_year[year]).forEach(([topic, value]) => {
      if (topic !== "General") {
        topicTotals[topic] = (topicTotals[topic] || 0) + value;
      }
    });
  });

  const sortedTopics = Object.entries(topicTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);

  let xLabels, zValues, hoverText;

  if (currentView === "decade") {
    // Aggregate by decade
    xLabels = DECADES.map((d) => d.name);

    zValues = sortedTopics.map((topic) =>
      DECADES.map((decade) => {
        const decadeYears = years.filter(
          (y) => parseInt(y) >= decade.start && parseInt(y) <= decade.end,
        );
        if (decadeYears.length === 0) return 0;
        const sum = decadeYears.reduce(
          (acc, y) => acc + (topicData.by_year[y][topic] || 0),
          0,
        );
        return sum / decadeYears.length;
      }),
    );

    hoverText = sortedTopics.map((topic) =>
      DECADES.map((decade) => {
        const decadeYears = years.filter(
          (y) => parseInt(y) >= decade.start && parseInt(y) <= decade.end,
        );
        if (decadeYears.length === 0)
          return `<b>${topic}</b><br>${decade.name}: No data`;
        const sum = decadeYears.reduce(
          (acc, y) => acc + (topicData.by_year[y][topic] || 0),
          0,
        );
        const avg = sum / decadeYears.length;
        return `<b>${topic}</b><br>${
          decade.name
        }<br>Avg coverage: ${avg.toFixed(1)}%`;
      }),
    );
  } else {
    // Year view - filter to selected decade
    const selectedDecade =
      document.getElementById("decadeSelect")?.value || "1960s";
    const decade = DECADES.find((d) => d.name === selectedDecade);
    const filteredYears = years.filter(
      (y) => parseInt(y) >= decade.start && parseInt(y) <= decade.end,
    );

    xLabels = filteredYears;

    zValues = sortedTopics.map((topic) =>
      filteredYears.map((year) => topicData.by_year[year][topic] || 0),
    );

    hoverText = sortedTopics.map((topic) =>
      filteredYears.map(
        (year) =>
          `<b>${topic}</b><br>Year: ${year}<br>Coverage: ${(
            topicData.by_year[year][topic] || 0
          ).toFixed(1)}%`,
      ),
    );
  }

  const trace = {
    z: zValues,
    x: xLabels,
    y: sortedTopics,
    type: "heatmap",
    colorscale: [
      [0, "#F7FAFC"],
      [0.1, "#E2E8F0"],
      [0.25, "#A0AEC0"],
      [0.5, "#4A5568"],
      [0.75, "#2D3748"],
      [1, "#1A202C"],
    ],
    hovertemplate: "%{text}<extra></extra>",
    text: hoverText,
    showscale: true,
    colorbar: {
      title: "% of Speech",
      titleside: "right",
      thickness: 15,
      len: 0.9,
    },
  };

  // Add crisis annotations only in year view
  let shapes = [];
  let annotations = [];

  if (currentView === "year") {
    const selectedDecade =
      document.getElementById("decadeSelect")?.value || "1960s";
    const decade = DECADES.find((d) => d.name === selectedDecade);

    CRISIS_YEARS.forEach((crisis) => {
      if (crisis.year >= decade.start && crisis.year <= decade.end) {
        shapes.push({
          type: "line",
          x0: crisis.year.toString(),
          x1: crisis.year.toString(),
          y0: -0.5,
          y1: sortedTopics.length - 0.5,
          line: { color: "#C8102E", width: 1.5, dash: "dot" },
        });
        annotations.push({
          x: crisis.year.toString(),
          y: sortedTopics.length - 0.5,
          text: crisis.label,
          showarrow: false,
          textangle: -45,
          font: { size: 9, color: "#C8102E" },
          yshift: 15,
        });
      }
    });
  }

  const layout = {
    xaxis: {
      title: currentView === "decade" ? "Decade" : "Year",
      tickangle: currentView === "year" ? -45 : 0,
      gridcolor: "#E2E8F0",
    },
    yaxis: {
      title: "",
      automargin: true,
      tickfont: { size: 11 },
    },
    height: 500,
    margin: { t: 40, b: 80, l: 180, r: 80 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    shapes: shapes,
    annotations: annotations,
  };

  Plotly.newPlot("topicsHeatmap", [trace], layout, { responsive: true });
}

// ===================================
// CHART 2: TOPIC TRENDS (Interactive)
// ===================================
function setupTopicSelectors() {
  // Exclude "General" from topic selectors
  const topics = Object.keys(topicData.by_ministry || {})
    .filter((t) => t !== "General")
    .sort((a, b) => {
      return (
        (topicData.by_ministry[b]?.total || 0) -
        (topicData.by_ministry[a]?.total || 0)
      );
    });

  const selects = ["topicSelect1", "topicSelect2", "topicSelect3"];
  const defaults = ["Defence", "Trade Industry", "Health"];

  selects.forEach((selectId, index) => {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Add "None" option for optional selectors
    if (index > 0) {
      const noneOption = document.createElement("option");
      noneOption.value = "";
      noneOption.textContent = "— None —";
      select.appendChild(noneOption);
    }

    topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      if (topic === defaults[index]) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener("change", renderTopicTrends);
  });
}

function renderTopicTrends() {
  if (!topicData.by_year) return;

  const years = Object.keys(topicData.by_year).sort();
  const selectedTopics = [
    document.getElementById("topicSelect1")?.value,
    document.getElementById("topicSelect2")?.value,
    document.getElementById("topicSelect3")?.value,
  ].filter(Boolean);

  if (selectedTopics.length === 0) return;

  const traces = selectedTopics.map((topic) => ({
    x: years,
    y: years.map((year) => topicData.by_year[year][topic] || 0),
    name: topic,
    type: "scatter",
    mode: "lines+markers",
    line: { color: TOPIC_COLORS[topic] || "#9EA2A2", width: 2.5 },
    marker: { size: 4 },
    hovertemplate: `<b>${topic}</b><br>Year: %{x}<br>Coverage: %{y:.1f}%<extra></extra>`,
  }));

  // Add crisis year shapes
  const shapes = CRISIS_YEARS.map((crisis) => ({
    type: "line",
    x0: crisis.year.toString(),
    x1: crisis.year.toString(),
    y0: 0,
    y1: 1,
    yref: "paper",
    line: { color: "#E2E8F0", width: 1, dash: "dot" },
  }));

  const annotations = CRISIS_YEARS.map((crisis) => ({
    x: crisis.year.toString(),
    y: 1,
    yref: "paper",
    text: crisis.label,
    showarrow: false,
    textangle: -90,
    font: { size: 9, color: "#718096" },
    xshift: 10,
  }));

  const layout = {
    xaxis: {
      title: "Year",
      gridcolor: "#E2E8F0",
      dtick: 5,
    },
    yaxis: {
      title: "% of Budget Speech",
      gridcolor: "#E2E8F0",
      rangemode: "tozero",
    },
    hovermode: "x unified",
    showlegend: true,
    legend: { orientation: "h", y: -0.15 },
    height: 400,
    margin: { t: 20, b: 80, l: 60, r: 20 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    shapes: shapes,
    annotations: annotations,
  };

  Plotly.newPlot("topicTrendsChart", traces, layout, { responsive: true });
}

// ===================================
// CHART 3: SHANNON ENTROPY (Topic Diversity)
// ===================================
function calculateShannonEntropy(distribution) {
  // Filter out zero values and normalize
  const values = distribution.filter((v) => v > 0);
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total === 0) return 0;

  // Calculate probabilities and entropy
  const probabilities = values.map((v) => v / total);
  const entropy = -probabilities.reduce((sum, p) => {
    return sum + (p > 0 ? p * Math.log2(p) : 0);
  }, 0);

  return entropy;
}

function renderEntropyChart() {
  if (!topicData.by_year) return;

  const years = Object.keys(topicData.by_year).sort();

  // Calculate entropy for each year (excluding "General")
  const entropyData = years.map((year) => {
    const yearData = topicData.by_year[year];
    const values = Object.entries(yearData)
      .filter(([topic]) => topic !== "General")
      .map(([, value]) => value);
    return calculateShannonEntropy(values);
  });

  // Calculate max possible entropy (log2 of number of topics)
  const numTopics = Object.keys(topicData.by_year[years[0]]).filter(
    (t) => t !== "General",
  ).length;
  const maxEntropy = Math.log2(numTopics);

  // Calculate decade averages for reference line
  const decadeAverages = DECADES.map((decade) => {
    const decadeYears = years.filter(
      (y) => parseInt(y) >= decade.start && parseInt(y) <= decade.end,
    );
    const decadeEntropies = decadeYears.map((y) => {
      const idx = years.indexOf(y);
      return entropyData[idx];
    });
    return {
      decade: decade.name,
      avg: decadeEntropies.reduce((a, b) => a + b, 0) / decadeEntropies.length,
      midYear: Math.floor((decade.start + decade.end) / 2),
    };
  });

  // Main entropy trace
  const entropyTrace = {
    x: years,
    y: entropyData,
    name: "Topic Diversity (Entropy)",
    type: "scatter",
    mode: "lines+markers",
    line: { color: "#2D3748", width: 2 },
    marker: { size: 5 },
    hovertemplate:
      "<b>%{x}</b><br>Entropy: %{y:.2f}<br>" +
      `(max possible: ${maxEntropy.toFixed(2)})<extra></extra>`,
  };

  // 5-year moving average
  const movingAvg = years.map((_, i) => {
    const start = Math.max(0, i - 2);
    const end = Math.min(entropyData.length, i + 3);
    const window = entropyData.slice(start, end);
    return window.reduce((a, b) => a + b, 0) / window.length;
  });

  const movingAvgTrace = {
    x: years,
    y: movingAvg,
    name: "5-Year Moving Average",
    type: "scatter",
    mode: "lines",
    line: { color: "#C8102E", width: 2.5, dash: "solid" },
    hovertemplate: "<b>%{x}</b><br>5-yr avg: %{y:.2f}<extra></extra>",
  };

  // Max entropy reference line
  const maxEntropyLine = {
    x: years,
    y: years.map(() => maxEntropy),
    name: `Max Possible (${maxEntropy.toFixed(2)} bits)`,
    type: "scatter",
    mode: "lines",
    line: { color: "#38A169", width: 2, dash: "dash" },
    hovertemplate:
      "<b>Maximum entropy</b><br>" +
      `${maxEntropy.toFixed(
        2,
      )} bits<br>(if all ${numTopics} topics had equal coverage)<extra></extra>`,
  };

  // Crisis year shapes
  const shapes = CRISIS_YEARS.map((crisis) => ({
    type: "line",
    x0: crisis.year.toString(),
    x1: crisis.year.toString(),
    y0: 0,
    y1: 1,
    yref: "paper",
    line: { color: "#E2E8F0", width: 1, dash: "dot" },
  }));

  const annotations = CRISIS_YEARS.map((crisis) => ({
    x: crisis.year.toString(),
    y: 1,
    yref: "paper",
    text: crisis.label,
    showarrow: false,
    textangle: -90,
    font: { size: 9, color: "#718096" },
    xshift: 10,
  }));

  // Add interpretation annotation
  annotations.push({
    x: years[Math.floor(years.length * 0.85)],
    y: maxEntropy,
    text: "← Perfect diversity",
    showarrow: false,
    font: { size: 10, color: "#38A169" },
    xanchor: "left",
    yshift: 10,
  });

  const layout = {
    xaxis: {
      title: "Year",
      gridcolor: "#E2E8F0",
      dtick: 5,
    },
    yaxis: {
      title: "Shannon Entropy (bits)",
      gridcolor: "#E2E8F0",
      range: [0, maxEntropy * 1.1],
    },
    hovermode: "x unified",
    showlegend: true,
    legend: { orientation: "h", y: -0.15 },
    height: 400,
    margin: { t: 20, b: 80, l: 60, r: 20 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    shapes: shapes,
    annotations: annotations,
  };

  Plotly.newPlot(
    "entropyChart",
    [entropyTrace, movingAvgTrace, maxEntropyLine],
    layout,
    {
      responsive: true,
    },
  );
}

// ===================================
// CHART 4: DECADE COMPARISON (Sentence counts)
// ===================================
function renderDecadeComparison() {
  if (!topicData.by_year) return;

  const years = Object.keys(topicData.by_year).sort();

  // Get topics by total, excluding "General"
  const topicTotals = {};
  years.forEach((year) => {
    Object.entries(topicData.by_year[year]).forEach(([topic, value]) => {
      if (topic !== "General") {
        topicTotals[topic] = (topicTotals[topic] || 0) + value;
      }
    });
  });

  // Get top 10 topics (excluding General)
  const topTopics = Object.entries(topicTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic]) => topic);

  // We need sentence counts. The data is in percentages.
  // We'll need to estimate or show relative values.
  // Since we don't have raw counts, let's use the percentage sums as a proxy
  // (higher % across more years = more total coverage)

  // Calculate sum of percentages per decade for each topic
  // This gives us relative "weight" across decades
  const decadeData = {};
  DECADES.forEach((decade) => {
    decadeData[decade.name] = {};
    const decadeYears = years.filter(
      (y) => parseInt(y) >= decade.start && parseInt(y) <= decade.end,
    );

    topTopics.forEach((topic) => {
      const sum = decadeYears.reduce(
        (acc, y) => acc + (topicData.by_year[y][topic] || 0),
        0,
      );
      decadeData[decade.name][topic] = sum;
    });
  });

  // Create grouped bar traces (not stacked - easier to compare)
  const traces = topTopics.map((topic) => ({
    x: DECADES.map((d) => d.name),
    y: DECADES.map((d) => decadeData[d.name][topic]),
    name: topic,
    type: "bar",
    marker: { color: TOPIC_COLORS[topic] || "#9EA2A2" },
    hovertemplate: `<b>${topic}</b><br>%{x}<br>Total coverage: %{y:.0f}%<extra></extra>`,
  }));

  const layout = {
    barmode: "group",
    xaxis: {
      title: "Decade",
    },
    yaxis: {
      title: "Total % Coverage (sum across years in decade)",
      gridcolor: "#E2E8F0",
    },
    showlegend: true,
    legend: {
      orientation: "h",
      y: -0.25,
      font: { size: 9 },
      traceorder: "normal",
    },
    height: 500,
    margin: { t: 20, b: 120, l: 70, r: 20 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("decadeComparisonChart", traces, layout, { responsive: true });
}

// ===================================
// INSIGHTS
// ===================================
function renderInsights() {
  if (!topicData.insights) return;

  const container = document.getElementById("insights");
  container.innerHTML = topicData.insights
    .map(
      (insight) => `
        <div class="insight-card">
            <h4>${insight.title}</h4>
            <p>${insight.description}</p>
        </div>
    `,
    )
    .join("");
}

// ===================================
// DATA TABLE (includes General)
// ===================================
function renderDataTable() {
  if (!topicData.by_ministry) return;

  const sorted = Object.entries(topicData.by_ministry).sort(
    (a, b) => b[1].total - a[1].total,
  );

  const table = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: var(--color-bg-alt); text-align: left;">
          <th style="padding: var(--space-md); border: 1px solid var(--color-border);">Topic</th>
          <th style="padding: var(--space-md); border: 1px solid var(--color-border);">Avg % per Year</th>
          <th style="padding: var(--space-md); border: 1px solid var(--color-border);">Peak Year</th>
        </tr>
      </thead>
      <tbody>
        ${sorted
          .map(
            ([topic, data]) => `
          <tr>
            <td style="padding: var(--space-md); border: 1px solid var(--color-border);">
              <span style="display: inline-block; width: 12px; height: 12px; background: ${
                TOPIC_COLORS[topic] || "#9EA2A2"
              }; border-radius: 2px; margin-right: 8px; vertical-align: middle;"></span>
              ${topic}
            </td>
            <td style="padding: var(--space-md); border: 1px solid var(--color-border);">${data.percentage.toFixed(
              1,
            )}%</td>
            <td style="padding: var(--space-md); border: 1px solid var(--color-border);">${
              data.peak_year || "N/A"
            }</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  document.getElementById("dataTable").innerHTML = table;
}

// ===================================
// CSV DOWNLOAD
// ===================================
document.getElementById("downloadCSV")?.addEventListener("click", () => {
  if (!topicData.by_ministry) return;

  const csv = [
    ["Topic", "Average % per Year", "Peak Year"],
    ...Object.entries(topicData.by_ministry)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([topic, data]) => [
        topic,
        data.percentage.toFixed(2),
        data.peak_year || "N/A",
      ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  downloadFile(csv, "topics_data.csv", "text/csv");
});

// Utility: Download file
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
