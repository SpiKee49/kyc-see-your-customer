export function validateBirthNumber(birthNumber: string) {
    const length = birthNumber.length
    const year = Number(birthNumber.substring(0, 2))
    const month = Number(birthNumber.substring(2, 4))
    const day = Number(birthNumber.substring(4, 6))
    const firstThreeDigitsOfSufix = Number(
        birthNumber.substring(6, birthNumber.length - 1)
    )
    const lastDigit = Number(birthNumber.substring(birthNumber.length - 1))

    console.log({
        length,
        year,
        month,
        day,
        firstThreeDigitsOfSufix,
        lastDigit
    })

    // birthNumber shorter than 9 characters
    if (length < 9) {
        console.log("birthNumber shorter than 9 characters")
        return false
    }

    // if birthNumber is length of 9, the year can't be greater than 1953, SOURCE: https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/1995/301/ §2 point 4.
    if (length === 9 && year > 53) {
        console.log("if birthNumber is length of 9, the year can't")
        return false
    }

    // check if month has valid value, females have month number increased by 50
    if (
        month > 50 ? month - 50 < 1 || month - 50 > 12 : month < 1 || month > 12
    ) {
        console.log(
            "check if month has valid value, females have month number increased by 50"
        )
        return false
    }

    if (day > 31 || day < 0) {
        console.log("day not possible")
        return false
    }

    //calculate checksum
    const number = Number(
        [
            year,
            month < 10 ? "0" + month : month,
            day < 10 ? "0" + day : day,
            firstThreeDigitsOfSufix
        ].join("")
    )
    if (length === 9 && number % 11 === 0) {
        console.log("is 9 but not mod 11")
        return true
    }
    if (number % 11 === 10 && lastDigit === 0) {
        console.log("is default true")
        return true
    }
    if (number % 11 === lastDigit) {
        console.log("number % 11 === lastDigit")
        return true
    }

    //checksum didn't meet the validation conditions

    console.log("tesrt")
    return false
}
