# README

### Docker

```bash
 docker build -t simulador-frontend -f docker/Dockerfile .
```

### Kubernetes

```bash
helm install simulador-frontend ./kapital-simulator-ui/helm
kubectl port-forward svc/simulador-frontend-frontend-service 3000:80

http://localhost:3000/simulator
```
