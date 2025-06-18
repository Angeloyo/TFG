# Entorno de trabajo 🛠️

Para trabajar, de momento, se usará:

- Máquina virtual ubuntu server 24

# Paso de dataset a mongoDB 📊

## Docker 🐳

Instalación de mongoDB con docker

Para instalar docker usamos el siguiente script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
```

```bash
sudo sh get-docker.sh
```

Comprobamos que funciona con:

```bash
sudo docker run hello-world
```

## Portainer 🚢

Para gestión con GUI de docker, desplegamos portainer con:

```bash
sudo docker volume create portainer_data
```

```bash
sudo docker run -d -p 8000:8000 -p 9443:9443 \
    --name portainer \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:lts
```

## MongoDB 🍃

Ahora desplegamos mongoDB. En mi caso debo usar una versión a la 5 por tema de compatibilidad del procesador.

```bash
sudo docker run -d --name mongodb \
    -p 27017:27017 \
    -v ~/mongo-data:/data/db \
    --restart unless-stopped \
    mongo:4.4
```

Comprobamos que está funcionando entrando así:

```bash
sudo docker exec -it mongodb mongo
```

## Mongo-express 🌐

Para visualizar con una GUI la BD desplegamos también mongo express:

```bash
sudo docker run -d --name mongo-express \
    -p 8081:8081 \
    --link mongodb:mongo \
    -e ME_CONFIG_MONGODB_SERVER=mongodb \
    -e ME_CONFIG_BASICAUTH_USERNAME=admin \
    -e ME_CONFIG_BASICAUTH_PASSWORD=admin \
    mongo-express
```

## Script de importación 📥

Ya estamos listos para migrar los datos a la BD, usamos el script `import_mimic.py`

Antes, creamos el entorno virtual python con:

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

Instalamos las dependencias:

```bash
pip install pymongo pandas tqdm
```

Ya estamos listos para ejecutar:

```bash
python import_mimic.py
```