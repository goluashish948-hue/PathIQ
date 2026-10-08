# PathIQ Architecture & System Design

## 1. System Overview
PathIQ is an AI-powered adaptive career navigation platform ("AI Career GPS") designed to reverse-engineer target careers, diagnose individual skill gaps with partial transfer credit, generate topological dependency roadmaps (DAG), test mastery via quizzes and sandbox proofs, provide roadmap-aware AI mentorship, build evidence-backed resumes, and continuously recalculate routes as market requirements or student time allocations change.

```
+-------------+      +-------------------+      +-----------------+
| Career Goal | ---> | Real JD / Corpus  | ---> |  Career Twin    |
| Free-Text   |      | DNA Decomposition |      | (Digital State) |
+-------------+      +-------------------+      +-----------------+
                                                        |
                                                        v
+------------------+      +-----------------+      +-----------------+
| Personalized     | <--- | Topological DAG | <--- | Skill Gap Table |
| Schedule (Weeks) |      | Dependency Graph|      | & Reality Check |
+------------------+      +-----------------+      +-----------------+
        |
        v
+------------------+      +-----------------+      +-----------------+
| Learn & Topic    | ---> | Auto-Quiz       | ---> | Practical Proof |
| Concepts         |      | (Staircase Adapt|      | (SQL Sandbox)   |
+------------------+      +-----------------+      +-----------------+
                                                        |
                                                        v
+------------------+      +-----------------+      +-----------------+
| Replan / What-If | <--- | Progress Radar  | <--- | Evidence-Based  |
| Diff Recalculate |      | & Heatmap       |      | Resume & Portf. |
+------------------+      +-----------------+      +-----------------+
```

## 2. Component Boundaries
1. **Frontend (`/client`)**: React 18, Vite, TypeScript, Tailwind CSS, React Flow + Dagre, Recharts.
2. **Backend API (`/server`)**: Node.js, Express, TypeScript, Zod, Prisma ORM (SQLite / PostgreSQL), AI Gateway, Security Middleware.
3. **Sandbox Runner (`/sandbox`)**: Disposable isolated database and execution sandbox for auto-graded SQL and coding tasks.
4. **Data Foundation (`/data`)**: 20 Domain Packs, skill ontology with transfer factors, 320 synthetic corpus postings, vetted resource library, 8 demo students.

## 3. Reliable AI Pipeline (Principle P1)
All AI interactions follow a strict unidirectional pipeline:
`User Input -> Backend Security Middleware -> aiGateway -> Structured Output -> Schema Validation (Zod) -> Business Logic -> Database Persistence -> Clean Frontend DTO`.
The browser never interacts directly with third-party LLMs, and API keys are strictly retained on the backend.
