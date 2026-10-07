"use client";

import { Text } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";

type ListProps = {
  values: NasaSearchParams;
};

export function List(props: ListProps) {
  const values: NasaSearchParams = props.values;

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  const { data } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch the details from NASA");
      return res.json();
    }),
  );

  // TODO somehow render results
  return <>{!!data && <Text>{JSON.stringify(data)}</Text>}</>;
}
