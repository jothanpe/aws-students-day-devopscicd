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

**Nota**: Este proyecto incluye tests simples y referenciales como ejemplo. El enfoque principal está en el pipeline CI/CD, no en cobertura completa de tests unitarios.

### Ejecutar todos los tests:
```bash
npm test
```

### Ejecutar tests en modo watch:
```bash
npm run test:watch
```

Los tests incluidos son ejemplos básicos que verifican que los componentes se renderizan correctamente. Son útiles para:
- Demostrar cómo integrar tests en el pipeline
- Verificar que la aplicación se construye sin errores
- Servir como referencia para futuros desarrollos

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

### Opción 2: Despliegue Automático con CodeBuild (Solo Build)

**Nota**: Si usas CodePipeline, ve a la **Opción 3** que es la recomendada. Esta opción es para usar solo CodeBuild sin pipeline.

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

#### Paso 4: Configurar Buildspec para Despliegue (Solo CodeBuild)

**Importante**: El `buildspec.yml` actual está configurado para **CodePipeline**, donde el despliegue se maneja en la etapa Deploy. 

Si usas **solo CodeBuild** (sin pipeline), necesitas agregar el despliegue manualmente. Actualiza el `buildspec.yml` en la fase `post_build`:

```yaml
post_build:
  commands:
    - echo Build phase completed
    - |
      if [ -z "$S3_BUCKET" ]; then
        echo "S3_BUCKET environment variable is not set. Skipping deployment."
      else
        echo "Deploying to S3 bucket: $S3_BUCKET"
        aws s3 sync dist/ s3://$S3_BUCKET --delete
        echo "Deployment completed successfully"
      fi
```

Y configura la variable de entorno `S3_BUCKET` en el proyecto CodeBuild.

**Recomendación**: Usa CodePipeline (Opción 3) para mejor separación de responsabilidades.

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
2. O usa AWS CodePipeline para un flujo completo de CI/CD (ver sección siguiente)

### Opción 3: Despliegue Automático con CodePipeline (Recomendado)

CodePipeline orquesta todo el flujo CI/CD: Source → Build → Deploy. Esta es la opción más completa y recomendada.

#### Paso 1: Preparar Recursos

1. **Bucket S3 para artefactos:**
```bash
aws s3 mb s3://tu-bucket-artefactos --region us-east-1
```

2. **Bucket S3 para hosting:**
```bash
aws s3 mb s3://tu-bucket-hosting --region us-east-1
```

3. **Habilitar hosting estático en el bucket de hosting:**
```bash
aws s3 website s3://tu-bucket-hosting \
  --index-document index.html \
  --error-document index.html
```

#### Paso 2: Crear Rol IAM para CodePipeline

CodePipeline necesita un rol IAM con permisos para:
- Acceder al repositorio (GitHub/CodeCommit)
- Ejecutar CodeBuild
- Acceder a S3 (artefactos y hosting)
- CloudWatch Logs

Crea un archivo `codepipeline-role-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::tu-bucket-artefactos/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::tu-bucket-artefactos"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "arn:aws:codebuild:*:*:project/react-s3-deploy"
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

#### Paso 3: Crear Proyecto CodeBuild

Primero crea el proyecto CodeBuild que usará el pipeline:

```bash
aws codebuild create-project \
  --name react-s3-deploy \
  --source type=CODEPIPELINE \
  --artifacts type=CODEPIPELINE \
  --environment type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_SMALL \
  --service-role arn:aws:iam::TU-ACCOUNT-ID:role/codebuild-role \
  --environment-variables name=S3_BUCKET,value=tu-bucket-hosting,type=PLAINTEXT
```

**Nota importante**: Configura la variable de entorno `S3_BUCKET` aquí o en el pipeline.

#### Paso 4: Crear CodePipeline (Consola AWS)

1. Ve a **AWS CodePipeline** en la consola
2. Haz clic en **Create pipeline**
3. **Paso 1 - Pipeline settings:**
   - **Pipeline name**: `react-s3-pipeline`
   - **Service role**: Crea nuevo rol o selecciona existente
   - **Artifact store**: S3 bucket `tu-bucket-artefactos`
   - Haz clic en **Next**

4. **Paso 2 - Add source stage:**
   - **Source provider**: GitHub, Bitbucket, o CodeCommit
   - **Repository**: Tu repositorio
   - **Branch**: `main` o `master`
   - **Detection options**: Webhooks (recomendado) o CloudWatch Events
   - Haz clic en **Next**

5. **Paso 3 - Add build stage:**
   - **Build provider**: AWS CodeBuild
   - **Project name**: `react-s3-deploy` (el que creaste antes)
   - **Build type**: Single build
   - Haz clic en **Next**

6. **Paso 4 - Add deploy stage:**
   - **Deploy provider**: Amazon S3
   - **Region**: Tu región (ej: `us-east-1`)
   - **Bucket name**: `tu-bucket-hosting`
   - **Extract file before deploy**: **No** (los archivos ya están en `dist/`)
   - **Input artifact**: Selecciona el artefacto de salida del Build
   - **S3 object key**: Deja vacío (se copiarán todos los archivos de `dist/`)
   - Haz clic en **Next**

   **Nota importante**: En CodePipeline, el despliegue se maneja en esta etapa, NO en el buildspec. El buildspec solo genera los artefactos en `dist/`, y CodePipeline los despliega automáticamente.

7. **Paso 5 - Review:**
   - Revisa la configuración
   - Haz clic en **Create pipeline**

#### Paso 4: Crear CodePipeline (AWS CLI)

Crea un archivo `pipeline.json`:

```json
{
  "pipeline": {
    "name": "react-s3-pipeline",
    "roleArn": "arn:aws:iam::TU-ACCOUNT-ID:role/codepipeline-role",
    "artifactStore": {
      "type": "S3",
      "location": "tu-bucket-artefactos"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [
          {
            "name": "SourceAction",
            "actionTypeId": {
              "category": "Source",
              "owner": "AWS",
              "provider": "GitHub",
              "version": "1"
            },
            "outputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "configuration": {
              "Owner": "tu-usuario",
              "Repo": "tu-repositorio",
              "Branch": "main",
              "OAuthToken": "tu-token-github"
            }
          }
        ]
      },
      {
        "name": "Build",
        "actions": [
          {
            "name": "BuildAction",
            "actionTypeId": {
              "category": "Build",
              "owner": "AWS",
              "provider": "CodeBuild",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "outputArtifacts": [
              {
                "name": "BuildOutput"
              }
            ],
            "configuration": {
              "ProjectName": "react-s3-deploy",
              "EnvironmentVariables": "[{\"name\":\"S3_BUCKET\",\"value\":\"tu-bucket-hosting\",\"type\":\"PLAINTEXT\"}]"
            }
          }
        ]
      },
      {
        "name": "Deploy",
        "actions": [
          {
            "name": "DeployAction",
            "actionTypeId": {
              "category": "Deploy",
              "owner": "AWS",
              "provider": "S3",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "BuildOutput"
              }
            ],
            "configuration": {
              "BucketName": "tu-bucket-hosting",
              "Extract": "false"
            }
          }
        ]
      }
    ]
  }
}
```

Crea el pipeline:
```bash
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

#### Paso 5: Configurar Variables de Entorno en CodePipeline

**Opción A: En la etapa de Build (Recomendado)**

1. Edita el pipeline
2. Selecciona la etapa **Build**
3. Haz clic en **Edit** en la acción de build
4. Desplázate hasta **Environment variables**
5. Agrega:
   - **Name**: `S3_BUCKET`
   - **Value**: `tu-bucket-hosting`
6. Guarda los cambios

**Opción B: Ya configurado en CodeBuild**

Si ya configuraste `S3_BUCKET` en el proyecto CodeBuild, el pipeline lo usará automáticamente.

#### Paso 6: Ejecutar el Pipeline

El pipeline se ejecutará automáticamente cuando:
- Haces push al repositorio (si configuraste webhooks)
- Ejecutas manualmente desde la consola
- Usas AWS CLI:

```bash
aws codepipeline start-pipeline-execution --name react-s3-pipeline
```

#### Flujo del Pipeline

1. **Source Stage**: Obtiene el código del repositorio
2. **Build Stage**: 
   - Ejecuta `buildspec.yml`
   - Instala dependencias
   - Ejecuta tests
   - Genera el build en `dist/`
   - Despliega a S3 (si `S3_BUCKET` está configurado)
3. **Deploy Stage**: Copia los artefactos de `dist/` al bucket de hosting

#### Ventajas de CodePipeline

- ✅ Orquestación completa del flujo CI/CD
- ✅ Visualización del pipeline en la consola
- ✅ Historial de ejecuciones
- ✅ Notificaciones integradas (SNS)
- ✅ Aprobaciones manuales (opcional)
- ✅ Múltiples ambientes (dev, staging, prod)

#### Configurar Notificaciones (Opcional)

Para recibir notificaciones cuando el pipeline se ejecuta:

1. Crea un tema SNS
2. En el pipeline, agrega una etapa de notificación
3. O configura CloudWatch Events para enviar notificaciones

## 🔧 Configuración Adicional

### Variables de Entorno

La variable `S3_BUCKET` es necesaria para el despliegue automático. Puedes configurarla en:

#### En CodeBuild:

1. **Consola AWS:**
   - CodeBuild → Tu proyecto → Edit → Environment
   - Agrega variable: `S3_BUCKET` = `tu-bucket-hosting`

2. **AWS CLI:**
```bash
aws codebuild update-project \
  --name react-s3-deploy \
  --environment environmentVariables='[{name=S3_BUCKET,value=tu-bucket-hosting,type=PLAINTEXT}]'
```

#### En CodePipeline:

1. **Consola AWS:**
   - CodePipeline → Tu pipeline → Edit
   - Build stage → Edit acción → Environment variables
   - Agrega: `S3_BUCKET` = `tu-bucket-hosting`

2. **En el JSON del pipeline:**
```json
"configuration": {
  "ProjectName": "react-s3-deploy",
  "EnvironmentVariables": "[{\"name\":\"S3_BUCKET\",\"value\":\"tu-bucket-hosting\",\"type\":\"PLAINTEXT\"}]"
}
```

#### Variables Disponibles:

- `S3_BUCKET` (requerida): Nombre del bucket S3 de destino
- `AWS_REGION` (opcional): Región de AWS (por defecto usa la región del pipeline)

El `buildspec.yml` ya está configurado para usar estas variables.

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

- El archivo `buildspec.yml` está configurado para **CodePipeline**: genera build y crea artefactos. **NO despliega** (el despliegue lo maneja CodePipeline en la etapa Deploy)
- Si usas **solo CodeBuild** (sin pipeline), necesitas agregar el despliegue manualmente en `post_build` (ver Opción 2)
- Los tests incluidos son **simples y referenciales** - el enfoque está en el pipeline CI/CD, no en cobertura completa
- Los artefactos se generan en la carpeta `dist/`
- **Separación de responsabilidades**: Build genera artefactos, Deploy los despliega
- Asegúrate de que el bucket S3 tenga habilitado el hosting estático
- Para producción, considera usar CloudFront para CDN y HTTPS

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

