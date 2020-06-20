import * as Knex from "knex";
import { addForeignKeyColumn } from "../helpers";

exports.up = async function(knex: Knex): Promise<any> {
  await knex.schema.createTable("Employee", table => {
    table.increments("id");
    table.string("firstName");
    table.string("lastName");
    table.string("suffix");
    table.string("jobTitle");
    table.dateTime("createdAt");
  });
};

exports.down = async function(knex: Knex): Promise<any> {
  await knex.schema.dropTable("Employee");
};
