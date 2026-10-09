import { Modal, Heading, Text, Loader } from "@cruk/cruk-react-components";
import {
  type AssetNasaResponse,
  type LinkType,
  type MediaType,
  type AssetType,
} from "../types";
import styled from "styled-components";
import { NASA_ASSETS_URL } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";

type MediaModalProps = {
  title: string;
  closeFunction: () => void;
  nasaId: string;
  mediaType: MediaType;
  description: string;
  createdDate: string;
  links?: LinkType[];
  manifestUrl: string;
};

const MediaFrame = styled.div`
  img,
  video,
  audio {
    display: block;
    width: 100%;
  }

  img,
  video {
    height: auto;
  }
`;

export function MediaModal({
  title,
  closeFunction,
  mediaType,
  nasaId,
  description,
  createdDate,
}: MediaModalProps) {
  const preferredFiles: Record<MediaType, string[]> = {
    video: ["~mobile.mp4", "~small.mp4", "~medium.mp4"],
    audio: [".mp3", ".m4a"],
    image: ["~large.", "~medium.", "~small.", "~orig.jpg", "~orig.png"],
  };

  const filterFile = (items: AssetType[], mediaType: MediaType) => {
    for (const name of preferredFiles[mediaType]) {
      const match = items.find((item) => item.href.includes(name));
      // NASA result is returning http so we have to replace the url with https
      if (match) return match.href.replace("http://", "https://");
    }
    return null;
  };

  const {
    data: mediaUrl,
    isLoading,
    isError,
  } = useQuery(
    ["assetFetch", nasaId],
    async () => {
      const res = await fetch(`${NASA_ASSETS_URL}/${nasaId}`);
      if (!res.ok) throw new Error("An error occured while fetching details");
      const result = (await res.json()) as AssetNasaResponse;
      const items = result.collection.items;
      return filterFile(items, mediaType);
    },
    { retry: 1 },
  );
  const renderMedia = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (isError || !mediaUrl) {
      return <Text>Sorry, this media is unavailable.</Text>;
    }

    switch (mediaType) {
      case "image":
        // A static export has no server for next/image optimisation, and the
        // file list already includes a web-sized version of the image.
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={mediaUrl} alt={title} loading="lazy" />;
      case "audio":
        return <audio controls src={mediaUrl} />;
      case "video":
        return (
          <video controls preload="metadata">
            <source src={mediaUrl} />
          </video>
        );

      default:
        return <Text>Sorry, this media is unavailable.</Text>;
    }
  };

  return (
    <Modal
      modalName={title}
      closeFunction={closeFunction}
      showCloseButton={true}
      maxWidth="800px"
    >
      <Heading>{title}</Heading>
      <MediaFrame>{renderMedia()}</MediaFrame>
      <Text marginTop="s">{createdDate}</Text>
      {description && <Text>{description}</Text>}
    </Modal>
  );
}
