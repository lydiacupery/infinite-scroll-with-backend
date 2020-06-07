import { useQuery } from "react-apollo-hooks";
import { GetRowPage } from "client/graphql/types.gen";
import { ApolloQueryResult } from "apollo-client";
import { ProvidedRequiredArgumentsOnDirectives } from "graphql/validation/rules/ProvidedRequiredArguments";
import * as immer from "immer";

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
  const { data, loading, fetchMore } = useQuery(GetRowPage.Document, {
    variables: {
      offset: 0,
      limit: 10, //todo, pass in
    },
  });

  if (loading && !data.getRowPage) {
    return {
      loading: true,
      rows: [],
      loadMore: undefined,
      hasNextRow: true,
    };
  }

  const loadMore = (offset: number, limit: number) => {
    return fetchMore({
      query: GetRowPage.Document,
      variables: {
        offset,
        limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return immer.produce(prev, (draft: GetRowPage.Query) => {
          draft.getRowPage.rows.push(...fetchMoreResult.getRowPage.rows);
          draft.getRowPage.pageInfo.hasNextRow =
            fetchMoreResult.getRowPage.pageInfo.hasNextRow;
        });
      },
    });
  };

  return {
    rows: data.getRowPage.rows,
    loading: false,
    hasNextRow: data.getRowPage.pageInfo.hasNextRow,
    loadMore,
  };
}
