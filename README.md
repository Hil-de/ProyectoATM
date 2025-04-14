# 💳 Proyecto ATM - Cajero Automático

Este es un sistema de cajero automático desarrollado con **TypeScript**, **Node.js**, **Express**, **MongoDB** y **Jest**. Permite a los usuarios realizar operaciones como depósitos, retiros, consultas de saldo y más.

## 🚀 Tecnologías utilizadas

- TypeScript
- Node.js
- Express
- MongoDB (Mongoose)
- Jest (Testing)
- Docker 
- Arquitectura limpia (Clean Architecture)

## 📁 Estructura del proyecto

```
ProyectoATM/
├── src/
│   ├── config/          # Conexión a la base de datos y logger
│   ├── controllers/     # Lógica 
│   ├── models/          # Esquemas de Mongoose
│   ├── routes/          # Endpoints REST
│   ├── services/        # Clases con lógica de negocio
│   ├── tests/           # Pruebas unitarias e integrales
│   ├── atm-console.ts   # Probar programa por la consola
│   └── index.ts         # Punto de entrada
├── .gitignore           # Archivos/Carpetas que Git debe ignorar
├── docker-compose.yml   # Configuración de Docker para MongoDB
├── jest.config.js       # Configuración de Jest para pruebas
├── package.json         # Dependencias y scripts del proyecto
├── package-lock.json    # Versión exacta de dependencias instaladas
├── tsconfig.json        # Configuración del compilador TypeScript

```

## ⚙️ Instalación

1. Clona el repositorio:
```bash
   git clone https://github.com/tu-usuario/proyecto-atm.git
   cd proyecto-atm
   ```

2. Instala las dependencias:
```bash
   npm install
   ```

3. Inicia el proyecto:
```bash
   npm run dev
   ```

5. Para correr los tests:
```bash
   npm run test
   ```
6. Para probar el proyecto con el archivo atm-console.ts
 ```bash
   npx ts-node src/atm-console.ts
   ```
## 📌 Funcionalidades principales

- Registro y consulta de clientes
- Creación y vinculación de cuentas
- Administración de tarjetas y PIN
- Realización de transacciones (retiros, depósitos)
- Generación de cierres diarios del ATM
- Pruebas unitarias e integrales

## 📮 Endpoints REST (ejemplos)

- `GET /api/clientes`
- `POST /api/cuentas`
- `POST /api/tarjetas/verificar-pin`
- `POST /api/atm/depositar`
- `POST /api/atm/retirar`

## 🧪 Pruebas

Este proyecto incluye pruebas **unitarias** y **de integración** usando Jest. Puedes encontrar los archivos en la carpeta `src/tests`.

