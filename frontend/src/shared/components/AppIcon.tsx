import type { SVGProps } from 'react'

export type AppIconName =
  | 'today'
  | 'upcoming'
  | 'all'
  | 'completed'
  | 'search'
  | 'plus'
  | 'logout'
  | 'edit'
  | 'delete'
  | 'close'
  | 'sparkle'

const iconPaths: Record<AppIconName, string> = {
  today: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  upcoming: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  all: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  completed: 'm5 12 4 4L19 6',
  search: 'm20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  plus: 'M12 5v14m-7-7h14',
  logout: 'M10 17l5-5-5-5m5 5H3m9-9h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z',
  delete: 'M3 6h18m-2 0-.9 14H5.9L5 6m3 0V4h8v2m-7 4v6m4-6v6',
  close: 'M18 6 6 18M6 6l12 12',
  sparkle: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z',
}

interface AppIconProps extends SVGProps<SVGSVGElement> {
  name: AppIconName
}

export function AppIcon({ name, ...props }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d={iconPaths[name]} />
    </svg>
  )
}
