"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Users, 
  FileText,
  Sparkles,
  ArrowDown,
  Zap
} from "lucide-react";

export default function InterviewPage(){
    return(
        <main className="pt-20 pb-16 bg-background text-foreground">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 lg:px-16 mb-20">
                <Card className="border border-border/60 shadow-lg overflow-hidden bg-gradient-to-br from-background to-muted/20">
                    <CardContent className="p-0 grid md:grid-cols-2 gap-0">
                        <div className="relative h-80 md:h-[500px] overflow-hidden">
                            <Image
                                src="/ai-interview.jpg"
                                alt="Vulcan Interview Master"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center gap-6 bg-background/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-6 w-6 text-vulcan-accent-blue" />
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
                                    Vulcan Interview Master
                                </h1>
                            </div>
                            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                                Interviews can be stressful — but what if you could practice with an AI that feels just like a real interviewer, without the pressure? Vulcan Interview Master helps you sharpen your communication, boost your confidence, and get actionable feedback to improve so you can walk into every interview fully prepared to impress.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                <Button 
                                    variant="outline" 
                                    disabled 
                                    className="opacity-60 cursor-not-allowed border-muted-foreground/30"
                                >
                                    Coming Soon
                                </Button>
                                <a href="#more-info" className="smooth-scroll">
                                    <Button className={cn(
                                        "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                                        "shadow-md hover:shadow-lg transition-all duration-300"
                                    )}>
                                        More Information
                                        <ArrowDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* More Information */}
            <section id="more-info" className="container mx-auto px-4 md:px-6 lg:px-16 space-y-16 py-12">
                {/* Why Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="h-8 w-8 text-vulcan-accent-blue" />
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
                            Why Vulcan Interview Master?
                        </h2>
                    </div>
                    <Card className="border border-border/60 shadow-md bg-gradient-to-br from-background to-muted/10">
                        <CardContent className="p-8 md:p-10">
                            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                                Interviews can be intimidating. No matter how much you prepare, that one question — "Tell me about yourself" — can make your mind go blank. We've all been there. That's why Vulcan Academy created Vulcan Interview Master, an AI-powered interview simulation platform that helps you practice in a safe, supportive, and smart environment. It feels like a real interview but instead of judging you, it helps you grow.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* What is Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="h-8 w-8 text-vulcan-accent-blue" />
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                            What is Vulcan Interview Master?
                        </h3>
                    </div>
                    <Card className="border border-border/60 shadow-md">
                        <CardContent className="p-8 md:p-10">
                            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                                Think of it as your personal interview coach, available 24×7. It asks real questions, listens to your responses, and even throws follow-up questions just like a human panel would. The difference? It also tells you how you performed — what went well, what could be better, and exactly how to improve next time.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* For Whom Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="h-8 w-8 text-vulcan-accent-blue" />
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                            For Whom?
                        </h3>
                    </div>
                    <Card className="border border-border/60 shadow-md">
                        <CardContent className="p-8 md:p-10">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue mt-1 flex-shrink-0" />
                                    <p className="text-base md:text-lg text-foreground/80">Students preparing for campus placements</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue mt-1 flex-shrink-0" />
                                    <p className="text-base md:text-lg text-foreground/80">Job seekers looking to improve their confidence and communication</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue mt-1 flex-shrink-0" />
                                    <p className="text-base md:text-lg text-foreground/80">Professionals aiming for a career switch or promotion</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue mt-1 flex-shrink-0" />
                                    <p className="text-base md:text-lg text-foreground/80">Colleges & Institutions that want to evaluate candidates through fair, smart, and efficient AI interviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-12" />

                {/* What Makes it Unique - Feature Cards */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="h-8 w-8 text-vulcan-accent-blue" />
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                            What Makes it Unique?
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-vulcan-accent-blue/10">
                                        <MessageSquare className="h-6 w-6 text-vulcan-accent-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold mb-3">Real Conversations, Not Scripts</h4>
                                        <p className="text-foreground/80 leading-relaxed">
                                            You won't be answering robotic questions. Vulcan Interview Master holds dynamic, natural conversations — adjusting based on what you say, just like a real interviewer.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-vulcan-accent-blue/10">
                                        <TrendingUp className="h-6 w-6 text-vulcan-accent-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold mb-3">Meaningful Feedback</h4>
                                        <p className="text-foreground/80 mb-3 leading-relaxed">
                                            After every session, you get a detailed report that covers:
                                        </p>
                                        <ul className="space-y-2 text-sm text-foreground/70">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue mt-0.5 flex-shrink-0" />
                                                <span>Clarity and confidence in your communication</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue mt-0.5 flex-shrink-0" />
                                                <span>How relevant and structured your answers were</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue mt-0.5 flex-shrink-0" />
                                                <span>Your tone, grammar, and vocabulary</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue mt-0.5 flex-shrink-0" />
                                                <span>Overall impression and readiness score</span>
                                            </li>
                                        </ul>
                                        <p className="text-foreground/80 mt-3 leading-relaxed italic">
                                            It's not just numbers — it's feedback you can actually use.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-vulcan-accent-blue/10">
                                        <Target className="h-6 w-6 text-vulcan-accent-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold mb-3">Actionable Guidance</h4>
                                        <p className="text-foreground/80 leading-relaxed">
                                            Vulcan Interview Master goes beyond pointing out mistakes. It tells you why they happened, and guides you towards improvement. You'll even get suggestions for specific courses and exercises that can help you close skill gaps.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-vulcan-accent-blue/10">
                                        <FileText className="h-6 w-6 text-vulcan-accent-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold mb-3">Resume Review Included</h4>
                                        <p className="text-foreground/80 leading-relaxed">
                                            Upload your resume and get an ATS (Applicant Tracking System) score with practical tips to make it stand out in recruiter screenings.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator className="my-12" />

                {/* You Will Love It Section */}
                <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground mb-6">
                        You will love it!
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "It feels real, but it's safe. Making a mistake will help you learn better.",
                            "You can practice anytime, as many times as you want — as long as you buy licence.",
                            "You'll see yourself getting better with every attempt.",
                            "You'll walk into your next interview knowing you're ready."
                        ].map((item, idx) => (
                            <Card key={idx} className="border border-border/60 shadow-sm bg-muted/20">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue mt-0.5 flex-shrink-0" />
                                        <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                                            {item}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Separator className="my-12" />

                {/* Our Promise Section */}
                <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground mb-6">
                        Our Promise
                    </h3>
                    <Card className="border border-border/60 shadow-lg bg-gradient-to-br from-vulcan-accent-blue/5 via-background to-muted/10">
                        <CardContent className="p-8 md:p-12">
                            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-4xl">
                                We built Vulcan Interview Master to help you discover your potential — not just to get a job, but to grow into the confident, capable version of yourself that every opportunity deserves. We know what our clients deserve and we try to match it.
                            </p>
                            <p className="text-base md:text-lg text-foreground/70 mt-6 italic">
                                Don't wait for the next interview call to start preparing. Take your first AI interview now — and meet the best version of yourself.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="mt-16 pt-12 border-t border-border/60">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button 
                            variant="outline" 
                            disabled 
                            className="opacity-60 cursor-not-allowed border-muted-foreground/30 min-w-[200px]"
                            size="lg"
                        >
                            Buy now (Coming soon)
                        </Button>
                        <a href="#top" className="smooth-scroll">
                            <Button 
                                variant="ghost" 
                                size="lg"
                                className="min-w-[200px]"
                            >
                                Back to top
                                <ArrowDown className="ml-2 h-4 w-4 rotate-180" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}