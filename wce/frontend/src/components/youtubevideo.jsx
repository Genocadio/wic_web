import React from 'react';

const VideoOrYouTubePlayer = ({ link }) => {
  if (link.includes('youtu.be') || link.includes('youtube.com')) {
    const videoId = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1];
    if (videoId) {
      return <YouTubeVideo videoId={videoId} />;
    } else {
      return <p>Invalid YouTube link: {link}</p>;
    }
  } else {
    return (
      <video src={link.trim()} controls style={{ maxWidth: '200px', margin: '5px' }}>
        Your browser does not support the video tag.
      </video>
    );
  }
};

const YouTubeVideo = ({ videoId }) => {
  return (
    <div className="youtube-video">
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`YouTube Video ${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoOrYouTubePlayer;