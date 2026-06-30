export interface QAEvent {
  type: string
  file?: string
  index?: number
  url?: string
  screenshot?: string
  metrics?: any
  rule_issues?: RuleIssue[]
  ai_result?: AIResult
  total?: number
  total_rule_issues?: number
  total_ai_issues?: number
  avg_score?: number
  results?: PageResult[]
  error?: string
  message?: string
  port?: number
  stdout?: string
  stderr?: string
  title?: string
}

export interface RuleIssue {
  type: string
  src?: string
  tag?: string
  text?: string
  count?: number
  body_width?: number
  viewport?: number
  message?: string
}

export interface AIResult {
  issues: AIIssue[]
  summary: string
  score: number
  error?: string
}

export interface AIIssue {
  severity: 'high' | 'medium' | 'low'
  category: string
  description: string
  location?: string
}

export interface PageResult {
  file: string
  url: string
  screenshot: string
  rule_issues: RuleIssue[]
  ai_result: AIResult
  metrics: {
    total_elements: number
    total_images: number
    body_width: number
  }
}

export interface QAConfig {
  ai_provider: 'openrouter' | 'ollama'
  ai_model: string
  openRouterKey?: string
  ollamaUrl?: string
  viewport_w: number
  viewport_h: number
}
