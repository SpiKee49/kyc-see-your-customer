export function birthNumberMatches(birthNumber: string, dateOfBirth: string) {
    const year = Number(birthNumber.substring(0, 2))
    const month = Number(birthNumber.substring(2, 4))
    const day = Number(birthNumber.substring(4, 6))
    const birthDate = [
        day,
        month > 50
            ? month - 50 < 10
                ? `0${month - 50}`
                : month
            : month < 10
            ? `0${month - 50}`
            : month,
        birthNumber.length === 9 || (year >= 53 && year <= 99)
            ? `19${year < 10 ? `0${year}` : year}`
            : `20${year < 10 ? `0${year}` : year}`
    ].join(".")

    return birthDate.includes(dateOfBirth)
}
