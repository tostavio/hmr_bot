import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";

export default class User extends Model {
  public id!: number;
  public discord_member_id!: string;
  public discord_display_name!: string;

  // Inicializa o modelo com sequelize
  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        discord_member_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        discord_display_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        guild_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "users",
        timestamps: true,
        underscored: true,
      }
    );
  }

  // Configura as associações
  static associate(models: any) {
    User.hasMany(models.Record, { foreignKey: "user_id", as: "records" });
    User.belongsToMany(models.Role, {
      through: models.UserRoles,
      foreignKey: "user_id",
      as: "roles",
    });
  }
}
