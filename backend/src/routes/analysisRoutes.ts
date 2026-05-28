import { Router } from 'express';
import multer from 'multer';

import { cloudinary } from '../config/cloudinary';
import { requireAuth } from '../middleware/authMiddleware';
import { Analysis } from '../models/Analysis';

export const analysisRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadAudiogram = upload.single('audiogram');

type AnalysisResult = {
  success: boolean;
  severity: string;
  pta: number;
  confidence: string;
  summary: string;
  recommendation: string;
  disclaimer: string;
};

const fallbackAnalysisResult: AnalysisResult = {
  success: false,
  severity: 'Analyse mislukt',
  pta: 0,
  confidence: 'laag',
  summary: 'De AI-analyse kon niet worden voltooid.',
  recommendation: 'Neem contact op met een audioloog voor professionele analyse.',
  disclaimer: 'Deze analyse is automatisch gegenereerd en vormt geen medische diagnose.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return !Array.isArray(value);
}

function normalizeN8nPayload(value: unknown): Record<string, unknown> | null {
  const result = Array.isArray(value) ? value[0] : value;

  if (!isRecord(result) || typeof result.severity !== 'string') {
    return null;
  }

  return result;
}

function toAnalysisResult(result: Record<string, unknown>): AnalysisResult {
  return {
    success: typeof result.success === 'boolean' ? result.success : true,
    severity: result.severity as string,
    pta: typeof result.pta === 'number' ? result.pta : 0,
    confidence: typeof result.confidence === 'string' ? result.confidence : '',
    summary: typeof result.summary === 'string' ? result.summary : '',
    recommendation: typeof result.recommendation === 'string' ? result.recommendation : '',
    disclaimer:
      typeof result.disclaimer === 'string'
        ? result.disclaimer
        : 'Deze analyse is automatisch gegenereerd en vormt geen medische diagnose.',
  };
}

function getN8nWebhookUrl(): string | null {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return null;
  }

  if (webhookUrl.includes('/webhook-test/')) {
    const productionWebhookUrl = webhookUrl.replace('/webhook-test/', '/webhook/');
    console.warn('N8N_WEBHOOK_URL contains /webhook-test/; using production webhook URL instead');
    return productionWebhookUrl;
  }

  return webhookUrl;
}

async function requestN8nAnalysis(
  patientLabel: string,
  imageName: string,
  imageUrl: string,
): Promise<AnalysisResult> {
  const webhookUrl = getN8nWebhookUrl();
  const payload = {
    patientLabel,
    imageUrl,
    imageName,
  };

  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL is missing; using fallback analysis');
    return { ...fallbackAnalysisResult };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let parsedResponse: unknown;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (error) {
      console.warn('n8n response is not JSON; using fallback analysis', error);
      return { ...fallbackAnalysisResult };
    }

    const normalizedResult = normalizeN8nPayload(parsedResponse);

    if (!normalizedResult) {
      console.warn('n8n analysis response does not contain severity; using fallback analysis');
      return { ...fallbackAnalysisResult };
    }

    return toAnalysisResult(normalizedResult);
  } catch (error) {
    console.warn('n8n analysis failed; using fallback analysis', error);
    return { ...fallbackAnalysisResult };
  }
}

function uploadAudiogramToCloudinary(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'sonaris/audiograms',
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error('Cloudinary upload did not return a secure_url'));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
}

analysisRouter.post(
  '/upload',
  requireAuth,
  (req, res, next) => {
    uploadAudiogram(req, res, (error) => {
      if (error) {
        res.status(400).json({ message: 'Geen audiogram bestand ontvangen' });
        return;
      }

      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'Geen audiogram bestand ontvangen' });
      return;
    }

    try {
      const patientLabel =
        typeof req.body.patientLabel === 'string' && req.body.patientLabel.trim()
          ? req.body.patientLabel.trim()
          : req.user?.name || 'Mijn analyse';
      const imageUrl = await uploadAudiogramToCloudinary(req.file);
      const analysisResult = await requestN8nAnalysis(patientLabel, req.file.originalname, imageUrl);

      const analysis = await Analysis.create({
        userId: req.user!._id,
        patientLabel,
        imageName: req.file.originalname,
        imageUrl,
        ...analysisResult,
      });

      res.status(201).json(analysis);
    } catch (error) {
      console.error('Upload analysis flow failed', error);
      res.status(500).json({ message: 'Upload naar Cloudinary mislukt' });
    }
  },
);

analysisRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const { patientLabel, imageName } = req.body as {
      patientLabel?: string;
      imageName?: string;
    };

    if (!patientLabel || !imageName) {
      res.status(400).json({ message: 'patientLabel and imageName are required' });
      return;
    }

    const analysis = await Analysis.create({
      userId: req.user!._id,
      patientLabel,
      imageName,
      success: true,
      severity: 'Ernstige hoorverlies',
      pta: 67,
      confidence: 'hoog',
      summary: 'Demo-analyse op basis van het opgegeven audiogram.',
      recommendation: 'Verdere evaluatie door audioloog of NKO-arts aanbevolen.',
      disclaimer: 'Deze analyse is een demo en geen medische diagnose.',
    });

    res.status(201).json(analysis);
  } catch (error) {
    next(error);
  }
});

analysisRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    next(error);
  }
});
