import { useQuery } from "@tanstack/react-query";
import Loader from "../components/skeleton/loader";
import { getAllPhone } from "../api/phone";

export default function Phone() {
  const url = "/phone";
  const { error, data, isLoading } = useQuery({
    queryKey: ["phone"],
    queryFn: () => getAllPhone(url),
  });

  if (isLoading) {
    return <Loader />;
  }
  console.log("DATA: 🚀", data);

  return (
    <div>
      <h1>Phone list page</h1>
      {data.data.map((phone) => (
        <div key={phone._id}>
          <h2>{phone.phone_number}</h2>
          <p>{phone.country_code}</p>
        </div>
      ))}
    </div>
  );
}
