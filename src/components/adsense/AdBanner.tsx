"use client";

import { useEffect } from "react";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
  pId: string;
};
const AdBanner = ({
  pId,
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerTypes) => {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={`ca-pub-${pId}`}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-with-responsive={dataFullWidthResponsive.toString()}
    ></ins>
  );
};

export default AdBanner;
