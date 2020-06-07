import { QueryResolvers } from "graphql-api/server-types.gen";
import { MinimalUser } from "./user";
import * as faker from "faker";

faker.seed(123);
const fakedOutRows = new Array(100).fill(true).map((_, i) => ({
  id: faker.random.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  suffix: faker.name.suffix(),
  job: faker.name.jobDescriptor(),
  index: i,
}));

const loggedInUser: QueryResolvers.LoggedInUserResolver<
  Promise<MinimalUser>
> = async (parent, args, context, info) => {
  return await context.getCurrentUser();
};

const getRowPage: QueryResolvers.GetRowPageResolver = async (
  parent,
  args,
  ctx
) => {
  const end = args.offset + args.limit;
  const rows = fakedOutRows.slice(args.offset, end);
  return { rows, pageInfo: { hasNextRow: end < fakedOutRows.length } };
};

export default {
  loggedInUser,
  getRowPage,
};
