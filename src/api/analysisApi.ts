const ANALYSES_URL = 'http://localhost:5000/api/analyses';
const UPLOAD_ANALYSIS_URL = `${ANALYSES_URL}/upload`;

export type Analysis = {
  _id: string;
  patientLabel: string;
  imageName: string;
  imageUrl: string;
  success: boolean;
  severity: string;
  pta: number;
  confidence: string;
  summary: string;
  recommendation: string;
  disclaimer: string;
  createdAt: string;
  updatedAt: string;
};

export async function getAnalyses(): Promise<Analysis[]> {
  const response = await fetch(ANALYSES_URL);

  if (!response.ok) {
    throw new Error('Analyses ophalen mislukt');
  }

  return response.json();
}

export type AudiogramUpload = {
  uri: string;
  name: string;
  type: string;
  patientLabel: string;
};

export async function uploadAudiogramAnalysis(upload: AudiogramUpload): Promise<Analysis> {
  const formData = new FormData();

  formData.append('audiogram', {
    uri: upload.uri,
    name: upload.name,
    type: upload.type,
  } as unknown as Blob);
  formData.append('patientLabel', upload.patientLabel);

  const response = await fetch(UPLOAD_ANALYSIS_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Audiogram uploaden mislukt');
  }

  const analysis = (await response.json()) as Partial<Analysis>;

  if (
    !analysis._id ||
    !analysis.patientLabel ||
    !analysis.imageUrl ||
    !analysis.severity ||
    typeof analysis.pta !== 'number' ||
    typeof analysis.confidence !== 'string' ||
    typeof analysis.summary !== 'string' ||
    typeof analysis.recommendation !== 'string' ||
    typeof analysis.disclaimer !== 'string'
  ) {
    throw new Error('Ongeldig analyseresultaat ontvangen');
  }

  return analysis as Analysis;
}
