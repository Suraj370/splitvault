import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccounts } from "../../api/accounts.api";
import AccountCard from "./AccountCard";

function Accounts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="status">
        <div className="animate-pulse bg-gray-200 rounded-xl p-6 shadow h-40 w-full">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((account) => (
            <AccountCard data={account} key={account.id} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No accounts found</p>
      )}
    </>
  );
}

export default Accounts;
