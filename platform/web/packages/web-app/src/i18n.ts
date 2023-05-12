import { useI18n } from "@smartb/g2-providers";

export interface Languages {
  fr: string;
}

export const languages: Languages = {
  fr: "fr-FR",
};

export const useExtendedI18n = () => {
  return useI18n<Languages>();
};
