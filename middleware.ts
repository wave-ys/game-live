import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {PATH_PREFIX} from "@/api";

export function middleware(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host');
  if (!forwardedProto || !forwardedHost || `${forwardedProto}://${forwardedHost}` !== PATH_PREFIX)
    return NextResponse.redirect(`${PATH_PREFIX}${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.next();
}