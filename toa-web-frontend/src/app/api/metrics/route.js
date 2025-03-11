import client from 'prom-client';
import { NextResponse } from 'next/server';

// Prometheus 기본 메트릭 수집 활성화 (애플리케이션 시작 시 1회 실행)
if (!global.metricsInitialized) {
  client.collectDefaultMetrics();
  global.metricsInitialized = true;
}

// 요청 수 메트릭 정의 (전역 변수로 유지)
const httpRequestCounter = global.httpRequestCounter || new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
global.httpRequestCounter = httpRequestCounter;

// Prometheus 메트릭 엔드포인트 핸들러
export async function GET(req) {
  const route = req.nextUrl.pathname;

  // Prometheus 메트릭 반환
  if (route === '/api/metrics') {
    const metrics = await client.register.metrics();
    return new NextResponse(metrics, {
      status: 200,
      headers: { 'Content-Type': client.register.contentType }
    });
  }

  // 일반 요청 응답 및 메트릭 증가
  httpRequestCounter.inc({ method: 'GET', route, status: '200' });
  return new NextResponse('OK', { status: 200 });
}

// 미들웨어로 모든 요청 기록
export async function middleware(req) {
  const route = req.nextUrl.pathname;

  // 요청 수 증가 (모든 경로, 상태는 UNKNOWN으로 설정)
  httpRequestCounter.inc({ method: req.method, route, status: 'UNKNOWN' });

  return NextResponse.next();
}
