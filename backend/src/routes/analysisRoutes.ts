import { Router } from 'express';

import { Analysis } from '../models/Analysis';

export const analysisRouter = Router();

analysisRouter.post('/', async (req, res, next) => {
  try {
    const { patientLabel, imageName } = req.body as {
      patientLabel?: string;
      imageName?: string;
    };

    const analysis = await Analysis.create({
      patientLabel,
      imageName,
      severity: 'Ernstige hoorverlies',
      pta: 67,
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
