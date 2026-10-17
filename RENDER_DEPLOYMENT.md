# Render Deployment

The root `render.yaml` is a Render Blueprint for the Express application. It runs `npm ci` and `npm start`, checks `/api/health`, and requires MongoDB to be reachable before the service starts.

1. Push this repository to GitHub and create a Blueprint in Render from the repository.
2. Enter `MONGODB_URI` when Render prompts for the unsynchronized secret. Use the Atlas connection string for the `tracknext` database; do not put credentials in source control.
3. In MongoDB Atlas, create a database user with access to `tracknext` and allow the Render service's outbound IP addresses in Network Access. Avoid `0.0.0.0/0` for production.
4. Deploy and verify `/api/health` reports `"database":"mongodb"` and `"mongoConnected":true`.

The Blueprint selects Render's free instance plan, which may spin down while idle. Select a paid instance in Render if continuous availability and responsiveness are required. Use the Render dashboard to change the plan; no source changes are needed.
