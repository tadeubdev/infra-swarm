#!/bin/bash

set -e

echo "🔄 Atualizando IPs da Cloudflare..."

# Baixa listas oficiais
IPV4=$(curl -s https://www.cloudflare.com/ips-v4)
IPV6=$(curl -s https://www.cloudflare.com/ips-v6)

echo "🧹 Removendo regras antigas da Cloudflare..."

ufw status numbered | grep Cloudflare | awk -F'[][]' '{print $2}' | sort -rn | while read num; do
  ufw --force delete $num
done

echo "➕ Adicionando novas regras..."

for ip in $IPV4; do
  ufw allow from $ip to any port 80 proto tcp comment 'Cloudflare'
  ufw allow from $ip to any port 443 proto tcp comment 'Cloudflare'
done

for ip in $IPV6; do
  ufw allow from $ip to any port 80 proto tcp comment 'Cloudflare'
  ufw allow from $ip to any port 443 proto tcp comment 'Cloudflare'
done

echo "✅ Atualização concluída."
