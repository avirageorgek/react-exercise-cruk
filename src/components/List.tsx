"use client";

import { Loader, InfoBox } from "@cruk/cruk-react-components";
import {
  type NasaResponse,
  type NasaSearchParams,
  type ItemsType,
} from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";
import { MediaCard } from "./MediaCard";
import styled from "styled-components";
import { useState } from "react";
import { MediaModal } from "./MediaModal";
import { formatDate } from "../utils/formatDate";

type ListProps = {
  values: NasaSearchParams;
};

const MediaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export function List(props: ListProps) {
  const values: NasaSearchParams = props.values;
  const [selectedItem, setSelectItem] = useState<ItemsType | null>();

  const urlNasaSearchUrl = values ? urlNasaSearch(values) : "";

  const { data, isLoading, isError } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () =>
      fetch(urlNasaSearchUrl).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch the details from NASA");
        return res.json();
      }),
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <InfoBox
        role="alert"
        titleText="Sorry, something went wrong"
        descriptionText="Failed to fetch NASA data."
        titleTextColor="textError"
      />
    );
  }

  const items = data.collection.items;

  if (items.length === 0) {
    return (
      <InfoBox role="alert" titleText="No results found" descriptionText="" />
    );
  }

  const selectedData = selectedItem?.data[0];
  const links = selectedItem?.links;

  return (
    <>
      <MediaList>
        {items.map((item) => {
          const nasaId = item.data[0]?.nasa_id;
          return (
            <MediaCard
              key={nasaId}
              item={{ ...item }}
              onSelectItem={() => {
                setSelectItem(item);
              }}
            />
          );
        })}
      </MediaList>
      {selectedItem && selectedData && (
        <MediaModal
          title={selectedData.title}
          closeFunction={() => setSelectItem(null)}
          nasaId={selectedData.nasa_id}
          mediaType={selectedData.media_type}
          description={selectedData.description}
          createdDate={formatDate(selectedData.date_created)}
          links={links}
          manifestUrl={selectedItem.href}
        ></MediaModal>
      )}
    </>
  );
}
