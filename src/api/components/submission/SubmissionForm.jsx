import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Wind, Droplets, Leaf, Volume2, MapPin, Upload, Loader2,
  CheckCircle, Camera, Brain, Trash2, Thermometer, FlaskConical,
  Sun, Activity, HelpCircle, Calendar, AlertTriangle, Info
} from 'lucide-react';
import { base44 } from '../../base44Client';
import { format } from 'date-fns';

const observationCategories = [
  { id: 'air_quality', label: 'Air Quality', icon: Wind, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'water_quality', label: 'Water Quality', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'biodiversity', label: 'Biodiversity', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'noise_level', label: 'Noise Level', icon: Volume2, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'waste', label: 'Waste', icon: Trash2, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'soil_quality', label: 'Soil Quality', icon: FlaskConical, color: 'text-stone-600', bg: 'bg-stone-50' },
  { id: 'weather', label: 'Weather', icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'radiation', label: 'Radiation', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'custom', label: 'Custom', icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-50' }
];

const categoryFields = {
  air_quality: [
    { name: 'aqi', label: 'AQI Index', type: 'number', placeholder: 'e.g. 52' },
    { name: 'pm25', label: 'PM2.5 (µg/m³)', type: 'number', placeholder: 'e.g. 12' },
    { name: 'pm10', label: 'PM10 (µg/m³)', type: 'number', placeholder: 'e.g. 24' },
    { name: 'co2', label: 'CO₂ (ppm)', type: 'number', placeholder: 'e.g. 410' }
  ],
  water_quality: [
    { name: 'ph', label: 'pH Level', type: 'number', placeholder: '0-14', step: '0.1' },
    { name: 'turbidity', label: 'Turbidity (NTU)', type: 'number', placeholder: 'e.g. 1.5' },
    { name: 'temperature', label: 'Temperature (°C)', type: 'number', placeholder: 'e.g. 22' }
  ],
  biodiversity: [
    { name: 'species_name', label: 'Species Name', type: 'text', placeholder: 'e.g. Bengal Tiger' },
    { name: 'species_count', label: 'Count', type: 'number', placeholder: 'Number observed' }
  ],
  noise_level: [
    { name: 'decibels', label: 'Decibel Level (dB)', type: 'number', placeholder: 'e.g. 65' }
  ],
  waste: [
    { name: 'waste_type', label: 'Waste Type', type: 'select', options: ['Plastic', 'Organic', 'Electronic', 'Chemical', 'Mixed'] },
    { name: 'quantity', label: 'Quantity (est. kg)', type: 'number', placeholder: 'e.g. 5' }
  ],
  soil_quality: [
    { name: 'soil_ph', label: 'Soil pH', type: 'number', placeholder: 'e.g. 6.5', step: '0.1' },
    { name: 'moisture', label: 'Moisture (%)', type: 'number', placeholder: 'e.g. 35' }
  ],
  weather: [
    { name: 'temp', label: 'Air Temp (°C)', type: 'number', placeholder: 'e.g. 28' },
    { name: 'humidity', label: 'Humidity (%)', type: 'number', placeholder: 'e.g. 60' }
  ],
  radiation: [
    { name: 'radiation_level', label: 'Level (µSv/h)', type: 'number', placeholder: 'e.g. 0.12' }
  ],
  custom: [
    { name: 'custom_label', label: 'Measurement Label', type: 'text', placeholder: 'e.g. Light Pollution' },
    { name: 'custom_value', label: 'Value', type: 'text', placeholder: 'Numeric or text' }
  ]
};

export default function SubmissionForm({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    latitude: '',
    longitude: '',
    location_name: '',
    severity: 'low',
    notes: '',
    image_url: '',
    dynamic_data: {}
  });

  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1 && !formData.category) newErrors.category = 'Please select a category';
    if (currentStep === 2) {
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.timestamp) newErrors.timestamp = 'Date and time is required';
    }
    if (currentStep === 3) {
      if (!formData.latitude || !formData.longitude) newErrors.location = 'Location is required (GPS or manual)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    setIsValidating(true);

    try {
      // AI Validation Call
      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze environmental observation:
        Category: ${formData.category}
        Title: ${formData.title}
        Details: ${JSON.stringify(formData.dynamic_data)}
        Notes: ${formData.notes}
        Location: ${formData.latitude}, ${formData.longitude}
        
        Provide validation score (0-100) and status (validated/pending/flagged).`,
        response_json_schema: {
          type: "object",
          properties: {
            confidence: { type: "number" },
            status: { type: "string", enum: ["validated", "pending", "flagged"] },
            feedback: { type: "string" }
          }
        }
      });

      // Save to database
      await base44.entities.Observation.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        status: aiResult?.status || 'pending',
        confidence_score: aiResult?.confidence || 50,
        ai_feedback: aiResult?.feedback
      });

      setStep(4);
      onSuccess?.();
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-xl overflow-hidden bg-white dark:bg-slate-900 rounded-3xl">
      <CardHeader className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <Activity className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black">Submit Observation</CardTitle>
        </div>
        <CardDescription className="text-teal-50 font-medium opacity-90">
          Step {step} of 4: {['Select Impact Area', 'Observation Details', 'Location & Media', 'Success'][step - 1]}
        </CardDescription>

        {/* Progress Bar */}
        <div className="mt-6 h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {observationCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all group ${isSelected ? 'border-teal-500 bg-teal-50 shadow-md scale-105' : 'border-slate-100 hover:border-teal-200 bg-white'
                        }`}
                    >
                      <div className={`p-3 rounded-xl mb-3 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 text-center leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              <Button onClick={handleNext} disabled={!formData.category} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-md font-bold shadow-lg shadow-teal-900/10">
                Continue to Details
              </Button>
            </motion.div>
          )}

          {/* Step 2: Dynamic Fields */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Unusual water foam in creek"
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={e => setFormData(prev => ({ ...prev, timestamp: e.target.value }))}
                    className="h-12 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formData.category.replace('_', ' ')} fields</p>
                <div className="grid grid-cols-2 gap-4">
                  {categoryFields[formData.category]?.map(field => (
                    <div key={field.name} className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600">{field.label}</Label>
                      {field.type === 'select' ? (
                        <Select onValueChange={v => setFormData(prev => ({ ...prev, dynamic_data: { ...prev.dynamic_data, [field.name]: v } }))}>
                          <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            {field.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          step={field.step}
                          placeholder={field.placeholder}
                          onChange={e => setFormData(prev => ({ ...prev, dynamic_data: { ...prev.dynamic_data, [field.name]: e.target.value } }))}
                          className="h-11 rounded-lg border-slate-200 bg-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Severity Level</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'moderate', 'high', 'critical'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, severity: lvl }))}
                      className={`py-2 rounded-lg text-[10px] font-black uppercase transition-all border-2 ${formData.severity === lvl
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl text-slate-500">Back</Button>
                <Button onClick={handleNext} disabled={!formData.title} className="flex-1 bg-teal-600 h-12 rounded-xl font-bold">Location & Media</Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Location & Image */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase">Latitude</Label>
                  <Input value={formData.latitude} onChange={e => setFormData(p => ({ ...p, latitude: e.target.value }))} placeholder="0.0000" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase">Longitude</Label>
                  <Input value={formData.longitude} onChange={e => setFormData(p => ({ ...p, longitude: e.target.value }))} placeholder="0.0000" className="h-11 rounded-xl" />
                </div>
                <Button variant="outline" onClick={handleGetLocation} className="col-span-2 h-11 border-teal-200 bg-teal-50 text-teal-600 font-bold rounded-xl gap-2">
                  <MapPin className="w-4 h-4" /> Use Current GPS
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase">Media Proof</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:bg-slate-50 transition-colors group relative">
                  {formData.image_url ? (
                    <div className="relative inline-block">
                      <img src={formData.image_url} alt="Upload" className="max-h-48 rounded-2xl shadow-lg border-4 border-white" />
                      <button onClick={() => setFormData(p => ({ ...p, image_url: '' }))} className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8 text-teal-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">Upload Photo Evidence</p>
                      <p className="text-xs text-slate-400 mt-1">Tap to capture or select from gallery</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                  {isUploading && <div className="absolute inset-0 bg-white/80 rounded-3xl flex items-center justify-center backdrop-blur-sm"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase">Observer Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any additional details or context..."
                  className="rounded-2xl border-slate-200 min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl">Back</Button>
                <Button onClick={handleSubmit} disabled={loading || !formData.latitude} className="flex-1 bg-teal-600 h-12 rounded-xl font-bold shadow-xl shadow-teal-500/20">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Observation'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success State */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Submission Received!</h3>
                <p className="text-slate-500 font-medium">Your data is being analyzed by our AI for environmental impact.</p>
              </div>
              <div className="flex justify-center gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 px-4 py-1.5 rounded-full font-bold">Status: Pending Verification</Badge>
              </div>
              <Button onClick={() => window.location.reload()} className="bg-slate-900 text-white h-12 px-8 rounded-xl font-bold">New Submission</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}