# AWS S3 Static Application - DevOps CI/CD

Aplicación web estática desarrollada con React y Vite, diseñada para ser desplegada en Amazon S3 usando AWS CodeBuild para automatizar el proceso de CI/CD.

## 🚀 Características

- **React 18** con Vite para desarrollo rápido
- **Tests unitarios** con Jest y React Testing Library
- **Buildspec.yml** configurado para AWS CodeBuild (build y despliegue)
- **Buildspec.test.yml** independiente para ejecutar solo tests
- **Despliegue automático** en S3
- **UI moderna** con diseño responsivo

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de AWS con permisos para:
  - S3 (crear bucket y subir archivos)
  - CodeBuild (crear proyecto y ejecutar builds)
  - IAM (crear roles y políticas)

## 🛠️ Instalación Local

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd DevOps-CICD-PrimerosPasos
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🧪 Ejecutar Tests

### Ejecutar todos los tests:
```bash
npm test
```

### Ejecutar tests en modo watch:
```bash
npm run test:watch
```

### Ejecutar tests con cobertura:
```bash
npm run test:coverage
```

Los resultados de cobertura se generarán en la carpeta `coverage/`.

### Ejecutar Tests con CodeBuild

El proyecto incluye un `buildspec.test.yml` independiente para ejecutar solo los tests en CodeBuild:

1. **Crear un proyecto CodeBuild para tests:**
```bash
aws codebuild create-project \
  --name react-tests \
  --source type=GITHUB,location=https://github.com/tu-usuario/tu-repo.git \
  --artifacts type=S3,location=tu-bucket-artefactos,name=test-results \
  --environment type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_SMALL \
  --service-role arn:aws:iam::TU-ACCOUNT-ID:role/TU-ROLE-NAME \
  --buildspec buildspec.test.yml
```

2. **Ejecutar tests desde CodeBuild:**
```bash
aws codebuild start-build --project-name react-tests
```

El `buildspec.test.yml`:
- Instala dependencias
- Ejecuta todos los tests con cobertura
- Genera reportes de cobertura
- Guarda los resultados como artefactos en S3
- Falla el build si algún test falla

Los artefactos de cobertura se guardarán en el bucket S3 especificado para revisión posterior.

## 🏗️ Build para Producción

Para generar el build de producción localmente:

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`, listos para ser subidos a S3.

## 📦 Despliegue en AWS S3

### Opción 1: Despliegue Manual

1. **Crea un bucket de S3:**
```bash
aws s3 mb s3://tu-bucket-nombre --region us-east-1
```

2. **Habilita hosting estático:**
```bash
aws s3 website s3://tu-bucket-nombre \
  --index-document index.html \
  --error-document index.html
```

3. **Configura política de bucket (público):**
Crea un archivo `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tu-bucket-nombre/*"
    }
  ]
}
```

Aplica la política:
```bash
aws s3api put-bucket-policy --bucket tu-bucket-nombre --policy file://bucket-policy.json
```

4. **Construye y despliega:**
```bash
npm run build
aws s3 sync dist/ s3://tu-bucket-nombre --delete
```

5. **Accede a tu aplicación:**
```
http://tu-bucket-nombre.s3-website-us-east-1.amazonaws.com
```

### Opción 2: Despliegue Automático con CodeBuild

#### Paso 1: Preparar el Bucket S3

1. Crea un bucket S3 para almacenar los artefactos:
```bash
aws s3 mb s3://tu-bucket-artefactos --region us-east-1
```

2. Crea otro bucket S3 para hosting (o usa el mismo):
```bash
aws s3 mb s3://tu-bucket-hosting --region us-east-1
```

#### Paso 2: Configurar IAM Role para CodeBuild

1. Crea un rol IAM con permisos para S3. Guarda el siguiente JSON como `codebuild-role-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::tu-bucket-hosting/*",
        "arn:aws:s3:::tu-bucket-hosting"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

2. Crea el rol usando AWS CLI o la consola de AWS.

#### Paso 3: Crear Proyecto CodeBuild

1. **Usando AWS CLI:**
```bash
aws codebuild create-project \
  --name react-s3-deploy \
  --source type=GITHUB,location=https://github.com/tu-usuario/tu-repo.git \
  --artifacts type=S3,location=tu-bucket-artefactos \
  --environment type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_SMALL \
  --service-role arn:aws:iam::TU-ACCOUNT-ID:role/TU-ROLE-NAME
```

2. **O usando la consola de AWS:**
   - Ve a AWS CodeBuild
   - Crea un nuevo proyecto
   - Configura:
     - **Source**: GitHub, Bitbucket, o CodeCommit
     - **Environment**: Ubuntu, Node.js 18
     - **Buildspec**: 
       - `buildspec.yml` - Para build completo y despliegue
       - `buildspec.test.yml` - Solo para ejecutar tests
     - **Artifacts**: S3 bucket para almacenar artefactos

#### Paso 4: Configurar Buildspec para Despliegue

El proyecto incluye dos buildspecs:
- **`buildspec.yml`**: Para build completo y despliegue a S3 (incluye tests antes del build)
- **`buildspec.test.yml`**: Solo para ejecutar tests de forma independiente

El archivo `buildspec.yml` incluido ejecuta los tests y genera el build. Para desplegar automáticamente a S3, el buildspec ya está configurado:

Crea un archivo `deploy.sh`:
```bash
#!/bin/bash
aws s3 sync dist/ s3://tu-bucket-hosting --delete
```

Y actualiza el `buildspec.yml` para incluir el despliegue en la fase `post_build`:

```yaml
post_build:
  commands:
    - echo Deploying to S3...
    - chmod +x deploy.sh
    - ./deploy.sh
```

#### Paso 5: Ejecutar el Build

1. **Desde la consola de AWS:**
   - Ve a CodeBuild
   - Selecciona tu proyecto
   - Haz clic en "Start build"

2. **Desde AWS CLI:**
```bash
aws codebuild start-build --project-name react-s3-deploy
```

#### Paso 6: Configurar Webhook (Opcional)

Para desplegar automáticamente en cada push:

1. En CodeBuild, configura un webhook desde GitHub/Bitbucket
2. O usa AWS CodePipeline para un flujo completo de CI/CD

## 🔧 Configuración Adicional

### Variables de Entorno en CodeBuild

Puedes agregar variables de entorno en el proyecto CodeBuild:
- `S3_BUCKET`: Nombre del bucket de destino
- `AWS_REGION`: Región de AWS

Luego actualiza el `buildspec.yml`:
```yaml
post_build:
  commands:
    - aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION
```

### CloudFront (Opcional)

Para mejorar el rendimiento y seguridad, configura CloudFront:

1. Crea una distribución CloudFront apuntando a tu bucket S3
2. Configura HTTPS y dominio personalizado
3. Actualiza el buildspec para invalidar la caché de CloudFront después del despliegue

## 📁 Estructura del Proyecto

```
.
├── src/
│   ├── components/
│   │   ├── Counter.jsx
│   │   ├── Counter.css
│   │   ├── Counter.test.jsx
│   │   ├── Welcome.jsx
│   │   ├── Welcome.css
│   │   └── Welcome.test.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── App.test.jsx
│   ├── main.jsx
│   ├── index.css
│   └── setupTests.js
├── buildspec.yml
├── buildspec.test.yml
├── package.json
├── vite.config.js
├── jest.config.js
├── .babelrc
├── deploy.sh
└── README.md
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error en CodeBuild: "npm: command not found"
Asegúrate de usar una imagen de build que incluya Node.js, como `aws/codebuild/standard:7.0`

### Error de permisos S3
Verifica que el rol de CodeBuild tenga permisos para:
- `s3:PutObject`
- `s3:GetObject`
- `s3:ListBucket`
- `s3:DeleteObject`

## 📝 Notas

- El archivo `buildspec.yml` está configurado para ejecutar tests antes del build y desplegar a S3
- El archivo `buildspec.test.yml` es independiente y solo ejecuta tests, útil para pipelines de CI separados
- Los artefactos se generan en la carpeta `dist/`
- Los reportes de cobertura se guardan en `coverage/`
- Asegúrate de que el bucket S3 tenga habilitado el hosting estático
- Para producción, considera usar CloudFront para CDN y HTTPS

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

