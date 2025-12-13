#!/bin/bash

# Script de despliegue manual a S3
# Uso: ./deploy.sh <nombre-bucket-s3>

set -e

BUCKET_NAME=$1

if [ -z "$BUCKET_NAME" ]; then
  echo "Error: Debes proporcionar el nombre del bucket S3"
  echo "Uso: ./deploy.sh <nombre-bucket-s3>"
  exit 1
fi

echo "🚀 Construyendo la aplicación..."
npm run build

echo "📦 Desplegando a S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ s3://$BUCKET_NAME --delete

echo "✅ Despliegue completado exitosamente!"
echo "🌐 Tu aplicación está disponible en:"
echo "   http://$BUCKET_NAME.s3-website-$(aws configure get region).amazonaws.com"

