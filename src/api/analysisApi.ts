const ANALYSES_URL = 'http://localhost:5000/api/analyses';

export type Analysis = {
  _id: string;
  patientLabel: string;
  imageName: string;
  success: boolean;
  severity: string;
  pta: number;
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

export async function createDemoAnalysis(): Promise<Analysis> {
  const response = await fetch(ANALYSES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientLabel: 'Emma',
      imageName: 'audiogram-demo.png',
    }),
  });

  if (!response.ok) {
    throw new Error('Analyse aanmaken mislukt');
  }

  return response.json();
}
