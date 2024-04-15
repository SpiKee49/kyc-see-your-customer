interface StoreType {
  birthNumber: number | null
  personalInformation: {
    firstName: string
    lastName: string
    address: {
      streetName?: string
      number: string
      city: string
      zip: string
    }
  } | null
  documentInformation: {
    imageUrl: string
  } | null
}
interface GlobalContextType {
  store: StoreType
  updateStore: (value: StoreType) => void
}
