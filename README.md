# TrackNext

TrackNext is a responsive student opportunity portal website built with HTML, CSS, and vanilla JavaScript. It helps students discover internships, hackathons, workshops, courses, jobs, scholarships, and other career-building opportunities in one place.

## Project Structure

```text
tracknext/
├── index.html
├── style.css
├── script.js
├── server.js
├── README.md
├── package.json
└── assets/
    └── tracknext-logo.png
```

## Run locally

### Option 1: Backend server (recommended)
From the project folder:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

This serves both the frontend and the API data from the backend.

### MongoDB setup
Both Express (port 3000) and FastAPI (port 8001) read MongoDB settings from the project-root `.env` file. In PowerShell, run:

```powershell
.\setup-mongodb.ps1
```

The script prompts for your Atlas URI without echoing it, tests the connection, and only saves it to `.env` after a successful ping. Do not commit `.env` or share its credentials. In MongoDB Atlas, allow your development IP address in Network Access and create a database user with access to the `tracknext` database.

Start the Express site with `npm start`. Start FastAPI separately with `python -m uvicorn main:app --host 0.0.0.0 --port 8001`. Check `/api/health` on either server: it reports `mongodb` only after a successful database ping; otherwise it reports `sample-data`.

When MongoDB is connected and the `opportunities` collection is empty, the app seeds it with the sample opportunities. Otherwise, it reads records already stored there.

### Deploy to Render
The included `render.yaml` configures the Express app as a web service and requires a working MongoDB connection before startup. In Render, create a Blueprint from this repository and enter `MONGODB_URI` when prompted; the URI is stored as a secret environment variable, not in the repository. `MONGODB_DB_NAME` and `MONGODB_REQUIRED` are configured by the blueprint. Configure MongoDB Atlas Network Access to allow the service's outbound IP addresses; avoid opening access to all IPs for a production deployment.

The Blueprint uses Render's free instance plan, which may spin down when idle. Choose a paid instance in Render if the app needs to stay responsive continuously. The health check at `/api/health` verifies MongoDB and returns an unhealthy response if the required database connection is unavailable.

### Option 2: VS Code Live Server
1. Open the project folder in VS Code.
2. Open `index.html`.
3. Right-click and choose **Open with Live Server**.

### Option 3: Local static server
From the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Features

- Responsive student-focused landing page
- Sidebar and mobile navigation
- Search and filter controls
- Opportunity category cards
- Featured opportunities grid
- Saved opportunities with localStorage
- Opportunity details modal
- Upcoming events and quick links
- Footer with branding and navigation
- MongoDB-ready backend with automatic fallback to demo data

## Notes

- The app uses sample opportunity data by default.
- MongoDB is not connected until a valid `MONGODB_URI` is configured in `.env`.
- The uploaded TrackNext logo should be placed in `assets/tracknext-logo.png`.

## Deployment

This project can be deployed as a static site or backend service on various hosting platforms such as Netlify, Vercel, Render, or Railway. For MongoDB-backed deployments, make sure the environment variables are configured on the hosting platform.
