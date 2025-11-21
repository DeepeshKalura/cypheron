import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface UploadStepsProps {
  currentStep: number
}

const steps = [
  { number: 1, title: "Dataset Info", description: "Name and describe your data" },
  { number: 2, title: "Upload Data", description: "Select and prepare your file" },
  { number: 3, title: "Encryption", description: "Encrypt with Seal protocol" },
  { number: 4, title: "Pricing & Terms", description: "Set price and license" },
  { number: 5, title: "Review & Deploy", description: "Verify and publish" },
]

export function UploadSteps({ currentStep }: UploadStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isComplete = step.number < currentStep
        return (
          <Card
            key={step.number}
            className={`p-4 border cursor-pointer transition ${
              isActive
                ? "bg-primary/10 border-primary"
                : isComplete
                  ? "bg-card border-border"
                  : "bg-card border-border/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {step.number}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-foreground/50 text-sm font-bold">
                    {step.number}
                  </div>
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${isActive ? "text-primary" : ""}`}>{step.title}</h3>
                <p className="text-xs text-foreground/50">{step.description}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
