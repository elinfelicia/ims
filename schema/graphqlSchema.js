import { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString,
    GraphQLFloat, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInputObjectType
} from "graphql";
import Product from "../models/Product.js";

const ContactType = new GraphQLObjectType({
    name: 'Contact',
    fields: {
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    }
});

const ManufacturerType = new GraphQLObjectType({
    name: 'Manufacturer',
    fields: {
        name: {type: GraphQLString},
        country: {type: GraphQLString},
        webiste: {type: GraphQLString},
        description: {type: GraphQLString},
        address: {type: GraphQLString},
        contact: {type: ContactType}
    }
});

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: {
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        sku: {type: GraphQLString},
        description: {type: GraphQLString},
        price: {type: GraphQLFloat},
        category: {type: GraphQLString},
        manufacurer : {type: ManufacturerType},
        amountInStock: {type: GraphQLInt}
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType', 
    fields: {
        type: ProductType,
        args: {id: {type: GraphQLID}},
        resolve(parent, args) {
            return Product.findById(args.id);
        }
    },
    products: {
        type: new GraphQLList(ProductType),
        resolve() {
            return Product.find();
        }
    },
    totalStockValue: {
        type: GraphQLFloat,
        resolve() {
            return Product.find().then(products => {
                return products.reduce((acc, product) => acc + (product.price * product.amountInStock), 0);
            });
        }
    },
    totalStockValueByManufacturer: {
        type: new GraphQLList(new GraphQLInputObjectType({
            name: 'StockValueByManufacturer',
            fields: {
                manufacturer: {type: GraphQLString},
                totalValue: {type: GraphQLFloat}
            }
        })),
        resolve() {
            return Product.find().then(products => {
                const valueByManufacturer = {};
                products.forEach(product => {
                    const manufacturer = product.manufacturer.name;
                    valueByManufacturer[manufacturer] = valueByManufacturer[manufacturer] || 0;
                    valueByManufacturer[manufacturer] += product.price * product.amountInStock;
                });
                return Object.keys(valueByManufacturer).map(manufacturer => ({
                    manufacturer,
                    totalValue: valueByManufacturer[manufacturer]
                }));
            });
        }
    },
    
})