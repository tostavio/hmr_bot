"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Role extends sequelize_1.Model {
    id;
    discord_role_id;
    discord_role_name;
    static initModel(sequelize) {
        Role.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            discord_role_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            discord_role_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_guild_role: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
        }, {
            sequelize,
            tableName: "roles",
            timestamps: true,
            underscored: true,
        });
    }
    static associate(models) {
        Role.belongsToMany(models.User, {
            through: models.UserRoles,
            foreignKey: "role_id",
            as: "users",
        });
    }
}
exports.default = Role;
