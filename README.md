# WebPulse Uniontesters

WebPulse Uniontesters is a cloud-based automated QA testing engine that simulates controlled, human-like user journeys with rule-based browser agents. It is designed for website owners and developers who need continuous validation of critical flows such as browsing, signup, login, shopping, forms, email OTP verification, and performance-sensitive interactions.

> WebPulse is strictly a quality assurance system. It is not intended for traffic manipulation, analytics inflation, credential abuse, or bypassing security controls on websites that are not owned or authorized by the tester.

## Website

This repository includes a static marketing website for WebPulse Uniontesters. Open `index.html` directly in a browser or serve the directory locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## WebPulse V2 Cinematic Engine

WebPulse V2 upgrades the prototype into a simulation-first architecture: the backend is the simulation brain, WebSocket streams carry strict event deltas, and the frontend is a Vite + React + Three.js WebGL runtime that renders every event as motion in 3D space.

### V2 backend modules

```text
backend/api/          FastAPI route modules for simulation, metrics, and control
backend/core/         config, logging, and authorized-target validation
backend/engine/       simulation orchestrator, dispatcher, and live-sample load balancer
backend/agents/       deterministic behavior model and Playwright-ready session wrapper
backend/realtime/     WebSocket manager and event stream worker
backend/analytics/    event aggregation and metrics snapshots
backend/storage/      in-memory run and metrics repositories
```

### V2 API

- `POST /simulation/start` with `{ "target_url": "https://example.com", "agent_count": 100, "mode": "stress | qa | ux" }`.
- `POST /simulation/stop?run_id=<id>` to stop a run.
- `GET /simulation/status/{run_id}` for run state.
- `GET /metrics/{run_id}` for success rate, error rate, latency, throughput, and hotspot density.
- `GET /runs/history` for recent runs.
- `WS /ws/simulation` for all simulation packets.
- `WS /ws/simulation/{run_id}` for a specific run stream.

### V2 frontend runtime

The frontend is now a Vite-powered cinematic cockpit with:

- a dominant WebGL viewport powered by Three.js;
- a simulation engine class that owns the frame loop outside React lifecycle;
- session particles with velocity, intensity, lifecycle, and event-reactive shader colors;
- click selection through raycasting;
- HUD panels for control, live metrics, selected session, and event stream logs.

### Local V2 run

```bash
# Backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
WEBPULSE_ALLOWED_HOSTS=example.com,localhost,127.0.0.1 uvicorn backend.app:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and start an authorized QA simulation.

### V2 safety model

WebPulse V2 is a QA orchestration and synthetic user simulation system for owned or explicitly authorized web applications only. Backend URL validation is enabled through `WEBPULSE_ALLOWED_HOSTS`. The engine does not support credential abuse, social-platform manipulation, fake identity simulation, or unauthorized automation.

## Full-Stack Dashboard Architecture

The implementation now includes a working full-stack project layout:

```text
backend/              FastAPI app, test endpoint, metrics endpoint, WebSocket run stream
frontend/             Vite + React + TypeScript WebGL cockpit
agents/               Async Playwright-ready bot session simulator
scheduler/            Bot assignment and journey dispatcher
websocket/            FastAPI WebSocket connection manager
docker/               Backend Dockerfile
.github/workflows/    CI for backend compilation and frontend type checks
```

### Backend quick start

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload
```

The backend exposes:

- `GET /health` for service status.
- `POST /simulation/start` to request an authorized QA run.
- `GET /metrics/{run_id}` for analytics.
- `WS /ws/simulation/{run_id}` for live simulation events.

### Agent scale and allowed targets

The dashboard lets an operator select the number of agents for an authorized QA run. Very large runs are represented with sampled live visualization so the UI remains responsive while analytics scale to the requested total. WebPulse must only be used on websites and accounts where the operator has explicit permission to test; it does not automate social media engagement, fake account creation, follows, likes, comments, shares, saves, or any other platform-manipulation activity.

### Frontend quick start

```bash
cd frontend
npm install
npm run dev
```

The Vite dashboard renders a cinematic Three.js simulation space, moving session particles, HUD controls, metrics overlays, and real-time event logs.

## Core Idea

WebPulse uses controlled union agent users to behave like realistic visitors on an authorized target website so teams can verify that the site works properly before real users encounter issues.

The system helps teams:

- Test websites automatically.
- Simulate real user journeys.
- Validate signup, login, checkout, and lead-generation flows.
- Identify captcha or verification flow issues in approved test environments.
- Detect broken links, form failures, server errors, and performance regressions.
- Run scheduled test cycles continuously in the cloud.

## System Architecture

```text
Dashboard (User Control Panel)
        ↓
API Server (Brain)
        ↓
Scheduler (Timing System)
        ↓
Rule-Based Bot Engine
        ↓
Browser Automation Layer (Playwright)
        ↓
Authorized Target Website
        ↓
Result Collector (Reports + Logs)
```

## Rule-Based Bot System

The bot system is composed of configurable, scripted browser agents. These agents are not autonomous AI users; they follow predefined behavior rules with randomized timing and navigation patterns.

The total number of agents is configurable by deployment size and test plan.

### Bot Types

| Bot Type | Primary Behaviors |
| --- | --- |
| Visitor Bots | Open the homepage, scroll, click site links, and exit. |
| Reader Bots | Read blog or documentation pages, scroll slowly, and open articles. |
| Shopper Bots | Browse products, add items to cart, and start checkout validation. |
| Signup Bots | Fill registration forms, submit test data, and complete OTP flows. |
| Lead Bots | Visit pricing pages, open contact forms, and submit approved test leads. |

## Device Simulation

Each bot session can simulate a device profile to increase browser and layout coverage.

| Device Profile | Target Distribution |
| --- | ---: |
| Android phone | 25% |
| iPhone | 25% |
| Desktop | 20% |
| Mac | 20% |
| Linux | 10% |

Device profiles may vary by:

- Screen size and viewport.
- Browser engine or browser channel.
- Input style.
- Scroll behavior.
- Timing behavior.

## Human-Like Behavior Engine

Bots use randomized timing rules to avoid brittle, instant-click test behavior and better reflect real user interaction patterns.

### Session Timing Rules

- Visit duration: 3–20 minutes.
- Idle time between actions: 2–15 seconds.
- Break between sessions: 5–30 minutes.
- Revisit probability: randomized by test plan.

### Example Session

```text
Bot #12
1. Opens the authorized target site.
2. Waits 20 seconds to simulate reading.
3. Scrolls the page.
4. Clicks the menu.
5. Opens a product page.
6. Waits 45 seconds.
7. Ends the session.
```

## Email and OTP System

WebPulse can validate signup verification flows in controlled environments by using test inboxes and dedicated test addresses.

### Purpose

- Confirm that signup emails are sent correctly.
- Extract OTP codes from controlled test inboxes.
- Inject OTP values back into the active signup test flow.
- Verify account creation without using real user inboxes.

### Example Test Email Structure

```text
bot001@test.internal
bot002@test.internal
bot003@test.internal
```

### OTP Handling

- OTPs are captured only from controlled test inboxes.
- OTP values are stored temporarily for the matching bot session.
- OTP retrieval is scoped to the active test run and test account.
- OTP data should be deleted or expired after test completion.

## Signup Test Flow

A typical signup validation flow includes:

1. Open the signup page.
2. Fill the registration form with approved test data:
   - Name.
   - Email.
   - Date of birth.
   - Additional required fields.
3. Submit the form.
4. Wait for the OTP message in the controlled test inbox.
5. Retrieve and parse the OTP.
6. Validate captcha or verification behavior in an approved test environment.
7. Enter the OTP.
8. Confirm account creation.
9. Record all success, failure, timing, and error data.

## Data Collected

Each bot produces structured logs that can be aggregated into reports.

### Performance Data

- Page load time.
- Response delay.
- Navigation speed.
- Time to interactive.

### Error Data

- Broken links.
- Failed forms.
- Server errors.
- Client-side console errors.
- Captcha or verification flow blockers.

### User Flow Data

- Pages visited.
- Session duration.
- Drop-off step.
- Completed or failed journey state.

## Cloud Execution Model

WebPulse runs test execution in the cloud. The user's phone or local device acts only as a control surface and does not need to remain online after a test cycle is scheduled.

```text
User Device (Control Only)
        ↓
Cloud Scheduler
        ↓
Bot Workers
        ↓
Authorized Website Testing Execution
```

## Test Cycle

Each website test cycle follows a repeatable execution pattern:

1. Start test.
2. Assign bot profiles.
3. Run browser sessions.
4. Collect logs and artifacts.
5. Generate reports.
6. Stop, repeat, or schedule the next cycle.

## Scaling Model

WebPulse can scale by increasing the configured number of agents and enabled feature sets.

| Stage | Capabilities |
| --- | --- |
| Start | Configurable bot amount, basic flows, manual trigger. |
| Growth | Larger bot pool, scheduling system, email OTP system. |
| Advanced | Advanced reporting, multi-device simulation, deeper journey coverage. |

## Safety Boundaries

WebPulse is designed for legitimate QA automation only.

It is not:

- A hacking tool.
- A traffic inflator.
- A public analytics manipulation system.
- A credential stuffing system.
- A tool for bypassing production security controls without authorization.

Teams should run WebPulse only against websites, staging environments, and accounts where they have explicit permission to test.

## Core Value

WebPulse helps developers and QA teams:

- Find bugs before users do.
- Test signup and login flows automatically.
- Validate UI behavior across device profiles.
- Measure performance under realistic test conditions.
- Improve website stability.
- Detect verification and captcha friction in approved test flows.

## Final Result

WebPulse Uniontesters is a cloud-based automated QA testing engine that simulates realistic user behavior through controlled, rule-based browser agents and produces actionable QA reports for authorized websites.
