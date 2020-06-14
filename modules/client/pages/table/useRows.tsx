import { GetRowsConnection } from "client/graphql/types.gen";
import { ApolloQueryResult } from "apollo-client";
import { ProvidedRequiredArgumentsOnDirectives } from "graphql/validation/rules/ProvidedRequiredArguments";
import * as immer from "immer";
import { useState } from "react";
import { useQuery } from "react-apollo-hooks";

export function useRows(args: {
  limit: number;
}):
  | {
      loading: true;
      rows: never[];
      loadMore: undefined;
      hasNextRow: true;
      totalCount: 0;
    }
  | {
      loading: boolean;
      rows: any[]; // todo add the type!
      loadMore: (offset: number) => Promise<ApolloQueryResult<any>>;
      hasNextRow: boolean;
      totalCount: number;
    } {
  const { data, loading, fetchMore } = useQuery(GetRowsConnection.Document, {
    variables: {
      limit: args.limit,
    } as GetRowsConnection.Variables,
  });
  const [cursor, setCursor] = useState(undefined);

  if (loading && !data.getRowsConnection) {
    return {
      loading: true,
      rows: [],
      loadMore: undefined,
      hasNextRow: true,
      totalCount: 0,
    };
  }

  const loadMore = (offset: number) => {
    return fetchMore({
      query: GetRowsConnection.Document,
      variables: {
        startCursor: data.getRowsConnection.pageInfo.endCursor,
        // startCursor: cursor,
        limit: args.limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        setCursor(fetchMoreResult.getRowsConnection.pageInfo.endCursor);
        return immer.produce(prev, (draft: GetRowsConnection.Query) => {
          draft.getRowsConnection.rows.push(
            ...fetchMoreResult.getRowsConnection.rows
          );
          draft.getRowsConnection.pageInfo =
            fetchMoreResult.getRowsConnection.pageInfo;
        });
      },
    });
  };

  return {
    rows: data.getRowsConnection.rows,
    loading: loading,
    hasNextRow: data.getRowsConnection.pageInfo.hasNextRow,
    totalCount: data.getRowsConnection.totalCount,
    loadMore,
  };
}
