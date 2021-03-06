import * as React from "react";
import * as Faker from "faker";
import { Button, Typography, Grid } from "@material-ui/core";
import { Table } from "client/components/table";
import {
  useQueryBundle,
  useQueryWithPreviousResultsWhileLoading,
} from "client/graphql/hooks";
import { useRows } from "./useRows";

export type ItemType = {
  firstName: string;
  lastName: string;
  suffix: string;
  jobTitle: string;
  id: string;
};

export const TablePage: React.FC = () => {
  // const [loadedItemsState, setLoadedItemsState] = React.useState<{
  //   hasNextPage: boolean;
  //   items: ItemType[];
  // }>({
  //   hasNextPage: true,
  //   items: [],
  // });

  const [showTable, setShowTable] = React.useState(true);

  const [scrollState, setScrollState] = React.useState({
    rowIndex: 0,
    columnIndex: 0,
  });

  // todo, eventually this will have to be more eleaborate
  // const [offset, setOffset] = React.useState(0);
  // neesd to be configured to match w/ the infinite scroll limit
  const limit = 10;

  // const rowData = useQueryWithPreviousResultsWhileLoading(GetRows, {
  //   variables: {
  //     limit: LIMIT,
  //     offset: offset,
  //   },
  //   fetchPolicy: "cache-and-network",
  // });
  // console.log({ rowData });

  const { rows, loading, loadMore, hasNextRow, totalCount } = useRows({
    limit,
  });

  let loadMoreItems = React.useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (!loading && loadMore) {
        await loadMore(stopIndex);
      }
      return Promise.resolve();
    },
    [loadMore]
  );

  // the item is loaded if either 1) there are no more pages or 2) there exists an item at that index
  let isItemLoaded = React.useCallback(
    (index: number) => {
      return !hasNextRow || !!rows[index];
    },
    [hasNextRow, rows]
  );

  const setScrollRowAndColum = React.useCallback(
    (rowIndex: number, columnIndex: number) => {
      // console.log("row index scrolls state", rowIndex);
      setScrollState({ rowIndex, columnIndex });
    },

    []
  );

  const showTableCallback = React.useCallback(() => setShowTable(true), []);
  const hideTableCallback = React.useCallback(() => setShowTable(false), []);

  // const { hasNextPage, items } = loadedItemsState;

  // if (rowData.state === "LOADING") {
  //   return <>LOADING!</>;
  // }

  return showTable ? (
    <>
      <Button
        onClick={hideTableCallback}
        style={{ width: "100%", backgroundColor: "lightBlue" }}
      >
        HIDE TABLE
      </Button>
      {/* <Box m={2} /> */}
      <Grid style={{ padding: "20px" }}>
        <Typography>
          This grid loads the next "page" of data when the user scrolls to the
          end of loaded data.
        </Typography>
        {/* <Box m={0.5} /> */}
        <Typography>
          It also stores your scroll offset in component state so you don't lose
          your position when you navigate away and back.
        </Typography>
        {/* <Box m={3} /> */}

        <Table
          hasNextPage={hasNextRow} //todo, need to do next page logic
          items={rows}
          loadMoreItems={loadMoreItems}
          isItemLoaded={isItemLoaded}
          scrollState={scrollState}
          setScrollRowAndColumn={setScrollRowAndColum}
          totalCount={totalCount}
        />
      </Grid>
    </>
  ) : (
    <>
      <Button
        onClick={showTableCallback}
        style={{ width: "100%", backgroundColor: "lightBlue" }}
      >
        SHOW TABLE
      </Button>
      <Grid style={{ padding: "20px" }}>
        {/* <Box m={2} /> */}
        <Typography> No more table!</Typography>
      </Grid>
    </>
  );
};
