import { useQuery } from '@tanstack/react-query'
import { transformRiskData } from '@/features/portfolio/utils/transformRiskData'

export function useRiskMetrics(userId: number) {
  return useQuery({
    queryKey: ['riskMetrics', userId],
    queryFn: async () => {
      const res = await fetch(`/api/risk?userId=${userId}`)

      if (!res.ok) {
        throw new Error('Failed to fetch risk metrics')
      }

      const data = await res.json()
      return transformRiskData(data)
    },
    staleTime: 60 * 1000,
    retry: 2,
  })
}
