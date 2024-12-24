import { UserRolesTable } from "@/components/users/UserRolesTable";
import { UserManagementErrorBoundary } from "@/components/users/UserManagementErrorBoundary";
import { ErrorBoundary } from "react-error-boundary";

export default function UserManagement() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <ErrorBoundary FallbackComponent={UserManagementErrorBoundary}>
        <UserRolesTable />
      </ErrorBoundary>
    </div>
  );
}