// Enhanced logging and monitoring system for StyleFinder Quiz
import { QuizSubmission, StyleResult } from './types';

export interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetrics {
  quizSubmissions: number;
  emailsSent: number;
  emailFailures: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
}

// In-memory storage for development, replace with database in production
const logs: LogEvent[] = [];
const metrics: PerformanceMetrics = {
  quizSubmissions: 0,
  emailsSent: 0,
  emailFailures: 0,
  averageResponseTime: 0,
  errorRate: 0,
  uptime: Date.now()
};

// Performance tracking
const responseTimings: number[] = [];

/**
 * Core logging function
 */
export function log(
  level: LogEvent['level'],
  category: string,
  message: string,
  metadata?: Record<string, any>,
  userId?: string
): void {
  const logEvent: LogEvent = {
    level,
    category,
    message,
    timestamp: new Date(),
    metadata: sanitizeMetadata(metadata),
    userId,
    sessionId: generateSessionId()
  };

  // Store in memory (replace with proper logging service in production)
  logs.push(logEvent);

  // Keep only last 1000 logs in memory
  if (logs.length > 1000) {
    logs.shift();
  }

  // Console output with formatting
  const timestamp = logEvent.timestamp.toISOString();
  const logMessage = `[${timestamp}] ${level.toUpperCase()} [${category}] ${message}`;
  
  if (metadata) {
    console.log(logMessage, metadata);
  } else {
    console.log(logMessage);
  }

  // Send to external monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService(logEvent);
  }
}

/**
 * Convenience logging functions
 */
export const logger = {
  info: (category: string, message: string, metadata?: Record<string, any>, userId?: string) => 
    log('info', category, message, metadata, userId),
  
  warn: (category: string, message: string, metadata?: Record<string, any>, userId?: string) => 
    log('warn', category, message, metadata, userId),
  
  error: (category: string, message: string, metadata?: Record<string, any>, userId?: string) => 
    log('error', category, message, metadata, userId),
  
  debug: (category: string, message: string, metadata?: Record<string, any>, userId?: string) => 
    log('debug', category, message, metadata, userId)
};

/**
 * Track quiz submission events
 */
export function trackQuizSubmission(submission: QuizSubmission, results: StyleResult): void {
  metrics.quizSubmissions++;
  
  logger.info('quiz', 'Quiz submission completed', {
    userName: submission.userName,
    userEmail: submission.userEmail,
    primaryStyle: results.primary.name,
    primaryScore: results.primary.score,
    completionTime: submission.timestamp,
    section1Responses: Object.values(submission.section1).reduce((acc, group) => 
      acc + group.filter(Boolean).length, 0),
    section2Responses: submission.section2.answers.length
  }, submission.userEmail);
}

/**
 * Track email events
 */
export function trackEmailEvent(
  type: 'sent' | 'failed' | 'attempt',
  recipient: string,
  error?: any
): void {
  if (type === 'sent') {
    metrics.emailsSent++;
    logger.info('email', 'Email sent successfully', { recipient });
  } else if (type === 'failed') {
    metrics.emailFailures++;
    logger.error('email', 'Email sending failed', {
      recipient,
      error: error?.message,
      code: error?.code,
      command: error?.command
    });
  } else if (type === 'attempt') {
    logger.debug('email', 'Email sending attempt', { recipient });
  }
}

/**
 * Track API performance
 */
export function trackAPIPerformance(
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  error?: any
): void {
  responseTimings.push(responseTime);
  
  // Keep only last 100 response times for moving average
  if (responseTimings.length > 100) {
    responseTimings.shift();
  }
  
  // Update average response time
  metrics.averageResponseTime = responseTimings.reduce((a, b) => a + b, 0) / responseTimings.length;
  
  // Update error rate
  const recentLogs = logs.slice(-100);
  const errorCount = recentLogs.filter(l => l.level === 'error').length;
  metrics.errorRate = errorCount / Math.max(recentLogs.length, 1);

  const logData = {
    endpoint,
    method,
    statusCode,
    responseTime,
    userAgent: 'browser' // Could extract from headers in API route
  };

  if (statusCode >= 400) {
    logger.error('api', `API error ${statusCode}`, { ...logData, error: error?.message });
  } else {
    logger.info('api', `API request completed`, logData);
  }
}

/**
 * Get system health metrics
 */
export function getHealthMetrics(): PerformanceMetrics & { 
  recentErrors: LogEvent[];
  systemStatus: 'healthy' | 'warning' | 'critical';
} {
  const recentErrors = logs
    .filter(l => l.level === 'error' && 
      (Date.now() - l.timestamp.getTime()) < 60 * 60 * 1000) // Last hour
    .slice(-10);

  const systemStatus = metrics.errorRate > 0.5 ? 'critical' : 
                      metrics.errorRate > 0.1 ? 'warning' : 'healthy';

  return {
    ...metrics,
    uptime: Date.now() - metrics.uptime,
    recentErrors,
    systemStatus
  };
}

/**
 * Get filtered logs for debugging
 */
export function getLogs(options?: {
  level?: LogEvent['level'];
  category?: string;
  limit?: number;
  since?: Date;
}): LogEvent[] {
  let filteredLogs = logs;

  if (options?.level) {
    filteredLogs = filteredLogs.filter(l => l.level === options.level);
  }

  if (options?.category) {
    filteredLogs = filteredLogs.filter(l => l.category === options.category);
  }

  if (options?.since) {
    filteredLogs = filteredLogs.filter(l => l.timestamp >= options.since!);
  }

  const limit = options?.limit || 100;
  return filteredLogs.slice(-limit);
}

/**
 * Create monitoring dashboard data
 */
export function getDashboardData() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const lastHour = new Date(now - oneHour);

  const recentLogs = logs.filter(l => l.timestamp >= lastHour);
  const quizSubmissions = recentLogs.filter(l => l.category === 'quiz').length;
  const emailEvents = recentLogs.filter(l => l.category === 'email').length;
  const errors = recentLogs.filter(l => l.level === 'error').length;

  return {
    currentTime: new Date(),
    lastHourStats: {
      quizSubmissions,
      emailEvents,
      errors,
      totalEvents: recentLogs.length
    },
    overallMetrics: metrics,
    systemHealth: getHealthMetrics(),
    topErrors: recentLogs
      .filter(l => l.level === 'error')
      .reduce((acc: Record<string, number>, log) => {
        acc[log.message] = (acc[log.message] || 0) + 1;
        return acc;
      }, {})
  };
}

/**
 * Sanitize metadata to prevent logging sensitive information
 */
function sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
  if (!metadata) return undefined;

  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'pass'];
  const sanitized = { ...metadata };

  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
}

/**
 * Generate session ID for tracking
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

/**
 * Send logs to external monitoring service (implement based on your service)
 */
function sendToMonitoringService(logEvent: LogEvent): void {
  // Example implementations:
  
  // For Sentry:
  // if (logEvent.level === 'error') {
  //   Sentry.captureException(new Error(logEvent.message), {
  //     level: 'error',
  //     tags: { category: logEvent.category },
  //     extra: logEvent.metadata
  //   });
  // }

  // For DataDog:
  // DD.logger.log(logEvent.message, logEvent.metadata, logEvent.level);

  // For custom webhook:
  // fetch('/api/logs', {
  //   method: 'POST',
  //   body: JSON.stringify(logEvent)
  // }).catch(console.error);

  // Placeholder - implement based on your monitoring solution
  console.debug('Monitoring service:', logEvent);
}

/**
 * Initialize monitoring system
 */
export function initializeMonitoring(): void {
  logger.info('system', 'StyleFinder Quiz monitoring system initialized', {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });

  // Set up periodic health checks in production
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      const health = getHealthMetrics();
      logger.info('system', 'Health check', {
        systemStatus: health.systemStatus,
        errorRate: health.errorRate,
        uptime: health.uptime,
        quizSubmissions: health.quizSubmissions
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}