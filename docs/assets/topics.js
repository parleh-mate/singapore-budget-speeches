// ===================================
// TOPICS PAGE
// Singapore Budget Speeches (1960-2025)
// ===================================

let topicData = null;

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
    renderCharts();
    renderInsights();
    renderDataTable();
  } catch (error) {
    console.error("Failed to load topic data:", error);
    document.getElementById("loading").innerHTML = `
            <p style="color: var(--color-error);">Failed to load data. Please refresh the page.</p>
        `;
  }
}

// Hide loading state
function hideLoading() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("content").style.display = "block";
}

// Render charts
function renderCharts() {
  renderTopicsOverTime();
  renderTopicsByTotal();
}

// Chart 1: Topic coverage over time
function renderTopicsOverTime() {
  if (!topicData.by_year) return;

  // Prepare data for stacked area chart
  const years = Object.keys(topicData.by_year).sort();
  const topics = new Set();

  // Collect all topics
  years.forEach((year) => {
    Object.keys(topicData.by_year[year]).forEach((topic) => {
      topics.add(topic);
    });
  });

  // Get top 10 topics by total coverage
  const top10 = Array.from(topics)
    .map((topic) => ({
      topic,
      total: years.reduce(
        (sum, year) => sum + (topicData.by_year[year][topic] || 0),
        0,
      ),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((t) => t.topic);

  // Create traces
  const traces = top10.map((topic) => ({
    x: years,
    y: years.map((year) => topicData.by_year[year][topic] || 0),
    name: topic,
    type: "scatter",
    mode: "lines",
    stackgroup: "one",
    fillcolor: getColorForTopic(topic),
    line: { width: 0 },
  }));

  const layout = {
    title: {
      text: "Top 10 Topics Coverage Over Time",
      font: { size: 18, color: "#0C2340", family: "Public Sans" },
    },
    xaxis: {
      title: "Year",
      gridcolor: "#E2E8F0",
      linecolor: "#E2E8F0",
    },
    yaxis: {
      title: "Number of Sentences",
      gridcolor: "#E2E8F0",
      linecolor: "#E2E8F0",
    },
    hovermode: "x unified",
    showlegend: true,
    legend: { orientation: "h", y: -0.2 },
    height: 500,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { t: 60, b: 80, l: 60, r: 20 },
  };

  Plotly.newPlot("topicsOverTimeChart", traces, layout, {
    responsive: true,
  });
}

// Chart 2: Topics by total coverage
function renderTopicsByTotal() {
  if (!topicData.by_ministry) return;

  // Sort topics by total
  const sorted = Object.entries(topicData.by_ministry)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  const trace = {
    x: sorted.map((t) => t[1].total),
    y: sorted.map((t) => t[0]),
    type: "bar",
    orientation: "h",
    marker: {
      color: sorted.map((_, i) => getColorByIndex(i)),
    },
  };

  const layout = {
    title: {
      text: "Top 10 Topics by Total Sentence Count (1960-2025)",
      font: { size: 18, color: "#0C2340", family: "Public Sans" },
    },
    xaxis: {
      title: "Total Sentences",
      gridcolor: "#E2E8F0",
      linecolor: "#E2E8F0",
    },
    yaxis: {
      automargin: true,
      gridcolor: "#E2E8F0",
      linecolor: "#E2E8F0",
    },
    height: 500,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { t: 60, b: 40, l: 200, r: 20 },
  };

  Plotly.newPlot("topicsByTotalChart", [trace], layout, {
    responsive: true,
  });
}

// Render insights
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

// Render data table
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
                    <th style="padding: var(--space-md); border: 1px solid var(--color-border);">Total Sentences</th>
                    <th style="padding: var(--space-md); border: 1px solid var(--color-border);">Percentage</th>
                    <th style="padding: var(--space-md); border: 1px solid var(--color-border);">Peak Year</th>
                </tr>
            </thead>
            <tbody>
                ${sorted
                  .map(
                    ([topic, data]) => `
                    <tr>
                        <td style="padding: var(--space-md); border: 1px solid var(--color-border);">${topic}</td>
                        <td style="padding: var(--space-md); border: 1px solid var(--color-border);">${
                          data.total
                        }</td>
                        <td style="padding: var(--space-md); border: 1px solid var(--color-border);">${
                          data.percentage
                        }%</td>
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

// Download CSV
document.getElementById("downloadCSV")?.addEventListener("click", () => {
  if (!topicData.by_ministry) return;

  const csv = [
    ["Topic", "Total Sentences", "Percentage", "Peak Year"],
    ...Object.entries(topicData.by_ministry)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([topic, data]) => [
        topic,
        data.total,
        data.percentage,
        data.peak_year || "N/A",
      ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  downloadFile(csv, "topics_data.csv", "text/csv");
});

// Utility: Get color for topic (civic strength palette)
function getColorForTopic(topic) {
  const colors = {
    Defence: "#C8102E", // Vibrant Red
    Education: "#0C2340", // Deep Navy
    Health: "#2D6A4F", // Forest Green
    Housing: "#D4A72C", // Civic Gold
    Transport: "#3D7C8C", // Teal
    Economy: "#1A3A5C", // Steel Blue
    Finance: "#6B4E71", // Muted Purple
    "Social Services": "#B45A3C", // Terracotta
    Environment: "#2D6A4F", // Forest Green
    Technology: "#5C5C5C", // Charcoal
    General: "#9EA2A2", // Slate Gray
  };
  return colors[topic] || "#9EA2A2";
}

// Utility: Get color by index (civic strength palette)
function getColorByIndex(index) {
  const colors = [
    "#0C2340", // Deep Navy
    "#C8102E", // Vibrant Red
    "#2D6A4F", // Forest Green
    "#D4A72C", // Civic Gold
    "#1A3A5C", // Steel Blue
    "#9EA2A2", // Slate Gray
    "#6B4E71", // Muted Purple
    "#B45A3C", // Terracotta
    "#3D7C8C", // Teal
    "#5C5C5C", // Charcoal
  ];
  return colors[index % colors.length];
}

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
