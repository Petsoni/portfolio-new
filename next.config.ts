import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The CV was first published as "Petar_Marković_CV.pdf". Links to it
      // are out there, so the old path redirects to the renamed file for
      // good. Requests arrive with the ć percent-encoded, which is the form
      // the source has to be written in to match.
      {
        source: "/Petar_Markovi%C4%87_CV.pdf",
        destination: "/petar-markovic-cv.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
