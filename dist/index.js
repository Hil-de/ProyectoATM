"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
const port = 3000;
// Conectar a la base de datos
(0, db_1.default)();
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
