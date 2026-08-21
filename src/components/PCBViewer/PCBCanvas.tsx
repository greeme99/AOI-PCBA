import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PCBBoard, PCBComponent, InspectionDefect, LightingMode, ThemeMode, CameraAngle } from '../../types/aoi';

interface PCBCanvasProps {
  board: PCBBoard;
  selectedDefect: InspectionDefect | null;
  onSelectDefect: (defect: InspectionDefect | null) => void;
  selectedComponent: PCBComponent | null;
  onSelectComponent: (component: PCBComponent | null) => void;
  lightingMode: LightingMode;
  showSilkscreen: boolean;
  showTraces: boolean;
  showPads: boolean;
  showDefectOverlay: boolean;
  show3DHeightMap: boolean;
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  cameraAngle?: CameraAngle;
  isPanelMode?: boolean;
  themeMode?: ThemeMode;
}

export const PCBCanvas: React.FC<PCBCanvasProps> = ({
  board,
  selectedDefect,
  onSelectDefect,
  selectedComponent,
  onSelectComponent,
  lightingMode,
  showSilkscreen,
  showTraces,
  showPads,
  showDefectOverlay,
  show3DHeightMap,
  isScanning,
  scanProgress,
  zoomLevel,
  onZoomChange,
  cameraAngle = 'TOP_COAXIAL',
  isPanelMode = false,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan & Zoom state
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ xMm: number; yMm: number } | null>(null);

  // Auto-focus on selected defect
  useEffect(() => {
    if (selectedDefect && containerRef.current) {
      const comp = board.components.find((c) => c.id === selectedDefect.componentId);
      if (comp) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const scale = (Math.min(width, height) / 110) * zoomLevel;
        setPan({
          x: width / 2 - comp.x * scale,
          y: height / 2 - comp.y * scale,
        });
      }
    }
  }, [selectedDefect, board.components, zoomLevel]);

  // Main canvas render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = isDark ? '#0f172a' : '#cbd5e1'; // Dark chamber vs clean studio light gray
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid dots
    ctx.fillStyle = isDark ? '#1e293b' : '#94a3b8';
    const gridSize = 24;
    for (let gx = 0; gx < width; gx += gridSize) {
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }
    }

    ctx.save();
    // Apply pan & zoom
    ctx.translate(pan.x, pan.y);
    const baseScale = (Math.min(width, height) / 120) * zoomLevel;
    ctx.scale(baseScale, baseScale);

    // Apply 4-Way Oblique Camera Perspective Optics Angle
    if (cameraAngle === 'OBLIQUE_NORTH') {
      ctx.transform(1, 0, -0.15, 0.9, 8, -5);
    } else if (cameraAngle === 'OBLIQUE_SOUTH') {
      ctx.transform(1, 0, 0.15, 0.9, -8, 5);
    } else if (cameraAngle === 'OBLIQUE_EAST') {
      ctx.transform(0.9, 0.15, 0, 1, 5, -8);
    } else if (cameraAngle === 'OBLIQUE_WEST') {
      ctx.transform(0.9, -0.15, 0, 1, -5, 8);
    }

    // 1. Render PCB Board Base Substrate (FR4 soldermask)
    const pcbW = board.dimensions.widthMm;
    const pcbH = board.dimensions.heightMm;

    // Multi-Board 2x2 Panel Array Rails & Breakout Tabs (When Panel Mode Active)
    if (isPanelMode) {
      // Outer Panel Breakout Rail
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(2, 2, pcbW + 16, pcbH + 16, 6);
      ctx.fill();
      ctx.stroke();

      // Rail Tooling Holes & Global Alignment Fiducials
      const railFiducials = [
        { x: 6, y: 6 },
        { x: pcbW + 14, y: 6 },
        { x: 6, y: pcbH + 14 },
        { x: pcbW + 14, y: pcbH + 14 },
      ];
      railFiducials.forEach((rf) => {
        ctx.beginPath();
        ctx.arc(rf.x, rf.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      });

      // Panel Breakout Routing Slots (Mouse Bites)
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, 25);
      ctx.lineTo(8, pcbH - 5);
      ctx.moveTo(pcbW + 12, 25);
      ctx.lineTo(pcbW + 12, pcbH - 5);
      ctx.stroke();
    }

    // Lighting specific PCB background color
    if (lightingMode === 'HIGH_ANGLE_RED') {
      ctx.fillStyle = '#1e293b';
    } else if (lightingMode === 'MID_ANGLE_GREEN') {
      ctx.fillStyle = '#064e3b';
    } else if (lightingMode === 'LOW_ANGLE_BLUE') {
      ctx.fillStyle = '#1e3a8a';
    } else if (lightingMode === '3D_HEIGHT_MAP') {
      ctx.fillStyle = '#030712';
    } else {
      ctx.fillStyle = '#064e3b'; // High-grade Dark Green Soldermask
    }

    // PCB Rounded Rectangle & Outer Chamfer
    ctx.beginPath();
    ctx.roundRect(10, 10, pcbW, pcbH, 4);
    ctx.fill();

    // Board Bevel Border
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = isPanelMode ? '#10b981' : '#047857';
    ctx.stroke();

    // Mounting Holes & Tooling Holes
    const holes = [
      { x: 16, y: 16 },
      { x: pcbW + 4, y: 16 },
      { x: 16, y: pcbH + 4 },
      { x: pcbW + 4, y: pcbH + 4 },
    ];
    holes.forEach((h) => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#cbd5e1';
      ctx.fill();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = '#d97706'; // Gold/Copper annular ring
      ctx.stroke();
    });

    // Fiducial Marks (Optical Alignment Targets for AOI)
    const fiducials = [
      { x: 22, y: 20 },
      { x: pcbW - 2, y: 20 },
      { x: 22, y: pcbH - 2 },
    ];
    fiducials.forEach((f) => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b'; // Gold fiducial pad
      ctx.fill();
      ctx.beginPath();
      ctx.arc(f.x, f.y, 2.4, 0, Math.PI * 2);
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = '#065f46'; // Clear mask ring
      ctx.stroke();
    });

    // 2. Copper Traces Layer
    if (showTraces && lightingMode !== '3D_HEIGHT_MAP') {
      ctx.strokeStyle = lightingMode === 'LOW_ANGLE_BLUE' ? '#38bdf8' : '#047857';
      ctx.lineWidth = 0.35;
      ctx.beginPath();

      // Bus tracks
      for (let i = 0; i < 6; i++) {
        const yOffset = 48 + i * 2.2;
        ctx.moveTo(35, yOffset);
        ctx.lineTo(46, yOffset);
        ctx.moveTo(62, yOffset);
        ctx.lineTo(70, yOffset);
        ctx.lineTo(88, yOffset + 8);
      }

      // Signal vias
      ctx.stroke();

      const vias = [
        { x: 38, y: 36 },
        { x: 42, y: 36 },
        { x: 68, y: 52 },
        { x: 74, y: 72 },
        { x: 104, y: 34 },
        { x: 108, y: 34 },
        { x: 132, y: 58 },
      ];
      vias.forEach((v) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#d97706';
        ctx.fill();
      });
    }

    // 3. Components & Solder Pads Rendering
    board.components.forEach((comp) => {
      const cx = comp.x;
      const cy = comp.y;
      const cw = comp.width;
      const ch = comp.height;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((comp.rotation * Math.PI) / 180);

      // Render Component Solder Pads
      if (showPads) {
        if (comp.packageType.startsWith('0402') || comp.packageType.startsWith('0201') || comp.packageType.startsWith('0603') || comp.packageType.startsWith('0805')) {
          // 2-pad passive
          const padW = cw * 0.45;
          const padH = ch * 1.1;
          const padOffset = cw * 0.45;

          ctx.fillStyle = '#e2e8f0'; // Solder pad silver
          if (lightingMode === 'LOW_ANGLE_BLUE') ctx.fillStyle = '#60a5fa';
          if (lightingMode === 'MID_ANGLE_GREEN') ctx.fillStyle = '#34d399';

          // Left pad & Right pad
          ctx.fillRect(-padOffset - padW / 2, -padH / 2, padW, padH);
          ctx.fillRect(padOffset - padW / 2, -padH / 2, padW, padH);
        } else if (comp.packageType.startsWith('QFP') || comp.packageType.startsWith('QFN')) {
          // Quad pins
          const pinLen = 1.8;
          const pinW = 0.4;
          const halfW = cw / 2;
          const halfH = ch / 2;
          ctx.fillStyle = '#f1f5f9';

          const pinsPerSide = 8;
          for (let p = 0; p < pinsPerSide; p++) {
            const offset = (p - pinsPerSide / 2 + 0.5) * 1.2;
            // Top & Bottom
            ctx.fillRect(offset - pinW / 2, -halfH - pinLen, pinW, pinLen);
            ctx.fillRect(offset - pinW / 2, halfH, pinW, pinLen);
            // Left & Right
            ctx.fillRect(-halfW - pinLen, offset - pinW / 2, pinLen, pinW);
            ctx.fillRect(halfW, offset - pinW / 2, pinLen, pinW);
          }
        }
      }

      // 3D Height Pseudocolor Map Mode or Standard Package Mode
      if (show3DHeightMap || lightingMode === '3D_HEIGHT_MAP') {
        // Render 3D Solder & Height Gradient
        const grad = ctx.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2);
        grad.addColorStop(0, '#3b82f6'); // Low (0um)
        grad.addColorStop(0.5, '#10b981'); // Mid (80um)
        grad.addColorStop(0.85, '#f59e0b'); // High (120um)
        grad.addColorStop(1, '#ef4444'); // Peak / Excess Solder (>180um)
        ctx.fillStyle = grad;
        ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
      } else {
        // Realistic Component Body
        if (comp.packageType.startsWith('QFP') || comp.packageType.startsWith('QFN') || comp.packageType.startsWith('SOIC') || comp.packageType.startsWith('TSSOP')) {
          // Black Epoxy IC Package
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
          ctx.lineWidth = 0.3;
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(-cw / 2, -ch / 2, cw, ch);

          // Pin 1 Index Notch / Chamfer
          ctx.beginPath();
          ctx.arc(-cw / 2 + 1.5, -ch / 2 + 1.5, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();

          // Laser IC Marking text
          if (showSilkscreen) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '1.8px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(comp.nominalValue.substring(0, 10), 0, 0);
          }
        } else if (comp.packageType.startsWith('0402') || comp.packageType.startsWith('0201') || comp.packageType.startsWith('0603') || comp.packageType.startsWith('0805')) {
          // SMD Resistor (Black) or Capacitor (Brown/Tan)
          const isCap = comp.refDes.startsWith('C');
          ctx.fillStyle = isCap ? '#b45309' : '#0f172a'; // Ceramic tan vs Resistor black
          ctx.fillRect(-cw * 0.45, -ch * 0.45, cw * 0.9, ch * 0.9);

          // Silver End Terminals
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(-cw * 0.5, -ch * 0.45, cw * 0.2, ch * 0.9);
          ctx.fillRect(cw * 0.3, -ch * 0.45, cw * 0.2, ch * 0.9);
        } else if (comp.packageType.startsWith('SOD') || comp.refDes.startsWith('D')) {
          // Diode Body with Cathode Stripe
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
          // Cathode Band (White/Silver line)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-cw / 2, -ch / 2, cw * 0.28, ch);
        } else if (comp.packageType.startsWith('D2PAK') || comp.packageType.startsWith('TO-')) {
          // Power Transistor Metal Tab + Molded Body
          ctx.fillStyle = '#cbd5e1'; // Heatsink tab
          ctx.fillRect(-cw * 0.5, -ch * 0.5, cw, ch * 0.4);
          ctx.fillStyle = '#1e293b'; // Plastic mold
          ctx.fillRect(-cw * 0.5, -ch * 0.1, cw, ch * 0.6);
        } else {
          // General Component
          ctx.fillStyle = '#334155';
          ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
        }
      }

      // 4. Silkscreen Legend & RefDes
      if (showSilkscreen && lightingMode !== '3D_HEIGHT_MAP') {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 1.6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comp.refDes, 0, -ch / 2 - 1.2);

        // Component Outline Box
        ctx.lineWidth = 0.25;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(-cw / 2 - 0.6, -ch / 2 - 0.6, cw + 1.2, ch + 1.2);
      }

      ctx.restore();
    });

    // 5. Defect Bounding Boxes & Severity Markers
    if (showDefectOverlay) {
      board.defects.forEach((defect) => {
        const comp = board.components.find((c) => c.id === defect.componentId);
        if (!comp) return;

        const isSelected = selectedDefect?.id === defect.id;
        const color = defect.severity === 'CRITICAL' ? '#ef4444' : defect.severity === 'MAJOR' ? '#f59e0b' : '#3b82f6';

        // Defect Bounding Box
        ctx.save();
        ctx.translate(comp.x, comp.y);

        ctx.lineWidth = isSelected ? 1.2 : 0.7;
        ctx.strokeStyle = color;
        ctx.setLineDash(isSelected ? [] : [1.5, 1.0]);

        const boxPad = 2.5;
        const bw = comp.width + boxPad * 2;
        const bh = comp.height + boxPad * 2;
        ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);

        // Corner brackets
        const cornerSize = 2.0;
        ctx.setLineDash([]);
        ctx.beginPath();
        // Top Left
        ctx.moveTo(-bw / 2, -bh / 2 + cornerSize);
        ctx.lineTo(-bw / 2, -bh / 2);
        ctx.lineTo(-bw / 2 + cornerSize, -bh / 2);
        // Top Right
        ctx.moveTo(bw / 2 - cornerSize, -bh / 2);
        ctx.lineTo(bw / 2, -bh / 2);
        ctx.lineTo(bw / 2, -bh / 2 + cornerSize);
        // Bottom Left
        ctx.moveTo(-bw / 2, bh / 2 - cornerSize);
        ctx.lineTo(-bw / 2, bh / 2);
        ctx.lineTo(-bw / 2 + cornerSize, bh / 2);
        // Bottom Right
        ctx.moveTo(bw / 2 - cornerSize, bh / 2);
        ctx.lineTo(bw / 2, bh / 2);
        ctx.lineTo(bw / 2, bh / 2 - cornerSize);
        ctx.stroke();

        // Tag label
        ctx.fillStyle = color;
        ctx.fillRect(-bw / 2, -bh / 2 - 3.8, bw, 3.4);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 1.8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${defect.refDes}: ${defect.type.replace('_', ' ')}`, 0, -bh / 2 - 1.4);

        ctx.restore();
      });
    }

    // 6. Real-Time Scanning Beam Effect
    if (isScanning) {
      const scanX = 10 + (pcbW * scanProgress) / 100;
      const grad = ctx.createLinearGradient(scanX - 8, 0, scanX, 0);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.8, 'rgba(56, 189, 248, 0.25)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');

      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 8, 10, 8, pcbH);

      // Laser line
      ctx.beginPath();
      ctx.moveTo(scanX, 10);
      ctx.lineTo(scanX, 10 + pcbH);
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 7. Render Ground Wire Exclusion Polygons from Backend
    const groundWirePolygons = [
      { color: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981', points: [[20, 25], [30, 22], [35, 30], [25, 35]] },
      { color: 'rgba(239, 68, 68, 0.15)', stroke: '#ef4444', points: [[70, 80], [85, 75], [80, 90], [65, 92]] },
    ];
    
    groundWirePolygons.forEach(poly => {
      ctx.beginPath();
      ctx.moveTo(poly.points[0][0], poly.points[0][1]);
      for (let i = 1; i < poly.points.length; i++) {
        ctx.lineTo(poly.points[i][0], poly.points[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = poly.color;
      ctx.fill();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = poly.stroke;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    ctx.restore();
  }, [
    board,
    selectedDefect,
    lightingMode,
    showSilkscreen,
    showTraces,
    showPads,
    showDefectOverlay,
    show3DHeightMap,
    isScanning,
    scanProgress,
    zoomLevel,
    pan,
  ]);

  // Handle Resize and Render
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        renderCanvas();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Canvas Mouse Interactions
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Calculate hover board coordinates in mm
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const baseScale = (Math.min(canvasRef.current.width, canvasRef.current.height) / 120) * zoomLevel;
      const boardX = (clickX - pan.x) / baseScale;
      const boardY = (clickY - pan.y) / baseScale;
      setHoverCoord({ xMm: Number(boardX.toFixed(2)), yMm: Number(boardY.toFixed(2)) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newZoom = Math.min(Math.max(zoomLevel * zoomFactor, 0.4), 8.0);
    onZoomChange(Number(newZoom.toFixed(2)));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const baseScale = (Math.min(canvasRef.current.width, canvasRef.current.height) / 120) * zoomLevel;
    const boardX = (clickX - pan.x) / baseScale;
    const boardY = (clickY - pan.y) / baseScale;

    // Check if clicked inside a component or defect
    const clickedComp = board.components.find((c) => {
      const hw = c.width / 2 + 2;
      const hh = c.height / 2 + 2;
      return boardX >= c.x - hw && boardX <= c.x + hw && boardY >= c.y - hh && boardY <= c.y + hh;
    });

    if (clickedComp) {
      onSelectComponent(clickedComp);
      const linkedDefect = board.defects.find((d) => d.componentId === clickedComp.id);
      onSelectDefect(linkedDefect || null);
    } else {
      onSelectComponent(null);
      onSelectDefect(null);
    }
  };

  return (
    <div
      id="pcb-canvas-container"
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-slate-950' : 'bg-slate-200'
      }`}
    >
      <canvas
        id="aoi-pcba-viewport"
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
      />

      {/* Panel Array HUD (Visible when isPanelMode is true) */}
      {isPanelMode && (
        <div
          id="panel-array-hud"
          className={`absolute top-3 left-3 backdrop-blur-md p-2.5 rounded-lg text-xs font-mono shadow-xl border transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-slate-200'
              : 'bg-white/95 border-slate-300 text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-[11px] text-amber-500 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>2x2 PANEL ARRAY (4-UP MULTI-BOARD)</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
              #1: PASS
            </div>
            <div className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold">
              #2: FAIL (ACTIVE)
            </div>
            <div className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
              #3: PASS
            </div>
            <div className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
              #4: PASS
            </div>
          </div>
        </div>
      )}

      {/* Coordinate HUD */}
      <div
        id="canvas-coord-hud"
        className={`absolute bottom-3 left-3 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-mono flex items-center space-x-3 shadow-lg pointer-events-none border transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-300'
            : 'bg-white/95 border-slate-300 text-slate-800'
        }`}
      >
        <div>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>POS: </span>
          {hoverCoord ? `X: ${hoverCoord.xMm}mm  Y: ${hoverCoord.yMm}mm` : 'X: -- Y: --'}
        </div>
        <div className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</div>
        <div>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>ZOOM: </span>
          <span className="text-blue-500 font-semibold">{(zoomLevel * 100).toFixed(0)}%</span>
        </div>
        <div className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</div>
        <div>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>BOARD: </span>
          <span className="text-emerald-500 font-semibold">{board.barcode}</span>
        </div>
        <div className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</div>
        <div>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>OPTICS: </span>
          <span className="text-cyan-400 font-semibold">{cameraAngle.replace('OBLIQUE_', '45° ').replace('TOP_COAXIAL', 'TOP COAX')}</span>
        </div>
      </div>

      {/* 3D Height Pseudocolor Legend (Visible in 3D Mode) */}
      {(show3DHeightMap || lightingMode === '3D_HEIGHT_MAP') && (
        <div
          id="height-legend"
          className={`absolute top-3 right-3 backdrop-blur-md p-2.5 rounded-lg text-xs font-mono shadow-xl pointer-events-none border transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-slate-200'
              : 'bg-white/95 border-slate-300 text-slate-800'
          }`}
        >
          <div className={`text-[11px] font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            3D SOLDER HEIGHT (um)
          </div>
          <div className="h-3 w-40 rounded bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-red-500 mb-1" />
          <div className={`flex justify-between text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>0um (Pad)</span>
            <span>80um</span>
            <span>130um (Opt)</span>
            <span>220+um (Peak)</span>
          </div>
        </div>
      )}
    </div>
  );
};
