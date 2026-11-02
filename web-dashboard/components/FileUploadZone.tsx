"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  ImagePlus,
  X,
  CheckCircle2,
  FileImage,
} from "lucide-react";

interface FileUploadZoneProps {
  label: string;
  sublabel: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  variant?: "blue" | "amber";
  id: string;
}

export default function FileUploadZone({
  label,
  sublabel,
  file,
  onFileChange,
  accept = "image/*",
  variant = "blue",
  id,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileChange(dropped);
    },
    [onFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileChange(selected);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const borderColor =
    variant === "amber" ? "rgba(245,158,11,0.6)" : "rgba(59,130,246,0.6)";
  const textColor = variant === "amber" ? "text-amber-400" : "text-blue-400";
  const bgColor =
    variant === "amber"
      ? "rgba(245,158,11,0.06)"
      : "rgba(59,130,246,0.06)";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${variant === "amber" ? "bg-amber-400" : "bg-blue-400"}`}
          style={{
            boxShadow:
              variant === "amber"
                ? "0 0 6px rgba(245,158,11,0.8)"
                : "0 0 6px rgba(59,130,246,0.8)",
          }}
        />
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${textColor}`}
        >
          {label}
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        className={`
          relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden
          ${variant === "amber" ? "upload-zone-amber" : "upload-zone"}
          ${isDragOver ? "drag-over" : ""}
        `}
        style={{
          borderColor: isDragOver ? borderColor : undefined,
          background: isDragOver ? bgColor : undefined,
        }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        {file ? (
          /* ── File selected state ── */
          <div className="p-3 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                variant === "amber"
                  ? "bg-amber-500/10 border border-amber-500/30"
                  : "bg-blue-500/10 border border-blue-500/30"
              }`}
            >
              <FileImage
                className={`w-5 h-5 ${variant === "amber" ? "text-amber-400" : "text-blue-400"}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(file.size)} •{" "}
                {file.type.split("/")[1]?.toUpperCase() ?? "IMAGE"}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <CheckCircle2
                className={`w-4 h-4 ${variant === "amber" ? "text-amber-400" : "text-blue-400"}`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null);
                }}
                className="p-1 rounded-md hover:bg-slate-700/60 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="py-5 px-4 flex flex-col items-center justify-center gap-2 text-center">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
                variant === "amber"
                  ? "bg-amber-500/10 border border-amber-500/20"
                  : "bg-blue-500/10 border border-blue-500/20"
              }`}
            >
              {variant === "amber" ? (
                <ImagePlus className="w-5 h-5 text-amber-400" />
              ) : (
                <Upload className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <p
              className={`text-xs font-semibold ${variant === "amber" ? "text-amber-300" : "text-blue-300"}`}
            >
              {isDragOver ? "Drop to upload" : sublabel}
            </p>
            <p className="text-xs text-slate-600">
              PNG, JPG, TIF · Max 50MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
        aria-label={label}
      />
    </div>
  );
}
