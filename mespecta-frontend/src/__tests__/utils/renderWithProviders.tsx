import { render, type RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

// Import all reducers
import authReducer from "../../features/auth/auth.slice";
import colorsReducer from "../../features/adminSetup/systemValues/colors/colors.slice";
import leatherTypesReducer from "../../features/adminSetup/systemValues/leatherTypes/leatherTypes.slice";
import documentTypesReducer from "../../features/adminSetup/systemValues/documentTypes/documentTypes.slice";
import acquisitionTypesReducer from "../../features/adminSetup/systemValues/acquisitionType/acquisitionTypes.slice";
import sourcesReducer from "../../features/adminSetup/systemValues/sources/sources.slice";
import unitOfMeasuresReducer from "../../features/adminSetup/systemValues/unitOfMeasures/unitOfMeasures.slice";
import materialCategoriesReducer from "../../features/adminSetup/systemValues/materialCategories/materialCategories.slice";
import productCategoriesReducer from "../../features/adminSetup/systemValues/productCategories/productCategories.slice";
import outboundReasonsReducer from "../../features/adminSetup/systemValues/outboundReasons/outboundReasons.slice";
import outgoingDocumentTypesReducer from "../../features/adminSetup/systemValues/outgoingDocumentTypes/outgoingDocumentTypes.slice";
import destinationsReducer from "../../features/adminSetup/systemValues/destinations/destinations.slice";
import usersReducer from "../../features/adminSetup/users/users.slice";
import materialsReducer from "../../features/materials/materials.slice";
import productsReducer from "../../features/products/products.slice";
import citesInboundsReducer from "../../features/citesInbounds/citesInbounds.slice";
import citesOutboundSoldReducer from "../../features/citesOutbounds/citesOutboundSold.slice";
import citesOutboundStockReducer from "../../features/citesOutbounds/citesOutboundStock.slice";
import productionsReducer from "../../features/productions/productions.slice";
import craftsmenReducer from "../../features/craftsmen/craftsmen.slice";
import accountReducer from "../../features/adminSetup/account/account.slice";

/** Create a fresh store for each test — avoids state leakage */
export function createTestStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      colors: colorsReducer,
      leatherTypes: leatherTypesReducer,
      documentTypes: documentTypesReducer,
      acquisitionTypes: acquisitionTypesReducer,
      sources: sourcesReducer,
      unitOfMeasures: unitOfMeasuresReducer,
      materialCategories: materialCategoriesReducer,
      productCategories: productCategoriesReducer,
      outboundReasons: outboundReasonsReducer,
      outgoingDocumentTypes: outgoingDocumentTypesReducer,
      destinations: destinationsReducer,
      users: usersReducer,
      materials: materialsReducer,
      products: productsReducer,
      citesInbounds: citesInboundsReducer,
      citesOutboundSold: citesOutboundSoldReducer,
      citesOutboundStock: citesOutboundStockReducer,
      productions: productionsReducer,
      craftsmen: craftsmenReducer,
      account: accountReducer,
    },
    preloadedState,
  });
}

interface WrapperProps {
  children: ReactNode;
  initialRoute?: string;
  preloadedState?: Record<string, unknown>;
}

function AllProviders({ children, initialRoute = "/", preloadedState }: WrapperProps) {
  const store = createTestStore(preloadedState);
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {children}
      </MemoryRouter>
    </Provider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderOptions & { initialRoute?: string; preloadedState?: Record<string, unknown> } = {}
) {
  const { initialRoute, preloadedState, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialRoute={initialRoute} preloadedState={preloadedState}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}
