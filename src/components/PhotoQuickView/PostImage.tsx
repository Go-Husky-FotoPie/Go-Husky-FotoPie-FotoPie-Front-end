import { useMediaQuery } from "@mui/material";
import Image from "mui-image";

export interface PostImageProps {
  postPhoto: string;
}

const PostImage = ({ postPhoto }: PostImageProps) => {
  const matches390px = useMediaQuery("(min-width:390px)");
  const matches600px = useMediaQuery("(min-width:600px)");
  const matches750px = useMediaQuery("(min-width:750px)");
  const matches900px = useMediaQuery("(min-width:900px)");
  const matches1200px = useMediaQuery("(min-width:1200px)");
  let imageHeight = 0;
  if (matches1200px) {
    imageHeight = 700;
  } else if (matches900px) {
    imageHeight = 500;
  } else if (matches750px) {
    imageHeight = 450;
  } else if (matches600px) {
    imageHeight = 350;
  } else if (matches390px) {
    imageHeight = 200;
  } else {
    imageHeight = 150;
  }

  return (
    <>
      <Image
        alt="image"
        src={postPhoto}
        fit="contain"
        duration={0.5}
        height={imageHeight}
      />
    </>
  );
};

export default PostImage;

////////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import Container from "@mui/material/Container";

// export interface PostImageProps {
//   postPhoto: string;
// }

// const PostImage = ({ postPhoto }: PostImageProps) => {
//   const [height, setHeight] = useState<number>(0);

//   const handleImageLoad = (
//     event: React.SyntheticEvent<HTMLImageElement, Event>
//   ) => {
//     const target = event.target as HTMLImageElement;
//     setHeight(target.offsetHeight);
//   };

//   return (
//     <Container
//       sx={{
//         m: "auto",
//         p: "0",
//         width: "auto",
//         height: height ? `${height}px` : "70vh",
//       }}
//     >
//       <img
//         alt="image"
//         src={postPhoto}
//         style={{ maxWidth: "100%", objectFit: "contain", height: "100%" }}
//         onLoad={handleImageLoad}
//       />
//     </Container>
//   );
// };

// export default PostImage;
