export const WEB3FORM_ACCESS_KEY = assertValue(
  process.env.NEXT_PUBLIC_WEB3FORM_ACCESS_KEY,
  'Missing environment variable: NEXT_PUBLIC_WEB3FORM_ACCESS_KEY'
)

export const PROJECT_NAME = assertValue(
  process.env.NEXT_PROJECT_NAME,
  'Missing environment variable: NEXT_PROJECT_NAME'
)

export const useCdn = false

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
