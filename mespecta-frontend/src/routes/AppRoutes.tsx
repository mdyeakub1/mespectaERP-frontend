import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../components/layout/AppLayout";



import AdminSetupLayout from "../features/adminSetup/pages/AdminSetupPage";
import UsersPage from "../features/adminSetup/users/pages/UsersPage";
import SystemValuesLayout from "../features/adminSetup/systemValues/pages/SystemValuesPage";
import ColorsPage from "../features/adminSetup/systemValues/colors/pages/ColorsPage";
import LeatherTypesPage from "../features/adminSetup/systemValues/leatherTypes/pages/LeatherTypesPage";
import DocumentTypesPage from "../features/adminSetup/systemValues/documentTypes/pages/DocumentTypesPage";
import AcquisitionTypesPage from "../features/adminSetup/systemValues/acquisitionType/pages/AcquisitionTypesPage";
import SourcesPage from "../features/adminSetup/systemValues/sources/pages/SourcesPage";
import UnitOfMeasuresPage from "../features/adminSetup/systemValues/unitOfMeasures/pages/UnitOfMeasuresPage";
import MaterialCategoriesPage from "../features/adminSetup/systemValues/materialCategories/pages/MaterialCategoriesPage";
import ProductCategoriesPage from "../features/adminSetup/systemValues/productCategories/pages/ProductCategoriesPage";
import AccountPage from "../features/adminSetup/account/pages/AccountPage";
import MaterialsPage from "../features/materials/pages/MaterialsPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import CustomersPage from "../features/customers/pages/CustomersPage";
import SuppliersPage from "../features/suppliers/pages/SuppliersPage";
import CitesInboundsPage from "../features/citesInbounds/pages/CitesInboundsPage";
import CitesInboundDetailsPage from "../features/citesInbounds/components/CitesInboundDetailsPage";
import ProductionsPage from "../features/productions/pages/ProductionsPage";
import FinishedProductsPage from "../features/finishedProducts/pages/FinishedProductsPage";
import FinishedProductDetailsPage from "../features/finishedProducts/pages/FinishedProductDetailsPage";
import CraftsmenPage from "../features/craftsmen/pages/CraftsmenPage";
import CraftsmanDetailsPage from "../features/craftsmen/pages/CraftsmanDetailsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Default Redirect */}
          <Route index element={<Navigate to="cites-inbounds" />} />

          {/* CITES */}
          <Route path="cites-inbounds" element={<CitesInboundsPage />} />
          <Route path="cites-inbounds/:id" element={<CitesInboundDetailsPage />} />
          <Route path="productions" element={<ProductionsPage />} />
          {/* Other Pages */}
          <Route path="finished-products" element={<FinishedProductsPage />} />
          <Route path="finished-products/:id" element={<FinishedProductDetailsPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="craftsmen" element={<CraftsmenPage />} />
          <Route path="craftsmen/:id" element={<CraftsmanDetailsPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="products" element={<ProductsPage />} />

          {/* Admin Setup */}
          <Route path="admin-setup" element={<AdminSetupLayout />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="users" element={<UsersPage />} />

            <Route path="system-values" element={<SystemValuesLayout />}>
              <Route index element={<Navigate to="product-categories" replace />} />
              <Route path="material-categories" element={<MaterialCategoriesPage />} />
              <Route path="product-categories" element={<ProductCategoriesPage />} />
              <Route path="colors" element={<ColorsPage />} />
              <Route path="leather-types" element={<LeatherTypesPage />} />
              <Route path="document-types" element={<DocumentTypesPage />} />
              <Route path="acquisition-types" element={<AcquisitionTypesPage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="unit-of-measures" element={<UnitOfMeasuresPage />} />
            </Route>
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}