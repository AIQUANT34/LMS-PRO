// Architectural Color Fix Utility
// This script ensures high contrast across all components

export const applyColorFix = () => {
  // Force high contrast colors
  const style = document.createElement('style');
  style.textContent = `
    /* CRITICAL COLOR FIXES */
    .text-gray-400, .text-gray-500, .text-gray-600, .text-gray-700 {
      color: #374151 !important;
    }
    .text-gray-800, .text-gray-900 {
      color: #111827 !important;
    }
    
    /* Badge fixes */
    .bg-yellow-500, .bg-red-500, .bg-purple-500, .bg-blue-500, .bg-green-500 {
      background: linear-gradient(135deg, var(--color-start), var(--color-end)) !important;
    }
    .bg-yellow-500 { --color-start: #f59e0b; --color-end: #d97706; }
    .bg-red-500 { --color-start: #ef4444; --color-end: #dc2626; }
    .bg-purple-500 { --color-start: #a855f7; --color-end: #9333ea; }
    .bg-blue-500 { --color-start: #3b82f6; --color-end: #2563eb; }
    .bg-green-500 { --color-start: #22c55e; --color-end: #16a34a; }
    
    /* Force white text on colored backgrounds */
    .bg-yellow-500 *, .bg-red-500 *, .bg-purple-500 *, .bg-blue-500 *, .bg-green-500 * {
      color: #ffffff !important;
    }
    
    /* Enhanced text contrast */
    .font-semibold, .font-bold {
      color: #111827 !important;
    }
    
    /* Enhanced card text */
    .text-sm {
      color: #374151 !important;
    }
    
    /* Enhanced pricing */
    .text-xl {
      color: #111827 !important;
    }
    
    /* Enhanced icons */
    .h-3.w-3, .h-4.w-4, .h-5.w-5, .h-6.w-6 {
      color: inherit !important;
    }
  `;
  document.head.appendChild(style);
};

// Apply fix immediately
if (typeof window !== 'undefined') {
  applyColorFix();
}
