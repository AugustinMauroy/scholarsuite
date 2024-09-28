import { auth } from '@/lib/auth';

export default auth(req => {
  if (!req.auth?.user.id && req.nextUrl.pathname !== '/signin') {
    const newUrl = new URL('/signin', req.nextUrl.origin);

    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    '/((?!api/auth-utils|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
