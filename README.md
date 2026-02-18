# infra-swarm

Lab simples de **Docker Swarm + Traefik** para publicar serviços HTTP usando labels.

## Estrutura

```text
infra-swarm/
├── infra/
│   └── traefik/
│       ├── stack.yml
│       └── traefik.yml
└── apps/
		└── web-test/
				└── stack.yml
```

## Pré-requisitos

- Docker instalado
- Docker Swarm iniciado
- Rede overlay externa `public` criada

## Subindo o ambiente

Na raiz do projeto:

```bash
# 1) Inicializa o swarm (se ainda não estiver ativo)
docker swarm init

# 2) Cria a rede overlay usada pelas stacks (uma vez só)
docker network create -d overlay public

# 3) Sobe o Traefik
docker stack deploy -c infra/traefik/stack.yml traefik

# 4) Sobe a aplicação de teste
docker stack deploy -c apps/web-test/stack.yml webtest
```

## Como acessar

- App de teste: `http://IP_DO_SERVIDOR/web-test`
- Dashboard Traefik (lab): `http://IP_DO_SERVIDOR/traefik`

> Observação: o dashboard está aberto apenas para laboratório.

## Verificações rápidas

```bash
docker stack ls
docker service ls
docker service ps traefik_traefik
docker service ps webtest_web-test
```

Teste HTTP:

```bash
curl -i http://IP_DO_SERVIDOR/web-test
```

## Remover ambiente

```bash
docker stack rm webtest
docker stack rm traefik
```

## Notas

- O `traefik.yml` define:
	- entrypoint HTTP na porta `80`
	- provider Docker em modo Swarm
	- `exposedByDefault: false` (só publica serviço com label)
- A app `web-test` usa middleware `stripprefix` para remover `/web-test` antes de chegar no Nginx.
