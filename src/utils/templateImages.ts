const TEMPLATE_IMAGES: Record<string, string> = {
  'leg day': '/images/templates/leg-day.png',
}

export function getTemplateImage(name: string): string | null {
  return TEMPLATE_IMAGES[name.toLowerCase().trim()] ?? null
}
