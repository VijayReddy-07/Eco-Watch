import React from 'react';
import { motion } from 'framer-motion';
import SubmissionForm from '@api/components/submission/SubmissionForm';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/lib/utils";

export default function Submit() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    setTimeout(() => {
      navigate(createPageUrl('Dashboard'));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900">Submit Observation</h1>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">
            Help monitor our environment by submitting your observations. 
            Your data will be validated using AI and contribute to real scientific research.
          </p>
        </motion.div>

        <SubmissionForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}