'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'isBonusEligible', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'isBonusEligible');
  },
};

/** psql -h localhost -U francesco -d nest-shop -p 5434  - запуск бд */
/** npx sequelize-cli migration:generate --name add-isBonusEligible-to-products  - +миграция */
/**  npx sequelize-cli db:migrate - запуск миграции */
/** stripe listen --forward-to localhost:5000/webhook - запуск вебхука */
