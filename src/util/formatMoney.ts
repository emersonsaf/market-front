export function formatCurrency(value: Number) {
    const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return formattedValue;
}
