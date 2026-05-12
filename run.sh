#!/bin/bash

# Valores por defecto
HOST_PORT=3000
CONTAINER_PORT=3000 #! No dinamco, no cambiar
IMAGE_NAME="jub-service-ui"
CONTAINER_NAME=""

# Parseo de argumentos
for arg in "$@"
do
  case $arg in
    --host-port=*)
      HOST_PORT="${arg#*=}"
      ;;
    --name=*)
      CONTAINER_NAME="${arg#*=}"
      ;;
  esac
done

echo "Verificando si existe la imagen '$IMAGE_NAME'..."

# Verifica si la imagen existe localmente
if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
  echo "Imagen no encontrada. Construyendo..."
  docker build -t "$IMAGE_NAME" .
else
  echo "Imagen encontrada. Usando imagen existente."
fi

echo "Levantando contenedor..."
echo "Host: $HOST_PORT -> Container: $CONTAINER_PORT"

# Construir comando base
DOCKER_CMD="docker run -p ${HOST_PORT}:${CONTAINER_PORT}"

# Agregar nombre solo si fue especificado
if [ -n "$CONTAINER_NAME" ]; then
  DOCKER_CMD="$DOCKER_CMD --name $CONTAINER_NAME"
  echo "Nombre del contenedor: $CONTAINER_NAME"
fi

DOCKER_CMD="$DOCKER_CMD $IMAGE_NAME"

# Ejecutar
eval $DOCKER_CMD#!/bin/bash

# Valores por defecto
HOST_PORT=3000
CONTAINER_PORT=3000
IMAGE_NAME="jub-service-ui"
CONTAINER_NAME=""

# Parseo de argumentos
for arg in "$@"
do
  case $arg in
    --host-port=*)
      HOST_PORT="${arg#*=}"
      ;;
    --container-port=*)
      CONTAINER_PORT="${arg#*=}"
      ;;
    --name=*)
      CONTAINER_NAME="${arg#*=}"
      ;;
  esac
done

echo "Verificando si existe la imagen '$IMAGE_NAME'..."

# Verifica si la imagen existe localmente
if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
  echo "Imagen no encontrada. Construyendo..."
  docker build -t "$IMAGE_NAME" .
else
  echo "Imagen encontrada. Usando imagen existente."
fi

echo "Levantando contenedor..."
echo "Host: $HOST_PORT -> Container: $CONTAINER_PORT"

# Construir comando base
DOCKER_CMD="docker run -p ${HOST_PORT}:${CONTAINER_PORT}"

# Agregar nombre solo si fue especificado
if [ -n "$CONTAINER_NAME" ]; then
  DOCKER_CMD="$DOCKER_CMD --name $CONTAINER_NAME"
  echo "Nombre del contenedor: $CONTAINER_NAME"
fi

DOCKER_CMD="$DOCKER_CMD $IMAGE_NAME"

# Ejecutar
eval $DOCKER_CMD