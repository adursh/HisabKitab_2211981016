import React, { createContext, useState } from "react";
import { toast } from "sonner";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [allTotal, setAllTotal] = useState(0);
  const [transData, setTransData] = useState({});
  const accountType = localStorage.getItem("accountType") || "shopkeeper";

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${baseUrl}/api/customer/fetchuser`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Something went wrong!");
      const total = resData.records.reduce((sum, record) => {
        if (record.userId != resData.user.userId) sum -= record.totalAmount;
        else sum += record.totalAmount;
        return sum;
      }, 0);
      setAllTotal(total);
      setUser(resData.user);
      setRecords(resData.records);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <UserContext.Provider value={{ user, records, transData, allTotal, accountType, setTransData, fetchData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
