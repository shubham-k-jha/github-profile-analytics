# 📊 GitHub Profile Analytics

A lightweight, production-ready **GitHub Profile Analytics & Visitor Tracking System** that tracks profile visits, stores analytics data, and displays useful statistics through a clean dashboard.

Built with **Next.js, Vercel, Upstash Redis, and the GitHub API**.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Upstash-00E9A3?style=for-the-badge&logo=redis&logoColor=black" alt="Upstash"/>
  <img src="https://img.shields.io/badge/GitHub_API-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub API"/>
</p>

---

## 🚀 Overview

**GitHub Profile Analytics** provides an analytics layer for a GitHub profile.

The application can:

* 👀 Track profile visits
* 📈 Count total visitors
* 📅 Track visits over time
* 🌍 Capture visitor-related analytics where available
* 🐙 Fetch GitHub profile information
* 📊 Display profile statistics
* ⚡ Provide lightweight API endpoints
* ☁️ Run serverlessly on Vercel
* 💾 Store analytics using Upstash Redis

The project is designed to be embedded into a personal GitHub ecosystem and can also serve as a foundation for a larger developer analytics platform.

---

# ✨ Features

## 👤 GitHub Profile Analytics

Fetch and display GitHub profile information such as:

* Username
* Name
* Avatar
* Bio
* Followers
* Following
* Public repositories
* Public Gists
* Account information

---

## 👁️ Profile Visitor Tracking

Track visitors to the profile analytics endpoint.

Example:

```text
Total Visits
────────────
12,458
```

The system stores visit information in Redis and updates the analytics counters automatically.

---

## 📈 Visit Statistics

The analytics system can track:

* Total visits
* Unique visitors
* Daily visits
* Recent activity
* Visit trends

Example:

```text
Today       124
Yesterday   98
7 Days      731
30 Days     3,421
All Time    12,458
```

---

## ⚡ Serverless Architecture

The application is designed to run on **Vercel's serverless infrastructure**.

This means:

```text
Visitor
   │
   ▼
Vercel
   │
   ├── GitHub API
   │
   └── Upstash Redis
          │
          ▼
       Analytics
```

No traditional server is required.

---

# 🛠️ Tech Stack

| Technology        | Purpose                                |
| ----------------- | -------------------------------------- |
| **Next.js**       | Application framework                  |
| **TypeScript**    | Type-safe development                  |
| **GitHub API**    | GitHub profile/repository data         |
| **Upstash Redis** | Analytics storage                      |
| **Vercel**        | Deployment & serverless infrastructure |
| **Git**           | Version control                        |

---

# 📂 Project Structure

```text
github-profile-analytics/
│
├── app/
│   ├── api/
│   │   ├── github/
│   │   └── visits/
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   └── ...
│
├── lib/
│   ├── github.ts
│   └── redis.ts
│
├── public/
│   └── ...
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.json
└── README.md
```

> The exact structure may vary depending on the current implementation.

---

# 🔑 Environment Variables

Create a local environment file:

```bash
.env.local
```

Add the required credentials:

```env
GITHUB_TOKEN=your_github_token

UPSTASH_REDIS_REST_URL=your_upstash_redis_url

UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### GitHub Token

A GitHub Personal Access Token can be used to increase GitHub API rate limits and access the required profile information.

### Upstash

Upstash Redis is used to persist visitor analytics.

Never commit credentials to GitHub.

---

# 🔒 Security

Sensitive credentials should **never** be committed to the repository.

Your `.gitignore` should contain:

```gitignore
node_modules/
.next/
.env
.env.local
.env.*.local
```

If a secret is accidentally pushed to GitHub:

1. Revoke the exposed credential.
2. Generate a new credential.
3. Update the Vercel environment variables.
4. Remove the secret from the repository history if necessary.

---

# 💻 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/shubham-k-jha/github-profile-analytics.git
```

## 2. Enter the project

```bash
cd github-profile-analytics
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create:

```text
.env.local
```

and add the required GitHub and Upstash credentials.

## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# ☁️ Deploying to Vercel

The recommended deployment platform is **Vercel**.

### Step 1 — Push the repository to GitHub

```bash
git add .
git commit -m "Initial GitHub Profile Analytics"
git push origin main
```

### Step 2 — Import into Vercel

Open Vercel and import:

```text
shubham-k-jha/github-profile-analytics
```

### Step 3 — Add Environment Variables

In the Vercel project settings, add:

```text
GITHUB_TOKEN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

### Step 4 — Deploy

Vercel will automatically build and deploy the application.

After deployment, you will receive a URL similar to:

```text
https://github-profile-analytics.vercel.app
```

---

# 📊 Architecture

```text
                    ┌──────────────────┐
                    │    GitHub User   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Vercel       │
                    │   Next.js App    │
                    └───────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │   GitHub API    │   │   Upstash Redis │
        │                 │   │                 │
        │ Profile Data    │   │ Visit Counts    │
        │ Repositories    │   │ Daily Stats     │
        │ Followers       │   │ Analytics       │
        └─────────────────┘   └─────────────────┘
```

---

# 🧮 Analytics Flow

```text
Visitor
   │
   ▼
Analytics Endpoint
   │
   ├── Generate / identify visitor
   │
   ├── Record visit
   │
   ├── Update counters
   │
   └── Store analytics
          │
          ▼
      Upstash Redis
          │
          ▼
     Analytics API
          │
          ▼
       Dashboard
```

---

# 🐙 GitHub Profile Integration

The application can use the GitHub API to retrieve profile information.

Example API request:

```text
GET /users/{username}
```

Example response:

```json
{
  "login": "shubham-k-jha",
  "public_repos": 25,
  "followers": 100,
  "following": 50
}
```

The returned information can then be displayed through the analytics dashboard.

---

# 📌 GitHub Profile Integration

Once deployed, the analytics endpoint can be connected to your GitHub profile ecosystem.

For example, the profile README can display a visitor counter:

```markdown
![Profile Views](https://YOUR-DOMAIN/api/visits)
```

Or:

```markdown
![Profile Views](https://YOUR-DOMAIN/api/profile-views)
```

Replace `YOUR-DOMAIN` with the deployed Vercel domain and use the exact endpoint implemented by the application.

---

# 📊 Example Dashboard

The dashboard can provide metrics such as:

```text
┌──────────────────────────────────────────┐
│         GITHUB PROFILE ANALYTICS         │
├──────────────────────────────────────────┤
│                                          │
│   TOTAL VISITS        UNIQUE VISITORS    │
│      12,458                8,921          │
│                                          │
│   TODAY               THIS WEEK          │
│      124                  731             │
│                                          │
│   THIS MONTH          ALL TIME           │
│     3,421               12,458           │
│                                          │
└──────────────────────────────────────────┘
```

---

# 🧪 Testing

Run the development server:

```bash
npm run dev
```

Then test the API endpoints using:

```bash
curl http://localhost:3000/api/visits
```

For production:

```bash
curl https://YOUR-DOMAIN/api/visits
```

---

# 🚧 Roadmap

Future improvements may include:

* [ ] Advanced visitor analytics
* [ ] Unique visitor tracking
* [ ] Geographic analytics
* [ ] Device/browser analytics
* [ ] Daily/weekly/monthly charts
* [ ] Repository traffic analytics
* [ ] Repository star/fork tracking
* [ ] GitHub contribution analytics
* [ ] Commit activity dashboard
* [ ] Most-viewed repositories
* [ ] Real-time dashboard
* [ ] Export analytics as CSV
* [ ] Analytics API
* [ ] Dark/light theme
* [ ] Custom GitHub README widgets
* [ ] Rate-limit monitoring
* [ ] Automated GitHub statistics refresh

---

# 🎯 Why This Project?

This project combines several practical areas of modern data and software engineering:

**API Integration**

```text
GitHub API
    ↓
Data Collection
```

**Data Engineering**

```text
Visitor Event
    ↓
Redis
    ↓
Aggregated Metrics
```

**Analytics**

```text
Raw Events
    ↓
KPIs
    ↓
Trends
    ↓
Dashboard
```

**Cloud Deployment**

```text
GitHub
   ↓
Vercel
   ↓
Serverless Application
```

It therefore serves as a practical demonstration of **API development, data collection, analytics, cloud deployment, and modern web development**.

---

# 👨‍💻 Author

**Shubham K. Jha**

Data Analytics | Data Science | Python | SQL | Power BI | Machine Learning | AI | Scientific Data Analysis

### GitHub

[@shubham-k-jha](https://github.com/shubham-k-jha/)

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐.

---

## 📜 License

This project is available under the MIT License.

---

<p align="center">
  Built with ❤️ using Next.js, GitHub API, Upstash Redis & Vercel
</p>
