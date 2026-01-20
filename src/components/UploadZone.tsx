import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
  className?: string
}

export function UploadZone({ onFilesSelected, className }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles)
    }
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900",
        isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-700",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
          {isDragActive ? (
            <FileImage className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-500 dark:text-slate-400" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {isDragActive ? "松开鼠标上传图片" : "点击或拖拽图片到此处"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            支持 JPG, PNG, WebP 格式
          </p>
        </div>
      </div>
    </div>
  )
}
