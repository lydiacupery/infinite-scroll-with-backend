import { QueryResolvers } from "graphql-api/server-types.gen";
import { MinimalUser } from "./user";
import * as faker from "faker";
import { keyBy } from "lodash-es";

faker.seed(123);
const fakedOutRows = new Array(100).fill(true).map((_, i) => ({
  id: faker.random.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  suffix: faker.name.suffix(),
  job: faker.name.jobDescriptor(),
  index: i,
}));

const rowIdToRow = keyBy(fakedOutRows, "id");

const loggedInUser: QueryResolvers.LoggedInUserResolver<
  Promise<MinimalUser>
> = async (parent, args, context, info) => {
  return await context.getCurrentUser();
};

const getRowsConnection: QueryResolvers.GetRowsConnectionResolver = async (
  parent,
  args,
  ctx
) => {
  const startIndex = args.startCursor ? rowIdToRow[args.startCursor].index : 0;
  const end = startIndex + args.limit;
  const endIndex = end < fakedOutRows.length ? end : fakedOutRows.length - 1;
  const rows = fakedOutRows.slice(startIndex, end);
  return {
    rows,
    pageInfo: {
      hasNextRow: endIndex < fakedOutRows.length,
      startCursor: fakedOutRows[startIndex].id,
      endCursor: fakedOutRows[endIndex].id,
    },
    totalCount: fakedOutRows.length,
  };
};

export default {
  loggedInUser,
  getRowsConnection,
};
