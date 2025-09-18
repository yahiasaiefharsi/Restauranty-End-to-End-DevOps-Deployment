 

🍽️ Restauranty — Microservices on Kubernetes 

Restauranty is a demo project that shows how to run a microservices architecture with Kubernetes, Docker, MongoDB Atlas, and GitHub Actions CI/CD. 

 It includes 3 backend services (auth, items, discounts) and a React frontend, all exposed through an NGINX Ingress Controller. 


⚙️ Tech Stack 

Backend: Node.js (Express, Mongoose) 

Frontend: React 

Database: MongoDB Atlas 

Containerization: Docker 

Orchestration: Kubernetes (AKS in production) 

CI/CD: GitHub Actions → Docker Hub → AKS 

Monitoring: Prometheus + Grafana 


🚀 Run Locally (optional) 

Clone the repo: 

git clone https://github.com/<your-user>/restauranty.git 
cd restauranty 

Start Mongo (local testing only): 

docker run -d --name my-mongo -p 27017:27017 mongo:latest 

Run a service: 

cd backend/auth 
npm install 
npm run dev 

Frontend: 

cd client 
npm install 
npm start 
  

🐳 Docker Images 

Each service has its own Dockerfile. 

Build & push manually: 

export ORG=dokerhub username 
 
docker build -t $ORG/restauranty-auth:latest ./backend/auth && docker push $ORG/restauranty-auth:latest 
docker build -t $ORG/restauranty-items:latest ./backend/items && docker push $ORG/restauranty-items:latest 
docker build -t $ORG/restauranty-discounts:latest ./backend/discounts && docker push $ORG/restauranty-discounts:latest 
docker build -t $ORG/restauranty-frontend:latest ./client && docker push $ORG/restauranty-frontend:latest 
  

☸️ Kubernetes Deployment 

Create namespace + secrets: 

kubectl apply -f k8s/namespace.yaml 
 
kubectl -n restauranty create secret generic restauranty-secrets \ 
  --from-literal=MONGODB_URI='<your_atlas_connection_string>' \ 
  --from-literal=CLOUD_NAME='<cloudinary_cloud>' \ 
  --from-literal=CLOUD_API_KEY='<cloudinary_key>' \ 
  --from-literal=CLOUD_API_SECRET='<cloudinary_secret>' 
  

Deploy services: 

kubectl apply -f k8s/auth.yaml 
kubectl apply -f k8s/items.yaml 
kubectl apply -f k8s/discounts.yaml 
kubectl apply -f k8s/frontend.yaml 
kubectl apply -f k8s/ingress.yaml 
  

Check: 

kubectl -n restauranty get pods,svc,ingress 
  

Open in browser: 

 http://<INGRESS_IP>/ 

 

🔄 CI/CD (GitHub Actions) 

On Pull Requests → install + build + test 

On Merge to Main → build Docker images, push to Docker Hub, apply manifests on AKS 

Secrets needed in GitHub: 

DOCKERHUB_USERNAME 

DOCKERHUB_TOKEN 

KUBE_CONFIG (kubeconfig file to access AKS) 

K8S_NAMESPACE=restauranty 

Workflow file: .github/workflows/ci-cd.yaml 
 

📊 Monitoring (Minimal) 

Install Prometheus + Grafana with Helm: 

kubectl create namespace monitoring 
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts 
helm repo update 
helm install kps prometheus-community/kube-prometheus-stack -n monitoring 
  

Access Grafana locally: 

kubectl -n monitoring port-forward svc/kps-grafana 3000:80 
  

Open: http://localhost:3000 

 User: admin 

 Password: 

kubectl -n monitoring get secret kps-grafana -o jsonpath="{.data.admin-password}" | base64 -d; echo 
  
 

✅ Troubleshooting 

503 from NGINX → check if pods are running and services have endpoints 

ImagePullBackOff → verify Docker image names & tags 

Mongo errors → whitelist your AKS egress IP in MongoDB Atlas 

Frontend API errors → rebuild frontend with correct REACT_APP_SERVER_URL 


🧹 Cleanup 

kubectl delete ns restauranty 
helm uninstall kps -n monitoring 
  
 
✨ Summary 

This project demonstrates: 

Microservices (auth, items, discounts, frontend) 

Kubernetes deployment with Ingress 

CI/CD automation (GitHub Actions → Docker Hub → AKS) 

Monitoring with Prometheus + Grafana 

It’s a starting point for learning DevOps, Cloud-Native Apps, and Kubernetes CI/CD pipelines. 