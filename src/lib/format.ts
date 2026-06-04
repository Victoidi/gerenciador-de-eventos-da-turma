const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short"
});

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "";
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export function toDateTimeLocalValue(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function summarizeText(value: string, maxLength = 170) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}
