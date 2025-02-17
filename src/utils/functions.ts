import moment from "moment";

export function formatCurrencyBRL(value: string): string {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    return formattedValue;
}

export function parseCurrencyBRL(value: string): number {
    const numericValue = value.replace(/[^\d,-]/g, "").replace(",", ".");
    return parseFloat(numericValue);
}

export function formatCPF(value: string): string {
    const numericValue = value.replace(/\D/g, "").slice(0, 11);
    return numericValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function parseCPF(value: string): string {
    return value.replace(/\D/g, "").slice(0, 11);
}

export const formateDate = (data: string): string => {
    const timestamp = Number(data);
    return moment(timestamp).format("DD/MM/YYYY");
};

export const formateDateToTimestamp = (data: Date | null): number => {
    const date = moment(data, "DD/MM/YYYY").toDate();
    return date.getTime();
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
  };


