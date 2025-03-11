import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const response = NextResponse.next();
  // Set the language cookie
  const lang = request.cookies.get('language');
  if(!Boolean(lang)){
    response.cookies.set('language', 'en', { path: '/' });
  }
 
  return response;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*', // This will match all paths
}
