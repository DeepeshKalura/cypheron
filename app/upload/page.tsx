"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { UploadSteps } from "@/components/upload-steps"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileUp, Lock, CheckCircle2, AlertCircle } from "lucide-react"

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    price: "",
    license: "single-use",
    fileName: "",
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, fileName: file.name }))
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePublish = async () => {
    setIsUploading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    setCurrentStep(5)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border bg-card py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">List Your Dataset</h1>
            <p className="text-foreground/70">
              Monetize your data with end-to-end encryption and zero-knowledge verification
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Steps Sidebar */}
              <div className="md:col-span-1">
                <UploadSteps currentStep={currentStep} />
              </div>

              {/* Main Form */}
              <div className="md:col-span-3">
                <Card className="bg-card border-border p-8">
                  {/* Step 1: Dataset Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Dataset Information</h2>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Dataset Title</Label>
                        <Input
                          name="title"
                          placeholder="e.g., Real-Time Stock Market Data"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="bg-background border-border"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Description</Label>
                        <textarea
                          name="description"
                          placeholder="Describe what your dataset contains, its sources, and potential use cases..."
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm min-h-32"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Category</Label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                          >
                            <option value="">Select a category</option>
                            <option value="financial">Financial</option>
                            <option value="health">Health</option>
                            <option value="weather">Weather</option>
                            <option value="social">Social Sentiment</option>
                            <option value="supply">Supply Chain</option>
                            <option value="realestate">Real Estate</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Tags</Label>
                          <Input
                            name="tags"
                            placeholder="crypto, trading, market"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="bg-background border-border"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Upload Data */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Upload Your Data</h2>
                      </div>

                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                        <FileUp className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Drag and drop your file</h3>
                        <p className="text-sm text-foreground/50 mb-4">or click to browse</p>
                        <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload">
                          <Button type="button" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Upload className="w-4 h-4 mr-2" />
                            Select File
                          </Button>
                        </label>
                      </div>

                      {formData.fileName && (
                        <div className="bg-primary/10 border border-primary/20 rounded p-4 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">{formData.fileName}</p>
                            <p className="text-xs text-foreground/50">Ready to encrypt</p>
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-blue-500 mb-1">Supported Formats</p>
                          <p className="text-foreground/70">CSV, JSON, Parquet, Arrow, SQLite (Max 1GB)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Encryption */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Encryption Settings</h2>
                        <p className="text-foreground/70">Your data will be encrypted using Seal protocol</p>
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded p-6 space-y-4">
                        <div className="flex items-start gap-4">
                          <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                            <p className="text-sm text-foreground/70">
                              Your dataset is encrypted locally before being uploaded to distributed storage.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-background border-border p-4">
                          <p className="font-semibold text-sm mb-3">Encryption Method</p>
                          <p className="text-sm text-foreground/70">AES-256</p>
                        </Card>
                        <Card className="bg-background border-border p-4">
                          <p className="font-semibold text-sm mb-3">Storage</p>
                          <p className="text-sm text-foreground/70">Walrus Distributed</p>
                        </Card>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                        <p className="text-sm text-green-500 font-semibold">
                          Only buyers with the decryption key can access your data
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Pricing & Terms */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Pricing & License</h2>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Price (USD)</Label>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-primary mr-2">$</span>
                          <Input
                            type="number"
                            name="price"
                            placeholder="99.99"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="bg-background border-border flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold mb-2 block">License Type</Label>
                        <div className="space-y-3">
                          {[
                            { value: "single-use", label: "Single Use", desc: "License for one buyer only" },
                            { value: "limited", label: "Limited", desc: "Up to 10 buyers" },
                            { value: "unlimited", label: "Unlimited", desc: "Available to unlimited buyers" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center p-3 border border-border rounded cursor-pointer hover:bg-primary/5 transition"
                            >
                              <input
                                type="radio"
                                name="license"
                                value={option.value}
                                checked={formData.license === option.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 mr-3"
                              />
                              <div>
                                <p className="font-semibold text-sm">{option.label}</p>
                                <p className="text-xs text-foreground/50">{option.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Deploy */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Dataset Published!</h2>
                        <p className="text-foreground/70">Your dataset is now listed on the marketplace</p>
                      </div>

                      <Card className="bg-primary/10 border-primary/20 p-6">
                        <h3 className="font-semibold mb-4">Listing Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Dataset:</span>
                            <span className="font-semibold">{formData.title || "Untitled"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Price:</span>
                            <span className="font-semibold">${formData.price || "0"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">License:</span>
                            <span className="font-semibold capitalize">{formData.license}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-8 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className="border-border disabled:opacity-50 bg-transparent"
                    >
                      Back
                    </Button>

                    {currentStep === 5 ? (
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        View Your Dataset
                      </Button>
                    ) : (
                      <Button
                        onClick={currentStep === 4 ? handlePublish : handleNext}
                        disabled={isUploading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isUploading ? "Publishing..." : currentStep === 4 ? "Publish Dataset" : "Next Step"}
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
