export interface SaveFileConfig {
  path: string;
  enabled: boolean;
}

export const default_save_file_config: SaveFileConfig = {
  path: "./output/contracts.json",
  enabled: true,
};
