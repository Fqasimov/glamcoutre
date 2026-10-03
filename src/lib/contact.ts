// The atelier's WhatsApp number in international format, digits only (e.g. "994501234567").
// While empty, WhatsApp links open the share sheet with the message pre-filled.
export const WHATSAPP_NUMBER = ''

export const INSTAGRAM_HANDLE = 'glamlove_couture'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message)
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}` : `https://wa.me/?text=${text}`
}

export const GENERAL_ENQUIRY = 'Hello Glamlove, I would like to book a consultation for a gown.'
