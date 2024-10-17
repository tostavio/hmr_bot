import User from "../models/Users"; // Importar o modelo específico
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> {
  // Você pode adicionar métodos específicos aqui, se necessário
}
