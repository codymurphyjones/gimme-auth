

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
 
export default function handler(req: NextRequest, res: NextResponse) {
  res.status(200).json({ name: 'John Doe' })
}