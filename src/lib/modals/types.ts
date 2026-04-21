// ─── Modal type union ────────────────────────────────────────────────────────
// Add every modal key here. TypeScript will catch unregistered keys everywhere.
export type ModalType = 'close' | 'positionDetails'

// ─── Params passed through the URL ───────────────────────────────────────────
export type ModalParams = {
    id?: string
    [key: string]: unknown
}

// ─── A single entry in the modal stack ───────────────────────────────────────
export type ModalEntry = {
    type: ModalType
    params: ModalParams
}