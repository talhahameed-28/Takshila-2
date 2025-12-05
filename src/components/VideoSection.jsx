export default function VideoSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="assets/video.mp4" type="video/mp4" />
        <source src="assets/video.webm" type="video/webm" />
      </video>
    </section>
  );
}
