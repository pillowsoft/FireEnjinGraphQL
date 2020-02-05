import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import authChecker from "./auth";
import connect from "./connect";
import env from "./env";
import { logger } from "./middlewares/logger";

(async () => {
  connect();
  const server = new ApolloServer({
    context: env("graphql.tokenAuth", true)
      ? ({ req }) => ({
          referrer: req.headers.referer,
          token:
            req.headers && req.headers.authorization
              ? req.headers.authorization.replace(
                  env("graphql.tokenPrefix", "Bearer "),
                  ""
                )
              : null,
          env: env("env")
        })
      : null,
    schema: await buildSchema({
      resolvers: [
        __dirname + "/models/**/*.{ts,js}",
        __dirname + "/resolvers/**/*.{ts,js}"
      ],
      emitSchemaFile: env("graphql.schema.emit", {
        path: env("graphql.schema.path", __dirname + "/../schema.gql"),
        commentDescriptions: env("graphql.schema.commentDescriptions", true)
      }),
      authChecker,
      globalMiddlewares: [logger]
    }),
    introspection: env("graphql.introspection", true)
  });

  const serverInfo = await server.listen({
    port: env("graphql.port", process.env.PORT ? process.env.PORT : 4000)
  });
  console.log(
    `🚀  Server running on ${env("env", "local")} and ready at ${
      serverInfo.url
    }`
  );
})().catch(error => console.log(error));
