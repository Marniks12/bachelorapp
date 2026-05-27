import { Schema, Types, model } from 'mongoose';

export type AnalysisDocument = {
  userId: Types.ObjectId;
  patientLabel: string;
  imageName: string;
  imageUrl?: string;
  success: boolean;
  severity: string;
  pta: number;
  confidence: string;
  summary: string;
  recommendation: string;
  disclaimer: string;
  createdAt: Date;
  updatedAt: Date;
};

const analysisSchema = new Schema<AnalysisDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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
    imageUrl: {
      type: String,
      trim: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
    pta: {
      type: Number,
      required: true,
    },
    confidence: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
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
