"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Copy,
  Check,
  Trash2,
  Monitor,
  ChevronRight,
} from "lucide-react"

// TODO: Replace with real license data from API
const PLACEHOLDER_LICENSES = [
  { id: "lic_1", maskedKey: "KF-XXXX-XXXX-XXXX-G7H8", tier: "Enterprise" },
  { id: "lic_2", maskedKey: "KF-XXXX-XXXX-XXXX-O5P6", tier: "Professional" },
] as const

// TODO: Replace with real activation data from API
const PLACEHOLDER_ACTIVATIONS = [
  {
    id: "act_1",
    licenseKey: "KF-XXXX-XXXX-XXXX-G7H8",
    machineFingerprint: "a3b4c5d6e7f8",
    machineName: "Production Server 1",
    activatedAt: "2026-03-15",
  },
  {
    id: "act_2",
    licenseKey: "KF-XXXX-XXXX-XXXX-G7H8",
    machineFingerprint: "f8e7d6c5b4a3",
    machineName: "Dev Workstation",
    activatedAt: "2026-03-20",
  },
] as const

type Step = 1 | 2 | 3

export default function ActivatePage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [selectedLicense, setSelectedLicense] = useState("")
  const [requestCode, setRequestCode] = useState("")
  const [activationCode, setActivationCode] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerateActivation = useCallback(() => {
    // TODO: Call API to generate activation code from request code
    setActivationCode(
      "ACTV-" +
        Array.from({ length: 32 }, () =>
          Math.random().toString(36).charAt(2)
        ).join("")
    )
    setCurrentStep(3)
  }, [])

  const handleCopyActivation = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activationCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [activationCode])

  const handleReset = useCallback(() => {
    setCurrentStep(1)
    setSelectedLicense("")
    setRequestCode("")
    setActivationCode("")
  }, [])

  const stepClasses = (step: Step) =>
    step === currentStep
      ? "border-primary bg-primary/5"
      : step < currentStep
        ? "border-primary/30 bg-primary/5 opacity-60"
        : "border-border opacity-40"

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          License Activation
        </h1>
        <p className="text-muted-foreground">
          Activate your KnowFlow AI license on a new machine.
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-medium ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            <span className="hidden text-sm sm:inline">
              {step === 1 && "Select License"}
              {step === 2 && "Request Code"}
              {step === 3 && "Activation Code"}
            </span>
            {step < 3 && (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="grid gap-4">
        {/* Step 1: Select license */}
        <Card className={stepClasses(1)}>
          <CardHeader>
            <CardTitle className="text-base">
              Step 1: Select a License
            </CardTitle>
            <CardDescription>
              Choose which license you want to activate on a new machine.
            </CardDescription>
          </CardHeader>
          {currentStep >= 1 && (
            <CardContent className="grid gap-2">
              {PLACEHOLDER_LICENSES.map((license) => (
                <button
                  key={license.id}
                  type="button"
                  onClick={() => {
                    setSelectedLicense(license.id)
                    setCurrentStep(2)
                  }}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted ${
                    selectedLicense === license.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <Shield className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-mono font-medium">
                      {license.maskedKey}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {license.tier}
                    </p>
                  </div>
                  {selectedLicense === license.id && (
                    <Check className="size-4 text-primary" />
                  )}
                </button>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Step 2: Paste request code */}
        <Card className={stepClasses(2)}>
          <CardHeader>
            <CardTitle className="text-base">
              Step 2: Paste Activation Request
            </CardTitle>
            <CardDescription>
              Run the KnowFlow CLI on your target machine and paste the
              generated request code below.
            </CardDescription>
          </CardHeader>
          {currentStep >= 2 && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-code">Request Code</Label>
                <Textarea
                  id="request-code"
                  placeholder="Paste your activation request code here..."
                  value={requestCode}
                  onChange={(e) => setRequestCode(e.target.value)}
                  className="font-mono text-xs"
                  rows={4}
                />
              </div>
              <Button
                onClick={handleGenerateActivation}
                disabled={!requestCode.trim()}
              >
                Generate Activation Code
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Step 3: Activation code */}
        <Card className={stepClasses(3)}>
          <CardHeader>
            <CardTitle className="text-base">
              Step 3: Copy Activation Code
            </CardTitle>
            <CardDescription>
              Copy this code and paste it into the KnowFlow CLI to complete
              activation.
            </CardDescription>
          </CardHeader>
          {currentStep >= 3 && activationCode && (
            <CardContent className="space-y-4">
              <div className="relative rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs font-mono break-all whitespace-pre-wrap">
                  {activationCode}
                </pre>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopyActivation}
                  aria-label="Copy activation code"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
              <Button variant="outline" onClick={handleReset}>
                Activate Another Machine
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Current activations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Current Activations</h2>
        {(PLACEHOLDER_ACTIVATIONS as ReadonlyArray<typeof PLACEHOLDER_ACTIVATIONS[number]>).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No activations yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {PLACEHOLDER_ACTIVATIONS.map((activation) => (
              <Card key={activation.id} size="sm">
                <CardContent className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Monitor className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activation.machineName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">
                        {activation.machineFingerprint}
                      </span>{" "}
                      &middot; {activation.licenseKey} &middot; Activated{" "}
                      {activation.activatedAt}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Revoke activation for ${activation.machineName}`}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
