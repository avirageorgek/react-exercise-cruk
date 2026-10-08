import type { ItemsType, NasaResponse } from "../../types";

export const NASA_ASSETS_URL = "https://images-assets.nasa.gov";
const nasaIdImage1 = "fake-nasa-id1";
const nasaIdImage2 = "fake-nasa-id2";
const nasaIdVideo1 = "fake-nasa-id-video1";
const nasaIdVideo2 = "fake-nasa-id-video2";
const nasaIdAudio1 = "fake-nasa-id-audio1";

export const imageItem1: ItemsType = {
  href: `${NASA_ASSETS_URL}/image/${nasaIdImage1}/collection.json`,
  data: [
    {
      center: "JSC",
      title: "Apollo 11 footprint",
      keywords: [],
      location: "",
      nasa_id: nasaIdImage1,
      date_created: "2023-01-01T00:00:00Z",
      media_type: "image",
      description: "Test description",
    },
  ],
  links: [
    {
      href: `${NASA_ASSETS_URL}/image/${nasaIdImage1}/${nasaIdImage1}~medium.jpg`,
      rel: "alternate",
      render: "image",
    },
    {
      href: `${NASA_ASSETS_URL}/image/${nasaIdImage1}/${nasaIdImage1}~thumb.jpg`,
      rel: "preview",
      render: "image",
    },
  ],
};

export const imageItem2: ItemsType = {
  href: `${NASA_ASSETS_URL}/image/${nasaIdImage2}/collection.json`,
  data: [
    {
      center: "JSC",
      title: "Apollo 13 footprint",
      keywords: [],
      location: "",
      nasa_id: nasaIdImage2,
      date_created: "2023-01-01T00:00:00Z",
      media_type: "image",
      description: "Test description",
    },
  ],
  links: [
    {
      href: `${NASA_ASSETS_URL}/image/${nasaIdImage2}/${nasaIdImage2}~medium.jpg`,
      rel: "alternate",
      render: "image",
    },
    {
      href: `${NASA_ASSETS_URL}/image/${nasaIdImage2}/${nasaIdImage2}~thumb.jpg`,
      rel: "preview",
      render: "image",
    },
  ],
};

export const videoItem1: ItemsType = {
  href: `${NASA_ASSETS_URL}/video/${nasaIdVideo1}/collection.json`,
  data: [
    {
      center: "JSC",
      title: "Apollo 11 video footprint",
      keywords: [],
      location: "",
      nasa_id: nasaIdVideo1,
      date_created: "2023-01-01T00:00:00Z",
      media_type: "video",
      description: "Test description",
    },
  ],
  links: [
    {
      href: `${NASA_ASSETS_URL}/video/${nasaIdVideo1}/${nasaIdVideo1}~medium.jpg`,
      rel: "alternate",
      render: "image",
    },
    {
      href: `${NASA_ASSETS_URL}/video/${nasaIdVideo1}/${nasaIdVideo1}~thumb.jpg`,
      rel: "preview",
      render: "image",
    },
  ],
};

export const videoItem2: ItemsType = {
  href: `${NASA_ASSETS_URL}/video/${nasaIdVideo2}/collection.json`,
  data: [
    {
      center: "JSC",
      title: "Apollo 13 video footprint",
      keywords: [],
      location: "",
      nasa_id: nasaIdVideo2,
      date_created: "2023-01-01T00:00:00Z",
      media_type: "video",
      description: "Test description",
    },
  ],
  links: [
    {
      href: `${NASA_ASSETS_URL}/video/${nasaIdVideo2}/${nasaIdVideo2}~medium.jpg`,
      rel: "alternate",
      render: "image",
    },
    {
      href: `${NASA_ASSETS_URL}/video/${nasaIdVideo2}/${nasaIdVideo2}~thumb.jpg`,
      rel: "preview",
      render: "image",
    },
  ],
};

export const audioItem: ItemsType = {
  href: `${NASA_ASSETS_URL}/audio/${nasaIdAudio1}/collection.json`,
  data: [
    {
      center: "JSC",
      title: "Apollo 13 audio footprint",
      keywords: [],
      location: "",
      nasa_id: nasaIdAudio1,
      date_created: "2023-01-01T00:00:00Z",
      media_type: "audio",
      description: "Test description",
    },
  ],
};

export const searchImageResults: NasaResponse = {
  collection: {
    version: "1.0",
    href: "",
    items: [imageItem1, imageItem2],
  },
};

export const searchVideoResults: NasaResponse = {
  collection: {
    version: "1.0",
    href: "",
    items: [videoItem1, videoItem2],
  },
};

export const searchAudioResults: NasaResponse = {
  collection: {
    version: "1.0",
    href: "",
    items: [audioItem],
  },
};

export const emptySearchResult: NasaResponse = {
  collection: {
    version: "1.0",
    href: "",
    items: [],
  },
};
