import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import FeedbackDialog from './FeedbackDialog';

export default function FeedbackFAB() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/40 hover:bg-teal-600 transition-colors border-2 border-white dark:border-slate-900"
            >
                <MessageSquarePlus className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </motion.button>

            <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
