import { useState, useCallback } from 'react'
import { UploadZone } from '@/components/UploadZone'
import { SettingsPanel } from '@/components/SettingsPanel'
import { ImageList } from '@/components/ImageList'
import { ImageFile, ProcessingSettings } from '@/lib/types'
import { processImage, getFilenameWithoutExtension, getImageDimensions } from '@/lib/image-processor'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCodePreview } from '@/components/QrCodePreview'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Footer } from '@/components/Footer'

function App() {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState<ProcessingSettings>({
    format: 'image/jpeg',
    quality: 0.8,
    width: '',
    height: '',
    maintainAspectRatio: true
  })

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    // Initialize files immediately to show in UI
    const newImageFiles: ImageFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      originalSize: file.size
    }))
    
    setFiles(prev => [...prev, ...newImageFiles])

    // Then asynchronously fetch dimensions for these new files
    for (const imgFile of newImageFiles) {
      try {
        const dims = await getImageDimensions(imgFile.file);
        setFiles(prev => prev.map(f => 
          f.id === imgFile.id 
            ? { ...f, originalWidth: dims.width, originalHeight: dims.height }
            : f
        ));
      } catch (e) {
        console.error("Failed to get dimensions for", imgFile.file.name, e);
      }
    }
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  const handleProcess = async () => {
    setIsProcessing(true)
    
    // Process files sequentially or in parallel?
    // Parallel might freeze UI if too many. Let's do parallel with limit or just map Promise.all for now as count is usually low.
    // For better UX, we update state one by one.

    const newFiles = [...files]
    
    for (let i = 0; i < newFiles.length; i++) {
      // Remove the check for 'done' status to allow re-processing
      // if (newFiles[i].status === 'done') continue; 

      newFiles[i] = { ...newFiles[i], status: 'processing', error: undefined }
      setFiles([...newFiles]) // Trigger update to show loading

      try {
        const processOpts = {
          ...settings,
          width: settings.width === '' ? undefined : settings.width,
          height: settings.height === '' ? undefined : settings.height,
        }
        const result = await processImage(newFiles[i].file, processOpts)
        newFiles[i] = {
          ...newFiles[i],
          status: 'done',
          processedBlob: result.blob,
          processedSize: result.blob.size,
          processedWidth: result.width,
          processedHeight: result.height,
          processedFormat: processOpts.format
        }
      } catch (error) {
        console.error(error)
        newFiles[i] = {
          ...newFiles[i],
          status: 'error',
          error: '处理失败'
        }
      }
      setFiles([...newFiles])
    }
    
    setIsProcessing(false)
  }

  const handleDownloadAll = async () => {
    const processedFiles = files.filter(f => f.status === 'done' && f.processedBlob)
    if (processedFiles.length === 0) return

    if (processedFiles.length === 1) {
      // Single file download
      const f = processedFiles[0]
      // Use stored format if available, otherwise fallback to settings (though stored should exist)
      const format = f.processedFormat || settings.format
      const ext = format.split('/')[1]
      saveAs(f.processedBlob!, `${getFilenameWithoutExtension(f.file.name)}.${ext}`)
      return
    }

    // Zip download
    const zip = new JSZip()
    
    processedFiles.forEach(f => {
      const format = f.processedFormat || settings.format
      const ext = format.split('/')[1]
      // Handle duplicate names if needed
      zip.file(`${getFilenameWithoutExtension(f.file.name)}.${ext}`, f.processedBlob!)
    })

    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "处理后的图片.zip")
  }

  const processedCount = files.filter(f => f.status === 'done').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PicProcessor
            </h1>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            纯前端图片处理工具
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <SettingsPanel 
              settings={settings}
              onSettingsChange={setSettings}
              onProcess={handleProcess}
              onDownloadAll={handleDownloadAll}
              isProcessing={isProcessing}
              hasFiles={files.length > 0}
              processedCount={processedCount}
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">隐私说明</p>
              <p>所有图片处理均在您的浏览器本地进行，不会上传到任何服务器。</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>关于作者</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <QrCodePreview 
                    src="https://wsy996.obs.cn-east-3.myhuaweicloud.com:443/%E5%85%AC%E4%BC%97%E5%8F%B7.png"
                    alt="公众号"
                    label="公众号"
                  />
                  <QrCodePreview 
                    src="https://wsy996.obs.cn-east-3.myhuaweicloud.com:443/%E5%BE%AE%E4%BF%A1%E5%8F%B7.jpg"
                    alt="微信号"
                    label="个人微信"
                  />
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://blog.zbztb.cn/" target="_blank" rel="noopener noreferrer">
                      访问万少的博客
                    </a>
                  </Button>
                  <div className="text-xs text-slate-500 space-y-1 pt-2 border-t">
                    <p>邮箱: yeah126139163@163.com</p>
                    <p>微信: w86903522</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Upload & List */}
          <div className="lg:col-span-2 space-y-8">
            <UploadZone onFilesSelected={handleFilesSelected} />
            <ImageList files={files} onRemove={handleRemoveFile} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
