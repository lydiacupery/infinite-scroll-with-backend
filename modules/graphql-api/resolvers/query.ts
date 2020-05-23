import { QueryResolvers } from "graphql-api/server-types.gen";
import { MinimalUser } from "./user";
import * as faker from "faker";

const fakedOutRows = new Array(1000).fill(true).map(() => ({
  id: faker.random.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  suffix: faker.name.suffix(),
  job: faker.name.jobDescriptor(),
}));

const loggedInUser: QueryResolvers.LoggedInUserResolver<
  Promise<MinimalUser>
> = async (parent, args, context, info) => {
  return await context.getCurrentUser();
};

const getRows: QueryResolvers.GetRowsResolver = async (parent, args, ctx) => {
  return fakedOutRows.slice(args.offset, args.offset + args.limit);
};

export default {
  loggedInUser,
  getRows,
};
