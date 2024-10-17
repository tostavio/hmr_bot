import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";

export default class Record extends Model {
  public id!: number;
  public user_id!: number;
  public channel_id!: string;
  public stay_time!: number;

  static initModel(sequelize: Sequelize) {
    Record.init(
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
        discord_channel_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        stay_time: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        leave_at: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        tableName: "records",
        timestamps: true,
      }
    );
  }

  static associate(models: any) {
    Record.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}
