import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/adminSetup/users/users.slice";
import colorsReducer from "../features/adminSetup/systemValues/colors/colors.slice";
import leatherTypesReducer from "../features/adminSetup/systemValues/leatherTypes/leatherTypes.slice";
import documentTypesReducer from "../features/adminSetup/systemValues/documentTypes/documentTypes.slice";
import acquisitionTypesReducer from "../features/adminSetup/systemValues/acquisitionType/acquisitionTypes.slice";
import sourcesReducer from "../features/adminSetup/systemValues/sources/sources.slice";
import unitOfMeasuresReducer from "../features/adminSetup/systemValues/unitOfMeasures/unitOfMeasures.slice";
import materialCategoriesReducer from "../features/adminSetup/systemValues/materialCategories/materialCategories.slice";
import productCategoriesReducer from "../features/adminSetup/systemValues/productCategories/productCategories.slice";
import materialsReducer from "../features/materials/materials.slice";
import productsReducer from "../features/products/products.slice";
import customersReducer from "../features/customers/customers.slice";
import suppliersReducer from "../features/suppliers/suppliers.slice";
import citesInboundsReducer from "../features/citesInbounds/citesInbounds.slice";
import productionsReducer from "../features/productions/productions.slice";
import finishedProductsReducer from "../features/finishedProducts/finishedProducts.slice";
import craftsmenReducer from "../features/craftsmen/craftsmen.slice";
import authReducer from "../features/auth/auth.slice";
import accountReducer from "../features/adminSetup/account/account.slice";


export const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
    colors: colorsReducer,
    leatherTypes: leatherTypesReducer,
    documentTypes: documentTypesReducer,
    acquisitionTypes : acquisitionTypesReducer,
    sources:sourcesReducer,
    unitOfMeasures: unitOfMeasuresReducer,
    materialCategories: materialCategoriesReducer,
    productCategories: productCategoriesReducer,
    materials:materialsReducer,
    products: productsReducer,
    customers: customersReducer,
    suppliers: suppliersReducer,
    citesInbounds: citesInboundsReducer,
    productions: productionsReducer,
    finishedProducts: finishedProductsReducer,
    craftsmen: craftsmenReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;