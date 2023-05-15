"use strict";
const { DataTypes } = require("sequelize");
const { getdays } = require("../config/helper");
const db = require("../models/index");
const watchListModel = db.watchList;
const watchLists_backup = db.watchLists_backup;
const moment = require("moment");
require("dotenv").config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rangeStart = 40500;
    const rangeEnd = 46500;

    const monthsName = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    function getNextDayOfWeek(date, dayOfWeek) {
      var resultDate = new Date(date.getTime());
      resultDate.setDate(
        date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7)
      );
      return resultDate;
    }
    function getNextToNextThurDayOfWeek(date, dayOfWeek) {
      var resultDate = new Date(date.getTime());
      resultDate.setDate(
        date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7) + 7
      );
      return resultDate;
    }
    let date = getNextDayOfWeek(new Date(), 4);
    let daydata = await getdays(date);

    let watchList = await watchListModel.findAll();
    let watchListBackupArr = [];

    for (let i in watchList) {
      const exist = await watchLists_backup.findOne({
        where: { code: watchList[i].code },
      });
      if (!exist) {
        let list = {
          companyName: watchList[i].companyName,
          code: watchList[i].code,
          exchangeType: watchList[i].exchangeType,
        };
        watchListBackupArr = [...watchListBackupArr, list];
      }
      await watchLists_backup.bulkCreate(watchListBackupArr, {
        individualHooks: true,
      });
      await watchListModel.destroy({ where: {} });
    }

    let watchListArr = [];
    let dates = [getNextDayOfWeek(new Date(), 4)];

    if (
      moment().format("DD-MM-YYYY") >=
      moment(getNextDayOfWeek(new Date(), 4))
        .subtract(1, "days")
        .format("DD-MM-YYYY")
    ) {
      dates = [...dates, getNextToNextThurDayOfWeek(new Date(), 4)];
    }

    // for (let i = rangeStart; i <= rangeEnd; i += 100) {
    //   if (i == rangeStart) {
    //     let code = "NIFTY BANK";

    //     let companycode = code.toLowerCase();
    //     companycode = "sd_" + companycode.replace(" ", "_");

    //     companycode +=
    //       "_" +
    //       daydata.day +
    //       "_" +
    //       monthsName[date.getMonth()] +
    //       "_" +
    //       date.getFullYear();

    //     let list = {
    //       companyName: "NIFTY BANK",
    //       code: code,
    //       exchangeType: "NSE",
    //       tableName: companycode,
    //     };
    //     const exist = await watchListModel.findOne({ where: { code: code } });
    //     if (!exist) {
    //       watchListArr = [...watchListArr, list];
    //     }
    //   } // BANKNIFTY2310544700CE

    //   for (let j = 0; j < dates.length; j++) {
    //     let date = new Date(dates[j]);
    //     let datesData = await getdays(date);
    //     let year = datesData.year;
    //     let month = datesData.month;
    //     let day = datesData.day;
    //     let codece = "BANKNIFTY" + year + month + day + i + "CE";
    //     let codepe = "BANKNIFTY" + year + month + day + i + "PE";

    //     let companycodece = codece.toLowerCase();
    //     companycodece = "sd_" + companycodece.replace(" ", "_");
    //     companycodece +=
    //       "_" +
    //       day +
    //       "_" +
    //       monthsName[date.getMonth()] +
    //       "_" +
    //       date.getFullYear();

    //     let companycodepe = codepe.toLowerCase();
    //     companycodepe = "sd_" + companycodepe.replace(" ", "_");
    //     companycodepe +=
    //       "_" +
    //       day +
    //       "_" +
    //       monthsName[date.getMonth()] +
    //       "_" +
    //       date.getFullYear();

    //     let celist = {
    //       companyName: "BANKNIFTY",
    //       code: codece,
    //       exchangeType: "NFO",
    //       tableName: companycodece,
    //     };
    //     let pelist = {
    //       companyName: "BANKNIFTY",
    //       code: codepe,
    //       exchangeType: "NFO",
    //       tableName: companycodepe,
    //     };

    //     const existce = await watchListModel.findOne({
    //       where: { code: codece },
    //     });
    //     const existpe = await watchListModel.findOne({
    //       where: { code: codepe },
    //     });

    //     if (!existce) {
    //       watchListArr = [...watchListArr, celist];
    //     }
    //     if (!existpe) {
    //       watchListArr = [...watchListArr, pelist];
    //     }
    //   }
    //   if (i == rangeEnd) {
    //     await watchListModel.bulkCreate(watchListArr, {
    //       individualHooks: true,
    //     });
    //   }
    // }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
