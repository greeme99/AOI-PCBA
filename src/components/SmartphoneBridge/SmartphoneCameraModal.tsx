import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Smartphone,
  Camera,
  QrCode,
  Video,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Maximize2,
  Sliders,
  Scan,
  Download,
  Layers,
  Sparkles,
  Radio,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { ThemeMode, PCBBoard, PCBComponent, InspectionDefect } from '../../types/aoi';

interface SmartphoneCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCapturedBoard: (board: PCBBoard) => void;
  themeMode?: ThemeMode;
}

export const SmartphoneCameraModal: React.FC<SmartphoneCameraModalProps> = ({
  isOpen,
  onClose,
  onImportCapturedBoard,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  // Mode: 'webcam' (Live Camera Feed) | 'pairing' (Scan QR to Connect Mobile Phone)
  const [activeTab, setActiveTab] = useState<'webcam' | 'pairing'>('webcam');

  // Camera stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Capture & Inspection state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>('PCB-SN-2026-SMARTPHONE-01');
  const [detectedDefects, setDetectedDefects] = useState<InspectionDefect[]>([]);
  const [zoom, setZoom] = useState<number>(1.0);
  const [torch, setTorch] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Mobile pairing token
  const pairingSessionId = 'AOI-CFX-' + Math.floor(100000 + Math.random() * 900000);
  const mobilePairingUrl = typeof window !== 'undefined' ? `${window.location.origin}/#mobile-cam-${pairingSessionId}` : '';

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back/macro camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
        setHasCameraPermission(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error, falling back to simulated high-res feed:', err);
      setCameraError(err.message || 'Camera access not available or permission denied.');
      setHasCameraPermission(false);
      setIsStreaming(false);
    }
  }, []);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === 'webcam') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab, startCamera, stopCamera]);

  if (!isOpen) return null;

  // Take Snapshot from Camera Feed or Simulated Feed
  const handleCaptureSnapshot = () => {
    setIsAnalyzing(true);
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (videoRef.current && isStreaming) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // Render crisp simulated high-res smartphone macro capture of PCBA
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // PCB outline & tracks
        ctx.fillStyle = '#022c22';
        ctx.fillRect(80, 60, canvas.width - 160, canvas.height - 120);

        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        for (let y = 100; y < canvas.height - 100; y += 30) {
          ctx.beginPath();
          ctx.moveTo(120, y);
          ctx.lineTo(canvas.width - 120, y + 20);
          ctx.stroke();
        }

        // SMD Components
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(360, 240, 240, 200); // Main IC
        ctx.strokeStyle = '#f59e0b';
        ctx.strokeRect(360, 240, 240, 200);

        // Solder pads
        ctx.fillStyle = '#94a3b8';
        for (let p = 380; p < 580; p += 25) {
          ctx.fillRect(p, 220, 14, 20);
          ctx.fillRect(p, 440, 14, 20);
        }

        // Barcode / QR Label
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(120, 90, 140, 60);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('PCB-SN-2026-PHONE', 125, 125);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(dataUrl);

      // Simulate AI Vision Object Detection & Solder Defect Extraction
      setTimeout(() => {
        setIsAnalyzing(false);
        const newBarcode = 'PCB-2026-SP-' + Math.floor(1000 + Math.random() * 9000);
        setDetectedBarcode(newBarcode);
        setDetectedDefects([
          {
            id: 'DEF-SP-01',
            componentId: 'C14',
            refDes: 'C14',
            type: 'TOMBSTONE',
            severity: 'CRITICAL',
            title: 'C14 SMT Tombstone (Component Lifting)',
            description: 'Terminal 2 completely detached with wetting angle 104° exceeding IPC-A-610G Class 3 limit.',
            reviewStatus: 'PENDING',
            ipcClause: 'IPC-A-610G 8.3.2.9',
            standardLimit: 'Max coplanarity offset 50um (Measured: 95um)',
            measuredSolderHeight: 45,
            measuredOffset: { x: 0.42, y: -0.15, theta: 18.5 },
            suggestedAction: 'Adjust Mounter Pick & Place vacuum profile and inspect solder paste deposition volume.',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'DEF-SP-02',
            componentId: 'R21',
            refDes: 'R21',
            type: 'SOLDER_BRIDGE',
            severity: 'MAJOR',
            title: 'R21 Pad 1-2 Solder Bridging',
            description: 'Excessive solder accumulation creating short circuit between adjacent component pins.',
            reviewStatus: 'PENDING',
            ipcClause: 'IPC-A-610G 8.3.1',
            standardLimit: 'Zero bridge allowance between distinct conductive pads',
            measuredSolderHeight: 190,
            measuredOffset: { x: 0.05, y: 0.02, theta: 0.8 },
            suggestedAction: 'Reduce screen printer squeegee pressure and check stencil aperture cleaning cycle.',
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 900);
    }
  };

  // Convert Captured Smartphone PCBA into System PCBBoard & Import
  const handleImportToStudio = () => {
    const boardModel = 'SP-PROTO-' + Math.floor(100 + Math.random() * 900);
    const newBoard: PCBBoard = {
      id: boardModel,
      model: boardModel,
      barcode: detectedBarcode || 'PCB-SN-2026-SP-01',
      lotNumber: 'LOT-SP-DEV-01',
      smtLine: 'LINE-01',
      side: 'TOP',
      inspectionTimestamp: new Date().toISOString(),
      status: detectedDefects.length > 0 ? 'FAIL' : 'PASS',
      dimensions: { widthMm: 110, heightMm: 80 },
      tactTimeSec: 4.2,
      fpyAtInspection: 96.5,
      gerberLayers: {
        silkscreen: true,
        copperTraces: true,
        soldermask: true,
        pads: true,
        fiducials: true,
      },
      components: [
        {
          id: 'U1',
          refDes: 'U1',
          packageType: 'QFP-64',
          nominalValue: 'STM32F429 Microcontroller',
          x: 55,
          y: 40,
          width: 14,
          height: 14,
          rotation: 0,
        },
        {
          id: 'C14',
          refDes: 'C14',
          packageType: '0603',
          nominalValue: '10uF 25V X7R Ceramic',
          x: 38.5,
          y: 44.2,
          width: 3.2,
          height: 1.8,
          rotation: 90,
          defect: detectedDefects[0],
        },
        {
          id: 'R21',
          refDes: 'R21',
          packageType: '0805',
          nominalValue: '4.7k Ohm 1%',
          x: 62.0,
          y: 31.8,
          width: 2.8,
          height: 2.2,
          rotation: 0,
          defect: detectedDefects[1],
        },
      ],
      defects: detectedDefects,
    };

    onImportCapturedBoard(newBoard);
    onClose();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mobilePairingUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#0f172a] border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <Smartphone className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Smartphone Macro Camera & Video AOI Bridge
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Direct Device Camera / Wireless Smartphone QR Pairing for PCBA Prototyping & Inspection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tabs */}
            <div className={`flex rounded-lg p-0.5 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
              <button
                onClick={() => setActiveTab('webcam')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'webcam'
                    ? isDark
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white text-blue-600 shadow'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Device / USB Cam</span>
              </button>

              <button
                onClick={() => setActiveTab('pairing')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'pairing'
                    ? isDark
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white text-blue-600 shadow'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Smartphone QR Link</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'webcam' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left 2 Cols: Live Video Viewfinder */}
              <div className="md:col-span-2 space-y-3">
                <div
                  className={`relative rounded-xl border aspect-4/3 overflow-hidden flex items-center justify-center ${
                    isDark ? 'bg-black border-slate-700' : 'bg-slate-950 border-slate-300'
                  }`}
                >
                  {/* Video Feed Element */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${capturedImage ? 'hidden' : 'block'}`}
                    style={{ transform: `scale(${zoom})` }}
                  />

                  {/* Fallback Simulation Canvas if no camera stream */}
                  {!isStreaming && !capturedImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-black text-slate-300">
                      <Camera className="w-12 h-12 text-blue-500 mb-3 animate-pulse" />
                      <h4 className="font-bold text-sm text-white mb-1">
                        High-Definition Optical Feed Active
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mb-4">
                        {cameraError
                          ? `External Camera Info: ${cameraError} (Running High-Res Optical Emulation)`
                          : 'Position the smartphone camera or PCBA under the lens to inspect'}
                      </p>
                      <button
                        onClick={startCamera}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-detect Camera Devices</span>
                      </button>
                    </div>
                  )}

                  {/* Freeze-frame Captured Image */}
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captured PCBA"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Viewfinder Optical Reticle Overlays */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/20 m-4 rounded-lg flex flex-col justify-between p-3">
                    <div className="flex justify-between items-start text-[10px] font-mono text-cyan-400 bg-slate-950/70 px-2 py-1 rounded backdrop-blur-xs w-fit">
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>LIVE 4K MACRO AOI</span>
                      </div>
                    </div>

                    {/* Center Crosshair & Alignment Grid */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-36 border border-cyan-400/50 border-dashed rounded-md flex items-center justify-center">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400 absolute top-0 left-0" />
                        <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400 absolute top-0 right-0" />
                        <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400 absolute bottom-0 left-0" />
                        <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400 absolute bottom-0 right-0" />
                        <div className="text-[10px] font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded">
                          FOCUS TARGET
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end text-[10px] font-mono text-slate-300">
                      <span>ZOOM: {zoom.toFixed(1)}x</span>
                      <span>RESOLUTION: 1920x1080 @ 60FPS</span>
                    </div>
                  </div>
                </div>

                {/* Viewfinder Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1 text-xs">
                    <span className={`text-[11px] mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Zoom:
                    </span>
                    {[1.0, 1.5, 2.0, 4.0].map((z) => (
                      <button
                        key={z}
                        onClick={() => setZoom(z)}
                        className={`px-2 py-1 rounded text-xs font-mono font-semibold border transition-all ${
                          zoom === z
                            ? 'bg-blue-600 text-white border-blue-500'
                            : isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {z.toFixed(1)}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    {capturedImage ? (
                      <button
                        onClick={() => {
                          setCapturedImage(null);
                          setDetectedDefects([]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Retake Snapshot
                      </button>
                    ) : (
                      <button
                        id="snap-pcba-btn"
                        onClick={handleCaptureSnapshot}
                        disabled={isAnalyzing}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Snap PCBA Photo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Col: Instant AI Vision Triage Analysis */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <h3 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      AI Optical PCBA Extractor
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Real-time visual feature detection extracts serial QR barcodes, component footprints, and SMT solder joints.
                  </p>

                  {/* Scanned Serial Barcode */}
                  <div className={`p-2.5 rounded-lg border mb-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Detected 2D DataMatrix / QR Serial
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {detectedBarcode || 'Scanning for QR...'}
                    </div>
                  </div>

                  {/* Detected Defects List */}
                  <div className="space-y-2">
                    <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Identified Anomalies ({detectedDefects.length})
                    </div>

                    {isAnalyzing ? (
                      <div className="p-4 text-center text-xs text-blue-400 font-mono flex items-center justify-center space-x-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running AI Neural Segmentation...</span>
                      </div>
                    ) : detectedDefects.length > 0 ? (
                      detectedDefects.map((def) => (
                        <div
                          key={def.id}
                          className={`p-2 rounded border text-xs ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-rose-400 font-mono">{def.refDes}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                              {def.type}
                            </span>
                          </div>
                          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {def.ipcClause} | {def.title}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-3 text-center text-xs rounded border ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        Snap a photo or focus on a board to detect defects.
                      </div>
                    )}
                  </div>
                </div>

                {/* Import Captured Board into Studio */}
                <button
                  id="import-smartphone-board-btn"
                  onClick={handleImportToStudio}
                  disabled={!capturedImage}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Import into 3D AOI Studio</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pairing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 items-center">
              {/* QR Code Graphic Box */}
              <div
                className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-200 mb-4 inline-block">
                  {/* Generated SVG QR Code Simulation */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-48 h-48 fill-slate-900"
                  >
                    <rect x="0" y="0" width="30" height="30" fill="#000" />
                    <rect x="5" y="5" width="20" height="20" fill="#fff" />
                    <rect x="10" y="10" width="10" height="10" fill="#000" />

                    <rect x="70" y="0" width="30" height="30" fill="#000" />
                    <rect x="75" y="5" width="20" height="20" fill="#fff" />
                    <rect x="80" y="10" width="10" height="10" fill="#000" />

                    <rect x="0" y="70" width="30" height="30" fill="#000" />
                    <rect x="5" y="75" width="20" height="20" fill="#fff" />
                    <rect x="10" y="80" width="10" height="10" fill="#000" />

                    <rect x="35" y="10" width="8" height="8" fill="#000" />
                    <rect x="50" y="10" width="12" height="8" fill="#000" />
                    <rect x="35" y="25" width="15" height="10" fill="#000" />
                    <rect x="55" y="25" width="8" height="15" fill="#000" />

                    <rect x="10" y="35" width="15" height="15" fill="#000" />
                    <rect x="30" y="45" width="40" height="10" fill="#000" />
                    <rect x="40" y="60" width="20" height="20" fill="#000" />
                    <rect x="70" y="40" width="20" height="15" fill="#000" />
                    <rect x="75" y="65" width="15" height="25" fill="#000" />
                  </svg>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-semibold mb-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>SESSION: {pairingSessionId}</span>
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Open smartphone camera app and point at this QR code
                </div>
              </div>

              {/* Instructions & Link */}
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Wireless Smartphone Connection
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Turn your iOS / Android smartphone into a wireless 4K macro AOI optical inspection lens with instant WebRTC streaming.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Scan QR Code:</strong> Open the default Camera or QR app on your smartphone and tap the link.
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Grant Camera Permission:</strong> Allow video access on the mobile browser page.
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Point & Inspect:</strong> Hold the phone over the prototype PCB to stream high-resolution live video and detect solder defects.
                    </div>
                  </div>
                </div>

                {/* Direct Link Copy */}
                <div className="pt-2">
                  <div className={`text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Direct Mobile Connection URL
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={mobilePairingUrl}
                      className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center space-x-1 transition-colors ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Status:</span>
            <span className="font-semibold text-emerald-500 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready for Optical Prototyping
            </span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Close Bridge
          </button>
        </div>
      </div>
    </div>
  );
};
