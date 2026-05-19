const API_BASE_URL = "http://10.68.247.13:5000";

export type Analysis = {
  _id: string;
  patientLabel: string;
  imageName: string;
  severity: string;
  pta: number;
  recommendation: string;
  disclaimer: string;
  createdAt: string;
  updatedAt: string;
};

export async function getAnalyses(): Promise<Analysis[]> {
  const response = await fetch(`${API_BASE_URL}/api/analyses`);

  if (!response.ok) {
    throw new Error("Analyses ophalen mislukt");
  }

  return response.json();
}

export async function createAnalysis(): Promise<Analysis> {
  const response = await fetch(`${API_BASE_URL}/api/analyses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientLabel: "Emma",
      imageName: "audiogram.png",
    }),
  });

  if (!response.ok) {
    throw new Error("Analyse aanmaken mislukt");
  }

  return response.json();
}
