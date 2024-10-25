"use client"

import React, { useState } from 'react'
import { Upload, Settings, Play, BarChart2, Download, CheckCircle2, AlertCircle, Table, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'

const sampleData = [
  { name: 'Age', original: 40, synthetic: 38 },
  { name: 'Income', original: 50000, synthetic: 51000 },
  { name: 'Expenses', original: 30000, synthetic: 29000 },
  { name: 'Savings', original: 20000, synthetic: 22000 },
  { name: 'Credit Score', original: 720, synthetic: 715 },
]

const correlationData = [
  { variable: 'Age-Income', original: 0.75, synthetic: 0.73 },
  { variable: 'Income-Expenses', original: 0.68, synthetic: 0.65 },
  { variable: 'Expenses-Savings', original: -0.45, synthetic: -0.42 },
  { variable: 'Savings-Credit', original: 0.58, synthetic: 0.56 },
]

const scatterData = [
  { x: 30, y: 40000, z: 10 },
  { x: 35, y: 45000, z: 12 },
  { x: 40, y: 50000, z: 15 },
  { x: 45, y: 55000, z: 20 },
  { x: 50, y: 60000, z: 18 },
]

const sampleTableData = [
  { id: 1, age: 35, income: 48000, expenses: 28000, savings: 20000, creditScore: 710 },
  { id: 2, age: 42, income: 52000, expenses: 31000, savings: 21000, creditScore: 725 },
  { id: 3, age: 28, income: 45000, expenses: 27000, savings: 18000, creditScore: 690 },
  { id: 4, age: 50, income: 60000, expenses: 35000, savings: 25000, creditScore: 750 },
  { id: 5, age: 38, income: 51000, expenses: 30000, savings: 21000, creditScore: 715 },
]

export default function Component() {
  const [activeStep, setActiveStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [selectedModel, setSelectedModel] = useState('vae')
  const [activeTab, setActiveTab] = useState('visualize')
  const [generationProgress, setGenerationProgress] = useState(0)

  const steps = [
    { number: 1, title: 'Upload Data', icon: Upload, completed: true },
    { number: 2, title: 'Configure', icon: Settings, completed: true },
    { number: 3, title: 'Generate', icon: Play, completed: false },
    { number: 4, title: 'Analyze', icon: BarChart2, completed: false },
  ]

  const handleFileUpload = () => {
    setUploadStatus('uploading')
    setTimeout(() => {
      setUploadStatus('success')
      setActiveStep(2)
    }, 1500)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setActiveStep(4)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const ModelConfig = {
    vae: {
      name: 'Variational Autoencoder',
      description: 'Best for continuous numerical data with complex distributions',
      parameters: [
        { name: 'Latent Dimension', description: 'The size of the latent space in the VAE model' },
        { name: 'Learning Rate', description: 'Step size for each iteration of model optimization' },
        { name: 'Batch Size', description: 'Number of samples processed before the model is updated' }
      ]
    },
    gan: {
      name: 'Tabular GAN',
      description: 'Specialized for mixed-type tabular data',
      parameters: [
        { name: 'Noise Dimension', description: 'Size of the random noise vector input to the generator' },
        { name: 'Discriminator Layers', description: 'Number of layers in the discriminator neural network' },
        { name: 'Generator Layers', description: 'Number of layers in the generator neural network' }
      ]
    },
    copula: {
      name: 'Copula-based Synthesis',
      description: 'Excellent for preserving complex dependencies',
      parameters: [
        { name: 'Copula Family', description: 'Type of copula function used (e.g., Gaussian, t-copula)' },
        { name: 'Marginal Distribution', description: 'Assumed distribution for each variable (e.g., normal, gamma)' },
        { name: 'Correlation Method', description: 'Method used to estimate correlations (e.g., Pearson, Kendall)' }
      ]
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">DataAlchemy- Synthetic Data Generator</h1>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`flex flex-col items-center cursor-pointer
              ${activeStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveStep(step.number)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
              ${activeStep >= step.number ? 'bg-primary/20' : 'bg-muted'}`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className="text-sm">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Main Work Area */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Configuration Panel</CardTitle>
            <CardDescription>Set up your numerical synthetic data generation parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Data Upload</TabsTrigger>
                <TabsTrigger value="config">Model Config</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {uploadStatus === 'success' ? (
                    <div className="text-green-600 flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 mb-2" />
                      <p>Upload successful! numerical_data.csv</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag and drop your CSV file here</p>
                      <Button 
                        className="mt-2"
                        onClick={handleFileUpload}
                      >
                        {uploadStatus === 'uploading' ? 'Uploading...' : 'Select File'}
                      </Button>
                    </div>
                  )}
                </div>
                {uploadStatus === 'success' && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Data Preview</AlertTitle>
                    <AlertDescription>
                      10,000 rows × 5 numerical columns detected
                    </AlertDescription>
                  </Alert>
                )}
                {uploadStatus === 'success' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2">ID</th>
                          <th className="p-2">Age</th>
                          <th className="p-2">Income</th>
                          <th className="p-2">Expenses</th>
                          <th className="p-2">Savings</th>
                          <th className="p-2">Credit Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleTableData.map((row) => (
                          <tr key={row.id} className="border-b">
                            <td className="p-2">{row.id}</td>
                            <td className="p-2">{row.age}</td>
                            <td className="p-2">{row.income}</td>
                            <td className="p-2">{row.expenses}</td>
                            <td className="p-2">{row.savings}</td>
                            <td className="p-2">{row.creditScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div>
                  <Label htmlFor="model">Generation Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vae">Variational Autoencoder</SelectItem>
                      <SelectItem value="gan">Tabular GAN</SelectItem>
                      <SelectItem value="copula">Copula-based Synthesis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <AlertTitle>{ModelConfig[selectedModel].name}</AlertTitle>
                  <AlertDescription>
                    {ModelConfig[selectedModel].description}
                  </AlertDescription>
                </Alert>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="parameters">
                    <AccordionTrigger>Model Parameters</AccordionTrigger>
                    <AccordionContent>
                      {ModelConfig[selectedModel].parameters.map((param, index) => (
                        <div key={index} className="mb-4">
                          <Label htmlFor={param.name}>{param.name}</Label>
                          <Input id={param.name} type="number" placeholder="Enter value" />
                          <p className="text-sm text-muted-foreground mt-1">{param.description}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div>
                  <Label htmlFor="sample-size">Sample Size</Label>
                  <Input id="sample-size" type="number" placeholder="10000" />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label htmlFor="privacy-budget">
                    Privacy Budget (ε)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-1">
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Controls the trade-off between privacy and utility. Lower values provide stronger privacy guarantees.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Slider
                    id="privacy-budget"
                    min={0}
                    max={10}
                    step={0.1}
                    defaultValue={[1]}
                  />
                </div>
                <div>
                  <Label htmlFor="noise-multiplier">
                    Noise Multiplier
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-1">
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Determines the amount of noise added to achieve differential privacy. Higher values increase privacy but may reduce data utility.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Slider
                    id="noise-multiplier"
                    min={0}
                    max={2}
                    step={0.05}
                    defaultValue={[0.5]}
                  />
                </div>
                <div>
                  <Label htmlFor="clipping-threshold">
                    Gradient Clipping Threshold
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-1">
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Limits the influence of individual examples on the model, enhancing privacy and stability.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input id="clipping-threshold" type="number" placeholder="1.0" />
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full mt-4"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Data'}
            </Button>

            {isGenerating && (
              <Progress value={generationProgress} className="mt-2" />
            )}
          </CardContent>
        </Card>

        {/* Visualization Area */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Numerical Analysis Dashboard</CardTitle>
            <CardDescription>Compare original and synthetic numerical data</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="visualize">Visualize</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="distributions">Distributions</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="visualize">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="original" fill="#8884d8" name="Original" />
                    <Bar dataKey="synthetic" fill="#82ca9d" name="Synthetic" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="correlations">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="variable" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="original" stroke="#8884d8" name="Original" />
                    <Line type="monotone" dataKey="synthetic" stroke="#82ca9d" name="Synthetic" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="distributions">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Age" />
                    <YAxis type="number" dataKey="y" name="Income" />
                    <ZAxis type="number" dataKey="z" range={[0, 200]} name="Expenses" />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Original Data" data={scatterData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="statistics">
                <div className="space-y-4">
                  <Alert>
                    <Table className="w-4 h-4" />
                    <AlertTitle>Statistical Tests</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Kolmogorov-Smirnov test:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">p-value = 0.92</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Measures the similarity of distributions. Higher p-value indicates more similar distributions.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Anderson-Darling test:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">p-value = 0.88</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Tests if a sample comes from a specified distribution. Higher p-value suggests better fit.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Chi-squared test:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">p-value = 0.95</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Compares observed frequencies with expected frequencies. Higher p-value indicates better match.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded">
                      <h4 className="font-medium mb-2">Original Data</h4>
                      <div className="space-y-1">
                        <p className="text-sm flex justify-between">
                          <span>Mean:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">42.5</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Average value of the dataset</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Median:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">41.2</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Middle value of the dataset</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Std:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">15.3</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Standard deviation, measure of data spread</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Skewness:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">0.12</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Measure of asymmetry in data distribution</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Kurtosis:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">2.95</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Measure of the "tailedness" of the distribution</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded">
                      <h4 className="font-medium mb-2">Synthetic Data</h4>
                      <div className="space-y-1">
                        <p className="text-sm flex justify-between">
                          <span>Mean:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">41.8</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Average value of the dataset</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Median:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">40.9</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Middle value of the dataset</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Std:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">15.7</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Standard deviation, measure of data spread</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Skewness:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">0.15</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Measure of asymmetry in data distribution</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Kurtosis:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="font-semibold">2.88</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Measure of the "tailedness" of the distribution</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Numerical Quality Assessment</CardTitle>
          <CardDescription>Comprehensive metrics for evaluating synthetic data quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Alert>
              <AlertTitle>Statistical Similarity</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                98.5% match
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Based on KS test, Chi-squared test, and QQ plot analysis. Higher percentage indicates better similarity between original and synthetic data distributions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle>Privacy Preservation</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                ε = 1.2 (Differential Privacy)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Epsilon (ε) value in differential privacy. Lower ε indicates stronger privacy guarantees but may reduce data utility.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle>Correlation Preservation</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                95% preserved
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Measures how well the synthetic data maintains relationships between variables. Based on Pearson and Spearman correlation coefficients.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle>Machine Learning Utility</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                92% performance retention
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compares model performance when trained on original vs. synthetic data. Higher percentage indicates better utility for machine learning tasks.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle>Data Diversity</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                High (0.89 Gini coefficient)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gini coefficient measures the variety and balance of synthetic data points. Higher values indicate more diverse data.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle>Outlier Preservation</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                97% preserved
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of outliers from the original data that are correctly represented in the synthetic data. Important for maintaining realistic data patterns.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Synthetic Data
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Quality Report
        </Button>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Advanced Settings
        </Button>
      </div>
    </div>
  )
}