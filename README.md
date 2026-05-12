
## Tabla de contenido

- [Tabla de contenido](#tabla-de-contenido)
- [Como ejecutar](#como-ejecutar)
  - [Docker](#docker)
    - [Prerrequisitos](#prerrequisitos)
    - [Producción](#producción)
  - [Manual](#manual)
    - [Prerrequisitos](#prerrequisitos-1)
    - [Desarrollo](#desarrollo)
    - [Producción](#producción-1)

## Como ejecutar

Siga los siguientes pasos para desplegar este servicio como le sea conveniente.

### Docker

Es posible construir una imágen a partir de `Docker` con los siguientes pasos.

#### Prerrequisitos

Debe tener una instalación de [Docker](https://docs.docker.com/engine/install/) en su sistema operativo.

#### Producción

1. Ejecute el archivo `run.sh` en la raíz de este repositorio y espere a que se construya su imágen y contenedor:

```bash
    ./run.sh
```
Parámetros:

| Parámetro            | Descripción                                                | Opcional | Tipo de dato | Valor por defecto |
|---------------------|------------------------------------------------------------|----------|--------------|------------------|
| `--host-port`       | Puerto del host donde se expondrá la aplicación            | Sí       | Número (int) | 3000             |
| `--name`            | Nombre opcional del contenedor Docker. Si no se especifica Docker asignará un nombre aleatorio al contenedor.                     | Sí       | Texto (string)| (sin nombre)     |


2. Visite la ruta [http:localhost:3000](https:localhost:3000) donde se desplegó su contenedor. Si especificó el parámetro `--host-port`, entonces reemplace el puerto con el ingresado en el parámetro.




### Manual

Para una configuración manual continue con los siguientes pasos.

#### Prerrequisitos

1. Debe obtener la versión estable mas reciente de [Node.js](https://nodejs.org/en/download) para su sistema.

2. Descargue este repositorio usando `git` con el siguiente comando en su terminal:

```bash
git clone https://github.com/Benevos/jub-service-ui.git
```

3. Coloque su terminal en el directorio raíz del repositorio:

```
cd path/to/jub-service-ui
```

4. Instale las dependencias usando el comando `npm`:
   
```
npm install
```

#### Desarrollo

1. Una vez satisfechos los prerrequisitos, ejecute el siguiente comando para iniciar un entorno de desarrollo:

```bash
npm run dev
```

2. Un mensaje en su terminal como este deberia aparecer:

```bash
▲ Next.js 16.2.4
- Local:         http://localhost:3000
- Network:       http://192.0.0.1:3000
```

3. Dirijiase a la dirección local indicada en el mensaje en su navegador, regularmente [localhost:3000](http://localhost:3000). 

#### Producción

1. Una vez satisfechos los prerrequisitos, ejecute el siguiente comando para iniciar un entorno de producción:

```bash
npm run build
```

2. Cuando termine la construcción, deberá aparecer una carpeta `.next` que en su interior contenga otra llamada `build`. Ejecuté el siguiente comando en la raíz de repositorio:

```bash
npm run start
```

3. Un mensaje en su terminal como este deberia aparecer:

```bash
▲ Next.js 16.2.4
- Local:         http://localhost:3000
- Network:       http://192.0.0.1:3000
```

Para mas información sobre como desplegar instancias de `Next`, consulte la documentación oficial en: [How to deploy your Next.js application](https://nextjs.org/docs/pages/getting-started/deploying).