import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccounts } from "../../features/accounts/mainaccounts";
import AccountCard from "./AccountCard";

function Accounts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  return (
    <>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((account) => (
            <AccountCard
              data={account}
              key={account.id}
            
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">1</div>
      )}
    </>
  );
}

export default Accounts;
