'use client';

import { useState } from 'react';
import { UploadIcon, FileTextIcon, SparklesIcon } from './Icon';

interface UploadAreaProps {
  onFileLoaded: (file: File) => void;
  error: string | null;
  loading: boolean;
}

const isSupportedFile = (file: File) => {
  const lower = file.name.toLowerCase();

  return (
    lower.endsWith('.txt') ||
    lower.endsWith('.json') ||
    lower.endsWith('.pdf') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png')
  );
};

export default function UploadArea({ onFileLoaded, error, loading }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const readFile = (file: File) => {
    if (!isSupportedFile(file)) {
      alert("Only TXT, JSON, PDF, JPG, PNG files are supported.");
      return;
    }

    setUploadedFileName(file.name);
    onFileLoaded(file);
  };


  // const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     readFile(file);
  //   }
  // };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      readFile(file);
    }
  };


  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${isDragging
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".txt,.json,.pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        disabled={loading}
      />

      <div className="flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: isDragging ? '#4F46E5' : '#E0E7FF' }}
        >
          <UploadIcon className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-indigo-600'}`} />
        </div>

        <h3 className="text-xl text-gray-900 mb-2">
          {isDragging ? 'Drop your file here' : 'Upload File'}
        </h3>

        <p className="text-gray-600 mb-6">
          Drag and drop your PDF, Image, TXT or JSON file here
        </p>

        <label
          htmlFor="file-upload"
          className="px-6 py-3 rounded-lg text-white cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
          style={{ backgroundColor: '#4F46E5' }}
        >
          <FileTextIcon className="w-5 h-5" />
          {loading ? 'Loading...' : 'Choose File'}
        </label>

        {uploadedFileName && !error && (
          <div className="mt-6 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
            <span className="text-green-800 text-sm">
              File uploaded successfully: <b>{uploadedFileName}</b>
            </span>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}