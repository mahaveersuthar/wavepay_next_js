"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import Card from "../common/Card";
import DataTable, { Column, Action } from "../tables/DataTable";
import { toast } from "react-toastify";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { Edit, Shield, Eye } from "lucide-react";
import UserModal from "./CreateEditUserModal";
import Toggle from "../ui/toggle/Toggle";
import UserViewModal from "./UserViewModal";
import SetChargesModal from "./SetChargesModal";

/* ---------- Types ---------- */
interface UserProp {
  id: string;
  role: "Admin" | "Super Admin";
  name: string;
  email: string;
  mobile: string;
  status: "active" | "inactive";
  original: any;
}

export default function UserManagement() {
  const { isOpen, openModal, closeModal } = useModal();
  const [editingUser, setEditingUser] = useState<UserProp | null>(null);
  const [userList, setUserList] = useState<UserProp[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"all" | "Admin" | "User">("all");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isChargesOpen, setIsChargesOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [initialCharges, setInitialCharges] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------- API Actions ---------- */

  // 1. Fetch all users for the table
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await callApi(ApiRoutes.users);
      const usersArray = response?.data;

      if (!usersArray || !Array.isArray(usersArray)) {
        toast.error("Users not found");
        return;
      }

      const formattedUsers: UserProp[] = usersArray.map((u: any) => ({
        id: String(u.id),
        role: u.role === "admin" ? "Super Admin" : "Admin",
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        mobile: u.phone,
        status: u.status,
        original: u,
      }));

      setUserList(formattedUsers);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch existing charges for a specific user (GET)
  const fetchUserCharges = async (userId: string) => {
    try {
      setLoading(true);
      // Ensure your ApiRoutes.setCharges points to the base GET endpoint
      const response = await callApi(`${ApiRoutes.getCharges}/${userId}`); 
      
      if (response?.data && Array.isArray(response.data)) {
        setInitialCharges(response.data);
      } else {
        setInitialCharges([]);
      }
      setSelectedUserId(userId);
      setIsChargesOpen(true);
    } catch (err: any) {
      // If 404 or no charges found, we still open the modal with empty state
      setInitialCharges([]);
      setSelectedUserId(userId);
      setIsChargesOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 3. Save/Update charges (POST)
  const handleSetCharges = async (payload: any) => {
    try {
      setLoading(true);
      const response = await callApi(`${ApiRoutes.setCharges}/${selectedUserId}`, {
        method: "POST",
        data: payload,
      });
      toast.success(response?.message || "Charges updated successfully");
      setIsChargesOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update charges");
    } finally {
      setLoading(false);
    }
  };

  // 4. Update User Status Toggle
  const handleSetStatus = async (id: string) => {
    try {
      setLoading(true);
      const response = await callApi(`${ApiRoutes.users}/${id}/status`, {
        method: "PATCH"
      });
      toast.success(response?.message || "Status updated successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Create/Edit User Submit
  const handleSubmit = async (payload: any) => {
    try {
      setLoading(true);
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `${ApiRoutes.users}/${editingUser.id}`
        : ApiRoutes.users;

      const response = await callApi(url, {
        method: method,
        data: payload
      });

      toast.success(response?.message);
      closeModal();
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Table Config ---------- */

  const filteredUsers = selectedRole === "all"
    ? userList
    : userList.filter(user => user.role === selectedRole);

  const actions: Action<UserProp>[] = [
    {
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (user) => {
        setEditingUser(user);
        openModal();
      },
    },
    {
      label: "View",
      icon: <Eye size={16} />,
      className: "text-blue-500",
      onClick: (user) => {
        setEditingUser(user);
        setIsViewOpen(true);
      },
    },
    {
      label: "Set Charges",
      icon: <Shield size={16} />,
      className: "text-orange-500",
      onClick: (user) => fetchUserCharges(user.id), // Fetch data before opening modal
    },
  ];

  const columns: Column<UserProp>[] = [
    { header: "Role", key: "role" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Mobile", key: "mobile" },
    {
      header: "Status",
      key: "statusLabel",
      render: (item: UserProp) => (
        <Toggle
          checked={item.status === 'active'}
          size="sm"
          onChange={() => handleSetStatus(item.id)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white">
              User Management
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage system users and their transaction charges
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-md"
              onClick={() => {
                setEditingUser(null);
                openModal();
              }}
            >
              Create User
            </Button>
          </div>
        </div>

        {selectedRole !== "all" && (
          <div className="mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm text-gray-500">Filtered by:</span>
            <Badge color={selectedRole === "Admin" ? "warning" : "info"}>
              {selectedRole}s
            </Badge>
            <button
              onClick={() => setSelectedRole("all")}
              className="text-xs text-brand-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </Card>

      {/* Main Table Card */}
      <Card>
        <DataTable
          data={filteredUsers}
          columns={columns}
          isLoading={loading}
          shimmerCount={5}
          actions={actions}
        />
      </Card>

      {/* Modals Container */}
      
      {/* 1. Create/Edit User Modal */}
      <UserModal
        isOpen={isOpen}
        onClose={closeModal}
        editingUser={editingUser}
        onSubmit={handleSubmit}
      />

      {/* 2. User Detail View Modal */}
      <UserViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={editingUser?.original}
      />

      {/* 3. Service Charges Management Modal */}
      <SetChargesModal
        isOpen={isChargesOpen}
        onClose={() => setIsChargesOpen(false)}
        userId={selectedUserId}
        initialData={initialCharges} 
        onSubmit={handleSetCharges}
        loading={loading}
      />
    </div>
  );
}