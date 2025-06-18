# Despliegue de la Aplicación Web

## 🌐 Motivación

He decidido hacer pública la web app que se está desarrollando para una más fácil supervisión por parte de los tutores y para permitir el acceso general a quien le interese una vez acabado el TFG.

## 🚀 Configuración del Entorno de Producción

Para ello, en lugar de ejecutar el servicio con `python app.py` necesitamos algo más profesional pensado para entornos de producción: **Gunicorn**.

### Instalación

```bash
pip install gunicorn
```

### Configuración

Luego comentamos estas lineas de app.py:

```python
# if __name__ == "__main__":
#     app.run(debug=True) 
```

### Ejecución

Y podemos ejecutar:

```bash
gunicorn app:app --bind 0.0.0.0:8091 --workers 21 --threads 2 --daemon
```

## 🖥️ Infraestructura

Todo se está ejecutando en una máquina virtual encendida las 24 horas en mi casa.

Para permitir el acceso a mi red y habilitar el SSL utilizo **CloudFlare Tunnels**.

## 🔗 Acceso

Finalmente la aplicación web está disponible en: [tfg.angeloyo.com](https://tfg.angeloyo.com)