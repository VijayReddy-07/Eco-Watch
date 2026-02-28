import React, { useRef, useEffect } from 'react';

export default function Spectrogram({ analyser, isRecording, height = 160 }) {
    const canvasRef = useRef(null);
    const scrollCanvasRef = useRef(null);
    const requestRef = useRef();
    const offsetRef = useRef(0);

    useEffect(() => {
        if (!analyser || !isRecording) {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return;
        }

        const canvas = canvasRef.current;
        const scrollCanvas = scrollCanvasRef.current;
        if (!canvas || !scrollCanvas) return;

        const ctx = canvas.getContext('2d');
        const scrollCtx = scrollCanvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            requestRef.current = requestAnimationFrame(render);
            analyser.getByteFrequencyData(dataArray);

            // Draw the new column to the main canvas
            const width = canvas.width;
            const h = canvas.height;

            // Shift the scroll canvas
            scrollCtx.drawImage(scrollCanvas, -1, 0);

            // Draw the new data slice
            const imageData = scrollCtx.createImageData(1, h);
            for (let i = 0; i < h; i++) {
                // Map frequency index to height (low frequencies at bottom)
                const frequencyIndex = Math.floor((i / h) * bufferLength * 0.7); // Focus on lower 70% of spectrum
                const value = dataArray[frequencyIndex];

                // Heatmap color mapping
                const r = value;
                const g = Math.max(0, 255 - Math.abs(value - 128) * 2);
                const b = 255 - value;

                const pixelIndex = (h - 1 - i) * 4;
                imageData.data[pixelIndex] = r;
                imageData.data[pixelIndex + 1] = g;
                imageData.data[pixelIndex + 2] = b;
                imageData.data[pixelIndex + 3] = 255;
            }
            scrollCtx.putImageData(imageData, width - 1, 0);

            // Copy to the display canvas
            ctx.clearRect(0, 0, width, h);
            ctx.drawImage(scrollCanvas, 0, 0);
        };

        render();
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [analyser, isRecording]);

    return (
        <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-slate-950 border border-slate-800" style={{ height }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={height}
                className="w-full h-full"
            />
            <canvas
                ref={scrollCanvasRef}
                width={800}
                height={height}
                className="hidden"
            />
            <div className="absolute top-2 left-4 flex gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Spectrogram Analysis</span>
            </div>
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                <span>0 Hz</span>
                <span>5 kHz</span>
                <span>10 kHz</span>
                <span>20 kHz</span>
            </div>
        </div>
    );
}
