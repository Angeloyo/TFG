# Despliegue de la Aplicación Web

## 🌐 Motivación

He decidido hacer pública la web app que se está desarrollando para una más fácil supervisión por parte de los tutores y para permitir el acceso general a quien le interese una vez acabado el TFG.

## 🎨 Frontend - Vercel

### Despliegue en Producción
El frontend está desplegado en **Vercel**, conectado directamente al repositorio de GitHub para CI/CD automático.

### Desarrollo Local
Para desarrollo del frontend:

```bash
cd frontend
npm run dev
```

## 🔧 Backend - CloudFlare Tunnel

### Despliegue en Producción
El backend está ejecutándose en una máquina virtual en mi casa, accesible públicamente mediante **CloudFlare Tunnels**.

**URL de producción**: `https://tfg-api.angeloyo.com`

### Desarrollo Local
Para desarrollo del backend:

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8088 --host 0.0.0.0
```

## 🖥️ Infraestructura

- **Frontend**: Vercel (despliegue automático desde GitHub)
- **Backend**: Máquina virtual en casa + CloudFlare Tunnel
- **Base de Datos**: MongoDB local (48GB dataset completo + demo)
  - Demo: `localhost:27017/mimic_iv_demo`
  - Full: `localhost:27018/mimic_iv_full`

## 🔗 Acceso

- **Frontend**: [tfg.angeloyo.com](https://tfg.angeloyo.com) (próximamente)
- **API Backend**: [tfg-api.angeloyo.com](https://tfg-api.angeloyo.com)