import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import SetNewPasswordPage from "../features/auth/SetNewPasswordPage";
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
import OutboundReasonsPage from "../features/adminSetup/systemValues/outboundReasons/pages/OutboundReasonsPage";
import OutgoingDocumentTypesPage from "../features/adminSetup/systemValues/outgoingDocumentTypes/pages/OutgoingDocumentTypesPage";
import DestinationsPage from "../features/adminSetup/systemValues/destinations/pages/DestinationsPage";
import AccountPage from "../features/adminSetup/account/pages/AccountPage";
import MaterialsPage from "../features/materials/pages/MaterialsPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import CitesInboundsPage from "../features/citesInbounds/pages/CitesInboundsPage";
import CitesInboundDetailsPage from "../features/citesInbounds/components/CitesInboundDetailsPage";
import CitesOutboundSoldPage from "../features/citesOutbounds/pages/CitesOutboundSoldPage";
import CitesOutboundStockPage from "../features/citesOutbounds/pages/CitesOutboundStockPage";
import FinishedProductDetailsPage from "../features/citesOutbounds/pages/FinishedProductDetailsPage";
import ProductionsPage from "../features/productions/pages/ProductionsPage";
import ProductionDetailsPage from "../features/productions/pages/ProductionDetailsPage";
import DatabaseBackupPage from "../features/adminSetup/backup/pages/DatabaseBackupPage";
import CraftsmenPage from "../features/craftsmen/pages/CraftsmenPage";
import CraftsmanDetailsPage from "../features/craftsmen/pages/CraftsmanDetailsPage";

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/set-new-password"
          element={
            <PrivateRoute>
              <SetNewPasswordPage />
            </PrivateRoute>
          }
        />

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
          <Route path="cites-outbounds/sold" element={<CitesOutboundSoldPage />} />
          <Route path="cites-outbounds/stock" element={<CitesOutboundStockPage />} />
          <Route path="cites-outbounds/sold/:id" element={<FinishedProductDetailsPage />} />
          <Route path="cites-outbounds/stock/:id" element={<FinishedProductDetailsPage />} />
          <Route path="productions" element={<ProductionsPage />} />
          <Route path="productions/:id" element={<ProductionDetailsPage />} />
          {/* Other Pages */}
          <Route path="craftsmen" element={<CraftsmenPage />} />
          <Route path="craftsmen/:id" element={<CraftsmanDetailsPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="products" element={<ProductsPage />} />

          {/* Admin Setup */}
          <Route path="admin-setup" element={<AdminSetupLayout />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="users" element={<UsersPage />} />

            <Route path="db-backup" element={<DatabaseBackupPage />} />

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
              <Route path="outbound-reasons" element={<OutboundReasonsPage />} />
              <Route path="outgoing-document-types" element={<OutgoingDocumentTypesPage />} />
              <Route path="destinations" element={<DestinationsPage />} />
            </Route>

          </Route>

        </Route>

      </Routes>
    </HashRouter>
  );
}