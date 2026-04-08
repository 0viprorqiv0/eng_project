import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (data: { file_path: string; file_name: string; file_url: string }) => void;
  uploadEndpoint: string;
  accept?: string;
  maxSizeMB?: number;
  extraData?: Record<string, string>;
  label?: string;
}

export function FileUpload({ 
  onFileUploaded, 
  uploadEndpoint, 
  accept = '.pdf,.doc,.docx,.zip,.jpg,.png', 
  maxSizeMB = 20,
  extraData = {},
  label = 'Kéo thả file vào đây hoặc click để chọn'
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<'success' | 'error' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (dropped) validateAndSet(dropped);
  }, []);

  const validateAndSet = (f: File) => {
    setUploadResult(null);
    setErrorMsg('');
    
    if (f.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File quá lớn. Giới hạn ${maxSizeMB}MB.`);
      setUploadResult('error');
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    Object.entries(extraData).forEach(([k, v]) => formData.append(k, v));

    try {
      const token = localStorage.getItem('token');
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      const result = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(JSON.parse(xhr.responseText)?.message || 'Upload thất bại'));
          }
        };
        xhr.onerror = () => reject(new Error('Lỗi kết nối'));
        xhr.open('POST', `http://127.0.0.1:8000/api${uploadEndpoint}`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(formData);
      });

      setUploadResult('success');
      onFileUploaded(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload thất bại');
      setUploadResult('error');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setUploadResult(null);
    setErrorMsg('');
    setProgress(0);
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-[#E24843] bg-red-50 scale-[1.02]' 
              : 'border-slate-300 bg-slate-50 hover:border-[#13375f] hover:bg-blue-50/30'
          }`}
        >
          <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-[#E24843]' : 'text-slate-400'}`} />
          <p className="text-sm font-semibold text-[#002143]">{label}</p>
          <p className="text-xs text-slate-400 mt-1">Định dạng: {accept} • Tối đa {maxSizeMB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
          />
        </div>
      )}

      {/* File Preview */}
      {file && !uploadResult && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f4f3f7] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-[#13375f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#002143] truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {uploading && (
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#13375f] to-[#E24843] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
          {!uploading && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleUpload}
                className="bg-[#13375f] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#002143] active:scale-95 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Tải lên
              </button>
            </div>
          )}
          {uploading && (
            <div className="flex items-center gap-2 text-[#13375f] flex-shrink-0">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-bold">{progress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {uploadResult === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-green-800">Tải lên thành công!</p>
            <p className="text-xs text-green-600 truncate">{file?.name}</p>
          </div>
          <button onClick={reset} className="text-xs font-bold text-green-700 hover:text-green-900 underline">Chọn file khác</button>
        </div>
      )}

      {/* Error */}
      {uploadResult === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">Lỗi tải lên</p>
            <p className="text-xs text-red-600">{errorMsg}</p>
          </div>
          <button onClick={reset} className="text-xs font-bold text-red-700 hover:text-red-900 underline">Thử lại</button>
        </div>
      )}
    </div>
  );
}
