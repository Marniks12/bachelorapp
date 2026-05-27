import { API_BASE_URL } from '../config/api';
import { clearStoredAuth, getAuthToken } from '../context/AuthContext';
import { getToken } from '../utils/authStorage';

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
  const token = await getStoredAuthToken();

  if (!token) {
    throw new Error('Authenticatie vereist');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(ANALYSES_URL, {
    method: 'GET',
    headers,
  });

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(getResponseMessage(responseBody) ?? 'Analyses ophalen mislukt');
  }

  return JSON.parse(responseBody) as Analysis[];
}

export type AudiogramUpload = {
  uri: string;
  patientLabel: string;
};

export async function uploadAudiogramAnalysis(upload: AudiogramUpload): Promise<Analysis> {
  const imageResponse = await fetch(upload.uri);
  const blob = await imageResponse.blob();

  const formData = new FormData();

  formData.append('audiogram', blob, 'audiogram.jpg');
  formData.append('patientLabel', upload.patientLabel);

  const response = await fetch(UPLOAD_ANALYSIS_URL, {
    method: 'POST',
    headers: await getProtectedHeaders(),
    body: formData,
  });

  const responseBody = await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      await clearStoredAuth();
      throw new Error('Sessie verlopen. Log opnieuw in.');
    }

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

export async function checkBackendHealth(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/health`);

  return response.ok;
}

async function getProtectedHeaders(): Promise<Record<string, string>> {
  const token = await getStoredAuthToken();

  if (!token) {
    await clearStoredAuth();
    throw new Error('Authenticatie vereist');
  }

  return { Authorization: `Bearer ${token}` };
}

async function getStoredAuthToken(): Promise<string | null> {
  const contextToken = await getAuthToken();
  const browserToken =
    typeof window !== 'undefined' ? window.localStorage.getItem('sonaris_auth_token') : null;

  return contextToken ?? browserToken ?? (await getToken());
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
