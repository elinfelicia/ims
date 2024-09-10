import { graphqlHTTP } from "express-graphql";
import schema from './schema/graphqlSchema.js'; 

export default function (app) {
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true
    }))
}