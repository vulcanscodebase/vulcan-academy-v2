"use client"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"

const content = [
  {
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/training.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img src="/teacher.jpg" width={300} height={300} className="h-full w-full object-cover" alt="teacher" />
      </div>
    ),
  },
  {
    title: "Version control",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/c/c6/Jesse_Pinkman_S5B.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="demo"
        />
      </div>
    ),
  },
  {
    title: "Running out of content",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex w-full items-center justify-center text-white">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.jNLlIfvGdx_w2IeF4Ph7AgHaMk?rs=1&pid=ImgDetMain&o=7&rm=3"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="make sense"
        />
      </div>
    ),
  },
]

export function OurLeaders() {
  return (
    <div className="w-full py-4 min-h-screen">
      <StickyScroll content={content} />
    </div>
  )
}
