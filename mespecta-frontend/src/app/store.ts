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
import outboundReasonsReducer from "../features/adminSetup/systemValues/outboundReasons/outboundReasons.slice";
import outgoingDocumentTypesReducer from "../features/adminSetup/systemValues/outgoingDocumentTypes/outgoingDocumentTypes.slice";
import destinationsReducer from "../features/adminSetup/systemValues/destinations/destinations.slice";
import materialsReducer from "../features/materials/materials.slice";
import productsReducer from "../features/products/products.slice";
import citesInboundsReducer from "../features/citesInbounds/citesInbounds.slice";
import citesOutboundSoldReducer from "../features/citesOutbounds/citesOutboundSold.slice";
import citesOutboundStockReducer from "../features/citesOutbounds/citesOutboundStock.slice";
import productionsReducer from "../features/productions/productions.slice";
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
    outboundReasons: outboundReasonsReducer,
    outgoingDocumentTypes: outgoingDocumentTypesReducer,
    destinations: destinationsReducer,
    materials:materialsReducer,
    products: productsReducer,
    citesInbounds: citesInboundsReducer,
    citesOutboundSold: citesOutboundSoldReducer,
    citesOutboundStock: citesOutboundStockReducer,
    productions: productionsReducer,
    craftsmen: craftsmenReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;