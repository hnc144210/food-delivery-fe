//src/pages/Users/UserTable.tsx
import { cn } from "@/lib/utils";
import type { ApiUser } from "@/types/api";
import { Trash2, Eye } from "lucide-react";

interface Props {
  users: ApiUser[];
  onView: (u: ApiUser) => void;
  onDelete: (u: ApiUser) => void;
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  LOCKED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export default function UserTable({ users, onView, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100">
            {["Người dùng", "SĐT", "Vai trò", "Trạng thái", ""].map((h) => (
              <th key={h} className="pb-3 font-medium pr-4 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[#E8441A] shrink-0">
                    {u.fullName?.[0] ?? "?"}
                  </div>
                  <span className="font-medium text-gray-800">
                    {u.fullName}
                  </span>
                </div>
              </td>
              <td className="py-3 pr-4 text-gray-500">{u.phoneNumber}</td>
              <td className="py-3 pr-4 text-gray-500 text-xs">
                {u.roles?.join(", ") ?? "—"}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    STATUS_COLOR[u.status] ?? "bg-gray-100 text-gray-600",
                  )}
                >
                  {u.status}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(u)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(u)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
