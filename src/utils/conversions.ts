export const toBase64 = (file: File) =>
    new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
    })

export const VERIFICATION_STATUS_DICT = {
    processing: "Vyžaduje overenie",
    redo: "Vyžaduje opätovné overenie",
    verified: "Overený",
    prohibited: "Zamietnutý"
}
