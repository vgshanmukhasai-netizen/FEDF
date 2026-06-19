import { useEffect, useRef } from 'react'

const useChart = (data) => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return
    // Chart.js initialization and update logic will be added here.
  }, [data])

  return chartRef
}

export default useChart
