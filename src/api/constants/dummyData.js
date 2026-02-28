// Comprehensive dummy data for all pages expanded for 2026
export const generateDummyObservations = () => {
  const observations = [
    // Air Quality (7 Total)
    { id: 'a1', type: 'air_quality', latitude: 28.6139, longitude: 77.2090, severity: 'high', status: 'validated', measurement_value: 145, measurement_unit: 'µg/m³', title: 'High PM2.5 in Residential Zone', location_name: 'New Delhi, Delhi', created_date: new Date('2026-02-26T08:30:00Z').toISOString(), confidence_score: 92 },
    { id: 'a2', type: 'air_quality', latitude: 28.5355, longitude: 77.3910, severity: 'critical', status: 'pending', measurement_value: 320, measurement_unit: 'µg/m³', title: 'Severe Smog Detection', location_name: 'Gurugram, Haryana', created_date: new Date('2026-02-26T09:15:00Z').toISOString(), confidence_score: 88 },
    { id: 'a3', type: 'air_quality', latitude: 19.0760, longitude: 72.8777, severity: 'low', status: 'validated', measurement_value: 42, measurement_unit: 'µg/m³', title: 'Clear Morning Skies', location_name: 'Mumbai, Maharashtra', created_date: new Date('2026-02-25T11:45:00Z').toISOString(), confidence_score: 95 },
    { id: 'a4', type: 'air_quality', latitude: 12.9716, longitude: 77.5946, severity: 'high', status: 'flagged', measurement_value: 158, measurement_unit: 'µg/m³', title: 'Factory Emission Leak', location_name: 'Bangalore, KA', created_date: new Date('2026-02-25T14:20:00Z').toISOString(), confidence_score: 82 },
    { id: 'a5', type: 'air_quality', latitude: 13.0827, longitude: 80.2707, severity: 'low', status: 'validated', title: 'Fresh Sea Breeze', location_name: 'Chennai, TN', created_date: new Date('2026-02-24T16:10:00Z').toISOString(), confidence_score: 94 },
    { id: 'a6', type: 'air_quality', latitude: 22.5726, longitude: 88.3639, severity: 'moderate', status: 'validated', measurement_value: 92, title: 'Urban Haze', location_name: 'Kolkata, WB', created_date: new Date('2026-02-24T09:00:00Z').toISOString(), confidence_score: 87 },
    { id: 'a7', type: 'air_quality', latitude: 17.3850, longitude: 78.4867, severity: 'low', status: 'validated', title: 'Clear Skies Night', location_name: 'Hyderabad, TS', created_date: new Date('2026-02-23T22:30:00Z').toISOString(), confidence_score: 91 },

    // Water Quality (7 Total)
    { id: 'w1', type: 'water_quality', latitude: 15.3173, longitude: 75.7139, severity: 'low', status: 'validated', measurement_value: 7.4, measurement_unit: 'pH', title: 'Optimal pH Reading', location_name: 'Hubli, KA', created_date: new Date('2026-02-26T07:45:00Z').toISOString(), confidence_score: 96 },
    { id: 'w2', type: 'water_quality', latitude: 25.5941, longitude: 85.1376, severity: 'critical', status: 'pending', measurement_value: 4.8, measurement_unit: 'DO', title: 'Ganges Oxygen Depletion', location_name: 'Patna, BR', created_date: new Date('2026-02-26T10:10:00Z').toISOString(), confidence_score: 85 },
    { id: 'w3', type: 'water_quality', latitude: 11.0168, longitude: 76.9558, severity: 'moderate', status: 'validated', measurement_value: 28, measurement_unit: 'NTU', title: 'Turbid Local Stream', location_name: 'Coimbatore, TN', created_date: new Date('2026-02-25T08:20:00Z').toISOString(), confidence_score: 89 },
    { id: 'w4', type: 'water_quality', latitude: 19.1176, longitude: 72.8481, severity: 'high', status: 'validated', title: 'Chemical Runoff Detected', location_name: 'Andheri, Mumbai', created_date: new Date('2026-02-25T15:40:00Z').toISOString(), confidence_score: 91 },
    { id: 'w5', type: 'water_quality', latitude: 12.9141, longitude: 74.8560, severity: 'low', status: 'validated', title: 'Brackish Water Check', location_name: 'Mangalore, KA', created_date: new Date('2026-02-24T12:05:00Z').toISOString(), confidence_score: 93 },
    { id: 'w6', type: 'water_quality', latitude: 22.1760, longitude: 82.1360, severity: 'moderate', status: 'validated', title: 'Mining Discharge Check', location_name: 'Korba, CG', created_date: new Date('2026-02-23T14:50:00Z').toISOString(), confidence_score: 84 },
    { id: 'w7', type: 'water_quality', latitude: 15.2993, longitude: 74.1240, severity: 'low', status: 'validated', title: 'Pristine River Flow', location_name: 'Goa', created_date: new Date('2026-02-23T09:15:00Z').toISOString(), confidence_score: 97 },

    // Biodiversity (6 Total)
    { id: 'b1', type: 'biodiversity', latitude: 11.4102, longitude: 76.6991, severity: 'high', status: 'validated', title: 'Rare Orchid Bloom', location_name: 'Mudumalai, TN', created_date: new Date('2026-02-26T06:30:00Z').toISOString(), confidence_score: 98 },
    { id: 'b2', type: 'biodiversity', latitude: 23.9000, longitude: 87.2000, severity: 'low', status: 'validated', title: 'Elephant Herd Migration', location_name: 'Bankura, WB', created_date: new Date('2026-02-25T17:15:00Z').toISOString(), confidence_score: 95 },
    { id: 'b3', type: 'biodiversity', latitude: 34.0837, longitude: 74.7973, severity: 'moderate', status: 'pending', title: 'Invasive Weed Spread', location_name: 'Dal Lake, Srinagar', created_date: new Date('2026-02-25T10:45:00Z').toISOString(), confidence_score: 87 },
    { id: 'b4', type: 'biodiversity', latitude: 8.4875, longitude: 76.9486, severity: 'critical', status: 'validated', title: 'Mangrove Rapid Decay', location_name: 'Trivandrum, KL', created_date: new Date('2026-02-24T11:20:00Z').toISOString(), confidence_score: 93 },
    { id: 'b5', type: 'biodiversity', latitude: 20.3100, longitude: 85.8300, severity: 'low', status: 'validated', title: 'Native Tree Plantation', location_name: 'Bhubaneswar, OD', created_date: new Date('2026-02-23T16:30:00Z').toISOString(), confidence_score: 94 },
    { id: 'b6', type: 'biodiversity', latitude: 12.1200, longitude: 75.9800, severity: 'moderate', status: 'validated', title: 'Butterfly Census', location_name: 'Kodagu, KA', created_date: new Date('2026-02-23T08:00:00Z').toISOString(), confidence_score: 90 },

    // Noise Level (6 Total)
    { id: 'n1', type: 'noise_level', latitude: 19.2183, longitude: 72.9781, severity: 'critical', status: 'flagged', measurement_value: 92, measurement_unit: 'dB', title: 'Construction Noise Outrage', location_name: 'Thane, MH', created_date: new Date('2026-02-26T01:30:00Z').toISOString(), confidence_score: 89 },
    { id: 'n2', type: 'noise_level', latitude: 12.9716, longitude: 77.5946, severity: 'high', status: 'validated', measurement_value: 84, title: 'Traffic Gridlock Siren', location_name: 'Bangalore, KA', created_date: new Date('2026-02-25T18:45:00Z').toISOString(), confidence_score: 91 },
    { id: 'n3', type: 'noise_level', latitude: 28.6139, longitude: 77.2090, severity: 'low', status: 'validated', title: 'Nighttime Resident Quiet', location_name: 'New Delhi', created_date: new Date('2026-02-25T01:00:00Z').toISOString(), confidence_score: 96 },
    { id: 'n4', type: 'noise_level', latitude: 22.5726, longitude: 88.3639, severity: 'moderate', status: 'validated', title: 'Urban Market Soundscape', location_name: 'Kolkata, WB', created_date: new Date('2026-02-24T12:00:00Z').toISOString(), confidence_score: 88 },
    { id: 'n5', type: 'noise_level', latitude: 18.5204, longitude: 73.8567, severity: 'high', status: 'pending', title: 'Festival Loudspeaker Alert', location_name: 'Pune, MH', created_date: new Date('2026-02-23T21:15:00Z').toISOString(), confidence_score: 85 },
    { id: 'n6', type: 'noise_level', latitude: 13.0827, longitude: 80.2707, severity: 'low', status: 'validated', title: 'Residential Silent Hours', location_name: 'Chennai, TN', created_date: new Date('2026-02-23T04:30:00Z').toISOString(), confidence_score: 94 },

    // Waste (5 Total)
    { id: 'ws1', type: 'waste', latitude: 19.0760, longitude: 72.8777, severity: 'high', status: 'validated', title: 'Illegal Plastic Dumping', location_name: 'Dharavi, Mumbai', created_date: new Date('2026-02-26T09:40:00Z').toISOString(), confidence_score: 90 },
    { id: 'ws2', type: 'waste', latitude: 28.7041, longitude: 77.1025, severity: 'critical', status: 'pending', title: 'Landfill Overflow Leak', location_name: 'Ghazipur, Delhi', created_date: new Date('2026-02-25T06:15:00Z').toISOString(), confidence_score: 88 },
    { id: 'ws3', type: 'waste', latitude: 12.9249, longitude: 77.5997, severity: 'moderate', status: 'validated', title: 'Electronic Waste Pile', location_name: 'Jayanagar, Bangalore', created_date: new Date('2026-02-24T14:30:00Z').toISOString(), confidence_score: 92 },
    { id: 'ws4', type: 'waste', latitude: 17.4448, longitude: 78.3498, severity: 'low', status: 'validated', title: 'Volunteer Cleanup Drive', location_name: 'Gachibowli, TS', created_date: new Date('2026-02-23T08:45:00Z').toISOString(), confidence_score: 96 },
    { id: 'ws5', type: 'waste', latitude: 22.5626, longitude: 88.3961, severity: 'high', status: 'validated', title: 'Riverfront Garbage Accumulation', location_name: 'Hooghly, WB', created_date: new Date('2026-02-23T11:20:00Z').toISOString(), confidence_score: 87 },

    // Soil Quality (4 Total)
    { id: 's1', type: 'soil_quality', latitude: 23.2599, longitude: 77.4126, severity: 'high', status: 'validated', title: 'High Heavy Metal Conc.', location_name: 'Bhopal, MP', created_date: new Date('2026-02-26T11:05:00Z').toISOString(), confidence_score: 91 },
    { id: 's2', type: 'soil_quality', latitude: 30.7333, longitude: 76.7794, severity: 'low', status: 'validated', title: 'Nutrient Rich Farm Soil', location_name: 'Chandigarh', created_date: new Date('2026-02-25T13:20:00Z').toISOString(), confidence_score: 98 },
    { id: 's3', type: 'soil_quality', latitude: 16.5062, longitude: 80.6480, severity: 'moderate', status: 'pending', title: 'Salinity Ingress Alert', location_name: 'Vijayawada, AP', created_date: new Date('2026-02-24T10:15:00Z').toISOString(), confidence_score: 86 },
    { id: 's4', type: 'soil_quality', latitude: 26.8467, longitude: 80.9462, severity: 'low', status: 'validated', title: 'Urban Garden Health', location_name: 'Lucknow, UP', created_date: new Date('2026-02-23T15:40:00Z').toISOString(), confidence_score: 94 },

    // Weather (4 Total)
    { id: 'wt1', type: 'weather', latitude: 26.2124, longitude: 78.1772, severity: 'high', status: 'validated', title: 'Unseasonal Heat Wave', location_name: 'Gwalior, MP', created_date: new Date('2026-02-26T12:00:00Z').toISOString(), confidence_score: 95 },
    { id: 'wt2', type: 'weather', latitude: 34.0837, longitude: 74.7973, severity: 'moderate', status: 'validated', title: 'Heavy Snow Warning', location_name: 'Srinagar, JK', created_date: new Date('2026-02-25T07:30:00Z').toISOString(), confidence_score: 97 },
    { id: 'wt3', type: 'weather', latitude: 13.0827, longitude: 80.2707, severity: 'low', status: 'validated', title: 'Cyclone Warning Lifted', location_name: 'Chennai, TN', created_date: new Date('2026-02-24T19:45:00Z').toISOString(), confidence_score: 92 },
    { id: 'wt4', type: 'weather', latitude: 19.0760, longitude: 72.8777, severity: 'high', status: 'pending', title: 'Flash Flood Rainfall', location_name: 'Mumbai, MH', created_date: new Date('2026-02-23T23:10:00Z').toISOString(), confidence_score: 89 },

    // Radiation (3 Total)
    { id: 'r1', type: 'radiation', latitude: 12.5539, longitude: 79.9575, severity: 'low', status: 'validated', title: 'Reactor Ambient Baseline', location_name: 'Kalpakkam, TN', created_date: new Date('2026-02-26T08:50:00Z').toISOString(), confidence_score: 99 },
    { id: 'r2', type: 'radiation', latitude: 19.8297, longitude: 72.6644, severity: 'moderate', status: 'validated', title: 'Localized Isotope Shift', location_name: 'Tarapur, MH', created_date: new Date('2026-02-25T14:40:00Z').toISOString(), confidence_score: 96 },
    { id: 'r3', type: 'radiation', latitude: 18.2561, longitude: 73.1816, severity: 'low', status: 'validated', title: 'Medical Waste Scan', location_name: 'Raigad, MH', created_date: new Date('2026-02-24T10:05:00Z').toISOString(), confidence_score: 94 },

    // Custom (2 Total)
    { id: 'c1', type: 'custom', latitude: 15.4909, longitude: 73.8278, severity: 'low', status: 'validated', title: 'Community Garden Tracking', location_name: 'Panaji, Goa', created_date: new Date('2026-02-26T14:20:00Z').toISOString(), confidence_score: 91 },
    { id: 'c2', type: 'custom', latitude: 21.1458, longitude: 79.0882, severity: 'moderate', status: 'pending', title: 'Unique Local Landmark Observation', location_name: 'Nagpur, MH', created_date: new Date('2026-02-25T16:45:00Z').toISOString(), confidence_score: 85 }
  ];
  return observations;
};

export const DUMMY_OBSERVATIONS = generateDummyObservations();
