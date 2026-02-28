/**
 * Environmental Intelligence Logic for EcoWatch
 * Handles normalization, scoring, anomaly detection, and recommendation generation.
 */

export const ENVIRONMENTAL_WEIGHTS = {
    air_quality: 0.3,
    water_quality: 0.3,
    biodiversity: 0.2,
    noise_level: 0.2
};

export const normalizeValue = (type, value) => {
    if (value == null) return 0;

    switch (type) {
        case 'air_quality':
            // AQI 0-500 scale to 0-100
            return Math.min(100, (value / 500) * 100);
        case 'water_quality':
            // pH 0-14 (target 7). Deviation from 7 normalized.
            const phDev = Math.abs(7 - value);
            return Math.min(100, (phDev / 7) * 100);
        case 'noise_level':
            // dB 30-140 (threshold 100)
            return Math.min(100, ((value - 30) / 110) * 100);
        case 'biodiversity':
            // Species count (inverse normalization - more is better)
            // Assuming a target of 50 species per census
            return Math.max(0, 100 - (value * 2));
        default:
            return Math.min(100, value);
    }
};

export const calculateScores = (observations) => {
    const categories = ['air_quality', 'water_quality', 'biodiversity', 'noise_level'];
    const results = {};

    categories.forEach(cat => {
        const items = observations.filter(o => o.type === cat && o.measurement_value != null);
        if (items.length === 0) {
            results[cat] = 85; // Default healthy score for missing data
            return;
        }

        const avgNormalized = items.reduce((sum, o) => sum + normalizeValue(cat, o.measurement_value), 0) / items.length;
        results[cat] = Math.round(100 - avgNormalized);
    });

    // Calculate Overall weighted score
    const overall = Object.keys(ENVIRONMENTAL_WEIGHTS).reduce((sum, cat) => {
        return sum + (results[cat] * ENVIRONMENTAL_WEIGHTS[cat]);
    }, 0);

    return {
        scores: results,
        overall_score: Math.round(overall)
    };
};

export const detectAnomalies = (observations) => {
    const anomalies = [];

    // Rule 1: AQI Spike
    const airItems = observations.filter(o => o.type === 'air_quality' && o.measurement_value != null);
    const airAvg = airItems.reduce((s, o) => s + o.measurement_value, 0) / (airItems.length || 1);

    airItems.forEach(o => {
        if (o.measurement_value > 150 && airAvg < 80) {
            anomalies.push({
                id: o.id,
                title: "Sudden Air Quality Spike",
                type: "air_quality",
                reason: `Value ${o.measurement_value} AQI exceeds localized average (${Math.round(airAvg)}) significantly.`
            });
        }
    });

    // Rule 2: Water Outliers
    const waterItems = observations.filter(o => o.type === 'water_quality' && o.measurement_value != null);
    waterItems.forEach(o => {
        if (o.measurement_value < 5 || o.measurement_value > 9) {
            anomalies.push({
                id: o.id,
                title: "Abnormal Water pH",
                type: "water_quality",
                reason: `Critical pH deviation (${o.measurement_value}) detected outside biosphere safety range (5-9).`
            });
        }
    });

    // Rule 3: Global Inconsistency
    const continents = new Set(observations.filter(o => o.location_name).map(o => {
        // Basic heuristic for continent-spanning data
        if (o.location_name.includes('India') || o.location_name.includes('Delhi')) return 'Asia';
        if (o.location_name.includes('USA') || o.location_name.includes('NY')) return 'America';
        return 'Other';
    }));

    if (continents.size > 1) {
        anomalies.push({
            title: "Geographical Data Inconsistency",
            type: "custom",
            reason: `Analysis detected sensor data spanning multiple regions (${[...continents].join(', ')}). Accuracy may be compromised.`
        });
    }

    return anomalies;
};

export const getRecommendations = (scores) => {
    const coreRecs = {
        air_quality: "Reduce industrial emissions and increase AQI monitoring density in localized hotspots.",
        water_quality: "Initiate rigorous testing for contamination sources and inspect upstream filtration hubs.",
        noise_level: "Enforce strict sound limits and expand nocturnal noise-curb zones in residential areas.",
        biodiversity: "Enhance habitat protection protocols and initiate a comprehensive species census."
    };

    // Sort by score ascending (lowest score = highest priority)
    const sorted = Object.entries(scores)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3); // Top 3 priorities

    return sorted.map(([cat]) => coreRecs[cat] || "Maintain current environmental protection standards.");
};

export const generateInsights = (scores, anomalies) => {
    const insights = {
        concerns: [],
        positives: []
    };

    // Rule-based insights
    const airAnomalies = anomalies.filter(a => a.type === 'air_quality').length;
    if (airAnomalies >= 2) {
        insights.concerns.push("Significant air quality disturbances detected across multiple nodes.");
    } else if (scores.air_quality < 70) {
        insights.concerns.push("Downward trend in regional air integrity index noted.");
    }

    const waterAnomalies = anomalies.filter(a => a.type === 'water_quality').length;
    if (waterAnomalies === 0 && scores.water_quality > 80) {
        insights.positives.push("Water quality remains exceptionally stable with high biosphere safety scores.");
    }

    if (scores.biodiversity > 85) {
        insights.positives.push("Resilient biodiversity counts suggest effective local habitat preservation.");
    }

    // Ensure we have at least some items
    if (insights.concerns.length === 0) insights.concerns.push("General environmental monitoring indicates low-risk baseline conditions.");
    if (insights.positives.length === 0) insights.positives.push("Consistent data reporting frequency enables high-precision trend analysis.");

    return insights;
};
