import { useToast } from 'primevue/usetoast'

export type AppToastSeverity = 'success' | 'info' | 'warn' | 'error'

export function useAppToast() {
  const toast = useToast()

  function show(severity: AppToastSeverity, summary: string, detail?: string) {
    toast.add({
      severity,
      summary,
      detail,
      life: severity === 'error' ? 6000 : 4000,
    })
  }

  return {
    success: (summary: string, detail?: string) => show('success', summary, detail),
    info: (summary: string, detail?: string) => show('info', summary, detail),
    warn: (summary: string, detail?: string) => show('warn', summary, detail),
    error: (summary: string, detail?: string) => show('error', summary, detail),
  }
}
