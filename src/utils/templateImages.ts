const TEMPLATE_IMAGES: Record<string, string> = {
  'leg day': '/images/templates/leg-day.png',
  'upper body': '/images/templates/upper-body.png',
  'upper body day': '/images/templates/upper-body.png',
  'arm day': '/images/templates/upper-body.png',
}

export function getTemplateImage(name: string): string | null {
  return TEMPLATE_IMAGES[name.toLowerCase().trim()] ?? null
}
