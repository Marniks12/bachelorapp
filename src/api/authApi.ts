const AUTH_API_BASE_URL = 'https://bachelorapp.onrender.com';

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

async function parseAuthResponse(response: Response): Promise<AuthResponse> {
  const responseBody = await response.text();

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Er bestaat al een account met dit e-mailadres');
    }

    if (response.status === 401) {
      throw new Error('Sessie verlopen. Log opnieuw in.');
    }

    throw new Error(getResponseMessage(responseBody) ?? 'Authenticatie mislukt');
  }

  const payload = JSON.parse(responseBody) as Partial<AuthResponse>;

  if (!payload.token || !payload.user?._id || !payload.user.email || !payload.user.name) {
    throw new Error('Ongeldig authenticatieantwoord ontvangen');
  }

  return payload as AuthResponse;
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const auth = await parseAuthResponse(response);
  return auth;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const auth = await parseAuthResponse(response);
  return auth;
}

function getResponseMessage(responseBody: string): string | null {
  if (!responseBody.trim()) {
    return null;
  }

  try {
    const payload = JSON.parse(responseBody) as { message?: unknown; error?: unknown };
    const message = typeof payload.message === 'string' ? payload.message : payload.error;

    return normalizeAuthErrorMessage(typeof message === 'string' && message.trim() ? message : responseBody);
  } catch {
    return normalizeAuthErrorMessage(responseBody);
  }
}

function normalizeAuthErrorMessage(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('token') || normalizedMessage.includes('unauthorized')) {
    return 'Sessie verlopen. Log opnieuw in.';
  }

  return message;
}
