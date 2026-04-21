const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, hour) => hour)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const getIntensity = (dayIndex, hour) => {
  const isWeekday = dayIndex <= 4
  const isLunch = hour >= 11 && hour <= 14
  const isDinner = hour >= 18 && hour <= 21

  let value = 0.08

  if (isWeekday && isLunch) value += 0.55
  if (isWeekday && isDinner) value += 0.65
  if (isWeekday && hour >= 9 && hour <= 17) value += 0.12
  if (!isWeekday && (isLunch || isDinner)) value += 0.2

  // Slight per-cell variation so the map doesn't look flat.
  const variation = ((dayIndex * 13 + hour * 7) % 10) / 100
  return clamp(value + variation, 0.05, 0.9)
}

const heatmapData = days.map((day, dayIndex) => ({
  day,
  values: hours.map((hour) => ({
    hour,
    intensity: getIntensity(dayIndex, hour),
  })),
}))

const formatHourLabel = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const normalized = hour % 12 === 0 ? 12 : hour % 12
  return `${normalized}${suffix}`
}

export default function TransactionHeatmap() {
  return (
    <div className="w-full rounded-[14px] border border-[#E5E7EB] bg-white p-4">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          <div
            className="mb-2 grid items-end gap-1"
            style={{ gridTemplateColumns: `60px repeat(${hours.length}, 28px)` }}
          >
            <div />
            {hours.map((hour) => (
              <div key={`label-${hour}`} className="text-center text-[10px] text-[#6B7280]">
                {hour % 3 === 0 ? formatHourLabel(hour) : ''}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {heatmapData.map((row) => (
              <div
                key={row.day}
                className="grid items-center gap-1"
                style={{ gridTemplateColumns: `60px repeat(${hours.length}, 28px)` }}
              >
                <div className="pr-2 text-xs font-medium text-[#6B7280]">{row.day}</div>
                {row.values.map((cell) => (
                  <div
                    key={`${row.day}-${cell.hour}`}
                    className="h-7 w-7 rounded-[6px]"
                    style={{ backgroundColor: `rgba(124,58,237,${cell.intensity.toFixed(2)})` }}
                    title={`${row.day} ${formatHourLabel(cell.hour)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
