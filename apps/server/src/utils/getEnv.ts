/**
 * Retrieves the value of an environment variable by its key.
 *
 * @param key - The name of the environment variable to retrieve.
 * @param defaultValue - The default value to return if the environment variable is not set.
 *                        Defaults to an empty string.
 * @returns The value of the environment variable if it is set, or the default value if provided.
 * @throws Will throw an error if the environment variable is not set and no default value is provided.
 */

export function getEnv(key: string, defaultValue: string = ''): string {
  const value: string | undefined = process.env[key];

  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }

    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}
