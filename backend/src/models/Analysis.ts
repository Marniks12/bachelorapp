import { Schema, model } from 'mongoose';

export type AnalysisDocument = {
  patientLabel: string;
  imageName: string;
  severity: string;
  pta: number;
  recommendation: string;
  disclaimer: string;
  createdAt: Date;
  updatedAt: Date;
};

const analysisSchema = new Schema<AnalysisDocument>(
  {
    patientLabel: {
      type: String,
      required: true,
      trim: true,
    },
    imageName: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      required: true,
    },
    pta: {
      type: Number,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    disclaimer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Analysis = model<AnalysisDocument>('Analysis', analysisSchema);
