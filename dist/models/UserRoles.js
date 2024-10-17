"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class UserRoles extends sequelize_1.Model {
    id;
    user_id;
    role_id;
    static initModel(sequelize) {
        UserRoles.init({
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
            role_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "roles",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        }, {
            sequelize,
            tableName: "user_roles",
            timestamps: false,
        });
    }
    static associate(models) {
        UserRoles.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        UserRoles.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });
    }
}
exports.default = UserRoles;
