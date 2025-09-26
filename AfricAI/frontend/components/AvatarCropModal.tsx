import React, { useEffect, useRef, useState } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';

interface AvatarCropModalProps {
    isOpen: boolean;
    file: File | null;
    onClose: () => void;
    onCropped: (blob: Blob) => void;
}

// Simple 1:1 cropper using a canvas overlay; drag to position, zoom with slider
const AvatarCropModal: React.FC<AvatarCropModalProps> = ({ isOpen, file, onClose, onCropped }) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!file || !isOpen) { setImageUrl(null); return; }
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file, isOpen]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({ x: e.clientX - startDrag.x, y: e.clientY - startDrag.y });
    };
    const handleMouseUp = () => setIsDragging(false);

    const doCrop = async () => {
        if (!imgRef.current) return;
        const previewSize = 320;
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        const img = imgRef.current;

        // Compute draw area based on scale and offset
        const baseW = img.naturalWidth * scale;
        const baseH = img.naturalHeight * scale;
        // Center coordinates translated by offset relative to preview box
        const cx = (previewSize - baseW) / 2 + offset.x;
        const cy = (previewSize - baseH) / 2 + offset.y;

        // Draw into target 512x512 scaled from preview space
        // Map preview 320x320 to output 512x512
        const scaleOut = 512 / previewSize;
        ctx.drawImage(img, cx * scaleOut, cy * scaleOut, baseW * scaleOut, baseH * scaleOut);
        canvas.toBlob((b) => { if (b) onCropped(b); }, 'image/jpeg', 0.92);
    };

    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
            <GlassCard className="relative z-10 p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Adjust Your Avatar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div
                          className="relative w-80 h-80 mx-auto rounded-lg overflow-hidden bg-black/40 border border-white/10"
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                            <img ref={imgRef} src={imageUrl} alt="to-crop" className="select-none pointer-events-none" style={{ position: 'absolute', left: offset.x + (320 - (imgRef.current?.naturalWidth || 0) * scale) / 2, top: offset.y + (320 - (imgRef.current?.naturalHeight || 0) * scale) / 2, transform: `scale(${scale})`, transformOrigin: 'top left' }} />
                            <div className="absolute inset-0 border-2 border-white/20 rounded-lg pointer-events-none"></div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm mb-2">Zoom</label>
                            <input type="range" min={0.5} max={3} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-400 mb-2">Preview</p>
                        <canvas ref={canvasRef} width={160} height={160} className="hidden" />
                        <div className="w-40 h-40 rounded-full overflow-hidden border border-white/10 bg-black/30">
                            <img src={imageUrl} style={{ transform: `scale(${scale}) translate(${offset.x / 2}px, ${offset.y / 2}px)` }} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Final image is saved as 512×512 JPEG</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={doCrop}>Save</Button>
                </div>
            </GlassCard>
        </div>
    );
};

export default AvatarCropModal;


