import { GetRowsConnection } from "client/graphql/types.gen";
import { ApolloQueryResult } from "apollo-client";
import { ProvidedRequiredArgumentsOnDirectives } from "graphql/validation/rules/ProvidedRequiredArguments";
import * as immer from "immer";
import { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { ItemType } from "client/components/table/types";

type UseRowsResponse =
  | {
      loading: true;
      rows: never[];
      loadMore: undefined;
      hasNextRow: false;
      totalCount: 0;
    }
  | {
      loading: boolean;
      rows: ItemType[];
      loadMore: () => Promise<void>;
      hasNextRow: boolean;
      totalCount: number;
    };

export function useRows(args: { count: number }): UseRowsResponse {
  const { data, loading, fetchMore } = useQuery(GetRowsConnection.Document, {
    variables: {
      count: args.count,
    } as GetRowsConnection.Variables,
  });

  if (loading && !data.getRowsConnection) {
    return {
      loading: true,
      rows: [],
      loadMore: undefined,
      hasNextRow: false,
      totalCount: 0,
    };
  }

  const loadMore = async () => {
    console.log("end cursor", data.getRowsConnection.pageInfo.endCursor);
    await fetchMore({
      query: GetRowsConnection.Document,
      variables: {
        startCursor: data.getRowsConnection.pageInfo.endCursor,
        count: args.count,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
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
