import { NextRequest, NextResponse } from 'next/server';
import { getHealthMetrics, getLogs, getDashboardData } from '@/lib/logger';

// Simple authentication for admin endpoints (implement proper auth in production)
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminToken = process.env.ADMIN_TOKEN || 'admin123'; // Change this in production!
  
  return authHeader === `Bearer ${adminToken}`;
}

/**
 * GET /api/health - System health and metrics endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Check authorization for detailed metrics
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    
    if (detailed && !isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide valid Bearer token.' },
        { status: 401 }
      );
    }

    if (detailed) {
      // Return comprehensive dashboard data for admin
      const dashboardData = getDashboardData();
      
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        ...dashboardData
      });
    } else {
      // Return basic health check
      const health = getHealthMetrics();
      
      return NextResponse.json({
        status: health.systemStatus,
        timestamp: new Date().toISOString(),
        uptime: health.uptime,
        quizSubmissions: health.quizSubmissions,
        errorRate: health.errorRate,
        averageResponseTime: health.averageResponseTime
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Health check failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/health/logs - Retrieve system logs
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide valid Bearer token.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { level, category, limit, sinceHours } = body;
    
    const since = sinceHours ? new Date(Date.now() - sinceHours * 60 * 60 * 1000) : undefined;
    
    const logs = getLogs({
      level,
      category,
      limit: limit || 100,
      since
    });

    return NextResponse.json({
      logs,
      count: logs.length,
      filters: { level, category, limit, sinceHours }
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to retrieve logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}