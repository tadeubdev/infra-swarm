# infra-swarm

## Build da imagem

```bash
# local: atualizar o codigo e trocar a tag da imagem
git push origin main

docker build -t infra-app:1.1 .
# ou
docker build -t infra-api:1.1 .

# atualiza o stack.yml (image: infra-app:1.1)

# deploy no servidor
docker stack deploy -c stack.yml apps


# qatualizar a imagem no servidor
docker service update --force --with-registry-auth --image ghcr.io/tadeubdev/infra-swarm-app:latest apps_app
docker service update --force --with-registry-auth --image ghcr.io/tadeubdev/infra-swarm-api:latest apps_api
```
