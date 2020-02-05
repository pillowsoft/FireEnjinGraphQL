import { MiddlewareFn } from "type-graphql";
import admin from "firebase-admin";

import { LogModel } from "../models/Log";

export const logger: MiddlewareFn = async (
  { info, context }: { info: any; context: any },
  next
) => {
  const start = Date.now();
  const res = await next();
  if (["Query", "Mutation"].indexOf(info.parentType.name) >= 0) {
    const resolveTime = Date.now() - start;
    try {
      const log = await new LogModel().create({
        referrer: context.referrer,
        type: info.parentType.name,
        name: info.fieldName,
        input: JSON.stringify(info.variableValues),
        output: JSON.stringify(res),
        resolveTime,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(
        `${log.id} - ${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`
      );
    } catch (err) {
      console.log("Error creating log...", err);
    }
  }
};
