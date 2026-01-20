import { ProcessingSettings } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SettingsPanelProps {
  settings: ProcessingSettings
  onSettingsChange: (settings: ProcessingSettings) => void
  onProcess: () => void
  onDownloadAll: () => void
  isProcessing: boolean
  hasFiles: boolean
  processedCount: number
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onProcess,
  onDownloadAll,
  isProcessing,
  hasFiles,
  processedCount
}: SettingsPanelProps) {
  
  const updateSetting = <K extends keyof ProcessingSettings>(
    key: K,
    value: ProcessingSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>全局设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selection */}
        <div className="space-y-2">
          <Label>输出格式</Label>
          <Select
            value={settings.format}
            onChange={(e) => updateSetting('format', e.target.value as any)}
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </Select>
        </div>

        {/* Quality Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>图片质量</Label>
            <span className="text-sm text-slate-500">
              {Math.round(settings.quality * 100)}%
            </span>
          </div>
          <Slider
            value={[settings.quality * 100]}
            onValueChange={(val) => updateSetting('quality', val[0] / 100)}
            max={100}
            step={1}
            disabled={settings.format === 'image/png'} // PNG handles quality differently usually, but let's keep it simple
          />
          {settings.format === 'image/png' && (
             <p className="text-xs text-slate-400">质量设置可能不会影响 PNG (无损格式)</p>
          )}
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label>调整尺寸 (可选)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">宽度 (px)</Label>
              <Input
                type="number"
                placeholder="自动"
                value={settings.width}
                onChange={(e) => updateSetting('width', e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">高度 (px)</Label>
              <Input
                type="number"
                placeholder="自动"
                value={settings.height}
                onChange={(e) => updateSetting('height', e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="aspect"
              className="rounded border-slate-300"
              checked={settings.maintainAspectRatio}
              onChange={(e) => updateSetting('maintainAspectRatio', e.target.checked)}
            />
            <Label htmlFor="aspect" className="cursor-pointer">保持长宽比</Label>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          <Button 
            className="w-full" 
            onClick={onProcess}
            disabled={!hasFiles || isProcessing}
          >
            {isProcessing ? '处理中...' : '开始处理'}
          </Button>
          
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onDownloadAll}
            disabled={processedCount === 0}
          >
            下载全部 (ZIP)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
