export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span>&copy; {currentYear} HarmonyOS 万少. All rights reserved.</span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <a 
            href="https://blog.zbztb.cn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            访问博客
          </a>
        </div>
        
        {/* <div className="flex hi flex-col md:flex-row items-center gap-2 md:gap-4 text-xs">
          <a 
            href="https://beian.miit.gov.cn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
          >
            京ICP备XXXXXXXX号-X (请替换为您的备案号)
          </a>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <a 
            href="#" 
            className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>公网安备 XXXXXXXXXXXXXX号 (可选)</span>
          </a>
        </div> */}
      </div>
    </footer>
  )
}
