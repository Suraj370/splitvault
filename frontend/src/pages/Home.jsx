import React , {useState} from "react";
import { useSelector } from "react-redux";
import Accounts from "../component/Accounts/Accounts";
import CreateModal from "../component/Accounts/CreateModal";
function Home() {
  const user = useSelector((state) => state.auth.user);

    const [showModal, setShowModal] = useState(false);
  
    const handleAddAclick = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

  

  return (
    <>
      <main className=" max-w-7xl mx-auto px-6 py-8">
        <section>
          <h2 className="font-semibold text-3xl text-slate-900 mb-2">
            {" "}
            Welcome back, {user.name} ! 👋
          </h2>
          <p className=" text-slate-500/80 tracking-tighter">
            Manage your multiple saving account and track saving goals with
            ease.
          </p>
        </section>

        <section className="flex flex-col mt-2 space-y-6  ">
          <div className="flex items-center justify-between mb-6">
            <h2 className=" font-semibold text-3xl "> Your Savings</h2>
            <button onClick={handleAddAclick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add New Account
            </button>
            {
              showModal && (
                <CreateModal
                  onClose={handleClose}
                />
              )
            }
          </div>

          <div className=" grid grid-cols-1 gap-6">
           <Accounts />
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
