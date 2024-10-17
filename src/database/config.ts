import { Sequelize } from "sequelize";
import { readdirSync } from "fs";
import { join, resolve, basename as _basename } from "path";
import sqlite3 from "sqlite3";

console.log("Iniciando configuração do banco de dados...");

const dbPath = join(__dirname, "db.sqlite"); // Caminho ajustado para o banco de dados
console.log("Caminho do banco de dados SQLite:", dbPath);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: process.env.SEQUELIZE_LOG === "true" ? console.log : false,
  dialectOptions: {
    foreignKeys: true,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX,
  },
});

console.log("Instância Sequelize criada com sucesso.");

// Use __dirname para definir o caminho para models
const modelsPath = resolve(__dirname, "../models"); // Caminho relativo dinâmico para models
console.log("Caminho para a pasta models:", modelsPath);

const basename = _basename(__filename);
const models: any = {};

// Carrega todos os arquivos de model na pasta "models"
const modelFiles = readdirSync(modelsPath).filter((file) => {
  console.log(`Verificando arquivo: ${file}`); // Log de cada arquivo verificado
  return (
    file.indexOf(".") !== 0 &&
    (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
  ); // Aqui estamos trabalhando com arquivos TypeScript
});

if (modelFiles.length === 0) {
  console.error("Nenhum arquivo de model encontrado!");
} else {
  console.log(`${modelFiles.length} arquivos de model encontrados.`);
}

modelFiles.forEach((file) => {
  try {
    const model = require(join(modelsPath, file)).default;
    models[model.name] = model;
    console.log(`Model ${model.name} carregado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao carregar o modelo ${file}:`, error);
  }
});

// Inicializa todos os modelos com a instância do Sequelize
Object.keys(models).forEach((modelName) => {
  if (models[modelName].initModel) {
    try {
      models[modelName].initModel(sequelize);
      console.log(`Modelo ${modelName} inicializado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao inicializar o modelo ${modelName}:`, error);
    }
  }
});

// Configura associações, caso existam
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    try {
      models[modelName].associate(models);
      console.log(
        `Associações do modelo ${modelName} configuradas com sucesso.`
      );
    } catch (error) {
      console.error(
        `Erro ao configurar associações do modelo ${modelName}:`,
        error
      );
    }
  }
});

export const syncDatabase = async () => {
  try {
    console.log("Sincronizando o banco de dados...");
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
};

export { sequelize, models };
