import React, { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Video, FileText, Upload, X } from 'lucide-react';

interface MediaUploaderProps {
  lessonType: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  uploadProgress: number;
  uploadedPath: string;
  onClearUpload: () => void;
}

export function MediaUploader({ lessonType, file, onFileChange, uploadProgress, uploadedPath, onClearUpload }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  }, [onFileChange]);

  const handleClear = () => {
    onFileChange(null);
    onClearUpload();
  };

  /* ─── VIDEO ─── */
  if (lessonType === 'video') {
    const Icon = Video;
    return (
      <motion.div key="video-upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        className="bg-white rounded-3xl p-7 shadow-sm border border-black/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#002143] rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-headline text-lg font-extrabold text-[#002143]">Nội dung Video</h3>
        </div>
        {file ? (
          <div className="border-2 border-dashed border-[#002143]/20 rounded-2xl p-6 bg-[#f4f3f7]/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#002143]/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-[#002143]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#002143] truncate">{file.name}</p>
                <p className="text-xs text-[#73777f] mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#002143] to-[#e65540] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
                {uploadedPath && <p className="text-xs text-green-600 font-bold mt-1">✓ Đã tải lên thành công</p>}
              </div>
              <button onClick={handleClear}
                className="p-2 text-[#73777f] hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>
        ) : (
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'border-[#e65540] bg-red-50/50' : 'border-[#d4d6db] bg-[#f8f8fa] hover:border-[#002143]/30'}`}>
            <div className="w-14 h-14 mx-auto mb-4 bg-[#002143] rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm font-bold text-[#002143] mb-1">Kéo và thả tệp video của bạn tại đây</p>
            <p className="text-xs text-[#73777f] mb-5">Hỗ trợ MP4, MOV, AVI (Tối đa 2GB)</p>
            <button type="button" className="px-6 py-2.5 bg-white text-[#002143] text-sm font-bold rounded-xl border border-[#d4d6db] hover:bg-[#f4f3f7] active:scale-95 transition-all">
              Chọn tệp từ máy tính
            </button>
            <input ref={fileInputRef} type="file" accept=".mp4,.webm,.mov,.avi" className="hidden"
              onChange={e => e.target.files?.[0] && onFileChange(e.target.files[0])} />
          </div>
        )}
      </motion.div>
    );
  }

  /* ─── DOCUMENT ─── */
  if (lessonType === 'document') {
    return (
      <motion.div key="doc-upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        className="bg-white rounded-3xl p-7 shadow-sm border border-black/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#002143] rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-headline text-lg font-extrabold text-[#002143]">Khu vực tải lên tài liệu</h3>
        </div>
        {file ? (
          <div className="border-2 border-dashed border-[#002143]/20 rounded-2xl p-6 bg-[#f4f3f7]/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#002143]/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-[#002143]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#002143] truncate">{file.name}</p>
                <p className="text-xs text-[#73777f] mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#002143] to-[#e65540] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
                {uploadedPath && <p className="text-xs text-green-600 font-bold mt-1">✓ Đã tải lên thành công</p>}
              </div>
              <button onClick={handleClear}
                className="p-2 text-[#73777f] hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>
        ) : (
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-[#e65540] bg-red-50/50' : 'border-[#d4d6db] bg-[#f8f8fa] hover:border-[#002143]/30'}`}>
            <div className="w-14 h-14 mx-auto mb-4 bg-[#002143] rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm font-bold text-[#002143] mb-1">Kéo và thả tệp tại đây hoặc chọn từ máy tính</p>
            {/* Format badges */}
            <div className="flex items-center justify-center gap-2 my-4">
              {[
                { ext: 'PDF', color: 'bg-red-500' },
                { ext: 'DOCX', color: 'bg-blue-500' },
                { ext: 'PPTX', color: 'bg-orange-500' },
              ].map(f => (
                <span key={f.ext} className={`${f.color} text-white text-[10px] font-bold px-3 py-1 rounded-full`}>
                  {f.ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#73777f] mb-4">Dung lượng tối đa: 50MB</p>
            <button type="button" className="px-8 py-3 bg-[#002143] text-white text-sm font-bold rounded-xl hover:bg-[#1e3a5f] active:scale-95 transition-all shadow-lg">
              Chọn Tệp
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden"
              onChange={e => e.target.files?.[0] && onFileChange(e.target.files[0])} />
          </div>
        )}
      </motion.div>
    );
  }

  return null;
}
