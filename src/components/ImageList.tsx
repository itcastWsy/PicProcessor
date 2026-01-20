import { ImageFile } from '@/lib/types'
import { formatFileSize } from '@/lib/image-processor'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Download, AlertCircle, Loader2 } from 'lucide-react'
import { saveAs } from 'file-saver'

interface ImageListProps {
  files: ImageFile[]
  onRemove: (id: string) => void
}

export function ImageList({ files, onRemove }: ImageListProps) {
  const handleDownload = (file: ImageFile) => {
    if (file.processedBlob) {
      // Determine extension from processedFormat if available, else default to jpg or something safe
      // Note: We need access to settings here if we want to fallback, but processedFormat should be set on 'done'.
      const format = file.processedFormat || 'image/jpeg';
      const ext = format.split('/')[1];
      saveAs(file.processedBlob, `${file.file.name.replace(/\.[^/.]+$/, "")}.${ext}`)
    }
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        图片列表 ({files.length})
      </h2>
      <div className="grid gap-4">
        {files.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              {/* Preview */}
              <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                <img 
                  src={item.preview} 
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate text-slate-900 dark:text-slate-100" title={item.file.name}>
                  {item.file.name}
                </h4>
                <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-1 mt-1">
                  <div className="flex gap-4">
                    <span>
                      原始: {formatFileSize(item.originalSize)}
                      {item.originalWidth && item.originalHeight && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                          ({item.originalWidth}×{item.originalHeight})
                        </span>
                      )}
                    </span>
                  </div>
                  
                  {item.processedSize && (
                    <div className="flex gap-4 items-center">
                      <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                        <span>→ {formatFileSize(item.processedSize)}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          ({Math.round((item.processedSize / item.originalSize) * 100)}%)
                        </span>
                      </span>
                      
                      {item.processedWidth && item.processedHeight && (
                         <span className="text-xs text-slate-500 dark:text-slate-400">
                           {item.processedWidth}×{item.processedHeight}
                         </span>
                      )}

                      {item.processedFormat && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 uppercase font-bold">
                          {item.processedFormat.split('/')[1]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {item.error && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{item.error}</p>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                {item.status === 'processing' && (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
                )}
                {item.status === 'done' && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                    onClick={() => handleDownload(item)}
                    title="下载单张"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                {item.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                )}
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                  onClick={() => onRemove(item.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
