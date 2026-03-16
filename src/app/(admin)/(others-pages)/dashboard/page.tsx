import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MonthlyCollectionChart from "@/components/wallet/MonthlySalesChart";
import RecentLoginHistory from "@/components/wallet/RecentLoginHistroy";
import RecentTransactions from "@/components/wallet/RecentTransaction";
import { WalletMetrics } from "@/components/wallet/WalletMetrics";

import React from "react";


export default function page() {
  return (
     <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 ">
            <WalletMetrics/>
            <MonthlyCollectionChart/>
            
          </div>
    
          <div className="col-span-12 space-y-6 ">
            <RecentTransactions title=" Recent Transaction"/>
            <RecentLoginHistory/>
          </div>
        </div>
  );
}
