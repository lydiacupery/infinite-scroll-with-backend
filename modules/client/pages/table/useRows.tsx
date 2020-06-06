import { useQuery } from "react-apollo-hooks";
import { GetRows } from "client/graphql/types.gen";
import { ApolloQueryResult } from "apollo-client";

export function useRows():
  | { loading: true; rows: never[]; loadMore: undefined; hasNextRow: true }
  | {
      loading: false;
      rows: any[]; // todo add the type!
      loadMore: (
        offset: number,
        limit: number
      ) => Promise<ApolloQueryResult<any>>;
      hasNextRow: boolean;
    } {
  const { data, loading, fetchMore } = useQuery(GetRows.Document, {
    variables: {
      offset: 0,
      limit: 10, //todo, pass in
    },
  });

  if (loading && !data.getRows) {
    return {
      loading: true,
      rows: [],
      loadMore: undefined,
      hasNextRow: true,
    };
  }

  const loadMore = (offset: number, limit: number) => {
    return fetchMore({
      query: GetRows.Document,
      variables: {
        offset,
        limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          // todo, use immer!
          ...prev,
          getRows: {
            ...prev.getRows,
            rows: [...prev.getRows.rows, ...fetchMoreResult.getRows.rows],
            hasNextRow: fetchMoreResult.getRows.hasNextRow,
          },
        };
      },
    });
  };

  // console.log("rows....", data.getRows);

  return {
    rows: data.getRows.rows,
    loading: false,
    hasNextRow: data.getRows.hasNextRow,
    loadMore,
  };
}
