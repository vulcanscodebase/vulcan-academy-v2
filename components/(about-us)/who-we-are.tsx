export function WhoWeAre() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-48 bg-background">
      <div className="flex flex-col lg:flex-row items-center gap-12 px-4 sm:px-6 md:px-12">
        
        {/* Left side - heading and text */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
            Who We Are
          </h2>
          <p className="mb-8 text-base sm:text-lg md:text-lg lg:text-xl text-foreground/80 leading-relaxed">
            At Vulcan Academy, we’re not just about education; we’re about elevating your career to unprecedented levels. Established with the mission to instill apt skills among the youth, we introduce you to a world of innovative testing solutions designed to propel you towards your aspirations.<br /><br />

            We focus on practical learning and real-world projects to ensure that every student is prepared for the challenges of their chosen career path.<br /><br />

            Our team of experts continuously innovates to provide interactive, engaging, and effective learning experiences that drive success.
          </p>
          {/* Optional Button */}
          {/* <button className="bg-vulcan-accent-blue text-vulcan-white px-6 py-3 rounded-md hover:bg-vulcan-accent-blue/90 transition">
            Learn More
          </button> */}
        </div>

        {/* Right side - image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img
            // src={aboutImage}
            alt="About Vulcan Academy"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg object-cover"
          />
        </div>

      </div>
    </section>
  );
}
