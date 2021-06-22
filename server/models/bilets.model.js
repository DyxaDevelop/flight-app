module.exports = (sequelize, Sequelize) => {
  const Bilets = sequelize.define("bilets", {
    countryDep: {
      type: Sequelize.STRING,
    },
    countryArr: {
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.STRING,
    },
    minPrice: {
      type: Sequelize.STRING,
    },
    transporter: {
      type: Sequelize.STRING,
    },
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    userID: {
      type: Sequelize.STRING,
    },
  });
  return Bilets;
};
