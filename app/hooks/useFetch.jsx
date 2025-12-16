import { useQuery } from "@tanstack/react-query";
import { getAllPhone } from "../api/phone";

export default function useFetch(url) {
  const { error, data, isLoading } = useQuery({
    queryKey: ["phone", url],
    queryFn: () => getAllPhone(url),
    enabled: !!url, // Only run if url is truthy
  });
  return { isLoading, data: data, error: error };
}
