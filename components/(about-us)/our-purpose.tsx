export function OurPurpose() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-background dark:bg-background">
      <div className="flex flex-col gap-24 px-4 sm:px-6 md:px-12">

        {/* Our Mission */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - heading and text */}
          <div className="lg:w-1/2 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              Our mission is to empower individuals with
              transformative testing and training solutions that 
              bridge the gap between academic theory and 
              practical application, fostering career skills and 
              unmatched confidence.
            </p>
          </div>

          {/* Right side - image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <img
              src="/avatar-of-a-happy-user.jpg"
              alt="Our Mission"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Our Vision */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start mb-6 lg:mb-0">
            <img
              src="/learning.jpg"
              alt="Our Vision"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg object-cover"
            />
          </div>

          {/* Right side - heading and text */}
          <div className="lg:w-1/2 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-6">
              Our Vision
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              To become the leading global platform for specialized skill
              assessment, driving excellence in communication,
              adaptability, and professional readiness.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
