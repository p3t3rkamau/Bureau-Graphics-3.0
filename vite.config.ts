import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

function sendDebugLog(hypothesisId: string, location: string, message: string, data: Record<string, unknown>) {
  // #region agent log
  fetch('http://127.0.0.1:7320/ingest/4ab94454-99a1-480b-8e59-fc32af18070b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e88552'},body:JSON.stringify({sessionId:'e88552',runId:'pre-fix',hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{})
  // #endregion
}

sendDebugLog('H1', 'vite.config.ts:init', 'Config file evaluated', {
  cwd: process.cwd(),
  nodeVersion: process.version,
})

let lightningCssMainPath: string | null = null
let lightningCssBinaryPath: string | null = null
let binaryExists = false
const reactRouterIndexJsPath = path.resolve(process.cwd(), 'node_modules/react-router/dist/development/index.js')
const reactRouterIndexMjsPath = path.resolve(process.cwd(), 'node_modules/react-router/dist/development/index.mjs')
const reactRouterIndexJsExists = fs.existsSync(reactRouterIndexJsPath)
const reactRouterIndexMjsExists = fs.existsSync(reactRouterIndexMjsPath)

sendDebugLog('H10', 'vite.config.ts:react-router-entry-check', 'Checked react-router dist entry files', {
  reactRouterIndexJsPath,
  reactRouterIndexMjsPath,
  reactRouterIndexJsExists,
  reactRouterIndexMjsExists,
})

try {
  lightningCssMainPath = require.resolve('lightningcss')
  lightningCssBinaryPath = path.resolve(path.dirname(lightningCssMainPath), '../lightningcss.win32-x64-msvc.node')
  binaryExists = fs.existsSync(lightningCssBinaryPath)
  sendDebugLog('H1', 'vite.config.ts:resolve-lightningcss', 'Resolved lightningcss and checked binary', {
    lightningCssMainPath,
    lightningCssBinaryPath,
    binaryExists,
  })
} catch (error) {
  sendDebugLog('H2', 'vite.config.ts:resolve-lightningcss', 'Failed to resolve lightningcss package', {
    error: error instanceof Error ? error.message : String(error),
  })
}

export default defineConfig(async () => {
  sendDebugLog('H3', 'vite.config.ts:before-plugin-imports', 'Starting plugin imports', {
    binaryExists,
  })

  let reactPlugin: (typeof import('@vitejs/plugin-react'))['default']
  let tailwindPlugin: (typeof import('@tailwindcss/vite'))['default']

  try {
    reactPlugin = (await import('@vitejs/plugin-react')).default
    sendDebugLog('H4', 'vite.config.ts:react-import', 'React plugin import succeeded', {})
  } catch (error) {
    sendDebugLog('H4', 'vite.config.ts:react-import', 'React plugin import failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }

  try {
    tailwindPlugin = (await import('@tailwindcss/vite')).default
    sendDebugLog('H5', 'vite.config.ts:tailwind-import', 'Tailwind plugin import succeeded', {})
  } catch (error) {
    sendDebugLog('H5', 'vite.config.ts:tailwind-import', 'Tailwind plugin import failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      reactPlugin(),
      tailwindPlugin(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
