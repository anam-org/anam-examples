export const VideoSection = () => {
    return (
      <video
        src="/videos/personas/astrid_gen_1.mp4"
        poster="/jpg/posters/astrid_gen_1_poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "15px 0px 15px 0px",
          objectFit: "cover",
          bottom: "0em",
          right: "0em",
        }}
      />
    );
  };
