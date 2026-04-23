import { Suspense } from 'react'
import OpenPositionContainer from '@/features/open-positions/containers/OpenPositionContainer'

export default function OpenPositionsPage() {
  return (
    <Suspense fallback={null}>
      <OpenPositionContainer />
    </Suspense>
  )
}
