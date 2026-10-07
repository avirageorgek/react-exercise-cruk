import { ItemsType } from "../types";
import { styled } from "styled-components";
import { ThemeType, Text, Heading } from "@cruk/cruk-react-components";
import { formatDate } from "../utils/formatDate";

const MediaContainer = styled.li<{ theme: ThemeType }>`
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.m};
  gap: ${({ theme }) => theme.spacing.s};
  border: 1px solid ${({ theme }) => theme.colors.stepBorder};
  border-radius: 8px;
  width: 100%;
  align-items: start;
  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: 200px 1fr;
  }
`;

const PreviewMedia = styled.button`
  min-height: 100px;
  cursor: pointer;
  border: none;
  img {
    width: 100%;
    height: auto;
  }
`;

const MediaDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export function MediaCard(item: ItemsType) {
  const mediaTitle = item.data[0]?.title;
  const mediaType = item.data[0]?.media_type;

  const previewLabel =
    mediaType === "audio" ? `Play ${mediaTitle}` : `View ${mediaTitle}`;
  const mediaDate = item.data[0]?.date_created
    ? formatDate(item.data[0]?.date_created)
    : "";

  const renderPreviewMedia = (item: ItemsType) => {
    const previewUrl = item.links?.find(
          (link) => link.rel === "preview",
        )?.href;

    switch (mediaType) {
      case "image":
      case "video":
        return <img src={previewUrl} alt="" />;
      case "audio":
        return <span>Play audio</span>;
      default:
        return <span>No preview available</span>;
    }
  };

  return (
    <MediaContainer
      onClick={() => {
        //TODO: Implement click functionality to open modal with media details
      }}
    >
      <PreviewMedia type="button" aria-label={previewLabel}>
        {renderPreviewMedia(item)}
      </PreviewMedia>
      <MediaDetails>
        <Heading h2>{mediaTitle}</Heading>
        {mediaDate && <Text>{mediaDate}</Text>}
      </MediaDetails>
    </MediaContainer>
  );
}
