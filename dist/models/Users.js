"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    id;
    discord_member_id;
    discord_display_name;
    // Inicializa o modelo com sequelize
    static initModel(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            discord_member_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            discord_display_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            guild_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: "users",
            timestamps: true,
            underscored: true,
        });
    }
    // Configura as associações
    static associate(models) {
        User.hasMany(models.Record, { foreignKey: "user_id", as: "records" });
        User.belongsToMany(models.Role, {
            through: models.UserRoles,
            foreignKey: "user_id",
            as: "roles",
        });
    }
}
exports.default = User;
