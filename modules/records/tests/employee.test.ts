import { withContext } from "__tests__/db-helpers";
import * as Blueprints from "blueprints";
import * as DateTimeIso from "core/date-time-iso";

describe("EmployeeRecord", () => {
  describe("rows", () => {
    it(
      "retrieves rows in default order given limit and offset",
      withContext(async (ctx, { universe }) => {
        const date1 = DateTimeIso.toIsoDateTime(new Date(2020, 3, 1));
        const date2 = DateTimeIso.toIsoDateTime(new Date(2020, 3, 2));
        const date3 = DateTimeIso.toIsoDateTime(new Date(2020, 3, 3));
        const date4 = DateTimeIso.toIsoDateTime(new Date(2020, 3, 4));
        const date5 = DateTimeIso.toIsoDateTime(new Date(2020, 3, 5));
        const date6 = DateTimeIso.toIsoDateTime(new Date(2020, 3, 6));

        const dates = [date1, date2, date3, date4, date5, date6];

        for (const date of dates) {
          await universe.insert(Blueprints.employee, {
            createdAt: date,
          });
        }

        const result = await ctx.repos.employees.rows({
          cursor: date1,
          limit: 2,
        });

        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              createdAt: date1,
            }),
            expect.objectContaining({
              createdAt: date2,
            }),
          ])
        );

        const result2 = await ctx.repos.employees.rows({
          cursor: date4,
          limit: 3,
        });

        expect(result2).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              createdAt: date4,
            }),
            expect.objectContaining({
              createdAt: date5,
            }),
            expect.objectContaining({
              createdAt: date6,
            }),
          ])
        );
      })
    );
  });
});
