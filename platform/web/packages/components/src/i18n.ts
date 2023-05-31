import { useI18n } from "@smartb/g2-providers";

export interface Languages {
  en: string;
  fr: string
}

export const languages: Languages = {
  en: "en-US",
  fr: "fr-FR"
};

export const useExtendedI18n = () => {
  return useI18n<Languages>();
};
