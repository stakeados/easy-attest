# Dokploy Deployment Guide / Guía de Despliegue en Dokploy

[English](#english) | [Español](#español)

---

<a name="english"></a>
## 🇬🇧 English: Deploying on Dokploy (VPS)

This guide details how to deploy Easy Attest on your own server using [Dokploy](https://dokploy.com/).

### 1. Prerequisites

*   A VPS server (Hetzner, DigitalOcean, AWS, etc.) with Dokploy installed.
*   A domain or subdomain pointing to your VPS (e.g., `app.yourdomain.com`).
*   This repository pushed to GitHub/GitLab (private or public).

### 2. Project Preparation

The project is already configured for Docker deployment:
*   ✅ `next.config.ts`: Configured with `output: 'standalone'` to optimize the Docker image.
*   ✅ `Dockerfile`: Included in the root to build the application on Node.js 18.
*   ✅ `.dockerignore`: Configured to ignore unnecessary files.

### 3. Dokploy Configuration

1.  **Create Project:**
    *   Enter your Dokploy dashboard.
    *   Create a new project or select an existing one (e.g., "Easy Attest").

2.  **Create Service (Application):**
    *   Click "Create Service" -> "Application".
    *   Name it (e.g., `easy-attest`).
    *   Select **GitHub** (or your Git provider) as the source.
    *   Choose the repository and branch (`main` or `master`).

3.  **Configure Build (Important):**
    *   In the **"Build"** tab, ensure **"Docker"** is selected (not Nixpacks or Heroku Buildpacks, as we have a custom Dockerfile).
    *   **Docker Path:** Leave as `./Dockerfile`.
    *   **Context Path:** Leave as `.`.

4.  **Environment Variables:**
    Go to the **"Environment"** tab and add the following variables. Copy values from your local `.env.local`:

    ```env
    # Base Network (8453 for Mainnet, 84532 for Sepolia)
    NEXT_PUBLIC_CHAIN_ID=8453
    
    # RPC URL (Use a private Alchemy/Infura one for better performance)
    NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

    # EAS Contracts on Base
    NEXT_PUBLIC_EAS_CONTRACT_ADDRESS=0x4200000000000000000000000000000000000021
    NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS=0x4200000000000000000000000000000000000020
    
    # Indexer (The Graph)
    NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/STUDIO_ID/easy-attest/version/latest

    # (Optional) If using Redis for cache
    UPSTASH_REDIS_REST_URL=
    UPSTASH_REDIS_REST_TOKEN=
    ```

5.  **Domain:**
    *   In the **"Domains"** tab, add your domain (e.g., `app.yourdomain.com`).
    *   Dokploy will automatically generate the SSL certificate (HTTPS).

### 4. Deploy

1.  Click the **"Deploy"** button.
2.  Watch the logs in the "Logs" tab.
3.  The process will take a few minutes: downloading dependencies, building Next.js, and starting the container.

---

<a name="español"></a>
## 🇪🇸 Español: Despliegue en Dokploy (VPS)

Esta guía detalla paso a paso cómo desplegar Easy Attest en tu propio servidor usando [Dokploy](https://dokploy.com/).

### 1. Requisitos Previos

*   Un servidor VPS (Hetzner, DigitalOcean, AWS, etc.) con Dokploy instalado.
*   Un dominio o subdominio apuntando a tu VPS (ej. `app.midominio.com`).
*   Los archivos de este repositorio subidos a GitHub/GitLab (privado o público).

### 2. Preparación del Proyecto

El proyecto ya está configurado para despliegue en Docker:
*   ✅ `next.config.ts`: Configurado con `output: 'standalone'` para optimizar la imagen Docker.
*   ✅ `Dockerfile`: Incluido en la raíz para construir la aplicación en Node.js 18.
*   ✅ `.dockerignore`: Configurado para ignorar archivos innecesarios.

### 3. Configuración en Dokploy

1.  **Crear Proyecto:**
    *   Entra a tu panel de Dokploy.
    *   Crea un nuevo proyecto o selecciona uno existente (ej. "Easy Attest").

2.  **Crear Servicio (Application):**
    *   Haz clic en "Create Service" -> "Application".
    *   Ponle un nombre (ej. `easy-attest`).
    *   Selecciona **GitHub** (o tu proveedor Git) como fuente.
    *   Elige el repositorio y la rama (`main` o `master`).

3.  **Configurar Build (Importante):**
    *   En la pestaña **"Build"**, asegúrate de que esté seleccionado **"Docker"** (no Nixpacks ni Heroku Buildpacks, ya que tenemos un Dockerfile custom).
    *   **Docker Path:** Déjalo en `./Dockerfile`.
    *   **Context Path:** Déjalo en `.`.

4.  **Variables de Entorno (Environment):**
    Ve a la pestaña **"Environment"** y añade las siguientes variables. Copia los valores de tu `.env.local` local:

    ```env
    # Red Base (8453 para Mainnet, 84532 para Sepolia)
    NEXT_PUBLIC_CHAIN_ID=8453
    
    # URL RPC (Usa una propia de Alchemy/Infura si es posible para mejor rendimiento)
    NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

    # Contratos EAS en Base
    NEXT_PUBLIC_EAS_CONTRACT_ADDRESS=0x4200000000000000000000000000000000000021
    NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS=0x4200000000000000000000000000000000000020
    
    # Indexador (The Graph)
    NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/STUDIO_ID/easy-attest/version/latest

    # (Opcional) Si usas Redis para caché
    UPSTASH_REDIS_REST_URL=
    UPSTASH_REDIS_REST_TOKEN=
    ```

5.  **Dominio:**
    *   En la pestaña **"Domains"**, añade tu dominio (ej. `app.midominio.com`).
    *   Dokploy generará automáticamente el certificado SSL (HTTPS).

### 4. Desplegar

1.  Haz clic en el botón **"Deploy"**.
2.  Observa los logs en la pestaña "Logs".
3.  El proceso tomará unos minutos: descargará dependencias, compilará Next.js y levantará el contenedor.

### 5. Solución de Problemas Comunes

*   **Error de Memoria:** Si el build falla por memoria (común en VPS pequeños), intenta aumentar la Swap de tu servidor o usa una máquina con al menos 2GB-4GB de RAM.
*   **Env Vars Faltantes:** Si la app arranca pero da error 500 o no conecta, verifica que `NEXT_PUBLIC_...` estén bien puestas. Recuerda que las variables públicas se "queman" en el build, así que si cambias una, debes **re-deploy** el proyecto.
