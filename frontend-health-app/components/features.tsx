import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Users, Zap } from "lucide-react"

const features = [
  {
    icon: CheckCircle2,
    title: "Task Management",
    description:
      "Create, assign, and track tasks with ease. Set priorities, deadlines, and dependencies to keep your team aligned and productive.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time updates, comments, and file sharing keep everyone on the same page. Work together seamlessly, no matter where you are.",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description:
      "Automate repetitive tasks and streamline your processes. Set up custom workflows that save time and reduce manual work.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-4">
            Everything you need to manage projects
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Powerful features designed to help teams work smarter, not harder
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
