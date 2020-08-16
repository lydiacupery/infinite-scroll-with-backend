import { declareBlueprint, Universe } from "atomic-object/blueprints";
import * as Blueprint from "atomic-object/blueprints/blueprint";
import * as DateIso from "core/date-iso";
import { padStart } from "lodash-es";
import { UnsavedEmployee } from "records/employee";
import * as uuid from "uuid";
import * as DateTimeIso from "core/date-time-iso";

const padToTwoDigits = (n: number) => padStart(n.toString(), 2, "0");

let addDays = (d: Date, numDays: number) => {
  const dd = new Date(+d + numDays * 24 * 60 * 60 * 1000);
  return DateIso.toIsoDate(dd);
};

let plusMinus = (n: number) => Math.floor(Math.random() * (n * 2) - n);
let nextWeekPlusOrMinus = (n: number) => addDays(new Date(), 7 + plusMinus(n));

export const employee = declareBlueprint({
  getRepo: ctx => ctx.repos.employees,
  buildBlueprint: () =>
    Blueprint.design<UnsavedEmployee>({
      firstName: "Ned",
      lastName: "Flanders",
      jobTitle: "Developer",
      suffix: "Jr",
      createdAt: DateTimeIso.now(),
    }),
});

export { Universe };
