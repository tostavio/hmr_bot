"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Record extends sequelize_1.Model {
    id;
    user_id;
    channel_id;
    stay_time;
    static initModel(sequelize) {
        Record.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            discord_channel_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            stay_time: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
            leave_at: {
                type: sequelize_1.DataTypes.DATE,
            },
        }, {
            sequelize,
            tableName: "records",
            timestamps: true,
        });
    }
    static associate(models) {
        Record.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
}
exports.default = Record;
