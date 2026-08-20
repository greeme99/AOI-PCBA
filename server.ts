import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AOI-PCBA Intelligence Engine",
    version: "2.4.0-PROD",
  });
});

// AI Defect Analysis & IPC-A-610 Compliance Evaluation
app.post("/api/gemini/analyze-defect", async (req, res) => {
  try {
    const { defect, component, pcbInfo, ipcClass = "Class 3 (High Reliability / Automotive)" } = req.body;

    const prompt = `
You are an expert PCBA Quality & SMT Process Senior Engineer specializing in 3D AOI (Automated Optical Inspection) and IPC-A-610 standards.
Analyze the following PCBA inspection defect:

[PCB Information]
- Board Model: ${pcbInfo?.model || "ECU-MAIN-V3"}
- SMT Line: ${pcbInfo?.smtLine || "Line 2 - Auto SMT"}
- PCB Side: ${pcbInfo?.side || "TOP Layer"}
- Target IPC Standard: ${ipcClass}

[Defect Information]
- Component RefDes: ${component?.refDes || "U4 / C12"}
- Package Type: ${component?.packageType || "QFN-32 / 0402"}
- Defect Category: ${defect?.type || "Solder Bridge"}
- Severity: ${defect?.severity || "Critical"}
- Measured Values: Offset X=${defect?.offsetX || "0.12"}mm, Y=${defect?.offsetY || "-0.05"}mm, Rotation=${defect?.rotation || "4.2"}deg, Solder Height=${defect?.solderHeight || "35"}um (Ref: 90-120um)
- Optical Detection Details: ${defect?.description || "Solder bridge detected between pins 14 and 15, bridge thickness 85um."}

Please provide a structured, highly actionable engineering analysis in JSON format:
{
  "ipcVerdict": "Defect (Reject) / Process Indicator / Acceptable",
  "ipcClause": "IPC-A-610 Rev H Clause reference (e.g., 7.3.5.1 Solder Bridging)",
  "rootCauseSMT": {
    "primaryStage": "Solder Paste Printing | Pick & Place Mounter | Reflow Soldering | PCB Fabrication",
    "technicalReason": "Precise mechanical/thermal/chemical cause",
    "contributingFactors": ["Factor 1", "Factor 2", "Factor 3"]
  },
  "actionableCorrectiveActions": [
    "Immediate operator action",
    "Process parameter adjustment",
    "Preventive maintenance action"
  ],
  "opticalDetectionTuning": "Recommended AOI lighting (RGB/3D Structured Light/Coaxial) and threshold parameter adjustment to reduce false calls or escape rate",
  "riskAssessment": "Risk level on functional reliability (e.g., electrical short circuit, thermal stress failure, field vibration risk)",
  "reworkInstruction": "Step-by-step IPC-7711/7721 approved rework/repair guidance"
}
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are the lead AOI & SMT Process Principal Engineer. Return strict valid JSON with deeply technical, authentic PCB manufacturing domain insight.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error analyzing defect with Gemini:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze defect with AI",
    });
  }
});

// AI 8D Root Cause & Quality Audit Report Generation
app.post("/api/gemini/rca-report", async (req, res) => {
  try {
    const { batchInfo, defectsList, spcMetrics } = req.body;

    const prompt = `
Generate a comprehensive 8D Quality Investigation Report for the following SMT PCBA production lot:

Batch ID: ${batchInfo?.batchId || "LOT-20260818-B2"}
Product: ${batchInfo?.productName || "Automotive ADAS Sensor Board REV 4.2"}
Total Inspected: ${batchInfo?.inspectedCount || 1250} units
Passed: ${batchInfo?.passedCount || 1218} units
Failed: ${batchInfo?.failedCount || 32} units
Current FPY (First Pass Yield): ${batchInfo?.fpy || "97.44%"} (Target: >= 99.2%)
Top Defect Modes: ${JSON.stringify(defectsList || [])}
Process SPC Capability: Cpk=${spcMetrics?.cpk || "1.12"} (Target: >= 1.67)

Please generate an exhaustive, professional 8D problem-solving report in JSON format with keys:
{
  "reportTitle": "Title",
  "d1Team": ["Role 1", "Role 2", "Role 3"],
  "d2ProblemDescription": "5W2H description of the quality deviation",
  "d3ContainmentActions": ["Action 1", "Action 2"],
  "d4RootCauseAnalysis": {
    "fishboneCategories": {
      "machine": "SMT mounter & screen printer analysis",
      "method": "Reflow profile & stencil wipe cycle",
      "material": "Solder paste flux activity & component lead oxidation",
      "man": "Feeder setup & reel splicing handling",
      "measurement": "3D AOI algorithm calibration & lighting angle"
    },
    "fiveWhys": ["Why 1...", "Why 2...", "Why 3...", "Why 4...", "Why 5 (Root Cause)..."]
  },
  "d5PermanentCorrectiveActions": ["Action 1", "Action 2", "Action 3"],
  "d6ImplementationAndValidation": "Validation plan with statistical sample size and Cpk target",
  "d7PreventiveRecurrence": ["Lesson learned 1", "Lesson learned 2"],
  "d8TeamRecognition": "Summary conclusion and sign-off"
}
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, report: parsed });
  } catch (error: any) {
    console.error("Error generating RCA report:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate RCA report",
    });
  }
});

// Interactive AI Quality Copilot Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;

    const chatHistory = (messages || []).map((m: any) => `${m.role === "user" ? "User" : "AOI Assistant"}: ${m.content}`).join("\n");
    const systemContext = `
You are the AI Intelligence Engine embedded inside the AOI-PCBA (Automated Optical Inspection for Printed Circuit Board Assembly) system.
You are an expert on:
1. SMT Manufacturing Processes (Screen Printer, SPI, Chip Mounter, Reflow Oven, Pre/Post-reflow AOI, Wave Soldering, Selective Soldering).
2. IPC-A-610 Rev G/H & J-STD-001 Standards (Class 1, Class 2, Class 3 requirements).
3. 3D AOI Optical Algorithms (Multi-frequency Moiré phase profilometry, 3-tier RGB illumination, Coaxial Light, OCV/OCR, Solder Fillet Meniscus analysis).
4. SMT Defect Troubleshooting: Solder bridging, Tombstoning/Manhattan effect, Solder balling, Voids, Insufficient solder, Misalignment, Component Polarity, IC pin coplanarity.
5. SPC & Six Sigma: Cp, Cpk, X-bar & R charts, Western Electric rules, Defect Pareto, DPMO.

Context of current live station:
- Active PCB: ${context?.activeBoard || "Automotive Control Unit (ECU-2026-X)"}
- Current SMT Line: ${context?.smtLine || "Line 1 - High Precision Line"}
- Active Defect Count: ${context?.defectCount || 3}
- Current FPY: ${context?.fpy || "98.2%"}

Answer the user's question directly with concise, practical engineering expertise, clear formatting, and standard SMT terminology.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `${systemContext}\n\nConversation history:\n${chatHistory}\n\nUser: ${(messages || []).slice(-1)[0]?.content || "Help"}\nAOI Assistant:`,
    });

    res.json({
      success: true,
      reply: response.text || "No response generated.",
    });
  } catch (error: any) {
    console.error("Error in AI Copilot Chat:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat query",
    });
  }
});

// ==========================================
// Defect Learning DB & Active Learning Store
// ==========================================
interface DefectDBRecord {
  id: string;
  timestamp: string;
  boardModel: string;
  componentRefDes: string;
  packageType: string;
  defectType: string;
  severity: string;
  disposition: "CONFIRMED_DEFECT" | "FALSE_CALL" | "REWORK_COMPLETED";
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
  trainingStatus: "RECORDED" | "QUEUED_FOR_TRAIN" | "TRAINED_OPTIMIZED";
  trainingBatchId?: string;
}

// Initial seed records for Defect Learning DB
const defectLearningDB: DefectDBRecord[] = [
  {
    id: "TRN-20260818-001",
    timestamp: "2026-08-18T18:30:00.000Z",
    boardModel: "ECU-2026-AUTO",
    componentRefDes: "U1",
    packageType: "QFP-64",
    defectType: "SOLDER_BRIDGE",
    severity: "CRITICAL",
    disposition: "CONFIRMED_DEFECT",
    operatorId: "OP-441",
    operatorNotes: "Pins 22-23 bridged by excess solder past paste mask boundary.",
    opticalLighting: "HIGH_ANGLE_RED + COMPOSITE_RGB",
    measuredMetrics: {
      solderHeightUm: 195,
      wettingAngleDeg: 112,
      leadCoplanarityUm: 22,
      solderVolumePct: 240,
      offsetX: 0.02,
      offsetY: -0.01,
      rotation: 0.1,
    },
    features: {
      glareIndex: 0.88,
      edgeContrast: 0.94,
      symmetryScore: 0.31,
      rgbHueDominance: "RED_HIGH_ANGLE",
    },
    aiConfidenceBefore: 0.82,
    aiConfidenceAfter: 0.99,
    trainingStatus: "TRAINED_OPTIMIZED",
    trainingBatchId: "BATCH-V2.1-ACTIVE",
  },
  {
    id: "TRN-20260818-002",
    timestamp: "2026-08-18T19:10:00.000Z",
    boardModel: "ECU-2026-AUTO",
    componentRefDes: "C14",
    packageType: "0603",
    defectType: "TOMBSTONE",
    severity: "CRITICAL",
    disposition: "CONFIRMED_DEFECT",
    operatorId: "OP-441",
    operatorNotes: "Component completely lifted on negative terminal during reflow.",
    opticalLighting: "3D_HEIGHT_MAP",
    measuredMetrics: {
      solderHeightUm: 380,
      wettingAngleDeg: 145,
      leadCoplanarityUm: 190,
      solderVolumePct: 65,
      offsetX: 0.15,
      offsetY: 0.32,
      rotation: 18.5,
    },
    features: {
      glareIndex: 0.42,
      edgeContrast: 0.98,
      symmetryScore: 0.12,
      rgbHueDominance: "MULTI_TIER_MOIRE",
    },
    aiConfidenceBefore: 0.78,
    aiConfidenceAfter: 0.98,
    trainingStatus: "TRAINED_OPTIMIZED",
    trainingBatchId: "BATCH-V2.1-ACTIVE",
  },
  {
    id: "TRN-20260818-003",
    timestamp: "2026-08-18T19:45:00.000Z",
    boardModel: "ECU-2026-AUTO",
    componentRefDes: "R08",
    packageType: "0402",
    defectType: "INSUFFICIENT_SOLDER",
    severity: "MINOR",
    disposition: "FALSE_CALL",
    operatorId: "OP-312",
    operatorNotes: "Classified as false alarm. Meniscus is concave and meets Class 3 130um height.",
    opticalLighting: "TOP_WHITE_COAXIAL",
    measuredMetrics: {
      solderHeightUm: 128,
      wettingAngleDeg: 41,
      leadCoplanarityUm: 14,
      solderVolumePct: 98,
      offsetX: 0.01,
      offsetY: 0.01,
      rotation: 0.2,
    },
    features: {
      glareIndex: 0.92,
      edgeContrast: 0.76,
      symmetryScore: 0.89,
      rgbHueDominance: "COAXIAL_WHITE",
    },
    aiConfidenceBefore: 0.65,
    aiConfidenceAfter: 0.97,
    trainingStatus: "TRAINED_OPTIMIZED",
    trainingBatchId: "BATCH-V2.1-ACTIVE",
  },
];

// Active Learning Model Metrics State
let modelMetrics = {
  currentModelVersion: "AOI-Vision-Core-v2.5.4",
  totalSamplesTrained: defectLearningDB.length,
  detectionRate: 99.42, // %
  falseCallRate: 0.38, // %
  escapeRatePpm: 12, // PPM
  lastTrainedAt: new Date().toISOString(),
  weightsOptimized: [
    { parameter: "QFP_Lead_Bridge_Threshold", oldVal: 0.65, newVal: 0.88, gain: "+23%" },
    { parameter: "0402_Flux_Glare_Suppression", oldVal: 0.45, newVal: 0.92, gain: "+47%" },
    { parameter: "BGA_Coplanarity_Z_Weight", oldVal: 0.55, newVal: 0.85, gain: "+30%" },
    { parameter: "Tombstone_Tilt_Angle_Cutoff", oldVal: "12 deg", newVal: "8.5 deg", gain: "+29%" },
  ],
};

// 1. Record new defect into Learning DB automatically
app.post("/api/defect-db/record", (req, res) => {
  try {
    const {
      boardModel,
      componentRefDes,
      packageType,
      defectType,
      severity,
      disposition,
      operatorId,
      operatorNotes,
      opticalLighting,
      measuredMetrics,
    } = req.body;

    const newRecord: DefectDBRecord = {
      id: `TRN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      boardModel: boardModel || "ECU-2026-AUTO",
      componentRefDes: componentRefDes || "COMP",
      packageType: packageType || "SMD",
      defectType: defectType || "SOLDER_DEFECT",
      severity: severity || "MAJOR",
      disposition: disposition || "CONFIRMED_DEFECT",
      operatorId: operatorId || "OPERATOR-AUTO",
      operatorNotes: operatorNotes || "Auto-logged from AOI Review Station disposition.",
      opticalLighting: opticalLighting || "COMPOSITE_RGB",
      measuredMetrics: measuredMetrics || {
        solderHeightUm: 140,
        wettingAngleDeg: 55,
        leadCoplanarityUm: 20,
        solderVolumePct: 110,
      },
      features: {
        glareIndex: Number((Math.random() * 0.4 + 0.5).toFixed(2)),
        edgeContrast: Number((Math.random() * 0.3 + 0.7).toFixed(2)),
        symmetryScore: disposition === "FALSE_CALL" ? 0.85 : 0.28,
        rgbHueDominance: opticalLighting || "COMPOSITE_RGB",
      },
      aiConfidenceBefore: Number((Math.random() * 0.2 + 0.75).toFixed(2)),
      aiConfidenceAfter: Number((Math.random() * 0.05 + 0.94).toFixed(2)),
      trainingStatus: "RECORDED",
    };

    defectLearningDB.unshift(newRecord);
    modelMetrics.totalSamplesTrained = defectLearningDB.length;

    res.json({
      success: true,
      message: "Defect sample successfully registered to AI Learning DB.",
      record: newRecord,
      totalCount: defectLearningDB.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Fetch all learned defect records
app.get("/api/defect-db/list", (req, res) => {
  const { disposition, defectType, search } = req.query;

  let filtered = [...defectLearningDB];

  if (disposition && disposition !== "ALL") {
    filtered = filtered.filter((r) => r.disposition === disposition);
  }
  if (defectType && defectType !== "ALL") {
    filtered = filtered.filter((r) => r.defectType === defectType);
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.componentRefDes.toLowerCase().includes(q) ||
        r.packageType.toLowerCase().includes(q) ||
        r.defectType.toLowerCase().includes(q) ||
        r.operatorNotes?.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    records: filtered,
    totalRecords: defectLearningDB.length,
    metrics: modelMetrics,
  });
});

// 3. Trigger Active Learning Re-Training and Detection Power Optimization
app.post("/api/defect-db/train-feedback", async (_req, res) => {
  try {
    const unTrainedCount = defectLearningDB.filter((r) => r.trainingStatus === "RECORDED").length;

    // Simulate batch optimization
    defectLearningDB.forEach((r) => {
      if (r.trainingStatus === "RECORDED") {
        r.trainingStatus = "TRAINED_OPTIMIZED";
        r.trainingBatchId = `BATCH-${new Date().toISOString().slice(0, 10)}`;
        r.aiConfidenceAfter = Math.min(0.995, r.aiConfidenceBefore + 0.15);
      }
    });

    const newDetectionRate = Math.min(99.95, Number((modelMetrics.detectionRate + 0.08).toFixed(2)));
    const newFalseCallRate = Math.max(0.12, Number((modelMetrics.falseCallRate - 0.05).toFixed(2)));
    const newEscapePpm = Math.max(2, modelMetrics.escapeRatePpm - 2);

    modelMetrics = {
      ...modelMetrics,
      currentModelVersion: `AOI-Vision-Core-v2.${Math.floor(Date.now() / 100000 % 100)}`,
      totalSamplesTrained: defectLearningDB.length,
      detectionRate: newDetectionRate,
      falseCallRate: newFalseCallRate,
      escapeRatePpm: newEscapePpm,
      lastTrainedAt: new Date().toISOString(),
      weightsOptimized: [
        { parameter: "QFP_Lead_Bridge_Threshold", oldVal: 0.88, newVal: 0.94, gain: "+6.8%" },
        { parameter: "0402_Flux_Glare_Suppression", oldVal: 0.92, newVal: 0.97, gain: "+5.4%" },
        { parameter: "BGA_Coplanarity_Z_Weight", oldVal: 0.85, newVal: 0.93, gain: "+9.4%" },
        { parameter: "Tombstone_Tilt_Angle_Cutoff", oldVal: "8.5 deg", newVal: "6.2 deg", gain: "+27.1%" },
      ],
    };

    res.json({
      success: true,
      message: `Active Learning completed: ${unTrainedCount} new samples assimilated into Vision Core.`,
      metrics: modelMetrics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Export Training Dataset for external AI fine-tuning (COCO / YOLO / CSV format)
app.get("/api/defect-db/export", (req, res) => {
  const format = req.query.format || "json";

  if (format === "coco") {
    const cocoDataset = {
      info: {
        description: "AOI-PCBA Defect & False Call Training Dataset",
        version: "2.5",
        year: 2026,
        contributor: "Smart AOI Closed-Loop System",
      },
      categories: [
        { id: 1, name: "SOLDER_BRIDGE" },
        { id: 2, name: "TOMBSTONE" },
        { id: 3, name: "MISSING_COMPONENT" },
        { id: 4, name: "FALSE_CALL_GLARE" },
        { id: 5, name: "POLARITY_REVERSED" },
      ],
      annotations: defectLearningDB.map((r, idx) => ({
        id: idx + 1,
        image_id: r.id,
        category: r.defectType,
        disposition: r.disposition,
        metrics: r.measuredMetrics,
        features: r.features,
      })),
    };
    return res.json(cocoDataset);
  }

  res.json({
    success: true,
    totalRecords: defectLearningDB.length,
    dataset: defectLearningDB,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AOI-PCBA Intelligence Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
