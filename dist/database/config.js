"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.sequelize = exports.syncDatabase = void 0;
const sequelize_1 = require("sequelize");
const fs_1 = require("fs");
const path_1 = require("path");
const sqlite3_1 = __importDefault(require("sqlite3"));
console.log("Iniciando configuração do banco de dados...");
const dbPath = (0, path_1.join)(__dirname, "db.sqlite"); // Caminho ajustado para o banco de dados
console.log("Caminho do banco de dados SQLite:", dbPath);
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: process.env.SEQUELIZE_LOG === "true" ? console.log : false,
    dialectOptions: {
        foreignKeys: true,
        mode: sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE | sqlite3_1.default.OPEN_FULLMUTEX,
    },
});
exports.sequelize = sequelize;
console.log("Instância Sequelize criada com sucesso.");
// Use __dirname para definir o caminho para models
const modelsPath = (0, path_1.resolve)(__dirname, "../models"); // Caminho relativo dinâmico para models
console.log("Caminho para a pasta models:", modelsPath);
const basename = (0, path_1.basename)(__filename);
const models = {};
exports.models = models;
// Carrega todos os arquivos de model na pasta "models"
const modelFiles = (0, fs_1.readdirSync)(modelsPath).filter((file) => {
    console.log(`Verificando arquivo: ${file}`); // Log de cada arquivo verificado
    return (file.indexOf(".") !== 0 &&
        (file.slice(-3) === ".ts" || file.slice(-3) === ".js")); // Aqui estamos trabalhando com arquivos TypeScript
});
if (modelFiles.length === 0) {
    console.error("Nenhum arquivo de model encontrado!");
}
else {
    console.log(`${modelFiles.length} arquivos de model encontrados.`);
}
modelFiles.forEach((file) => {
    try {
        const model = require((0, path_1.join)(modelsPath, file)).default;
        models[model.name] = model;
        console.log(`Model ${model.name} carregado com sucesso.`);
    }
    catch (error) {
        console.error(`Erro ao carregar o modelo ${file}:`, error);
    }
});
// Inicializa todos os modelos com a instância do Sequelize
Object.keys(models).forEach((modelName) => {
    if (models[modelName].initModel) {
        try {
            models[modelName].initModel(sequelize);
            console.log(`Modelo ${modelName} inicializado com sucesso.`);
        }
        catch (error) {
            console.error(`Erro ao inicializar o modelo ${modelName}:`, error);
        }
    }
});
// Configura associações, caso existam
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        try {
            models[modelName].associate(models);
            console.log(`Associações do modelo ${modelName} configuradas com sucesso.`);
        }
        catch (error) {
            console.error(`Erro ao configurar associações do modelo ${modelName}:`, error);
        }
    }
});
const syncDatabase = async () => {
    try {
        console.log("Sincronizando o banco de dados...");
        await sequelize.sync({ force: false });
        console.log("Database synchronized successfully.");
    }
    catch (error) {
        console.error("Error synchronizing the database:", error);
    }
};
exports.syncDatabase = syncDatabase;
