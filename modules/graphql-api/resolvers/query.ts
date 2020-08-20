import { QueryResolvers } from "graphql-api/server-types.gen";
import * as faker from "faker";
import { keyBy } from "lodash-es";

// faker.seed(123);
// const fakedOutRows = new Array(100).fill(true).map((_, i) => ({
//   id: faker.random.uuid(),
//   firstName: faker.name.firstName(),
//   lastName: faker.name.lastName(),
//   suffix: faker.name.suffix(),
//   job: faker.name.jobDescriptor(),
//   index: i,
// }));

// const rowIdToRow = keyBy(fakedOutRows, "id");

const getRowsConnection: QueryResolvers.GetRowsConnectionResolver = async (
  parent,
  args,
  ctx
) => {
  const totalCount = ctx.repos.employees.count();
  const rows = await ctx.repos.employees.rows({
    ...(args.startCursor && { cursor: args.startCursor }),
    limit: args.count + 1,
  });
  console.log({ rows });

  return {
    rows: rows.slice(0, args.count),
    pageInfo: {
      hasNextRow: rows.length === args.count + 1, // there is a row after the current
      startCursor: rows[0] && rows[0].createdAt,
      endCursor: rows[args.count] && rows[args.count].createdAt,
    },
    totalCount,
  };
};

export default {
  getRowsConnection,
};
