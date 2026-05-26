import { API_BASE_URL } from '../config/api';

const ANALYSES_URL = `${API_BASE_URL}/api/analyses`;
const UPLOAD_ANALYSIS_URL = `${API_BASE_URL}/api/analyses/upload`;

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
  console.log('API_BASE_URL', API_BASE_URL);

  const response = await fetch(ANALYSES_URL);

  if (!response.ok) {
    throw new Error('Analyses ophalen mislukt');
  }

  return response.json();
}

export type AudiogramUpload = {
  uri: string;
  patientLabel: string;
};

export async function uploadAudiogramAnalysis(upload: AudiogramUpload): Promise<Analysis> {
  console.log('API_BASE_URL', API_BASE_URL);
  console.log('selected image uri', upload.uri);

  const imageResponse = await fetch(upload.uri);
  const blob = await imageResponse.blob();

  console.log('blob type', blob.type);
  console.log('blob size', blob.size);

  const formData = new FormData();

  formData.append('audiogram', blob, 'audiogram.jpg');
  formData.append('patientLabel', 'Emma');

  const response = await fetch(UPLOAD_ANALYSIS_URL, {
    method: 'POST',
    body: formData,
  });

  const responseBody = await response.text();

  console.log('upload response status', response.status);
  console.log('upload response body', responseBody);

  if (!response.ok) {
    throw new Error(getResponseMessage(responseBody) ?? 'Audiogram uploaden mislukt');
  }

  const analysis = JSON.parse(responseBody) as Partial<Analysis>;

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

function getResponseMessage(responseBody: string): string | null {
  if (!responseBody.trim()) {
    return null;
  }

  try {
    const payload = JSON.parse(responseBody) as { message?: unknown; error?: unknown };
    const message = typeof payload.message === 'string' ? payload.message : payload.error;

    return typeof message === 'string' && message.trim() ? message : responseBody;
  } catch {
    return responseBody;
  }
}
