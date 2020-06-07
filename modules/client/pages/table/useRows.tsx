import { useQuery } from "react-apollo-hooks";
import { GetRowsConnection } from "client/graphql/types.gen";
import { ApolloQueryResult } from "apollo-client";
import { ProvidedRequiredArgumentsOnDirectives } from "graphql/validation/rules/ProvidedRequiredArguments";
import * as immer from "immer";

export function useRows(args: {
  limit: number;
}):
  | {
      loading: true;
      rows: never[];
      loadMore: undefined;
      hasNextRow: true;
      totalRows: 0;
    }
  | {
      loading: false;
      rows: any[]; // todo add the type!
      loadMore: (offset: number) => Promise<ApolloQueryResult<any>>;
      hasNextRow: boolean;
      totalRows: number;
    } {
  const { data, loading, fetchMore } = useQuery(GetRowsConnection.Document, {
    variables: {
      offset: 0,
      limit: 10, //todo, pass in
    },
  });

  if (loading && !data.getRowsConnection) {
    return {
      loading: true,
      rows: [],
      loadMore: undefined,
      hasNextRow: true,
      totalRows: 0,
    };
  }

  const loadMore = (offset: number) => {
    return fetchMore({
      query: GetRowsConnection.Document,
      variables: {
        offset,
        limit: args.limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return immer.produce(prev, (draft: GetRowsConnection.Query) => {
          draft.getRowsConnection.rows.push(
            ...fetchMoreResult.getRowsConnection.rows
          );
          draft.getRowsConnection.pageInfo.hasNextRow =
            fetchMoreResult.getRowsConnection.pageInfo.hasNextRow;
        });
      },
    });
  };

  return {
    rows: data.getRowsConnection.rows,
    loading: false,
    hasNextRow: data.getRowsConnection.pageInfo.hasNextRow,
    totalRows: data.getRowsConnection.totalRows,
    loadMore,
  };
}
