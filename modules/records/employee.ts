import { Flavor } from "helpers";
import { loaderOf, Knex } from "atomic-object/records";
import { RepositoryBase } from "records/impl/base";
import { EmployeeRecord } from "records/impl/core";
import * as DateTimeIso from "core/date-time-iso";

export type EmployeeId = Flavor<number, "Employee id">;

export interface UnsavedEmployee {
  firstName: string;
  lastName: string;
  suffix: string;
  jobTitle: string;
  createdAt: DateTimeIso.Type;
}
export interface SavedEmployee extends UnsavedEmployee {
  id: EmployeeId;
}

export class EmployeeRepository extends RepositoryBase(EmployeeRecord) {
  rows = async (input: {
    limit: number;
    cursor?: string;
  }): Promise<SavedEmployee[]> => {
    return input.cursor
      ? await this.table()
          .orderBy("createdAt")
          .where("createdAt", ">=", input.cursor)
          .limit(input.limit)
      : await this.table()
          .orderBy("createdAt")
          .limit(input.limit);
  };
}
