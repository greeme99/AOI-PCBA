export type IPCClass = 'Class 1 (General Electronic)' | 'Class 2 (Dedicated Service)' | 'Class 3 (High Reliability / Automotive)';

export type ThemeMode = 'dark' | 'light';

export type CameraAngle =
  | 'TOP_COAXIAL'
  | 'OBLIQUE_NORTH'
  | 'OBLIQUE_SOUTH'
  | 'OBLIQUE_EAST'
  | 'OBLIQUE_WEST';

export type DefectType =
  | 'SOLDER_BRIDGE'
  | 'MISSING_COMPONENT'
  | 'TOMBSTONE'
  | 'POLARITY_REVERSED'
  | 'MISALIGNED'
  | 'INSUFFICIENT_SOLDER'
  | 'EXCESS_SOLDER'
  | 'LIFTED_LEAD'
  | 'OCV_ERROR'
  | 'SOLDER_BALL'
  | 'FOREIGN_OBJECT';

export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'PASS';

export type ReviewStatus = 'PENDING' | 'CONFIRMED_DEFECT' | 'FALSE_CALL' | 'REWORK_SENT' | 'REWORK_COMPLETED' | 'SCRAPPED';

export type LightingMode =
  | 'COMPOSITE_RGB'
  | 'TOP_WHITE_COAXIAL'
  | 'HIGH_ANGLE_RED'
  | 'MID_ANGLE_GREEN'
  | 'LOW_ANGLE_BLUE'
  | '3D_HEIGHT_MAP'
  | 'GOLDEN_DIFF';

export interface SolderJoint3D {
  padIndex: number;
  heightMicrons: number;
  targetHeightMicrons: number;
  volumePercentage: number;
  coplanarityMicrons: number;
  wettingAngleDeg: number;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'DEFECT';
}

export interface PCBComponent {
  id: string;
  refDes: string; // e.g. "U1", "C14", "R08", "D2", "Q3"
  packageType: string; // e.g. "0402", "0603", "QFN-32", "SOIC-8", "BGA-64", "SOT-23"
  nominalValue: string; // e.g. "10uF 25V", "STM32F401", "10k 1%"
  x: number; // mm or normalized coordinate
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  pinCount?: number;
  hasPolarity?: boolean;
  polarityMark?: 'DOT' | 'BAND' | 'NOTCH';
  solderJoints?: SolderJoint3D[];
  defect?: InspectionDefect;
}

export interface InspectionDefect {
  id: string;
  componentId: string;
  refDes: string;
  type: DefectType;
  severity: DefectSeverity;
  title: string;
  description: string;
  measuredOffset?: { x: number; y: number; theta: number };
  measuredSolderHeight?: number; // um
  standardLimit?: string;
  ipcClause?: string;
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewComment?: string;
  suggestedAction?: string;
  timestamp: string;
}

export interface PCBBoard {
  id: string;
  barcode: string;
  model: string;
  lotNumber: string;
  smtLine: string;
  side: 'TOP' | 'BOTTOM';
  dimensions: { widthMm: number; heightMm: number };
  status: 'PASS' | 'FAIL' | 'WARNING' | 'INSPECTING';
  tactTimeSec: number;
  inspectionTimestamp: string;
  components: PCBComponent[];
  defects: InspectionDefect[];
  fpyAtInspection: number;
  gerberLayers: {
    silkscreen: boolean;
    copperTraces: boolean;
    soldermask: boolean;
    pads: boolean;
    fiducials: boolean;
  };
}

export interface SMTLineStatus {
  id: string;
  name: string;
  description: string;
  currentModel: string;
  status: 'RUNNING' | 'PAUSED' | 'CHANGEOVER' | 'MAINTENANCE';
  targetPph: number; // Parts per hour
  currentPph: number;
  fpy: number; // First pass yield %
  totalInspected: number;
  totalPass: number;
  totalFail: number;
  tactTime: number; // seconds
  dpmO: number; // Defect per million opportunities
  activeDefectTrend: number[];
  oee?: number;
  operatorId?: string;
}

export interface SPCDataPoint {
  sampleIndex: number;
  timestamp: string;
  shiftX: number; // mm
  shiftY: number; // mm
  rotationTheta: number; // deg
  solderVolume: number; // %
  solderHeight: number; // um
  ucl: number;
  lcl: number;
  mean: number;
}

export interface InspectionRecipe {
  id: string;
  modelName: string;
  version: string;
  ipcClass: IPCClass;
  lightingPreset: {
    topCoaxial: number; // 0-100%
    highRed: number;
    midGreen: number;
    lowBlue: number;
  };
  algorithms: {
    solderBridgeThreshold: number; // 0-100
    missingPartContrast: number;
    tombstoneMaxAngleDeg: number;
    polarityMatchConfidence: number; // %
    placementToleranceMm: number;
    solderHeightMinUm: number;
    solderHeightMaxUm: number;
    coplanarityMaxUm: number;
  };
}

export interface AIRCAReport {
  reportTitle: string;
  d1Team: string[];
  d2ProblemDescription: string;
  d3ContainmentActions: string[];
  d4RootCauseAnalysis: {
    fishboneCategories: {
      machine: string;
      method: string;
      material: string;
      man: string;
      measurement: string;
    };
    fiveWhys: string[];
  };
  d5PermanentCorrectiveActions: string[];
  d6ImplementationAndValidation: string;
  d7PreventiveRecurrence: string[];
  d8TeamRecognition: string;
}

export interface AIDefectDiagnosis {
  ipcVerdict: string;
  ipcClause: string;
  rootCauseSMT: {
    primaryStage: string;
    technicalReason: string;
    contributingFactors: string[];
  };
  actionableCorrectiveActions: string[];
  opticalDetectionTuning: string;
  riskAssessment: string;
  reworkInstruction: string;
}

export interface FiducialMark {
  id: string;
  name: string;
  xMm: number;
  yMm: number;
  shape: 'ROUND' | 'CROSS' | 'SQUARE' | 'DIAMOND';
  diameterMm: number;
  found: boolean;
  score: number; // 0.00 - 1.00
  measuredOffset: { dxUm: number; dyUm: number };
}

export interface FOVScanStep {
  fovIndex: number;
  x: number;
  y: number;
  widthMm: number;
  heightMm: number;
  componentCount: number;
  scanTimeMs: number;
  status: 'PLANNED' | 'SCANNING' | 'DONE';
}

export interface WarpageMeshPoint {
  gridX: number;
  gridY: number;
  xMm: number;
  yMm: number;
  zOffsetUm: number; // e.g. -120 to +180 um
  status: 'FLAT' | 'WARPED_HIGH' | 'WARPED_LOW';
}

export interface ComponentStageInspection {
  stage: 'SPI' | 'PRE_REFLOW' | 'POST_REFLOW';
  stageName: string;
  timestamp: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  measurements: {
    solderVolumePct?: number;
    solderHeightUm?: number;
    solderAreaPct?: number;
    offsetXUm?: number;
    offsetYUm?: number;
    offsetThetaDeg?: number;
    wettingAngleDeg?: number;
    coplanarityUm?: number;
  };
  notes: string;
}

export interface AutoTeachingJob {
  boardModel: string;
  cadFile: string;
  totalComponents: number;
  teachingProgress: number; // 0-100
  fiducialsDetected: number;
  totalFiducials: number;
  fovCount: number;
  estimatedCycleTimeSec: number;
  goldenBoardSamples: number;
  autoTolerancesApplied: boolean;
}

export interface ReworkActionRecord {
  id: string;
  defectId: string;
  componentRefDes: string;
  operatorId: string;
  timestamp: string;
  standard: 'IPC-7711' | 'IPC-7721' | 'J-STD-001G';
  repairMethod: 'HOT_AIR_REFLOW' | 'MICRO_SOLDERING_IRON' | 'SOLDER_WICK_EXTRACT' | 'REPLACE_COMPONENT';
  temperatureC: number;
  solderAlloy: string;
  fluxType: string;
  reworkDurationSec: number;
  postInspectionStatus: 'PASS' | 'RE_INSPECT_PENDING' | 'FAIL';
  operatorNotes: string;
}

export interface DefectLearningRecord {
  id: string;
  timestamp: string;
  boardModel: string;
  componentRefDes: string;
  packageType: string;
  defectType: string;
  severity: string;
  disposition: 'CONFIRMED_DEFECT' | 'FALSE_CALL' | 'REWORK_COMPLETED';
  operatorId: string;
  operatorNotes?: string;
  opticalLighting: string;
  measuredMetrics: {
    solderHeightUm?: number;
    wettingAngleDeg?: number;
    leadCoplanarityUm?: number;
    solderVolumePct?: number;
    offsetX?: number;
    offsetY?: number;
    rotation?: number;
  };
  features: {
    glareIndex: number;
    edgeContrast: number;
    symmetryScore: number;
    rgbHueDominance: string;
  };
  aiConfidenceBefore: number;
  aiConfidenceAfter: number;
  trainingStatus: 'RECORDED' | 'QUEUED_FOR_TRAIN' | 'TRAINED_OPTIMIZED';
  trainingBatchId?: string;
}

export interface ActiveLearningStats {
  currentModelVersion: string;
  totalSamplesTrained: number;
  detectionRate: number;
  falseCallRate: number;
  escapeRatePpm: number;
  lastTrainedAt: string;
  weightsOptimized: Array<{
    parameter: string;
    oldVal: string | number;
    newVal: string | number;
    gain: string;
  }>;
}

// 3.1 Fleet Central Command Types
export interface LineOEEBreakdown {
  lineId: string;
  availabilityPct: number; // 가동률
  performancePct: number;  // 성능 효율
  qualityPct: number;      // 품질 직통율 (FPY)
  oeeTotalPct: number;     // Total OEE
  operatingMinutes: number;
  plannedDowntimeMin: number;
  unplannedDowntimeMin: number;
  targetCount: number;
  actualCount: number;
  defectCount: number;
  interlockStatus: 'NORMAL' | 'WARNING_PPM' | 'EMERGENCY_STOP';
  currentRecipeVersion: string;
}

export interface ShiftHandoverRecord {
  id: string;
  timestamp: string;
  outgoingShift: 'Shift A (Day: 08:00-20:00)' | 'Shift B (Night: 20:00-08:00)';
  incomingShift: 'Shift A (Day: 08:00-20:00)' | 'Shift B (Night: 20:00-08:00)';
  outgoingSupervisor: string;
  incomingSupervisor: string;
  lineId: string;
  boardModel: string;
  shiftProductionCount: number;
  shiftDefectCount: number;
  pendingReworkUnits: number;
  activeEquipmentAlerts: string[];
  maintenanceRemarks: string;
  signedOff: boolean;
}

// 3.2 Deep Anomaly Map & Golden Master Diff Types
export interface AnomalyRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  anomalyScore: number; // 0-100 (Patch-Core Anomaly Distance)
  category: 'FLUX_RESIDUE' | 'PCB_SCRATCH' | 'SOLDER_SPLATTER' | 'FOREIGN_OBJECT' | 'MASK_DISCOLORATION' | 'TRACE_MICROCRACK' | 'UNKNOWN_DEVIATION';
  severity: DefectSeverity;
  description: string;
  pixelDifferencePct: number;
  suggestedAction: string;
}

export interface GoldenDiffResult {
  boardId: string;
  model: string;
  referenceMasterId: string;
  overallMatchSimilarity: number; // e.g. 98.4%
  totalAnomaliesDetected: number;
  maxAnomalyScore: number;
  anomalyRegions: AnomalyRegion[];
  sensitivityParams: {
    noiseFilterSigma: number;
    thresholdCutoff: number;
    patchSize: number;
    colorDifferenceWeight: number;
  };
}

// 3.3 AI Auto-Threshold Optimizer Types
export interface ROCCurvePoint {
  thresholdIndex: number;
  falsePositiveRate: number; // 가성 불량률 (%)
  truePositiveRate: number;  // 진성 검출률 (%)
  fpySimulated: number;      // 시뮬레이션 FPY (%)
  escapeRiskPpm: number;     // 유출 불량 위험도 (PPM)
  isOptimalPoint?: boolean;
}

export interface ParameterOptimizationResult {
  paramKey: string;
  paramName: string;
  currentValue: number;
  recommendedValue: number;
  unit: string;
  targetToleranceRange: [number, number];
  fpyGainPct: number;
  falseCallReductionPct: number;
  confidenceScore: number;
  reasoning: string;
}

export interface AutoTuningRun {
  id: string;
  timestamp: string;
  modelName: string;
  sampleCount: number;
  status: 'IDLE' | 'OPTIMIZING' | 'COMPLETED';
  baselineFPY: number;
  optimizedFPY: number;
  baselineFalseCallRate: number;
  optimizedFalseCallRate: number;
  baselineEscapePpm: number;
  optimizedEscapePpm: number;
  aucScore: number;
  rocPoints: ROCCurvePoint[];
  parameters: ParameterOptimizationResult[];
}

// 3.4 SMT Equipment Predictive Maintenance (PdM) Telemetry Types
export interface NozzleHealthStatus {
  nozzleId: number;
  headSlot: string;
  currentVacuumKPa: number; // 정상: -85 ~ -95 kPa
  ratedVacuumKPa: number;
  pickupFailureCount24h: number;
  wearPercentage: number;
  remainingUsefulHours: number;
  status: 'HEALTHY' | 'WARNING' | 'REPLACE_REQUIRED';
  lastCleanedDate: string;
}

export interface SqueegeeHealthStatus {
  bladeId: string;
  printerId: string;
  currentPrintCycles: number;
  maxRatedCycles: number;
  bladeEdgeWearMm: number; // 마모 깊이
  leftRightPressureDeltaKg: number; // 좌우 압력 편차
  status: 'NORMAL' | 'CALIBRATION_NEEDED' | 'REPLACE_REQUIRED';
}

export interface ReflowZoneTelemetry {
  zoneIndex: number;
  zoneType: 'PREHEAT' | 'SOAK' | 'REFLOW' | 'COOLING';
  setpointTempC: number;
  actualTempC: number;
  tempDeltaC: number;
  heaterCurrentAmps: number;
  fanRpm: number;
  vibrationMmPerSec: number;
  degradationIndex: number; // 0-100%
  status: 'OPTIMAL' | 'DEGRADED' | 'OVERHEAT_ALERT';
}

export interface PdMAlertItem {
  id: string;
  equipmentType: 'MOUNTER_NOZZLE' | 'SPI_SQUEEGEE' | 'REFLOW_OVEN' | 'FEEDER_INDEXER';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  componentTag: string;
  estimatedRULHours: number;
  impactIfIgnored: string;
  prescribedAction: string;
  autoWorkOrderCreated: boolean;
}

// 3순위: 공정 검사 성적서 1-Click PDF 발행 (Inspection Quality Certificate / CoA)
export interface DefectBreakdownItem {
  category: string;
  count: number;
  percentage: number;
  ipcClause: string;
}

export interface CriticalDefectLogItem {
  refDes: string;
  defectType: string;
  measuredVal: string;
  specLimit: string;
  disposition: string;
}

export interface SolderJointSampleItem {
  pad: string;
  heightUm: number;
  volumePct: number;
  wettingAngleDeg: number;
  result: 'PASS' | 'WARN' | 'FAIL';
}

export interface InspectionCertificate {
  certificateNo: string;
  issueDate: string;
  lotNumber: string;
  productModel: string;
  smtLine: string;
  customerName: string;
  inspectorName: string;
  approverName: string;
  ipcClass: IPCClass;
  complianceStatus: 'PASSED_CERTIFIED' | 'CONDITIONAL_PASS' | 'REJECTED';
  totalInspected: number;
  totalPassed: number;
  totalFailed: number;
  fpyPercentage: number;
  cpkIndex: number;
  dpmo: number;
  defectBreakdown: DefectBreakdownItem[];
  criticalDefectLogs: CriticalDefectLogItem[];
  solderJointSamples: SolderJointSampleItem[];
  isoStandardCert: string;
  digitalSignatureHash: string;
  notes: string;
}

// 4순위: 멀티 앵글 / 조명 보정 골든 샘플 앙상블 (Multi-Angle & Multi-Lighting Golden Sample Ensemble)
export type EnsembleHDRFusionMode =
  | 'EXPOSURE_FUSION'
  | 'DIFFUSE_SPECULAR_SPLIT'
  | 'SHADOW_REMOVAL'
  | 'WETTING_CONTOUR';

export interface MultiAngleLightingConfig {
  coaxialWeight: number; // 0-100%
  highRedWeight: number; // 0-100%
  midGreenWeight: number; // 0-100%
  lowBlueWeight: number; // 0-100%
  obliqueQuadWeight: number; // 0-100%
  hdrFusionMode: EnsembleHDRFusionMode;
  polarizationFilter: boolean;
  antiGlareSuppressionPct: number;
}

export interface GoldenSampleBoardRecord {
  id: string;
  sampleNumber: number;
  capturedAt: string;
  snrDb: number;
  surfaceReflectanceVariance: number;
  coaxialLuma: number;
  ringLuma: number;
  status: 'ACTIVE_IN_ENSEMBLE' | 'OUTLIER_REJECTED' | 'PENDING_REGISTRATION';
}

export interface EnsembleCalibrationState {
  totalGoldenSamples: number;
  confidenceCoverage: number;
  glareArtifactReductionPct: number;
  solderEdgeGradientGainPct: number;
  currentAngle: CameraAngle | 'ENSEMBLE_HDR';
  lightingConfig: MultiAngleLightingConfig;
  samples: GoldenSampleBoardRecord[];
}



