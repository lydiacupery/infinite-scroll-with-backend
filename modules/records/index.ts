import { RepositoriesBase } from "atomic-object/records";
import { EmployeeRepository } from "./employee";

export class Repositories extends RepositoriesBase {
  employees = new EmployeeRepository(this);
}
