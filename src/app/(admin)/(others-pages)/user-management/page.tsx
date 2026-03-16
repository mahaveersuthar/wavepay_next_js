
import UserManagement from "@/components/user-management/UserManagement";



export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">   
       <UserManagement/>
      </div>
    </div>
  );
}
