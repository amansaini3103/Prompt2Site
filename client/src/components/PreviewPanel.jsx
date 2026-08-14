import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils'
import SandpackErrorMonitor from './SandpackErrorMonitor'

function SandpackFileWatcher({ onLiveFilesChange }) {
  const { sandpack } = useSandpack()
  const { files } = sandpack
  const previousFilesRef = useRef(files)

  useEffect(() => {
    previousFilesRef.current = files
  }, [files])

  useEffect(() => {
    if (!files) return

    const updatedFiles = {}
    let hasChanges = false
    const previousFiles = previousFilesRef.current || {}

    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode = fileObj.code
      updatedFiles[path] = fileCode
      if (previousFiles[path]?.code !== fileCode) {
        hasChanges = true
      }
    }

    if (hasChanges) {
      onLiveFilesChange(updatedFiles)
    }
  }, [files, onLiveFilesChange])

  return null
}

const PreviewPanel = ({ project, activeFile, showCode }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true)
  const [liveFiles, setLiveFiles] = useState(project?.files || {})
  const [prevProjectKey, setPrevProjectKey] = useState(
    `${project?._id || ''}-${project?.version || ''}`
  )

  useEffect(() => {
    if (!project) return

    const currentKey = `${project._id}-${project.version}`
    if (prevProjectKey !== currentKey) {
      setPrevProjectKey(currentKey)
      setLiveFiles(project.files || {})
    }
  }, [project, prevProjectKey])

  const handleLiveFilesChange = (newFiles) => {
    setLiveFiles((prev) => {
      let changed = false
      for (const [p, code] of Object.entries(newFiles)) {
        if (prev[p] !== code) {
          changed = true
          break
        }
      }
      return changed ? newFiles : prev
    })
  }

  const sandpackFiles = useMemo(() => {
    const spFiles = {}
    for (const [path, content] of Object.entries(liveFiles || {})) {
      const fileCode = typeof content === 'string' ? content : content?.content || ''
      spFiles[path] = {
        code: fileCode,
        active: path === activeFile,
      }
    }
    return spFiles
  }, [liveFiles, activeFile])

  const dependencies = useMemo(() => detectDependencies(), [liveFiles])

  if (!project) {
    return null
  }

  return (
    <div className="h-full w-full">
      <SandpackProvider
        key={project._id}
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            'https://cdn.tailwindcss.com',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
          ],
          classes: {
            'sp-wrapper': 'sp-wrapper',
            'sp-layout': 'sp-layout',
            'sp-preview': 'sp-preview',
          },
          logLevel: 0,
        }}
        theme={{
          colors: {
            surface1: '#ffffff',
            surface2: '#f4f4f5',
            surface3: '#e4e4e7',
            clickable: '#71717a',
            base: '#09090b',
            disabled: '#a1a1aa',
            hover: '#18181b',
            accent: '#18181b',
            error: '#ef4444',
            errorSurface: '#fef2f2',
          },
          font: {
            body: "'Urbanist',system-ui,-apple-system,sans-serif",
            mono: "'Geist Mono',ui-monnospace,monospace",
            size: '13px',
            lineHeight: '1.6',
          },
        }}
      >
        <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />
        <SandpackErrorMonitor onErrorChange={setShowErrorOverlay} />
        <SandpackLayout
          style={{
            height: '100%',
            border: 'none',
            borderRadius: 0,
            background: 'transparent',
          }}
        >
          {showCode && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              style={{ height: '100%', flex: 1, minWidth: 0 }}
            />
          )}
          <SandpackPreview
            showNavigator={false}
            showRefreshButton
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{ height: '100%', flex: showCode ? 1 : 2, minWidth: 0 }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default PreviewPanel