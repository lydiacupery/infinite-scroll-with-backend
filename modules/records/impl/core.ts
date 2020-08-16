import { recordInfo } from "atomic-object/records";
import { SavedEmployee, UnsavedEmployee } from "../employee";

export const EmployeeRecord = recordInfo<UnsavedEmployee, SavedEmployee>(
  "Employee"
);
