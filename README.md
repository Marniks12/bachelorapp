# Sonaris MVP

Sonaris is een Expo React Native app for uploading audiogram images, running an AI-assisted analysis, and reviewing saved analysis results per authenticated user.

## Demo URLs

- Live app URL: https://sonarisapp.vercel.app
- Backend URL: https://bachelorapp.onrender.com

## Test Account

Use this demo account if it is already created, or create it in the app via **Signup** before the final demo:
- Email: demo@sonaris.test
- Password: Demo12345

If the email already exists, use another email address.

## Tech Stack

- Frontend: React Native Expo, TypeScript, React Navigation
- Storage: localStorage on web, AsyncStorage on native
- Backend: Express, TypeScript, MongoDB Atlas, Mongoose
- Auth: JWT bearer tokens
- Uploads: Cloudinary
- AI workflow: n8n webhook

## Core Feature Flow

1. Sign up or log in.
2. New users land on the onboarding/cards flow.
3. Upload or capture an audiogram image.
4. Sonaris sends the image to the backend and runs the AI analysis.
5. The result screen shows severity, PTA, confidence, summary, and recommendation.
6. Press **Bekijk in dashboard** to view the new-user dashboard with the latest analysis.
7. Existing users and refreshed sessions open the normal dashboard.

## How To Test

1. Open https://sonarisapp.vercel.app.
2. Sign up with a new account or log in with an existing account.
3. Upload an audiogram image.
4. Wait for **Analyse wordt uitgevoerd...**.
5. Confirm the result appears.
6. Go to the dashboard and verify the analysis card shows severity, date, confidence, and thumbnail.
7. Refresh the browser and confirm the session restores to the dashboard.
8. Log out and confirm protected screens require login again.
