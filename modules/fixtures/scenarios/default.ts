import { Universe } from "atomic-object/blueprints";
import * as Blueprint from "blueprints";
import { toIsoDate } from "core/date-iso";
import { addMonths } from "date-fns";
import { Knex } from "db";
import { Context } from "graphql-api/context";
import * as faker from "faker";

export async function seed(knex: Knex): Promise<null> {
  const context = new Context({ db: knex, redisDisabled: true });
  const universe = new Universe(context);

  for (let i = 0; i <= 100; i++) {
    await universe.insert(Blueprint.employee, {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      suffix: faker.name.suffix(),
      jobTitle: faker.name.jobTitle(),
    });
  }

  await context.destroy();
  return Promise.resolve(null);
}
