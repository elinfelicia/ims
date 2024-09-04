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
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    }
});

const ManufacturerType = new GraphQLObjectType({
    name: 'Manufacturer',
    fields: {
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        website: { type: GraphQLString },
        description: { type: GraphQLString },
        address: { type: GraphQLString },
        contact: { type: ContactType }
    }
});

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        sku: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        category: { type: GraphQLString },
        manufacturer: { type: ManufacturerType },
        amountInStock: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: {
            type: ProductType,
            args: { id: { type: GraphQLID } },
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
                    manufacturer: { type: GraphQLString },
                    totalValue: { type: GraphQLFloat }
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
        lowStockProducts: {
            type: new GraphQLList(ProductType),
            resolve() {
                return Product.find({ amountInStock: { $lt: 10 } });
            }
        },
        criticalStockProducts: {
            type: new GraphQLList(new GraphQLObjectType({
                name: 'CriticalStockProduct',
                fields: {
                    manufacturerName: { type: GraphQLString },
                    contactName: { type: GraphQLString },
                    phone: { type: GraphQLString },
                    email: { type: GraphQLString }
                }
            })),
            resolve() {
                return Product.find({ amountInStock: { $lt: 5 } }).then(products => {
                    return products.map(product => ({
                        manufacturerName: product.manufacturer.name,
                        contactName: product.manufacturer.contact.name,
                        phone: product.manufacturer.contact.phone,
                        email: product.manufacturer.contact.email
                    }));
                });
            }
        },
        manufacturers: {
            type: new GraphQLList(ManufacturerType),
            resolve() {
                return Product.find().then(products => {
                    return products.map(product => product.manufacturer);
                });
            }
        }
    }
});

// Mutations

const Mutation = new GraphQLObjectType ({
    name: 'Mutation',
    fields: {
        type: ProductType,
        args: {
            name: {type: new GraphQLNonNull(GraphQLString)},
            sku: {type: new GraphQLNonNull(GraphQLString)},
            description: {type: GraphQLString},
            price: {type: new GraphQLNonNull(GraphQLFloat)},
            category: {type: GraphQLString},
            manufacturer: {
                type: new GraphQLNonNull(new GraphQLObjectType({
                    name: 'ManufacturerInput',
                    fields: {
                        name: {type: GraphQLString},
                        country: {type: GraphQLString},
                        website: {type: GraphQLString},
                        description: {type: GraphQLString},
                        address: {type: GraphQLString},
                        contact: {
                            type: new GraphQLObjectType({
                                name: 'Contact Input',
                                fields: {
                                    name: {type: GraphQLString},
                                    email: {type: GraphQLString},
                                    phone: {type: GraphQLString}
                                }
                            })
                        }
                    }
                }))
            },
            amountInStock: {type: new GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, args) {
            const newProduct = new Product({
                name: args.name,
                sku: args.sku,
                description: args.description,
                price: args.price,
                category: args.category,
                manufacturer: args.manufacturer,
                amountInStock: args.amountInStock
            });
            return newProduct.save();
        }
    },

    updateProduct
})


export default RootQuery;
