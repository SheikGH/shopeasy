# shopeasy
E-Commerial App is the NodeJS application with ExpressJS framework with integrate DevOps - CI/CD Pipeline
Continous Integration(CI) has been done with help of the Github actions, it will build and test code automatically and code are push to the Github repository
Continous Deployment (CD) has neen done with buildand push app to Docker then run the application using GitHub Runner by creating Windows - Self Hosted Runner


🔧 CI/CD Pipeline for Node.js App using GitHub Actions and Docker Hub
🧱 CI (Continuous Integration)
✅ Step 1: Create Your Node.js Project
bash
Copy
Edit
mkdir my-node-app
cd my-node-app
npm init -y
Create a basic server: index.js

js
Copy
Edit
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`App running on http://localhost:${port}`));
Install Express:

bash
Copy
Edit
npm install express
✅ Step 2: Create a GitHub Repository
Push your project to a new GitHub repo:

bash
Copy
Edit
git init
git remote add origin https://github.com/yourusername/my-node-app.git
git add .
git commit -m "Initial commit"
git push -u origin master
✅ Step 3: Set Up Secret Variables in GitHub
Go to your GitHub repo → Settings → Secrets and variables → Actions → Click New repository secret.

Add:

DOCKER_USERNAME → Your Docker Hub username

DOCKER_PASSWORD → Your Docker Hub password or access token

✅ Step 4: Create the GitHub Actions Workflow
Create a file:
.github/workflows/nodejs-docker.yml

yaml
Copy
Edit
name: Node.js CI/CD Pipeline

on:
  push:
    branches: 
    - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Run tests (optional)
      run: npm test || echo "No tests defined"

    - name: Log in to Docker Hub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin

    - name: Build Docker image
      run: docker build -t ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest .

    - name: Push Docker image to Docker Hub
      run: docker push ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest
Create Dockerfile in root:

Dockerfile
Copy
Edit
# Use official Node.js image
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
🚀 CD (Continuous Delivery)
✅ Step 5: Set Up Self-Hosted Runner
1. Go to GitHub → Your Repo → Settings → Actions → Runners
Click New self-hosted runner

Choose OS (e.g., Linux)

Follow the setup commands:

bash
Copy
Edit
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz
./config.sh --url https://github.com/yourusername/my-node-app --token <TOKEN>
./run.sh
⚠️ Keep this terminal open to run the runner. You can also set it up as a service.

✅ Update Workflow for Deployment with Self-Hosted Runner
Update .github/workflows/nodejs-docker.yml to:

yaml
Copy
Edit
jobs:
  build-and-deploy:
    runs-on: self-hosted

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Docker login
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin

    - name: Pull latest Docker image
      run: docker pull ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest

    - name: Stop old container
      run: docker stop my-node-app || true && docker rm my-node-app || true

    - name: Run new container
      run: docker run -d --name my-node-app -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest
✅ Step 6: Test the CI/CD Pipeline
Push code to master branch

GitHub Action will:

Build & push Docker image

On self-hosted runner, pull and deploy latest image

🧪 Example Output (Simplified):
bash
Copy
Edit
✔ Checkout code
✔ Install dependencies
✔ Build Docker image
✔ Push Docker image to Docker Hub
✔ Pull image on self-hosted runner
✔ Replace old container with new one
📌 Notes
For production, add HTTPS, logs, reverse proxy (e.g., Nginx), etc.

You can improve the CD step with blue-green deployment, health checks, etc.

For multiple environments (dev/staging/prod), create separate workflows with environment conditions.
