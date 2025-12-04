import ErrorMessage from "@/components/Error";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StartCustomerSession = () => {
  const { token } = useParams<{ token: string }>();
  console.log({token})
  const navigate = useNavigate();
  const externalID = token
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function init() {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sessions/create`, {
        method: "POST",
        credentials: "include",      
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ external_id: externalID }),
      });

      const json = await res.json();
      console.log({json})

      if (json.success) {
        navigate(json.data.redirect_url);
      } else {
        setError(json?.message || "An error has occured")
      }
    }

    if (externalID) init();
  }, [externalID]);

  return <>
  Customer page
  <ErrorMessage error={error }/>
  </>;
};

export default StartCustomerSession;
