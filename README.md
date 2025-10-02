# biblioteca--back-end

VIDEO: https://youtu.be/D06B8lgUy5A?si=WsdJOFlwE9nA1PJ0
Backend para un sistema de gestión de biblioteca desarrollado con **Node.js, Express y MongoDB Atlas**.

---

## 🚀 Tecnologías

- Node.js
- Express.js
- MongoDB Atlas / MongoDB Local
- Mongoose
- dotenv
- nodemon (para desarrollo)

---

## ⚙️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/backend-biblioteca.git

2. Instala las dependencias:
npm install

3. Configura la base de datos en un archivo .env en la raíz del proyecto:
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster0.mongodb.net/biblioteca?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta

📌 Si usas MongoDB local:
MONGO_URI=mongodb://localhost:27017/biblioteca


4. Inicia el servidor:
npm start


o en modo desarrollo:
npm run dev

📦 Estructura del Proyecto

src/
├── config/
│   └── database.js        # Conexión a MongoDB
├── controllers/           # Lógica de negocio
│   ├── autoresController.js
│   ├── librosController.js
│   ├── prestamosController.js
│   └── usuariosController.js
├── models/                # Modelos de Mongoose
│   ├── Autor.js
│   ├── Libro.js
│   ├── Prestamo.js
│   └── Usuario.js
├── routes/                # Rutas de la API
│   ├── autores.js
│   ├── libros.js
│   ├── prestamos.js
│   └── usuarios.js
├── index.js               # Punto de entrada
└── .env                   # Variables de entorno
📡 API Endpoints
👤 Usuarios

POST /api/usuarios → Crear usuario

GET /api/usuarios → Listar todos los usuarios

GET /api/usuarios/:id → Obtener usuario por ID

PUT /api/usuarios/:id → Actualizar usuario

DELETE /api/usuarios/:id → Eliminar usuario

📘 Libros

POST /api/libros → Crear libro

GET /api/libros → Listar libros

GET /api/libros/:id → Obtener libro por ID

PUT /api/libros/:id → Actualizar libro

DELETE /api/libros/:id → Eliminar libro

✍️ Autores

POST /api/autores → Crear autor

GET /api/autores → Listar autores

GET /api/autores/:id → Obtener autor por ID

PUT /api/autores/:id → Actualizar autor

DELETE /api/autores/:id → Eliminar autor

📖 Préstamos

POST /api/prestamos → Crear préstamo

GET /api/prestamos → Listar préstamos

GET /api/prestamos/:id → Obtener préstamo por ID

PUT /api/prestamos/:id → Actualizar préstamo

PUT /api/prestamos/:id/return → Devolver préstamo

DELETE /api/prestamos/:id → Eliminar préstamo

🎨 Uso con Frontend

Este backend está pensado para ser consumido desde un frontend sencillo en HTML/CSS/JS o frameworks modernos como React (Vite).

Configurar CORS en index.js si el frontend está en otro dominio.

Todos los endpoints devuelven datos en JSON.

☁️ Despliegue

Backend: puede desplegarse en Render o Heroku.

Frontend: Vercel u otro servicio.

Base de datos: MongoDB Atlas.
