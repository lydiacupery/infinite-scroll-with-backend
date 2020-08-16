import * as AuthRoutes from "client/routes/authentication-routes";
import * as config from "config";
import { Context } from "graphql-api/context";
import { buildContext } from "./context";

export function createContext(req: any, res: any, next: any) {
  if (req.user) {
    const context = buildContext({ userId: req!.user.userId });
    req.context = context;
  } else {
    req.context = new Context();
  }
  return next();
}
