import { Field, InputType } from "type-graphql";

@InputType({ description: "The default input to use for all list queries" })
export default class ListQueryInput {
  @Field({
    nullable: true,
    description: "The number of results to return"
  })
  limit?: number;
}
