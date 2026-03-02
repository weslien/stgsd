function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value;
}

export function outputSuccess(
  data: unknown,
  opts: { json: boolean },
  humanFormatter?: (data: unknown) => string,
): void {
  if (opts.json) {
    console.log(JSON.stringify({ ok: true, data }, bigintReplacer));
  } else if (humanFormatter) {
    console.log(humanFormatter(data));
  } else {
    console.log(JSON.stringify(data, bigintReplacer, 2));
  }
}

export function outputError(
  code: string,
  message: string,
  opts: { json: boolean },
): void {
  if (opts.json) {
    console.log(JSON.stringify({ ok: false, error: { code, message } }));
  } else {
    console.error(`Error: ${message}`);
  }
  process.exit(1);
}
