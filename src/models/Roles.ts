import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";

export default class Role extends Model {
  public id!: number;
  public discord_role_id!: string;
  public discord_role_name!: string;

  static initModel(sequelize: Sequelize) {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        discord_role_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        discord_role_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_guild_role: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "roles",
        timestamps: true,
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    Role.belongsToMany(models.User, {
      through: models.UserRoles,
      foreignKey: "role_id",
      as: "users",
    });
  }
}
