const expertise = [
  {
    title: "English Proficiency",
    desc: "Enhance your English skills for academic and professional success.",
    img: "/learning.jpg",
  },
  {
    title: "Accent Training",
    desc: "Master clear and confident communication with our accent training programs.",
    img: "/training.jpg",
  },
  {
    title: "BPO Roles",
    desc: "Prepare for successful careers in the BPO industry with specialized training.",
    img: "/teacher.jpg",
  },
  {
    title: "Study Abroad Preparation",
    desc: "Get ready for global opportunities with our tailored preparation solutions.",
    img: "/learn.gif",
  },
  {
    title: "Bespoke Tests",
    desc: "Custom tests designed for organizations to enhance communication skills.",
    img: "bespoke.jpeg",
  },
]

export function OurExpertise() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-28 bg-background">
      <div className="px-4 md:px-12">
        {/* Heading */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground text-balance mb-12">
          Our Expertise
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertise.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition ${
                idx === 3 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              {/* Image */}
              <div className="h-36 w-full">
                <img src={item.img || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
              </div>

              {/* Text */}
              <div className="p-4 flex flex-col flex-grow justify-end">
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-2">{item.title}</h3>
                <p className="text-base text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
