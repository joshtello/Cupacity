// Plugin to draw vertical line at bedtime
export const verticalLinePlugin = {
  id: 'verticalLine',
  afterDraw: (chart) => {
    const { ctx, chartArea, scales } = chart
    const bedtime = chart.options.plugins?.verticalLine?.bedtime
    const chartHours = chart.options.plugins?.verticalLine?.chartHours || 24
    
    if (!bedtime || !chartArea) return
    
    // Convert bedtime to chart position using 10-minute bins
    const binsPerHour = 6;
    const [bedHour, bedMinute] = bedtime.split(':').map(Number);
    let bedtimeIndex = bedHour * binsPerHour + Math.round(bedMinute / 10);
    if (bedHour < 12) bedtimeIndex += 24 * binsPerHour; // push early-morning bedtimes to +1
    const x = scales.x.getPixelForValue(bedtimeIndex)
    
    // Draw vertical line
    ctx.save()
    ctx.strokeStyle = '#ef4444' // Red color
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5]) // Dashed line
    ctx.beginPath()
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.bottom)
    ctx.stroke()
    
    // Add label
    ctx.fillStyle = '#ef4444'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Bedtime', x, chartArea.top - 10)
    ctx.restore()
  }
}

