const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const app = express();
const {GraphQLSchema,GraphQLObjectType, GraphQLString, GraphQLList,GraphQLInt,GraphQLNonNull} = require("graphql")

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]



const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This is a book written by a author",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLInt)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    authorId: {type: new GraphQLNonNull(GraphQLInt)},
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id == book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represent a author of a book",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLInt)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    authorId: {type: new GraphQLNonNull(GraphQLInt)},
    books: {type: new GraphQLList(BookType),
    resolve: (author) =>{
      return books.filter(book => book.authorId === author.id)
    }
    }
  })
})


const RootQueryType = new GraphQLObjectType({
  name:"Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      discriptions: "A Single book",
      args:{id:{type: GraphQLInt}
    },
      resolve: (parent, args) => books.find(book => book.id == args.id)
    },
    books: {
      type:new GraphQLList(BookType),
      discriptions: "List of All books",
      resolve: () => books
    },
    author:{
      type : AuthorType,
      discription: "A Single authors",
      args: {id:{type: GraphQLInt}},
      resolve: (parent,args) => authors.find(author => author.id == args.id)
    },
    authors:{
      type : new GraphQLList(AuthorType),
      discription: "List of All authors",
      resolve: () => authors
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root mutation',
  fields: () => ({
    addBook:{
      type: BookType,
      description: 'Add a book ',
      args:{
        name :{type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const book = {id: books.length + 1, name: args.name, authorId: args.authorId}
        books.push(book)
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use("/graphql",graphqlHTTP({
  schema:schema,
    graphiql: true,
  })
);

app.listen(2000, () => {
  console.log("App listening on port 2000");
});
