//src/pages/Users/index.tsx
import { useState, useMemo } from "react";
import type { UserRole } from "@/types";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import type { ApiUser } from "@/types/api";

const TABS: { role: UserRole | "ALL"; label: string }[] = [
  { role: "ALL", label: "Tất cả" },
  { role: "CUSTOMER", label: "Khách hàng" },
  { role: "MERCHANT", label: "Nhà hàng" },
  { role: "SHIPPER", label: "Tài xế" },
];

export default function UsersPage() {
  const [tab, setTab] = useState<UserRole | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ApiUser | null>(null);

  const { data, isLoading } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const users = data?.items ?? [];

  const filtered = useMemo(
    () =>
      users.filter((u: ApiUser) => {
        if (search && !u.fullName.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (tab !== "ALL" && !u.roles?.includes(tab)) return false;
        return true;
      }),
    [users, search, tab],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {TABS.map((t) => (
            <button
              key={t.role}
              onClick={() => setTab(t.role)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                tab === t.role
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên..."
            className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8441A]/30 w-60"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {isLoading ? (
          <p className="text-sm text-gray-400">Đang tải...</p>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {filtered.length} người dùng
            </p>
            <UserTable
              users={filtered}
              onView={setSelected}
              onDelete={(u) => deleteUser(u.id)}
            />
          </>
        )}
      </div>

      <UserModal user={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
