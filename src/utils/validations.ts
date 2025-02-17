export interface ValidationResult {
    name: boolean;
    email: boolean;
    password: boolean;
    cpf: boolean;
}

export function validateForm(name: string, email: string, password: string, cpf: string): ValidationResult {
    const nameIsValid = name.length >= 3;
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordIsValid = password.length >= 6;
    let cpfIsValid = false;
    if (cpf === "supplier") {
        cpfIsValid = true;
    } else {
        cpfIsValid = cpf.replace(/\D/g, "").length === 11;
    }

    return {
        name: nameIsValid,
        email: emailIsValid,
        password: passwordIsValid,
        cpf: cpfIsValid,
    };
}
