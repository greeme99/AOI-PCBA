import React from 'react';
import {
  Sun,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  CheckSquare,
  Square,
  Camera,
  Smartphone,
} from 'lucide-react';
import { LightingMode, ThemeMode, CameraAngle } from '../../types/aoi';

interface PCBToolbarProps {
  lightingMode: LightingMode;
  onLightingChange: (mode: LightingMode) => void;
  showSilkscreen: boolean;
  onToggleSilkscreen: () => void;
  showTraces: boolean;
  onToggleTraces: () => void;
  showPads: boolean;
  onTogglePads: () => void;
  showDefectOverlay: boolean;
  onToggleDefectOverlay: () => void;
  show3DHeightMap: boolean;
  onToggle3DHeightMap: () => void;
  isPanelMode?: boolean;
  onTogglePanelMode?: () => void;
  onOpenSmartphoneModal?: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  cameraAngle?: CameraAngle;
  onCameraAngleChange?: (angle: CameraAngle) => void;
  themeMode?: ThemeMode;
}

export const PCBToolbar: React.FC<PCBToolbarProps> = ({
  lightingMode,
  onLightingChange,
  showSilkscreen,
  onToggleSilkscreen,
  showTraces,
  onToggleTraces,
  showPads,
  onTogglePads,
  showDefectOverlay,
  onToggleDefectOverlay,
  show3DHeightMap,
  onToggle3DHeightMap,
  isPanelMode = false,
  onTogglePanelMode,
  onOpenSmartphoneModal,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetView,
  cameraAngle = 'TOP_COAXIAL',
  onCameraAngleChange,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  const lightingOptions: Array<{ id: LightingMode; label: string; iconColor: string }> = [
    { id: 'COMPOSITE_RGB', label: 'True RGB', iconColor: isDark ? 'text-white' : 'text-slate-800' },
    { id: 'TOP_WHITE_COAXIAL', label: 'Top White', iconColor: 'text-cyan-500' },
    { id: 'HIGH_ANGLE_RED', label: 'High Red', iconColor: 'text-rose-500' },
    { id: 'MID_ANGLE_GREEN', label: 'Mid Green', iconColor: 'text-emerald-500' },
    { id: 'LOW_ANGLE_BLUE', label: 'Low Blue', iconColor: 'text-blue-500' },
    { id: '3D_HEIGHT_MAP', label: '3D Moiré', iconColor: 'text-purple-500' },
  ];

  const cameraOptions: Array<{ id: CameraAngle; label: string }> = [
    { id: 'TOP_COAXIAL', label: 'Top' },
    { id: 'OBLIQUE_NORTH', label: '45° N' },
    { id: 'OBLIQUE_SOUTH', label: '45° S' },
    { id: 'OBLIQUE_EAST', label: '45° E' },
    { id: 'OBLIQUE_WEST', label: '45° W' },
  ];

  return (
    <div
      id="pcb-toolbar"
      className={`border-b px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none transition-colors duration-200 ${
        isDark
          ? 'bg-[#1e293b] border-slate-700 text-slate-200'
          : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
      }`}
    >
      {/* Group 1: Lighting Modes */}
      <div
        className={`flex items-center space-x-1 p-1 rounded-lg border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <span className={`text-[11px] font-semibold px-2 flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Sun className="w-3.5 h-3.5 mr-1 text-amber-500" />
          Lighting:
        </span>
        {lightingOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onLightingChange(opt.id)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
              lightingMode === opt.id
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <span className={opt.iconColor}>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Group 2: 4-Way Oblique Optics View Selection */}
      {onCameraAngleChange && (
        <div
          className={`flex items-center space-x-1 p-1 rounded-lg border ${
            isDark
              ? 'bg-slate-900/90 border-slate-700/80'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className={`text-[11px] font-semibold px-2 flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Camera className="w-3.5 h-3.5 mr-1 text-cyan-500" />
            Optics:
          </span>
          {cameraOptions.map((cam) => (
            <button
              key={cam.id}
              onClick={() => onCameraAngleChange(cam.id)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                cameraAngle === cam.id
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cam.label}
            </button>
          ))}
        </div>
      )}

      {/* Group 3: Gerber Layer Toggles */}
      <div
        className={`flex items-center space-x-1 p-1 rounded-lg border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <button
          onClick={onToggleSilkscreen}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            showSilkscreen
              ? isDark
                ? 'bg-slate-800 text-slate-100 font-medium'
                : 'bg-white text-slate-900 font-medium shadow-2xs'
              : isDark
              ? 'text-slate-500 hover:text-slate-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle Silkscreen / Component Designator Layer"
        >
          {showSilkscreen ? <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> : <Square className="w-3.5 h-3.5" />}
          <span>Silkscreen</span>
        </button>

        <button
          onClick={onToggleTraces}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            showTraces
              ? isDark
                ? 'bg-slate-800 text-slate-100 font-medium'
                : 'bg-white text-slate-900 font-medium shadow-2xs'
              : isDark
              ? 'text-slate-500 hover:text-slate-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle Copper Traces"
        >
          {showTraces ? <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> : <Square className="w-3.5 h-3.5" />}
          <span>Traces</span>
        </button>

        <button
          onClick={onTogglePads}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            showPads
              ? isDark
                ? 'bg-slate-800 text-slate-100 font-medium'
                : 'bg-white text-slate-900 font-medium shadow-2xs'
              : isDark
              ? 'text-slate-500 hover:text-slate-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle SMD Copper Pads"
        >
          {showPads ? <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> : <Square className="w-3.5 h-3.5" />}
          <span>Pads</span>
        </button>

        <button
          onClick={onToggleDefectOverlay}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            showDefectOverlay
              ? isDark
                ? 'bg-red-500/20 text-red-300 font-semibold'
                : 'bg-red-50 text-red-700 font-semibold border border-red-200'
              : isDark
              ? 'text-slate-500 hover:text-slate-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle AI Bounding Box Overlays"
        >
          {showDefectOverlay ? <CheckSquare className="w-3.5 h-3.5 text-red-500" /> : <Square className="w-3.5 h-3.5" />}
          <span>Defects</span>
        </button>

        <button
          onClick={onToggle3DHeightMap}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            show3DHeightMap
              ? isDark
                ? 'bg-purple-500/20 text-purple-300 font-semibold'
                : 'bg-purple-50 text-purple-700 font-semibold border border-purple-200'
              : isDark
              ? 'text-slate-500 hover:text-slate-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle 3D Solder Height Topographic Shader"
        >
          {show3DHeightMap ? <CheckSquare className="w-3.5 h-3.5 text-purple-500" /> : <Square className="w-3.5 h-3.5" />}
          <span>3D Map</span>
        </button>

        {onTogglePanelMode && (
          <button
            onClick={onTogglePanelMode}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              isPanelMode
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'bg-amber-50 text-amber-800 font-semibold border border-amber-300'
                : isDark
                ? 'text-slate-500 hover:text-slate-400'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle Multi-Board Panel Array Inspection Mode (2x2 Matrix)"
          >
            {isPanelMode ? <CheckSquare className="w-3.5 h-3.5 text-amber-500" /> : <Square className="w-3.5 h-3.5" />}
            <span>2x2 Panel</span>
          </button>
        )}
      </div>

      {/* Group 4: Zoom Controls */}
      <div
        className={`flex items-center space-x-1 p-1 rounded-lg border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <button
          id="pcb-zoom-out"
          onClick={onZoomOut}
          className={`p-1 rounded transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className={`px-1.5 font-mono text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {(zoomLevel * 100).toFixed(0)}%
        </span>
        <button
          id="pcb-zoom-in"
          onClick={onZoomIn}
          className={`p-1 rounded transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          id="pcb-reset-zoom"
          onClick={onResetView}
          className={`p-1 rounded transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Fit to Screen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Group 5: Smartphone Live Optical Bridge */}
      {onOpenSmartphoneModal && (
        <button
          id="open-smartphone-cam-btn"
          onClick={onOpenSmartphoneModal}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
            isDark
              ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/40'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300'
          }`}
          title="Open Smartphone Macro Camera & QR Scanner Bridge"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          <span>Phone / QR Cam</span>
        </button>
      )}
    </div>
  );
};
