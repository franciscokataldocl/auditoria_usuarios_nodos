![App Screenshot](https://www.svgrepo.com/show/376337/node-js.svg)
## Screenshots




# Auditoria usuarios LMS-BLAKBOARD API

Proyecto que corrobora los datos almacenados en AWS-S3,
consultandolos en la api de blackboard [ver api](https://developer.blackboard.com/portal/displayApi)



## Installation

Instalar con npm.

NODEJS VERSION: 20.9.0

## Variables de entorno
Las variables se encuetran en la historia PREMS-64

## Envio de correos electronicos
La aplicación envia por correo electrónico un archivo Excel, estos correos deberan ser ingresados en las variables de entorno en la variable EMAILS_TO_SEND_DATA
como string separados por coma y sin espacios
ej: 
```bash
  EMAILS_TO_SEND_DATA= test@data.cl,test2@data.cl
```

## instalar dependencias
```bash
  npm I
```
## ejecutar proyecto
```bash
  node index.js
```
## Tiempo estimado de ejecución
La aplicación demora un estimado de 30min en terminar la ejecución.
La ejecución termina cuando los emails son enviados.