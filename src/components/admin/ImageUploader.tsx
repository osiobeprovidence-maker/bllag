import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  recommendedWidth?: number;
  recommendedHeight?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: string;
  label?: string;
  showAltInput?: boolean;
  altValue?: string;
  onAltChange?: (val: string) => void;
  mediaLibrary?: { url: string; name: string; id: string }[];
}

export function ImageUploader({
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  recommendedWidth = 1920,
  recommendedHeight = 900,
  minWidth = 800,
  minHeight = 350,
  aspectRatio = '16:9',
  label,
  showAltInput = false,
  altValue,
  onAltChange,
  mediaLibrary,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensionWarning, setDimensionWarning] = useState(false);
  const [ratioWarning, setRatioWarning] = useState<string | null>(null);
  const [showMediaLib, setShowMediaLib] = useState(false);
  const generateUploadUrl = useAction(api.upload.generateUploadUrl);

  const validateFile = async (file: File): Promise<boolean> => {
    setError(null);
    setDimensionWarning(false);
    setRatioWarning(null);

    if (!accept.split(',').some((t) => file.type === t.trim())) {
      setError(`Invalid file type. Accepted: ${accept.split(',').map((t) => t.split('/')[1].toUpperCase()).join(', ')}`);
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const getDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  };

  const handleUpload = async (file: File) => {
    const valid = await validateFile(file);
    if (!valid) return;

    setUploading(true);
    try {
      const dims = await getDimensions(file);
      if (dims.width < minWidth || dims.height < minHeight) {
        setDimensionWarning(true);
      } else if (dims.width < recommendedWidth || dims.height < recommendedHeight) {
        setDimensionWarning(true);
      }

      if (aspectRatio) {
        const parts = aspectRatio.split(':');
        if (parts.length === 2) {
          const expected = parseFloat(parts[0]) / parseFloat(parts[1]);
          const actual = dims.width / dims.height;
          const diff = Math.abs(actual - expected) / expected;
          if (diff > 0.1) {
            const actualRatio = `${Math.round(actual * 100) / 100}:1`;
            setRatioWarning(`Image aspect ratio (${actualRatio}) doesn't match recommended (${aspectRatio}). Images may appear cropped or stretched.`);
          }
        }
      }

      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!response.ok) throw new Error('Upload failed');
      const { storageId } = await response.json();
      const imageUrl = `${window.location.origin}/api/storage/${storageId}`;
      onChange(imageUrl);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange('');
    if (onAltChange) onAltChange('');
    setDimensionWarning(false);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">{label}</label>
      )}

      {value ? (
        <div className="space-y-2">
          <div className="relative bg-gray-100 border border-gray-200 overflow-hidden group" style={{ minHeight: '120px', maxHeight: '200px' }}>
            <img src={value} alt="Uploaded" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />
        </div>
      ) : (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragOver ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-accent hover:bg-gray-50'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Drag & drop or <span className="text-accent">browse</span>
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
                  {accept.split(',').map((t) => t.split('/')[1].toUpperCase()).join(', ')} · Max {maxSizeMB}MB
                </p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

          {mediaLibrary && mediaLibrary.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMediaLib(!showMediaLib)}
              className="mt-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
            >
              {showMediaLib ? 'Close Media Library' : 'Select from Media Library'}
            </button>
          )}

          {showMediaLib && mediaLibrary && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {mediaLibrary.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { onChange(m.url); setShowMediaLib(false); }}
                    className="aspect-square bg-white border border-gray-200 overflow-hidden hover:border-accent transition-colors relative group"
                  >
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-bold">{error}</span>
        </div>
      )}

      {dimensionWarning && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-bold">This image is smaller than the recommended size ({recommendedWidth}×{recommendedHeight}) and may appear blurry.</span>
        </div>
      )}

      {ratioWarning && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-bold">{ratioWarning}</span>
        </div>
      )}

      {showAltInput && (
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest mb-1 block text-muted-foreground">Alt Text (optional)</label>
          <input
            type="text"
            value={altValue || ''}
            onChange={(e) => onAltChange?.(e.target.value)}
            placeholder="Describe the image for accessibility"
            className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent"
          />
        </div>
      )}

      {!value && (
        <div className="bg-gray-50 border border-gray-200 p-3">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Recommended:</p>
          <p className="text-[9px] text-muted-foreground">{recommendedWidth} × {recommendedHeight} px · Aspect: {aspectRatio} · Max: {maxSizeMB}MB</p>
        </div>
      )}
    </div>
  );
}
