import { Router } from 'express';
import multer from 'multer';

import { cloudinary } from '../config/cloudinary';
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

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Partial<AnalysisResult>;

  return (
    typeof result.success === 'boolean' &&
    typeof result.severity === 'string' &&
    typeof result.pta === 'number' &&
    typeof result.confidence === 'string' &&
    typeof result.summary === 'string' &&
    typeof result.recommendation === 'string' &&
    typeof result.disclaimer === 'string'
  );
}

async function requestN8nAnalysis(
  patientLabel: string,
  imageName: string,
  imageUrl: string,
): Promise<AnalysisResult> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

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
      body: JSON.stringify({
        patientLabel,
        imageUrl,
        imageName,
      }),
    });

    if (!response.ok) {
      console.warn(`n8n analysis failed with status ${response.status}; using fallback analysis`);
      return { ...fallbackAnalysisResult };
    }

    const result: unknown = await response.json();

    if (!isAnalysisResult(result)) {
      console.warn('n8n analysis returned an unexpected payload; using fallback analysis');
      return { ...fallbackAnalysisResult };
    }

    console.log('n8n analysis succeeded');
    return result;
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

        console.log('Cloudinary upload succeeded');
        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
}

analysisRouter.post(
  '/upload',
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
      const imageUrl = await uploadAudiogramToCloudinary(req.file);
      const analysisResult = await requestN8nAnalysis('Emma', req.file.originalname, imageUrl);

      const analysis = await Analysis.create({
        patientLabel: 'Emma',
        imageName: req.file.originalname,
        imageUrl,
        ...analysisResult,
      });

      console.log('analysis saved to MongoDB');
      res.status(201).json(analysis);
    } catch (error) {
      console.error('Upload analysis flow failed', error);
      res.status(500).json({ message: 'Upload naar Cloudinary mislukt' });
    }
  },
);

analysisRouter.post('/', async (req, res, next) => {
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

analysisRouter.get('/', async (_req, res, next) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    next(error);
  }
});
