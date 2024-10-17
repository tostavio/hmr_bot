import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";

export default class UserRoles extends Model {
  public id!: number;
  public user_id!: number;
  public role_id!: number;

  static initModel(sequelize: Sequelize) {
    UserRoles.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "roles",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: "user_roles",
        timestamps: false,
      }
    );
  }

  static associate(models: any) {
    UserRoles.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    UserRoles.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });
  }
}
