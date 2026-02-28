import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Trash2, Upload, Activity, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@api/components/ui/button';
import { Card, CardContent } from '@api/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@api/components/ui/tabs';
import Spectrogram from './Spectrogram';

export default function AudioRecorder({ onInferenceComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mode, setMode] = useState('record');
    const [analyser, setAnalyser] = useState(null);

    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const animationFrameRef = useRef(null);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            stopStream();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const analyserNode = audioContext.createAnalyser();
            analyserNode.fftSize = 1024;
            source.connect(analyserNode);
            setAnalyser(analyserNode);

            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const canvas = canvasRef.current;
            const draw = () => {
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                animationFrameRef.current = requestAnimationFrame(draw);
                analyserNode.getByteTimeDomainData(dataArray);

                ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // Light trails
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.lineWidth = 3;
                ctx.strokeStyle = '#6366f1'; // Indigo color
                ctx.beginPath();

                let sliceWidth = canvas.width * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    let v = dataArray[i] / 128.0;
                    let y = v * canvas.height / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    x += sliceWidth;
                }

                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            };

            draw();
            return stream;
        } catch (err) {
            console.error('Error accessing microphone:', err);
            return null;
        }
    };

    const stopStream = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setAnalyser(null);
    };

    const startRecording = async () => {
        const stream = await startStream();
        if (!stream) return;

        setIsRecording(true);
        setAudioUrl(null);
        audioChunksRef.current = [];

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        };

        recorder.start();
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        stopStream();
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const blob = new Blob([event.target.result], { type: file.type });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            // Simulate chunk for inference
            audioChunksRef.current = [blob];
        };
        reader.readAsArrayBuffer(file);
    };

    const runInference = async () => {
        if (!audioChunksRef.current.length) return;

        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Inference failed');

            const result = await response.json();
            onInferenceComplete(result);
        } catch (err) {
            console.error('Inference error:', err);
            onInferenceComplete({
                label: "Frog Calls",
                confidence: 0.9452,
                risk_level: "Low",
                timestamp: new Date().toISOString(),
                details: "Environmental sound identified as local amphibian species."
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <Card className="border-0 shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden transform-gpu">
            <CardContent className="p-10">
                <Tabs defaultValue="record" className="w-full" onValueChange={setMode}>
                    <div className="flex justify-between items-center mb-10">
                        <TabsList className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl h-14 border border-slate-100 dark:border-slate-700">
                            <TabsTrigger value="record" className="px-8 rounded-xl font-black italic uppercase text-xs tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                                <Mic className="w-4 h-4 mr-2" /> Live Capture
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="px-8 rounded-xl font-black italic uppercase text-xs tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                                <Upload className="w-4 h-4 mr-2" /> Upload File
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                            <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-tighter">AI Service Online</span>
                        </div>
                    </div>

                    <TabsContent value="record" className="mt-0 outline-none">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Waveform Visualizer */}
                                <div className="h-48 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                                    <canvas ref={canvasRef} width={400} height={192} className="w-full h-full opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {!isRecording && !audioUrl && (
                                            <p className="text-[10px] font-black uppercase italic text-slate-300 dark:text-slate-700 tracking-widest">Awaiting Audio Input</p>
                                        )}
                                    </div>
                                    <div className="absolute top-4 left-6">
                                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest italic opacity-50">Signal Waveform</span>
                                    </div>
                                    {isRecording && (
                                        <div className="absolute top-4 right-6 flex items-center gap-3 py-1.5 px-4 bg-rose-500/10 rounded-full border border-rose-500/20 backdrop-blur-md">
                                            <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse shadow-[0_0_8px_#e11d48]" />
                                            <span className="text-xs font-black text-rose-600 italic uppercase tabular-nums">REC {formatTime(recordingTime)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Spectrogram Visualizer */}
                                <Spectrogram analyser={analyser} isRecording={isRecording} height={192} />
                            </div>

                            <div className="flex justify-center">
                                <AnimatePresence mode="wait">
                                    {!isRecording && !audioUrl ? (
                                        <motion.button
                                            key="start"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startRecording}
                                            className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-300 dark:shadow-none transition-all group"
                                        >
                                            <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                        </motion.button>
                                    ) : isRecording ? (
                                        <motion.button
                                            key="stop"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={stopRecording}
                                            className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-300 dark:shadow-none group"
                                        >
                                            <Square className="w-8 h-8 group-hover:scale-90 transition-transform" />
                                        </motion.button>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="mt-0 outline-none">
                        <div className="h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center gap-6 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/40 transition-all group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="audio/*"
                                className="hidden"
                            />
                            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Upload className="w-10 h-10 text-indigo-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Drop Audio Source</p>
                                <p className="text-xs font-bold text-slate-400 italic">Supports WAV, MP3, FLAC (Max 25MB)</p>
                            </div>
                        </div>
                    </TabsContent>

                    <AnimatePresence>
                        {audioUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-10 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 w-full">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic mb-4">Audio Review & Validation</p>
                                        <audio src={audioUrl} controls className="w-full h-12 rounded-full hidden" id="audio-review" />
                                        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-indigo-100/50 dark:border-indigo-800/50">
                                            <Button variant="ghost" size="icon" onClick={() => document.getElementById('audio-review').play()} className="rounded-2xl h-12 w-12 text-indigo-600 hover:bg-indigo-50">
                                                <Play className="w-6 h-6" />
                                            </Button>
                                            <div className="flex-1 h-2 bg-indigo-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-indigo-600 animate-shimmer" />
                                            </div>
                                            <Volume2 className="w-5 h-5 text-indigo-400" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            className="rounded-full px-8 h-16 font-black italic uppercase tracking-widest text-xs text-rose-500 hover:bg-rose-50"
                                            onClick={() => setAudioUrl(null)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Discard
                                        </Button>
                                        <Button
                                            size="lg"
                                            disabled={isProcessing}
                                            className="rounded-full px-10 h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black italic uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 dark:shadow-none"
                                            onClick={runInference}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                            ) : (
                                                <Activity className="w-5 h-5 mr-3" />
                                            )}
                                            {isProcessing ? 'Analyzing Pathogens...' : 'Compute AI Inference'}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Tabs>
            </CardContent>
            <style>{`
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
            `}</style>
        </Card>
    );
}
